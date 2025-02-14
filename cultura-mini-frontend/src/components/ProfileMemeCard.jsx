import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { WIP_TOKEN_ADDRESS } from "@story-protocol/core-sdk";
import { client } from "../utils/utils";

const MemeCardProfile = ({
  topic,
  imageUrl,
  isDerived,
  ipId,
  tokenId,
  tokenUri,
}) => {
  const [showRewardDetails, setShowRewardDetails] = useState(false);
  const [showClaimConfirmation, setShowClaimConfirmation] = useState(false);
  const [rewardsData, setRewardsData] = useState(null);
  const [claimResult, setClaimResult] = useState(null);
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

  const handleClaimConfirmation = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get unique childIpIds from the rewards data
      const childIpIds = [
        ...new Set(rewardsData.data.map((payment) => payment.payerIpId)),
      ];

      // Validate parameters before making the call
      if (!window.ethereum?.selectedAddress) {
        throw new Error("Wallet not connected");
      }

      if (!childIpIds.length) {
        throw new Error("No child IPs found");
      }

      // Log the parameters for debugging
      console.log("Claim Parameters:", {
        ancestorIpId: ipId,
        claimer: window.ethereum.selectedAddress,
        childIpIds,
        tokenAddress: WIP_TOKEN_ADDRESS,
        royaltyPolicies: ["0xBe54FB168b3c982b7AaE60dB6CF75Bd8447b390E"],
      });

      try {
        const royaltyVaultAddress = await client.royalty.getRoyaltyVaultAddress(
          ipId
        );
        console.log("Royalty Vault Address:", royaltyVaultAddress);
        const claimRevenue = await client.royalty.claimAllRevenue({
          ancestorIpId: ipId,
          claimer: ipId,
          currencyTokens: [WIP_TOKEN_ADDRESS],
          childIpIds: childIpIds,

          royaltyPolicies: ["0xBe54FB168b3c982b7AaE60dB6CF75Bd8447b390E"],
          claimOptions: {
            autoTransferAllClaimedTokensFromIp: false,
            autoUnwrapIpTokens: false,
          },
        });

        setClaimResult(claimRevenue);
        setShowClaimConfirmation(true);
        setShowRewardDetails(false);
      } catch (err) {
        // Log the full error for debugging
        console.log("Contract Error:", {
          message: err.message,
          data: err.data,
          error: err.error,
          fullError: err,
        });

        // Check if this is a contract revert error
        if (err.message.includes("0xa05b90b8")) {
          try {
            // Get the error data from the error object
            const errorData = err.data || err.error?.data;
            console.log("Error data:", errorData);

            // Try to extract meaningful information from the error
            const errorMessage =
              err.message.split("Contract Call:")[1] || err.message;
            setError(`Transaction Failed: ${errorMessage}`);
          } catch (decodeErr) {
            console.error("Error processing error details:", decodeErr);
            setError(
              "Contract Error: Unable to process claim. Please check your wallet and try again."
            );
          }
        } else {
          setError("Failed to claim rewards. Please try again later.");
          console.error("Original error:", err);
        }
      }
    } catch (outerErr) {
      setError(
        "Failed to initiate claim. Please check your wallet connection."
      );
      console.error("Outer error:", outerErr);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotalRewards = () => {
    if (!rewardsData?.data) return 0;
    return rewardsData.data.reduce(
      (total, payment) => total + Number(payment.amount),
      0
    );
  };

  const formatHash = (hash) => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
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
          <div className="reward-popup bg-white p-6 md:p-8 w-[90%] md:w-[600px] rounded-lg shadow-xl text-center relative">
            <h2 className="text-2xl font-bold text-[#3E2723] mb-4">
              Claim Available Rewards
            </h2>

            {error ? (
              <div className="text-red-500 mb-4">{error}</div>
            ) : (
              <div className="text-left mb-4">
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h3 className="text-lg font-semibold text-[#3E2723] mb-2">
                    Summary
                  </h3>
                  <p className="mb-2">
                    <strong>Total Available:</strong> {calculateTotalRewards()}{" "}
                    WIP
                  </p>
                  <p className="mb-2">
                    <strong>Number of Contributors:</strong>{" "}
                    {new Set(rewardsData?.data?.map((p) => p.payerIpId)).size}
                  </p>
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-[#3E2723] mb-2">
                    Derivative Memes Contributing
                  </h3>
                  <div className="max-h-48 overflow-y-auto">
                    {Array.from(
                      new Set(rewardsData?.data?.map((p) => p.payerIpId))
                    ).map((payerId, index) => {
                      const payments = rewardsData.data.filter(
                        (p) => p.payerIpId === payerId
                      );
                      const total = payments.reduce(
                        (sum, p) => sum + Number(p.amount),
                        0
                      );

                      return (
                        <div
                          key={payerId}
                          className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <p className="text-sm font-medium">
                            Derivative #{index + 1}
                          </p>
                          <p className="text-sm">
                            <strong>IP ID:</strong> {payerId}
                          </p>
                          <p className="text-sm">
                            <strong>Total Contribution:</strong> {total} WIP
                          </p>
                        </div>
                      );
                    })}
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
                <span className="inline-block skew-x-[21deg]">Cancel</span>
              </button>
              {rewardsData?.data?.length > 0 && (
                <button
                  onClick={handleClaimConfirmation}
                  disabled={isLoading}
                  className="relative text-white inline-block font-medium text-[15px] w-fit px-4 py-1 cursor-pointer border-none bg-green-600 hover:bg-green-700 transition-colors duration-500
                  before:content-[''] before:absolute before:top-0 before:bottom-0 before:left-0 before:right-full before:bg-green-800 before:opacity-0 before:-z-10 before:transition-all before:duration-500
                  hover:before:right-0 hover:before:opacity-100
                  -skew-x-[21deg] group"
                >
                  <span className="inline-block skew-x-[21deg]">
                    {isLoading ? "Processing..." : "Transfer to Wallet"}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {showClaimConfirmation && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white p-6 md:p-8 w-[90%] md:w-[500px] rounded-lg shadow-xl text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">
              Claim Successful!
            </h2>

            <div className="text-left mb-6">
              <h3 className="font-semibold mb-2">Transaction Details:</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                {claimResult?.txHashes?.map((hash, index) => (
                  <a
                    key={hash}
                    href={`https://aeneid.storyscan.xyz/tx/${hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mb-2 text-blue-600 hover:text-blue-800"
                  >
                    Transaction {index + 1}: {formatHash(hash)}
                  </a>
                ))}

                {claimResult?.claimedTokens?.map((token, index) => (
                  <p key={index} className="mb-1">
                    <strong>Claimed Amount {index + 1}:</strong>{" "}
                    {token.amount.toString()} WIP
                  </p>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowClaimConfirmation(false)}
              className="relative text-white inline-block font-medium text-[15px] w-fit px-4 py-1 cursor-pointer border-none bg-green-600 hover:bg-green-700 transition-colors duration-500
              before:content-[''] before:absolute before:top-0 before:bottom-0 before:left-0 before:right-full before:bg-green-800 before:opacity-0 before:-z-10 before:transition-all before:duration-500
              hover:before:right-0 hover:before:opacity-100
              -skew-x-[21deg] group"
            >
              <span className="inline-block skew-x-[21deg]">Close</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MemeCardProfile;
