'use client';

import { createValentine } from "@/actions";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
// Add to imports
import { ChangeEvent } from "react";
import Image from "next/image";

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
    customQuestion: '',
  });

  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 3) {
      setError('Maximum 3 images allowed');
      return;
    }

    const newImages = files.filter(file => file.type.startsWith('image/'));
    setImages(prev => [...prev, ...newImages]);

    // Create preview URLs
    const newUrls = newImages.map(file => URL.createObjectURL(file));
    setImageUrls(prev => [...prev, ...newUrls]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(imageUrls[index]);
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  // Update handleSubmit to include images
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formDataWithFiles = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataWithFiles.append(key, value);
    });
    images.forEach((image) => {
      formDataWithFiles.append('files[]', image);
    });

    try {
      const result = await createValentine(formDataWithFiles);
      
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
              Your Phone Number (for WhatsApp, include your country code e.g. +234)
            </label>
            <input
              type="tel"
              id="phone"
              placeholder="+234xoxo"
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
            <label className="block text-gray-700 mb-2 font-lora" htmlFor="customQuestion">
              Custom Question (optional)
            </label>
            <input
              type="text"
              id="customQuestion"
              value={formData.customQuestion}
              onChange={(e) => setFormData(prev => ({ ...prev, customQuestion: e.target.value }))}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#A52A2A] focus:border-transparent outline-none"
              placeholder="e.g., Will you go on a date with me?"
            />
            <p className="mt-1 text-sm text-gray-500">
              Default: &quot;Will You Be My Valentine?&quot;
            </p>
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
        <div>
            <label className="block text-gray-700 mb-2 font-lora">
              Upload Images (optional, max 3)
            </label>
            <div className="space-y-4">
              <div className="flex gap-4 flex-wrap">
                {imageUrls.map((url, index) => (
                  <div key={url} className="relative w-24 h-24">
                    <Image
                      src={url}
                      alt={`Upload ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                    <motion.button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      ×
                    </motion.button>
                  </div>
                ))}
              </div>
              {images.length < 3 && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-[#A52A2A] file:text-white
                    hover:file:bg-[#8B0000]"
                  multiple
                />
              )}
            </div>
          </div>
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