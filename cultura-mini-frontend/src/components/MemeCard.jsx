import React, { useState } from "react";

const MemeCard = ({ topic, imageUrl, isDerived, isMarketplace }) => {
  const [showPopup, setShowPopup] = useState(false);
  console.log(imageUrl);

  return (
    <div
      className="relative w-[400px] h-[550px] bg-[#D1B29A] p-4 rounded-xl border-2 border-[#3E2723] overflow-hidden"
      style={{ boxShadow: "0.4rem 0.4rem #3E2723" }}
    >
      {/* Derived Tag */}
      {isDerived && (
        <div className="absolute top-2 left-2 bg-[#3E2723] text-white px-3 py-1 text-xs font-bold uppercase rounded-md shadow-md">
          Derived
        </div>
      )}

      <img src={imageUrl} className="p-5" alt="" />
      <div className="flex flex-col gap-2 h-full text-xl">
        <p className="text-[#3E2723] font-gloock text-2xl font-medium">
          {topic}
        </p>
        <div className="flex justify-center space-x-5">
          <button
            className="relative text-[#3E2723] inline-block font-medium text-[15px] w-fit px-4 py-1 cursor-pointer border-none bg-white hover:text-white transition-colors duration-500
            before:content-[''] before:absolute before:top-0 before:bottom-0 before:left-0 before:right-full before:bg-[#3E2723] before:opacity-0 before:-z-10 before:transition-all before:duration-500
            hover:before:right-0 hover:before:opacity-100
            -skew-x-[21deg] group"
          >
            <span className="inline-block skew-x-[21deg]">Share on X</span>
          </button>
          <button
            className="relative text-[#3E2723] inline-block font-medium text-[15px] w-fit px-4 py-1 cursor-pointer border-none bg-white hover:text-white transition-colors duration-500
            before:content-[''] before:absolute before:top-0 before:bottom-0 before:left-0 before:right-full before:bg-[#3E2723] before:opacity-0 before:-z-10 before:transition-all before:duration-500
            hover:before:right-0 hover:before:opacity-100
            -skew-x-[21deg] group"
          >
            <span className="inline-block skew-x-[21deg]">
              Share on Farcaster
            </span>
          </button>
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => isMarketplace && setShowPopup(true)}
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

      {/* License Popup Modal  */}
      {showPopup && isMarketplace && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 md:p-8 w-[90%] md:w-[400px] rounded-lg shadow-xl text-center relative">
            <h2 className="text-2xl font-bold text-[#3E2723]">License Meme</h2>
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
                onClick={() => {
                  setShowPopup(false);
                  alert("Meme Licensed!");
                }}
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
  );
};

export default MemeCard;
