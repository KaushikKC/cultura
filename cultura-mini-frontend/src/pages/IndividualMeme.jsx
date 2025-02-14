import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MemeCardIndividual = () => {
  const { ipId } = useParams();
  const navigate = useNavigate();
  const [memeData, setMemeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleBackClick = () => {
    navigate("/marketplace");
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
        console.log("Individual Meme Data:", json);
        setMemeData(json.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching meme data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMemeData();
  }, [ipId]);

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

              <div className="mt-8 flex justify-center space-x-4">
                <button className="bg-[#3E2723] text-white px-6 py-2 rounded-lg hover:bg-[#5E4744] transition-colors">
                  Share on X
                </button>
                <button className="bg-[#3E2723] text-white px-6 py-2 rounded-lg hover:bg-[#5E4744] transition-colors">
                  Share on Farcaster
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
