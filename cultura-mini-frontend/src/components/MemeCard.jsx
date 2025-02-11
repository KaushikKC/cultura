import React from "react";
import meme from "../images/meme.webp";
const MemeCard = ({ topic, imageUrl }) => {
  return (
    <div
      className="w-[400px] h-[500px] bg-[#D1B29A] p-4 rounded-xl border-2 border-[#3E2723] overflow-hidden "
      style={{ boxShadow: "0.4rem 0.4rem #3E2723" }}
    >
      <div className="flex flex-col gap-2 h-full text-xl">
        <img src={imageUrl} className="p-5" />
        <div className="flex justify-center space-x-5">
          <button
            className="relative text-[#3E2723] inline-block font-medium text-[15px] w-[90px] cursor-pointer border-none bg-white hover:text-white transition-colors duration-500
      before:content-[''] before:absolute before:top-0 before:bottom-0 before:left-0 before:right-full before:bg-[#3E2723] before:opacity-0 before:-z-10 before:transition-all before:duration-500
      hover:before:right-0 hover:before:opacity-100
      -skew-x-[21deg]
      group"
          >
            <span className="inline-block skew-x-[21deg]">Share on X</span>
          </button>
          <button
            className="relative text-[#3E2723] inline-block font-medium text-[15px] w-fit px-4 py-1 cursor-pointer border-none bg-white hover:text-white transition-colors duration-500
      before:content-[''] before:absolute before:top-0 before:bottom-0 before:left-0 before:right-full before:bg-[#3E2723] before:opacity-0 before:-z-10 before:transition-all before:duration-500
      hover:before:right-0 hover:before:opacity-100
      -skew-x-[21deg]
      group"
          >
            <span className="inline-block skew-x-[21deg]">
              Share on Farcaster
            </span>
          </button>
        </div>
        <div className="flex justify-center">
          <button class="cursor-pointer font-semibold overflow-hidden relative z-100 border border-[#3E2723] group px-6 py-1 my-2">
            <span class="relative z-10 text-[#3E2723] group-hover:text-white text-xl duration-500">
              Mint
            </span>
            <span class="absolute w-full h-full bg-[#3E2723] -left-32 top-0 -rotate-45 group-hover:rotate-0 group-hover:left-0 duration-500" />
            <span class="absolute w-full h-full bg-[#3E2723] -right-32 top-0 -rotate-45 group-hover:rotate-0 group-hover:right-0 duration-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemeCard;
