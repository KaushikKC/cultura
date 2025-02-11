import React from "react";
import { Link } from "react-router-dom";
import {client} from "./wallet/thirdweb/client" 
import {ConnectButton} from "thirdweb/react";

function Navbar() {
  return (
    <nav className="font-poppins bg-[#412E2A] w-full text-white">
      <div className="flex justify-end my-5 mx-20 ">
        <div className="font-poppins space-x-20 text-md flex items-center">
          <Link to="/dashboard" className="">
            Trending
          </Link>
        
          <Link to="/history" className="">
            Meme History
          </Link>

          <button className="cursor-pointer text-[#808000] font-semibold uppercase bg-[#D9D9D9] px-4 py-2 active:translate-x-0.5 active:translate-y-0.5 hover:shadow-[0.5rem_0.5rem_#D1B29A,-0.5rem_-0.5rem_#808000] transition">
            <ConnectButton client={client} 
              connectButton={{ label: "Connect Wallet" }}
              connectModal={{ size: "wide" }}
            />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
