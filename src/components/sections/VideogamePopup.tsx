// Popup overlay without 3D viewer
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './TripulacionPopUp.module.css';

interface VideogamePopupProps {
  isVisible: boolean;
  onClose: () => void;
  minimal?: boolean;
  title?: string;
  theme?: 'black' | 'red';
}

// 3D viewer removed per request

const ScrambleText = ({ text, className, delay = 0, as: Tag = 'p' }: { text: string, className?: string, delay?: number, as?: any }) => {
  const ref = React.useRef<any>(null);
  
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*+?';
    let iteration = 0;
    let interval: any; // Using any to avoid NodeJS.Timeout type issues if types aren't set up perfectly
    
    const start = () => {
      interval = setInterval(() => {
        el.innerText = text
          .split('')
          .map((letter: string, index: number) => {
            if (index < iteration) return text[index];
            if (/\s/.test(letter)) return letter;
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');
        
        if (iteration >= text.length) clearInterval(interval);
        iteration += 1/2;
      }, 30);
    };

    const timer = setTimeout(start, delay);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [text, delay]);

  return <Tag ref={ref} className={className} style={{ whiteSpace: 'pre-line' }}>{text}</Tag>;
};

const MacImageSlideshow = () => {
  const images = [
    "/images/mac_GAME11.png",
    "/images/macGame2.png",
    "/images/mac_game1.png"
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.img
          key={images[index]}
          src={images[index]}
          alt={`MAC GAME ${index + 1}`}
          className="max-w-[90%] max-h-[90%] object-contain opacity-90"
          initial={{ opacity: 0, filter: "brightness(1.2) contrast(1.1)" }}
          animate={{ 
            opacity: [0, 1, 0.8, 0.9],
            filter: ["brightness(1.5) contrast(1.2)", "brightness(0.9)", "brightness(1) contrast(1)"]
          }}
          exit={{ 
            opacity: 0,
            filter: ["brightness(1)", "brightness(2)", "brightness(0)"]
          }}
          transition={{ 
            duration: 0.2,
            times: [0, 0.4, 0.8, 1],
            ease: "linear"
          }}
        />
      </AnimatePresence>
    </div>
  );
};

const ScrambleElement = ({ children, className, delay = 0, repeatInterval, size = '2rem' }: { children: React.ReactNode, className?: string, delay?: number, repeatInterval?: number, size?: string | number }) => {
  const [showContent, setShowContent] = React.useState(true);
  const ref = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*+?';
    let interval: any;
    let loopTimer: any;

    const playAnimation = () => {
      setShowContent(false);
      let frames = 0;
      interval = setInterval(() => {
        if (ref.current) {
          ref.current.innerText = chars[Math.floor(Math.random() * chars.length)];
        }
        frames++;
        if (frames > 15) { // ~450ms duration
          clearInterval(interval);
          setShowContent(true);
        }
      }, 30);
    };

    const startTimer = setTimeout(() => {
      playAnimation();
      if (repeatInterval) {
        loopTimer = setInterval(playAnimation, repeatInterval);
      }
    }, delay);

    return () => {
      clearTimeout(startTimer);
      clearInterval(interval);
      if (loopTimer) clearInterval(loopTimer);
    };
  }, [delay, repeatInterval]);

  return showContent ? (
    <>{children}</>
  ) : (
    <span ref={ref} className={className} style={{ display: 'inline-block', textAlign: 'center', width: size, height: size, lineHeight: size, overflow: 'hidden', verticalAlign: 'middle' }}></span>
  );
};

