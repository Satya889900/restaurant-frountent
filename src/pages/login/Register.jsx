import { useState, useContext } from "react";
import { register as registerUser } from "../../services/authService.js";
import { AuthContext } from "../../context/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      return alert("All fields are required");
    }
    
    setIsLoading(true);
    try {
      const data = await registerUser({ name, email, password, role: "user" });
      login(data.user, data.token);
      navigate("/");
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Main Card */}
      <div className="relative w-full max-w-md">
        {/* Floating Cards Background */}
        <div className="absolute -inset-4">
          <div className="absolute top-1/4 -left-8 w-32 h-32 bg-purple-500/10 rounded-3xl rotate-12 animate-float"></div>
          <div className="absolute bottom-1/4 -right-8 w-24 h-24 bg-indigo-500/10 rounded-2xl -rotate-12 animate-float animation-delay-2000"></div>
          <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-blue-500/10 rounded-xl rotate-45 animate-float animation-delay-3000"></div>
        </div>

        {/* Registration Card */}
        <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 transform transition-all duration-500 hover:scale-[1.02]">
          {/* Glow Effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/10 to-indigo-500/10 blur-sm"></div>
          
          <div className="relative">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
                <span className="text-3xl">👤</span>
              </div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-200 to-indigo-200 bg-clip-text text-transparent">
                Create Account
              </h1>
              <p className="text-purple-200 text-lg">
                Join us for an exceptional dining experience
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="group">
                <label className="block text-white text-sm font-medium mb-2 ml-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-purple-400">👤</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-4 focus:ring-purple-500/30 focus:border-purple-400 transition-all duration-300 backdrop-blur-sm"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="group">
                <label className="block text-white text-sm font-medium mb-2 ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-purple-400">✉️</span>
                  </div>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-4 focus:ring-purple-500/30 focus:border-purple-400 transition-all duration-300 backdrop-blur-sm"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="group">
                <label className="block text-white text-sm font-medium mb-2 ml-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-purple-400">🔒</span>
                  </div>
                  <input
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-4 focus:ring-purple-500/30 focus:border-purple-400 transition-all duration-300 backdrop-blur-sm"
                    required
                    minLength="6"
                  />
                </div>
                <p className="text-purple-300 text-xs mt-2 ml-1">
                  Must be at least 6 characters long
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group/btn relative overflow-hidden"
              >
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-700 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left"></div>
                
                {/* Button content */}
                <div className="relative flex items-center justify-center space-x-3">
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-lg">🎉</span>
                      <span className="text-lg">Get Started</span>
                    </>
                  )}
                </div>
                
                {/* Shine effect */}
                <div className="absolute inset-0 -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700">
                  <div className="w-1/2 h-full bg-white/20"></div>
                </div>
              </button>
            </form>

            {/* Login Link */}
            <div className="text-center mt-8 pt-6 border-t border-white/10">
              <p className="text-purple-200">
                Already have an account?{" "}
                <Link 
                  to="/login" 
                  className="text-white font-semibold hover:text-purple-200 transition-colors duration-300 underline decoration-2 decoration-purple-400 underline-offset-4 hover:decoration-white"
                >
                  Sign In
                </Link>
              </p>
            </div>

            {/* Features List */}
            <div className="mt-8 grid grid-cols-2 gap-4 text-center">
              <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                <div className="text-lg mb-1">🍽️</div>
                <p className="text-purple-200 text-sm">Easy Booking</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                <div className="text-lg mb-1">⭐</div>
                <p className="text-purple-200 text-sm">Exclusive Deals</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                <div className="text-lg mb-1">📱</div>
                <p className="text-purple-200 text-sm">Mobile Friendly</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                <div className="text-lg mb-1">🔔</div>
                <p className="text-purple-200 text-sm">Instant Notifications</p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent rounded-full"></div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.3;
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-pulse {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }

        /* Input focus effects */
        .group:focus-within label {
          color: white;
        }
        
        /* Custom placeholder color */
        input::placeholder {
          color: rgba(216, 180, 254, 0.6);
        }
        
        /* Hide number input arrows */
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      `}</style>
    </div>
  );
};

export default Register;