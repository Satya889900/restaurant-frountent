import React from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Calendar, Clock } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const UserProfile = () => {
  const { user, loading, isAuthenticated, loginTime } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const DetailItem = ({ icon: Icon, label, value }) => (
    <motion.div variants={itemVariants} className="flex items-start space-x-4">
      <div className="mt-1 flex-shrink-0 w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-lg font-semibold text-gray-800">{value || 'Not available'}</p>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-2xl mx-auto"
        initial="hidden"
        animate="show"
        variants={containerVariants}
      >
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Profile Header */}
          <div className="p-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-center">
            <motion.div 
              variants={itemVariants}
              className="w-24 h-24 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white/50"
            >
              <User className="w-12 h-12 text-white" />
            </motion.div>
            <motion.h1 variants={itemVariants} className="text-3xl font-bold">{user.name}</motion.h1>
            <motion.p variants={itemVariants} className="text-indigo-200 capitalize">{user.role}</motion.p>
          </div>

          {/* Profile Details */}
          <div className="p-8 space-y-6">
            <DetailItem icon={Mail} label="Email Address" value={user.email} />
            <DetailItem icon={Shield} label="User ID" value={user._id} />
            {loginTime && (
              <>
                <DetailItem 
                  icon={Calendar} 
                  label="Last Login Date" 
                  value={loginTime.toLocaleDateString()} 
                />
                <DetailItem 
                  icon={Clock} 
                  label="Last Login Time" 
                  value={loginTime.toLocaleTimeString()} 
                />
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default UserProfile;