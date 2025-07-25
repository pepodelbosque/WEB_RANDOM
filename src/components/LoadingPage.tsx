import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../hooks/useLanguage';
import CrowScene from './CrowScene';

interface LoadingPageProps {
  onLoadingComplete: () => void;
}

const LoadingPage: React.FC<LoadingPageProps> = ({ onLoadingComplete }) => {
  const { language } = useLanguage();
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const totalDuration = 5000; // 5 seconds total loading time
    let elapsed = 0;
    
    const interval = setInterval(() => {
      elapsed += 50;
      const newProgress = Math.min((elapsed / totalDuration) * 100, 100);
      setProgress(newProgress);
      
      if (newProgress >= 100) {
        setIsComplete(true);
        setTimeout(() => {
          onLoadingComplete();
        }, 500);
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }} // Fade-out kept
          transition={{ duration: 1.5 }} // Slow fade-out
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
        >
          <div className="relative z-10 text-center scale-50">
            {/* 3D Crow Model */}
            <motion.div
              initial={{ y: -50, opacity: 0, scale: 0.5 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="mb-8"
            >
              <CrowScene progress={progress} />
            </motion.div>
            
            {/* Progress Bar */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '100%', opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="w-80 mx-auto"
            >
              <div className="bg-gray-300 dark:bg-gray-700 rounded-full h-3 mb-6 overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-primary to-secondary h-full rounded-full"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              <p className="text-lg font-avenuex text-orange-600 dark:text-gray-400">
                {Math.round(progress)}% {language === 'es' ? 'Completado' : 'Complete'}
              </p>
            </motion.div>
            
            {/* Loading Text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="text-base font-avenuex text-orange-500 dark:text-gray-400 mt-8"
            > 
              {language === 'es' 
                ? 'Inicializando experiencia digital...'
                : 'Initializing digital experience...'
              }
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingPage;