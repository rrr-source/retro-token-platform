import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface PreloaderProps {
  onLoadingComplete: () => void;
}

const Preloader = ({ onLoadingComplete }: PreloaderProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (progress < 100) {
        setProgress(prev => Math.min(prev + 10, 100));
      } else {
        onLoadingComplete();
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [progress, onLoadingComplete]);

  return (
    <motion.div
      className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <motion.div
        className="w-32 h-32 mb-12"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Space Invader pixel art */}
        <div className="grid grid-cols-11 gap-1">
          {Array(88).fill(null).map((_, i) => (
            <motion.div
              key={i}
              className={`w-3 h-3 ${
                [13,14,15,24,25,26,27,28,35,36,37,38,39,40,41,46,47,48,49,50,51,52,57,58,59,60,61,62,63,68,69,70,71,72,73,74].includes(i)
                  ? 'bg-neon-purple'
                  : 'bg-transparent'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.01 }}
            />
          ))}
        </div>
      </motion.div>

      <div className="w-64 h-4 bg-black border-2 border-neon-purple relative overflow-hidden">
        <motion.div
          className="h-full bg-neon-purple"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.2 }}
        />
      </div>

      <motion.div
        className="mt-6 text-neon-purple font-press-start text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        LOADING...
      </motion.div>

      <motion.div
        className="mt-3 text-neon-purple font-press-start text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {progress}%
      </motion.div>
    </motion.div>
  );
};

export default Preloader;