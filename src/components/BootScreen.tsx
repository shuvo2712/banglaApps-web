import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const BootScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [textIndex, setTextIndex] = useState(0);

  const loadingTexts = [
    "Initializing Agentic Core...",
    "Connecting to uddoktaOS...",
    "Establishing Sheba Link...",
    "Calibrating BanglaPay...",
    "Synchronizing Orbits...",
    "System Ready."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 800);
          return 100;
        }
        return prev + 2;
      });
    }, 40);

    return () => clearInterval(timer);
  }, [onComplete]);

  useEffect(() => {
    if (progress > 0 && progress < 100) {
      setTextIndex(Math.floor((progress / 100) * loadingTexts.length));
    }
  }, [progress, loadingTexts.length]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-obsidian flex flex-col items-center justify-center font-mono"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1, ease: "easeInOut" } }}
    >
      <div className="w-64">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-neonTeal text-sm mb-4 h-6"
        >
          {loadingTexts[Math.min(textIndex, loadingTexts.length - 1)]}
        </motion.div>
        
        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-neonTeal to-electricIndigo"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>SYS.BOOT</span>
          <span>{progress}%</span>
        </div>
      </div>
    </motion.div>
  );
};
