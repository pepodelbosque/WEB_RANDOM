import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { gsap } from 'gsap';
import { useLenis } from './hooks/useLenis';
import { useLanguage } from './hooks/useLanguage';
import { t } from './utils/translations';
import LoadingPage from './components/LoadingPage';
import Navigation from './components/Navigation';
import HeroSection from './components/sections/HeroSection';
// import PoemsSection from './components/sections/PoemsSection'; - REMOVED
import AboutSection from './components/sections/AboutSection';
import PortfolioSection from './components/sections/PortfolioSection';
import ServicesSection from './components/sections/ServicesSection';
import FantasmaSection from './components/sections/FantasmaSection';
import ContactSection from './components/sections/ContactSection';
import DarkVeil from './components/DarkVeil';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  // showMainContent removed – not needed since we rely on isLoading alone
  useLenis();
  const { language } = useLanguage();
  const [, forceUpdate] = useState({});
  const hueShift = 234;
  const [footerInViewRef, footerInView] = useInView({ threshold: 0.2, triggerOnce: false });
  const footerSectionRef = useRef<HTMLElement | null>(null);
  const setFooterRef = (el: HTMLElement | null) => { footerInViewRef(el); footerSectionRef.current = el; };
  const copyrightRef = useRef<HTMLParagraphElement | null>(null);
  const revealTLRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const handleLanguageChange = () => {
      forceUpdate({});
    };

    window.addEventListener('languagechange', handleLanguageChange);
    return () => window.removeEventListener('languagechange', handleLanguageChange);
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    // Immediate transition to prevent gap
    // setShowMainContent(true); // removed – state no longer exists
  };

  useEffect(() => {
    const el = copyrightRef.current;
    if (!el) return;
    const finalText = t(language, 'footer.copyright');
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
    setScrambledProgress(0);
    const revealState = { p: 0 };
    const tl = gsap.timeline({ paused: false, repeat: -1, yoyo: true, repeatDelay: 2 });
    tl.to(revealState, {
      p: 1,
      duration: 1.2,
      ease: 'power2.inOut',
      onUpdate: () => setScrambledProgress(revealState.p),
      delay: 0,
    });
    revealTLRef.current = tl;
    const startReveal = () => {
      if (tl.isActive() || revealState.p >= 1) return;
      tl.play(0);
      el.removeEventListener('click', startReveal);
      el.removeEventListener('touchstart', startReveal);
    };
    el.addEventListener('click', startReveal, { passive: true } as any);
    el.addEventListener('touchstart', startReveal, { passive: true } as any);
    return () => {
      el.removeEventListener('click', startReveal);
      el.removeEventListener('touchstart', startReveal);
      tl.kill();
      revealTLRef.current = null;
    };
  }, [language]);

  useEffect(() => {
    const tl: gsap.core.Timeline | null = revealTLRef.current as any;
    if (!tl) return;
    if (!tl.isActive()) tl.play(0);
  }, [footerInView]);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingPage key="loading" onLoadingComplete={handleLoadingComplete} />
        ) : (
          <motion.div
            key="main-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="min-h-screen bg-black text-orange-900 dark:text-gray-900 font-avenuex relative overflow-x-hidden"
          >
            {/* Reactive Parallax DarkVeil Background */}
            <motion.div 
              className="fixed inset-0 z-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <DarkVeil 
                speed={1.2}
                hueShift={hueShift}
                noiseIntensity={0.12}
                scanlineFrequency={0.1}
                scanlineIntensity={0.05}
                warpAmount={1.4}
                resolutionScale={1}
              />
            </motion.div>
            
            {/* Navigation with smooth entrance */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            >
              <Navigation />
            </motion.div>
            
            {/* Main Content with hero section priority */}
            <motion.main className="relative z-10 overflow-x-hidden">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              >
                <HeroSection />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <AboutSection />
                <PortfolioSection />
                <ServicesSection />
                <FantasmaSection />
                {/* Separador grande entre Fantasma y Contact */}
                <div
                  aria-hidden="true"
                  className="h-[16rem] md:h-[24rem] lg:h-[28rem]"
                />
                <ContactSection />
              </motion.div>
            </motion.main>
            
            {/* Footer */}
            <motion.footer 
              className="relative z-10 bg-black/90 backdrop-blur-lg text-white py-6 safe-area-bottom overflow-x-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              ref={setFooterRef}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2">
                <p className="font-lincolnmitre text-[10px] opacity-80" ref={copyrightRef}>
                  {t(language, 'footer.copyright')}
                </p>
                <p className="font-lincolnmitre text-[8px] opacity-60 leading-tight max-w-4xl mx-auto">
                  {t(language, 'This artwork was created for artistic purposes and does not necessarily reflect objective information nor endorse any specific viewpoint. The content is for creative purposes and should not be interpreted as a representation of reality')}
                </p>
              </div>
            </motion.footer>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;

// Removed: <TextTrail text="Hello World" />
