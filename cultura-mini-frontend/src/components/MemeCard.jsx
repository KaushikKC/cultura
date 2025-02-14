import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterDerivative from "./License";

const MemeCard = ({
  topic,
  imageUrl,
  isDerived,
  isMarketplace,
  ipId,
  tokenId,
  tokenUri,
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const [showDerivative, setShowDerivative] = useState(false);
  const [txDetails, setTxDetails] = useState(null);
  const navigate = useNavigate();

  const handleCardClick = (e) => {
    // Only navigate if we're not clicking buttons or popups
    if (!e.target.closest("button") && !e.target.closest(".license-popup")) {
      navigate(`/meme/${ipId}`);
    }
  };

  const handleConfirmClick = (e) => {
    e.stopPropagation(); // Prevent navigation
    console.log("IPFS Image URL:", imageUrl);
    setShowPopup(false);
    setShowDerivative(true);
  };

  const handleTransactionComplete = (details) => {
    setTxDetails(details);
  };

  return (
    <>
      <div
        className="relative w-[400px] h-[550px] bg-[#D1B29A] p-4 rounded-xl border-2 border-[#3E2723] overflow-hidden cursor-pointer"
        style={{ boxShadow: "0.4rem 0.4rem #3E2723" }}
        onClick={handleCardClick}
      >
        {/* Rest of the card content remains the same */}
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
          {/* Share buttons section */}
          <div className="flex justify-center space-x-5">
            {/* Share buttons remain the same */}
          </div>

          <div className="flex justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                isMarketplace && setShowPopup(true);
              }}
              className="cursor-pointer font-semibold overflow-hidden relative z-100 border border-[#3E2723] group px-6 py-1 my-2"
            >
              <span className="relative z-10 text-[#3E2723] group-hover:text-white text-xl duration-500">
                {isMarketplace ? "License" : "Mint"}
              </span>
              <span className="absolute w-full h-full bg-[#3E2723] -left-32 top-0 -rotate-45 group-hover:rotate-0 group-hover:left-0 duration-500" />
              <span className="absolute w-full h-full bg-[#3E2723] -right-32 top-0 -rotate-45 group-hover:rotate-0 group-hover:right-0 duration-500" />
            </button>
          </div>
        </div>

        {showPopup && isMarketplace && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="license-popup bg-white p-6 md:p-8 w-[90%] md:w-[500px] rounded-lg shadow-xl text-center relative">
              <h2 className="text-2xl font-bold text-[#3E2723] mb-4">
                License Meme
              </h2>

              <div className="text-left mb-4 text-gray-700">
                <p className="mb-2">
                  <strong>IP ID:</strong> {ipId}
                </p>
                <p className="mb-2">
                  <strong>Token ID:</strong> {tokenId}
                </p>
                <p className="mb-2 break-all">
                  <strong>Token URI:</strong> {tokenUri}
                </p>
              </div>

              {/* License Details Section */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4 text-left">
                <h3 className="font-bold text-[#3E2723] mb-2">
                  License Details:
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• License ID: 95</li>
                  <li>• Type: Commercial Remix License</li>
                  <li>• Royalty Payment: 1 Wrapped IP Token</li>
                  <li>• Usage: Full commercial rights with attribution</li>
                </ul>
              </div>

              <p className="mt-3 text-gray-700">
                By licensing this meme, you agree to the platform's licensing
                terms and conditions.
              </p>

              <div className="flex justify-center space-x-5 mt-5">
                <button
                  onClick={() => setShowPopup(false)}
                  className="relative text-white inline-block font-medium text-[15px] w-fit px-4 py-1 cursor-pointer border-none bg-red-500 hover:bg-red-600 transition-colors duration-500
                  before:content-[''] before:absolute before:top-0 before:bottom-0 before:left-0 before:right-full before:bg-red-700 before:opacity-0 before:-z-10 before:transition-all before:duration-500
                  hover:before:right-0 hover:before:opacity-100
                  -skew-x-[21deg] group"
                >
                  <span className="inline-block skew-x-[21deg]">Cancel</span>
                </button>
                <button
                  onClick={handleConfirmClick}
                  className="relative text-white inline-block font-medium text-[15px] w-fit px-4 py-1 cursor-pointer border-none bg-green-600 hover:bg-green-700 transition-colors duration-500
                  before:content-[''] before:absolute before:top-0 before:bottom-0 before:left-0 before:right-full before:bg-green-800 before:opacity-0 before:-z-10 before:transition-all before:duration-500
                  hover:before:right-0 hover:before:opacity-100
                  -skew-x-[21deg] group"
                >
                  <span className="inline-block skew-x-[21deg]">Confirm</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showDerivative && (
        <RegisterDerivative
          parentIpId={ipId}
          ipfsImageUrl={imageUrl}
          onComplete={(details) => {
            setShowDerivative(false);
            handleTransactionComplete(details);
          }}
        />
      )}

      {/* Transaction Details Modal */}
      {txDetails && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={() => setTxDetails(null)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-[#3E2723] mb-4">
              Transaction Complete!
            </h3>
            <div className="space-y-3 text-gray-700">
              <div className="bg-gray-50 p-3 rounded">
                <p className="font-semibold">Derivative Creation</p>
                <p className="text-sm break-all">
                  TX Hash: {txDetails.derivativeTxHash}
                </p>
                <p className="text-sm">IP ID: {txDetails.ipId}</p>
                <p className="text-sm">Token ID: {txDetails.tokenId}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="font-semibold">Royalty Payment</p>
                <p className="text-sm break-all">
                  TX Hash: {txDetails.royaltyTxHash}
                </p>
              </div>
            </div>
            <button
              onClick={() => setTxDetails(null)}
              className="mt-4 w-full bg-[#3E2723] text-white py-2 rounded hover:bg-[#2A1B18] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MemeCard;
