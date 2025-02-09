import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="font-poppins bg-[#412E2A] w-full text-white">
      <div className="flex justify-end my-5 mx-20 ">
        <div className="font-poppins space-x-20 text-md flex items-center">
          <Link href="/dashboard" className="">
            Trending
          </Link>
          <Link href="/" className="">
            Meme History
          </Link>

          <button className="cursor-pointer text-[#808000] font-semibold uppercase bg-[#D9D9D9] px-4 py-2 active:translate-x-0.5 active:translate-y-0.5 hover:shadow-[0.5rem_0.5rem_#D1B29A,-0.5rem_-0.5rem_#808000] transition">
            Connect Wallet
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
