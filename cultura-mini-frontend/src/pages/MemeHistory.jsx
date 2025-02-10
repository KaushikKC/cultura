import React from "react";
import MemeCard from "../components/MemeCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function MemeHistory() {
  // Sample meme history data - replace with your actual data source
  const memeHistory = [
    { id: 1, title: "Meme 1" },
    { id: 2, title: "Meme 2" },
    { id: 3, title: "Meme 3" }
    // Add more meme entries as needed
  ];

  return (
    <div>
      <div className="bg-[#412E2A] min-h-screen">
        <Navbar />

        <div className="bg-[#D9D9D9] text-[#3E2723] pb-8 min-h-screen px-4 sm:px-6 md:px-10 lg:px-16">
          <div className="relative z-10 flex flex-col items-center justify-center text-[#3E2723] text-center
            text-[32px] sm:text-[40px] md:text-[46px] lg:text-[52px] xl:text-[58px]
            pt-6 sm:pt-8 md:pt-10 lg:pt-12">
            <div className="flex flex-wrap justify-center items-center space-x-2 sm:space-x-4 mb-8">
              <span className="text-[#808000] font-gloock">MEME</span>
              <span>History</span>
            </div>
          </div>

          {/* Grid Layout for MemeCards */}
          <div className="grid grid-cols-3 gap-5">
            <MemeCard />
            <MemeCard />
            <MemeCard />
            <MemeCard />
            <MemeCard />
            <MemeCard />
          </div>

          {/* No Memes Message */}
          {memeHistory.length === 0 &&
            <div className="flex justify-center items-center h-[200px] text-xl text-gray-600">
              No memes in history yet
            </div>}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default MemeHistory;
