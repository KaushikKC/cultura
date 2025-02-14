import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Play, PauseCircle, BarChart2, Zap, History } from "lucide-react";

function AgentDetails() {
  const { id } = useParams();
  const [agentData, setAgentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAgentActive, setIsAgentActive] = useState(false);

  useEffect(() => {
    const fetchAgentData = async () => {
      try {
        const response = await fetch(
          `https://api.storyapis.com/api/v3/assets/${id}`,
          {
            headers: {
              accept: "application/json",
              "X-Api-Key": "MhBsxkU1z9fG6TofE59KqiiWV-YlYE8Q4awlLQehF3U",
              "X-Chain": "story-aeneid",
            },
          }
        );
        const data = await response.json();
        setAgentData(data.data);
      } catch (error) {
        console.error("Error fetching agent data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgentData();
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
        {/* Agent Overview Card */}
        <div className="col-span-2 bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              {agentData?.nftMetadata?.name || "Cultura AI Agent"}
            </h1>
            <button
              onClick={() => setIsAgentActive(!isAgentActive)}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <BarChart2 className="text-blue-500 mr-2" size={20} />
                <h3 className="font-semibold">Engagement</h3>
              </div>
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-gray-500">Tracked Memes</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Zap className="text-yellow-500 mr-2" size={20} />
                <h3 className="font-semibold">Active Licenses</h3>
              </div>
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-gray-500">Generated Revenue</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <History className="text-purple-500 mr-2" size={20} />
                <h3 className="font-semibold">History</h3>
              </div>
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-gray-500">Total Actions</p>
            </div>
          </div>

          {/* Agent Activity Feed */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-gray-500">No activity yet</p>
              <p className="text-sm mt-2">
                Your agent will start tracking meme engagement once activated
              </p>
            </div>
          </div>
        </div>

        {/* Agent Settings Card */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Agent Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Engagement Threshold
              </label>
              <input
                type="range"
                min="0"
                max="100"
                className="w-full"
                defaultValue="50"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Automatic Licensing
              </label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600"
                  defaultChecked
                />
                <span className="ml-2 text-sm text-gray-600">
                  Enable automatic licensing for trending memes
                </span>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                NFT Details
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  Token ID: {agentData?.nftMetadata?.tokenId || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  Contract:{" "}
                  {agentData?.nftMetadata?.tokenContract
                    ? `${agentData.nftMetadata.tokenContract.slice(
                        0,
                        6
                      )}...${agentData.nftMetadata.tokenContract.slice(-4)}`
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgentDetails;
