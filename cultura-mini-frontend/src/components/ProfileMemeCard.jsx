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
  const navigate = useNavigate();

  const handleCardClick = (e) => {
    if (!e.target.closest("button") && !e.target.closest(".reward-popup")) {
      navigate(`/meme/${ipId}`);
    }
  };

  const handleClaimRewards = (e) => {
    e.stopPropagation();
    setShowRewardDetails(true);
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

        <img src={imageUrl} className="p-5" alt={topic} />
        <div className="flex flex-col gap-2 h-full text-xl">
          <p className="text-[#3E2723] font-gloock text-2xl font-medium">
            {topic.replace("1315: ", "")}
          </p>

          <div className="flex justify-center mt-auto">
            <button
              className="mt-6 relative text-[#3E2723] inline-block font-medium text-[15px] w-fit px-4 py-1 cursor-pointer border-none bg-white hover:text-white transition-colors duration-500
                  before:content-[''] before:absolute before:top-0 before:bottom-0 before:left-0 before:right-full before:bg-[#3E2723] before:opacity-0 before:-z-10 before:transition-all before:duration-500
                  hover:before:right-0 hover:before:opacity-100
                  -skew-x-[21deg] group"
              onClick={handleClaimRewards}
            >
              <span className="inline-block skew-x-[21deg]">Claim Rewards</span>
            </button>
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

            <div className="text-left mb-4 text-gray-700">
              <p className="mb-2">
                <strong>NFT ID:</strong> {tokenId}
              </p>
              <p className="mb-2">
                <strong>Earned Rewards:</strong> 2.5 WIPT
              </p>
              <p className="mb-2">
                <strong>Last Claim:</strong> 30 days ago
              </p>
            </div>

            <div className="flex justify-center space-x-5 mt-5">
              <button
                onClick={() => setShowRewardDetails(false)}
                className="relative text-white inline-block font-medium text-[15px] w-fit px-4 py-1 cursor-pointer border-none bg-red-500 hover:bg-red-600 transition-colors duration-500
                before:content-[''] before:absolute before:top-0 before:bottom-0 before:left-0 before:right-full before:bg-red-700 before:opacity-0 before:-z-10 before:transition-all before:duration-500
                hover:before:right-0 hover:before:opacity-100
                -skew-x-[21deg] group"
              >
                <span className="inline-block skew-x-[21deg]">Cancel</span>
              </button>
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
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MemeCardProfile;
