import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../hooks/useLanguage';
import { t } from '../utils/translations';
import GradientText from './GradientText';

const HeroSection: React.FC = () => {
  const { language } = useLanguage();
  const sectionRef = useRef<HTMLElement | null>(null);

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

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const container = section.querySelector('.scramble-container') as HTMLElement | null;
    const p = container?.querySelector('.scramble-paragraph') as HTMLElement | null;
    if (!container || !p) return;

    if (p.getAttribute('data-scramble-init') === 'true') return;
    p.setAttribute('data-scramble-init', 'true');

    const originalText = p.textContent || '';
    p.textContent = '';

    const chars: HTMLSpanElement[] = [];
    for (let i = 0; i < originalText.length; i++) {
      const ch = originalText[i];
      const span = document.createElement('span');
      span.className = 'char';
      span.textContent = ch;
      (span as any).orig = ch;
      p.appendChild(span);
      chars.push(span);
    }

    const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const getRandomLetter = () => letters[Math.floor(Math.random() * letters.length)];

    let textRevealRadius = window.innerWidth * 0.17;
    let pageX = 0;
    let pageY = 0;
    let scrollY = window.pageYOffset;
    let scrollX = window.pageXOffset;

    let charData: { el: HTMLSpanElement; pageY: number; pageX: number; isVisible: boolean }[] = [];

    const updateCharData = () => {
      charData = chars.map((el) => {
        const b = el.getBoundingClientRect();
        return {
          el,
          pageY: b.top + window.pageYOffset + b.height / 2,
          pageX: b.left + window.pageXOffset + b.width / 2,
          isVisible: false,
        };
      });
    };

    const handleResize = () => {
      textRevealRadius = window.innerWidth * 0.17;
      updateCharData();
      updateText({ pageX, pageY } as MouseEvent);
    };

    const updateText = (e: MouseEvent | Event) => {
      if ('pageY' in e) {
        pageX = (e as MouseEvent).pageX;
        pageY = (e as MouseEvent).pageY;
      } else {
        const scrollYDif = window.pageYOffset - scrollY;
        const scrollXDif = window.pageXOffset - scrollX;
        scrollY += scrollYDif;
        scrollX += scrollXDif;
        pageY += scrollYDif;
        pageX += scrollXDif;
      }

      charData.forEach((data) => {
        const dx = pageX - data.pageX;
        const dy = pageY - data.pageY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const isVisible = dist < textRevealRadius;
        if (isVisible !== data.isVisible || !isVisible) {
          data.isVisible = isVisible;
          data.el.textContent = isVisible ? (data.el as any).orig : getRandomLetter();
        }
      });
    };

    const ready = (document as any).fonts?.ready || Promise.resolve();
    Promise.resolve(ready).then(() => {
      updateCharData();
      window.addEventListener('resize', handleResize);
      window.addEventListener('pointermove', updateText as any);
      window.addEventListener('scroll', updateText as any, { passive: true });
      updateText({ pageX: 0, pageY: 0 } as MouseEvent);
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', updateText as any);
      window.removeEventListener('scroll', updateText as any);
    };
  }, []);

  return (
    <section id="home" ref={sectionRef} className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 1 }}
          className="space-y-8"
        >
          {/* Hero Text */}
          <div className="relative">
            <motion.h1 
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-6xl md:text-8xl font-bold font-dirtyline uppercase tracking-wider text-center -mb-2"
              style={{ fontVariant: 'small-caps' }}
            >
              <GradientText 
                colors={["#D95B00", "#AE2400", "#8C1B00", "#AE2400", "#D95B00"]} 
                animationSpeed={10} 
              >
                {t(language, 'hero.title')}
              </GradientText>
            </motion.h1>
          </div>

          <div className="scramble-container">
          <motion.p 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="scramble-paragraph text-xs md:text-sm font-lincolnmitre text-red-600 dark:text-white max-w-lg mx-auto leading-tight -mt-4"
            style={{ 
              letterSpacing: '-0.5px'
            }}
          >
            {t(language, 'hero.subtitle')}
          </motion.p>
          </div>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-row justify-center items-center mt-12 gap-1"
          >
            <motion.button
              onClick={() => scrollToSection('#portfolio')}
              className="w-16 h-8 px-1 py-1 bg-black/50 text-red-500 border border-red-600 hover:bg-red-600 hover:text-black transition-all duration-300 font-lincolnmitre text-[10px] uppercase tracking-wide leading-none"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Navigate to Portfolio section"
            >
              {t(language, 'hero.work')}
            </motion.button>
            
            <motion.button
              onClick={() => scrollToSection('#about')}
              className="w-16 h-8 px-1 py-1 bg-black/50 text-red-500 border border-red-600 hover:bg-red-600 hover:text-black transition-all duration-300 font-lincolnmitre text-[10px] uppercase tracking-wide leading-none"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Navigate to About section"
            >
              {t(language, 'hero.crew')}
            </motion.button>
            
            <motion.button
              onClick={() => scrollToSection('#services')}
              className="w-20 h-8 px-1 py-1 bg-black/50 text-red-500 border border-red-600 hover:bg-red-600 hover:text-black transition-all duration-300 font-lincolnmitre text-[10px] uppercase tracking-wide leading-none"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Navigate to Services section"
            >
              {t(language, 'hero.downloads')}
            </motion.button>
            
            <motion.button
              onClick={() => scrollToSection('#contact')}
              className="w-16 h-8 px-1 py-1 bg-black/50 text-red-500 border border-red-600 hover:bg-red-600 hover:text-black transition-all duration-300 font-lincolnmitre text-[10px] uppercase tracking-wide leading-none"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Navigate to Contact section"
            >
              {t(language, 'hero.contact')}
            </motion.button>
          </motion.div>

          {/* CTA Link */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-8"
          >
            <motion.button
              onClick={() => scrollToSection('#contact')}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 text-sm rounded-lg transition-all duration-300 transform hover:scale-105 animate-pulse-glow-red font-lincolnmitre uppercase tracking-wide"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Get in touch"
            >
              {t(language, 'hero.getInTouch')}
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
