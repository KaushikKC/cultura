import { ConnectButton } from "thirdweb/react";
import { client } from "./client";
import { useNavigate } from "react-router-dom";
import { useActiveAccount } from "thirdweb/react";

export default function Wallet() {
  const navigate = useNavigate();
  const account = useActiveAccount();

  return (
    <div>
      <ConnectButton client={client} />
      {account && (
        <button
          onClick={() => navigate("/safe")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Create Safe Account
        </button>
      )}
    </div>
  );
}
