const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const connectDB = require("../config/db");

// Define MongoDB Schema for tracking
const TrackingSchema = new mongoose.Schema({
  ipId: { type: String, required: true },
  eventType: { type: String, required: true }, // 'view', 'click', 'share'
  platform: { type: String }, // 'twitter', 'copy', etc.
  timestamp: { type: Date, default: Date.now },
  url: { type: String },
  userAgent: { type: String },
  ipAddress: { type: String },
  referrer: { type: String },
  deviceType: { type: String },
});

// Define MongoDB Schema for user tracking
const UserTrackingSchema = new mongoose.Schema({
  userAddress: {
    type: String,
    required: true,
    index: true, // Add index for better query performance
  },
  ipIds: [
    {
      type: String,
      required: true,
    },
  ],
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  totalInteractions: {
    type: Number,
    default: 0,
  },
});

const UserAISchema = new mongoose.Schema({
  userAddress: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  hasAIAgent: {
    type: Boolean,
    default: false,
  },
  ipIds: [
    {
      type: String,
    },
  ],
  aiAgentActivatedAt: {
    type: Date,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  metadata: {
    aiAgentType: String,
    aiAgentVersion: String,
    preferences: mongoose.Schema.Types.Mixed,
  },
});

connectDB();

const Tracking = mongoose.model("Tracking", TrackingSchema);
const UserAI = mongoose.model("UserAI", UserAISchema);

// Tracking middleware to extract client info
const trackingMiddleware = (req, res, next) => {
  req.clientInfo = {
    userAgent: req.headers["user-agent"],
    ipAddress: req.ip || req.connection.remoteAddress,
    referrer: req.headers.referer || req.headers.referrer,
    deviceType: req.headers["user-agent"]
      ? req.headers["user-agent"].includes("Mobile")
        ? "mobile"
        : "desktop"
      : "unknown",
  };
  next();
};

// Track views
router.post("/track-view", trackingMiddleware, async (req, res) => {
  try {
    const { ipId, url } = req.body;
    const tracking = new Tracking({
      ipId,
      eventType: "view",
      url,
      ...req.clientInfo,
    });
    await tracking.save();
    res.json({ success: true });
  } catch (error) {
    console.error("Error tracking view:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Track shares
router.post("/track-share", trackingMiddleware, async (req, res) => {
  try {
    const { ipId, url, platform } = req.body;
    const tracking = new Tracking({
      ipId,
      eventType: "share",
      platform,
      url,
      ...req.clientInfo,
    });
    await tracking.save();
    res.json({ success: true });
  } catch (error) {
    console.error("Error tracking share:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Track clicks
router.post("/track-click", trackingMiddleware, async (req, res) => {
  try {
    const { ipId, url } = req.body;
    const tracking = new Tracking({
      ipId,
      eventType: "click",
      url,
      ...req.clientInfo,
    });
    await tracking.save();
    res.json({ success: true });
  } catch (error) {
    console.error("Error tracking click:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get tracking stats
router.get("/share-stats/:ipId", async (req, res) => {
  try {
    const { ipId } = req.params;

    const stats = await Tracking.aggregate([
      { $match: { ipId } },
      {
        $group: {
          _id: "$eventType",
          count: { $sum: 1 },
          platforms: {
            $push: {
              $cond: [{ $eq: ["$eventType", "share"] }, "$platform", null],
            },
          },
        },
      },
    ]);

    const formattedStats = {
      views: 0,
      clicks: 0,
      shares: {
        total: 0,
        byPlatform: {},
      },
    };

    stats.forEach((stat) => {
      if (stat._id === "view") formattedStats.views = stat.count;
      if (stat._id === "click") formattedStats.clicks = stat.count;
      if (stat._id === "share") {
        formattedStats.shares.total = stat.count;
        // Count shares by platform
        stat.platforms.forEach((platform) => {
          if (platform) {
            formattedStats.shares.byPlatform[platform] =
              (formattedStats.shares.byPlatform[platform] || 0) + 1;
          }
        });
      }
    });

    res.json({ success: true, stats: formattedStats });
  } catch (error) {
    console.error("Error getting share stats:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST endpoint to add/update user's IPIDs
router.post("/user-tracking", async (req, res) => {
  try {
    const { userAddress, ipId } = req.body;

    if (!userAddress || !ipId) {
      return res.status(400).json({
        success: false,
        error: "userAddress and ipId are required",
      });
    }

    // Find existing record or create new one
    const userTrack = await UserTracking.findOne({ userAddress });

    if (userTrack) {
      // Check if ipId already exists
      if (!userTrack.ipIds.includes(ipId)) {
        userTrack.ipIds.push(ipId);
        userTrack.totalInteractions += 1;
        userTrack.lastUpdated = new Date();
        await userTrack.save();
      }
    } else {
      // Create new tracking record
      await UserTracking.create({
        userAddress,
        ipIds: [ipId],
        totalInteractions: 1,
      });
    }

    res.json({
      success: true,
      message: "User tracking updated successfully",
    });
  } catch (error) {
    console.error("Error in user tracking:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET endpoint to retrieve user's IPIDs
router.get("/user-tracking/:userAddress", async (req, res) => {
  try {
    const { userAddress } = req.params;

    if (!userAddress) {
      return res.status(400).json({
        success: false,
        error: "userAddress is required",
      });
    }

    const userTrack = await UserTracking.findOne({ userAddress });

    if (!userTrack) {
      return res.status(404).json({
        success: false,
        error: "No tracking data found for this user",
      });
    }

    res.json({
      success: true,
      data: {
        userAddress: userTrack.userAddress,
        ipIds: userTrack.ipIds,
        totalInteractions: userTrack.totalInteractions,
        lastUpdated: userTrack.lastUpdated,
      },
    });
  } catch (error) {
    console.error("Error fetching user tracking:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET endpoint to retrieve all users with their IPIDs
router.get("/user-tracking", async (req, res) => {
  try {
    const userTracks = await UserTracking.find({})
      .sort({ lastUpdated: -1 })
      .limit(100); // Limit to prevent large response payloads

    res.json({
      success: true,
      data: userTracks.map((track) => ({
        userAddress: track.userAddress,
        ipIds: track.ipIds,
        totalInteractions: track.totalInteractions,
        lastUpdated: track.lastUpdated,
      })),
    });
  } catch (error) {
    console.error("Error fetching all user tracking:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.post("/user-ai", async (req, res) => {
  try {
    const { userAddress, hasAIAgent, ipId, metadata } = req.body;

    if (!userAddress) {
      return res.status(400).json({
        success: false,
        error: "userAddress is required",
      });
    }

    const updateData = {
      lastUpdated: new Date(),
    };

    if (hasAIAgent !== undefined) {
      updateData.hasAIAgent = hasAIAgent;
      if (hasAIAgent) {
        updateData.aiAgentActivatedAt = new Date();
      }
    }

    if (metadata) {
      updateData.metadata = metadata;
    }

    const userAI = await UserAI.findOne({ userAddress });

    if (userAI) {
      // Update existing record
      if (ipId && !userAI.ipIds.includes(ipId)) {
        updateData.$push = { ipIds: ipId };
      }

      await UserAI.findOneAndUpdate({ userAddress }, updateData, { new: true });
    } else {
      // Create new record
      await UserAI.create({
        userAddress,
        hasAIAgent: hasAIAgent || false,
        ipIds: ipId ? [ipId] : [],
        ...updateData,
      });
    }

    res.json({
      success: true,
      message: "User AI agent status updated successfully",
    });
  } catch (error) {
    console.error("Error updating user AI agent status:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET endpoint to retrieve user AI agent status
router.get("/user-ai/:userAddress", async (req, res) => {
  try {
    const { userAddress } = req.params;

    if (!userAddress) {
      return res.status(400).json({
        success: false,
        error: "userAddress is required",
      });
    }

    const userAI = await UserAI.findOne({ userAddress });

    if (!userAI) {
      return res.status(404).json({
        success: false,
        error: "No AI agent data found for this user",
      });
    }

    res.json({
      success: true,
      data: {
        userAddress: userAI.userAddress,
        hasAIAgent: userAI.hasAIAgent,
        ipIds: userAI.ipIds,
        aiAgentActivatedAt: userAI.aiAgentActivatedAt,
        lastUpdated: userAI.lastUpdated,
        metadata: userAI.metadata,
      },
    });
  } catch (error) {
    console.error("Error fetching user AI agent status:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
