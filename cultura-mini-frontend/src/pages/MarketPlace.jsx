import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import MemeCard from "../components/MemeCard";

function MarketPlace() {
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMemes = async () => {
      try {
        const url =
          "https://api.storyapis.com/api/v3/collections/0x1C7AA3312f8e4dBA6672fAb191AbC007FE01D651";
        const options = {
          method: "GET",
          headers: {
            accept: "application/json",
            "X-Api-Key": "MhBsxkU1z9fG6TofE59KqiiWV-YlYE8Q4awlLQehF3U",
            "X-Chain": "story-aeneid",
          },
        };

        const response = await fetch(url, options);
        const json = await response.json();

        // Transform the API response into the format expected by MemeCardd
        const transformedMemes = [
          {
            id: json.data.id,
            topic: `Meme ${json.data.assetCount}`, // topic and imageUrl should be coming from individual meme IPid with another api call , needed to be configured
            imageUrl: "/images/meme1.jpg", // You'll need to get the actual image URL from your API
            isDerived: false,
            isMarketplace: true,
          },
        ];

        setMemes(transformedMemes);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMemes();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#412E2A] min-h-screen">
        <Navbar />
        <div className="bg-[#D9D9D9] text-[#3E2723] min-h-screen flex items-center justify-center">
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#412E2A] min-h-screen">
        <Navbar />
        <div className="bg-[#D9D9D9] text-[#3E2723] min-h-screen flex items-center justify-center">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#412E2A] min-h-screen">
      <Navbar />
      <div className="bg-[#D9D9D9] text-[#3E2723] min-h-screen px-4 sm:px-6 md:px-10 lg:px-16">
        <div
          className="relative z-10 flex flex-col items-center justify-center text-[#3E2723] text-center
          text-[32px] sm:text-[40px] md:text-[46px] lg:text-[52px] xl:text-[58px]
          p-6 sm:p-8 md:p-10 lg:p-12"
        >
          <div className="flex flex-wrap justify-center items-center space-x-2 sm:space-x-4">
            <span className="text-[#808000] font-gloock">EXPLORE</span>
            <span>Your Feed</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {memes.map((meme) => (
            <MemeCard
              key={meme.id}
              topic={meme.topic}
              imageUrl={meme.imageUrl}
              isDerived={meme.isDerived}
              isMarketplace={meme.isMarketplace}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default MarketPlace;
