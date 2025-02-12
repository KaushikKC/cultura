import React, { useState } from "react";
import MemeCard from "../components/MemeCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function MemeHistory() {
  const [selectedOption, setSelectedOption] = useState("generated");

  const memeHistory = [
    { id: 1, title: "Meme 1", imageUrl: "https://via.placeholder.com/150" },
    { id: 2, title: "Meme 2", imageUrl: "https://via.placeholder.com/150" },
    { id: 3, title: "Meme 3", imageUrl: "https://via.placeholder.com/150" }
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

          <div className="flex flex-col items-center ">
            <div className="relative h-[40px] bg-white border-2 border-[#3E2723] 
                      rounded-full shadow-[4px_4px_0_0_#3E2723] flex p-1 mb-5">
              {/* Generated Memes Button */}
              <label className="relative flex-1 h-full rounded-full cursor-pointer">
                <input
                  name="btn"
                  type="radio"
                  value="generated"
                  checked={selectedOption === "generated"}
                  onChange={() => setSelectedOption("generated")}
                  className="hidden"
                />
                <div
                  className={`flex items-center justify-center w-full h-full rounded-full transition-all px-5
                          ${selectedOption === "generated"
                            ? "bg-[#3E2723] text-white"
                            : "bg-transparent text-[#3E2723] hover:bg-[#505050] hover:text-white"}`}
                >
                  <span className="text-sm font-medium">Generated</span>
                </div>
              </label>

              {/* Derived Memes Button */}
              <label className="relative flex-1 h-full rounded-full cursor-pointer ">
                <input
                  name="btn"
                  type="radio"
                  value="derived"
                  checked={selectedOption === "derived"}
                  onChange={() => setSelectedOption("derived")}
                  className="hidden"
                />
                <div
                  className={`flex items-center justify-center w-full h-full rounded-full transition-all px-5
                          ${selectedOption === "derived"
                            ? "bg-[#3E2723] text-white"
                            : "bg-transparent text-[#3E2723] hover:bg-[#505050] hover:text-white"}`}
                >
                  <span className="text-sm font-medium">Derived</span>
                </div>
              </label>
            </div>
          </div>

          {/* Grid Layout for MemeCards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {memeHistory.map(meme =>
              <MemeCard
                key={meme.id}
                topic={meme.title}
                imageUrl={meme.imageUrl}
                isDerived={selectedOption === "derived"}
              />
            )}
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
