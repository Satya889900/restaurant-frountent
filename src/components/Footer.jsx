const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 text-white relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-lg">🍽️</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-200 to-indigo-200 bg-clip-text text-transparent">
                Restaurant Booking
              </span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed max-w-md">
              Experience fine dining at its best. Book your perfect table for an unforgettable culinary journey with our seamless reservation system.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h3 className="font-semibold text-white mb-4 text-lg">Quick Links</h3>
            <div className="space-y-2">
              <a href="/" className="block text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 transform">
                Home
              </a>
              <a href="/bookings" className="block text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 transform">
                My Bookings
              </a>
              <a href="/about" className="block text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 transform">
                About Us
              </a>
              <a href="/contact" className="block text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 transform">
                Contact
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="text-center md:text-right">
            <h3 className="font-semibold text-white mb-4 text-lg">Contact Us</h3>
            <div className="space-y-2 text-gray-300">
              <p className="flex items-center justify-center md:justify-end space-x-2">
                <span>📞</span>
                <span>(555) 123-4567</span>
              </p>
              <p className="flex items-center justify-center md:justify-end space-x-2">
                <span>✉️</span>
                <span>info@restaurant.com</span>
              </p>
              <p className="flex items-center justify-center md:justify-end space-x-2">
                <span>📍</span>
                <span>123 Gourmet Street, Food City</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2025 Restaurant Booking System. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 transform hover:scale-110">
                <span className="sr-only">Facebook</span>
                📘
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 transform hover:scale-110">
                <span className="sr-only">Twitter</span>
                🐦
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 transform hover:scale-110">
                <span className="sr-only">Instagram</span>
                📷
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute bottom-4 right-4 w-6 h-6 bg-purple-500 rounded-full opacity-20 animate-bounce"></div>
      <div className="absolute top-4 left-4 w-4 h-4 bg-indigo-500 rounded-full opacity-30 animate-pulse"></div>
    </footer>
  );
};

export default Footer;