'use client';

import { createValentine } from "@/actions";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateValentine() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    message: '',
    phoneNumber: '',
    // customUrl: '',
    from: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await createValentine(formData);
      
      if (!result.success) {
        setError(result.error || 'Failed to create valentine');
        return;
      }

      router.push('/dashboard');
    } catch (err) {
      console.log(err)
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF3F0] p-8">
      <div className="max-w-2xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-playfair text-[#A52A2A] mb-8 text-center"
        >
          Create Your Valentine
        </motion.h1>

        <motion.form 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg shadow-md space-y-6"
        >
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 bg-red-50 text-red-500 rounded-lg text-sm"
            >
              {error}
            </motion.div>
          )}

          <div>
            <label className="block text-gray-700 mb-2 font-lora" htmlFor="name">
              Valentine&apos;s Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#A52A2A] focus:border-transparent outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-lora" htmlFor="phone">
              Your Phone Number (for WhatsApp)
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phoneNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#A52A2A] focus:border-transparent outline-none"
            />
          </div>


          <div>
            <label className="block text-gray-700 mb-2 font-lora" htmlFor="from">
              From (optional)
            </label>
            <input
              type="text"
              id="from"
              value={formData.from}
              onChange={(e) => setFormData(prev => ({ ...prev, from: e.target.value }))}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#A52A2A] focus:border-transparent outline-none"
              placeholder="Your name or leave blank to remain anonymous"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-lora" htmlFor="message">
              Custom Message (optional)
            </label>
            <textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#A52A2A] focus:border-transparent outline-none h-32"
              placeholder="Write your heartfelt message here..."
            />
          </div>

          {/* <div>
            <label className="block text-gray-700 mb-2 font-lora" htmlFor="url">
              Custom URL (optional)
            </label>
            <input
              type="text"
              id="url"
              value={formData.customUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, customUrl: e.target.value }))}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#A52A2A] focus:border-transparent outline-none"
              placeholder="e.g., sarah2024"
            />
          </div> */}

          <motion.button
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            className="w-full py-3 bg-[#A52A2A] text-white rounded-lg hover:bg-[#8B0000] transition-colors font-lora disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Valentine ✨'}
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
}