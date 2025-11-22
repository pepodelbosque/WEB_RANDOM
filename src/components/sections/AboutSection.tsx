import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Brain, Heart, Lightbulb, Target } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { t } from '../../utils/translations';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const AboutSection: React.FC = () => {
  const { language } = useLanguage();
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });
  
  const sectionRef = useRef<HTMLElement>(null);
  const wasInViewRef = useRef(false);
  const lineContainerRef = useRef<HTMLDivElement>(null);
  const leftLineRef = useRef<HTMLDivElement>(null);
  const rightLineRef = useRef<HTMLDivElement>(null);
  const topAccentLeftRef = useRef<HTMLDivElement>(null);
  const topAccentRightRef = useRef<HTMLDivElement>(null);
  const bottomAccentLeftRef = useRef<HTMLDivElement>(null);
  const bottomAccentRightRef = useRef<HTMLDivElement>(null);

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
    gsap.registerPlugin(ScrollTrigger);

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

  // GSAP split-line animation tied to scroll
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Espera a que las fuentes estén listas para obtener saltos de línea reales
    const ready = (document as any).fonts?.ready || Promise.resolve();

    Promise.resolve(ready).then(() => {
      const containers = gsap.utils.toArray<HTMLElement>(
        section.querySelectorAll('.split-container')
      );

      containers.forEach((container) => {
        const text = container.querySelector('.split') as HTMLElement | null;
        if (!text) return;

        // Evitar dividir dos veces
        if (text.getAttribute('data-split-initialized') === 'true') return;
        text.setAttribute('data-split-initialized', 'true');

        // Convertir el contenido en spans por palabra
        const original = text.textContent || '';
        const words = original.split(/(\s+)/); // mantiene los espacios como tokens
        text.textContent = '';
        words.forEach((token) => {
          const span = document.createElement('span');
          span.className = 'split-word';
          span.textContent = token;
          text.appendChild(span);
        });

        const wordSpans = Array.from(text.querySelectorAll('.split-word')) as HTMLSpanElement[];
        // Agrupar por líneas según offsetTop
        const lines: HTMLSpanElement[][] = [];
        let currentLineTop: number | null = null;
        let currentLine: HTMLSpanElement[] = [];

        wordSpans.forEach((w) => {
          const top = w.offsetTop;
          if (currentLineTop === null) {
            currentLineTop = top;
          }
          if (Math.abs(top - currentLineTop) <= 2) {
            currentLine.push(w);
          } else {
            lines.push(currentLine);
            currentLine = [w];
            currentLineTop = top;
          }
        });
        if (currentLine.length) lines.push(currentLine);

        // Envolver cada línea en un contenedor bloque con overflow oculto
        const lineWrappers: HTMLElement[] = [];
        lines.forEach((lineWords) => {
          const wrapper = document.createElement('span');
          wrapper.className = 'split-line';
          wrapper.style.display = 'block';
          wrapper.style.overflow = 'hidden';
          // Insertar wrapper antes del primer elemento de la línea y mover palabras dentro
          text.insertBefore(wrapper, lineWords[0]);
          lineWords.forEach((word) => wrapper.appendChild(word));
          lineWrappers.push(wrapper);
        });

        // Animación por líneas con ScrollTrigger (sin markers)
        gsap.from(lineWrappers, {
          yPercent: 120,
          stagger: 0.1,
          ease: 'sine.out',
          scrollTrigger: {
            trigger: container,
            start: 'clamp(top center)',
            end: 'clamp(bottom center)',
            scrub: true,
            markers: false,
          },
        });
      });
    });

    return () => {
      // Eliminar cualquier ScrollTrigger creado por estas animaciones
      ScrollTrigger.getAll().forEach((st) => st.kill());
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
              <div className="split-container">
                <p className="split">
                 {t(language, 'about.description1')}
                </p>
              </div>

              <div className="split-container">
                <p className="split">
                {t(language, 'about.description2')}
                </p>
              </div>

              <div className="split-container">
                <p className="split">
                {t(language, 'about.description3')}
                </p>
              </div>
            </motion.div>

            {/* Operational line removida para evitar marcas visibles */}
          </motion.div>

          {/* Visual Element was here */}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;