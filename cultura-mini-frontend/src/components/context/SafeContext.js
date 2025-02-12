// SafeContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import Safe from "@safe-global/protocol-kit";
import { sepolia } from "viem/chains";
const SafeContext = createContext();
export const SafeProvider = ({ children }) => {
  const [safeAddress, setSafeAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [protocolKit, setProtocolKit] = useState(null);

  const deploySafe = async (account) => {
    try {
      setLoading(true);
      if (!account) throw new Error("No active account found.");
      const chain = sepolia;
      const signer = process.env.REACT_APP_PRIVATE_KEY_WALLET_USER_1;
      if (!signer) throw new Error("Signer initialization failed.");

      const safeAccountConfig = {
        owners: [account.address],
        threshold: 1,
      };
      let protocolKitInstance = await Safe.init({
        provider: chain.rpcUrls.default.http[0],
        signer,
        predictedSafe: { safeAccountConfig },
      });
      const isDeployed = await protocolKitInstance.isSafeDeployed();
      if (isDeployed) {
        console.log("Safe already deployed, connecting...");
        protocolKitInstance = await protocolKitInstance.connect({
          safeAddress,
        });
        setProtocolKit(protocolKitInstance);
        const predictedSafeAddress = await protocolKitInstance.getAddress();
        setSafeAddress(predictedSafeAddress);
        setLoading(false);
        return predictedSafeAddress;
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

        const transactionReceipt = await clientSafe.getTransactionReceipt(
          //clientSafe i guess
          transactionHash
        );

        console.log("Transaction Receipt:", transactionReceipt);
        setProtocolKit(protocolKitInstance);
        const predictedSafeAddress = await protocolKitInstance.getAddress();
        setSafeAddress(predictedSafeAddress);
        setLoading(false);
        return predictedSafeAddress;
      }
    } catch (error) {
      console.error("Error deploying Safe:", error.message);
      setLoading(false);
      return null;
    }
  };
  return (
    <SafeContext.Provider value={{ safeAddress, loading, deploySafe }}>
      {children}
    </SafeContext.Provider>
  );
};
export const useSafe = () => useContext(SafeContext);
