import React from 'react';
import { gsap } from 'gsap';
import { Moon, Sun, Menu, X, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../hooks/useLanguage';
import { t } from '../utils/translations';

const Navigation: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { language, setLanguageDirectly } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = React.useState(false);
  const [shouldShowNav, setShouldShowNav] = React.useState(false);
  
  // Track different sections with mobile-optimized thresholds
  const [heroRef, heroInView] = useInView({
    threshold: window.innerWidth < 768 ? 0.2 : 0.3, // Lower threshold for mobile
    rootMargin: window.innerWidth < 768 ? '-10% 0px -10% 0px' : '-20% 0px -20% 0px'
  });
  
  const [poemsRef, poemsInView] = useInView({
    threshold: window.innerWidth < 768 ? 0.2 : 0.3,
    rootMargin: window.innerWidth < 768 ? '-10% 0px -10% 0px' : '-20% 0px -20% 0px'
  });
  
  const [aboutRef, aboutInView] = useInView({
    threshold: window.innerWidth < 768 ? 0.3 : 0.4,
    rootMargin: window.innerWidth < 768 ? '-20% 0px -20% 0px' : '-30% 0px -30% 0px'
  });

  // Update navigation visibility based on section visibility
  React.useEffect(() => {
    // Show navigation only when AboutSection is centered
    // Hide for HeroSection and PoemsSection
    if (aboutInView && !heroInView && !poemsInView) {
      setShouldShowNav(true);
    } else if (heroInView || poemsInView) {
      setShouldShowNav(false);
    } else {
    // For other sections (portfolio, services, fantasma, contact), show nav
      setShouldShowNav(!heroInView && !poemsInView);
    }
  }, [heroInView, poemsInView, aboutInView]);

  const navItems = [
    { href: '#about', label: t(language, 'nav.about') },
    { href: '#portfolio', label: t(language, 'nav.portfolio') },
    { href: '#services', label: t(language, 'nav.services') },
    { href: '#fantasma', label: t(language, 'nav.fantasma') },
    { href: '#contact', label: t(language, 'nav.contact') },
  ];

  const linkRefs = React.useRef<(HTMLAnchorElement | null)[]>([]);
  const cleanupRefs = React.useRef<(() => void)[]>([]);

  React.useEffect(() => {
    cleanupRefs.current.forEach((fn) => fn());
    cleanupRefs.current = [];

    const scrambleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*+?';

    linkRefs.current.forEach((el, i) => {
      if (!el) return;
      const finalText = navItems[i]?.label ?? el.textContent ?? '';

      const indices = Array.from(finalText)
        .map((c, idx) => (/^\s$/.test(c) ? -1 : idx))
        .filter((idx) => idx >= 0);
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
          .map((c, idx) => {
            if (/^\s$/.test(c)) return c;
            const rank = rankMap.get(idx) ?? 0;
            return rank < threshold ? c : scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
          })
          .join('');
        el.textContent = out;
      };

      setScrambledProgress(0);
      const state = { p: 0 };
      const baseDelay = 0.5 * i;
      const tl = gsap.timeline({ paused: false, repeat: -1, yoyo: true, repeatDelay: 1.6 + 0.2 * i });
      tl.to(state, {
        p: 1,
        duration: 1.1,
        ease: 'power2.inOut',
        onUpdate: () => setScrambledProgress(state.p),
        delay: baseDelay,
      })
        // Hold 2s at fully revealed for readability
        .to(state, {
          p: 1,
          duration: 3,
          ease: 'none',
          onUpdate: () => setScrambledProgress(state.p),
        });

      const startReveal = () => {
        if (tl.isActive() || state.p >= 1) return;
        tl.play(0);
      };
      el.addEventListener('click', startReveal as any, { passive: true } as any);

      cleanupRefs.current.push(() => {
        el.removeEventListener('click', startReveal as any);
        tl.kill();
      });
    });

    return () => {
      cleanupRefs.current.forEach((fn) => fn());
      cleanupRefs.current = [];
    };
  }, [language, isMenuOpen, shouldShowNav]);

  const scrollToSection = (href: string) => {
    // Close menu first
    setIsMenuOpen(false);
    setIsLanguageMenuOpen(false);
    
    // Small delay to allow menu to close
    setTimeout(() => {
      (window as any).__accessMode = 'nav';
      (window as any).__navClickAt = Date.now();
      const element = document.querySelector(href);
      if (element) {
        const lenis = (window as any).lenis;
        if (lenis && typeof lenis.scrollTo === 'function') {
          const header = document.querySelector('nav');
          const headerH = header ? Math.round(header.getBoundingClientRect().height) : 64;
          const dynamicOffset = href === '#contact' ? -Math.round(window.innerHeight * 0.2) : href === '#portfolio' ? headerH + 90 : 0;
          lenis.scrollTo(element, {
            offset: dynamicOffset,
            duration: 1.1,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
        } else {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }, 100);
  };

  const handleLanguageChange = (lang: 'en' | 'es') => {
    // Save language preference before refresh
    localStorage.setItem('language', lang);
    setLanguageDirectly(lang);
    setIsLanguageMenuOpen(false);
  };

  return (
    <>
      {/* Hidden ref elements to track sections - mobile optimized positioning */}
      <div ref={heroRef} className="absolute pointer-events-none" style={{ top: '0', height: '100vh', width: '100%' }} />
      <div ref={poemsRef} className="absolute pointer-events-none" style={{ top: window.innerWidth < 768 ? 'calc(100vh + 20px)' : 'calc(100vh + 50px)', height: '100vh', width: '100%' }} />
      <div ref={aboutRef} className="absolute pointer-events-none" style={{ top: window.innerWidth < 768 ? 'calc(200vh + 40px)' : 'calc(200vh + 100px)', height: '100vh', width: '100%' }} />
      
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ 
          y: shouldShowNav || isMenuOpen ? 0 : -100,
          opacity: shouldShowNav || isMenuOpen ? 1 : 0
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-lg border-b border-orange-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12">
            {/* Logo - mobile optimized */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              onClick={() => scrollToSection('#home')}
              className="text-xl md:text-2xl font-bold font-dirtyline text-red-600 uppercase tracking-wider hover:text-orange-500 transition-colors cursor-pointer"
              style={{ fontVariant: 'small-caps' }}
            >
              RANDOM
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    if (item.href === '#about') {
                      (window as any).__accessMode = 'info';
                      window.dispatchEvent(new CustomEvent('openAboutInfoPopup'));
                      return;
                    }
                    scrollToSection(item.href);
                  }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  className="text-sm font-lincolnmitre text-red-600 hover:text-orange-500 transition-colors cursor-pointer"
                  ref={(el) => { linkRefs.current[index] = el; }}
                >
                  {item.label}
                </motion.a>
              ))}
              
              {/* Language Toggle */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                  className="p-2 rounded-none bg-red-600/20 backdrop-blur-sm flex items-center justify-center space-x-1 text-red-600 hover:text-orange-500 hover:bg-orange-500/20 transition-all duration-200 min-w-[36px] min-h-[36px] border border-orange-800"
                >
                  <Globe size={16} className="flex-shrink-0" />
                  <span className="text-xs font-lincolnmitre">{language.toUpperCase()}</span>
                </motion.button>
                
                <AnimatePresence>
                  {isLanguageMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute top-10 right-0 bg-black/80 backdrop-blur-lg rounded-none border border-red-600/30 overflow-hidden z-60 min-w-[90px]"
                    >
                      <button
                        onClick={() => handleLanguageChange('en')}
                        className="block w-full px-3 py-2 text-sm font-lincolnmitre text-left text-red-600 hover:text-orange-500 hover:bg-orange-500/20 transition-colors"
                      >
                        English
                      </button>
                      <button
                        onClick={() => handleLanguageChange('es')}
                        className="block w-full px-3 py-2 text-sm font-lincolnmitre text-left text-red-600 hover:text-orange-500 hover:bg-orange-500/20 transition-colors"
                      >
                        Español
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className="p-2 rounded-none bg-red-600/20 backdrop-blur-sm text-red-600 hover:text-orange-500 hover:bg-orange-500/20 transition-all duration-200 min-w-[36px] min-h-[36px] flex items-center justify-center border border-orange-800"
              >
                {isDark ? <Sun size={16} className="flex-shrink-0" /> : <Moon size={16} className="flex-shrink-0" />}
              </motion.button>
            </div>

            {/* Mobile Menu Toggle - improved spacing */}
            <div className="md:hidden flex items-center space-x-1">
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                  className="p-2 rounded-none bg-red-600/20 backdrop-blur-sm flex items-center justify-center space-x-1 text-red-600 hover:text-orange-500 hover:bg-orange-500/20 transition-all duration-200 min-w-[32px] min-h-[32px] border border-orange-800"
                >
                  <Globe size={12} className="flex-shrink-0" />
                  <span className="text-xs font-lincolnmitre">{language.toUpperCase()}</span>
                </motion.button>
                
                <AnimatePresence>
                  {isLanguageMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute top-9 right-0 bg-black/80 backdrop-blur-lg rounded-none border border-red-600/30 overflow-hidden z-60 min-w-[80px]"
                    >
                      <button 
                        onClick={() => handleLanguageChange('en')} 
                        className="block w-full px-2 py-2 text-xs font-lincolnmitre text-left text-red-600 hover:text-orange-500 hover:bg-orange-500/20 transition-colors"
                      >
                        English
                      </button>
                      <button 
                        onClick={() => handleLanguageChange('es')} 
                        className="block w-full px-2 py-2 text-xs font-lincolnmitre text-left text-red-600 hover:text-orange-500 hover:bg-orange-500/20 transition-colors"
                      >
                        Español
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className="p-2 rounded-none bg-red-600/20 backdrop-blur-sm text-red-600 hover:text-orange-500 hover:bg-orange-500/20 transition-all duration-200 min-w-[32px] min-h-[32px] flex items-center justify-center border border-orange-800"
              >
                {isDark ? <Sun size={12} className="flex-shrink-0" /> : <Moon size={12} className="flex-shrink-0" />}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-none bg-red-600/20 backdrop-blur-sm text-red-600 hover:text-orange-500 hover:bg-orange-500/20 transition-all duration-200 min-w-[32px] min-h-[32px] flex items-center justify-center border border-orange-800"
              >
                {isMenuOpen ? <X size={12} className="flex-shrink-0" /> : <Menu size={12} className="flex-shrink-0" />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu - improved for mobile */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-black/80 backdrop-blur-lg border-t border-red-600/30"
            >
              <div className="px-4 py-4 space-y-3 text-right">
                {navItems.map((item, index) => (
                  <motion.a
                    key={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      if (item.href === '#about') {
                        (window as any).__accessMode = 'info';
                        window.dispatchEvent(new CustomEvent('openAboutInfoPopup'));
                        return;
                      }
                      scrollToSection(item.href);
                    }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="block text-base font-lincolnmitre text-red-600 hover:text-orange-500 transition-colors cursor-pointer text-right py-2"
                    ref={(el) => { linkRefs.current[index] = el; }}
                  >
                    {item.label}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};

export default Navigation;
