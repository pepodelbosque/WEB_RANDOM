// Popup overlay without 3D viewer
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './TripulacionPopUp.module.css';

interface VideogamePopupProps {
  isVisible: boolean;
  onClose: () => void;
  minimal?: boolean;
  title?: string;
}

// 3D viewer removed per request

const VideogamePopup: React.FC<VideogamePopupProps> = ({ isVisible, onClose, minimal = false, title = 'VIDEOGAME' }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [overlayActive, setOverlayActive] = useState(false);

  useEffect(() => {
    if (isVisible) {
      (window as any).lenis?.stop();
      // focus para accesibilidad y teclas
      containerRef.current?.focus();
      setOverlayActive(true);
    } else {
      (window as any).lenis?.start();
      setOverlayActive(false);
    }
    return () => {
      (window as any).lenis?.start();
    };
  }, [isVisible]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); onClose(); }
  }, [onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`${styles.overlay} fixed inset-0 z-50 flex flex-col items-center justify-center p-2 md:p-4 ${overlayActive ? styles.overlayVisible : ''}`}
          ref={containerRef}
          role="dialog"
          aria-modal="true"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {/* Frame con animación de scale/fade consistente con la UI actual */}
          <motion.div
            className={styles.frame}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className={`${styles.content} flex-grow flex flex-col items-center justify-center text-center overflow-hidden w-full p-4`}>  
              <motion.h2
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="text-3xl md:text-5xl font-black font-lincolnmitre text-orange-300 mb-4 md:mb-8"
              >
                {title}
              </motion.h2>
              {/* Contenido funcional dentro del mismo contexto visual */}
              {minimal ? (
                <p className="text-sm md:text-base font-extrabold font-lincolnmitre text-orange-200/85">
                  Próximamente: contenido interactivo del videojuego.
                </p>
              ) : (
                <div className="max-w-[85vw] md:max-w-2xl mx-auto text-center">
                  <p className="text-xs md:text-sm font-extrabold font-lincolnmitre text-orange-200/85">
                    Explora avances, arte y mecánicas del proyecto Random 2.0.
                  </p>
                </div>
              )}
            </div>

            <motion.button
              onClick={onClose}
              className="mt-2 mb-6 md:mb-8 text-white hover:text-red-500 transition-colors duration-300 font-lincolnmitre uppercase tracking-widest"
              whileHover={{ scale: 1.08, rotate: 0.5 }}
              whileTap={{ scale: 0.92 }}
            >
              CERRAR
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default VideogamePopup;
