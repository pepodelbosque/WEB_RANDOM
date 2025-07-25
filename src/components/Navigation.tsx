import React from 'react';
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
  
  // Track when we're in the hero section
  const [heroRef, heroInView] = useInView({
    threshold: 0.1,
    rootMargin: '0px 0px -10% 0px'
  });

  const navItems = [
    { href: '#home', label: t(language, 'nav.home') },
    { href: '#about', label: t(language, 'nav.about') },
    { href: '#portfolio', label: t(language, 'nav.portfolio') },
    { href: '#services', label: t(language, 'nav.services') },
    { href: '#fantasma', label: t(language, 'nav.fantasma') },
    { href: '#experience', label: t(language, 'nav.experience') },
    { href: '#contact', label: t(language, 'nav.contact') },
  ];

  const scrollToSection = (href: string) => {
    // Cerrar el menú primero
    setIsMenuOpen(false);
    
    // Pequeño delay para permitir que el menú se cierre
    setTimeout(() => {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
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
      {/* Hidden ref element to track hero section */}
      <div ref={heroRef} className="absolute top-0 left-0 w-full pointer-events-none" style={{ top: '0', height: '100vh' }} />
      
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ 
          y: heroInView && !isMenuOpen ? -100 : 0,
          opacity: heroInView && !isMenuOpen ? 0 : 1
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/10 dark:bg-black/20 backdrop-blur-lg border-b border-white/20"
      >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            onClick={() => scrollToSection('#home')}
            className="text-2xl font-bold font-dirtyline text-orange-400 dark:text-primary uppercase tracking-wider hover:text-red-600 transition-colors cursor-pointer"
            style={{ fontVariant: 'small-caps' }}
          >
            RANDOM
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.a
                key={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item.href);
                }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                className="text-sm font-avenuex text-orange-400 dark:text-gray-300 hover:text-red-600 dark:hover:text-primary transition-colors cursor-pointer"
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
                className="p-2 rounded-full bg-white/20 dark:bg-black/20 backdrop-blur-sm flex items-center space-x-1 text-orange-400 dark:text-white hover:text-red-600 dark:hover:text-primary transition-colors"
              >
                <Globe size={20} />
                <span className="text-xs font-avenuex">{language.toUpperCase()}</span>
              </motion.button>
              
              <AnimatePresence>
                {isLanguageMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute top-12 right-0 bg-white/20 dark:bg-black/20 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden"
                  >
                    <button
                      onClick={() => handleLanguageChange('en')}
                      className="block w-full px-4 py-2 text-sm font-avenuex text-left text-orange-400 dark:text-white hover:text-red-600 dark:hover:text-primary hover:bg-primary/20 transition-colors"
                    >
                      English
                    </button>
                    <button
                      onClick={() => handleLanguageChange('es')}
                      className="block w-full px-4 py-2 text-sm font-avenuex text-left text-orange-400 dark:text-white hover:text-red-600 dark:hover:text-primary hover:bg-primary/20 transition-colors"
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
              className="p-2 rounded-full bg-white/20 dark:bg-black/20 backdrop-blur-sm text-orange-400 dark:text-white hover:text-red-600 dark:hover:text-primary transition-colors"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center space-x-4">
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                className="p-2 rounded-full bg-white/20 dark:bg-black/20 backdrop-blur-sm flex items-center space-x-1 text-orange-400 dark:text-white hover:text-red-600 dark:hover:text-primary transition-colors"
              >
                <Globe size={16} />
                <span className="text-xs font-avenuex">{language.toUpperCase()}</span>
              </motion.button>
              
              {isLanguageMenuOpen && (
                <div className="absolute top-12 right-0 bg-white/20 dark:bg-black/20 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden z-50">
                  <button onClick={() => handleLanguageChange('en')} className="block w-full px-4 py-2 text-sm font-avenuex text-left text-orange-400 dark:text-white hover:text-red-600 dark:hover:text-primary hover:bg-primary/20 transition-colors">English</button>
                  <button onClick={() => handleLanguageChange('es')} className="block w-full px-4 py-2 text-sm font-avenuex text-left text-orange-400 dark:text-white hover:text-red-600 dark:hover:text-primary hover:bg-primary/20 transition-colors">Español</button>
                </div>
              )}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2 rounded-full bg-white/20 dark:bg-black/20 backdrop-blur-sm text-orange-400 dark:text-white hover:text-red-600 dark:hover:text-primary transition-colors"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-full bg-white/20 dark:bg-black/20 backdrop-blur-sm text-orange-400 dark:text-white hover:text-red-600 dark:hover:text-primary transition-colors"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/10 dark:bg-black/20 backdrop-blur-lg border-t border-white/20"
          >
            <div className="px-4 py-4 space-y-4 text-right">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.href);
                  }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="block text-sm font-avenuex text-orange-400 dark:text-gray-300 hover:text-red-600 dark:hover:text-primary transition-colors cursor-pointer text-right"
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