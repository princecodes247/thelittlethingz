'use client';

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import confetti from 'canvas-confetti';
import MusicPlayer from '@/components/music-player';
import LoveLetter from '@/components/love-letter';
import moment from 'moment';
import { GetValentineResponse } from "@/actions";
import { updateValentineResponse } from "@/actions";
import Link from "next/link";

export default function ValentineView({
  valentine,
  preview = false
}: {
  valentine: GetValentineResponse["data"];
  preview?: boolean;
}) {
  const [timeLeft, setTimeLeft] = useState('');
  const [showSurprise, setShowSurprise] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);

  const storyContent = [
    {
      title: "From the moment we met...",
      content: "Every smile, every laugh we shared became a precious memory.",
      image: valentine?.images?.[0]
    },
    {
      title: "Through all our adventures...",
      content: "Each moment with you has been magical, making every day special.",
      image: valentine?.images?.[1]
    },
    {
      title: "And as time went by...",
      content: "My feelings for you grew stronger with each passing day.",
      image: valentine?.images?.[2]
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      const now = moment();
      const valentinesDay = moment(`${now.year()}-02-14T00:00:00`);
      const duration = moment.duration(valentinesDay.diff(now));

      const days = Math.floor(duration.asDays());
      const hours = duration.hours();
      const minutes = duration.minutes();
      const seconds = duration.seconds();

      const timeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;
      setTimeLeft(timeString);
      // Stop the timer if Valentine's Day has passed
      if (duration.asSeconds() <= 0) {
        setTimeLeft("Happy Valentine's Day! ❤️");
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleNextSection = () => {
    if (currentSection < storyContent.length - 1) {
      setCurrentSection(curr => curr + 1);
    } else {
      setShowQuestion(true);
    }
  };

  const handleYesClick = async () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    setShowSurprise(true);
    if (!preview && valentine) {
      await updateValentineResponse(valentine?.customUrl, 'accepted');
    }
  };

  const handleNoClick = async () => {
    alert("Are you sure? 🥺");
    if (!preview && valentine) {
      await updateValentineResponse(valentine.customUrl, 'rejected');
    }
  };
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="min-h-screen bg-[#FAF3F0] text-[#333333] flex flex-col items-center justify-center p-8">
      {preview && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-0 left-0 right-0 bg-[#A52A2A] text-white py-2 px-4 text-center z-50 flex items-center justify-between"
        >
          <div className="w-20" /> {/* Spacer for centering */}
          <p className="font-lora">
            Preview Mode - This is how your valentine will look 💝
          </p>
          <Link href="/dashboard">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-1 bg-white text-[#A52A2A] rounded-full text-sm font-lora hover:bg-gray-100"
            >
              Back to Dashboard
            </motion.button>
          </Link>
        </motion.div>
      )}
      <MusicPlayer />
      <main className="max-w-2xl w-full text-center space-y-8">
        <AnimatePresence mode="wait">
          {!showQuestion ? (
            <motion.div
              key={currentSection}
              initial={fadeIn.initial}
              animate={fadeIn.animate}
              exit={fadeIn.exit}
              transition={fadeIn.transition}
              className="space-y-8"
            >
              <motion.h2 
                className="text-3xl md:text-4xl font-playfair text-[#A52A2A] mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {storyContent[currentSection].title}
              </motion.h2>
              <motion.div 
                className="relative w-full min-h-64 rounded-lg overflow-hidden mb-4 bg-[#A52A2A]/10"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="relative h-full w-full inset-0 ">
                {(storyContent?.[currentSection]?.image && storyContent?.[currentSection]?.image.length > 0) && 
                <img
                  src={storyContent?.[currentSection]?.image}
                  alt="Our memories"
                  className="max-h-[70vh] object-contain w-full"
                />
              }
                </div>
              </motion.div>
              <motion.p 
                className="text-xl font-lora mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {storyContent[currentSection].content}
              </motion.p>
              <motion.button
                onClick={handleNextSection}
                className="px-6 py-3 bg-[#A52A2A] text-white rounded-full hover:bg-[#8B0000] transition-colors text-lg font-lora"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Continue Our Story →
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="question"
              initial={fadeIn.initial}
              animate={fadeIn.animate}
              exit={fadeIn.exit}
              transition={fadeIn.transition}
            >
              <motion.h1 
                className="text-4xl md:text-6xl font-playfair text-[#A52A2A] mb-8"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                {valentine?.question ?? "Will You Be My Valentine?"}
              </motion.h1>

              <motion.p 
                className="text-xl md:text-2xl font-lora mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Every moment with you makes my heart skip a beat...
              </motion.p>

              <motion.div 
                className="text-lg font-lora text-[#A52A2A] mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Time until Valentine&apos;s Day: {timeLeft}
              </motion.div>
              {!showSurprise &&
              (<motion.div 
                className="flex gap-4 flex-col md:flex-row justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <motion.button
                  onClick={handleYesClick}
                  className="px-8 py-4 bg-[#A52A2A] text-white rounded-full hover:bg-[#8B0000] transition-colors text-lg font-lora"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Yes, I will! 💝
                </motion.button>
                <motion.button
                  onClick={handleNoClick}
                  className="px-8 py-4 bg-[#FFC0CB] text-[#333333] rounded-full hover:bg-[#FFB6C1] transition-colors text-lg font-lora"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Let me think... 🤔
                </motion.button>
              </motion.div>)
          }
              {/* <AnimatePresence>
                {showSurprise && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mt-8 p-6 bg-white rounded-lg shadow-lg"
                  >
                    <p className="text-xl text-[#A52A2A] font-lora">
                      You&apos;ve made me the happiest person! 💕
                      <br />
                      I have a special surprise planned for us...
                    </p>
                  </motion.div>
                )}
              </AnimatePresence> */}

<AnimatePresence>
                {showSurprise && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mt-8 space-y-8"
                  >
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-2xl text-[#A52A2A] font-lora"
                    >
                      You just made my day! I can&apos;t wait to spend Valentine&apos;s with you. ❤️
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                    >
                      <LoveLetter text={valentine?.message} from={valentine?.from}/>
                    </motion.div>

                    <motion.a
                      href={`https://wa.me/${valentine?.phoneNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-8 py-4 bg-[#25D366] text-white rounded-full hover:bg-[#128C7E] transition-colors text-lg font-lora"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.5 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="flex items-center gap-2">
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.289.129.332.202.043.073.043.423-.101.827z"/>
                        </svg>
                        Text Me Now
                      </div>
                    </motion.a>
                  </motion.div>
                )}
              </AnimatePresence>


            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
