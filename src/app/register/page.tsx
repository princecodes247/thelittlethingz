'use client';

import { authClient } from "@/lib/auth-client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Register() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [passwordError, setPasswordError] = useState('');

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    // if (!/[A-Z]/.test(password)) {
    //   return 'Password must contain at least one uppercase letter';
    // }
    // if (!/[a-z]/.test(password)) {
    //   return 'Password must contain at least one lowercase letter';
    // }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    }
    // if (!/[!@#$%^&*]/.test(password)) {
    //   return 'Password must contain at least one special character (!@#$%^&*)';
    // }
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));

    if (id === 'password') {
      setPasswordError(validatePassword(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const passwordValidation = validatePassword(formData.password);
    if (passwordValidation) {
      setPasswordError(passwordValidation);
      return;
    }

    setIsLoading(true);
    
    try {
      await authClient.signUp.email({ 
        email: formData.email, 
        password: formData.password, 
        name: formData.name, 
      }, { 
        onRequest: () => {
          setIsLoading(true);
        }, 
        onSuccess: () => {
          router.push('/dashboard');
        }, 
        onError: (ctx) => {
          switch (ctx.error.code) {
            case 'EMAIL_EXISTS':
              setError('This email is already registered');
              break;
            case 'INVALID_EMAIL':
              setError('Please enter a valid email address');
              break;
            case 'WEAK_PASSWORD':
              setError('Please choose a stronger password');
              break;
            default:
              setError(ctx.error.message || 'Registration failed. Please try again.');
          }
        }, 
      });
    } catch (error) {
      console.log('Registration failed. Please try again.', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF3F0] flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-lg shadow-md"
        >
          <h1 className="text-3xl font-playfair text-[#A52A2A] mb-8 text-center">Create Account</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12" y2="16" />
                  </svg>
                  {error}
                </div>
              </motion.div>
            )}

            <div>
              <label className="block text-gray-700 mb-2 font-lora" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#A52A2A] focus:border-transparent outline-none"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-lora" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#A52A2A] focus:border-transparent outline-none"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-lora" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#A52A2A] focus:border-transparent outline-none ${
                  passwordError ? 'border-red-500' : ''
                }`}
                required
                disabled={isLoading}
              />
              {passwordError && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-1"
                >
                  {passwordError}
                </motion.p>
              )}
              <p className="text-gray-500 text-xs mt-2">
                {/* Password must contain at least 8 characters, including uppercase, lowercase, 
                number, and special character. */}
                Password must contain at least 8 characters, and include a number.
              </p>
            </div>

            <motion.button
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              className="w-full py-3 bg-[#A52A2A] text-white rounded-lg hover:bg-[#8B0000] transition-colors font-lora disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-[#A52A2A] hover:underline">
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}