// import bg from "../images/bg.svg";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
// import { FaShippingFast, FaUserFriends } from "react-icons/fa";
// import { MdOutlineSecurity } from "react-icons/md";

// export default function LandingPage() {
//   const features = [
//     {
//       title: "Fast Transactions",
//       description:
//         "Experience lightning-fast transactions with minimal fees, ensuring smooth and efficient payments.",
//       icon: <FaShippingFast className="text-3xl text-[#412E2A]" />
//     },
//     {
//       title: "Decentralized Security",
//       description:
//         "Our system is secured by blockchain technology, eliminating single points of failure.",
//       icon: <MdOutlineSecurity className="text-3xl text-[#412E2A]" />
//     },
//     {
//       title: "User-Friendly Interface",
//       description:
//         "Navigate easily with an intuitive design that simplifies blockchain interactions.",
//       icon: <FaUserFriends className="text-3xl text-[#412E2A]" />
//     }
//   ];
//   return (
//     <div className="min-h-screen bg-[#412E2A] flex flex-col overflow-hidden">
//       <Navbar />
//       <div className="flex-1 flex items-center justify-center">
//         <div className="relative w-[1500px] h-[686px] rounded-2xl bg-[#D9D9D9] shadow-lg mx-16
//             xl:w-[1300px] xl:h-[600px]
//             lg:w-[1200px] lg:h-[557px]
//             md:w-[900px] md:h-[429px]
//             sm:w-[80vw] sm:h-[386px]
//             xs:h-[300px]">
//           {/* Background Image with Animation */}
//           <img
//             src={bg}
//             className="absolute inset-0 w-full h-full object-contain rounded-2xl p-5 -top-5
//               opacity-0 scale-95 animate-fadeInScale"
//             alt="Background"
//           />

