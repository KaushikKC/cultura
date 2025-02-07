import React from "react";
import Safe, {
  PredictedSafeProps,
  SafeAccountConfig,
  SafeDeploymentConfig,
} from "@safe-global/protocol-kit";
import { sepolia } from "viem/chains";
import { ethers5Adapter } from "thirdweb/adapters/ethers5";
import { useActiveAccount } from "thirdweb/react";
import { client } from "thirdweb/client";

const SafeAccountSetup = () => {
  const account = useActiveAccount();

  const chain = sepolia;

  const getSigner = async () => {
    const signer = await ethers5Adapter.signer.toEthers({
      client,
      chain,
      account,
    });
    return signer;
  };

  const safeAccountConfig = {
    owners: ["0xbb7462adA69561Ff596322A2f9595c28E47FD6aa"],
    threshold: 1,
  };

  const predictedSafe = {
    safeAccountConfig,
    // More optional properties
  };

  const protocolKit = async () => {
    const protocolKit = await Safe.init({
      provider: sepolia.rpcUrls.default.http[0],
      signer: getSigner,
      predictedSafe,
    });
    return protocolKit;
  };

  const predictedSafeAddress = async () => {
    const safeAddress = await protocolKit.getAddress();
    console.log("Safe address (predicted ): ", safeAddress);

    return safeAddress;
  };

  const deploymentTransaction = async () => {
    const deploymentTransaction =
      await protocolKit.createSafeDeploymentTransaction();
    return deploymentTransaction;
  };

  const client_safe = async () => {
    const client_safe = await protocolKit.getSafeProvider().getExternalSigner();
    return client_safe;
  };

  const transaction_hash = async () => {
    const transactionHash = await client_safe.sendTransaction({
      to: deploymentTransaction.to,
      value: BigInt(deploymentTransaction.value),
      data: deploymentTransaction.data,
      chain: sepolia,
    });
    return transactionHash;
  };

  const transanction_receipt = async () => {
    const transactionReceipt = await client.waitForTransactionReceipt({
      hash: transactionHash,
    });
    return transactionReceipt;
  };

  const newProtocolKit = async () => {
    const newProtocolKit = await protocolKit.connect({
      safeAddress,
    });
    return newProtocolKit;
    const isSafeDeployed = await newProtocolKit.isSafeDeployed(); // True
    const safeAddress = await newProtocolKit.getAddress();
    const safeOwners = await newProtocolKit.getOwners();
    const safeThreshold = await newProtocolKit.getThreshold();
    console.log(isSafeDeployed, safeAddress, safeOwners, safeThreshold);
  };

  return <div>SafeAccountSetup</div>;
};

export default SafeAccountSetup;
