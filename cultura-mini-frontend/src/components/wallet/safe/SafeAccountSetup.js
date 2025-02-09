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
  const [protocolKit, setProtocolKit] = useState(null);

  const deploySafe = async () => {
    try {
      setLoading(true);

      if (!account) throw new Error("No active account found.");

      const chain = sepolia;
      console.log(
        process.env.REACT_APP_PRIVATE_KEY,
        "process.env.REACT_APP_PRIVATE_KEY"
      );
      console.log(process.env);

      const signer = process.env.REACT_APP_PRIVATE_KEY; // pass your signer here, e.g. from thirdweb or ethers.js or private key
      //should be changed

      console.log("Signer:", signer);

      if (!signer) throw new Error("Signer initialization failed.");
      const account_address = account.address;
      const safeAccountConfig = {
        owners: [account_address], // pass your owners here associated with the signer
        // after deploying a safe account, the signer acts as your private key
        threshold: 1,
      };

      console.log("Deploying Safe with Config:", safeAccountConfig);

      let protocolKitInstance = await Safe.init({
        provider: chain.rpcUrls.default.http[0],
        signer,
        predictedSafe: { safeAccountConfig },
      });

      const safeAddr = await protocolKitInstance.getAddress();
      console.log("Predicted Safe Address:", safeAddr);
      setSafeAddress(safeAddr);

      // Check if Safe is already deployed
      const isDeployed = await protocolKitInstance.isSafeDeployed();
      if (isDeployed) {
        console.log("Safe already deployed, connecting...");
        protocolKitInstance = await protocolKitInstance.connect({
          safeAddress,
        });
        console.log(protocolKitInstance);

        console.log("Connected to existing Safe.");
      } else {
        console.log("Safe not deployed, proceeding with deployment...");

        const deploymentTransaction =
          await protocolKitInstance.createSafeDeploymentTransaction();

        if (!deploymentTransaction.to || !deploymentTransaction.value) {
          throw new Error("Invalid deployment transaction data.");
        }

        const clientSafe = await protocolKitInstance
          .getSafeProvider()
          .getExternalSigner();

        console.log("Deploying Safe...");
        const transactionHash = await clientSafe.sendTransaction({
          to: deploymentTransaction.to,
          value: BigInt(deploymentTransaction.value || 0),
          data: deploymentTransaction.data,
          chain,
        });

        console.log("Transaction Hash:", transactionHash);

        const transactionReceipt = await client.getTransactionReceipt(
          transactionHash
        );

        console.log("Transaction Receipt:", transactionReceipt);
      }

      setProtocolKit(protocolKitInstance);
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
