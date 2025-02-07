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

  const chain = sepolia;

  const getSigner = async () => {
    return await ethers5Adapter.signer.toEthers({
      client,
      chain,
      account,
    });
  };

  const safeAccountConfig = {
    owners: ["0xbb7462adA69561Ff596322A2f9595c28E47FD6aa"],
    threshold: 1,
  };

  const predictedSafe = {
    safeAccountConfig,
  };

  const deploySafe = async () => {
    try {
      setLoading(true);

      const protocolKit = await Safe.init({
        provider: sepolia.rpcUrls.default.http[0],
        signer: await getSigner(),
        predictedSafe,
      });

      const safeAddr = await protocolKit.getAddress();
      console.log("Predicted Safe Address:", safeAddr);
      setSafeAddress(safeAddr);

      const deploymentTransaction =
        await protocolKit.createSafeDeploymentTransaction();

      const clientSafe = await protocolKit
        .getSafeProvider()
        .getExternalSigner();

      console.log("Deploying Safe...");
      const transactionHash = await clientSafe.sendTransaction({
        to: deploymentTransaction.to,
        value: BigInt(deploymentTransaction.value),
        data: deploymentTransaction.data,
        chain: sepolia,
      });

      console.log("Transaction Hash:", transactionHash);

      const transactionReceipt = await client.waitForTransactionReceipt({
        hash: transactionHash,
      });

      console.log("Transaction Receipt:", transactionReceipt);

      const newProtocolKit = await protocolKit.connect({
        safeAddress: safeAddr,
      });

      const isSafeDeployed = await newProtocolKit.isSafeDeployed();
      console.log("Safe Deployed:", isSafeDeployed);

      setLoading(false);
    } catch (error) {
      console.error("Error deploying Safe:", error);
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
