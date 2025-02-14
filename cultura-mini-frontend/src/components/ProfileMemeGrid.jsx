import React, { useState, useEffect } from "react";
import MemeCardProfile from "./ProfileMemeCard";

const ProfileMemeGrid = ({ address }) => {
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ipIds, setIpIds] = useState([]);

  // First fetch the user's tracking data to get ipIds
  useEffect(() => {
    const fetchUserTracking = async () => {
      try {
        // Normalize the address to lowercase and remove any whitespace
        console.log(address); // its giving a address without a alphabet

        const hardCodedAddress = "0xbb7462adA69561Ff596322aA2f9595c28E47FD6aa";

        // Ensure proper URL construction with base URL
        const baseUrl = "https://cultura-e6o8.vercel.app";
        const apiPath = "/api/user-tracking";
        const fullUrl = `${baseUrl}${apiPath}/${hardCodedAddress}`;
        console.log("Fetching from:", fullUrl);

        const trackingResponse = await fetch(fullUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        if (!trackingResponse.ok) {
          throw new Error(`HTTP error! status: ${trackingResponse.status}`);
        }

        const trackingData = await trackingResponse.json();
        console.log("Tracking API Response:", trackingData);

        if (trackingData.success && trackingData.data?.ipIds) {
          setIpIds(trackingData.data.ipIds);
        } else {
          throw new Error(trackingData.error || "No tracking data found");
        }
      } catch (err) {
        console.error("Tracking API Error:", err);
        setError("Failed to fetch user tracking data: " + err.message);
        setLoading(false);
      }
    };

    if (address) {
      fetchUserTracking();
    }
  }, [address]);

  // Then fetch the memes using the obtained ipIds
  useEffect(() => {
    const fetchMemes = async () => {
      if (!ipIds.length) return;

      try {
        const url = "https://api.storyapis.com/api/v3/assets";
        const options = {
          method: "POST",
          headers: {
            Accept: "application/json",
            "X-Api-Key": "MhBsxkU1z9fG6TofE59KqiiWV-YlYE8Q4awlLQehF3U",
            "X-Chain": "story-aeneid",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            options: {
              where: {
                tokenContract: "0x1C7AA3312f8e4dBA6672fAb191AbC007FE01D651",
              },
              ipAssetIds: ipIds,
            },
          }),
        };

        console.log("Fetching memes with options:", options);

        const response = await fetch(url, options);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        console.log("Memes API Response:", json);

        setMemes(json.data || []);
        setLoading(false);
      } catch (err) {
        console.error("Memes API Error:", err);
        setError("Failed to fetch memes: " + err.message);
        setLoading(false);
      }
    };

    fetchMemes();
  }, [ipIds]);

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

  if (!memes.length) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        No memes found for this address
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
