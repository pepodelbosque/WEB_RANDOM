import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../hooks/useLanguage';

interface LoadingPageProps {
  onLoadingComplete: () => void;
}

const LoadingPage: React.FC<LoadingPageProps> = ({ onLoadingComplete }) => {
  const { language } = useLanguage();
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [currentLoadingItem, setCurrentLoadingItem] = useState('');

  // Minimal loading items with short descriptions
  const loadingItems = [
    { name: 'Navigation', desc: 'menu' },
    { name: 'HeroSection', desc: 'main' },
    { name: 'DarkVeil', desc: 'bg' },
    { name: 'GradientText', desc: 'fx' },
    { name: 'Portfolio', desc: 'work' },
    { name: 'About', desc: 'info' },
    { name: 'LincolnMITRE', desc: 'font' },
    { name: 'Thunder', desc: 'font' },
    { name: 'Services', desc: 'offer' },
    { name: 'Contact', desc: 'form' },
    { name: 'Experience', desc: 'cv' },
    { name: 'Translations', desc: 'lang' },
    { name: 'Hooks', desc: 'utils' },
    { name: 'Assets', desc: 'media' },
    { name: 'Ready', desc: 'done' }
  ];

  useEffect(() => {
    let currentIndex = 0;
    const itemDuration = 200; // 200ms per item
    const totalDuration = loadingItems.length * itemDuration;
    
    const loadNextItem = () => {
      if (currentIndex < loadingItems.length) {
        const currentItem = loadingItems[currentIndex];
        setCurrentLoadingItem(`${currentItem.name} • ${currentItem.desc}`);
        
        setTimeout(() => {
          const newProgress = Math.min(((currentIndex + 1) / loadingItems.length) * 100, 100);
          setProgress(newProgress);
          
          currentIndex++;
          
          if (currentIndex >= loadingItems.length) {
            setIsComplete(true);
            setTimeout(() => {
              setIsFadingOut(true);
            }, 400);
            setTimeout(() => {
              onLoadingComplete();
            }, 1200);
          } else {
            loadNextItem();
          }
        }, itemDuration);
      }
    };

    loadNextItem();
  }, [onLoadingComplete]);
  
  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 1.02,
            filter: "blur(8px)"
          }}
          transition={{ 
            duration: isFadingOut ? 1 : 0.5,
            ease: isFadingOut ? [0.4, 0, 0.2, 1] : "easeOut"
          }}
          className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden"
        >
          {/* Animated background gradient */}
          <motion.div
            className="absolute inset-0 opacity-15"
            animate={{
              background: [
                'radial-gradient(circle at 20% 50%, #D95B00 0%, transparent 50%)',
                'radial-gradient(circle at 80% 50%, #AE2400 0%, transparent 50%)',
                'radial-gradient(circle at 50% 20%, #8C1B00 0%, transparent 50%)',
                'radial-gradient(circle at 50% 80%, #AE2400 0%, transparent 50%)',
                'radial-gradient(circle at 20% 50%, #D95B00 0%, transparent 50%)'
              ]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
          />

          {/* Minimal floating particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-0.5 bg-gradient-to-r from-orange-500 to-red-600 rounded-full"
              animate={{
                x: [Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920), Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920)],
                y: [Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080), Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080)],
                opacity: [0, 0.4, 0]
              }}
              transition={{
                duration: Math.random() * 15 + 10,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 5
              }}
            />
          ))}

          <div className="relative z-10 text-center max-w-sm mx-auto px-6">
            {/* Progress section - smaller fixed sizing */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ 
                y: 0, 
                opacity: isFadingOut ? 0 : 1 
              }}
              transition={{ 
                duration: isFadingOut ? 0.6 : 0.8, 
                delay: isFadingOut ? 0 : 0.3 
              }}
              className="space-y-4"
            >
              {/* Smaller fixed size progress bar */}
              <div className="relative">
                <div className="w-48 h-0.5 bg-gray-800 rounded-full overflow-hidden mx-auto">
                  <motion.div
                    className="h-full bg-gradient-to-r from-orange-500 to-red-600 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  />
                </div>
                
                {/* Smaller fixed size progress info */}
                <motion.div
                  className="flex justify-between items-center mt-3 w-48 mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isFadingOut ? 0 : 1 }}
                  transition={{ delay: isFadingOut ? 0 : 0.4 }}
                >
                  <span className="text-xs font-lincolnmitre text-red-600 uppercase tracking-wider">
                    {isComplete 
                      ? (language === 'es' ? 'Completado' : 'Complete')
                      : (language === 'es' ? 'Cargando' : 'Loading')
                    }
                  </span>
                  <span className="text-xs font-lincolnmitre text-orange-500 tabular-nums">
                    {Math.round(progress)}%
                  </span>
                </motion.div>

                {/* Smaller fixed size file info container with gradient fire colors */}
                <motion.div
                  className="mt-1 h-3 flex items-center justify-center w-48 mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isFadingOut ? 0 : 0.4 }}
                  transition={{ delay: isFadingOut ? 0 : 0.6 }}
                >
                  <motion.span
                    key={currentLoadingItem}
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -3 }}
                    transition={{ duration: 0.2 }}
                    className="font-lincolnmitre bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent lowercase tracking-wide"
                    style={{ fontSize: '8px', lineHeight: '12px' }}
                  >
                    {currentLoadingItem}
                  </motion.span>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Subtle scan line effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(transparent 0%, rgba(217, 91, 0, 0.02) 50%, transparent 100%)'
            }}
            animate={{
              y: ['-100%', '100vh']
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingPage;