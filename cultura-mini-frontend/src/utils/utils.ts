import { StoryClient, StoryConfig } from "@story-protocol/core-sdk";
import { http } from "viem";
// import { privateKeyToAccount, type Account } from "viem/accounts";
import { useActiveAccount } from "thirdweb/react";

// Get private key from environment variables
// const privateKey = process.env.REACT_APP_WALLET_PRIVATE_KEY;
// if (!privateKey) {
//   throw new Error("Wallet private key not found in environment variables");
// }

const account = useActiveAccount();

// Create account from private key
// export const account: Account = privateKeyToAccount(
//   `0x${privateKey.replace("0x", "")}` as `0x${string}`
// );

// Configure Story Protocol client
const config: StoryConfig = {
  account: account?.address,
  transport: http(process.env.REACT_APP_RPC_PROVIDER_URL),
  chainId: "aeneid",
};

export const client = StoryClient.newClient(config);
