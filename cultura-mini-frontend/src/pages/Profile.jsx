import React from "react";
import Navbar from "../components/Navbar";
import { FaWallet } from "react-icons/fa";
import Footer from "../components/Footer";
import { useActiveAccount } from "thirdweb/react";

function Profile() {
  const address = useActiveAccount();

  return (
    <div className="bg-[#412E2A] min-h-screen">
      <Navbar />

      <div className="bg-[#D9D9D9] text-[#3E2723] min-h-screen px-4 sm:px-6 md:px-10 lg:px-16 flex flex-col items-center justify-center">
        <div
          className="relative z-10 flex flex-col items-center justify-center text-[#3E2723] text-center
        text-[32px] sm:text-[40px] md:text-[46px] lg:text-[52px] xl:text-[58px]
        p-6 sm:p-8 md:p-10 lg:p-12"
        >
          <div className="flex flex-wrap justify-center items-center space-x-2 sm:space-x-4">
            <span className="text-[#808000] font-gloock">PROFILE</span>
          </div>

          {address?.address ? (
            <>
              <div className="mt-2 flex items-center bg-gray-100 px-4 py-2 rounded-lg border border-black shadow-md">
                <FaWallet className="text-xl mr-2 text-black" />
                {address.address.slice(0, 6) +
                  "..." +
                  address.address.slice(-4)}
              </div>
              <button
                className="mt-6 relative text-[#3E2723] inline-block font-medium text-[15px] w-fit px-4 py-1 cursor-pointer border-none bg-white hover:text-white transition-colors duration-500
              before:content-[''] before:absolute before:top-0 before:bottom-0 before:left-0 before:right-full before:bg-[#3E2723] before:opacity-0 before:-z-10 before:transition-all before:duration-500
              hover:before:right-0 hover:before:opacity-100
              -skew-x-[21deg] group"
              >
                <span className="inline-block skew-x-[21deg]">
                  Claim Rewards
                </span>
              </button>
            </>
          ) : (
            <p className="mt-6 text-lg text-red-600 font-semibold">
              Connect your wallet to collect your revenue.
            </p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Profile;
