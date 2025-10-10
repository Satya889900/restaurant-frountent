import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-white to-gray-50 text-gray-800 relative overflow-hidden border-t border-gray-200">
      {/* Top Gradient Border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500"></div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-indigo-500 rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-green-500 rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-xl text-white">🍽️</span>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  FineDine
                </span>
                <p className="text-green-600 text-sm font-semibold mt-1">Premium Booking</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed max-w-md">
              Experience fine dining at its best. Book your perfect table for an unforgettable culinary journey with our seamless reservation system.
            </p>
            
            {/* App Badges */}
            <div className="flex space-x-3 mt-4 justify-center md:justify-start">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-gray-900 transition-colors"
              >
                📱 iOS App
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-gray-900 transition-colors"
              >
                🤖 Android App
              </motion.button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="font-bold text-gray-800 mb-4 text-lg flex items-center justify-center md:justify-start">
              <span className="text-purple-500 mr-2">⚡</span>
              Quick Links
            </h3>
            <div className="space-y-3">
              {[
                { name: "Home", href: "/", icon: "🏠" },
                { name: "My Bookings", href: "/bookings", icon: "📅" },
                { name: "Restaurants", href: "/restaurants", icon: "🍴" },
                { name: "Deals & Offers", href: "/offers", icon: "🎁" }
              ].map((link, index) => (
                <motion.a
                  key={index}
                  href={link.href}
                  whileHover={{ x: 5 }}
                  className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors duration-300 group"
                >
                  <span className="text-lg group-hover:scale-110 transition-transform">{link.icon}</span>
                  <span className="font-medium">{link.name}</span>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Support */}
          <div className="text-center md:text-left">
            <h3 className="font-bold text-gray-800 mb-4 text-lg flex items-center justify-center md:justify-start">
              <span className="text-green-500 mr-2">💬</span>
              Support
            </h3>
            <div className="space-y-3">
              {[
                { name: "Help Center", href: "/help", icon: "❓" },
                { name: "Contact Us", href: "/contact", icon: "📞" },
                { name: "Privacy Policy", href: "/privacy", icon: "🔒" },
                { name: "Terms of Service", href: "/terms", icon: "📝" }
              ].map((link, index) => (
                <motion.a
                  key={index}
                  href={link.href}
                  whileHover={{ x: 5 }}
                  className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors duration-300 group"
                >
                  <span className="text-lg group-hover:scale-110 transition-transform">{link.icon}</span>
                  <span className="font-medium">{link.name}</span>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="text-center md:text-left">
            <h3 className="font-bold text-gray-800 mb-4 text-lg flex items-center justify-center md:justify-start">
              <span className="text-blue-500 mr-2">📍</span>
              Contact Info
            </h3>
            <div className="space-y-3">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="flex items-center space-x-3 text-gray-600 group"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <span className="text-blue-600">📞</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">(555) 123-4567</p>
                  <p className="text-sm text-gray-500">24/7 Support</p>
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="flex items-center space-x-3 text-gray-600 group"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <span className="text-purple-600">✉️</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">info@finedine.com</p>
                  <p className="text-sm text-gray-500">Quick Response</p>
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="flex items-center space-x-3 text-gray-600 group"
              >
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <span className="text-green-600">🏢</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">123 Gourmet Street</p>
                  <p className="text-sm text-gray-500">Food City, FC 12345</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-purple-200">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Stay Updated</h3>
              <p className="text-gray-600">Get the latest deals and restaurant updates</p>
            </div>
            <div className="flex space-x-3">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-shadow"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-300">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-600 text-sm">
                © 2024 FineDine Restaurant Booking System. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Made with ❤️ for food lovers everywhere
              </p>
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {[
                { icon: "📘", name: "Facebook", color: "hover:text-blue-600" },
                { icon: "🐦", name: "Twitter", color: "hover:text-blue-400" },
                { icon: "📷", name: "Instagram", color: "hover:text-pink-600" },
                { icon: "💼", name: "LinkedIn", color: "hover:text-blue-700" },
                { icon: "🎵", name: "TikTok", color: "hover:text-black" }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ scale: 1.2, y: -2 }}
                  className={`text-gray-500 ${social.color} transition-colors duration-300`}
                  title={social.name}
                >
                  <span className="text-lg">{social.icon}</span>
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute bottom-4 right-4 w-8 h-8 bg-purple-500 rounded-full opacity-20 animate-bounce"></div>
      <div className="absolute top-4 left-4 w-6 h-6 bg-indigo-500 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-green-500 rounded-full opacity-30 animate-ping"></div>
    </footer>
  );
};

export default Footer;