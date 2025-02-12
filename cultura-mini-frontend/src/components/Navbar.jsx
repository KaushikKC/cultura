import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { client } from "./wallet/thirdweb/client";
import { ConnectButton } from "thirdweb/react";
import { useActiveAccount } from "thirdweb/react";
// import { useSafe } from "./context/SafeContext";

function Navbar() {
  const [showPopup, setShowPopup] = useState(false);
  const account = useActiveAccount();
  // const { safeAddress, deploySafe, loading } = useSafe();

  // useEffect(
  //   () => {
  //     const initializeSafe = async () => {
  //       if (account && !safeAddress) {
  //         await deploySafe(account);
  //       }
  //     };

  //     initializeSafe();
  //   },
  //   [account, deploySafe, safeAddress]
  // );

  return (
    <nav className="font-poppins bg-[#412E2A] w-full text-white">
      <div className="flex justify-between my-4 mx-20 items-center">
        <Link to="/landingpage" className="font-gloock text-[30px]">
          Cultura
        </Link>
        <div className="flex justify-end">
          <div className="font-poppins space-x-20 text-md flex items-center">
            <Link to="/dashboard" className="">
              Trending
            </Link>
            <Link to="/marketplace" className="">
              Explore
            </Link>
            <Link to="/history" className="">
              My Memes
            </Link>
            <div>
              <button
                onClick={() => setShowPopup(true)}
                className="relative text-white cursor-pointer bg-transparent border-none 
             after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-white
             after:transition-[width] after:duration-500 after:ease-in-out 
             hover:after:w-full focus:after:w-full"
              >
                Create Agent
              </button>

              {showPopup &&
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]">
                  <div className="bg-white p-6 md:p-8 w-[90%] md:w-[400px] rounded-lg shadow-xl text-center relative">
                    <h2 className="text-2xl text-[#3E2723]">Create Agent</h2>
                    <p className="mt-3 text-gray-700">
                      This is a sample popup.
                    </p>

                    <button
                      onClick={() => setShowPopup(false)}
                      className="mt-5 px-5 py-2 bg-[#3E2723] text-white rounded-md hover:bg-[#5a3d31] transition-all duration-300"
                    >
                      Close
                    </button>
                  </div>
                </div>}
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="cursor-pointer text-[#808000] font-semibold uppercase bg-[#412E2A] active:translate-x-0.5 active:translate-y-0.5 hover:shadow-[0.5rem_0.5rem_#D1B29A,-0.5rem_-0.5rem_#808000] transition">
                <ConnectButton
                  client={client}
                  connectButton={{
                    label: "Connect Wallet",
                    style: {
                      borderRadius: "0px",
                      minWidth: "165px",
                      height: "50px",
                      padding: "0px",
                      backgroundColor: "#D9D9D9",
                      color: "#3E2723",
                      fontWeight: 600
                    }
                  }}
                  connectModal={{ size: "wide" }}
                />
              </div>
              {/* {account &&
                safeAddress &&
                <span className="text-sm text-white">
                  Safe Account:{" "}
                  {`${safeAddress.slice(0, 6)}...${safeAddress.slice(-4)}`}
                </span>}
              {loading &&
                <span className="text-sm text-white">Deploying Safe...</span>} */}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
