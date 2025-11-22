import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ExternalLink, Github, Eye } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { t } from '../../utils/translations';
import VideogamePopup from './VideogamePopup'; // Import the new component
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const PortfolioSection: React.FC = () => {
  const { language } = useLanguage();
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  const sectionRef = useRef<HTMLElement | null>(null);
  const handleRef = (el: HTMLElement | null) => {
    ref(el);
    sectionRef.current = el;
  };
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [isPopupMinimal, setPopupMinimal] = useState(false);
  const [popupTitle, setPopupTitle] = useState('VIDEOGAME');

  const openPopup = (minimal: boolean = false, title: string = 'VIDEOGAME') => {
    setPopupMinimal(minimal);
    setPopupTitle(title);
    setPopupVisible(true);
  };
  const closePopup = () => setPopupVisible(false);

  const projects = [
    {
      id: 1,
      title: t(language, 'portfolio.projects.organicEcommerce.title'),
      description: t(language, 'portfolio.projects.organicEcommerce.description'),
      image: '/images/cntrolito_pensador_muyBuena2.jpg',
      tech: ['React', 'Node.js', 'MongoDB'],
      gradient: 'from-primary to-secondary',
    },
    {
      id: 2,
      title: t(language, 'portfolio.projects.motionStudio.title'),
      description: t(language, 'portfolio.projects.motionStudio.description'),
      image: '/images/Instalacion_Buena.jpg',
      tech: ['Next.js', 'Framer Motion', 'GSAP'],
      gradient: 'from-secondary to-primary',
    },
    {
      id: 3,
      title: t(language, 'portfolio.projects.forestDashboard.title'),
      description: t(language, 'portfolio.projects.forestDashboard.description'),
      image: '/images/catalogo_1.jpg',
      tech: ['Vue.js', 'D3.js', 'Firebase'],
      gradient: 'from-primary via-secondary to-accent',
    },
    {
      id: 4,
      title: t(language, 'portfolio.projects.naturePortfolio.title'),
      description: t(language, 'portfolio.projects.naturePortfolio.description'),
      image: '/images/videos1b.jpg',
      tech: ['React', 'Three.js', 'GSAP'],
      gradient: 'from-secondary to-accent',
    },
  ];

  const customTitles = [
    'Video Juego - RANDOM',
    'VIDEO INSTALACIÓN RANDOM 2.0',
    'CATÁLOGO RANDOM 2.0',
    'VIDEOS RANDOM',
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    if (!section) return;

    const ready = (document as any).fonts?.ready || Promise.resolve();
    Promise.resolve(ready).then(() => {
      const containers = gsap.utils.toArray<HTMLElement>(
        section.querySelectorAll('.split-container')
      );
      containers.forEach((container) => {
        const text = container.querySelector('.split') as HTMLElement | null;
        if (!text) return;
        if (text.getAttribute('data-split-initialized') === 'true') return;
        text.setAttribute('data-split-initialized', 'true');

        const original = text.textContent || '';
        const tokens = original.split(/(\s+)/);
        text.textContent = '';
        tokens.forEach((tk) => {
          const span = document.createElement('span');
          span.className = 'split-word';
          span.textContent = tk;
          text.appendChild(span);
        });

        const wordSpans = Array.from(text.querySelectorAll('.split-word')) as HTMLSpanElement[];
        const lines: HTMLSpanElement[][] = [];
        let currentTop: number | null = null;
        let line: HTMLSpanElement[] = [];
        wordSpans.forEach((w) => {
          const top = w.offsetTop;
          if (currentTop === null || Math.abs(top - currentTop) <= 2) {
            currentTop = currentTop ?? top;
            line.push(w);
          } else {
            lines.push(line);
            line = [w];
            currentTop = top;
          }
        });
        if (line.length) lines.push(line);

        const wrappers: HTMLElement[] = [];
        lines.forEach((lineWords) => {
          const wrapper = document.createElement('span');
          wrapper.className = 'split-line';
          wrapper.style.display = 'block';
          wrapper.style.overflow = 'hidden';
          text.insertBefore(wrapper, lineWords[0]);
          lineWords.forEach((w) => wrapper.appendChild(w));
          wrappers.push(wrapper);
        });

        gsap.from(wrappers, {
          yPercent: 120,
          stagger: 0.12,
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
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <section id="portfolio" ref={handleRef} className="min-h-[50vh] py-6 relative">
      <div className="max-w-3xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="text-left mb-10"
        >
          <h2 className="text-4xl font-bold font-lincolnmitre text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-4 max-w-2xl">
            {t(language, 'portfolio.title')}
          </h2>
          <div className="split-container">
            <p className="split text-base md:text-lg font-lincolnmitre text-orange-600 dark:text-gray-300 max-w-2xl leading-relaxed text-left">
              {t(language, 'portfolio.description')}
            </p>
          </div>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 100, rotateX: -15 }}
              animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ duration: 1, delay: index * 0.2 }}
              whileHover={{ y: -8, rotateY: 4, scale: 1.01 }}
              className="group relative aspect-square rounded-none border border-white/10 bg-white/5 dark:bg-black/10 hover:border-primary/30 transition-all duration-300 overflow-hidden cursor-pointer"
              onClick={() => openPopup(false, index === 1 ? 'VIDEO INSTALACIÓN' : 'VIDEOGAME')} // Open popup on click
            >
              {/* Project Image (fills square) */}
              <div className="absolute inset-0 overflow-hidden">
                <motion.img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  whileHover={{ scale: 1.05 }}
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${project.gradient} opacity-15 group-hover:opacity-30 transition-opacity duration-200`} />
                {/* Overlay Actions */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 flex items-center justify-center space-x-2 bg-black/30"
                >
                  <motion.button 
                    className="p-1 rounded-none bg-red-600/15 backdrop-blur-sm border border-orange-800 text-red-600 hover:text-orange-500 hover:bg-orange-500/15 transition-all duration-200"
                    onClick={(e) => { e.stopPropagation(); openPopup(true, index === 1 ? 'VIDEO INSTALACIÓN' : 'VIDEOGAME'); }}
                  >
                    <Eye size={12} />
                  </motion.button>
                  <motion.button className="p-1 rounded-none bg-red-600/15 backdrop-blur-sm border border-orange-800 text-red-600 hover:text-orange-500 hover:bg-orange-500/15 transition-all duration-200">
                    <Github size={12} />
                  </motion.button>
                  <motion.button className="p-1 rounded-none bg-red-600/15 backdrop-blur-sm border border-orange-800 text-red-600 hover:text-orange-500 hover:bg-orange-500/15 transition-all duration-200">
                    <ExternalLink size={12} />
                  </motion.button>
                </motion.div>
              </div>
              {/* Project Content (bottom band inside square) */}
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/35 backdrop-blur-sm">
                <h3 className="text-sm font-black font-lincolnmitre text-orange-400 dark:text-orange-300 mb-1">
                  {customTitles?.[index] ?? project.title}
                </h3>
                <p className="text-sm font-extrabold font-lincolnmitre text-orange-400 dark:text-orange-300 mb-2 leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {project.tech.map((tech, techIndex) => (
                    <motion.span
                      key={tech}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={inView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: (index * 0.2) + (techIndex * 0.1) + 0.5 }}
                      className="px-1 py-[1px] bg-gradient-to-r from-primary/15 to-secondary/15 text-[9px] font-lincolnmitre rounded-none border border-primary/20 text-orange-400 dark:text-orange-300 font-extrabold"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <VideogamePopup isVisible={isPopupVisible} onClose={closePopup} minimal={isPopupMinimal} title={popupTitle} />
    </section>
  );
}

export default PortfolioSection;