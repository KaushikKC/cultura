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
        const url = "https://api.storyapis.com/api/v3/assets";
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
                tokenContract: "0x1C7AA3312f8e4dBA6672fAb191AbC007FE01D651",
              },
            },
          }),
        };

        console.log("Fetching assets...");
        const response = await fetch(url, options);
        const json = await response.json();
        console.log("API Response:", json);

        if (json.data) {
          const transformedMemes = json.data.map((item) => ({
            id: item.id,
            ipId: item.ipId,
            topic: (item.nftMetadata?.name || "Unnamed Meme").replace(
              "1315: ",
              ""
            ),
            imageUrl: item.nftMetadata?.imageUrl || "/images/meme1.jpg",
            tokenId: item.nftMetadata?.tokenId,
            tokenUri: item.nftMetadata?.tokenUri,
            isDerived: item.parentCount > 0, // Check if the meme has parents using parentCount
            isMarketplace: true,
          }));

          console.log("Transformed memes:", transformedMemes);
          setMemes(transformedMemes);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
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
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3E2723]"></div>
            <p className="mt-4">Loading memes...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#412E2A] min-h-screen">
        <Navbar />
        <div className="bg-[#D9D9D9] text-[#3E2723] min-h-screen flex items-center justify-center">
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
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
              ipId={meme.ipId}
              tokenId={meme.tokenId}
              tokenUri={meme.tokenUri}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default MarketPlace;
