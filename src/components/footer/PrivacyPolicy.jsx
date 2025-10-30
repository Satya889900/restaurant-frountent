import React from 'react';
import { motion } from 'framer-motion';
import { Shield, FileText } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-8 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Privacy Policy</h1>
                <p className="text-indigo-200 mt-1">Last updated: {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 md:p-12 space-y-8 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <FileText className="w-6 h-6 mr-3 text-indigo-500" />
                Introduction
              </h2>
              <p>
                Welcome to FineDine. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us.
              </p>
              <p className="mt-4">
                When you visit our website and use our services, you trust us with your personal information. We take your privacy very seriously. In this privacy notice, we describe our privacy policy. We seek to explain to you in the clearest way possible what information we collect, how we use it and what rights you have in relation to it.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <FileText className="w-6 h-6 mr-3 text-indigo-500" />
                Information We Collect
              </h2>
              <p>
                We collect personal information that you voluntarily provide to us when registering at the website, expressing an interest in obtaining information about us or our products and services, when participating in activities on the website or otherwise contacting us.
              </p>
              <p className="mt-4">
                The personal information that we collect depends on the context of your interactions with us and the website, the choices you make and the products and features you use. The personal information we collect can include the following: Name and Contact Data, Credentials, and Payment Data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <FileText className="w-6 h-6 mr-3 text-indigo-500" />
                How We Use Your Information
              </h2>
              <p>
                We use personal information collected via our website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
              </p>
            </section>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PrivacyPolicy;