//           {/* Main Text with Delayed Animation */}
// <div className="relative z-10 h-full flex flex-col items-center justify-center text-[#3E2723]
//     text-[80px] p-12
//     xl:text-[60px] xl:p-10
//     lg:text-[56px] lg:p-8
//     md:text-[44px] md:p-6
//     sm:text-[32px] sm:p-4
//     xs:text-[24px] xs:p-3
//     opacity-0 translate-y-5 animate-fadeInText">
//   <div className="flex items-center space-x-4 font-poppins">
//     <span className="text-[#808000] font-gloock">Culture</span>
//     <span>in Motion</span>
//   </div>
//   <div className="flex items-center space-x-4 font-poppins">
//     <span className="text-[#A48873] font-gloock">Creativity</span>
//     <span>in Action</span>
//   </div>
// </div>
//         </div>
//       </div>
//       <div className="my-10 text-[#d9d9d9] flex flex-col items-center justify-center">
//         <div className="flex justify-center items-center space-x-4 font-poppins text-5xl text-[#d9d9d9]">
//           <span className="text-[#A48873] font-gloock">READY</span>
//           <span>To Create ?</span>
//         </div>
//         <p className="mt-5 text-center text-lg">
//           Join Cultura now and be part of the next wave of digital culture!
//         </p>
//         <div className="cursor-pointer text-[#808000] font-semibold uppercase bg-[#d9d9d9] px-4 py-1 my-5 active:translate-x-0.5 active:translate-y-0.5 hover:shadow-[0.5rem_0.5rem_#D1B29A,-0.5rem_-0.5rem_#808000] transition">
//           Start Generating Memes
//         </div>
//       </div>
//       <div className="flex-1 flex items-center justify-center">
//         <div className="relative w-[1500px] h-[686px] rounded-2xl bg-[#D9D9D9] shadow-lg mx-16
//             xl:w-[1300px] xl:h-[650px]
//             lg:w-[1200px] lg:h-[557px]
//             md:w-[900px] md:h-[429px]
//             sm:w-[80vw] sm:h-[386px]
//             xs:h-[300px]">
//           {/* Main Text with Delayed Animation */}
//           <div className="relative z-10 h-full flex flex-col items-center justify-center text-[#3E2723]
//               text-[80px] p-12
//               xl:text-[60px] xl:p-10
//               lg:text-[56px] lg:p-8
//               md:text-[44px] md:p-6
//               sm:text-[32px] sm:p-4
//               xs:text-[24px] xs:p-3
//               opacity-0 translate-y-5 animate-fadeInText">
//             <div className="flex items-center space-x-4 font-poppins">
//               <span className="text-[#808000] font-gloock">Features</span>
//               <span>Of Cultura</span>
//             </div>
//             <p className="mt-5 text-center text-xl">
//               Why Cultura? Because culture is constantly evolving, and so should
//               your creativity. Let an AI-powered curator find the hottest
//               trends, generate killer memes, and secure them on the
//               blockchain—giving you control over content like never before!
//             </p>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-5">
//               {features.map((feature, index) =>
//                 <article className="flex w-[350px] flex-col items-start justify-between border-4 border-[#3E2723] bg-gradient-to-b from-white via-gray-100 to-gray-200 p-6 shadow-[8px_8px_0_0_#3E2723] transition-transform duration-500 ease-in-out transform hover:scale-105 hover:bg-gradient-to-b hover:from-gray-200 hover:to-white transition-shadow hover:shadow-[12px_12px_0_0_#3E2723]">
//                   <div className="group relative">
//                     <div className="relative mb-2 flex items-center gap-x-2">
//                       <div className="text-xl leading-6 mb-8">
//                         <p className="font-black text-black transition-all duration-500 ease-in-out transform hover:scale-120">
//                           <a className="absolute inset-0 " href="#">
//                             {feature.icon}{" "}
//                           </a>
//                         </p>
//                       </div>
//                     </div>
//                     <h3 className="group-hover:text-r[#A48873] mt-3 text-2xl  leading-6 text-black transition-all duration-500 ease-in-out transform hover:scale-105 hover:text-[#A48873]">
//                       <a href="#">
//                         <span className="absolute inset-0 max-w-xs" />
//                         {feature.title}
//                       </a>
//                     </h3>
//                     <p className="text-lg mt-5 border-l-4 border-[#808000] pl-4 leading-6 text-gray-800 transition-all duration-500 ease-in-out transform hover:border-[#A48873] hover:text-gray-600">
//                       "{feature.description}"
//                     </p>
//                   </div>
//                 </article>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// }

import { useEffect } from "react";
import bg from "../images/bg.svg";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaShippingFast, FaUserFriends } from "react-icons/fa";
import { MdOutlineSecurity } from "react-icons/md";

