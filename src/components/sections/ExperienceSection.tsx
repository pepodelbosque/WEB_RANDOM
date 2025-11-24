import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Calendar, MapPin, Award, TrendingUp } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { t } from '../../utils/translations';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const ExperienceSection: React.FC = () => {
  const { language } = useLanguage();
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: false,
  });
  const sectionRef = useRef<HTMLElement | null>(null);
  const handleRef = (el: HTMLElement | null) => {
    ref(el);
    sectionRef.current = el;
  };

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
          wrapper.style.textAlign = 'justify';
          (wrapper.style as any)['textAlignLast'] = 'justify';
          wrapper.style.hyphens = 'auto';
          text.insertBefore(wrapper, lineWords[0]);
          lineWords.forEach((w) => wrapper.appendChild(w));
          wrappers.push(wrapper);
        });

        const justifyLines = () => {
          wrappers.forEach((wrapper, idx) => {
            const isLast = idx === wrappers.length - 1;
            (wrapper.style as any)['textAlignLast'] = isLast ? 'left' : 'justify';
            if (isLast) {
              wrapper.style.wordSpacing = '';
              return;
            }
            const children = Array.from(wrapper.children) as HTMLElement[];
            const spaceCount = children.reduce((acc, el) => {
              const txt = el.textContent || '';
              return acc + (/^\s+$/.test(txt) ? 1 : 0);
            }, 0);
            if (spaceCount <= 0) {
              wrapper.style.wordSpacing = '';
              return;
            }
            const wrapperWidth = wrapper.getBoundingClientRect().width;
            const contentWidth = children.reduce((acc, el) => acc + el.getBoundingClientRect().width, 0);
            const leftover = wrapperWidth - contentWidth;
            const perSpace = leftover / spaceCount;
            wrapper.style.wordSpacing = perSpace > 0 ? `${perSpace}px` : '';
          });
        };

        justifyLines();
        window.addEventListener('resize', justifyLines);

        gsap.from(wrappers, {
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

        ScrollTrigger.addEventListener('refresh', justifyLines);
        const cleanup = () => {
          window.removeEventListener('resize', justifyLines);
          ScrollTrigger.removeEventListener('refresh', justifyLines);
        };
        (container as any).__justifyCleanup = cleanup;
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
      const section = sectionRef.current;
      if (section) {
        const containers = Array.from(section.querySelectorAll('.split-container')) as HTMLElement[];
        containers.forEach((c) => {
          const fn = (c as any).__justifyCleanup;
          if (typeof fn === 'function') fn();
        });
      }
    };
  }, []);

  const experiences = [
    {
      id: 1,
      title: t(language, 'experience.jobs.seniorCreativeDeveloper.title'),
      company: t(language, 'experience.jobs.seniorCreativeDeveloper.company'),
      location: t(language, 'experience.jobs.seniorCreativeDeveloper.location'),
      period: t(language, 'experience.jobs.seniorCreativeDeveloper.period'),
      description: t(language, 'experience.jobs.seniorCreativeDeveloper.description'),
      achievements: t(language, 'experience.jobs.seniorCreativeDeveloper.achievements') as unknown as string[],
      gradient: 'from-primary to-secondary',
    },
    {
      id: 2,
      title: t(language, 'experience.jobs.fullStackDeveloper.title'),
      company: t(language, 'experience.jobs.fullStackDeveloper.company'),
      location: t(language, 'experience.jobs.fullStackDeveloper.location'),
      period: t(language, 'experience.jobs.fullStackDeveloper.period'),
      description: t(language, 'experience.jobs.fullStackDeveloper.description'),
      achievements: t(language, 'experience.jobs.fullStackDeveloper.achievements') as unknown as string[],
      gradient: 'from-secondary to-primary',
    },
    {
      id: 3,
      title: t(language, 'experience.jobs.frontendDeveloper.title'),
      company: t(language, 'experience.jobs.frontendDeveloper.company'),
      location: t(language, 'experience.jobs.frontendDeveloper.location'),
      period: t(language, 'experience.jobs.frontendDeveloper.period'),
      description: t(language, 'experience.jobs.frontendDeveloper.description'),
      achievements: t(language, 'experience.jobs.frontendDeveloper.achievements') as unknown as string[],
      gradient: 'from-primary via-secondary to-accent',
    },
  ];

  const stats = [
    { number: '50+', label: t(language, 'experience.stats.projectsCompleted'), icon: TrendingUp },
    { number: '5+', label: t(language, 'experience.stats.yearsExperience'), icon: Calendar },
    { number: '20+', label: t(language, 'experience.stats.happyClients'), icon: Award },
    { number: '99%', label: t(language, 'experience.stats.clientSatisfaction'), icon: TrendingUp },
  ];

  return (
    <section id="experience" ref={handleRef} className="min-h-screen py-20 relative mb-24 md:mb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
          transition={{ duration: 1 }}
          className="mb-20"
        >
          <motion.h2 
            initial={{ opacity: 0, x: -100 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="text-5xl font-bold font-lincolnmitre text-transparent bg-clip-text bg-gradient-to-r from-primary to secondary mb-6 text-left max-w-3xl mx-auto"
          >
            EXPERIENCIA
          </motion.h2>
          <div className="split-container">
            <p className="split text-[1.1em] font-lincolnmitre text-orange-600 dark:text-gray-300 max-w-3xl mx-auto leading-[1.3] text-justify">
              Aquí te presentamos a quienes dieron vida a este proyecto, desde las voces creativas hasta quienes compartieron sus sueños para transformarlos en obra.
              Katherine Hoch y Eduardo Pino abren generosamente sus experiencias oníricas, invitándonos a explorar con sus sueños las fronteras entre lo real y lo imaginado.
              Camila Estrella, teórica y participante, aporta desde la reflexión y también comparte uno de los sueños que inspiró la obra.
              Sebastián Valenzuela, curador y teórico, acompaña guiando la visión general y el diálogo entre arte y tecnología.
              Barbara Oettinger, artista visual y realizadora, y Pepo Sabatini, cineasta y animador 3D, crearon conjuntamente el imaginario y la concepción estética del proyecto, fusionando visión creativa y técnica.
              Barbara aporta una mirada sensible y poética que atraviesa la propuesta, mientras que Pepo aporta su visión y expertice dentro del universo 3D.
              Cada uno, desde su lugar, construye un entramado colectivo que atraviesa el arte, la tecnología y los sueños.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ExperienceSection;
