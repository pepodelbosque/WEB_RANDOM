import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLenis } from './hooks/useLenis';
import { useLanguage } from './hooks/useLanguage';
import { t } from './utils/translations';
import LoadingPage from './components/LoadingPage';
import Navigation from './components/Navigation';
import HeroSection from './components/sections/HeroSection';
import PoemsSection from './components/sections/PoemsSection';
import AboutSection from './components/sections/AboutSection';
import PortfolioSection from './components/sections/PortfolioSection';
import ServicesSection from './components/sections/ServicesSection';
import FantasmaSection from './components/sections/FantasmaSection';
import ExperienceSection from './components/sections/ExperienceSection';
import ContactSection from './components/sections/ContactSection';
import DarkVeil from './components/DarkVeil';
// Removed: import TextTrail from './components/TextTrail';

function App() {
  const [isLoading, setIsLoading] = useState(true);
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
  };

  if (isLoading) {
    return <LoadingPage onLoadingComplete={handleLoadingComplete} />;
  }

  return (
    <div className="min-h-screen text-orange-900 dark:text-gray-900 font-avenuex relative">
      {/* Reactive Parallax DarkVeil Background */}
      <div className="fixed inset-0 z-0">
        <DarkVeil 
          speed={1.2}
          hueShift={hueShift}
          noiseIntensity={0.12}
          scanlineFrequency={0.1}
          scanlineIntensity={0.05}
          warpAmount={1.4}
          resolutionScale={1}
        />
      </div>
      
      {/* Navigation */}
      <Navigation />
      
      {/* Main Content without Fade-In */}
      <main className="relative z-10">
        <HeroSection />
        <PoemsSection />
        <AboutSection />
        <PortfolioSection />
        <ServicesSection />
        <FantasmaSection />
        <ExperienceSection />
        <ContactSection />
      </main>
      
      {/* Footer */}
      <footer className="relative z-10 bg-black/90 backdrop-blur-lg text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-avenuex text-sm opacity-80">
            {t(language, 'footer.copyright')}
          </p>
          {/* Hue Shift Control */}
          <div className="mt-4">
            <label htmlFor="hueShift" className="text-sm mr-2">Hue Shift: {hueShift}</label>
            <input
              id="hueShift"
              type="range"
              min="0"
              max="360"
              value={hueShift}
              onChange={(e) => setHueShift(Number(e.target.value))}
              className="w-48"
            />
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

// Removed: <TextTrail text="Hello World" />
