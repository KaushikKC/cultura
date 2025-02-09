import React from "react";

const TopicCard = () => {
  return (
    <article className="flex w-[330px] flex-col items-start justify-between border-4 border-[#3E2723] bg-gradient-to-b from-white via-gray-100 to-gray-200 p-6 shadow-[8px_8px_0_0_#3E2723] transition-transform duration-500 ease-in-out transform hover:scale-105 hover:bg-gradient-to-b hover:from-gray-200 hover:to-white transition-shadow hover:shadow-[12px_12px_0_0_#3E2723]">
      <div className="group relative">
        <h3 className="group-hover:text-r[#A48873] mt-3 text-2xl font-black uppercase leading-6 text-black transition-all duration-500 ease-in-out transform hover:scale-105 hover:text-[#A48873]">
          <a href="#">
            <span className="absolute inset-0 max-w-xs" />ETHPONDY
          </a>
        </h3>
        <p className="text-md mt-5 border-l-4 border-[#808000] pl-4 leading-6 text-gray-800 transition-all duration-500 ease-in-out transform hover:border-[#A48873] hover:text-gray-600">
          "When you struggle with a problem, that's when you understand it."
        </p>
      </div>
      <div className="relative mt-2 flex items-center gap-x-2">
        <div className="text-sm leading-6">
          <p className="font-black text-black transition-all duration-500 ease-in-out transform hover:scale-110">
            <a className="hover:underline hover:text-red-500" href="#">
              <span className="absolute inset-0" />Engagement: 50 ❤️
            </a>
          </p>
        </div>
      </div>
    </article>
  );
};

export default TopicCard;
