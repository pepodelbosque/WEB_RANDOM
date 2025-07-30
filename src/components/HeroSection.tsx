import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../hooks/useLanguage';
import { t } from '../utils/translations';
import GradientText from './GradientText';

const HeroSection: React.FC = () => {
  const { language } = useLanguage();

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
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

          <motion.p 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-xs md:text-sm font-lincolnmitre text-red-600 dark:text-white max-w-lg mx-auto leading-tight -mt-4"
            style={{ 
              letterSpacing: '-0.5px'
            }}
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
            animate={{ opacity: 1, y: 0 }}
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