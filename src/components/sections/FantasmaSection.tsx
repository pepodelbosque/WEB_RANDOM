import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

import { useLanguage } from '../../hooks/useLanguage';
import { t } from '../../utils/translations';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const FantasmaSection: React.FC = () => {
  const { language } = useLanguage();
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  const sectionRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const revealTLRef = useRef<gsap.core.Timeline | null>(null);
  const revealStateRef = useRef<{ p: number }>({ p: 0 });
  const handleRef = (el: HTMLElement | null) => {
    ref(el);
    sectionRef.current = el;
  };

  const projects = [
    {
      id: 1,
      title: t(language, 'fantasma.projects.dreamscape.title'),
      description: t(language, 'fantasma.projects.dreamscape.description'),
      image: 'https://images.pexels.com/photos/1089438/pexels-photo-1089438.jpeg?auto=compress&cs=tinysrgb&w=800',
      gradient: 'from-purple-600 via-pink-600 to-red-600',
    },
    {
      id: 2,
      title: t(language, 'fantasma.projects.chaos.title'),
      description: t(language, 'fantasma.projects.chaos.description'),
      image: '/images/caos1.jpg',
      gradient: 'from-blue-600 via-purple-600 to-pink-600',
    },
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

  // Scramble reveal para el título: permanece secreto hasta interacción (click/touch)
  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;

    const finalText = 'FANTASMA = PEPO SABATINI & BARBARA OETTINGER';

    const scrambleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*+?';
    const indices = Array.from(finalText)
      .map((c, i) => (/^\s$/.test(c) ? -1 : i))
      .filter((i) => i >= 0);
    const phi = 0.6180339887498948;
    const weights = indices.map((idx) => ({ idx, w: ((idx * phi) % 1) + Math.random() * 0.02 }));
    weights.sort((a, b) => a.w - b.w);
    const revealOrder = weights.map((w) => w.idx);
    const rankMap = new Map<number, number>();
    revealOrder.forEach((idx, rank) => rankMap.set(idx, rank));

    const setScrambledProgress = (p: number) => {
      const threshold = p * revealOrder.length;
      const out = finalText
        .split('')
        .map((c, i) => {
          if (/^\s$/.test(c)) return c;
          const rank = rankMap.get(i) ?? 0;
          return rank < threshold ? c : scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
        })
        .join('');
      el.textContent = out;
    };

    // Estado inicial: completamente scrambled
    setScrambledProgress(0);

    // Estado compartido para permitir triggers externos (inView + timeout)
    const revealState = revealStateRef.current = { p: 0 };
    const revealTL = gsap.timeline({ paused: true, repeat: -1, yoyo: true, repeatDelay: 4 });
    revealTL.to(revealState, {
      p: 1,
      duration: 2.6,
      ease: 'power3.out',
      onUpdate: () => setScrambledProgress(revealState.p),
      delay: 0,
    });
    revealTLRef.current = revealTL;

    const startReveal = () => {
      if (revealTL.isActive() || revealState.p >= 1) return;
      revealTL.play(0);
      el.removeEventListener('click', startReveal);
      el.removeEventListener('touchstart', startReveal);
    };
    el.addEventListener('click', startReveal, { passive: true });
    el.addEventListener('touchstart', startReveal, { passive: true });

    return () => {
      el.removeEventListener('click', startReveal);
      el.removeEventListener('touchstart', startReveal);
      revealTL.kill();
      revealTLRef.current = null;
    };
  }, []);

  // Al entrar en la sección (inView), revelar automáticamente el h2 tras 4s
  useEffect(() => {
    const tl = revealTLRef.current;
    if (!tl) return;
    if (inView) {
      const timeoutId = window.setTimeout(() => {
        if (!tl.isActive()) {
          tl.play(0);
        }
      }, 4000);
      return () => {
        window.clearTimeout(timeoutId);
      };
    } else {
      tl.pause();
    }
  }, [inView]);

  // Bloquear tamaños mínimos al 120% del tamaño visible inicial para elementos clave
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const lockMinSizes = () => {
      const elements: HTMLElement[] = [];
      const logo = section.querySelector('.logo-fntsm') as HTMLElement | null;
      if (logo) elements.push(logo);
      const cards = Array.from(section.querySelectorAll('.fantasma-grid .group')) as HTMLElement[];
      elements.push(...cards);

      elements.forEach((el) => {
        const baseWAttr = el.getAttribute('data-min-base-w');
        const baseHAttr = el.getAttribute('data-min-base-h');
        const baseW = baseWAttr ? parseFloat(baseWAttr) : el.offsetWidth;
        const baseH = baseHAttr ? parseFloat(baseHAttr) : el.offsetHeight;
        if (!baseWAttr) el.setAttribute('data-min-base-w', String(baseW));
        if (!baseHAttr) el.setAttribute('data-min-base-h', String(baseH));

        const minW = Math.round(baseW * 1.2);
        el.style.minWidth = `${minW}px`;

        // Para el logo, también fijar altura mínima para evitar reducción en layouts pequeños
        if (el.classList.contains('logo-fntsm')) {
          const minH = Math.round(baseH * 1.2);
          el.style.minHeight = `${minH}px`;
        }

        el.setAttribute('data-min-locked', 'true');
      });
    };

    const ready = (document as any).fonts?.ready || Promise.resolve();
    Promise.resolve(ready).then(() => {
      requestAnimationFrame(lockMinSizes);
    });

    const onResize = () => {
      // Mantener mínimos basados en la medida base (no compone)
      requestAnimationFrame(lockMinSizes);
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <section id="fantasma" ref={handleRef} className="min-h-screen py-20 relative overflow-hidden mb-24 md:mb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="text-center mb-4"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex justify-center mb-0 px-4"
          >
            <img 
              src="/images/logo-fntsm.png" 
              alt="FNTSM Logo"
              className="h-18 sm:h-18 md:h-24 lg:h-24 xl:h-30 w-auto object-contain logo-fntsm"
            />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-[0.5rem] sm:text-[0.55rem] md:text-[0.6rem] lg:text-[0.6rem] xl:text-[0.7rem] font-bold font-lincolnmitre text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary uppercase tracking-wider mb-0 px-4 max-w-full overflow-hidden opacity-50 cursor-pointer"
            style={{ fontVariant: 'small-caps', wordBreak: 'break-word' }}
            ref={titleRef}
          >
            FANTASMA = PEPO SABATINI & BARBARA OETTINGER
          </motion.h2>
          {/* Description removed per request */}
        </motion.div>

        {/* Gallery Grid: centered responsive */}
        <div className="fantasma-grid">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 100, rotateX: -15 }}
              animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ duration: 1, delay: index * 0.3 }}
              whileHover={{ y: -8, rotateY: 4, scale: 1.01 }}
              className={`group relative aspect-[16/9] w-[69%] mx-auto md:mx-0 mt-0 rounded-none border border-white/10 bg-white/5 dark:bg-black/10 hover:border-primary/30 transition-all duration-700 overflow-hidden cursor-pointer ${index % 2 === 0 ? 'md:justify-self-end' : 'md:justify-self-start'}`}
            >
              {/* Background image fills square */}
              <motion.img
                src={project.image}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover"
                whileHover={{ scale: 1.06 }}
                transition={{ duration: 0.8 }}
              />

              {/* Soft gradient wash like Portfolio */}
              <div className={`absolute inset-0 bg-gradient-to-t ${project.gradient} opacity-20 group-hover:opacity-35 transition-opacity duration-300`} />

              {/* Bottom overlay band (Portfolio style) */}
              <div className="fantasma-overlay absolute bottom-0 left-0 right-0 bg-black/35 backdrop-blur-sm">
                <h3 className="font-black font-lincolnmitre text-orange-400 dark:text-orange-300 mb-1">
                  {project.title}
                </h3>
                <p className="font-extrabold font-lincolnmitre text-orange-400 dark:text-orange-300 mb-1">
                  {project.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FantasmaSection;
