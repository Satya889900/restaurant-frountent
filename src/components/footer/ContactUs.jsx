import React, { useState, useEffect } from 'react';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Loader, AlertCircle, X } from 'lucide-react';

const ContactUs = ({ onClose }) => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        fetch(`${API_BASE_URL}/api/contact`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        })
        .then(async (response) => {
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Something went wrong.");
            }
            return data;
        })
        .then(() => {
            setSuccess("Your message has been sent successfully!");
            setFormData({ name: '', email: '', subject: '', message: '' }); // Clear form
        })
        .catch((err) => {
            setError(err.message);
        })
        .finally(() => {
            setIsLoading(false);
        });
    };

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
                className="max-w-lg mx-auto w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden relative">
                    <button
                        aria-label="Close"
                        onClick={onClose}
                        className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition z-10">
                        <X className="w-6 h-6 text-gray-600" />
                    </button>
                    <div>
                        <div className="p-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Contact</h2>
                            <p className="text-gray-600 mb-6">We'd love to hear from you. Please fill out this form.</p>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                                    <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                                    <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500" />
                                </div>
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                                    <input type="text" name="subject" id="subject" value={formData.subject} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500" />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                                    <textarea name="message" id="message" rows="4" value={formData.message} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500"></textarea>
                                </div>
                                <div>
                                    {success && <p className="text-green-600 mb-4">{success}</p>}
                                    {error && (
                                        <div className="flex items-center text-red-600 mb-4">
                                            <AlertCircle className="w-5 h-5 mr-2" /> {error}
                                        </div>
                                    )}
                                    <motion.button
                                        type="submit"
                                        disabled={isLoading}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50"
                                    >
                                        {isLoading ? <Loader className="animate-spin w-5 h-5" /> : <Send className="w-5 h-5 mr-2" />}
                                        {isLoading ? 'Sending...' : 'Send Message'}
                                    </motion.button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ContactUs;