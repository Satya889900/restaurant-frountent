import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsMenuOpen(false);
  };

  const handleBookTableClick = () => {
    setIsMenuOpen(false);
    if (location.pathname === "/") {
      document.getElementById("booking-section")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/#booking-section");
      setTimeout(() => {
        document.getElementById("booking-section")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  const isActiveRoute = (path) => location.pathname === path;

  const navItems = [
    { path: "/", label: "Home", show: user },
    { path: "/bookings", label: "My Bookings", show: user },
    { path: "/admin", label: "Admin Panel", show: user?.role === "admin" },
  ];

  return (
    <nav className="bg-white text-gray-800 shadow-lg border-b border-gray-200">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-between items-center py-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-3 group"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg"
            >
              <span className="text-xl text-white">🍽️</span>
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                FineDine
              </h1>
              <p className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Premium Restaurant Booking
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center flex-wrap space-x-2">
            {navItems.map(
              (item) =>
                item.show && (
                  <motion.div key={item.path} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to={item.path}
                      className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 border-2 ${
                        isActiveRoute(item.path)
                          ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg border-transparent"
                          : "text-gray-600 hover:text-purple-600 border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                )
            )}
            {user && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <button
                  onClick={handleBookTableClick}
                  className="px-4 py-2 rounded-xl font-semibold transition-all duration-300 border-2 text-gray-600 hover:text-purple-600 border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                >
                  Book a Table
                </button>
              </motion.div>
            )}

            {/* Auth Buttons */}
            {!user ? (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-xl font-semibold text-gray-600 hover:text-purple-600 transition-all duration-300 border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                  >
                    Login
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:from-purple-600 hover:to-indigo-700"
                  >
                    Get Started
                  </Link>
                </motion.div>
              </>
            ) : (
              <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-300">
                <Link to="/profile">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center space-x-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl px-4 py-2 border-2 border-green-200 cursor-pointer"
                  >
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <div>
                      <span className="text-sm font-semibold text-gray-700">Welcome, {user.name}</span>
                      <p className="text-xs text-green-600 font-medium">✓ Verified User</p>
                    </div>
                  </motion.div>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent flex items-center space-x-2"
                >
                  <span>🚪 Logout</span>
                </motion.button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg text-white hover:shadow-xl transition-all duration-300"
            >
              <div className="flex flex-col space-y-1">
                <div
                  className={`w-6 h-0.5 bg-white transition-all duration-300 ${
                    isMenuOpen ? "rotate-45 translate-y-1.5" : ""
                  }`}
                ></div>
                <div
                  className={`w-6 h-0.5 bg-white transition-all duration-300 ${
                    isMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                ></div>
                <div
                  className={`w-6 h-0.5 bg-white transition-all duration-300 ${
                    isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                  }`}
                ></div>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden mt-2 bg-white rounded-2xl shadow-lg border"
            >
              <div className="py-4 space-y-3">
                {navItems.map(
                  (item) =>
                    item.show && (
                      <motion.div key={item.path} whileHover={{ scale: 1.02 }}>
                        <Link
                          to={item.path}
                          onClick={() => setIsMenuOpen(false)}
                          className={`block px-6 py-3 rounded-xl font-semibold transition-all duration-300 border-2 ${
                            isActiveRoute(item.path)
                              ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg border-transparent"
                              : "text-gray-600 hover:text-purple-600 border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                          }`}
                        >
                          {item.label}
                        </Link>
                      </motion.div>
                    )
                )}
                {user && (
                  <motion.div whileHover={{ scale: 1.02 }}>
                    <button
                      onClick={handleBookTableClick}
                      className="block w-full text-left px-6 py-3 rounded-xl font-semibold transition-all duration-300 border-2 text-gray-600 hover:text-purple-600 border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                    >
                      Book a Table
                    </button>
                  </motion.div>
                )}

                {/* Auth Buttons */}
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  {!user ? (
                    <>
                      <motion.div whileHover={{ scale: 1.02 }}>
                        <Link
                          to="/login"
                          onClick={() => setIsMenuOpen(false)}
                          className="block px-6 py-3 text-center text-gray-600 hover:text-purple-600 rounded-xl font-semibold transition-all duration-300 border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                        >
                          Login
                        </Link>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.02 }}>
                        <Link
                          to="/register"
                          onClick={() => setIsMenuOpen(false)}
                          className="block px-6 py-3 text-center bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 border-2 border-transparent"
                        >
                          Get Started
                        </Link>
                      </motion.div>
                    </>
                  ) : (
                    <>
                      <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="block px-6">
                        <div className="py-3 text-center bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                          <p className="font-semibold text-gray-700">Welcome, {user.name}</p>
                          <p className="text-sm text-green-600 font-medium">✓ Verified User</p>
                        </div>
                      </Link>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        onClick={handleLogout}
                        className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 border-2 border-transparent flex items-center justify-center space-x-2"
                      >
                        <span>🚪 Logout</span>
                      </motion.button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
