// App.js
import React, { useState, useEffect } from "react";
// import { ethers } from "ethers";
// import { contractABI } from "./contractABI"; // You'll need to create this from your Solidity contract
import axios from "axios";

const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS";
const API_BASE_URL = "http://localhost:3001";

function App() {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [userAddress, setUserAddress] = useState("");
  const [memeHistory, setMemeHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentMeme, setCurrentMeme] = useState(null);

  console.log(currentMeme);

  useEffect(() => {
    fetchTrendingTopics();
    connectWallet();
  }, []);

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setUserAddress(accounts[0]);
        fetchMemeHistory(accounts[0]);
      } else {
        setError("Please install MetaMask!");
      }
    } catch (error) {
      setError("Error connecting wallet: " + error.message);
    }
  };

  const fetchTrendingTopics = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/trending`);
      setTopics(response.data);
    } catch (error) {
      setError("Error fetching topics: " + error.message);
    }
  };

  const fetchMemeHistory = async (address) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/history/${address}`
      );
      setMemeHistory(response.data);
    } catch (error) {
      setError("Error fetching history: " + error.message);
    }
  };

  const generateMeme = async (topic) => {
    try {
      setLoading(true);
      setError("");

      // Generate meme content
      const response = await axios.post(`${API_BASE_URL}/api/generate`, {
        topic: topic.title,
        userAddress,
      });
      setCurrentMeme({
        ...response.data,
        imageUrl: `https://gateway.pinata.cloud/ipfs/${response.data.imageCid}`,
        fallbackImageUrl: response.data.imageUrls?.base64,
      });

      // Register on blockchain
      // const provider = new ethers.providers.Web3Provider(window.ethereum);
      // const signer = provider.getSigner();
      // const contract = new ethers.Contract(
      //   CONTRACT_ADDRESS,
      //   contractABI,
      //   signer
      // );

      // const tx = await contract.registerMeme(response.data.ipfsCid);
      // await tx.wait();

      // Refresh history
      fetchMemeHistory(userAddress);

      setLoading(false);
    } catch (error) {
      setError("Error generating meme: " + error.message);
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Cultura Mini</h1>

      {!userAddress ? (
        <button
          onClick={connectWallet}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="mb-4">
          <p>
            Connected: {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Trending Topics</h2>
          <div className="space-y-4">
            {topics.map((topic) => (
              <div
                key={topic.id}
                className="border p-4 rounded cursor-pointer hover:bg-gray-50"
                onClick={() => generateMeme(topic)}
              >
                <h3 className="font-bold">{topic.title}</h3>
                <p>{topic.description}</p>
                <p className="text-sm text-gray-500">
                  Engagement: {topic.engagement}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Generated Meme</h2>
          {currentMeme && (
            <div className="border p-4 rounded mb-8">
              <p className="font-bold mb-2">{currentMeme.topic}</p>
              <p className="mb-4">{currentMeme.caption}</p>
              <img
                src={currentMeme.imageUrl}
                alt={currentMeme.caption}
                className="w-full rounded-lg shadow-lg mb-4"
                onError={(e) => {
                  if (currentMeme.fallbackImageUrl) {
                    e.target.src = currentMeme.fallbackImageUrl;
                  }
                }}
              />
              <p className="text-sm text-gray-500">
                IPFS CID: {currentMeme.imageCid}
              </p>
            </div>
          )}

          <h2 className="text-2xl font-bold mb-4">Your Meme History</h2>
          <div className="space-y-4">
            {memeHistory.map((meme, index) => (
              <div key={index} className="border p-4 rounded">
                <p className="font-bold">{meme.topic}</p>
                <p>{meme.caption}</p>
                <p className="text-sm text-gray-500">
                  IPFS CID: {meme.ipfsCid}
                </p>
                <a
                  href={`https://ipfs.io/ipfs/${meme.ipfsCid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  View on IPFS
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded">Generating meme...</div>
        </div>
      )}
    </div>
  );
}

export default App;
