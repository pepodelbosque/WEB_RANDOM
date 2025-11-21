// Popup overlay without 3D viewer
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideogamePopupProps {
  isVisible: boolean;
  onClose: () => void;
  minimal?: boolean;
  title?: string;
}

// 3D viewer removed per request

const VideogamePopup: React.FC<VideogamePopupProps> = ({ isVisible, onClose, minimal = false, title = 'VIDEOGAME' }) => {
  useEffect(() => {
    if (isVisible) {
      window.lenis?.stop();
    } else {
      window.lenis?.start();
    }
    return () => {
      window.lenis?.start();
    };
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex flex-col items-center justify-center p-4"
        >
          <div className="flex-grow flex flex-col items-center justify-center text-center overflow-y-auto">
            <motion.h2 
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-5xl font-bold font-lincolnmitre text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-8"
            >
              {title}
            </motion.h2>
            {/* 3D model viewer removed; keeping header-only per requirements */}
          </div>
          <motion.button
            onClick={onClose}
            className="mb-8 text-white hover:text-red-500 transition-colors duration-300 font-lincolnmitre uppercase tracking-widest"
            whileHover={{ scale: 1.1, rotate: 1 }}
            whileTap={{ scale: 0.9 }}
          >
            EXIT
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default VideogamePopup;