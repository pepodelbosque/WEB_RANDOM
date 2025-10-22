import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Brain, Heart, Lightbulb, Target } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { t } from '../../utils/translations';

const AboutSection: React.FC = () => {
  const { language } = useLanguage();
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });
  
  const sectionRef = useRef<HTMLElement>(null);
  const wasInViewRef = useRef(false);

  // Tiny gallery images and duplicated track for seamless loop
  const tinyGalleryImages = [
    '/images/tuto01a.jpeg',
    '/images/tuto02.jpg',
    '/images/tuto04.jpeg',
    '/images/tuto1.png',
    '/images/logo-rndm.png',
    '/images/logo-fntsm.png',
  ];
  const duplicatedTinyImages = [...tinyGalleryImages, ...tinyGalleryImages];

  const handleRef = (el: HTMLElement | null) => {
    ref(el);
    if (el) {
      (sectionRef as React.MutableRefObject<HTMLElement | null>).current = el;
    }
  };

  // Detect scroll up from AboutSection
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            wasInViewRef.current = true;
          } else if (wasInViewRef.current) {
            // Section was in view but now isn't - check scroll direction
            const rect = section.getBoundingClientRect();
            if (rect.top > window.innerHeight * 0.5) {
              // Section is below viewport center - user scrolled up
              const event = new CustomEvent('scrollUpFromAbout');
              window.dispatchEvent(event);
              wasInViewRef.current = false;
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '-10% 0px -10% 0px'
      }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section id="about" ref={handleRef} className="min-h-screen py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-1 gap-16 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1 }}
            className="space-y-8"
          >
            <motion.h2 
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-5xl font-bold font-lincolnmitre text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary max-w-2xl mx-auto"
            >
              {t(language, 'about.title')}
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="space-y-6 text-base md:text-lg font-lincolnmitre text-red-600 dark:text-white max-w-2xl mx-auto leading-normal"
            >
              <p>
                {t(language, 'about.description1')}
              </p>
              
              <p>
                {t(language, 'about.description2')}
              </p>

              <p>
                {t(language, 'about.description3')}
              </p>
            </motion.div>

            {/* Replace tiny horizontal gallery with spacer */}
            <div className="w-full sm:w-1/2 mx-auto h-16" aria-hidden="true" />
          </motion.div>

          {/* Visual Element was here */}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;