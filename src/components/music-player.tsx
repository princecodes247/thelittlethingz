'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-3">
      <audio
        ref={audioRef}
        src="/background-music.mp3"
        loop
      />
      <button
        onClick={togglePlay}
        className="bg-[#A52A2A]/80 hover:bg-[#A52A2A] text-white rounded-full p-3 backdrop-blur-sm transition-all"
      >
        {isPlaying ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 15.536A5 5 0 0015.536 8.464M18.364 18.364A9 9 0 0018.364 5.636" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 9.172A3 3 0 009.172 14.828M12 12v.01" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1V10a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
        )}
      </button>
      {!isPlaying && (
        <motion.span
          initial={{ opacity: 0.5, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="text-[#A52A2A] font-lora text-sm bg-white/80 px-3 py-1 rounded-full backdrop-blur-sm"
        >
          Play our song ♪
        </motion.span>
      )}
    </div>
  );
}