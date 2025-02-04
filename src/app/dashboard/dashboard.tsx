'use client';

import { GetUserValentinesResponse } from "@/actions";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function Dashboard({data}: {data: GetUserValentinesResponse}) {
  const [valentines, setValentines] = useState(data?.data?.valentines ?? []);

  return (
    <div className="min-h-screen bg-[#FAF3F0] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-playfair text-[#A52A2A]">My Valentines</h1>
          <Link href="/create">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-[#A52A2A] text-white rounded-full hover:bg-[#8B0000] transition-colors text-lg font-lora"
            >
              Create New Valentine ✨
            </motion.button>
          </Link>
        </div>

        <div className="grid gap-4">
          {valentines.map((valentine) => (
            <motion.div
              key={valentine._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-lora text-[#333333] mb-2">{valentine.name}</h2>
                  <p className="text-sm text-gray-500">Created: {valentine.createdAt}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    valentine.status === 'accepted' ? 'bg-green-100 text-green-800' :
                    valentine.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {valentine.status.charAt(0).toUpperCase() + valentine.status.slice(1)}
                  </span>
                  <div className="flex gap-2">
                    <Link href={valentine.customUrl}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 text-[#A52A2A] hover:bg-[#A52A2A]/10 rounded-full"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                          <polyline points="15 3 21 3 21 9"></polyline>
                          <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                      </motion.button>
                    </Link>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this valentine?')) {
                          setValentines(prev => prev.filter(v => v._id !== valentine._id));
                        }
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                      </svg>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}