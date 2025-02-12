import { zeroAddress } from "viem";
import { client } from "./utils.js";

async function createSpgNftCollection() {
  const newCollection = await client.nftClient.createNFTCollection({
    name: "CULTURA Meme NFTs",
    symbol: "CULTURA",
    isPublicMinting: true,
    mintOpen: true,
    mintFeeRecipient: zeroAddress,
    contractURI: "",
    txOptions: { waitForTransaction: true },
  });
  console.log(newCollection, "newCollection from createSpgNftCollection");
  console.log(
    `New SPG NFT collection created at transaction hash ${newCollection.txHash}`
  );
  console.log(`NFT contract address: ${newCollection.spgNftContract}`);
}

createSpgNftCollection();