const VideogamePopup: React.FC<VideogamePopupProps> = ({ isVisible, onClose, minimal = false, title, theme = 'red' }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [overlayActive, setOverlayActive] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const leftParaRef = useRef<HTMLParagraphElement | null>(null);
  const rightParaRef = useRef<HTMLParagraphElement | null>(null);
  const thirdParaRef = useRef<HTMLParagraphElement | null>(null);
  const [fontLeft, setFontLeft] = useState<number>(16);
  const [fontRight, setFontRight] = useState<number>(16);
  const [fontThird, setFontThird] = useState<number>(16);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageWidth, setPageWidth] = useState<number>(0);
  const [mode, setMode] = useState<'qr' | 'game' | 'honorem' | 'catalogo' | 'random' | 'random2' | 'backstage' | 'promo'>('qr');
  const activePulse = { scale: [1, 1.06, 1], transition: { duration: 1.2, repeat: Infinity, repeatType: 'reverse' } } as any;
  const [headerTopPx, setHeaderTopPx] = useState<number | undefined>(undefined);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  useEffect(() => {
    if (title === 'CATÁLOGO RANDOM 2.0') {
      setMode('catalogo');
    } else if (title === 'VIDEO INSTALACIÓN RANDOM 2.0') {
      setMode('random');
    } else if (title === 'VIDEOS RANDOM') {
      setMode('random');
    } else if (title === 'Video Juego - RANDOM' || title === 'VIDEOGAME') {
      if (mode === 'catalogo' || mode === 'random' || mode === 'random2' || mode === 'backstage' || mode === 'promo') setMode('qr');
    }
  }, [title]);

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
      
      // Calculate available height: clientHeight includes padding of the container itself,
      // but we need to account for the inner wrapper's padding (py-4 md:py-6 = ~32-48px) + safety margin.
      // Using 60px to ensure text doesn't touch the edges/buttons.
      const available = contentEl.clientHeight - 60;

      const adjust = (el: HTMLParagraphElement | null, start: number) => {
        if (!el) return start;
        let size = start;
        el.style.fontSize = `${size}px`;
        el.style.lineHeight = '1.2';
        
        // Shrink font until it fits, down to 10px
        while (el.scrollHeight > available && size > 10) {
          size -= 0.5;
          el.style.fontSize = `${size}px`;
          el.style.lineHeight = size < 13 ? '1.15' : '1.2';
        }
        return size;
      };

      const adjustCombined = (el1: HTMLParagraphElement | null, el2: HTMLParagraphElement | null, start: number) => {
        if (!el1 || !el2) return start;
        let size = start;
        el1.style.fontSize = `${size}px`; el1.style.lineHeight = '1.2';
        el2.style.fontSize = `${size}px`; el2.style.lineHeight = '1.2';
        
        // Check combined height with gap (0.5rem = 8px)
        const gap = 8;
        while ((el1.scrollHeight + el2.scrollHeight + gap) > available && size > 10) {
          size -= 0.5;
          el1.style.fontSize = `${size}px`;
          el1.style.lineHeight = size < 13 ? '1.15' : '1.2';
          el2.style.fontSize = `${size}px`;
          el2.style.lineHeight = size < 13 ? '1.15' : '1.2';
        }
        return size;
      };

      if (!isCompact && !isPortrait && mode !== 'qr') {
        // Desktop mode: Synchronize font sizes
        // First, calculate the optimal size for the right column (which has more text)
        // Start even larger (32) to fill space better
        const sizeRight = adjustCombined(rightParaRef.current, thirdParaRef.current, 32);
        
        // Now calculate the optimal size for the left column independently
        const sizeLeft = adjust(leftParaRef.current, 32);
        
        // Use the minimum to ensure exact homogeneity across all paragraphs as requested
        const commonSize = Math.min(sizeLeft, sizeRight);
        
        setFontRight(commonSize);
        setFontThird(commonSize);
        setFontLeft(commonSize);
        
        // Re-apply styles to enforce common size
        const lineHeight = commonSize < 13 ? '1.15' : '1.25';
        if (leftParaRef.current) {
             leftParaRef.current.style.fontSize = `${commonSize}px`;
             leftParaRef.current.style.lineHeight = lineHeight;
        }
        if (rightParaRef.current) {
             rightParaRef.current.style.fontSize = `${commonSize}px`;
             rightParaRef.current.style.lineHeight = lineHeight;
        }
        if (thirdParaRef.current) {
             thirdParaRef.current.style.fontSize = `${commonSize}px`;
             thirdParaRef.current.style.lineHeight = lineHeight;
        }
      } else {
        // Mobile/Portrait mode: Synchronize font sizes as well
        const sL = adjust(leftParaRef.current, isCompact || isPortrait ? 16 : 18);
        const sR = adjust(rightParaRef.current, isCompact || isPortrait ? 16 : 18);
        const sT = adjust(thirdParaRef.current, isCompact || isPortrait ? 16 : 18);
        
        const commonSize = Math.min(sL, sR, sT);
        
        setFontLeft(commonSize);
        setFontRight(commonSize);
        setFontThird(commonSize);

        // Re-apply styles to enforce common size
        const lineHeight = commonSize < 13 ? '1.15' : '1.25';
        if (leftParaRef.current) {
             leftParaRef.current.style.fontSize = `${commonSize}px`;
             leftParaRef.current.style.lineHeight = lineHeight;
        }
        if (rightParaRef.current) {
             rightParaRef.current.style.fontSize = `${commonSize}px`;
             rightParaRef.current.style.lineHeight = lineHeight;
        }
        if (thirdParaRef.current) {
             thirdParaRef.current.style.fontSize = `${commonSize}px`;
             thirdParaRef.current.style.lineHeight = lineHeight;
        }
      }
    };
    
    // Run immediately and after a short delay to ensure DOM updates are committed
    fit();
    const timer = setTimeout(fit, 50);

    const ro = new ResizeObserver(() => fit());
    if (contentRef.current) ro.observe(contentRef.current);
    
    window.addEventListener('resize', fit);
    return () => {
      clearTimeout(timer);
      ro.disconnect();
      window.removeEventListener('resize', fit);
    };
  }, [isCompact, isPortrait, isVisible, mode]);

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

  useEffect(() => {
    const computeHeaderTop = () => {
      if (!isPortrait) { setHeaderTopPx(undefined); return; }
      const vh = window.innerHeight;
      const minPx = Math.round(vh * 0.12);
      const maxPx = Math.round(vh * 0.18);
      const gapPx = Math.round(vh * 0.012);
      const headerH = Math.round(headerRef.current?.getBoundingClientRect().height || vh * 0.03);
      const rect = frameRef.current?.getBoundingClientRect();
      let candidate = Math.round(vh * 0.15);
      if (rect) {
        const safeTop = Math.round(rect.top - gapPx - headerH);
        candidate = safeTop;
      }
      const topPx = Math.max(minPx, Math.min(candidate, maxPx));
      setHeaderTopPx(topPx);
    };
    computeHeaderTop();
    const ro = new ResizeObserver(() => computeHeaderTop());
    if (frameRef.current) ro.observe(frameRef.current);
    window.addEventListener('resize', computeHeaderTop);
    window.addEventListener('orientationchange', computeHeaderTop);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', computeHeaderTop);
      window.removeEventListener('orientationchange', computeHeaderTop);
    };
  }, [isPortrait]);

  // Ensure we always start on the first page/column when mode changes or popup opens
  useEffect(() => {
    setPageIndex(0);
  }, [mode, isVisible]);

  const handleWheel = (e: React.WheelEvent) => {
    if (!isPortrait) return;
    const maxPage = (mode === 'qr' || mode === 'random' || mode === 'random2' || mode === 'promo') ? 1 : 2;
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (delta > 20) setPageIndex((p) => Math.min(maxPage, p + 1));
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
    const maxPage = (mode === 'qr' || mode === 'random' || mode === 'random2' || mode === 'promo') ? 1 : 2;
    const diff = touchEndX.current - touchStartX.current;
    if (diff < -40) setPageIndex((p) => Math.min(maxPage, p + 1));
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
          style={theme === 'black' ? ({ ['--overlay-bg' as any]: 'rgba(0,0,0,0.92)' } as React.CSSProperties) : undefined}
        >
          {!isPortrait && (
            <div
              className="relative z-10 pointer-events-none select-none bg-gradient-to-r from-red-700 via-orange-500 to-red-600 text-transparent bg-clip-text font-lincolnmitre text-[1.6rem] md:text-[2rem] leading-[1] mb-3"
              style={{
                letterSpacing: '-0.06em',
                whiteSpace: 'nowrap',
                display: 'inline-block',
                marginBottom: '10px',
              }}
              ref={headerRef}
            >
              {title ?? 'videogame'}
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
                ...(theme === 'black'
                  ? ({ ['--frame-border-color' as any]: 'rgba(255,255,255,0.35)', ['--accent-r' as any]: 255, ['--accent-g' as any]: 255, ['--accent-b' as any]: 255, ['--popup-noise-opacity' as any]: 0.25 } as React.CSSProperties)
                  : ({ ['--frame-border-color' as any]: 'rgba(255,0,0,0.5)', ['--accent-r' as any]: 255, ['--accent-g' as any]: 0, ['--accent-b' as any]: 0, ['--popup-noise-opacity' as any]: 0.35 } as React.CSSProperties)),
              }}
              ref={frameRef}
            >
            <div className="w-full box-border p-3 md:p-4 mt-6 md:mt-8" style={{ zIndex: 1 }}>
              <div className="flex justify-center items-center gap-1 md:gap-2">
                {title === 'CATÁLOGO RANDOM 2.0' ? (
                  <motion.button
                    whileHover={{ scale: 1.05, rotateZ: 2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-32 h-8 px-2 py-1 bg-black/50 border text-[rgba(255,0,0,0.98)] font-lincolnmitre transition-all duration-300 text-[10px] leading-none uppercase tracking-wide hover:bg-[rgba(255,0,0,0.30)]`}
                    style={{ borderColor: 'rgba(255,0,0,0.6)', backgroundColor: 'rgba(255,0,0,0.30)', color: 'rgba(255,0,0,0.98)' }}
                    animate={activePulse}
                    aria-label="CATALOGO VIRTUAL"
                  >
                    CATALOGO VIRTUAL
                  </motion.button>
                ) : title === 'VIDEO INSTALACIÓN RANDOM 2.0' ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05, rotateZ: 2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => { setMode('random'); setPageIndex(0); }}
                      className={`w-20 h-8 px-2 py-1 bg-black/50 border text-[rgba(255,0,0,0.85)] font-lincolnmitre transition-all duration-300 text-[10px] leading-none uppercase tracking-wide ${mode === 'random' ? 'hover:bg-[rgba(255,0,0,0.30)] hover:text-[rgba(255,0,0,0.98)]' : 'hover:bg-[rgba(255,0,0,0.20)] hover:text-[rgba(255,0,0,0.95)]'}`}
                      style={{ borderColor: 'rgba(255,0,0,0.6)', backgroundColor: mode === 'random' ? 'rgba(255,0,0,0.30)' : 'rgba(0,0,0,0.5)', color: mode === 'random' ? 'rgba(255,0,0,0.98)' : 'rgba(255,0,0,0.85)' }}
                      animate={mode === 'random' ? activePulse : undefined}
                      aria-label="RANDOM1"
                    >
                      RANDOM1
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05, rotateZ: 2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => { setMode('random2'); setPageIndex(0); }}
                      className={`w-24 h-8 px-2 py-1 bg-black/50 border text-[rgba(255,0,0,0.85)] font-lincolnmitre transition-all duration-300 text-[10px] leading-none uppercase tracking-wide ${mode === 'random2' ? 'hover:bg-[rgba(255,0,0,0.30)] hover:text-[rgba(255,0,0,0.98)]' : 'hover:bg-[rgba(255,0,0,0.20)] hover:text-[rgba(255,0,0,0.95)]'}`}
                      style={{ borderColor: 'rgba(255,0,0,0.6)', backgroundColor: mode === 'random2' ? 'rgba(255,0,0,0.30)' : 'rgba(0,0,0,0.5)', color: mode === 'random2' ? 'rgba(255,0,0,0.98)' : 'rgba(255,0,0,0.85)' }}
                      animate={mode === 'random2' ? activePulse : undefined}
                      aria-label="RANDOM2"
                    >
                      RANDOM2
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05, rotateZ: 2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => { setMode('backstage'); setPageIndex(0); }}
                      className={`w-20 h-8 px-2 py-1 bg-black/50 border text-[rgba(255,0,0,0.85)] font-lincolnmitre transition-all duration-300 text-[10px] leading-none uppercase tracking-wide ${mode === 'backstage' ? 'hover:bg-[rgba(255,0,0,0.30)] hover:text-[rgba(255,0,0,0.98)]' : 'hover:bg-[rgba(255,0,0,0.20)] hover:text-[rgba(255,0,0,0.95)]'}`}
                      style={{ borderColor: 'rgba(255,0,0,0.6)', backgroundColor: mode === 'backstage' ? 'rgba(255,0,0,0.30)' : 'rgba(0,0,0,0.5)', color: mode === 'backstage' ? 'rgba(255,0,0,0.98)' : 'rgba(255,0,0,0.85)' }}
                      animate={mode === 'backstage' ? activePulse : undefined}
                      aria-label="BACKSTAGE"
                    >
                      BACKSTAGE
                    </motion.button>
                  </>
                ) : title === 'VIDEOS RANDOM' ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05, rotateZ: 2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => { setMode('random'); setPageIndex(0); }}
                      className={`w-20 h-8 px-2 py-1 bg-black/50 border text-[rgba(255,0,0,0.85)] font-lincolnmitre transition-all duration-300 text-[10px] leading-none uppercase tracking-wide ${mode === 'random' ? 'hover:bg-[rgba(255,0,0,0.30)] hover:text-[rgba(255,0,0,0.98)]' : 'hover:bg-[rgba(255,0,0,0.20)] hover:text-[rgba(255,0,0,0.95)]'}`}
                      style={{ borderColor: 'rgba(255,0,0,0.6)', backgroundColor: mode === 'random' ? 'rgba(255,0,0,0.30)' : 'rgba(0,0,0,0.5)', color: mode === 'random' ? 'rgba(255,0,0,0.98)' : 'rgba(255,0,0,0.85)' }}
                      animate={mode === 'random' ? activePulse : undefined}
                      aria-label="VIDEOS 1.0"
                    >
                      VIDEOS 1.0
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05, rotateZ: 2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => { setMode('random2'); setPageIndex(0); }}
                      className={`w-24 h-8 px-2 py-1 bg-black/50 border text-[rgba(255,0,0,0.85)] font-lincolnmitre transition-all duration-300 text-[10px] leading-none uppercase tracking-wide ${mode === 'random2' ? 'hover:bg-[rgba(255,0,0,0.30)] hover:text-[rgba(255,0,0,0.98)]' : 'hover:bg-[rgba(255,0,0,0.20)] hover:text-[rgba(255,0,0,0.95)]'}`}
                      style={{ borderColor: 'rgba(255,0,0,0.6)', backgroundColor: mode === 'random2' ? 'rgba(255,0,0,0.30)' : 'rgba(0,0,0,0.5)', color: mode === 'random2' ? 'rgba(255,0,0,0.98)' : 'rgba(255,0,0,0.85)' }}
                      animate={mode === 'random2' ? activePulse : undefined}
                      aria-label="VIDEOS 2.0"
                    >
                      VIDEOS 2.0
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05, rotateZ: 2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => { setMode('promo'); setPageIndex(0); }}
                      className={`w-20 h-8 px-2 py-1 bg-black/50 border text-[rgba(255,0,0,0.85)] font-lincolnmitre transition-all duration-300 text-[10px] leading-none uppercase tracking-wide ${mode === 'promo' ? 'hover:bg-[rgba(255,0,0,0.30)] hover:text-[rgba(255,0,0,0.98)]' : 'hover:bg-[rgba(255,0,0,0.20)] hover:text-[rgba(255,0,0,0.95)]'}`}
                      style={{ borderColor: 'rgba(255,0,0,0.6)', backgroundColor: mode === 'promo' ? 'rgba(255,0,0,0.30)' : 'rgba(0,0,0,0.5)', color: mode === 'promo' ? 'rgba(255,0,0,0.98)' : 'rgba(255,0,0,0.85)' }}
                      animate={mode === 'promo' ? activePulse : undefined}
                      aria-label="PROMO"
                    >
                      PROMO
                    </motion.button>
                  </>
                ) : (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05, rotateZ: 2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => { setMode('qr'); setPageIndex(0); }}
                      className={`w-20 h-8 px-2 py-1 bg-black/50 border text-[rgba(255,0,0,0.85)] font-lincolnmitre transition-all duration-300 text-[10px] leading-none uppercase tracking-wide ${mode === 'qr' ? 'hover:bg-[rgba(255,0,0,0.30)] hover:text-[rgba(255,0,0,0.98)]' : 'hover:bg-[rgba(255,0,0,0.20)] hover:text-[rgba(255,0,0,0.95)]'}`}
                      style={{ borderColor: 'rgba(255,0,0,0.6)', backgroundColor: mode === 'qr' ? 'rgba(255,0,0,0.30)' : 'rgba(0,0,0,0.5)', color: mode === 'qr' ? 'rgba(255,0,0,0.98)' : 'rgba(255,0,0,0.85)' }}
                      animate={mode === 'qr' ? activePulse : undefined}
                      aria-label="CODIGO QR"
                    >
                      CODIGO QR
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05, rotateZ: 2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => { setMode('game'); setPageIndex(0); }}
                      className={`w-24 h-8 px-2 py-1 bg-black/50 border text-[rgba(255,0,0,0.85)] font-lincolnmitre transition-all duration-300 text-[10px] leading-none uppercase tracking-wide ${mode === 'game' ? 'hover:bg-[rgba(255,0,0,0.30)] hover:text-[rgba(255,0,0,0.98)]' : 'hover:bg-[rgba(255,0,0,0.20)] hover:text-[rgba(255,0,0,0.95)]'}`}
                      style={{ borderColor: 'rgba(255,0,0,0.6)', backgroundColor: mode === 'game' ? 'rgba(255,0,0,0.30)' : 'rgba(0,0,0,0.5)', color: mode === 'game' ? 'rgba(255,0,0,0.98)' : 'rgba(255,0,0,0.85)' }}
                      animate={mode === 'game' ? activePulse : undefined}
                      aria-label="VIDEO GAME"
                    >
                      VIDEO GAME
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05, rotateZ: 2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => { setMode('honorem'); setPageIndex(0); }}
                      className={`w-20 h-8 px-2 py-1 bg-black/50 border text-[rgba(255,0,0,0.85)] font-lincolnmitre transition-all duration-300 text-[10px] leading-none uppercase tracking-wide ${mode === 'honorem' ? 'hover:bg-[rgba(255,0,0,0.30)] hover:text-[rgba(255,0,0,0.98)]' : 'hover:bg-[rgba(255,0,0,0.20)] hover:text-[rgba(255,0,0,0.95)]'}`}
                      style={{ borderColor: 'rgba(255,0,0,0.6)', backgroundColor: mode === 'honorem' ? 'rgba(255,0,0,0.30)' : 'rgba(0,0,0,0.5)', color: mode === 'honorem' ? 'rgba(255,0,0,0.98)' : 'rgba(255,0,0,0.85)' }}
                      animate={mode === 'honorem' ? activePulse : undefined}
                      aria-label="HONOREM"
                    >
                      HONOREM
                    </motion.button>
                  </>
                )}
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
                <div 
                  className={`mx-auto ${mode === 'qr' && isPortrait ? 'w-full h-full flex flex-col justify-center' : 'px-6 md:px-8 py-4 md:py-6'}`} 
                  style={{ 
                     maxWidth: (mode === 'qr' && isPortrait) ? '100%' : (isCompact ? '95%' : '85%'),
                     paddingBottom: (mode === 'qr' && isPortrait) ? '0' : undefined
                   }}
                 >
                  {mode === 'qr' ? (
                    isPortrait && !canShowBothPortrait ? (
                      <div className="relative w-full h-full overflow-hidden">
                        <motion.div
                          className="flex"
                          animate={{ x: -pageIndex * pageWidth }}
                          transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                          style={{ width: `${2 * pageWidth}px`, height: '100%' }}
                        >
                          <div style={{ width: `${pageWidth}px`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <a 
                              href="https://steamcommunity.com/id/proyectorandom/" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="block hover:scale-105 transition-transform duration-300"
                            >
                              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=Proyecto%20RANDOM&color=ff0000&bgcolor=000000`} alt="Código QR" style={{ width: '220px', height: '220px' }} />
                            </a>
                            <div className="text-center px-2 leading-tight">
                              <a 
                                href="https://steamcommunity.com/id/proyectorandom/" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="block hover:opacity-80 transition-opacity duration-300"
                              >
                                <ScrambleText text="DESCARGA RANDOM-VIDEOGAME" className={`font-lincolnmitre text-red-500 text-lg leading-tight tracking-normal ${styles.orangePulse}`} delay={200} />
                              </a>
                              <ScrambleText text={`Una fusión de videojuego, videoarte y documental\nbasada en sueños reales.`} className="font-lincolnmitre text-red-400/90 text-[10px] leading-tight tracking-tight" delay={800} />
                            </div>
                          </div>
                          <div style={{ width: `${pageWidth}px`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img src="/images/Instalacion_Buena.jpg" alt="Imagen" style={{ maxWidth: '100%', maxHeight: '60vh', objectFit: 'contain' }} />
                          </div>
                        </motion.div>
                      </div>
                    ) : (
                      <div className="grid" style={{ gap: '2rem', gridTemplateColumns: '1fr 1fr' }}>
                        <div className="w-full flex flex-col items-center justify-center gap-4">
                          <a 
                            href="https://steamcommunity.com/id/proyectorandom/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block hover:scale-105 transition-transform duration-300"
                          >
                            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=Proyecto%20RANDOM&color=ff0000&bgcolor=000000`} alt="Código QR" style={{ width: '220px', height: '220px' }} />
                          </a>
                          <div className="text-center leading-tight">
                            <a 
                              href="https://steamcommunity.com/id/proyectorandom/" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="block hover:opacity-80 transition-opacity duration-300"
                            >
                              <ScrambleText text="DESCARGA RANDOM-VIDEOGAME" className={`font-lincolnmitre text-red-500 text-lg leading-tight tracking-normal ${styles.orangePulse}`} delay={200} />
                            </a>
                            <ScrambleText text={`Una fusión de videojuego, videoarte y documental\nbasada en sueños reales.`} className="font-lincolnmitre text-red-400/90 text-[10px] leading-tight tracking-tight" delay={800} />
                          </div>
                        </div>
                        <div className="w-full flex items-center justify-center">
                          <img src="/images/Instalacion_Buena.jpg" alt="Imagen" style={{ maxWidth: '100%', maxHeight: '60vh', objectFit: 'contain' }} />
                        </div>
                      </div>
                    )
                  ) : mode === 'catalogo' ? (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-4">
                      <img src="/images/logo_random%5B12%5D.png" alt="Logo Random" className="h-56 md:h-72 object-contain opacity-90" />
                      <ScrambleText text="PRÓXIMAMENTE: CATÁLOGO VIRTUAL" className={`text-[9px] md:text-[10px] font-extrabold font-lincolnmitre text-red-500 text-center ${styles.orangePulse}`} delay={200} />
                    </div>
                  ) : mode === 'honorem' ? (
                    isPortrait && !canShowBothPortrait ? (
                      <div className="relative w-full h-full overflow-hidden">
                        <motion.div
                          className="flex"
                          animate={{ x: `${-pageIndex * 33.3333}%` }}
                          transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                          style={{ width: '300%' }}
                        >
                          <div style={{ width: '33.3333%', padding: '0 1rem' }}>
                            <p
                              ref={leftParaRef}
                              className="font-lincolnmitre text-red-400/90 text-left"
                              style={{ hyphens: 'auto', overflowWrap: 'anywhere', wordBreak: 'break-word', fontSize: `${fontLeft}px`, lineHeight: 1.25 }}
                            >
                              <span className="font-dirtyline text-red-600 font-bold uppercase tracking-wider text-2xl md:text-3xl block mb-2" style={{ fontVariant: 'small-caps' }}>RANDOM</span>
                              Esta obra es el resultado de diez meses de inmersión en la memoria y el código. Lo que comenzó como una serie de videos lineales se transformó, mediante un arduo trabajo de producción, en un territorio vivo y explorable.<br/><br/>
                              <ScrambleText as="span" text="Dirección y Producción" className="font-bold text-red-500" /><br/>
                              Pepo Sabatini<br/>
                              <span className="font-bold text-red-500">Dirección Conceptual y Producción Ejecutiva</span><br/>
                              Bárbara Oettinger<br/>
                              <span className="font-bold text-red-500">Curatoría y Asesoría Artística</span><br/>
                              Sebastián Vidal Valenzuela<br/><br/>

                              <ScrambleText as="span" text="Diseño y Desarrollo (Core Team)" className="font-bold text-red-500" /><br/>
                              <span className="font-bold text-red-500">Diseño de Juego</span> Pepo Sabatini y Javier Rojas<br/>
                              <span className="font-bold text-red-500">Programación</span> Javier Rojas, Ignacio Concha y Pepo Sabatini<br/>
                              <span className="font-bold text-red-500">Guion y Narrativa</span> Pepo Sabatini y Bárbara Oettinger
                            </p>
                          </div>
                          <div style={{ width: '33.3333%', padding: '0 1rem' }}>
                            <p
                              ref={rightParaRef}
                              className="font-lincolnmitre text-red-400/90 text-left"
                              style={{ hyphens: 'auto', overflowWrap: 'anywhere', wordBreak: 'break-word', fontSize: `${fontRight}px`, lineHeight: 1.25 }}
                            >
                              <span className="font-bold text-red-500">Dirección de Arte</span><br/>
                              Pepo Sabatini y Bárbara Oettinger<br/>
                              <span className="font-bold text-red-500">Dirección de Fotografía y Cámaras</span><br/>
                              Pepo Sabatini<br/>
                              <span className="font-bold text-red-500">Arte 3D y Entornos</span><br/>
                              Pepo Sabatini y Javier Rojas<br/>
                              <span className="font-bold text-red-500">Arte 2D y UI (Interfaz de Usuario)</span><br/>
                              Javier Rojas e Ignacio Concha<br/>
                              <span className="font-bold text-red-500">Animación y Rigging</span><br/>
                              Fernanda Aguirre y Pepo Sabatini<br/>
                              <span className="font-bold text-red-500">Digitalización y Creación de Personajes</span><br/>
                              Pepo Sabatini<br/><br/>

                              <ScrambleText as="span" text="Audio y Música" className="font-bold text-red-500" /><br/>
                              <span className="font-bold text-red-500">Composición Musical</span> Lost Tropicales y Sebastián Lagos<br/>
                              <span className="font-bold text-red-500">Efectos (SFX)</span> Sebastián Lagos Ossa
                            </p>
                          </div>
                          <div style={{ width: '33.3333%', padding: '0 1rem' }}>
                            <p
                              ref={thirdParaRef}
                              className="font-lincolnmitre text-red-400/90 text-left"
                              style={{ hyphens: 'auto', overflowWrap: 'anywhere', wordBreak: 'break-word', fontSize: `${fontThird}px`, lineHeight: 1.25 }}
                            >
                              <ScrambleText as="span" text="Equipo de Entrevistas y Montaje" className="font-bold text-red-500" /><br/>
                              Pepo Sabatini<br/>
                              <span className="font-bold text-red-500">Entrevistadora y Asistencia en Terreno</span><br/>
                              Fernanda Aguirre<br/><br/>

                              <ScrambleText as="span" text="Elenco (Soñadores / Entrevistados)" className="font-bold text-red-500" /><br/>
                              Camila Estrella<br/>
                              Eduardo Vega<br/>
                              Kate Hosh<br/><br/>

                              <ScrambleText as="span" text="Agradecimientos y Financiamiento" className="font-bold text-red-500" /><br/>
                              El proyecto fue financiado por el Consejo Nacional de las Culturas, las Artes y el Patrimonio de Chile.<br/>
                              <span className="mt-2 flex w-full justify-center items-center gap-4">
                                <img src="/images/monocromo%20Blanco_MCAP.png" alt="Logo MCAP" className="h-14" />
                                <img src="/images/logo-fntsm_bn2.png" alt="Logo FNTSM" className="h-14" />
                              </span>
                            </p>
                          </div>
                        </motion.div>
                      </div>
                    ) : (
                      <div className="grid" style={{ gap: '2rem', gridTemplateColumns: '1fr 1fr' }}>
                        <p
                          ref={leftParaRef}
                          className="font-lincolnmitre text-red-400/90 text-left"
                          style={{ hyphens: 'auto', overflowWrap: 'anywhere', wordBreak: 'break-word', fontSize: `${fontLeft}px`, lineHeight: 1.25 }}
                        >
                          <span className="font-dirtyline text-red-600 font-bold uppercase tracking-wider text-2xl md:text-3xl block mb-2" style={{ fontVariant: 'small-caps' }}>RANDOM</span>
                          Esta obra es el resultado de diez meses de inmersión en la memoria y el código. Lo que comenzó como una serie de videos lineales se transformó, mediante un arduo trabajo de producción, en un territorio vivo y explorable.<br/><br/>
                          <ScrambleText as="span" text="Dirección y Producción" className="font-bold text-red-500" /><br/>
                          Pepo Sabatini<br/>
                          <span className="font-bold text-red-500">Dirección Conceptual y Producción Ejecutiva</span><br/>
                          Bárbara Oettinger<br/>
                          <span className="font-bold text-red-500">Curatoría y Asesoría Artística</span><br/>
                          Sebastián Vidal Valenzuela<br/><br/>

                          <ScrambleText as="span" text="Diseño y Desarrollo (Core Team)" className="font-bold text-red-500" /><br/>
                          <span className="font-bold text-red-500">Diseño de Juego</span> Pepo Sabatini y Javier Rojas<br/>
                          <span className="font-bold text-red-500">Programación</span> Javier Rojas, Ignacio Concha y Pepo Sabatini<br/>
                          <span className="font-bold text-red-500">Guion y Narrativa</span> Pepo Sabatini y Bárbara Oettinger<br/><br/>

                          <span className="font-bold text-red-500">Dirección de Arte</span><br/>
                          Pepo Sabatini y Bárbara Oettinger<br/>
                          <span className="font-bold text-red-500">Dirección de Fotografía y Cámaras</span><br/>
                          Pepo Sabatini<br/>
                          <span className="font-bold text-red-500">Arte 3D y Entornos</span><br/>
                          Pepo Sabatini y Javier Rojas
                        </p>
                        <div className="flex flex-col gap-2">
                          <p ref={rightParaRef} className="font-lincolnmitre text-red-400/90 text-left" style={{ hyphens: 'auto', overflowWrap: 'anywhere', wordBreak: 'break-word', fontSize: `${fontRight}px`, lineHeight: 1.25 }}>
                            <span className="font-bold text-red-500">Arte 2D y UI (Interfaz de Usuario)</span><br/>
                            Javier Rojas e Ignacio Concha<br/>
                            <span className="font-bold text-red-500">Animación y Rigging</span><br/>
                            Fernanda Aguirre y Pepo Sabatini<br/>
                            <span className="font-bold text-red-500">Digitalización y Creación de Personajes</span><br/>
                            Pepo Sabatini<br/><br/>

                            <ScrambleText as="span" text="Audio y Música" className="font-bold text-red-500" /><br/>
                            <span className="font-bold text-red-500">Composición Musical</span> Lost Tropicales y Sebastián Lagos<br/>
                            <span className="font-bold text-red-500">Efectos (SFX)</span> Sebastián Lagos Ossa<br/><br/>

                            <ScrambleText as="span" text="Equipo de Entrevistas y Montaje" className="font-bold text-red-500" /><br/>
                            Pepo Sabatini<br/>
                            <span className="font-bold text-red-500">Entrevistadora y Asistencia en Terreno</span><br/>
                            Fernanda Aguirre<br/><br/>

                            <ScrambleText as="span" text="Elenco (Soñadores / Entrevistados)" className="font-bold text-red-500" /><br/>
                            Camila Estrella<br/>
                            Eduardo Vega<br/>
                            Kate Hosh
                          </p>
                          <p ref={thirdParaRef} className="font-lincolnmitre text-red-400/90 text-left" style={{ hyphens: 'auto', overflowWrap: 'anywhere', wordBreak: 'break-word', fontSize: `${fontThird}px`, lineHeight: 1.25 }}>
                            <ScrambleText as="span" text="Agradecimientos y Financiamiento" className="font-bold text-red-500" /><br/>
                            El proyecto fue financiado por el Consejo Nacional de las Culturas, las Artes y el Patrimonio de Chile.<br/>
                              <span className="mt-2 inline-flex items-center gap-4">
                                <img src="/images/monocromo%20Blanco_MCAP.png" alt="Logo MCAP" className="h-14" />
                                <img src="/images/logo-fntsm_bn2.png" alt="Logo FNTSM" className="h-14" />
                              </span>
                            </p>
                        </div>
                      </div>
                    )
                  ) : (mode === 'random' || mode === 'random2' || mode === 'promo') ? (
                    isPortrait && !canShowBothPortrait ? (
                      <div className="relative w-full h-full overflow-hidden">
                        <motion.div
                          className="flex"
                          animate={{ x: `${-pageIndex * 50}%` }}
                          transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                          style={{ width: '200%' }}
                        >
                          <div style={{ width: '50%', padding: '0 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            {(mode !== 'random2' || title === 'VIDEO INSTALACIÓN RANDOM 2.0') && (
                              <>
                                <img 
                                  src={mode === 'promo' ? "/images/FONDO2.jpg" : (mode === 'random2' ? "/images/MAC1.png" : (title === 'VIDEOS RANDOM' ? "/images/fondo_random1.jpg" : "/images/CEINAA1.png"))}
                                  alt="Fondo Random" 
                                  className={`w-full h-auto max-w-[90%] ${title === 'VIDEOS RANDOM' ? 'max-h-[80%]' : 'max-h-[90%]'} object-contain opacity-90 mb-4`} 
                                />
                                <div className="text-center px-2 leading-tight">
                                  <ScrambleText 
                                  text={mode === 'promo' ? `LA PRODUCCIÓN DE RANDOM 2.0\nCOMIENZA INICIOS DEL 2025` : (mode === 'random2' ? `VIDEO INSTALACIÓN EN MAC\nFORESTAL 2025 (3 MESES)` : (title === 'VIDEOS RANDOM' ? `LA PRODUCCIÓN DEL IMAGINARIO\nCOMIENZA DURANTE LA PANDEMIA 2020` : `VIDEO INSTALACION EN CEINA 2022 (3 MESES)`))}
                                  className={`font-lincolnmitre text-red-500 ${title === 'VIDEOS RANDOM' ? 'text-[9px]' : 'text-[10px]'} leading-tight tracking-normal ${styles.orangePulse}`} 
                                  delay={200} 
                                />
                                </div>
                              </>
                            )}
                            {(mode === 'random2' && title !== 'VIDEO INSTALACIÓN RANDOM 2.0') && (
                              <div className="flex flex-col justify-center font-lincolnmitre text-red-400/90 text-left text-[12.35px] md:text-[14.25px]" style={{ lineHeight: 1.25 }}>
                                <ScrambleText 
                                  text="SEIS PERSONAJES 2025"
                                  className={`font-lincolnmitre text-red-500 text-[16px] leading-tight tracking-normal mb-1 ${styles.orangePulse}`} 
                                  delay={200} 
                                />
                                <ScrambleText 
                                  text="TRES SOÑADORES"
                                  className={`font-lincolnmitre text-red-500 text-[12px] leading-tight tracking-normal mb-4 ${styles.orangePulse}`} 
                                  delay={400} 
                                />
                                <div className="flex items-center gap-4 mb-4">
                                  <img src="/images/kate1.jpg" alt="Kate" className="h-[3.8rem] w-auto opacity-90 object-contain" />
                                  <div>
                                    <span className="text-red-500 font-bold block">Kate - Anim UE5(1-2MINS)</span>
                                    <motion.a 
                                      href="https://youtu.be/E4AzwuhNcJI" 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="cursor-pointer"
                                      whileHover={{ 
                                        color: ["#ef4444", "#ffff00", "#ef4444"],
                                        transition: { duration: 0.2, repeat: Infinity }
                                      }}
                                    >
                                      Performance musical
                                    </motion.a><br/>
                                    <motion.a 
                                      href="https://youtu.be/HMoeyIKjsJA" 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="cursor-pointer"
                                      whileHover={{ 
                                        color: ["#ef4444", "#ffff00", "#ef4444"],
                                        transition: { duration: 0.2, repeat: Infinity }
                                      }}
                                    >
                                      Entrevista real
                                    </motion.a>
                                  </div>
                                </div>

                                <div className="flex items-center gap-4 mb-4">
                                  <img src="/images/cami1.jpg" alt="Camila" className="h-[3.8rem] w-auto opacity-90 object-contain" />
                                  <div>
                                    <span className="text-red-500 font-bold block">Camila - Anim UE5(1-2MINS)</span>
                                    <motion.a 
                                      href="https://youtu.be/wJ4K8c4fvB0" 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="cursor-pointer"
                                      whileHover={{ 
                                        color: ["#ef4444", "#ffff00", "#ef4444"],
                                        transition: { duration: 0.2, repeat: Infinity }
                                      }}
                                    >
                                      Performance musical
                                    </motion.a><br/>
                                    <motion.a 
                                      href="https://youtu.be/9bye_8dSZPE" 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="cursor-pointer"
                                      whileHover={{ 
                                        color: ["#ef4444", "#ffff00", "#ef4444"],
                                        transition: { duration: 0.2, repeat: Infinity }
                                      }}
                                    >
                                      Entrevista real
                                    </motion.a>
                                  </div>
                                </div>

                                <div className="flex items-center gap-4 mb-4 relative">
                                  <img src="/images/edu1.jpg" alt="Eduardo" className="h-[3.8rem] w-auto opacity-90 object-contain" />
                                  <div>
                                    <span className="text-red-500 font-bold block">EDU - Anim UE5(1-2MINS)</span>
                                    <motion.a 
                                      href="https://youtu.be/oJS5yKgTn6I" 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="cursor-pointer"
                                      whileHover={{ 
                                        color: ["#ef4444", "#ffff00", "#ef4444"],
                                        transition: { duration: 0.2, repeat: Infinity }
                                      }}
                                    >
                                      Performance musical
                                    </motion.a><br/>
                                    <motion.a 
                                      href="https://youtu.be/8LgXcLD3bsY" 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="cursor-pointer"
                                      whileHover={{ 
                                        color: ["#ef4444", "#ffff00", "#ef4444"],
                                        transition: { duration: 0.2, repeat: Infinity }
                                      }}
                                    >
                                      Entrevista real
                                    </motion.a>
                                  </div>
                                </div>

                                <div className={`w-full flex justify-center -mt-5 ${styles.orangePulse}`}>
                                  <ScrambleElement delay={600} repeatInterval={4000} size="1.25rem" className="font-lincolnmitre text-2xl">
                                    <svg 
                                      xmlns="http://www.w3.org/2000/svg" 
                                      fill="none" 
                                      viewBox="0 0 24 24" 
                                      strokeWidth={2} 
                                      stroke="currentColor" 
                                      className="w-5 h-5"
                                    >
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeDasharray="0 4" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                                    </svg>
                                  </ScrambleElement>
                                </div>
                              </div>
                            )}
                          </div>
                          <div style={{ width: '50%', padding: '0 1rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <div className="flex flex-col justify-center font-lincolnmitre text-red-400/90 text-left text-[12.35px] md:text-[14.25px]" style={{ lineHeight: 1.25 }}>
                              {mode !== 'random2' ? (
                                (mode === 'promo' || title !== 'VIDEO INSTALACIÓN RANDOM 2.0') && (
                                  <>
                                    <div className="flex items-center gap-4 mb-3">
                                      <img src="/images/covid3.jpg" alt="COVID" className="h-[3.8rem] w-auto opacity-90 object-contain" />
                                      <div>
                                        <span className="text-red-500 font-bold block">Invitación RANDOM 2020</span>
                                        <motion.a 
                                          href="https://youtu.be/JtRa59EP3EM" 
                                          target="_blank" 
                                          rel="noopener noreferrer" 
                                          className="cursor-pointer"
                                          whileHover={{ 
                                            color: ["#ef4444", "#ffff00", "#ef4444"],
                                            transition: { duration: 0.2, repeat: Infinity }
                                          }}
                                        >
                                          * Machinima 60 segs.
                                        </motion.a>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-4 mb-3">
                                      <img src={mode === 'promo' ? "/images/Controli.jpg" : "/images/edu22.jpg"} alt="Eduardo" className="h-[3.8rem] w-auto opacity-90 object-contain" />
                                      <div>
                                        <span className="text-red-500 font-bold block">
                                          {mode === 'promo' ? "INVITACION RANDOM 2.0" : "EDU - MACHINIMAS (8mins)"}
                                        </span>
                                        {mode === 'promo' ? (
                                          <motion.a 
                                            href="https://youtu.be/KxjEt8ApZuw" 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="cursor-pointer"
                                            whileHover={{ 
                                              color: ["#ef4444", "#ffff00", "#ef4444"],
                                              transition: { duration: 0.2, repeat: Infinity }
                                            }}
                                          >
                                            * ANIMACIÓN UE5 60 SEGS.
                                          </motion.a>
                                        ) : (
                                          <>
                                            <motion.a 
                                              href="https://youtu.be/cjP86McO_i4" 
                                              target="_blank" 
                                              rel="noopener noreferrer" 
                                              className="cursor-pointer"
                                              whileHover={{ 
                                                color: ["#ef4444", "#ffff00", "#ef4444"],
                                                transition: { duration: 0.2, repeat: Infinity }
                                              }}
                                            >
                                              pantalla soñador
                                            </motion.a><br/>
                                            <motion.a 
                                              href="https://youtu.be/DE-UgFRsSww" 
                                              target="_blank" 
                                              rel="noopener noreferrer" 
                                              className="cursor-pointer"
                                              whileHover={{ 
                                                color: ["#ef4444", "#ffff00", "#ef4444"],
                                                transition: { duration: 0.2, repeat: Infinity }
                                              }}
                                            >
                                              pantalla pajaro
                                            </motion.a>
                                          </>
                                        )}
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-4 mb-3">
                                      <img src={mode === 'promo' ? "/images/death1.jpg" : "/images/cami2.jpg"} alt="Camila" className="h-[3.8rem] w-auto opacity-90 object-contain" />
                                      <div>
                                        <span className="text-red-500 font-bold block">
                                          {mode === 'promo' ? "PAJARO VIDEO INSTALACIÓN" : "CAMI - MACHINIMAS (8mins)"}
                                        </span>
                                        {mode === 'promo' ? (
                                          <motion.a 
                                            href="https://youtu.be/BjVqI0NZBoU" 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="cursor-pointer"
                                            whileHover={{ 
                                              color: ["#ef4444", "#ffff00", "#ef4444"],
                                              transition: { duration: 0.2, repeat: Infinity }
                                            }}
                                          >
                                            * ANIMACION UE5 8 MINS.
                                          </motion.a>
                                        ) : (
                                          <>
                                            <motion.a 
                                              href="https://youtu.be/3eW-dS2PuMI" 
                                              target="_blank" 
                                              rel="noopener noreferrer" 
                                              className="cursor-pointer"
                                              whileHover={{ 
                                                color: ["#ef4444", "#ffff00", "#ef4444"],
                                                transition: { duration: 0.2, repeat: Infinity }
                                              }}
                                            >
                                              pantalla soñadora
                                            </motion.a><br/>
                                            <motion.a 
                                              href="https://youtu.be/kU6Hli2Ed3s" 
                                              target="_blank" 
                                              rel="noopener noreferrer" 
                                              className="cursor-pointer"
                                              whileHover={{ 
                                                color: ["#ef4444", "#ffff00", "#ef4444"],
                                                transition: { duration: 0.2, repeat: Infinity }
                                              }}
                                            >
                                              pantalla pajaro
                                            </motion.a>
                                          </>
                                        )}
                                      </div>
                                    </div>

                                    {mode !== 'promo' && (
                                      <div className="flex items-center gap-4 mb-3">
                                        <img src="/images/kate22.jpg" alt="Kate" className="h-[3.8rem] w-auto opacity-90 object-contain" />
                                        <div>
                                          <span className="text-red-500 font-bold block">
                                            KATE - MACHINIMAS (8mins)
                                          </span>
                                          <>
                                            <motion.a 
                                              href="https://youtu.be/6DlwEnoB5Bg" 
                                              target="_blank" 
                                              rel="noopener noreferrer" 
                                              className="cursor-pointer"
                                              whileHover={{ 
                                                color: ["#ef4444", "#ffff00", "#ef4444"],
                                                transition: { duration: 0.2, repeat: Infinity }
                                              }}
                                            >
                                              pantalla soñadora
                                            </motion.a><br/>
                                            <motion.a 
                                              href="https://youtu.be/FLu9-ElNKBg" 
                                              target="_blank" 
                                              rel="noopener noreferrer" 
                                              className="cursor-pointer"
                                              whileHover={{ 
                                                color: ["#ef4444", "#ffff00", "#ef4444"],
                                                transition: { duration: 0.2, repeat: Infinity }
                                              }}
                                            >
                                              pantalla pajaro
                                            </motion.a>
                                          </>
                                        </div>
                                      </div>
                                    )}
                                  </>
                                )
                              ) : (
                                title !== 'VIDEO INSTALACIÓN RANDOM 2.0' ? (
                                <div className="mt-[5px]">
                                  <ScrambleText 
                                    text="SEIS PERSONAJES 2025"
                                    className={`font-lincolnmitre text-red-500 text-[16px] leading-tight tracking-normal mb-1 ${styles.orangePulse}`} 
                                    delay={200} 
                                  />
                                  <ScrambleText 
                                    text="TRES COLABORADORES"
                                    className={`font-lincolnmitre text-red-500 text-[12px] leading-tight tracking-normal mb-4 ${styles.orangePulse}`} 
                                    delay={400} 
                                  />
                                  <div className="flex items-center gap-4 mb-4">
                                    <img src="/images/pepo1.jpg" alt="Pepo" className="h-[3.8rem] w-auto opacity-90 object-contain" />
                                    <div>
                                      <span className="text-red-500 font-bold block">Pepo - Anim UE5(1-2MINS)</span>
                                      <motion.a 
                                        href="https://youtu.be/7vnFs4LjnFA" 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="cursor-pointer"
                                        whileHover={{ 
                                          color: ["#ef4444", "#ffff00", "#ef4444"],
                                          transition: { duration: 0.2, repeat: Infinity }
                                        }}
                                      >
                                        Performance musical
                                      </motion.a><br/>
                                      <motion.a 
                                        href="https://youtu.be/8tIy1V8Fvnw" 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="cursor-pointer"
                                        whileHover={{ 
                                          color: ["#ef4444", "#ffff00", "#ef4444"],
                                          transition: { duration: 0.2, repeat: Infinity }
                                        }}
                                      >
                                        Entrevista real
                                      </motion.a>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-4 mb-4">
                                      <img src="/images/brbr1.jpg" alt="Bárbara" className="h-[3.8rem] w-auto opacity-90 object-contain" />
                                      <div>
                                        <span className="text-red-500 font-bold block">Bárbara - Anim UE5(1-2MINS)</span>
                                        <motion.a 
                                          href="https://youtu.be/W-_fscZRhjc" 
                                          target="_blank" 
                                          rel="noopener noreferrer" 
                                          className="cursor-pointer"
                                          whileHover={{ 
                                            color: ["#ef4444", "#ffff00", "#ef4444"],
                                            transition: { duration: 0.2, repeat: Infinity }
                                          }}
                                        >
                                          Performance musical
                                        </motion.a><br/>
                                        <motion.a 
                                          href="https://youtu.be/bfmMWLYdPWU" 
                                          target="_blank" 
                                          rel="noopener noreferrer" 
                                          className="cursor-pointer"
                                          whileHover={{ 
                                            color: ["#ef4444", "#ffff00", "#ef4444"],
                                            transition: { duration: 0.2, repeat: Infinity }
                                          }}
                                        >
                                          Entrevista real
                                        </motion.a>
                                      </div>
                                    </div>

                                  <div className="flex items-center gap-4 mb-4 relative">
                                    <img src="/images/seba2.jpg" alt="Sebastián" className="h-[3.8rem] w-auto opacity-90 object-contain" />
                                    <div>
                                      <span className="text-red-500 font-bold block">Seba - Anim UE5(1-2MINS)</span>
                                      <motion.a 
                                        href="https://youtu.be/qqHvMtDV-Iw" 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="cursor-pointer"
                                        whileHover={{ 
                                          color: ["#ef4444", "#ffff00", "#ef4444"],
                                          transition: { duration: 0.2, repeat: Infinity }
                                        }}
                                      >
                                        Performance musical
                                      </motion.a><br/>
                                      <motion.a 
                                        href="https://youtu.be/Jlwt9ipYPoY" 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="cursor-pointer"
                                        whileHover={{ 
                                          color: ["#ef4444", "#ffff00", "#ef4444"],
                                          transition: { duration: 0.2, repeat: Infinity }
                                        }}
                                      >
                                        Entrevista real
                                      </motion.a>
                                    </div>
                                  </div>

                                  <div className={`w-full flex justify-center -mt-5 ${styles.orangePulse}`}>
                                    <ScrambleElement delay={600} repeatInterval={4000} size="1.25rem" className="font-lincolnmitre text-2xl">
                                      <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        strokeWidth={2} 
                                        stroke="currentColor" 
                                        className="w-5 h-5 rotate-180"
                                      >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeDasharray="0 4" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                                      </svg>
                                    </ScrambleElement>
                                  </div>
                                </div>
                                ) : (
                                  <MacImageSlideshow />
                                )
                              )}
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full">
                        <div className="w-full h-full flex flex-col items-center justify-center">
                          {(mode !== 'random2' || title === 'VIDEO INSTALACIÓN RANDOM 2.0') && (
                            <>
                              <img 
                                src={mode === 'promo' ? "/images/FONDO2.jpg" : (mode === 'random2' ? "/images/MAC1.png" : (title === 'VIDEOS RANDOM' ? "/images/fondo_random1.jpg" : "/images/CEINAA1.png"))}
                                alt="Fondo Random" 
                                className={`w-full h-auto max-w-[90%] ${title === 'VIDEOS RANDOM' ? 'max-h-[80%]' : 'max-h-[90%]'} object-contain opacity-90 mb-4`} 
                              />
                              <div className="text-center px-2 leading-tight">
                                <ScrambleText 
                                  text={mode === 'promo' ? `LA PRODUCCIÓN DE RANDOM 2.0\nCOMIENZA INICIOS DEL 2025` : (mode === 'random2' ? `VIDEO INSTALACIÓN EN MAC\nFORESTAL 2025 (3 MESES)` : (title === 'VIDEOS RANDOM' ? `LA PRODUCCIÓN DEL IMAGINARIO\nCOMIENZA DURANTE LA PANDEMIA 2020` : `VIDEO INSTALACION EN CEINA 2022 (3 MESES)`))}
                                  className={`font-lincolnmitre text-red-500 ${title === 'VIDEOS RANDOM' ? 'text-[9px]' : 'text-[10px]'} leading-tight tracking-normal ${styles.orangePulse}`} 
                                  delay={200} 
                                />
                              </div>
                            </>
                          )}
                          {(mode === 'random2' && title !== 'VIDEO INSTALACIÓN RANDOM 2.0') && (
                            <div className="flex flex-col justify-center font-lincolnmitre text-red-400/90 text-left text-[13px] md:text-[15px]" style={{ lineHeight: 1.25 }}>
                              <ScrambleText 
                                text="SEIS PERSONAJES 2025"
                                className={`font-lincolnmitre text-red-500 text-[16px] leading-tight tracking-normal mb-1 ${styles.orangePulse}`} 
                                delay={200} 
                              />
                              <ScrambleText 
                                text="TRES SOÑADORES"
                                className={`font-lincolnmitre text-red-500 text-[12px] leading-tight tracking-normal mb-4 ${styles.orangePulse}`} 
                                delay={400} 
                              />
                              <div className="flex items-center gap-4 mb-4">
                                  <img src="/images/kate1.jpg" alt="Kate" className="h-16 w-auto opacity-90 object-contain" />
                                  <div>
                                    <span className="text-red-500 font-bold block">Kate - Anim UE5(1-2MINS)</span>
                                    <motion.a 
                                    href="https://youtu.be/E4AzwuhNcJI" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="cursor-pointer"
                                    whileHover={{ 
                                      color: ["#ef4444", "#ffff00", "#ef4444"],
                                      transition: { duration: 0.2, repeat: Infinity }
                                    }}
                                  >
                                    Performance musical
                                  </motion.a><br/>
                                    <motion.a 
                                      href="https://youtu.be/HMoeyIKjsJA" 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="cursor-pointer"
                                      whileHover={{ 
                                        color: ["#ef4444", "#ffff00", "#ef4444"],
                                        transition: { duration: 0.2, repeat: Infinity }
                                      }}
                                    >
                                      Entrevista real
                                    </motion.a>
                                  </div>
                                </div>

                              <div className="flex items-center gap-4 mb-4">
                                <img src="/images/cami1.jpg" alt="Camila" className="h-16 w-auto opacity-90 object-contain" />
                                <div>
                                  <span className="text-red-500 font-bold block">Camila - Anim UE5(1-2MINS)</span>
                                  <motion.a 
                                    href="https://youtu.be/wJ4K8c4fvB0" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="cursor-pointer"
                                    whileHover={{ 
                                      color: ["#ef4444", "#ffff00", "#ef4444"],
                                      transition: { duration: 0.2, repeat: Infinity }
                                    }}
                                  >
                                    Performance musical
                                  </motion.a><br/>
                                  <motion.a 
                                    href="https://youtu.be/9bye_8dSZPE" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="cursor-pointer"
                                    whileHover={{ 
                                      color: ["#ef4444", "#ffff00", "#ef4444"],
                                      transition: { duration: 0.2, repeat: Infinity }
                                    }}
                                  >
                                    Entrevista real
                                  </motion.a>
                                </div>
                              </div>

                              <div className="flex items-center gap-4 mb-4 relative">
                                <img src="/images/edu1.jpg" alt="Eduardo" className="h-16 w-auto opacity-90 object-contain" />
                                <div>
                                  <span className="text-red-500 font-bold block">EDU - Anim UE5(1-2MINS)</span>
                                  <motion.a 
                                    href="https://youtu.be/oJS5yKgTn6I" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="cursor-pointer"
                                    whileHover={{ 
                                      color: ["#ef4444", "#ffff00", "#ef4444"],
                                      transition: { duration: 0.2, repeat: Infinity }
                                    }}
                                  >
                                    Performance musical
                                  </motion.a><br/>
                                  <motion.a 
                                    href="https://youtu.be/8LgXcLD3bsY" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="cursor-pointer"
                                    whileHover={{ 
                                      color: ["#ef4444", "#ffff00", "#ef4444"],
                                      transition: { duration: 0.2, repeat: Infinity }
                                    }}
                                  >
                                    Entrevista real
                                  </motion.a>
                                </div>
                              </div>

                              <div className={`w-full flex justify-center -mt-5 md:hidden ${styles.orangePulse}`}>
                                   <ScrambleElement delay={600} repeatInterval={4000} size="1.25rem" className="font-lincolnmitre text-2xl">
                                     <svg 
                                       xmlns="http://www.w3.org/2000/svg" 
                                       fill="none" 
                                       viewBox="0 0 24 24" 
                                       strokeWidth={2} 
                                       stroke="currentColor" 
                                       className="w-5 h-5"
                                     >
                                       <path strokeLinecap="round" strokeLinejoin="round" strokeDasharray="0 4" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                                     </svg>
                                   </ScrambleElement>
                                 </div>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col justify-center font-lincolnmitre text-red-400/90 text-left text-[13px] md:text-[15px]" style={{ lineHeight: 1.25 }}>
                          {mode !== 'random2' ? (
                            (mode === 'promo' || title !== 'VIDEO INSTALACIÓN RANDOM 2.0') && (
                              <>
                                <div className="flex items-center gap-4 mb-4">
                                  <img src="/images/covid3.jpg" alt="COVID" className="h-16 w-auto opacity-90 object-contain" />
                                  <div>
                                    <span className="text-red-500 font-bold block">Invitación RANDOM 2020</span>
                                    <motion.a 
                                      href="https://youtu.be/JtRa59EP3EM" 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="cursor-pointer"
                                      whileHover={{ 
                                        color: ["#ef4444", "#ffff00", "#ef4444"],
                                        transition: { duration: 0.2, repeat: Infinity }
                                      }}
                                    >
                                      * Machinima 60 segs.
                                    </motion.a>
                                  </div>
                                </div>

                                <div className="flex items-center gap-4 mb-4">
                                  <img src={mode === 'promo' ? "/images/Controli.jpg" : "/images/edu22.jpg"} alt="Eduardo" className="h-16 w-auto opacity-90 object-contain" />
                                  <div>
                                    <span className="text-red-500 font-bold block">
                                      {mode === 'promo' ? "INVITACION RANDOM 2.0" : "EDU - MACHINIMAS (8mins)"}
                                    </span>
                                    {mode === 'promo' ? (
                                      <motion.a 
                                        href="https://youtu.be/KxjEt8ApZuw" 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="cursor-pointer"
                                        whileHover={{ 
                                          color: ["#ef4444", "#ffff00", "#ef4444"],
                                          transition: { duration: 0.2, repeat: Infinity }
                                        }}
                                      >
                                        * ANIMACIÓN UE5 60 SEGS.
                                      </motion.a>
                                    ) : (
                                      <>
                                        <motion.a 
                                          href="https://youtu.be/cjP86McO_i4" 
                                          target="_blank" 
                                          rel="noopener noreferrer" 
                                          className="cursor-pointer"
                                          whileHover={{ 
                                            color: ["#ef4444", "#ffff00", "#ef4444"],
                                            transition: { duration: 0.2, repeat: Infinity }
                                          }}
                                        >
                                          pantalla soñador
                                        </motion.a><br/>
                                        <motion.a 
                                          href="https://youtu.be/DE-UgFRsSww" 
                                          target="_blank" 
                                          rel="noopener noreferrer" 
                                          className="cursor-pointer"
                                          whileHover={{ 
                                            color: ["#ef4444", "#ffff00", "#ef4444"],
                                            transition: { duration: 0.2, repeat: Infinity }
                                          }}
                                        >
                                          pantalla pajaro
                                        </motion.a>
                                      </>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-4 mb-4">
                                  <img src={mode === 'promo' ? "/images/death1.jpg" : "/images/cami2.jpg"} alt="Camila" className="h-16 w-auto opacity-90 object-contain" />
                                  <div>
                                    <span className="text-red-500 font-bold block">
                                      {mode === 'promo' ? "PAJARO VIDEO INSTALACIÓN" : "CAMI - MACHINIMAS (8mins)"}
                                    </span>
                                    {mode === 'promo' ? (
                                      <motion.a 
                                        href="https://youtu.be/BjVqI0NZBoU" 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="cursor-pointer"
                                        whileHover={{ 
                                          color: ["#ef4444", "#ffff00", "#ef4444"],
                                          transition: { duration: 0.2, repeat: Infinity }
                                        }}
                                      >
                                        * ANIMACION UE5 8 MINS.
                                      </motion.a>
                                    ) : (
                                      <>
                                        <motion.a 
                                          href="https://youtu.be/3eW-dS2PuMI" 
                                          target="_blank" 
                                          rel="noopener noreferrer" 
                                          className="cursor-pointer"
                                          whileHover={{ 
                                            color: ["#ef4444", "#ffff00", "#ef4444"],
                                            transition: { duration: 0.2, repeat: Infinity }
                                          }}
                                        >
                                          pantalla soñadora
                                        </motion.a><br/>
                                        <motion.a 
                                          href="https://youtu.be/kU6Hli2Ed3s" 
                                          target="_blank" 
                                          rel="noopener noreferrer" 
                                          className="cursor-pointer"
                                          whileHover={{ 
                                            color: ["#ef4444", "#ffff00", "#ef4444"],
                                            transition: { duration: 0.2, repeat: Infinity }
                                          }}
                                        >
                                          pantalla pajaro
                                        </motion.a>
                                      </>
                                    )}
                                  </div>
                                </div>

                                {mode !== 'promo' && (
                                  <div className="flex items-center gap-4 mb-4">
                                    <img src="/images/kate22.jpg" alt="Kate" className="h-16 w-auto opacity-90 object-contain" />
                                    <div>
                                      <span className="text-red-500 font-bold block">
                                      KATE - MACHINIMAS (8mins)
                                    </span>
                                      <>
                                        <motion.a 
                                          href="https://youtu.be/6DlwEnoB5Bg" 
                                          target="_blank" 
                                          rel="noopener noreferrer" 
                                          className="cursor-pointer"
                                          whileHover={{ 
                                            color: ["#ef4444", "#ffff00", "#ef4444"],
                                            transition: { duration: 0.2, repeat: Infinity }
                                          }}
                                        >
                                          pantalla soñadora
                                        </motion.a><br/>
                                        <motion.a 
                                          href="https://youtu.be/FLu9-ElNKBg" 
                                          target="_blank" 
                                          rel="noopener noreferrer" 
                                          className="cursor-pointer"
                                          whileHover={{ 
                                            color: ["#ef4444", "#ffff00", "#ef4444"],
                                            transition: { duration: 0.2, repeat: Infinity }
                                          }}
                                        >
                                          pantalla pajaro
                                        </motion.a>
                                      </>
                                    </div>
                                  </div>
                                )}
                              </>
                            )
                          ) : (
                                title !== 'VIDEO INSTALACIÓN RANDOM 2.0' ? (
                                <div className="mt-[5px]">
                                  <ScrambleText 
                                    text="SEIS PERSONAJES 2025"
                                    className={`font-lincolnmitre text-red-500 text-[16px] leading-tight tracking-normal mb-1 ${styles.orangePulse}`} 
                                    delay={200} 
                                  />
                                  <ScrambleText 
                                    text="TRES COLABORADORES"
                                    className={`font-lincolnmitre text-red-500 text-[12px] leading-tight tracking-normal mb-4 ${styles.orangePulse}`} 
                                    delay={400} 
                                  />
                                  <div className="flex items-center gap-4 mb-4">
                                    <img src="/images/pepo1.jpg" alt="Pepo" className="h-16 w-auto opacity-90 object-contain" />
                                    <div>
                                      <span className="text-red-500 font-bold block">Pepo - Anim UE5(1-2MINS)</span>
                                      <motion.a 
                                        href="https://youtu.be/7vnFs4LjnFA" 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="cursor-pointer"
                                        whileHover={{ 
                                          color: ["#ef4444", "#ffff00", "#ef4444"],
                                          transition: { duration: 0.2, repeat: Infinity }
                                        }}
                                      >
                                        Performance musical
                                      </motion.a><br/>
                                      <motion.a 
                                        href="https://youtu.be/8tIy1V8Fvnw" 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="cursor-pointer"
                                        whileHover={{ 
                                          color: ["#ef4444", "#ffff00", "#ef4444"],
                                          transition: { duration: 0.2, repeat: Infinity }
                                        }}
                                      >
                                        Entrevista real
                                      </motion.a>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-4 mb-4">
                                    <img src="/images/brbr1.jpg" alt="Bárbara" className="h-16 w-auto opacity-90 object-contain" />
                                    <div>
                                      <span className="text-red-500 font-bold block">Bárbara - Anim UE5(1-2MINS)</span>
                                      <motion.a 
                                        href="https://youtu.be/W-_fscZRhjc" 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="cursor-pointer"
                                        whileHover={{ 
                                          color: ["#ef4444", "#ffff00", "#ef4444"],
                                          transition: { duration: 0.2, repeat: Infinity }
                                        }}
                                      >
                                        Performance musical
                                      </motion.a><br/>
                                      <motion.a 
                                        href="https://youtu.be/bfmMWLYdPWU" 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="cursor-pointer"
                                        whileHover={{ 
                                          color: ["#ef4444", "#ffff00", "#ef4444"],
                                          transition: { duration: 0.2, repeat: Infinity }
                                        }}
                                      >
                                        Entrevista real
                                      </motion.a>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-4 mb-4 relative">
                                    <img src="/images/seba2.jpg" alt="Sebastián" className="h-16 w-auto opacity-90 object-contain" />
                                    <div>
                                      <span className="text-red-500 font-bold block">Seba - Anim UE5(1-2MINS)</span>
                                      <motion.a 
                                        href="https://youtu.be/qqHvMtDV-Iw" 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="cursor-pointer"
                                        whileHover={{ 
                                          color: ["#ef4444", "#ffff00", "#ef4444"],
                                          transition: { duration: 0.2, repeat: Infinity }
                                        }}
                                      >
                                        Performance musical
                                      </motion.a><br/>
                                      <motion.a 
                                        href="https://youtu.be/Jlwt9ipYPoY" 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="cursor-pointer"
                                        whileHover={{ 
                                          color: ["#ef4444", "#ffff00", "#ef4444"],
                                          transition: { duration: 0.2, repeat: Infinity }
                                        }}
                                      >
                                        Entrevista real
                                      </motion.a>
                                    </div>
                                  </div>

                                  <div className={`w-full flex justify-center -mt-5 md:hidden ${styles.orangePulse}`}>
                                    <ScrambleElement delay={600} repeatInterval={4000} size="1.25rem" className="font-lincolnmitre text-2xl">
                                      <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        strokeWidth={2} 
                                        stroke="currentColor" 
                                        className="w-5 h-5 rotate-180"
                                      >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeDasharray="0 4" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                                      </svg>
                                    </ScrambleElement>
                                  </div>
                                </div>
                                ) : (
                                  <MacImageSlideshow />
                                )
                              )}
                        </div>
                      </div>
                    )
                  ) : (mode === 'backstage') ? (
                    <div className="w-full h-full"></div>
                  ) : (
                    isPortrait && !canShowBothPortrait ? (
                      <div className="relative w-full h-full overflow-hidden">
                        <motion.div
                          className="flex"
                          animate={{ x: `${-pageIndex * 33.3333}%` }}
                          transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                          style={{ width: '300%' }}
                        >
                          <div style={{ width: '33.3333%', padding: '0 1rem' }}>
                            <p
                              ref={leftParaRef}
                              className="font-lincolnmitre text-red-400/90 text-justify"
                              style={{ hyphens: 'auto', overflowWrap: 'anywhere', wordBreak: 'break-word', fontSize: `${fontLeft}px`, lineHeight: 1.25 }}
                            >
                              <img src="/images/GAME2.jpg" alt="Game" className="float-left mr-4 mb-2 max-w-[50%] h-auto" />
                              Cuando el estallido social y una pandemia global paralizan la realidad, la única salida es hacia adentro. RANDOM 2.0 te invita a saltar el torniquete de una estación de metro laberíntica para adentrarte en una ensoñación digital compuesta por fragmentos de memoria colectiva. Tienes exactamente 2019 segundos antes de que el tiempo se agote, desafiándote a explorar un limbo interactivo donde las reglas de la física y la lógica social se han roto.
                            </p>
                          </div>
                          <div style={{ width: '33.3333%', padding: '0 1rem' }}>
                            <p
                              ref={rightParaRef}
                              className="font-lincolnmitre text-red-400/90 text-justify"
                              style={{ hyphens: 'auto', overflowWrap: 'anywhere', wordBreak: 'break-word', fontSize: `${fontRight}px`, lineHeight: 1.25 }}
                            >
                              Presentado como una "tecnología de duelo" y archivo vivo, el juego entrelaza testimonios reales con entornos oníricos desarrollados en Unreal Engine. A medida que los jugadores descienden por pasillos infinitos, se encontrarán con los sueños de tres protagonistas —Katherine, Camila y Eduardo— cuyos relatos de miedo, encierro y resistencia han cobrado vida digital. Una figura siniestra y un cuervo vigía acechan en la oscuridad, recordando que incluso en el mundo virtual, la libertad siempre está vigilada.
                            </p>
                          </div>
                          <div style={{ width: '33.3333%', padding: '0 1rem' }}>
                            <p
                              ref={thirdParaRef}
                              className="font-lincolnmitre text-red-400/90 text-justify"
                              style={{ hyphens: 'auto', overflowWrap: 'anywhere', wordBreak: 'break-word', fontSize: `${fontThird}px`, lineHeight: 1.25 }}
                            >
                              Con la esencia de un thriller psicológico y la estética del glitch, la atmósfera inmersiva de RANDOM 2.0 ofrece una experiencia sensorial única. Aquí no se trata de ganar, sino de habitar el error y resistir al olvido. Solo aquellos dispuestos a perderse en sus derivas arquitectónicas y sonoras podrán reconstruir el sentido de una historia compartida que el tiempo intenta enterrar.
                              <span className="block w-full mt-2 text-center">
                                 <img src="/images/30.png" alt="" className="inline-block h-16 mr-2 opacity-90" />
                                 <img src="/images/30_2.png" alt="" className="inline-block h-16 ml-2 opacity-90" />
                              </span>
                            </p>
                          </div>
                        </motion.div>
                      </div>
                    ) : (
                      <div className="grid" style={{ gap: '2rem', gridTemplateColumns: '1fr 1fr' }}>
                        <p
                          ref={leftParaRef}
                          className="font-lincolnmitre text-red-400/90 text-justify"
                          style={{ hyphens: 'auto', overflowWrap: 'anywhere', wordBreak: 'break-word', fontSize: `${fontLeft}px`, lineHeight: 1.25 }}
                        >
                          <img src="/images/GAME2.jpg" alt="Game" className="float-left mr-4 mb-2 max-w-[50%] h-auto" />
                          Cuando el estallido social y una pandemia global paralizan la realidad, la única salida es hacia adentro. RANDOM 2.0 te invita a saltar el torniquete de una estación de metro laberíntica para adentrarte en una ensoñación digital compuesta por fragmentos de memoria colectiva. Tienes exactamente 2019 segundos antes de que el tiempo se agote, desafiándote a explorar un limbo interactivo donde las reglas de la física y la lógica social se han roto.
                        </p>
                        <div className="flex flex-col gap-2">
                          <p ref={rightParaRef} className="font-lincolnmitre text-red-400/90 text-justify" style={{ hyphens: 'auto', overflowWrap: 'anywhere', wordBreak: 'break-word', fontSize: `${fontRight}px`, lineHeight: 1.25 }}>
                            Presentado como una "tecnología de duelo" y archivo vivo, el proyecto despliega una interfaz que simula un sistema operativo en decadencia, donde el usuario navega entre fragmentos de memoria y registros de un futuro cancelado.
                          </p>
                          <p ref={thirdParaRef} className="font-lincolnmitre text-red-400/90 text-justify" style={{ hyphens: 'auto', overflowWrap: 'anywhere', wordBreak: 'break-word', fontSize: `${fontThird}px`, lineHeight: 1.25 }}>
                            Con la esencia de un thriller psicológico y la estética del glitch, invita a reconstruir una narrativa fragmentada que cuestiona la estabilidad de la memoria colectiva y la fragilidad de nuestras estructuras sociales.
                            <span className="block w-full mt-2 text-center">
                               <img src="/images/30.png" alt="" className="inline-block h-16 mr-2 opacity-90" />
                               <img src="/images/30_2.png" alt="" className="inline-block h-16 ml-2 opacity-90" />
                            </span>
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
            {isPortrait && !canShowBothPortrait && mode !== 'catalogo' && mode !== 'random' && mode !== 'random2' && mode !== 'backstage' && mode !== 'promo' && (
              <div className="w-full flex justify-center items-center gap-2 py-2">
                <span className={`${pageIndex === 0 ? 'bg-red-600' : 'bg-red-600/40'} block w-2 h-2 rounded-full`}></span>
                <span className={`${pageIndex === 1 ? 'bg-red-600' : 'bg-red-600/40'} block w-2 h-2 rounded-full`}></span>
                {mode !== 'qr' && (
                  <span className={`${pageIndex === 2 ? 'bg-red-600' : 'bg-red-600/40'} block w-2 h-2 rounded-full`}></span>
                )}
              </div>
            )}
            {isPortrait && !canShowBothPortrait && (mode === 'random' || mode === 'random2' || mode === 'promo') && (
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
