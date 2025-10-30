import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Search, ChevronDown, X } from 'lucide-react';

const faqs = [
    {
        question: "How do I book a table?",
        answer: "To book a table, simply go to the homepage, select your desired date and time, and browse the available tables. Click 'Book' on your chosen table and confirm your reservation."
    },
    {
        question: "Can I cancel my booking?",
        answer: "Yes, you can cancel your booking. Go to the 'My Bookings' page, find the reservation you wish to cancel, and click the 'Cancel' button. Please note any cancellation policies that may apply."
    },
    {
        question: "How do I apply a discount or offer?",
        answer: "When you are in the booking confirmation modal, any available offers for that table will be displayed. Simply select the offer you wish to use, and it will be applied to your booking."
    },
    {
        question: "Is my payment information secure?",
        answer: "Absolutely. We use industry-standard encryption to protect your data. Your payment details are processed securely and are not stored on our servers."
    },
    {
        question: "How can I view my past bookings?",
        answer: "Your past and upcoming bookings are all available on the 'My Bookings' page, accessible from the navigation bar after you log in."
    }
];

const FAQItem = ({ faq }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div layout className="border-b border-gray-200">
            <motion.button
                layout
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center py-5 text-left"
            >
                <span className="font-semibold text-lg text-gray-800">{faq.question}</span>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                </motion.div>
            </motion.button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <p className="pb-5 text-gray-600 leading-relaxed">{faq.answer}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const HelpCenter = ({ onClose }) => {
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
        <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <motion.div
                className="max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden relative">
                    {/* Header */}
                    <div className="p-8 bg-gradient-to-r from-gray-700 to-gray-900 text-white">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                                <HelpCircle className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold">Help Center</h1>
                                <p className="text-gray-300 mt-1">How can we help you?</p>
                            </div>
                        </div>
                        <div className="mt-8 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search for answers..."
                                className="w-full bg-white/10 border border-white/20 rounded-xl p-4 pl-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
                            />
                        </div>
                        <button
                            aria-label="Close"
                            onClick={onClose}
                            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full p-2 transition z-10"
                        >
                            <X className="w-6 h-6 text-white" />
                        </button>
                    </div>

                    {/* FAQs */}
                    <div className="p-8 md:p-12">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
                        <div className="space-y-2">
                            {faqs.map((faq, index) => (
                                <FAQItem key={index} faq={faq} />
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default HelpCenter;