'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageCircle, Send, ArrowLeft } from 'lucide-react';
import { PROFILE_DATA } from '@/constants/profile';

export function Contact() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // Function to handle opening links
  const openLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoLink = `mailto:${PROFILE_DATA.email}?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`From: ${formData.name} (${formData.email})\n\n${formData.message}`)}`;
    window.open(mailtoLink);
    setShowForm(false);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
     <div className="mx-auto mt-8 w-full">
      <div className="w-fit min-w-64 overflow-hidden rounded-3xl px-4 py-5 font-sans sm:px-4 md:px-6 md:py-5">
        {!showForm ? (
          // Main Contact View
          <>
            {/* Header Section */}
            <div className="mb-4">
              <h2 className="text-foreground text-3xl font-semibold md:text-4xl mb-2">
                Get In Touch
              </h2>
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                <motion.button
                  onClick={() => setShowForm(true)}
                  className="flex items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl whitespace-nowrap"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MessageCircle size={16} />
                  <span>Send Message</span>
                </motion.button>
                <motion.button
                  onClick={() => openLink(`mailto:${PROFILE_DATA.email}`)}
                  className="flex items-center justify-center gap-2 rounded-full border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 whitespace-nowrap"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Mail size={16} />
                  <span>Direct Email</span>
                </motion.button>
              </div>
            </div>

            {/* Email Section */}
            <div className="mt-4 flex flex-col md:mt-5">
              <div className="mb-3">
                <p className="text-muted-foreground mb-2 text-sm">
                  I'm always interested in new opportunities and collaborations. Feel free to reach out!
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{PROFILE_DATA.email}</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex flex-wrap gap-3">
                {PROFILE_DATA.socialMedia.filter(social => social.name !== 'Email').map((social) => (
                  <motion.button
                    key={social.name}
                    className="rounded-lg border border-gray-200 bg-white/50 px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-white hover:shadow-md dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-300 dark:hover:bg-gray-800"
                    onClick={() => openLink(social.url)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {social.name}
                  </motion.button>
                ))}
              </div>
            </div>
          </>
        ) : (
          // Send Message Form View
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header with Back Button */}
            <div className="mb-3 flex items-center gap-4">
              <motion.button
                onClick={() => setShowForm(false)}
                className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ArrowLeft size={20} />
              </motion.button>
              <h2 className="text-foreground text-3xl font-semibold md:text-4xl">
                Send Message
              </h2>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-800"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-800"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-800"
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-800 resize-none"
                  placeholder="Tell me about your project, idea, or just say hi!"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <motion.button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 rounded-lg border border-gray-300 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Send size={18} />
                  Send Message
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Contact;
