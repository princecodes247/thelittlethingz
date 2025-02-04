'use client';

import { GetUserValentinesResponse, deleteValentine } from "@/actions";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import moment from "moment";
import Link from "next/link";
import { useState } from "react";

// Add this import at the top

export default function Dashboard({data}: {data: GetUserValentinesResponse}) {
  const [valentines, setValentines] = useState(data?.data?.valentines ?? []);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleCopyLink = async (customUrl: string) => {
    const fullUrl = `${window.location.origin}/${customUrl}`;
    await navigator.clipboard.writeText(fullUrl);
    toast({
      description: "Link copied to clipboard!",
      duration: 2000,
    });
  };

  const handleDelete = async (valentineId: string) => {
    if (!confirm('Are you sure you want to delete this valentine?')) {
      return;
    }

    setIsDeleting(valentineId);
    try {
      const result = await deleteValentine(valentineId);
      if (result.success) {
        setValentines(prev => prev.filter(v => v._id !== valentineId));
      } else {
        alert(result.error || 'Failed to delete valentine');
      }
    } catch (error) {
      console.log(error)
      alert('Something went wrong while deleting the valentine');
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF3F0] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col gap-2 md:flex-row justify-between items-center mb-8">
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
          {valentines.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="max-w-sm mx-auto">
                <motion.img
                  src="/empty-heart.svg"
                  alt="No valentines yet"
                  className="w-64 h-64 mx-auto mb-8"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.4 }}
                />
                <h2 className="text-2xl font-playfair text-[#A52A2A] mb-4">
                  No Valentines Yet? Oh My! 💝
                </h2>
                <p className="text-gray-600 mb-8 font-lora">
                  Time to spread some love! Create your first valentine and make someone&apos;s heart skip a beat.
                </p>
                <Link href="/create">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-[#A52A2A] text-white rounded-full hover:bg-[#8B0000] transition-colors text-lg font-lora inline-flex items-center gap-2"
                  >
                    <span>
              Create New Valentine ✨
                      
                    </span>
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          ) : (
            valentines.map((valentine) => (
              <motion.div
                key={valentine._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <div className="flex flex-col gap-2 md:flex-row justify-between md:items-center">
                  <div>
                    <h2 className="text-xl font-lora text-[#333333] mb-2">{valentine.name}</h2>
                    <p className="text-sm text-gray-500">Created: {moment(valentine.createdAt).format('MMMM Do YYYY, h:mm a')}</p>
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
                      <Link href={`/${valentine.customUrl}/preview`} target="_blank">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-full"
                          title="Preview Valentine"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                        </motion.button>
                      </Link>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 text-[#A52A2A] hover:bg-[#A52A2A]/10 rounded-full"
                        onClick={() => handleCopyLink(valentine.customUrl)}
                        title="Copy Link"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                        </svg>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handleDelete(valentine._id)}
                        disabled={isDeleting === valentine._id}
                      >
                        {isDeleting === valentine._id ? (
                          <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 6v6l4 2" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                          </svg>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )))}
          
        </div>
      </div>
    </div>
  );
}