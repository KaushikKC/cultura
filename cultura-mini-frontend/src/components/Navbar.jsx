import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { client } from "./wallet/thirdweb/client";
import { ConnectButton } from "thirdweb/react";
import { useActiveAccount } from "thirdweb/react";
import { useSafe } from "./context/SafeContext";

function Navbar() {
  const account = useActiveAccount();
  const { safeAddress, deploySafe, loading } = useSafe();

  useEffect(() => {
    const initializeSafe = async () => {
      if (account && !safeAddress) {
        await deploySafe(account);
      }
    };

    initializeSafe();
  }, [account, deploySafe, safeAddress]);

  return (
    <nav className="font-poppins bg-[#412E2A] w-full text-white">
      <div className="flex justify-end my-5 mx-20">
        <div className="font-poppins space-x-20 text-md flex items-center">
          <Link to="/dashboard" className="">
            Trending
          </Link>
          
          <Link to="/history" className="">
            Meme History
          </Link>

          <div className="flex flex-col items-end gap-2">
            <button className="cursor-pointer text-[#808000] font-semibold uppercase bg-[#D9D9D9] px-4 py-2 active:translate-x-0.5 active:translate-y-0.5 hover:shadow-[0.5rem_0.5rem_#D1B29A,-0.5rem_-0.5rem_#808000] transition">
              <ConnectButton
                client={client}
                connectButton={{ label: "Connect Wallet" }}
                connectModal={{ size: "wide" }}
              />
            </button>
            {account && safeAddress && (
              <span className="text-sm text-white">
                Safe Account: {`${safeAddress.slice(0, 6)}...${safeAddress.slice(-4)}`}
              </span>
            )}
            {loading && (
              <span className="text-sm text-white">Deploying Safe...</span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;