export default function LandingPage() {
  const features = [
    {
      title: "Fast Transactions",
      description:
        "Experience lightning-fast transactions with minimal fees, ensuring smooth and efficient payments.",
      icon: <FaShippingFast className="text-3xl text-[#412E2A]" />
    },
    {
      title: "Decentralized Security",
      description:
        "Our system is secured by blockchain technology, eliminating single points of failure.",
      icon: <MdOutlineSecurity className="text-3xl text-[#412E2A]" />
    },
    {
      title: "User-Friendly Interface",
      description:
        "Navigate easily with an intuitive design that simplifies blockchain interactions.",
      icon: <FaUserFriends className="text-3xl text-[#412E2A]" />
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fadeInUp");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".scroll-animate").forEach(element => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#412E2A] flex flex-col overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 sm:px-8 lg:px-16 xl:px-20 2xl:px-24 py-12">
        <div className="relative w-full max-w-[1500px] h-[60vh] min-h-[300px] max-h-[690px] rounded-2xl bg-[#D9D9D9] shadow-lg scroll-animate opacity-0">
          <img
            src={bg}
            className="absolute inset-0 w-full h-full object-contain rounded-2xl p-5 -top-5 opacity-0 scale-95 animate-fadeInScale"
            alt="Background"
          />
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-[#3E2723]
              text-[80px] p-12
              xl:text-[60px] xl:p-10
              lg:text-[56px] lg:p-8
              md:text-[44px] md:p-6
              sm:text-[30px] sm:p-4
              xs:text-[28px] xs:p-3
               text-[22px] p-2 opacity-0 translate-y-5 animate-fadeInText">
            <div className="flex flex-wrap items-center justify-center space-x-4 sm:space-x-3 xs:space-x-2 font-poppins">
              <span className="text-[#808000] font-gloock">Culture</span>
              <span>in Motion</span>
            </div>
            <div className="flex flex-wrap items-center justify-center space-x-4 sm:space-x-3 xs:space-x-2 font-poppins">
              <span className="text-[#A48873] font-gloock">Creativity</span>
              <span>in Action</span>
            </div>
          </div>
        </div>
      </section>

      <section className="my-10 text-[#d9d9d9] flex flex-col items-center justify-center px-4 sm:px-8 scroll-animate opacity-0">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-3xl sm:text-4xl md:text-5xl">
          <span className="text-[#A48873] font-gloock">READY</span>
          <span className="font-poppins">To Create ?</span>
        </div>
        <p className="mt-3 sm:mt-5 text-center text-sm sm:text-base md:text-lg max-w-[600px] px-4">
          Join Cultura now and be part of the next wave of digital culture!
        </p>
        <button className="cursor-pointer text-[#808000] font-semibold uppercase bg-[#d9d9d9] px-4 py-1 my-3 sm:my-5 text-sm sm:text-base active:translate-x-0.5 active:translate-y-0.5 hover:shadow-[0.5rem_0.5rem_#D1B29A,-0.5rem_-0.5rem_#808000] transition-transform duration-200">
          Start Generating Memes
        </button>
      </section>

      {/* Features Section */}
      <section className="flex-1 flex items-center justify-center px-4 sm:px-8 lg:px-16 xl:px-20 2xl:px-24 py-12">
        <div className="relative w-full max-w-[1500px] h-auto min-h-[400px] rounded-2xl bg-[#D9D9D9] shadow-lg scroll-animate opacity-0">
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-[#3E2723] p-6 sm:p-8 md:p-10 lg:p-12">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl scroll-animate opacity-0">
              <span className="text-[#808000] font-gloock">Features</span>
              <span className="font-poppins">Of Cultura</span>
            </div>
            <p className="mt-4 sm:mt-6 text-center text-sm sm:text-base md:text-lg lg:text-xl max-w-[1200px] px-4 scroll-animate opacity-0">
              Why Cultura? Because culture is constantly evolving, and so should
              your creativity. Let an AI-powered curator find the hottest
              trends, generate killer memes, and secure them on the
              blockchain—giving you control over content like never before!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-8 sm:mt-12 w-full max-w-[1400px] px-4">
              {features.map((feature, index) =>
                <article
                  key={index}
                  className="scroll-animate opacity-0 w-full max-w-[400px] mx-auto border-4 border-[#3E2723] bg-gradient-to-b from-white via-gray-100 to-gray-200 p-4 sm:p-6 shadow-[8px_8px_0_0_#3E2723] transition-all duration-300 hover:scale-[1.02] hover:shadow-[12px_12px_0_0_#3E2723]"
                >
                  <div className="group relative">
                    <div className="mb-4 sm:mb-6 transition-transform duration-300 group-hover:scale-110">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 group-hover:text-[#A48873] transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm sm:text-base md:text-lg border-l-4 border-[#808000] pl-3 sm:pl-4 group-hover:border-[#A48873] transition-colors">
                      "{feature.description}"
                    </p>
                  </div>
                </article>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        @keyframes fadeInScale {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeInScale {
          animation: fadeInScale 1s ease-out forwards;
        }

        @keyframes fadeInText {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInText {
          animation: fadeInText 0.8s ease-out forwards;
          animation-delay: 0.3s;
        }
      `}</style>
    </div>
  );
}
