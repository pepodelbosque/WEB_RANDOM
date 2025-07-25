<motion.a
                  href="#contact"
                  onClick={(e) => scrollToSection(e, 'contact')}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 text-sm rounded-lg transition-all duration-300 transform hover:scale-105 animate-pulse-glow-red w-24"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t('hero.getInTouch')}
                </motion.a>