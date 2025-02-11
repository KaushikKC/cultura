// SafeContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import Safe from "@safe-global/protocol-kit";
import { sepolia } from "viem/chains";

const SafeContext = createContext();

export const SafeProvider = ({ children }) => {
  const [safeAddress, setSafeAddress] = useState("");
  const [loading, setLoading] = useState(false);

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

      const predictedSafeAddress = await protocolKitInstance.getAddress();
      setSafeAddress(predictedSafeAddress);
      setLoading(false);
      return predictedSafeAddress;
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