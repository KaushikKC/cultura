import { useActiveAccount } from "thirdweb/react";
import { createSmartAccountClient } from "permissionless";
import { toSafeSmartAccount } from "permissionless/accounts";
import { createPimlicoClient } from "permissionless/clients/pimlico";
import { createPublicClient, http } from "viem";
import { gnosis } from "viem/chains";

const ENTRYPOINT_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";

const SafeAccountSetup = () => {
  const account = useActiveAccount();

  const setupSafeAccount = async () => {
    if (!account) return;

    console.log("Creating Safe Account...");
    console.log("Account:", account);

    const publicClient = createPublicClient({
      transport: http(`https://rpc.ankr.com/gnosis`),
    });

    console.log(
      process.env.REACT_APP_PIMLICO_API_KEY,
      "REACT_APP_PIMILICO_API_KEY"
    );

    const pimlicoClient = createPimlicoClient({
      transport: http(
        `https://api.pimlico.io/v1/gnosis/rpc?apikey=${process.env.REACT_APP_PIMILICO_API_KEY}`
      ),
      entryPoint: ENTRYPOINT_ADDRESS,
    });

    console.log(pimlicoClient, "pimlicoClient");

    try {
      const safeAccount = await toSafeSmartAccount(publicClient, {
        entryPoint: ENTRYPOINT_ADDRESS,
        signer: account,
        safeVersion: "1.4.1",
      });

      const safeAccountClient = createSmartAccountClient({
        account: safeAccount,
        entryPoint: ENTRYPOINT_ADDRESS,
        chain: gnosis,
        bundlerTransport: http(
          `https://api.pimlico.io/v1/gnosis/rpc?apikey=${process.env.REACT_APP_PIMILICO_API_KEY}`
        ),
        middleware: {
          gasPrice: async () =>
            (await pimlicoClient.getUserOperationGasPrice()).fast,
          sponsorUserOperation: pimlicoClient.sponsorUserOperation,
        },
      });

      console.log("Safe Account Created:", safeAccount.address);
      return safeAccount;
    } catch (error) {
      console.error("Error creating Safe account:", error);
    }
  };

  return (
    <div className="space-y-4">
      {account ? (
        <button
          onClick={setupSafeAccount}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create Safe Account
        </button>
      ) : (
        <div>Please connect your wallet first</div>
      )}
    </div>
  );
};

export default SafeAccountSetup;
