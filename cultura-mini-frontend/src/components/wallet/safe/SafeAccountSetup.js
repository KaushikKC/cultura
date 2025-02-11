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
        process.env.REACT_APP_PRIVATE_KEY_WALLET_USER_1,
        "process.env.REACT_APP_PRIVATE_KEY"
      );
      console.log(process.env);

      const signer = process.env.REACT_APP_PRIVATE_KEY_WALLET_USER_1; // pass your signer here, e.g. from thirdweb or ethers.js or private key
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
  // working .... 
  // multisig (one acting as ai agent and another acts as human signer method)

  const doTransaction = async (currentProtocolKit) => {
    const human_signer_wallet2 = "0x2397472eBB9b20bE3a612eBaC94e7079Ba9B3cA3";
    console.log("inside doTransaction");
    const preExistingSafe = await Safe.init({
      provider:
        "https://eth-sepolia.g.alchemy.com/v2/qf8pc1s5D85eDw9E_r_Ck45C6WoRQqkL",
      signer:
        "1f6496fb9522c1fbb822222eb59e4db2a6165d8bd99f0307fd138797996999a2", //wallet 2 private key
      safeAddress: "0x06b2EC9126E0C67F2399B88539F99dd009b47B3d", // safe address deployed for wallet 2 and the respective signer is above
    });

    const tx = await preExistingSafe.createTransaction({
      transactions: [
        {
          to: "0x0000000000000000000000000000000000000000",
          data: "0x",
          value: "0",
        },
      ],
    });

    console.log(tx,'tx')
    // Every transaction has a Safe (Smart Account) Transaction Hash different than the final transaction hash
    const safeTxHash = await preExistingSafe.getTransactionHash(tx);
    console.log(safeTxHash, "safeTxHash");
    // The AI agent signs this Safe (Smart Account) Transaction Hash
    const signature = await preExistingSafe.signHash(safeTxHash);
    console.log(signature, "signature");
    const apiKit = new SafeApiKit({
      chainId: 11155111n,
    });

    
    try {
      const agent_transaction = await apiKit.proposeTransaction({
          safeAddress: "0x06b2EC9126E0C67F2399B88539F99dd009b47B3d",
          safeTransactionData: tx.data,
          safeTxHash,
          senderSignature: signature.data,
          senderAddress: human_signer_wallet2,
      });
      console.log("Proposing transaction with:", {
        safeAddress: "0x06b2EC9126E0C67F2399B88539F99dd009b47B3d",
        safeTransactionData: tx.data,
        safeTxHash,
        senderSignature: signature.data,
        senderAddress: human_signer_wallet2
    });
      console.log("Agent Transaction:", agent_transaction);
  } catch (error) {
      console.error("Error in proposeTransaction:", error);
      // Log the actual response if it exists
      if (error.response) {
          console.error("Response data:", error.response.data);
      }
  }
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
      const human_signer1 = "0xbb7462adA69561Ff596322A2f9595c28E47FD6aa"; //deployed safe address of wallet1
      const human_signer2 = "0xC75BAbFCe9E6bcB5f72D2A6031bdc41c38b9426a";
      const safeAccountConfig = {
        owners: [account, human_signer1,human_signer2], // pass your owners here associated with the signer
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
        safeAddress: agentSafeAddress,
        safeTransactionData: tx.data,
        safeTxHash,
        senderSignature: signature.data,
        senderAddress: account,
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
