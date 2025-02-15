import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Play, PauseCircle, Settings, Bot, Timer } from "lucide-react";
import { toast } from "react-hot-toast";

const API_BASE_URL = "https://cultura-e6o8.vercel.app/api";
const CHECK_INTERVAL = 60; // 1 minute in seconds

function AgentDetails() {
  const { id } = useParams();
  const [memeIds, setMemeIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [agentData, setAgentData] = useState(null);
  const [isAgentActive, setIsAgentActive] = useState(false);
  const [monitoringStats, setMonitoringStats] = useState({});
  const [countdown, setCountdown] = useState(CHECK_INTERVAL);
  const [transactions, setTransactions] = useState([]);
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
      console.log("🔍 Found memes to monitor:", ids);
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

  // Find meme with highest engagement
  const findHighestEngagement = (stats) => {
    let highestEngagement = 0;
    let highestIpId = null;

    Object.entries(stats).forEach(([ipId, stat]) => {
      if (!stat) return;
      const totalEngagement = (stat.views || 0) + (stat.shares?.total || 0);
      if (totalEngagement > highestEngagement) {
        highestEngagement = totalEngagement;
        highestIpId = ipId;
      }
    });

    return { ipId: highestIpId, engagement: highestEngagement };
  };

  // License a specific meme
  const licenseMeme = async (ipId, stats) => {
    try {
      console.log(`🎯 Licensing meme with highest engagement:`, {
        ipId,
        stats: stats[ipId],
        totalEngagement:
          (stats[ipId]?.views || 0) + (stats[ipId]?.shares?.total || 0),
      });

      toast.success(
        `Found highest engaging meme: ${ipId}\nViews: ${
          stats[ipId]?.views || 0
        }\nShares: ${stats[ipId]?.shares?.total || 0}`,
        { duration: 5000 }
      );
    } catch (error) {
      console.error(`Error licensing meme ${ipId}:`, error);
      toast.error(`Failed to license meme ${ipId}`);
    }
  };

  // Main monitoring function
  const monitorMemes = async () => {
    if (!isAgentActive) return;

    console.log("🤖 Starting monitoring cycle...");
    const ids = await fetchMemeIds();
    console.log(`Found ${ids.length} memes to monitor`);

    const newStats = {};

    // Check all memes
    for (const ipId of ids) {
      console.log(`\n👀 Checking meme ${ipId}...`);
      const stats = await fetchMemeStats(ipId);
      newStats[ipId] = stats;
    }

    setMonitoringStats(newStats);

    // Find and license the meme with highest engagement
    const { ipId, engagement } = findHighestEngagement(newStats);
    if (ipId && engagement > 0) {
      await licenseMeme(ipId, newStats);
    }

    setCurrentlyMonitoring("");
    console.log("✅ Cycle complete - waiting 1 minute before next check");
  };

  // Toggle agent state
  const toggleAgent = async () => {
    if (isAgentActive) {
      setIsAgentActive(false);
      setCurrentlyMonitoring("");
      setCountdown(CHECK_INTERVAL);
      toast.success("Agent monitoring stopped");
    } else {
      setIsAgentActive(true);
      toast.success("Agent monitoring started");
      await monitorMemes();
    }
  };

  // Countdown effect
  useEffect(() => {
    let timer;
    if (isAgentActive) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            monitorMemes();
            return CHECK_INTERVAL;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isAgentActive]);

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
        {/* Main Content - Col span 2 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Agent Status Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
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

              <div className="flex items-center space-x-4">
                {isAgentActive && (
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-full">
                      <Timer className="text-blue-500" size={16} />
                      <span className="text-blue-700 font-medium">
                        {Math.floor(countdown / 60)}:
                        {(countdown % 60).toString().padStart(2, "0")}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full">
                      <Bot className="text-green-500 animate-pulse" size={16} />
                      <span className="text-green-700 font-medium">Active</span>
                    </div>
                  </div>
                )}
                <button
                  onClick={toggleAgent}
                  className={`flex items-center px-6 py-3 rounded-lg transition-colors ${
                    isAgentActive
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-500 hover:bg-green-600"
                  } text-white font-medium`}
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
                      <p className="text-sm text-gray-500">Total Engagement</p>
                      <p className="text-xl font-bold text-blue-600">
                        {(stats?.views || 0) + (stats?.shares?.total || 0)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
            <div className="space-y-4">
              {transactions.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No transactions yet
                </p>
              ) : (
                transactions.map((tx, index) => (
                  <div key={index} className="border-b pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">
                          Meme: {tx.memeId.slice(0, 6)}...{tx.memeId.slice(-4)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(tx.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {tx.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Monitoring Status */}
        <div className="bg-white rounded-xl shadow-lg p-6 h-fit">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Monitoring Status</h2>
            <Settings size={20} className="text-gray-500" />
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">
                Currently Monitoring:
              </p>
              <p className="font-medium">
                {currentlyMonitoring ? (
                  <>
                    Meme: {currentlyMonitoring.slice(0, 6)}...
                    {currentlyMonitoring.slice(-4)}
                  </>
                ) : (
                  "Waiting for next cycle..."
                )}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Check Interval:</p>
              <p className="font-medium">Every 60 seconds</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Total Memes Tracked:</p>
              <p className="font-medium">{memeIds.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgentDetails;
