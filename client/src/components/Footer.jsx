import React from "react";
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center space-y-6">
          {/* About Section */}
          <div className="text-center max-w-2xl">
            <h3 className="text-2xl font-bold text-white mb-4">About LMS</h3>
            <p className="text-base leading-relaxed">
              Empowering learners worldwide with quality education. Our platform
              provides accessible and interactive learning experiences for
              everyone.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex space-x-6">
            <a
              href="https://github.com/singhHariom1"
              target="_blank"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaGithub size={24} />
            </a>
            <a
              href="https://www.linkedin.com/in/hariom-singh6199/"
              target="_blank"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaLinkedin size={24} />
            </a>
            <a
              href="https://x.com/BarbellToBinary"
              target="_blank"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaTwitter size={24} />
            </a>
            <a
              href="https://www.instagram.com/stoic.liftss/"
              target="_blank"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaInstagram size={24} />
            </a>
          </div>

          {/* Contact Info */}
          <div className="text-center">
            <p className="text-base font-medium">
              Email: singh.hariom6199@gmail.com
            </p>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 w-full pt-6 text-center">
            <p className="text-sm font-light">
              © {new Date().getFullYear()} ElevateX. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
