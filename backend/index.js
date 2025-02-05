// Required dependencies
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const natural = require("natural");
const { HfInference } = require("@huggingface/inference");
const pinataSDK = require("@pinata/sdk");
const axios = require("axios"); // Add axios for fallback image generation

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Hugging Face client
const hf = new HfInference(process.env.HUGGINGFACE_TOKEN);

// Initialize Pinata client
const pinata = new pinataSDK(
  process.env.PINATA_API_KEY,
  process.env.PINATA_SECRET_KEY
);

// In-memory storage (replace with database in production)
const memeHistory = [];

// Mock trending data
const MOCK_TRENDING_DATA = [
  {
    id: "1",
    title: "AI Technology",
    description: "Latest developments in artificial intelligence",
    engagement: 1000,
  },
  {
    id: "2",
    title: "Space Exploration",
    description: "Recent discoveries in space exploration",
    engagement: 850,
  },
];

// Fallback image generation using another API
async function generateFallbackImage(prompt) {
  try {
    const response = await axios.get(
      `https://source.unsplash.com/800x600/?${encodeURIComponent(prompt)}`,
      { responseType: "arraybuffer" }
    );
    return Buffer.from(response.data);
  } catch (error) {
    throw new Error("Fallback image generation failed: " + error.message);
  }
}

// Endpoints
app.get("/api/trending", (req, res) => {
  res.json(MOCK_TRENDING_DATA);
});

app.post("/api/analyze", async (req, res) => {
  try {
    const { title, description, engagement } = req.body;
    const analyzer = new natural.SentimentAnalyzer();
    const tokens = new natural.WordTokenizer().tokenize(description);
    const sentiment = analyzer.getSentiment(tokens);

    res.json({
      topic: title,
      sentiment_score: sentiment,
      engagement_score: engagement,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/generate", async (req, res) => {
  try {
    const { topic, userAddress } = req.body;

    // Generate caption using Hugging Face
    const caption = await hf.textGeneration({
      model: "gpt2",
      inputs: `Create a funny meme caption about ${topic}:`,
      parameters: {
        max_length: 50,
        temperature: 0.7,
      },
    });

    let imageBuffer;
    try {
      // Try Stable Diffusion first
      const image = await hf.textToImage({
        model: "stabilityai/stable-diffusion-2",
        inputs: `${topic} ${caption.generated_text}`,
        parameters: {
          negative_prompt: "blurry, bad quality",
        },
      });
      imageBuffer = Buffer.from(await image.arrayBuffer());
    } catch (imageError) {
      console.log("Stable Diffusion failed, using fallback image generation");
      imageBuffer = await generateFallbackImage(topic);
    }

    // Convert to base64 for direct display
    const base64Image = imageBuffer.toString("base64");

    // Upload to IPFS via Pinata
    const imageResult = await pinata.pinFileToIPFS(imageBuffer, {
      pinataMetadata: {
        name: `${topic}-image`,
      },
    });

    // Create and pin metadata
    const metadata = {
      caption: caption.generated_text,
      image_cid: imageResult.IpfsHash,
      timestamp: new Date().toISOString(),
    };

    const metadataResult = await pinata.pinJSONToIPFS(metadata);

    // Store in history
    const memeRecord = {
      userAddress,
      ipfsCid: metadataResult.IpfsHash,
      imageCid: imageResult.IpfsHash,
      topic,
      caption: caption.generated_text,
      timestamp: new Date().toISOString(),
      imageUrls: {
        ipfs: `https://gateway.pinata.cloud/ipfs/${imageResult.IpfsHash}`,
        base64: `data:image/jpeg;base64,${base64Image}`,
      },
    };

    memeHistory.push(memeRecord);
    res.json(memeRecord);
  } catch (error) {
    console.error("Meme generation error:", error);
    res.status(500).json({
      error: error.message,
      details: "Failed to generate meme. Please try again.",
    });
  }
});

app.get("/api/history/:userAddress", (req, res) => {
  const { userAddress } = req.params;
  const userMemes = memeHistory.filter(
    (meme) => meme.userAddress === userAddress
  );
  res.json(userMemes);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
