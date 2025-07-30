import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import ExperienceSection from './components/sections/ExperienceSection';
import ContactSection from './components/sections/ContactSection';
import DarkVeil from './components/DarkVeil';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showMainContent, setShowMainContent] = useState(false);
  useLenis();
  const { language } = useLanguage();
  const [, forceUpdate] = useState({});
  const [hueShift, setHueShift] = useState(234);

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
    setShowMainContent(true);
  };

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
                <ExperienceSection />
                <ContactSection />
              </motion.div>
            </motion.main>
            
            {/* Footer */}
            <motion.footer 
              className="relative z-10 bg-black/90 backdrop-blur-lg text-white py-4 overflow-x-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2">
                <p className="font-lincolnmitre text-xs opacity-80">
                  {t(language, 'footer.copyright')}
                </p>
                <p className="font-lincolnmitre text-[10px] opacity-60 leading-tight max-w-4xl mx-auto">
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
