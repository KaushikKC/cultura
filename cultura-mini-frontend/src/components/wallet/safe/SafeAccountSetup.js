import React, { useState } from "react";
import Safe from "@safe-global/protocol-kit";
import { sepolia } from "viem/chains";
import { ethers5Adapter } from "thirdweb/adapters/ethers5";
import { useActiveAccount } from "thirdweb/react";
import { client } from "./../thirdweb/client";

const SafeAccountSetup = () => {
  const account = useActiveAccount();
  const [loading, setLoading] = useState(false);
  const [safeAddress, setSafeAddress] = useState("");

  const deploySafe = async () => {
    try {
      setLoading(true);

      if (!account) throw new Error("No active account found.");

      const chain = sepolia;
      // const signer = await ethers5Adapter.signer.toEthers({
      //   client,
      //   chain,
      //   account,
      // });

      const signer = "";
      console.log("Signer:", signer);

      if (!signer) throw new Error("Signer initialization failed.");

      const safeAccountConfig = {
        owners: ["0xbb7462adA69561Ff596322A2f9595c28E47FD6aa"],
        threshold: 1,
      };

      console.log("Deploying Safe with Config:", safeAccountConfig);

      console.log("Initializing ProtocolKit...");
      console.log(signer, "signer going in to protocolKit");

      const protocolKit = await Safe.init({
        provider: chain.rpcUrls.default.http[0],
        signer,
        predictedSafe: { safeAccountConfig },
      });

      console.log(protocolKit, "protocolKit");

      const safeAddr = await protocolKit.getAddress();
      console.log("Predicted Safe Address:", safeAddr);
      setSafeAddress(safeAddr);

      const deploymentTransaction =
        await protocolKit.createSafeDeploymentTransaction();

      if (!deploymentTransaction.to || !deploymentTransaction.value) {
        throw new Error("Invalid deployment transaction data.");
      }

      const clientSafe = await protocolKit
        .getSafeProvider()
        .getExternalSigner();

      console.log("Deploying Safe...");
      const transactionHash = await clientSafe.sendTransaction({
        to: deploymentTransaction.to,
        value: BigInt(deploymentTransaction.value || 0), // Ensure value is defined
        data: deploymentTransaction.data,
        chain,
      });

      console.log("Transaction Hash:", transactionHash);

      const transactionReceipt = await clientSafe.waitForTransactionReceipt({
        hash: transactionHash,
      });

      console.log("Transaction Receipt:", transactionReceipt);

      setLoading(false);
    } catch (error) {
      console.error("Error deploying Safe:", error.message);
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Safe Account Setup</h2>
      <button onClick={deploySafe} disabled={loading}>
        {loading ? "Deploying..." : "Deploy Safe"}
      </button>
      {safeAddress && <p>Safe Address: {safeAddress}</p>}
    </div>
  );
};

export default SafeAccountSetup;
