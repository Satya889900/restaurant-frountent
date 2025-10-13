import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { KeyRound, Lock, Eye, EyeOff, Loader, CheckCircle, AlertCircle } from "lucide-react";
import { resetPassword } from '../services/authService';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "info" });
  const [isLoading, setIsLoading] = useState(false);

  // In a real app, the token/email would come from the URL to identify the user
  const email = searchParams.get("email");

  useEffect(() => {
    if (!email) {
      setMessage({ text: "Invalid password reset link. No email found.", type: "error" });
      setTimeout(() => navigate("/forgot-password"), 3000);
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage({ text: "Passwords do not match.", type: "error" });
      return;
    }
    if (password.length < 6) {
      setMessage({ text: "Password must be at least 6 characters long.", type: "error" });
      return;
    }

    setIsLoading(true);
    setMessage({ text: "", type: "info" });

    try {
      await resetPassword({ email, otp, password });

      setMessage({
        text: "Your password has been reset successfully! Redirecting to login...",
        type: "success",
      });
      
      setTimeout(() => navigate("/login"), 2000);

    } catch (err) {
      setMessage({
        text: err.message || "Failed to reset password. The OTP may be invalid or expired.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-cyan-100 p-4">
      <motion.div
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Reset Your Password</h2>
          <p className="text-gray-500 mt-2">Enter the OTP from your email and your new password.</p>
        </div>

        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center justify-center gap-2 mb-4 p-3 rounded-lg text-sm font-medium ${
              message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {message.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {message.text}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input id="otp" name="otp" type="text" required value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full border border-gray-300 rounded-xl p-3 pl-12 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all" placeholder="OTP from email" />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input id="password" name="password" type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-gray-300 rounded-xl p-3 pl-12 pr-12 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all" placeholder="New Password" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input id="confirmPassword" name="confirmPassword" type={showPassword ? "text" : "password"} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full border border-gray-300 rounded-xl p-3 pl-12 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all" placeholder="Confirm New Password" />
          </div>

          <div>
            <motion.button
              type="submit"
              disabled={isLoading || !email}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-cyan-600 to-green-600 text-white py-3 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? <Loader className="animate-spin w-6 h-6" /> : "Reset Password"}
            </motion.button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm font-medium text-cyan-600 hover:text-cyan-500">
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;