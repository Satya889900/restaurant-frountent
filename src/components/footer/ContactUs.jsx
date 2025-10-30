import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Loader } from 'lucide-react';

const ContactUs = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            alert('Thank you for your message! We will get back to you shortly.');
            setFormData({ name: '', email: '', message: '' });
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                className="max-w-5xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {/* Contact Form */}
                        <div className="p-8 md:p-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Get in Touch</h2>
                            <p className="text-gray-600 mb-8">We'd love to hear from you. Please fill out this form.</p>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                                    <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                                    <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500" />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                                    <textarea name="message" id="message" rows="4" value={formData.message} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500"></textarea>
                                </div>
                                <div>
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

                        {/* Contact Info */}
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 md:p-12 text-white">
                            <h2 className="text-3xl font-bold mb-8">Contact Information</h2>
                            <div className="space-y-8">
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Email Us</h3>
                                        <p className="text-indigo-200">Our team is here to help.</p>
                                        <a href="mailto:support@finedine.com" className="text-white font-medium hover:underline">support@finedine.com</a>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Call Us</h3>
                                        <p className="text-indigo-200">Mon-Fri from 8am to 5pm.</p>
                                        <a href="tel:+15551234567" className="text-white font-medium hover:underline">(555) 123-4567</a>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Our Location</h3>
                                        <p className="text-indigo-200">Come say hello at our office.</p>
                                        <p className="text-white font-medium">123 Gourmet Street, Food City, FC 12345</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ContactUs;