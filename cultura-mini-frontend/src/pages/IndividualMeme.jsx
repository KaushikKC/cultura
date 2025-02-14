import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { toast } from "react-hot-toast";

const API_BASE_URL = "https://cultura-e6o8.vercel.app/api";

const MemeCardIndividual = () => {
  const { ipId } = useParams();
  const navigate = useNavigate();
  const [memeData, setMemeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shareStats, setShareStats] = useState({ clicks: 0, views: 0 });

  // Get the current page URL
  const currentUrl = window.location.href;

  const handleBackClick = () => {
    navigate("/marketplace");
  };
  const [stats, setStats] = useState({
    views: 0,
    clicks: 0,
    shares: {
      total: 0,
      byPlatform: {},
    },
  });

  // Enhanced tracking function
  const trackEvent = async (eventType, platform = null) => {
    try {
      const payload = {
        ipId,
        url: currentUrl,
        timestamp: new Date().toISOString(),
        ...(platform && { platform }),
      };

      const response = await fetch(`${API_BASE_URL}/track-${eventType}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to track ${eventType}`);
      }

      // Refresh stats after tracking
      fetchStats();
    } catch (err) {
      console.error(`Error tracking ${eventType}:`, err);
      toast.error(`Failed to track ${eventType}`);
    }
  };

  // Enhanced share handling
  const handleTwitterShare = async () => {
    try {
      await trackEvent("share", "twitter");
      const shareText = `Check out this awesome meme!`;
      const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        currentUrl
      )}&text=${encodeURIComponent(shareText)}`;
      window.open(shareUrl, "_blank");
      toast.success("Opening Twitter share dialog");
    } catch (err) {
      console.error("Error sharing to Twitter:", err);
      toast.error("Failed to share to Twitter");
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      await trackEvent("share", "copy");
      toast.success("Link copied to clipboard!");
    } catch (err) {
      console.error("Error copying link:", err);
      toast.error("Failed to copy link");
    }
  };

  // Enhanced stats fetching
  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/share-stats/${ipId}`);
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  useEffect(() => {
    const fetchMemeData = async () => {
      try {
        const url = `https://api.storyapis.com/api/v3/assets/${ipId}`;
        const options = {
          method: "GET",
          headers: {
            accept: "application/json",
            "X-Api-Key": "MhBsxkU1z9fG6TofE59KqiiWV-YlYE8Q4awlLQehF3U",
            "X-Chain": "story-aeneid",
          },
        };

        const response = await fetch(url, options);
        const json = await response.json();
        setMemeData(json.data);
        setLoading(false);

        // Track page view
        await trackEvent("view");
        // Fetch initial share stats
        fetchStats();
      } catch (err) {
        console.error("Error fetching meme data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMemeData();
  }, [ipId, currentUrl]);

  if (loading) {
    return (
      <div className="bg-[#412E2A] min-h-screen">
        <Navbar />
        <div className="bg-[#D9D9D9] text-[#3E2723] min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3E2723]"></div>
            <p className="mt-4">Loading meme details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#412E2A] min-h-screen">
        <Navbar />
        <div className="bg-[#D9D9D9] text-[#3E2723] min-h-screen flex items-center justify-center">
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!memeData) return null;

  const StatsDisplay = () => (
    <div className="mt-6 p-4 bg-[#F5F5F5] rounded-lg">
      <h3 className="font-bold text-[#3E2723] mb-3">Engagement Stats</h3>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold text-[#3E2723]">{stats.views}</p>
          <p className="text-sm text-gray-600">Views</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-[#3E2723]">{stats.clicks}</p>
          <p className="text-sm text-gray-600">Clicks</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-[#3E2723]">
            {stats.shares.total}
          </p>
          <p className="text-sm text-gray-600">Shares</p>
        </div>
      </div>
      {Object.keys(stats.shares.byPlatform).length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-semibold text-[#3E2723]">
            Shares by Platform:
          </p>
          <div className="flex gap-4 mt-2">
            {Object.entries(stats.shares.byPlatform).map(
              ([platform, count]) => (
                <div key={platform} className="text-sm">
                  <span className="capitalize">{platform}</span>: {count}
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-[#412E2A] min-h-screen">
      <Navbar />
      <div className="bg-[#D9D9D9] min-h-screen p-8">
        <button
          onClick={handleBackClick}
          className="mb-8 text-[#3E2723] hover:text-[#5E4744] transition-colors"
        >
          ← Back to Gallery
        </button>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Meme Display */}
            <div className="bg-[#D1B29A] p-6 rounded-xl border-2 border-[#3E2723]">
              <img
                src={memeData.nftMetadata?.imageUrl}
                alt={memeData.nftMetadata?.name}
                className="w-full rounded-lg"
              />
              <h1 className="text-[#3E2723] font-gloock text-3xl mt-4">
                {memeData.nftMetadata?.name.replace("1315: ", "")}
              </h1>
            </div>

            {/* Right Column - Meme Details */}
            <div className="bg-white p-6 rounded-xl border-2 border-[#3E2723]">
              <h2 className="text-2xl font-bold text-[#3E2723] mb-6">
                Meme Details
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-[#3E2723]">IP ID</h3>
                  <p className="text-gray-700 break-all">{memeData.ipId}</p>
                </div>

                <div>
                  <h3 className="font-bold text-[#3E2723]">Token ID</h3>
                  <p className="text-gray-700">
                    {memeData.nftMetadata?.tokenId}
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-[#3E2723]">Token Contract</h3>
                  <p className="text-gray-700 break-all">
                    {memeData.nftMetadata?.tokenContract}
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-[#3E2723]">Token URI</h3>
                  <p className="text-gray-700 break-all">
                    {memeData.nftMetadata?.tokenUri}
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-[#3E2723]">
                    Blockchain Details
                  </h3>
                  <div className="ml-4">
                    <p className="text-gray-700">
                      Chain ID: {memeData.nftMetadata?.chainId}
                    </p>
                    <p className="text-gray-700">
                      Block Number: {memeData.blockNumber}
                    </p>
                    <p className="text-gray-700">
                      Timestamp:{" "}
                      {new Date(
                        parseInt(memeData.blockTimestamp) * 1000
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-[#3E2723]">Transaction Hash</h3>
                  <p className="text-gray-700 break-all">
                    {memeData.transactionHash}
                  </p>
                </div>
              </div>

              <StatsDisplay />

              <div className="mt-8 flex justify-center space-x-4">
                <button
                  onClick={handleTwitterShare}
                  className="bg-[#3E2723] text-white px-6 py-2 rounded-lg hover:bg-[#5E4744] transition-colors"
                >
                  Share on X
                </button>
                <button
                  onClick={handleCopyLink}
                  className="bg-[#3E2723] text-white px-6 py-2 rounded-lg hover:bg-[#5E4744] transition-colors"
                >
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MemeCardIndividual;
