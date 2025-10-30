import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckSquare, X } from 'lucide-react';

const ModalSection = ({ title, icon, children }) => (
  <section>
    <h2 className="text-2xl font-bold mb-4 flex items-center">
      {icon}
      {title}
    </h2>
    <p>{children}</p>
  </section>
);

const TermsOfService = ({ onClose }) => {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    // Overlay background (semi-transparent and blurred)
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose} // close if clicked outside
    >
      <motion.div
        className="max-w-4xl w-full mx-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden relative">
          {/* Header */}
          <div className="p-8 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <CheckSquare className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Terms of Service</h1>
                <p className="text-indigo-200 mt-1">
                  Effective date: {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              aria-label="Close"
              onClick={onClose}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full p-2 transition z-10"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="p-8 md:p-12 space-y-8 text-gray-700 leading-relaxed max-h-[70vh] overflow-y-auto">
            <ModalSection title="1. Agreement to Terms" icon={<FileText className="w-6 h-6 mr-3 text-indigo-500" />}>
              By using our services, you agree to be bound by these Terms. If
              you do not agree, please discontinue use. We may modify the Terms
              at any time, in our sole discretion.
            </ModalSection>

            <ModalSection title="2. Use of Services" icon={<FileText className="w-6 h-6 mr-3 text-indigo-500" />}>
              You agree to use our services only for lawful purposes. Any
              fraudulent, abusive, or illegal activity may result in
              termination.
            </ModalSection>

            <ModalSection title="3. Termination" icon={<FileText className="w-6 h-6 mr-3 text-indigo-500" />}>
              We may terminate your access to our services immediately,
              without prior notice, for any reason whatsoever, including breach
              of these Terms.
            </ModalSection>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TermsOfService;