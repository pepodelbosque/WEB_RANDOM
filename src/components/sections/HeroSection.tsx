import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../hooks/useLanguage';
import { t } from '../../utils/translations';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const HeroSection: React.FC = () => {
  const { language } = useLanguage();
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const tickRef = useRef<number | null>(null);

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      const lenis = (window as any).lenis;
      if (lenis && typeof lenis.scrollTo === 'function') {
        const header = document.querySelector('nav');
        const headerH = header ? Math.round(header.getBoundingClientRect().height) : 64;
        const dynamicOffset = sectionId === '#contact' ? -Math.round(window.innerHeight * 0.2) : sectionId === '#portfolio' ? headerH + Math.round(window.innerHeight * 0.19) : 0;
        lenis.scrollTo(element, {
          offset: dynamicOffset,
          duration: 1.1,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      } else {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Scramble reveal para el subtítulo del Hero: se mantiene secreto hasta interacción (click/touch)
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const el = subtitleRef.current;
    if (!el) return;

    const finalText = t(language, 'hero.subtitle') as string;

    const scrambleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*+?';
    const indices = Array.from(finalText)
      .map((c, i) => (/^\s$/.test(c) ? -1 : i))
      .filter((i) => i >= 0);
    const phi = 0.6180339887498948;
    const weights = indices.map((idx) => ({ idx, w: ((idx * phi) % 1) + Math.random() * 0.02 }));
    weights.sort((a, b) => a.w - b.w);
    const revealOrder = weights.map((w) => w.idx);
    const rankMap = new Map<number, number>();
    revealOrder.forEach((idx, rank) => rankMap.set(idx, rank));

    const setScrambledProgress = (p: number) => {
      const threshold = p * revealOrder.length;
      const out = finalText
        .split('')
        .map((c, i) => {
          if (/^\s$/.test(c)) return c;
          const rank = rankMap.get(i) ?? 0;
          return rank < threshold ? c : scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
        })
        .join('');
      el.textContent = out;
    };

    // Estado inicial: completamente scrambled
    setScrambledProgress(0);

    const revealState = { p: 0 };
    const revealTL = gsap.timeline({ paused: true });
    revealTL.to(revealState, {
      p: 1,
      duration: 2.6,
      ease: 'power3.out',
      onUpdate: () => setScrambledProgress(revealState.p),
    });

    const stopScrambleTick = () => {
      if (tickRef.current !== null) {
        clearInterval(tickRef.current);
        tickRef.current = null;
      }
    };

    const startScrambleTick = () => {
      stopScrambleTick();
      tickRef.current = window.setInterval(() => {
        // Solo refrescar el scramble si aún no se ha revelado
        if (!revealTL.isActive() && revealState.p === 0) {
          setScrambledProgress(0);
        }
      }, 5000);
    };

    // Comenzar el refresco cada 3 segundos en pre-scramble
    startScrambleTick();

    const startReveal = () => {
      if (revealTL.isActive() || revealState.p >= 1) return;
      // Detener el refresco periódico cuando se inicia la revelación
      stopScrambleTick();
      revealTL.play(0);
      el.removeEventListener('dblclick', startReveal);
    };
    // Solo accionar con doble clic
    el.addEventListener('dblclick', startReveal, { passive: true });

    const resetToPreScramble = () => {
      revealTL.pause(0);
      revealState.p = 0;
      setScrambledProgress(0);
      // Reasegurar listeners para que se pueda revelar nuevamente al re-entrar
      el.removeEventListener('dblclick', startReveal);
      el.addEventListener('dblclick', startReveal, { passive: true });
      // Reanudar el refresco cada 3s al volver al estado pre-scramble
      startScrambleTick();
    };

    // Activar/restablecer pre-scramble cada vez que se entra/sale de la sección
    let st: ScrollTrigger | null = null;
    if (sectionRef.current) {
      st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top center',
        end: 'bottom top',
        onEnter: () => resetToPreScramble(),
        onEnterBack: () => resetToPreScramble(),
        onLeave: () => resetToPreScramble(),
        onLeaveBack: () => resetToPreScramble(),
      });
    }

    return () => {
      el.removeEventListener('dblclick', startReveal);
      revealTL.kill();
      if (st) st.kill();
      stopScrambleTick();
    };
  }, [language]);

  return (
    <section ref={sectionRef} id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden mb-24 md:mb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="space-y-8"
        >
          {/* Hero Text */}
          <div className="relative">
            <motion.h1 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-6xl md:text-8xl font-bold font-dirtyline uppercase tracking-wider text-center -mb-2 flex justify-center items-center"
              style={{ fontVariant: 'small-caps' }}
            >
              <img 
                src="/images/logo-rndm.png" 
                alt="RANDOM Logo"
                className="h-20 md:h-32 w-auto object-contain"
                style={{
                  filter: 'hue-rotate(15deg) saturate(1.2) brightness(1.1)',
                }}
              />
            </motion.h1>
          </div>

          <motion.p 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-[0.9em] md:text-[0.95em] font-lincolnmitre text-red-600 dark:text-white max-w-lg mx-auto leading-[1.05] -mt-4 hover:text-red-400 dark:hover:text-gray-200 transition-colors duration-300 cursor-pointer"
            style={{ 
              letterSpacing: '-0.5px'
            }}
            ref={subtitleRef}
          >
            {t(language, 'hero.subtitle')}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-row justify-center items-center mt-12 gap-1"
          >
            <motion.button
              whileHover={{ scale: 1.05, rotateZ: 2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                scrollToSection('#about');
                setTimeout(() => {
                  (window as any).__accessMode = 'info';
                  window.dispatchEvent(new CustomEvent('openAboutInfoPopup'));
                }, 300);
              }}
              className="w-16 h-8 px-2 py-1 bg-black/50 border border-red-600 text-red-500 font-lincolnmitre hover:bg-orange-900 hover:text-orange-400 transition-all duration-300 text-[10px] leading-none uppercase tracking-wide"
              aria-label="Navigate to About section"
            >
              {t(language, 'nav.about')}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05, rotateZ: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection('#portfolio')}
              className="w-16 h-8 px-2 py-1 bg-black/50 border border-red-600 text-red-500 font-lincolnmitre hover:bg-orange-900 hover:text-orange-400 transition-all duration-300 text-[10px] leading-none uppercase tracking-wide"
              aria-label="Navigate to Portfolio section"
            >
              {t(language, 'nav.portfolio')}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05, rotateZ: 2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection('#services')}
              className="w-20 h-8 px-2 py-1 bg-black/50 border border-red-600 text-red-500 font-lincolnmitre hover:bg-orange-900 hover:text-orange-400 transition-all duration-300 text-[10px] leading-none uppercase tracking-wide"
              aria-label="Navigate to Services section"
            >
              {t(language, 'nav.services')}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05, rotateZ: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection('#contact')}
              className="w-16 h-8 px-2 py-1 bg-black/50 border border-red-600 text-red-500 font-lincolnmitre hover:bg-orange-900 hover:text-orange-400 transition-all duration-300 text-[10px] leading-none uppercase tracking-wide"
              aria-label="Navigate to Contact section"
            >
              {t(language, 'nav.contact')}
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
