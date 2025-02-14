// config/db.js
const mongoose = require("mongoose");
require("dotenv").config();

// MongoDB connection options
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

// MongoDB connection with retry logic
const connectDB = async () => {
  let retries = 5;

  while (retries) {
    try {
      const conn = await mongoose.connect(
        "mongodb+srv://madhuvarsha:madhu1234@cluster0.jqjbs.mongodb.net/",
        mongoOptions
      );
      console.log(`MongoDB Connected: ${conn.connection.host}`);

      // Handle connection events
      mongoose.connection.on("error", (err) => {
        console.error("MongoDB connection error:", err);
      });

      mongoose.connection.on("disconnected", () => {
        console.warn("MongoDB disconnected. Attempting to reconnect...");
      });

      mongoose.connection.on("reconnected", () => {
        console.log("MongoDB reconnected");
      });

      break;
    } catch (error) {
      retries -= 1;
      console.error(
        `MongoDB connection attempt failed. Retries left: ${retries}`
      );
      console.error("Error details:", error.message);

      if (retries === 0) {
        console.error("Failed to connect to MongoDB. Exiting application...");
        process.exit(1);
      }

      // Wait for 5 seconds before retrying
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
};

module.exports = connectDB;
