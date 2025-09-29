import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../hooks/useLanguage';
import { t } from '../../utils/translations';
import GradientText from '../GradientText';

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
            className="text-xs md:text-sm font-lincolnmitre text-red-600 dark:text-white max-w-lg mx-auto leading-tight -mt-4 hover:text-red-400 dark:hover:text-gray-200 transition-colors duration-300 cursor-pointer"
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
              whileHover={{ scale: 1.05, rotateZ: 2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection('#about')}
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