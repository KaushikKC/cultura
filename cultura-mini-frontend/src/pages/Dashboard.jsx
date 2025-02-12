import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import TopicCard from "../components/TopicCard";
import Footer from "../components/Footer";
import axios from "axios";
import OpenAI from "openai";
import { account, client } from "../utils/utils.ts";
import { uploadJSONToIPFS } from "../utils/uploadToIpfs.ts";
import { createHash } from "crypto";
import { useActiveAccount } from "thirdweb/react";
// import { useSafe } from "../components/context/SafeContext.js";

const API_BASE_URL = "http://localhost:3001";

function Dashboard() {
  const account = useActiveAccount();
  const navigate = useNavigate();
  const [userAddress, setUserAddress] = useState(
    "0x5BDf4cE6749d7e93c05897fa23871C280BF59b5b"
  );
  const [memeHistory, setMemeHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentMeme, setCurrentMeme] = useState(null);
  const [promptInput, setPromptInput] = useState("");

  // const {safeAddress} = useSafe();

  const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  });

  const generateMeme = async topic => {
    try {
      const image = await openai.images.generate({
        model: "dall-e-2",
        prompt: `Create a meme for topic ${topic}`
      });
      console.log(image.data[0].url);

      const ipMetadata = client.ipAsset.generateIpMetadata({
        title: "Dall-E 2 Image",
        description: "An image generated by Dall-E 2",
        ipType: "image",
        attributes: [
          {
            key: "Model",
            value: "dall-e-2"
          },
          {
            key: "Prompt",
            value: `${topic}`
          }
        ],
        creators: [
          {
            name: "Jacob Tucker",
            contributionPercent: 100,
            address: account.address,

          }
        ]
      });

      const nftMetadata = {
        name: "Image Ownership NFT",
        description:
          "This NFT represents ownership of the image generated by Dall-E 2",
        image: image.data[0].url,
        attributes: [
          {
            key: "Model",
            value: "dall-e-2"
          },
          {
            key: "Prompt",
            value: "A cute baby sea otter"
          }
        ]
      };

      const ipIpfsHash = await uploadJSONToIPFS(ipMetadata);
      const ipHash = createHash("sha256")
        .update(JSON.stringify(ipMetadata))
        .digest("hex");
      const nftIpfsHash = await uploadJSONToIPFS(nftMetadata);
      const nftHash = createHash("sha256")
        .update(JSON.stringify(nftMetadata))
        .digest("hex");

      console.log(ipIpfsHash, "IP", nftIpfsHash, "nft");

      // Navigate to meme page with topic and image URL
      navigate("/meme", {
        state: {
          topic: topic,
          imageUrl: image.data[0].url
        }
      });
    } catch (error) {
      console.error("Error generating meme:", error);
      setError("Failed to generate meme. Please try again.");
    }
  };

  const handleGenerateClick = () => {
    if (!promptInput.trim()) {
      setError("Please enter a topic first");
      return;
    }
    generateMeme(promptInput.trim());
  };

  return (
    <div className="bg-[#412E2A] min-h-screen">
      <Navbar />

      <div className="bg-[#D9D9D9] text-[#3E2723] min-h-screen px-4 sm:px-6 md:px-10 lg:px-16">
        <div className="relative z-10 flex flex-col items-center justify-center text-[#3E2723] text-center
          text-[32px] sm:text-[40px] md:text-[46px] lg:text-[52px] xl:text-[58px]
          p-6 sm:p-8 md:p-10 lg:p-12">
          <div className="flex flex-wrap justify-center items-center space-x-2 sm:space-x-4">
            <span className="text-[#808000] font-gloock">TRENDING</span>
            <span>Topics</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 
          gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 mx-auto">
          {Array(8).fill(0).map((_, i) =>
            <div key={i} className="flex justify-center">
              <TopicCard className="w-[90%] sm:w-[80%] md:w-[75%] lg:w-[70%] xl:w-[65%] 
                h-[200px] sm:h-[250px] md:h-[280px] lg:h-[300px] xl:h-[320px]" />
            </div>
          )}
        </div>
        <div className="flex items-center justify-center">
          <div className="flex items-center justify-center w-[400px] my-16">
            <div className="h-[2px] bg-gray-400 flex-1" />
            <span className="px-4 text-gray-600 text-lg font-medium">OR</span>
            <div className="h-[2px] bg-gray-400 flex-1" />
          </div>
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center text-[#3E2723] text-center
          text-[32px] sm:text-[40px] md:text-[46px] lg:text-[52px] xl:text-[58px]
          p-2">
          <div className="flex flex-wrap justify-center items-center space-x-2 sm:space-x-4">
            <span className="text-[#808000] font-gloock">SEND</span>
            <span>Prompt</span>
          </div>
        </div>

        <div className="flex justify-center items-center gap-10 p-10">
          <div className="group relative w-[300px] font-mono">
            <input
              placeholder="TYPE HERE"
              value={promptInput}
              onChange={e => setPromptInput(e.target.value)}
              className="smooth-type w-full p-4 font-bold text-[#412E2A] bg-white border-4 border-[#412E2A] 
                shadow-[5px_5px_0_#412E2A,10px_10px_0_#B4B44F] outline-none transition-all duration-300 
                ease-[cubic-bezier(0.25,0.8,0.25,1)] focus:animate-[focus-pulse_4s_cubic-bezier(0.25,0.8,0.25,1)_infinite,glitch_0.3s_infinite]
                focus:placeholder-transparent"
              type="text"
            />
            <label className="brutalist-label absolute -top-8 -left-1 bg-[#412E2A] text-white px-2.5 py-1.5 
                text-sm font-bold -rotate-1 transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] 
                group-focus-within:rotate-0 group-focus-within:scale-105 group-focus-within:bg-[#B4B44F] group-focus-within:text-[#3E2723 font-poppins]">
              TYPE IT HERE
            </label>
          </div>

          <button
            onClick={handleGenerateClick}
            disabled={loading}
            className="group relative flex px-8 py-3 bg-[#808000] text-white text-2xl 
                     transition-all duration-500 ease-out
                     shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:shadow-[10px_10px_0_0_#D1B29A]
                     -skew-x-15 border-none cursor-pointer outline-none"
          >
            <span className="skew-x-15 font-gloock">
              {loading ? "Generating..." : "Generate"}
            </span>
            <span className="ml-5 w-5 relative top-1 transition-all duration-500 group-hover:mr-7">
              <svg
                width="50px"
                height="20px"
                viewBox="0 0 66 43"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
              >
                <g
                  id="arrow"
                  stroke="none"
                  strokeWidth="1"
                  fill="none"
                  fillRule="evenodd"
                >
                  <path
                    className="transition-all duration-400 -translate-x-[60%] group-hover:translate-x-0"
                    d="M40.1543933,3.89485454 L43.9763149,0.139296592 C44.1708311,-0.0518420739 44.4826329,-0.0518571125 44.6771675,0.139262789 L65.6916134,20.7848311 C66.0855801,21.1718824 66.0911863,21.8050225 65.704135,22.1989893 C65.7000188,22.2031791 65.6958657,22.2073326 65.6916762,22.2114492 L44.677098,42.8607841 C44.4825957,43.0519059 44.1708242,43.0519358 43.9762853,42.8608513 L40.1545186,39.1069479 C39.9575152,38.9134427 39.9546793,38.5968729 40.1481845,38.3998695 C40.1502893,38.3977268 40.1524132,38.395603 40.1545562,38.3934985 L56.9937789,21.8567812 C57.1908028,21.6632968 57.193672,21.3467273 57.0001876,21.1497035 C56.9980647,21.1475418 56.9959223,21.1453995 56.9937605,21.1432767 L40.1545208,4.60825197 C39.9574869,4.41477773 39.9546013,4.09820839 40.1480756,3.90117456 C40.1501626,3.89904911 40.1522686,3.89694235 40.1543933,3.89485454 Z"
                    fill="#FFFFFF"
                  />
                  <path
                    className="transition-all duration-500 -translate-x-[30%] group-hover:translate-x-0"
                    d="M20.1543933,3.89485454 L23.9763149,0.139296592 C24.1708311,-0.0518420739 24.4826329,-0.0518571125 24.6771675,0.139262789 L45.6916134,20.7848311 C46.0855801,21.1718824 46.0911863,21.8050225 45.704135,22.1989893 C45.7000188,22.2031791 45.6958657,22.2073326 45.6916762,22.2114492 L24.677098,42.8607841 C24.4825957,43.0519059 24.1708242,43.0519358 23.9762853,42.8608513 L20.1545186,39.1069479 C19.9575152,38.9134427 19.9546793,38.5968729 20.1481845,38.3998695 C20.1502893,38.3977268 20.1524132,38.395603 20.1545562,38.3934985 L36.9937789,21.8567812 C37.1908028,21.6632968 37.193672,21.3467273 37.0001876,21.1497035 C36.9980647,21.1475418 36.9959223,21.1453995 36.9937605,21.1432767 L20.1545208,4.60825197 C19.9574869,4.41477773 19.9546013,4.09820839 20.1480756,3.90117456 C20.1501626,3.89904911 20.1522686,3.89694235 20.1543933,3.89485454 Z"
                    fill="#FFFFFF"
                  />
                  <path
                    className="group-hover:animate-colorAnim"
                    d="M0.154393339,3.89485454 L3.97631488,0.139296592 C4.17083111,-0.0518420739 4.48263286,-0.0518571125 4.67716753,0.139262789 L25.6916134,20.7848311 C26.0855801,21.1718824 26.0911863,21.8050225 25.704135,22.1989893 C25.7000188,22.2031791 25.6958657,22.2073326 25.6916762,22.2114492 L4.67709797,42.8607841 C4.48259567,43.0519059 4.17082418,43.0519358 3.97628526,42.8608513 L0.154518591,39.1069479 C-0.0424848215,38.9134427 -0.0453206733,38.5968729 0.148184538,38.3998695"
                    fill="#FFFFFF"
                  />
                </g>
              </svg>
            </span>
          </button>
        </div>

        {error &&
          <div className="text-red-500 text-center mt-4">
            {error}
          </div>}
      </div>
      <Footer />
    </div>
  );
}

export default Dashboard;
