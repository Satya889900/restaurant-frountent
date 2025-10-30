import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import TermsOfService from "./TermsOfService.jsx";
import HelpCenter from "./HelpCenter.jsx";
import ContactUs from "./ContactUs.jsx";
import PrivacyPolicy from "./PrivacyPolicy.jsx";

const Footer = () => {
  const [showTerms, setShowTerms] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <>
      <footer className="bg-gradient-to-br from-indigo-50 to-purple-100 text-gray-800 relative overflow-hidden border-t border-gray-200">
        {/* Top Gradient Border */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
          <div className="flex justify-center">
            <div className="text-center">
              <h3 className="font-bold text-gray-800 mb-4 text-lg flex items-center justify-center md:justify-start">
                <span className="text-green-500 mr-2">💬</span>
                Support
              </h3>
              <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2">
                <motion.button onClick={() => setShowHelp(true)} whileHover={{ scale: 1.05 }} className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors duration-300 group">
                  <span className="text-lg group-hover:scale-110 transition-transform">❓</span>
                  <span className="font-medium">Help Center</span>
                </motion.button>
                <motion.button onClick={() => setShowContact(true)} whileHover={{ scale: 1.05 }} className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors duration-300 group">
                  <span className="text-lg group-hover:scale-110 transition-transform">📞</span>
                  <span className="font-medium">Contact Us</span>
                </motion.button>
                <motion.button onClick={() => setShowPrivacy(true)} whileHover={{ scale: 1.05 }} className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors duration-300 group">
                  <span className="text-lg group-hover:scale-110 transition-transform">🔒</span>
                  <span className="font-medium">Privacy Policy</span>
                </motion.button>
                <motion.button
                  onClick={() => setShowTerms(true)}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors duration-300 group"
                >
                  <span className="text-lg group-hover:scale-110 transition-transform">📝</span>
                  <span className="font-medium">Terms of Service</span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>

      </footer>
      {/* Modals */}
      {showTerms && <TermsOfService onClose={() => setShowTerms(false)} />}
      {showHelp && <HelpCenter onClose={() => setShowHelp(false)} />}
      {showContact && <ContactUs onClose={() => setShowContact(false)} />}
      {showPrivacy && <PrivacyPolicy onClose={() => setShowPrivacy(false)} />}
    </>
  );
};

export default Footer;