import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const MemeCardProfile = ({
  topic,
  imageUrl,
  isDerived,
  ipId,
  tokenId,
  tokenUri,
}) => {
  const [showRewardDetails, setShowRewardDetails] = useState(false);
  const [rewardsData, setRewardsData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleCardClick = (e) => {
    if (!e.target.closest("button") && !e.target.closest(".reward-popup")) {
      navigate(`/meme/${ipId}`);
    }
  };

  const fetchRewardsData = async () => {
    setIsLoading(true);
    setError(null);

    const url = "https://api.storyapis.com/api/v3/royalties/payments";
    const options = {
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
            receiverIpId: ipId,
          },
        },
      }),
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      setRewardsData(data);
      setShowRewardDetails(true);
    } catch (err) {
      setError("Failed to fetch rewards data. Please try again later.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaimRewards = (e) => {
    e.stopPropagation();
    fetchRewardsData();
  };

  // Calculate total rewards
  const calculateTotalRewards = () => {
    if (!rewardsData?.data) return 0;
    return rewardsData.data.reduce(
      (total, payment) => total + Number(payment.amount),
      0
    );
  };

  // Get the last claim timestamp
  const getLastClaimTimestamp = () => {
    if (!rewardsData?.data?.length) return null;
    const sortedData = [...rewardsData.data].sort(
      (a, b) => Number(b.blockTimestamp) - Number(a.blockTimestamp)
    );
    return new Date(
      Number(sortedData[0].blockTimestamp) * 1000
    ).toLocaleDateString();
  };

  return (
    <>
      <div
        className="relative w-[400px] h-[550px] bg-[#D1B29A] p-4 rounded-xl border-2 border-[#3E2723] overflow-hidden cursor-pointer"
        style={{ boxShadow: "0.4rem 0.4rem #3E2723" }}
        onClick={handleCardClick}
      >
        {isDerived && (
          <div className="absolute top-2 left-2 bg-[#3E2723] text-white px-3 py-1 text-xs font-bold uppercase rounded-md shadow-md">
            Derived
          </div>
        )}

        <div className="flex flex-col h-full">
          <img src={imageUrl} className="p-5 flex-shrink-0" alt={topic} />
          <div className="flex flex-col flex-grow justify-between">
            <p className="text-[#3E2723] font-gloock text-2xl font-medium">
              {topic.replace("1315: ", "")}
            </p>

            <div className="flex justify-center pb-4">
              <button
                className="relative text-[#3E2723] inline-block font-medium text-[15px] w-fit px-4 py-1 cursor-pointer border-none bg-white hover:text-white transition-colors duration-500
                    before:content-[''] before:absolute before:top-0 before:bottom-0 before:left-0 before:right-full before:bg-[#3E2723] before:opacity-0 before:-z-10 before:transition-all before:duration-500
                    hover:before:right-0 hover:before:opacity-100
                    -skew-x-[21deg] group"
                onClick={handleClaimRewards}
                disabled={isLoading}
              >
                <span className="inline-block skew-x-[21deg]">
                  {isLoading ? "Loading..." : "Claim Rewards"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showRewardDetails && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="reward-popup bg-white p-6 md:p-8 w-[90%] md:w-[500px] rounded-lg shadow-xl text-center relative">
            <h2 className="text-2xl font-bold text-[#3E2723] mb-4">
              Available Rewards
            </h2>

            {error ? (
              <div className="text-red-500 mb-4">{error}</div>
            ) : (
              <div className="text-left mb-4 text-gray-700">
                <p className="mb-2">
                  <strong>NFT ID:</strong> {tokenId}
                </p>
                <p className="mb-2">
                  <strong>Total Earned Rewards:</strong>{" "}
                  {calculateTotalRewards()} WIP
                </p>
                <p className="mb-2">
                  <strong>Last Claim:</strong>{" "}
                  {getLastClaimTimestamp() || "No claims yet"}
                </p>
                <p className="mb-2">
                  <strong>Number of Transactions:</strong>{" "}
                  {rewardsData?.data?.length || 0}
                </p>

                <div className="mt-4">
                  <strong className="block mb-2">Transaction Details:</strong>
                  <div className="max-h-40 overflow-y-auto">
                    {rewardsData?.data?.map((payment, index) => (
                      <div
                        key={payment.id}
                        className="mb-3 p-2 bg-gray-50 rounded"
                      >
                        <p className="text-sm">
                          <strong>Payer IP:</strong> {payment.payerIpId}
                        </p>
                        <p className="text-sm">
                          <strong>Block Number:</strong> {payment.blockNumber}
                        </p>
                        <p className="text-sm">
                          <strong>Token Address:</strong> {payment.token}
                        </p>
                        <p className="text-sm">
                          <strong>Amount:</strong> {payment.amount} WIP
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-center space-x-5 mt-5">
              <button
                onClick={() => setShowRewardDetails(false)}
                className="relative text-white inline-block font-medium text-[15px] w-fit px-4 py-1 cursor-pointer border-none bg-red-500 hover:bg-red-600 transition-colors duration-500
                before:content-[''] before:absolute before:top-0 before:bottom-0 before:left-0 before:right-full before:bg-red-700 before:opacity-0 before:-z-10 before:transition-all before:duration-500
                hover:before:right-0 hover:before:opacity-100
                -skew-x-[21deg] group"
              >
                <span className="inline-block skew-x-[21deg]">Close</span>
              </button>
              {rewardsData?.data?.length > 0 && (
                <button
                  onClick={() => {
                    // Handle claim rewards logic here
                    setShowRewardDetails(false);
                  }}
                  className="relative text-white inline-block font-medium text-[15px] w-fit px-4 py-1 cursor-pointer border-none bg-green-600 hover:bg-green-700 transition-colors duration-500
                  before:content-[''] before:absolute before:top-0 before:bottom-0 before:left-0 before:right-full before:bg-green-800 before:opacity-0 before:-z-10 before:transition-all before:duration-500
                  hover:before:right-0 hover:before:opacity-100
                  -skew-x-[21deg] group"
                >
                  <span className="inline-block skew-x-[21deg]">Claim</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MemeCardProfile;
