import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#412E2A] text-gray-300 py-10">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Logo & About */}
          <div>
            <h2 className="text-2xl text-white">Cultura</h2>
            <p className="mt-2 text-sm text-gray-400">
              Elevating experiences through design and innovation.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg text-white mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-[#D1B29A] transition">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#D1B29A] transition">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#D1B29A] transition">
                  Services
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#D1B29A] transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg text-white mb-3">Follow Us</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              <a href="#" className="text-xl hover:text-[#D1B29A] transition">
                <FaFacebook />
              </a>
              <a href="#" className="text-xl hover:text-[#D1B29A] transition">
                <FaTwitter />
              </a>
              <a href="#" className="text-xl hover:text-[#D1B29A] transition">
                <FaInstagram />
              </a>
              <a href="#" className="text-xl hover:text-[#D1B29A] transition">
                <FaGithub />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-10 text-center border-t border-gray-600 pt-5 text-sm">
          <p>&copy; 2025 Cultura. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
