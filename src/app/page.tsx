'use client';

import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAF3F0] flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto space-y-8"
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-playfair text-[#A52A2A] mb-6"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            Make This Valentine&apos;s Day Special ❤️
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-700 font-lora mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Create a beautiful, personalized valentine message and make someone&apos;s heart flutter.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-[#A52A2A] text-white rounded-full hover:bg-[#8B0000] transition-colors text-lg font-lora"
              >
                Get Started ✨
              </motion.button>
            </Link>
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-[#A52A2A] border-2 border-[#A52A2A] rounded-full hover:bg-[#FAF3F0] transition-colors text-lg font-lora"
              >
                Sign In
              </motion.button>
            </Link>
          </motion.div>

          <motion.div
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-playfair text-[#A52A2A] mb-3">Easy to Create</h3>
              <p className="text-gray-600">Design your perfect valentine message in minutes</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-playfair text-[#A52A2A] mb-3">Share with Love</h3>
              <p className="text-gray-600">Send your valentine to someone special</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-playfair text-[#A52A2A] mb-3">Make it Personal</h3>
              <p className="text-gray-600">Add photos and custom messages</p>
            </div>
          </motion.div>
        </motion.div>
      </main>

      <footer className="py-6 text-center text-gray-500">
        <p className="text-sm">Made with ❤️ for Valentine&apos;s Day 2024</p>
      </footer>
    </div>
  );
}
