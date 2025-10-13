import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Loader, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { requestPasswordReset } from "../services/authService.js";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [message, setMessage] = useState({ text: "", type: "info" });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: "", type: "info" });

    try {
      // In a real app, you would call your API here:
      const res = await requestPasswordReset(email);

      setMessage({
        text: res.message || "OTP sent to your email. Please check your inbox.",
        type: "success",
      });
      // Navigate to the reset password page with the email as a query parameter
      setTimeout(() => navigate(`/reset-password?email=${encodeURIComponent(email)}`), 1000);
    } catch (err) {
      setMessage({
        text: err.message || "Failed to send OTP. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100 p-4">
      <motion.div
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Forgot Password?</h2>
          <p className="text-gray-500 mt-2">
            No worries! Enter your email and we'll send you an OTP to reset it.
          </p>
        </div>

        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center justify-center gap-2 mb-4 p-3 rounded-lg text-sm font-medium ${
              message.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message.type === "success" ? <CheckCircle /> : <AlertCircle />}
            {message.text}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 pl-12 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? <Loader className="animate-spin w-6 h-6" /> : "Send OTP"}
            </motion.button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 flex items-center justify-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;