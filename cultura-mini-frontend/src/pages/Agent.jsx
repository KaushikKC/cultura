import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Play, PauseCircle, BarChart2, Settings, Bot } from "lucide-react";
import { toast } from "react-hot-toast";

const API_BASE_URL = "https://cultura-e6o8.vercel.app/api";

function AgentDetails() {
  const { id } = useParams();
  const [memeIds, setMemeIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [agentData, setAgentData] = useState(null);
  const [isAgentActive, setIsAgentActive] = useState(false);
  const [monitoringStats, setMonitoringStats] = useState({});
  const [monitoringSettings, setMonitoringSettings] = useState({
    checkFrequency: 1 / 60, // 1 minute converted to hours
    viewThreshold: 2, // Lower threshold for testing
    shareThreshold: 1, // Lower threshold for testing
    autoLicense: true,
  });
  const [monitoringInterval, setMonitoringInterval] = useState(null);
  const [currentlyMonitoring, setCurrentlyMonitoring] = useState("");

  // Fetch all meme IDs from Story Protocol
  const fetchMemeIds = async () => {
    try {
      const response = await fetch("https://api.storyapis.com/api/v3/assets", {
        method: "POST",
        headers: {
          accept: "application/json",
          "X-Api-Key": "MhBsxkU1z9fG6TofE59KqiiWV-YlYE8Q4awlLQehF3U",
          "X-Chain": "story-aeneid",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          options: {
            where: {
              tokenContract: "0x1C7AA3312f8e4dBA6672fAb191AbC007FE01D651",
            },
          },
        }),
      });
      const data = await response.json();
      const ids = data.data.map((item) => item.id);
      setMemeIds(ids);
      return ids;
    } catch (error) {
      console.error("Error fetching meme IDs:", error);
      return [];
    }
  };

  // Fetch stats for a single meme
  const fetchMemeStats = async (ipId) => {
    try {
      setCurrentlyMonitoring(ipId);
      const response = await fetch(`${API_BASE_URL}/share-stats/${ipId}`);
      const data = await response.json();
      if (data.success) {
        return data.stats;
      }
      return null;
    } catch (error) {
      console.error(`Error fetching stats for ${ipId}:`, error);
      return null;
    }
  };

  // License a specific meme
  const licenseMeme = async (ipId) => {
    try {
      console.log("into license meme");
      console.log(ipId, "ipID");
      toast.success(`Licensing meme ${ipId} due to high engagement`);
      const stats = monitoringStats[ipId];
      console.log(`Licensing meme ${ipId} with stats:`, stats);
    } catch (error) {
      console.error(`Error licensing meme ${ipId}:`, error);
      toast.error(`Failed to license meme ${ipId}`);
    }
  };

  // Check if meme meets criteria
  const checkLicensingCriteria = (stats) => {
    if (!stats) return false;
    return (
      stats.views >= monitoringSettings.viewThreshold ||
      stats.shares.total >= monitoringSettings.shareThreshold
    );
  };

  // Main monitoring function
  const monitorMemes = async () => {
    console.log("🤖 Starting monitoring cycle...");
    console.log("Current thresholds:", {
      views: monitoringSettings.viewThreshold,
      shares: monitoringSettings.shareThreshold,
    });
    const ids = await fetchMemeIds();

    const newStats = {};
    for (const ipId of ids) {
      const stats = await fetchMemeStats(ipId);
      newStats[ipId] = stats;

      console.log(`Checking meme ${ipId}:`, stats);
      if (stats && checkLicensingCriteria(stats)) {
        console.log(`🎉 Meme ${ipId} meets criteria:`, stats);
        if (monitoringSettings.autoLicense) {
          await licenseMeme(ipId);
        } else {
          toast.success(
            `Meme ${ipId} is ready for licensing! Views: ${stats.views}, Shares: ${stats.shares.total}`
          );
        }
      }
    }

    setMonitoringStats(newStats);
    setCurrentlyMonitoring("");
  };

  // Toggle agent state
  const toggleAgent = async () => {
    if (isAgentActive) {
      if (monitoringInterval) {
        clearInterval(monitoringInterval);
        setMonitoringInterval(null);
      }
      setIsAgentActive(false);
      setCurrentlyMonitoring("");
      toast.success("Agent monitoring stopped");
    } else {
      await monitorMemes();
      const interval = setInterval(
        monitorMemes,
        1 * 60 * 1000 // Fixed 1 minute interval for testing
      );
      console.log("Agent started - checking every minute");
      setMonitoringInterval(interval);
      setIsAgentActive(true);
      toast.success("Agent monitoring started");
    }
  };

  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const agentResponse = await fetch(
          `https://api.storyapis.com/api/v3/assets/${id}`,
          {
            headers: {
              accept: "application/json",
              "X-Api-Key": "MhBsxkU1z9fG6TofE59KqiiWV-YlYE8Q4awlLQehF3U",
              "X-Chain": "story-aeneid",
            },
          }
        );
        const agentData = await agentResponse.json();
        setAgentData(agentData.data);
        await fetchMemeIds();
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast.error("Failed to fetch agent data");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [id]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (monitoringInterval) {
        clearInterval(monitoringInterval);
      }
    };
  }, [monitoringInterval]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Agent Status Card */}
        <div className="col-span-2 bg-white rounded-xl shadow-lg p-6">
          {/* Agent Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex flex-col space-y-2">
              <h1 className="text-3xl font-bold text-gray-800">AI Agent</h1>
              {agentData && (
                <div className="text-sm text-gray-600">
                  <p>IP ID: {id}</p>
                  <p>Token ID: {agentData.nftMetadata?.tokenId}</p>
                  <p>Contract: {agentData.nftMetadata?.tokenContract}</p>
                </div>
              )}
            </div>

            {/* Agent Status and Control */}
            <div className="flex items-center space-x-4">
              {isAgentActive && (
                <div className="flex items-center space-x-2 bg-green-100 px-3 py-1 rounded-full">
                  <Bot className="text-green-500 animate-pulse" size={20} />
                  <span className="text-green-700 text-sm">
                    {currentlyMonitoring
                      ? `Monitoring ${currentlyMonitoring.slice(
                          0,
                          6
                        )}...${currentlyMonitoring.slice(-4)}`
                      : "Listening..."}
                  </span>
                </div>
              )}
              <button
                onClick={toggleAgent}
                className={`flex items-center px-6 py-3 rounded-lg transition-colors ${
                  isAgentActive
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                } text-white`}
              >
                {isAgentActive ? (
                  <>
                    <PauseCircle className="mr-2" size={20} />
                    Stop Agent
                  </>
                ) : (
                  <>
                    <Play className="mr-2" size={20} />
                    Start Agent
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Meme Stats Display */}
          <div className="mt-6 space-y-4">
            {Object.entries(monitoringStats).map(([ipId, stats]) => (
              <div key={ipId} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">
                  Meme: {ipId.slice(0, 6)}...{ipId.slice(-4)}
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Views</p>
                    <p className="text-xl font-bold">{stats?.views || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Shares</p>
                    <p className="text-xl font-bold">
                      {stats?.shares?.total || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p
                      className={`text-sm ${
                        checkLicensingCriteria(stats)
                          ? "text-green-500"
                          : "text-gray-500"
                      }`}
                    >
                      {checkLicensingCriteria(stats)
                        ? "Ready to License"
                        : "Monitoring"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Settings Card */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Agent Settings</h2>
            <Settings size={20} className="text-gray-500" />
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Check Frequency (hours)
              </label>
              <input
                type="number"
                min="1"
                max="72"
                value={monitoringSettings.checkFrequency}
                onChange={(e) =>
                  setMonitoringSettings({
                    ...monitoringSettings,
                    checkFrequency: parseInt(e.target.value),
                  })
                }
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                View Threshold
              </label>
              <input
                type="number"
                min="1"
                value={monitoringSettings.viewThreshold}
                onChange={(e) =>
                  setMonitoringSettings({
                    ...monitoringSettings,
                    viewThreshold: parseInt(e.target.value),
                  })
                }
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Share Threshold
              </label>
              <input
                type="number"
                min="1"
                value={monitoringSettings.shareThreshold}
                onChange={(e) =>
                  setMonitoringSettings({
                    ...monitoringSettings,
                    shareThreshold: parseInt(e.target.value),
                  })
                }
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Auto-License Memes
              </label>
              <input
                type="checkbox"
                checked={monitoringSettings.autoLicense}
                onChange={(e) =>
                  setMonitoringSettings({
                    ...monitoringSettings,
                    autoLicense: e.target.checked,
                  })
                }
                className="h-4 w-4 text-blue-600"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgentDetails;
