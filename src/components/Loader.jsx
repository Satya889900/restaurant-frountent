import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Loader as LoaderIcon, 
  Coffee, 
  Utensils, 
  Sparkles, 
  Clock,
  Star,
  ChefHat,
  Wine,
  Heart,
  Gem,
  Crown
} from "lucide-react";

const LoaderComponent = ({ onComplete }) => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);
  const [particles, setParticles] = useState([]);

  const loadingTips = [
    "🎯 Preparing your culinary experience...",
    "🔍 Finding the best tables for you...",
    "⏰ Checking available time slots...",
    "🎁 Loading exclusive offers...",
    "✨ Almost ready to serve you...",
    "👨‍🍳 Our chefs are getting ready...",
    "🍷 Curating the perfect wine selection...",
    "💫 Setting up your premium experience..."
  ];


  useEffect(() => {
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2
    }));
    setParticles(newParticles);
  }, []);

  
  useEffect(() => {
    let progress = 0;
    const totalDuration = 500; 
    const intervalTime = 50; 
    
    const progressInterval = setInterval(() => {
      progress += (100 / (totalDuration / intervalTime));
      
    
      const randomBoost = Math.random() * 3;
      progress += randomBoost;
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(progressInterval);
        setTimeout(() => onComplete?.(), 800);
      }
      
      setLoadingProgress(progress);
    }, intervalTime);

    return () => clearInterval(progressInterval);
  }, [onComplete]);


  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % loadingTips.length);
    }, 1800);

    return () => clearInterval(tipInterval);
  }, [loadingTips.length]);


  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        when: "beforeChildren"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.6,
        ease: "easeInOut"
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.8
    },
    show: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const floatingVariants = {
    float: {
      y: [0, -15, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center z-50 overflow-hidden"
      initial="hidden"
      animate="show"
      exit="exit"
      variants={containerVariants}
    >
          {/* Animated Background Particles */}
          <div className="absolute inset-0 overflow-hidden">
            {particles.map(particle => (
              <motion.div
                key={particle.id}
                className="absolute rounded-full bg-gradient-to-r from-yellow-400 to-orange-400"
                style={{
                  width: particle.size,
                  height: particle.size,
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                }}
                animate={{
                  y: [0, -100, 0],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: particle.duration,
                  repeat: Infinity,
                  delay: particle.delay,
                  ease: "easeInOut"
                }}
              />
            ))}
            
            {/* Animated Gradient Orbs */}
            <motion.div
              className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            <motion.div
              className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.4, 0.2, 0.4],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>

          {/* Main Loader Content */}
          <motion.div
            className="relative bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-8 max-w-md w-full mx-4"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Premium Badge */}
            <motion.div
              className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center space-x-1"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            >
              <Crown size={14} />
              <span>PREMIUM</span>
            </motion.div>

            {/* Logo/Header */}
            <motion.div
              className="text-center mb-8"
              variants={itemVariants}
            >
              <motion.div
                className="relative w-24 h-24 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                  boxShadow: [
                    "0 20px 40px rgba(245, 158, 11, 0.3)",
                    "0 25px 50px rgba(245, 158, 11, 0.5)",
                    "0 20px 40px rgba(245, 158, 11, 0.3)"
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Utensils className="w-12 h-12 text-white" />
                
                {/* Rotating Ring */}
                <motion.div
                  className="absolute -inset-2 border-2 border-yellow-300/50 rounded-2xl"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
              
              <motion.h1 
                className="text-4xl font-bold bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent mb-3"
                variants={itemVariants}
              >
                Gourmet Reserve
              </motion.h1>
              
              <motion.p 
                className="text-white/80 text-lg flex items-center justify-center space-x-2"
                variants={itemVariants}
              >
                <Gem size={18} className="text-yellow-300" />
                <span>Fine Dining Experience</span>
                <Sparkles size={18} className="text-yellow-300" />
              </motion.p>
            </motion.div>

            {/* Animated Loader Section */}
            <motion.div
              className="mb-8"
              variants={itemVariants}
            >
              {/* Main Spinner Container */}
              <div className="relative flex justify-center items-center mb-8">
                {/* Outer Glow */}
                <motion.div
                  className="absolute w-32 h-32 bg-gradient-to-r from-yellow-400/30 to-orange-500/30 rounded-full blur-xl"
                  variants={pulseVariants}
                  animate="pulse"
                />
                
                {/* Main Spinner Rings */}
                <motion.div
                  className="w-20 h-20 border-4 border-white/20 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
                
                <motion.div
                  className="absolute w-20 h-20 border-4 border-t-transparent border-yellow-400 rounded-full"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                
                <motion.div
                  className="absolute"
                  variants={floatingVariants}
                  animate="float"
                >
                  <Sparkles className="w-8 h-8 text-yellow-300" fill="currentColor" />
                </motion.div>

                {/* Floating Icons Around Spinner */}
                <motion.div
                  className="absolute -top-2 -left-2 text-yellow-300"
                  animate={{
                    rotate: 360,
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    rotate: { duration: 6, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity }
                  }}
                >
                  <ChefHat size={16} />
                </motion.div>
                
                <motion.div
                  className="absolute -top-2 -right-2 text-orange-300"
                  animate={{
                    rotate: -360,
                    scale: [1, 1.3, 1]
                  }}
                  transition={{
                    rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                    scale: { duration: 3, repeat: Infinity }
                  }}
                >
                  <Wine size={16} />
                </motion.div>
              </div>

              {/* Progress Section */}
              <div className="space-y-4">
                {/* Progress Bar with Glow */}
                <div className="relative">
                  <div className="bg-white/10 rounded-full h-3 overflow-hidden backdrop-blur-sm">
                    <motion.div
                      className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full relative"
                      initial={{ width: "0%" }}
                      animate={{ width: `${loadingProgress}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                      {/* Progress Shine Effect */}
                      <motion.div
                        className="absolute top-0 right-0 w-20 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                        animate={{ x: [-100, 300] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      />
                    </motion.div>
                  </div>
                  
                  {/* Progress Percentage Indicator */}
                  <motion.div
                    className="absolute -top-8 right-0 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full border border-white/30"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {Math.min(100, Math.round(loadingProgress))}%
                  </motion.div>
                </div>
                
                {/* Progress Labels */}
                <div className="flex justify-between text-white/80 text-sm font-medium">
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Loading...
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center space-x-1"
                  >
                    <Clock size={14} />
                    <span>Just a moment</span>
                  </motion.span>
                </div>
              </div>
            </motion.div>

            {/* Loading Tips with Enhanced Animation */}
            <motion.div
              className="text-center min-h-[4rem] flex items-center justify-center"
              variants={itemVariants}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTip}
                  className="text-white/90 text-lg font-medium flex items-center justify-center space-x-3"
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Heart size={20} className="text-red-400" fill="currentColor" />
                  </motion.div>
                  <span>{loadingTips[currentTip]}</span>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Feature Indicators */}
            <motion.div
              className="flex justify-center space-x-6 mt-6 pt-6 border-t border-white/20"
              variants={itemVariants}
            >
              {[
                { icon: Sparkles, label: "Premium", color: "text-yellow-300" },
                { icon: ChefHat, label: "Expert", color: "text-orange-300" },
                { icon: Wine, label: "Curated", color: "text-red-300" }
              ].map((feature, index) => (
                <motion.div
                  key={feature.label}
                  className="flex flex-col items-center space-y-2"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <motion.div
                    className={`p-2 rounded-full bg-white/10 backdrop-blur-sm ${feature.color}`}
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <feature.icon size={16} />
                  </motion.div>
                  <span className="text-white/60 text-xs font-medium">{feature.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Bottom Signature */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/40 text-sm"
            variants={itemVariants}
          >
            <motion.div
              className="flex items-center space-x-2"
              animate={{ 
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <span>✨ Experience the art of fine dining ✨</span>
            </motion.div>
          </motion.div>
    </motion.div>
  );
};


export const MiniLoader = ({ 
  size = "default", 
  color = "purple",
  withText = false 
}) => {
  const sizes = {
    small: "w-6 h-6",
    default: "w-8 h-8",
    large: "w-12 h-12"
  };

  const colors = {
    purple: "border-purple-200 border-t-purple-600",
    orange: "border-orange-200 border-t-orange-600",
    yellow: "border-yellow-200 border-t-yellow-600"
  };

  return (
    <motion.div
      className="flex items-center space-x-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={`${sizes[size]} border-4 ${colors[color]} rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      {withText && (
        <motion.span
          className="text-gray-600 font-medium"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          Loading...
        </motion.span>
      )}
    </motion.div>
  );
};

export const LoadingOverlay = ({ 
  message = "Loading...",
  subtitle = "",
  withProgress = false 
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (withProgress) {
      const interval = setInterval(() => {
        setProgress(prev => (prev >= 100 ? 100 : prev + Math.random() * 10));
      }, 200);
      return () => clearInterval(interval);
    }
  }, [withProgress]);

  return (
    <motion.div
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 border border-white/20"
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="text-center space-y-4">
          <MiniLoader size="large" color="orange" />
          
          <div className="space-y-2">
            <h3 className="text-white text-lg font-semibold">{message}</h3>
            {subtitle && (
              <p className="text-white/60 text-sm">{subtitle}</p>
            )}
          </div>

          {withProgress && (
            <div className="space-y-2">
              <div className="bg-white/20 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-white/60 text-xs text-right">
                {Math.round(progress)}%
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoaderComponent;