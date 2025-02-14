import React, { useState, useEffect } from "react";
import MemeCardProfile from "./ProfileMemeCard";

const ProfileMemeGrid = (address) => {
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
              ipAssetIds: [
                "0x50F19C3BbDA3892b8EcC334247504C66c0039f9e",
                "0xb0349BA13fee1DD3F7b7DDa1fa3516916d132366",
              ],
            },
          }),
        };

        const response = await fetch(url, options);
        const json = await response.json();
        setMemes(json.data);
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
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3E2723]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
        {memes.map((meme) => (
          <MemeCardProfile
            key={meme.ipId}
            topic={meme.nftMetadata.name}
            imageUrl={meme.nftMetadata.imageUrl}
            isDerived={meme.parentCount > 0}
            ipId={meme.ipId}
            tokenId={meme.nftMetadata.tokenId}
            tokenUri={meme.nftMetadata.tokenUri}
          />
        ))}
      </div>
    </div>
  );
};

export default ProfileMemeGrid;
