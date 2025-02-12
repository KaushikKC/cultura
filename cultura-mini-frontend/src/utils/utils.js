import { StoryClient } from "@story-protocol/core-sdk";
import { http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { useActiveAccount } from "thirdweb/react";

// Get private key from environment variables
const privateKey = process.env.REACT_APP_PRIVATE_KEY_WALLET_USER_1;
if (!privateKey) {
  throw new Error("Wallet private key not found in environment variables");
}

// const account = useActiveAccount();

// Create account from private key
export const account = privateKeyToAccount(`0x${privateKey.replace("0x", "")}`);

// Configure Story Protocol client
const config = {
  account: account,
  transport: http(process.env.REACT_APP_RPC_PROVIDER_URL),
  chainId: "aeneid",
};

export const client = StoryClient.newClient(config);
export const nftCollectionAddress =
  "0x1C7AA3312f8e4dBA6672fAb191AbC007FE01D651";
