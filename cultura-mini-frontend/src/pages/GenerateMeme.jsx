import React from "react";
import MemeCard from "../components/MemeCard";
import Navbar from "../components/Navbar";

function GenerateMeme() {
  return (
    <div className="bg-[#412E2A] min-h-screen">
      <Navbar />

      <div className="bg-[#D9D9D9] text-[#3E2723] min-h-screen px-4 sm:px-6 md:px-10 lg:px-16">
        <div className="relative z-10 flex flex-col items-center justify-center text-[#3E2723] text-center
          text-[32px] sm:text-[40px] md:text-[46px] lg:text-[52px] xl:text-[58px]
          p-6 sm:p-8 md:p-10 lg:p-12">
          <div className="flex flex-wrap justify-center items-center space-x-2 sm:space-x-4">
            <span className="text-[#808000] font-gloock">MEME</span>
            <span>Generated</span>
          </div>

          <MemeCard />
        </div>
      </div>
    </div>
  );
}

export default GenerateMeme;
