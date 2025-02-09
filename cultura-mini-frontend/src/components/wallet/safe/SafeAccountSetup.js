import React, { useState } from "react";
import Safe from "@safe-global/protocol-kit";
import { sepolia } from "viem/chains";
import { ethers5Adapter } from "thirdweb/adapters/ethers5";
import { useActiveAccount } from "thirdweb/react";
import { client } from "./../thirdweb/client";
import SafeApiKit from "@safe-global/api-kit";

const SafeAccountSetup = () => {
  const account = useActiveAccount();
  const [loading, setLoading] = useState(false);
  const [safeAddress, setSafeAddress] = useState("");
  const [agentSafeAddress, setAgentSafeAddress] = useState("");
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
        setProtocolKit(protocolKitInstance);
        console.log(protocolKitInstance, "protocolKitInstance");
        console.log("protocolKit State", protocolKit);

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

  //reinitiate a safe using the docs on uniswap
  const doTransaction = async (currentProtocolKit) => {
    const human_signer = "0x4D4773a3A4576408Deb30d6014e09AaC1c179018";
    console.log("inside doTransaction");

    const tx = await currentProtocolKit.createTransaction({
      transactions: [
        {
          to: "0x0000000000000000000000000000000000000000",
          data: "0x",
          value: "0",
        },
      ],
    });

    // Every transaction has a Safe (Smart Account) Transaction Hash different than the final transaction hash
    const safeTxHash = await currentProtocolKit.getTransactionHash(tx);
    // The AI agent signs this Safe (Smart Account) Transaction Hash
    const signature = await currentProtocolKit.signHash(safeTxHash);

    const apiKit = new SafeApiKit({
      chainId: 11155111n,
    });

    // Now the transaction with the signature is sent to the Transaction Service with the Api Kit:
    const agent_transaction = await apiKit.proposeTransaction({
      safeAddress: human_signer,
      safeTransactionData: tx.data,
      safeTxHash,
      senderSignature: signature.data,
      senderAddress: agentSafeAddress,
    });

    console.log("Agent Transaction:", agent_transaction);
  };

  const deploySafe_Agent = async () => {
    try {
      setLoading(true);

      const account = "0x2397472eBB9b20bE3a612eBaC94e7079Ba9B3cA3"; //wallet2
      const chain = sepolia;

      const signer =
        "1f6496fb9522c1fbb822222eb59e4db2a6165d8bd99f0307fd138797996999a2"; //AgentSigner privatekey (wallet2)

      console.log("Signer:", signer);

      if (!signer) throw new Error("Signer initialization failed.");
      const human_signer = "0x4D4773a3A4576408Deb30d6014e09AaC1c179018"; //deployed safe address of wallet1
      const safeAccountConfig = {
        owners: [account, human_signer], // pass your owners here associated with the signer
        // after deploying a safe account, the signer acts as your private key
        threshold: 2,
      };

      console.log("Deploying Safe with Config:", safeAccountConfig);

      let protocolKitInstance = await Safe.init({
        provider: chain.rpcUrls.default.http[0],
        signer,
        predictedSafe: { safeAccountConfig },
      });

      const safeAddr = await protocolKitInstance.getAddress();
      console.log("Predicted Safe Address:", safeAddr);
      setAgentSafeAddress(safeAddr);

      // Check if Safe is already deployed
      const isDeployed = await protocolKitInstance.isSafeDeployed();
      if (isDeployed) {
        console.log("Safe already deployed, connecting...");
        protocolKitInstance = await protocolKitInstance.connect({
          agentSafeAddress,
        });

        console.log(protocolKitInstance, "protocolKitInstance");

        console.log(protocolKit, "before initialising protocolkit");

        setProtocolKit(protocolKitInstance);

        console.log("Connected to existing Safe.");

        await doTransaction(protocolKitInstance); // Pass the instance directly
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

      console.log(protocolKit, "protocolKit");

      // initialize the Safe Api Kit with the chainId

      // The AI agent creates a transaction with the Safe (Smart Account) address
      const tx = await protocolKit.createTransaction({
        transactions: [
          {
            to: "0x0000000000000000000000000000000000000000",
            data: "0x",
            value: "0",
          },
        ],
      });

      // Every transaction has a Safe (Smart Account) Transaction Hash different than the final transaction hash
      const safeTxHash = await protocolKit.getTransactionHash(tx);
      // The AI agent signs this Safe (Smart Account) Transaction Hash
      const signature = await protocolKit.signHash(safeTxHash);

      const apiKit = new SafeApiKit({
        chainId: 11155111n,
      });

      // Now the transaction with the signature is sent to the Transaction Service with the Api Kit:
      const agent_transaction = await apiKit.proposeTransaction({
        safeAddress: human_signer,
        safeTransactionData: tx.data,
        safeTxHash,
        senderSignature: signature.data,
        senderAddress: agentSafeAddress,
      });

      console.log("Agent Transaction:", agent_transaction);
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
      <button onClick={deploySafe_Agent}>Deploy agent account</button>
      {safeAddress && <p>Safe Address: {safeAddress}</p>}
    </div>
  );
};

export default SafeAccountSetup;
