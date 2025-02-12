import React from "react";
import Navbar from "../components/Navbar";
import MemeCard from "../components/MemeCard";

function MarketPlace() {
  const marketplaceMemes = [
    { id: 1, topic: "Meme 1", imageUrl: "/images/meme1.jpg", isDerived: false },
    { id: 2, topic: "Meme 2", imageUrl: "/images/meme2.jpg", isDerived: true }
  ];
  return (
    <div className="bg-[#412E2A] min-h-screen">
      <Navbar />

      <div className="bg-[#D9D9D9] text-[#3E2723] min-h-screen px-4 sm:px-6 md:px-10 lg:px-16">
        <div className="relative z-10 flex flex-col items-center justify-center text-[#3E2723] text-center
      text-[32px] sm:text-[40px] md:text-[46px] lg:text-[52px] xl:text-[58px]
      p-6 sm:p-8 md:p-10 lg:p-12">
          <div className="flex flex-wrap justify-center items-center space-x-2 sm:space-x-4">
            <span className="text-[#808000] font-gloock">EXPLORE</span>
            <span>Your Feed</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-5">
          {marketplaceMemes.map(meme =>
            <MemeCard
              key={meme.id}
              topic={meme.topic}
              imageUrl={meme.imageUrl}
              isMarketplace={true}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default MarketPlace;
