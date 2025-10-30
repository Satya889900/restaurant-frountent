import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Footer = () => {
return (
<footer className="bg-gradient-to-br from-indigo-50 to-purple-100 text-gray-800 relative overflow-hidden border-t border-gray-200">
{/* Top Gradient Border */}
<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500"></div>

  {/* Background Pattern */}
  <div className="absolute inset-0 opacity-5 pointer-events-none">
    <div className="absolute top-10 left-10 w-24 h-24 bg-purple-500 rounded-full mix-blend-multiply filter blur-lg"></div>
    <div className="absolute bottom-10 right-10 w-20 h-20 bg-indigo-500 rounded-full mix-blend-multiply filter blur-lg"></div>
    <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-green-500 rounded-full mix-blend-multiply filter blur-lg"></div>
  </div>

  {/* Main Content */}
  <div className="relative z-10 max-w-4xl mx-auto px-4 py-6">
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Support Section */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h3 className="font-semibold text-gray-800 mb-2 text-base flex items-center justify-center">
          <span className="text-green-500 mr-1">💬</span>
          Support
        </h3>

        <div className="flex flex-wrap justify-center items-center gap-4">
          {[
            { name: "Help Center", href: "/help", icon: "❓" },
            { name: "Contact Us", href: "/contact", icon: "📞" },
            { name: "Privacy Policy", href: "/privacy-policy", icon: "🔒" },
            { name: "Terms of Service", href: "/terms-of-service", icon: "📝" },
          ].map((link, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
            >
              <Link
                to={link.href}
                className="flex items-center space-x-1 text-gray-600 hover:text-green-600 text-sm transition-colors"
              >
                <span>{link.icon}</span>
                <span>{link.name}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Copyright */}
      <div className="text-center text-gray-500 text-xs border-t border-gray-200 pt-3 w-full">
        © {new Date().getFullYear()} Restaurant System. All rights reserved.
      </div>
    </div>
  </div>
</footer>


);
};

export default Footer;