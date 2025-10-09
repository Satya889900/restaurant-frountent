import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

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

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: "/", label: "Home", show: user },
    { path: "/bookings", label: "My Bookings", show: user },
    { path: "/admin", label: "Admin Panel", show: user?.role === "admin" },
  ];

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white shadow-2xl relative border-b border-purple-500/20">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 group"
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <span className="text-xl">🍽️</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-200 to-indigo-200 bg-clip-text text-transparent">
                Restaurant Booking
              </h1>
              <p className="text-xs text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Fine dining experience
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => 
              item.show && (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    isActiveRoute(item.path)
                      ? "bg-white/10 text-white shadow-lg backdrop-blur-sm border border-white/20"
                      : "text-purple-200 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}

            {/* Auth Buttons */}
            <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-purple-500/30">
              {!user ? (
                <>
                  <Link
                    to="/login"
                    className="px-6 py-2 rounded-xl font-medium text-purple-200 hover:text-white hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/10"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl font-medium text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-purple-400/30"
                  >
                    Register
                  </Link>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 bg-white/5 rounded-xl px-4 py-2 border border-white/10">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-purple-200">
                      Welcome, {user.name}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl font-medium text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-red-400/30 flex items-center space-x-2"
                  >
                    <span>🚪</span>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex flex-col space-y-1">
                <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
                <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></div>
                <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="py-4 space-y-2 border-t border-purple-500/20">
            {navItems.map((item) => 
              item.show && (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                    isActiveRoute(item.path)
                      ? "bg-white/10 text-white backdrop-blur-sm border border-white/20"
                      : "text-purple-200 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
            
            {/* Mobile Auth Buttons */}
            <div className="pt-4 border-t border-purple-500/20 space-y-2">
              {!user ? (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 text-center text-purple-200 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-all duration-300 border border-white/10"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 text-center bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl font-medium text-white shadow-lg transition-all duration-300"
                  >
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <div className="px-4 py-3 text-center text-purple-200 bg-white/5 rounded-xl border border-white/10">
                    Welcome, {user.name}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl font-medium text-white shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <span>🚪</span>
                    <span>Logout</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation indicator */}
      <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300"></div>
    </nav>
  );
};

export default Navbar;