// import Image from "next/image";
// import bg from "./images/bg.svg";

// export default function Home() {
//   return (
//     <div className="flex items-center justify-center max-h-screen">
//       <div className="relative w-[1500px] h-[686px] rounded-2xl bg-[#D9D9D9] shadow-lg mx-16 my-5
//   xl:w-[1300px] xl:h-[600px]
//   lg:w-[1200px] lg:h-[557px]
//   md:w-[900px] md:h-[429px]
//   sm:w-[80vw] sm:h-[386px]
//   xs:h-[300px]">
//         <Image
//           src={bg}
//           className="absolute -top-7 inset-0 w-full h-full object-contain rounded-2xl p-5"
//           alt="Background"
//           priority
//         />

//         {/* Main Text */}
//         <div className="relative z-10 h-full flex flex-col items-center justify-center text-[#3E2723]
//           text-[80px] p-12
//           xl:text-[60px] xl:p-10
//           lg:text-[56px] lg:p-8
//           md:text-[44px] md:p-6
//           sm:text-[32px] sm:p-4
//           xs:text-[24px] xs:p-3">
//           <div className="flex items-center space-x-4">
//             <span className=" text-[#808000] font-gloock">Culture</span>
//             <span>in Motion</span>
//           </div>
//           <div className="flex items-center space-x-4">
//             <span className=" text-[#A48873] font-gloock">Creativity</span>
//             <span>in Action</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import bg from "../images/bg.svg";
import Navbar from "../components/Navbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#412E2A] flex flex-col overflow-hidden">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <div className="relative w-[1500px] h-[686px] rounded-2xl bg-[#D9D9D9] shadow-lg mx-16
            xl:w-[1300px] xl:h-[600px]
            lg:w-[1200px] lg:h-[557px]
            md:w-[900px] md:h-[429px]
            sm:w-[80vw] sm:h-[386px]
            xs:h-[300px]">
          {/* Background Image with Animation */}
          <img
            src={bg}
            className="absolute inset-0 w-full h-full object-contain rounded-2xl p-5
              opacity-0 scale-95 animate-fadeInScale"
            alt="Background"
          />

          {/* Main Text with Delayed Animation */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-[#3E2723]
              text-[80px] p-12
              xl:text-[60px] xl:p-10
              lg:text-[56px] lg:p-8
              md:text-[44px] md:p-6
              sm:text-[32px] sm:p-4
              xs:text-[24px] xs:p-3
              opacity-0 translate-y-5 animate-fadeInText">
            <div className="flex items-center space-x-4 font-poppins">
              <span className="text-[#808000] font-gloock">Culture</span>
              <span>in Motion</span>
            </div>
            <div className="flex items-center space-x-4 font-poppins">
              <span className="text-[#A48873] font-gloock">Creativity</span>
              <span>in Action</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
