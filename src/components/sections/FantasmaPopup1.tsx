import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './TripulacionPopUp.module.css';

interface FantasmaPopupProps {
  isVisible: boolean;
  onClose: () => void;
  title?: string;
}

const FantasmaPopup1: React.FC<FantasmaPopupProps> = ({ isVisible, onClose, title }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [overlayActive, setOverlayActive] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const [leftIndex, setLeftIndex] = useState(0);
  const [rightIndex, setRightIndex] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [showSkull, setShowSkull] = useState(false);
  const leftImages = ['/images/AboutSectionFiles/About01b.png','/images/AboutSectionFiles/About02.png','/images/AboutSectionFiles/About03.png'];
  const rightImages = ['/images/Instalacion_Buena.jpg','/images/AboutSectionFiles/About02.png','/images/AboutSectionFiles/About03.png'];
  const allImages = [...leftImages, ...rightImages];

  useEffect(() => {
    const updateCompact = () => {
      const mm = window.matchMedia('(max-width: 1024px)');
      const mp = window.matchMedia('(orientation: portrait)');
      setIsCompact(mm.matches);
      setIsPortrait(mp.matches);
    };
    updateCompact();
    window.addEventListener('resize', updateCompact);
    window.addEventListener('orientationchange', updateCompact);
    return () => {
      window.removeEventListener('resize', updateCompact);
      window.removeEventListener('orientationchange', updateCompact);
    };
  }, []);

  useEffect(() => {
    let id: number | null = null;
    if (isVisible) {
      id = window.setInterval(() => {
        if (isPortrait) {
          setPageIndex((p) => (p + 1) % allImages.length);
        } else {
          setLeftIndex((p) => (p + 1) % leftImages.length);
          setRightIndex((p) => (p + 1) % rightImages.length);
        }
      }, 4000);
    }
    return () => { if (id) window.clearInterval(id); };
  }, [isVisible, isPortrait]);

  useEffect(() => {
    let id: number | null = null;
    if (isVisible) {
      id = window.setInterval(() => {
        setShowSkull((s) => !s);
      }, 2000);
    }
    return () => { if (id) window.clearInterval(id); };
  }, [isVisible]);

  useEffect(() => {
    if (isVisible) {
      (window as any).lenis?.stop();
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

  const prev = () => {
    if (isPortrait) {
      setPageIndex((p) => (p - 1 + allImages.length) % allImages.length);
    } else {
      setLeftIndex((p) => (p - 1 + leftImages.length) % leftImages.length);
      setRightIndex((p) => (p - 1 + rightImages.length) % rightImages.length);
    }
  };
  const next = () => {
    if (isPortrait) {
      setPageIndex((p) => (p + 1) % allImages.length);
    } else {
      setLeftIndex((p) => (p + 1) % leftImages.length);
      setRightIndex((p) => (p + 1) % rightImages.length);
    }
  };

  const heartPulse = {
    scale: [1, 1.06, 1],
    transition: { duration: 1.2, repeat: Infinity, repeatType: 'reverse' },
  } as any;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`${styles.overlay} fixed inset-0 z-50 flex flex-col items-center justify-center w-full h-full p-2 md:p-4 ${overlayActive ? styles.overlayVisible : ''}`}
          ref={containerRef}
          role="dialog"
          aria-modal="true"
          tabIndex={0}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
          style={{ ['--overlay-bg' as any]: 'rgba(0,0,0,0.92)' }}
        >
          {!isPortrait && (
            <div
              className="relative z-10 pointer-events-none select-none text-transparent bg-clip-text font-lincolnmitre text-[1.6rem] md:text-[2rem] leading-[1] mb-3"
              style={{
                letterSpacing: '-0.06em',
                whiteSpace: 'nowrap',
                display: 'inline-block',
                marginBottom: '10px',
                backgroundImage: 'linear-gradient(to right, #a50000, #8b0000, #a50000)'
              }}
            >
              {title ?? 'Paisaje'}
            </div>
          )}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
            className={`${styles.frame}`}
            style={{
              width: isCompact ? '95vw' : '75vw',
              maxHeight: (isCompact || isPortrait) ? '90vh' : '75vh',
              marginTop: (isCompact || isPortrait) ? '5vh' : undefined,
              marginBottom: (isCompact || isPortrait) ? '5vh' : undefined,
              ['--frame-border-color' as any]: 'rgba(165,0,0,0.7)',
              ['--accent-r' as any]: 165, ['--accent-g' as any]: 0, ['--accent-b' as any]: 0,
              ['--popup-noise-opacity' as any]: 0.35,
            }}
          >
            <div className="w-full box-border p-3 md:p-4" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              {isPortrait ? (
                <div className="w-full h-full">
                  <div style={{ width: '100%', height: '100%', position: 'relative', padding: '2vh 2vw' }}>
                    <img src={allImages[pageIndex]} alt="page" className="absolute inset-0 w-full h-full" style={{ objectFit: 'cover' }} />
                  </div>
                </div>
              ) : (
                <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'stretch', flex: 1, minHeight: 0 }}>
                  <div className="w-full h-full">
                    <div style={{ width: '100%', height: '100%', position: 'relative', padding: '1.5vh 1.5vw' }}>
                      <img src={leftImages[leftIndex]} alt="left" className="absolute inset-0 w-full h-full" style={{ objectFit: 'cover' }} />
                    </div>
                  </div>
                  <div className="w-full h-full">
                    <div style={{ width: '100%', height: '100%', position: 'relative', padding: '1.5vh 1.5vw' }}>
                      <img src={rightImages[rightIndex]} alt="right" className="absolute inset-0 w-full h-full" style={{ objectFit: 'cover' }} />
                    </div>
                  </div>
                </div>
              )}
              <div className="mt-3 flex items-center justify-center gap-3">
                <button
                  type="button"
                  aria-label="Anterior"
                  aria-controls="crew-carousel-track"
                  className="inline-flex items-center justify-center w-9 h-6 sm:w-10 sm:h-7 rounded-none font-lincolnmitre active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all"
                  style={{
                    border: '1px solid rgba(165,0,0,0.6)',
                    background: 'rgba(165,0,0,0.12)',
                    color: 'rgba(165,0,0,0.9)'
                  }}
                  onClick={prev}
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-3.5" aria-hidden="true" style={{ color: '#a50000' }}>
                    <path d="M14 7 L7 12 L14 17 Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1.2 3" />
                  </svg>
                </button>
                <span
                  aria-hidden="true"
                  className="inline-flex items-center justify-center w-9 h-6 sm:w-10 sm:h-7 rounded-none select-none"
                  role="button"
                  tabIndex={0}
                  onClick={onClose}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClose(); } }}
                  style={{ border: '1px solid rgba(165,0,0,0.6)', background: 'rgba(165,0,0,0.12)', color: 'rgba(165,0,0,0.9)' }}
                >
                  <motion.div initial={{ scale: 1 }} animate={heartPulse} className="w-5 h-3.5" style={{ color: '#a50000' }}>
                    {showSkull ? (
                      <svg viewBox="0 0 24 24" className="w-5 h-3.5">
                        <line x1="7" y1="7" x2="17" y2="17" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1.2 3" />
                        <line x1="17" y1="7" x2="7" y2="17" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1.2 3" />
                        <circle cx="7" cy="7" r="1.6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeDasharray="1.2 3" />
                        <circle cx="17" cy="17" r="1.6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeDasharray="1.2 3" />
                        <circle cx="17" cy="7" r="1.6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeDasharray="1.2 3" />
                        <circle cx="7" cy="17" r="1.6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeDasharray="1.2 3" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" className="w-5 h-3.5">
                        <path d="M3.172 5.172a4 4 0 015.656 0L12 8.343l3.172-3.171a4 4 0 115.656 5.656L12 21 3.172 10.828a4 4 0 010-5.656z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1.2 3" />
                      </svg>
                    )}
                  </motion.div>
                </span>
                <button
                  type="button"
                  aria-label="Siguiente"
                  aria-controls="crew-carousel-track"
                  className="inline-flex items-center justify-center w-9 h-6 sm:w-10 sm:h-7 rounded-none font-lincolnmitre active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all"
                  style={{
                    border: '1px solid rgba(165,0,0,0.6)',
                    background: 'rgba(165,0,0,0.12)',
                    color: 'rgba(165,0,0,0.9)'
                  }}
                  onClick={next}
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-3.5" aria-hidden="true" style={{ color: '#a50000' }}>
                    <path d="M10 7 L17 12 L10 17 Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1.2 3" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FantasmaPopup1;
