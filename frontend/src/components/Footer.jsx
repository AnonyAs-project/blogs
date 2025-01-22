import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa"; // Import social media icons

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
    <div className="max-w-screen-xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col items-center md:items-start">
          <h2 className="text-3xl font-bold text-blue-400 mb-4">
            Blog
          </h2>
          <p className="text-gray-500 text-center md:text-left">
            Your go-to source for the latest in tech, health, and lifestyle.
            Stay updated with our blog for fresh insights and tips!
          </p>
          <div className="flex mt-4 space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook
                className="text-white hover:text-blue-500 transition-colors duration-300"
                size={24}
              />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter
                className="text-white hover:text-blue-400 transition-colors duration-300"
                size={24}
              />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram
                className="text-white hover:text-pink-500 transition-colors duration-300"
                size={24}
              />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin
                className="text-white hover:text-blue-600 transition-colors duration-300"
                size={24}
              />
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-xl font-semibold text-blue-400 mb-4">
            Quick Links
          </h3>
          <ul className="space-y-2">
            <li>
              <a
                href="/"
                className="text-gray-500 hover:text-white transition-colors duration-300"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="/about"
                className="text-gray-500 hover:text-white transition-colors duration-300"
              >
                About Us
              </a>
            </li>
            <li>
              <a
                href="/contact"
                className="text-gray-500 hover:text-white transition-colors duration-300"
              >
                Contact
              </a>
            </li>
            <li>
              <a
                href="/privacy-policy"
                className="text-gray-500 hover:text-white transition-colors duration-300"
              >
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-xl font-semibold text-blue-400 mb-4">
            Contact
          </h3>
          <p className="text-gray-500 mb-2">
            Email:{" "}
            <a
              href="mailto:contact@blog.com"
              className="text-white hover:text-blue-400 transition-colors duration-300"
            >
              contact@blog.com
            </a>
          </p>
          <p className="text-gray-500 mb-2">
            Phone: <span className="text-white">+1 (800) 123-4567</span>
          </p>
          <p className="text-gray-500">
            123 Street, Blog City, ABC 123
          </p>
        </div>
      </div>

      <div className="text-center mt-10">
        <p className="text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Mz Blog. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
  );
}
