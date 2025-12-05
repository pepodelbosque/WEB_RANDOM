// Popup overlay without 3D viewer
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './TripulacionPopUp.module.css';

interface VideogamePopupProps {
  isVisible: boolean;
  onClose: () => void;
  minimal?: boolean;
}

// 3D viewer removed per request

const VideogamePopup: React.FC<VideogamePopupProps> = ({ isVisible, onClose, minimal = false }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [overlayActive, setOverlayActive] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const leftParaRef = useRef<HTMLParagraphElement | null>(null);
  const rightParaRef = useRef<HTMLParagraphElement | null>(null);
  const [fontLeft, setFontLeft] = useState<number>(16);
  const [fontRight, setFontRight] = useState<number>(16);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageWidth, setPageWidth] = useState<number>(0);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

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
    const fit = () => {
      const contentEl = contentRef.current;
      if (!contentEl) return;
      const available = contentEl.clientHeight;
      const adjust = (el: HTMLParagraphElement | null, start: number, setFn: (n: number) => void) => {
        if (!el) return;
        let size = start;
        el.style.fontSize = `${size}px`;
        el.style.lineHeight = '1.25';
        while (el.scrollHeight > available && size > 12) {
          size -= 1;
          el.style.fontSize = `${size}px`;
          el.style.lineHeight = '1.2';
        }
        setFn(size);
      };
      adjust(leftParaRef.current, isCompact || isPortrait ? 16 : 18, setFontLeft);
      adjust(rightParaRef.current, isCompact || isPortrait ? 16 : 18, setFontRight);
    };
    const ro = new ResizeObserver(() => fit());
    if (contentRef.current) ro.observe(contentRef.current);
    fit();
    window.addEventListener('resize', fit);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', fit);
    };
  }, [isCompact, isPortrait, isVisible]);

  useEffect(() => {
    const updateWidth = () => {
      const w = contentRef.current?.clientWidth ?? 0;
      setPageWidth(w);
    };
    updateWidth();
    const ro = new ResizeObserver(() => updateWidth());
    if (contentRef.current) ro.observe(contentRef.current);
    window.addEventListener('resize', updateWidth);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateWidth);
    };
  }, [isVisible]);

  const handleWheel = (e: React.WheelEvent) => {
    if (!isPortrait) return;
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (delta > 20) setPageIndex((p) => Math.min(1, p + 1));
    if (delta < -20) setPageIndex((p) => Math.max(0, p - 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isPortrait) return;
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPortrait) return;
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    if (!isPortrait) return;
    const diff = touchEndX.current - touchStartX.current;
    if (diff < -40) setPageIndex((p) => Math.min(1, p + 1));
    if (diff > 40) setPageIndex((p) => Math.max(0, p - 1));
    touchStartX.current = 0;
    touchEndX.current = 0;
  };
  const MIN_COLUMN_WIDTH = 320;
  const GAP_PX = 32;
  const canShowBothPortrait = isPortrait && pageWidth >= (MIN_COLUMN_WIDTH * 2 + GAP_PX);

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

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); onClose(); }
  }, [onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`${styles.overlay} fixed inset-0 z-50 flex flex-col items-center justify-center w-full h-full p-2 md:p-4 ${overlayActive ? styles.overlayVisible : ''}`}
          ref={containerRef}
          role="dialog"
          aria-modal="true"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
        >
          <div
            className="relative z-10 pointer-events-none select-none bg-gradient-to-r from-red-700 via-orange-500 to-red-600 text-transparent bg-clip-text font-lincolnmitre text-[1.6rem] md:text-[2rem] leading-[1] mb-3"
            style={{ letterSpacing: '-0.06em', whiteSpace: 'nowrap', display: 'inline-block', marginBottom: '10px' }}
          >
            videogame
          </div>
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
            }}
          >
            <div className="w-full box-border p-3 md:p-4 mt-6 md:mt-8" style={{ zIndex: 1 }}>
              <div className="flex justify-center items-center gap-1 md:gap-2">
                {['CODIGO QR', 'VIDEO GAME', 'HONOREM'].map((label) => (
                  <motion.button
                    key={label}
                    whileHover={{ scale: 1.05, rotateZ: 2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-16 h-8 px-2 py-1 bg-black/50 border text-[rgba(255,0,0,0.85)] font-lincolnmitre hover:bg-[rgba(255,0,0,0.20)] hover:text-[rgba(255,0,0,0.95)] transition-all duration-300 text-[10px] leading-none uppercase tracking-wide"
                    style={{ borderColor: 'rgba(255,0,0,0.5)' }}
                    aria-label={label}
                  >
                    {label}
                  </motion.button>
                ))}
              </div>
            </div>
            <div
              ref={contentRef}
              className={styles.content}
              style={{
                display: 'block',
                width: '100%',
                overflowY: 'hidden',
                overflowX: 'hidden',
                overscrollBehavior: 'contain',
                flex: 1,
              }}
              onWheel={handleWheel}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {minimal ? (
                <div className="w-full h-full flex items-center justify-center p-4">
                  <p className="text-sm md:text-base font-extrabold font-lincolnmitre text-orange-200/85 text-center">
                    Próximamente: contenido interactivo del videojuego.
                  </p>
                </div>
              ) : (
                <div className="mx-auto px-6 md:px-8 py-6 md:py-8" style={{ maxWidth: isCompact ? '95%' : '85%' }}>
                  {isPortrait && !canShowBothPortrait ? (
                    <div className="relative w-full h-full overflow-hidden">
                      <motion.div
                        className="flex"
                        animate={{ x: -pageIndex * pageWidth }}
                        transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                        style={{ width: `${2 * pageWidth}px` }}
                      >
                        <div style={{ width: `${pageWidth}px`, paddingRight: '1rem' }}>
                          <p
                            ref={leftParaRef}
                            className="font-lincolnmitre text-orange-200/90 text-justify"
                            style={{ hyphens: 'auto', overflowWrap: 'anywhere', wordBreak: 'break-word', fontSize: `${fontLeft}px`, lineHeight: 1.25 }}
                          >
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia, nunc a dapibus scelerisque, lectus turpis malesuada risus, at tristique quam tellus at mauris. Integer congue ultrices massa, nec mattis ante. Suspendisse potenti. Donec venenatis, augue quis luctus malesuada, turpis ante pellentesque nisl, a cursus arcu turpis nec nibh. Sed quis mi in ipsum varius vulputate. Integer euismod, urna et ultricies sagittis, orci nisl tristique tellus, vitae dapibus lorem elit vitae sem. Duis nec nulla et arcu commodo euismod. Aenean ultricies, nunc et tristique faucibus, justo arcu facilisis mi, vel fringilla massa augue ac augue.
                          </p>
                        </div>
                        <div style={{ width: `${pageWidth}px`, paddingLeft: '1rem' }}>
                          <p
                            ref={rightParaRef}
                            className="font-lincolnmitre text-orange-200/90 text-justify"
                            style={{ hyphens: 'auto', overflowWrap: 'anywhere', wordBreak: 'break-word', fontSize: `${fontRight}px`, lineHeight: 1.25 }}
                          >
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus bibendum, neque sed placerat efficitur, purus felis imperdiet erat, non facilisis velit lorem sed arcu. Etiam et nulla id mauris porta tempor. Curabitur at vulputate justo. In hac habitasse platea dictumst. Integer rhoncus efficitur risus, at laoreet libero fermentum non. Sed feugiat risus at urna consectetur, at pulvinar orci aliquet. Nullam non lectus ultrices, ullamcorper ligula ac, faucibus nisl. Cras id lacinia arcu, vitae sodales justo. Nunc id venenatis neque, quis ultrices sem.
                          </p>
                        </div>
                      </motion.div>
                      
                    </div>
                  ) : (
                    <div className="grid" style={{ gap: '2rem', gridTemplateColumns: '1fr 1fr' }}>
                      <p
                        ref={leftParaRef}
                        className="font-lincolnmitre text-orange-200/90 text-justify"
                        style={{ hyphens: 'auto', overflowWrap: 'anywhere', wordBreak: 'break-word', fontSize: `${fontLeft}px`, lineHeight: 1.25 }}
                      >
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia, nunc a dapibus scelerisque, lectus turpis malesuada risus, at tristique quam tellus at mauris. Integer congue ultrices massa, nec mattis ante. Suspendisse potenti. Donec venenatis, augue quis luctus malesuada, turpis ante pellentesque nisl, a cursus arcu turpis nec nibh. Sed quis mi in ipsum varius vulputate. Integer euismod, urna et ultricies sagittis, orci nisl tristique tellus, vitae dapibus lorem elit vitae sem. Duis nec nulla et arcu commodo euismod. Aenean ultricies, nunc et tristique faucibus, justo arcu facilisis mi, vel fringilla massa augue ac augue.
                      </p>
                      <p
                        ref={rightParaRef}
                        className="font-lincolnmitre text-orange-200/90 text-justify"
                        style={{ hyphens: 'auto', overflowWrap: 'anywhere', wordBreak: 'break-word', fontSize: `${fontRight}px`, lineHeight: 1.25 }}
                      >
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus bibendum, neque sed placerat efficitur, purus felis imperdiet erat, non facilisis velit lorem sed arcu. Etiam et nulla id mauris porta tempor. Curabitur at vulputate justo. In hac habitasse platea dictumst. Integer rhoncus efficitur risus, at laoreet libero fermentum non. Sed feugiat risus at urna consectetur, at pulvinar orci aliquet. Nullam non lectus ultrices, ullamcorper ligula ac, faucibus nisl. Cras id lacinia arcu, vitae sodales justo. Nunc id venenatis neque, quis ultrices sem.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
            {isPortrait && !canShowBothPortrait && (
              <div className="w-full flex justify-center items-center gap-2 py-2">
                <span className={`${pageIndex === 0 ? 'bg-red-600' : 'bg-red-600/40'} block w-2 h-2 rounded-full`}></span>
                <span className={`${pageIndex === 1 ? 'bg-red-600' : 'bg-red-600/40'} block w-2 h-2 rounded-full`}></span>
              </div>
            )}
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.05, rotateZ: 2 }}
              whileTap={{ scale: 0.95 }}
              className="w-16 h-8 px-2 py-1 bg-black/50 border text-[rgba(255,0,0,0.85)] font-lincolnmitre hover:bg-[rgba(255,0,0,0.20)] hover:text-[rgba(255,0,0,0.95)] transition-all duration-300 text-[10px] leading-none uppercase tracking-wide mt-2 mb-6 md:mb-8 self-center"
              style={{ borderColor: 'rgba(255,0,0,0.5)' }}
              aria-label="CERRAR"
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
