import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
// Removed overlay icon buttons
import { useLanguage } from '../../hooks/useLanguage';
import { t } from '../../utils/translations';
import VideogamePopup from './VideogamePopup'; // Import the new component
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const PortfolioSection: React.FC = () => {
  const { language } = useLanguage();
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: false,
  });
  const sectionRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const introTLRef = useRef<any>(null);
  const handleRef = (el: HTMLElement | null) => {
    ref(el);
    sectionRef.current = el;
  };
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [isPopupMinimal, setPopupMinimal] = useState(false);
  const [popupTitle, setPopupTitle] = useState('VIDEOGAME');
  const [snapOffset, setSnapOffset] = useState<number>(90);

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

  useEffect(() => {
    const computeSnapOffset = () => {
      const header = document.querySelector('nav');
      const headerH = header ? Math.round((header as HTMLElement).getBoundingClientRect().height) : 64;
      const margin = Math.round(window.innerHeight * 0.19);
      setSnapOffset(headerH + margin);
    };
    computeSnapOffset();
    window.addEventListener('resize', computeSnapOffset);
    return () => window.removeEventListener('resize', computeSnapOffset);
  }, []);

  useEffect(() => {
    const fn = (window as any).lenisRecomputeSections;
    if (typeof fn === 'function') {
      fn();
    }
  }, [snapOffset, inView]);

  // Scramble Reveal del título (homogéneo, sincronizado con ScrollTrigger)
  useEffect(() => {
    const el = titleRef.current;
    const section = sectionRef.current;
    if (!el || !section) return;

    const finalText = t(language, 'portfolio.title');
    el.textContent = finalText;

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*+?';
    const indices = Array.from(finalText).map((c, i) => (c === ' ' ? -1 : i)).filter((i) => i >= 0);
    const phi = 0.6180339887498948;
    const weights = indices.map((idx) => ({ idx, w: ((idx * phi) % 1) + Math.random() * 0.02 }));
    weights.sort((a, b) => a.w - b.w);
    const revealOrder = weights.map((w) => w.idx);
    const rankMap = new Map<number, number>();
    revealOrder.forEach((idx, rank) => rankMap.set(idx, rank));

    const setScrambledText = (progress: number) => {
      const threshold = progress * revealOrder.length;
      const out = finalText
        .split('')
        .map((c, i) => {
          if (c === ' ') return c;
          const rank = rankMap.get(i) ?? 0;
          return rank < threshold ? c : chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');
      el.textContent = out;
    };

    const config = { appearPreRoll: 0.45, appearMove: 1.4, settle: 3.0, disappear: 1.6, ease: 'power3.inOut' } as const;
    const scrambleState = { p: 0 };

    const introTL = gsap.timeline({ paused: true });
    gsap.set(el, { opacity: 1, y: 40 });
    introTL
      .to(scrambleState, { p: 0.35, duration: config.appearPreRoll, ease: config.ease, onUpdate: () => setScrambledText(scrambleState.p) })
      .to(scrambleState, { p: 0.92, duration: config.appearMove, ease: config.ease, onUpdate: () => setScrambledText(scrambleState.p) }, 0)
      .to(el, { y: 0, duration: config.appearMove, ease: config.ease }, 0)
      .to(scrambleState, { p: 1, duration: config.settle, ease: config.ease, onUpdate: () => setScrambledText(scrambleState.p) });

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top 75%',
      end: 'bottom 25%',
      onEnter: () => introTL.play(0),
      onEnterBack: () => {
        gsap.set(el, { opacity: 1, y: 0 });
        setScrambledText(1);
      },
    });
    introTLRef.current = introTL;

    return () => {
      st.kill();
      introTL.kill();
    };
  }, [language]);

  useEffect(() => {
    const handler = () => {
      const tl = introTLRef.current;
      if (tl && typeof tl.play === 'function') tl.play(0);
    };
    window.addEventListener('portfolioEntrance', handler as any, { passive: true } as any);
    return () => window.removeEventListener('portfolioEntrance', handler as any);
  }, []);

  // Limitar tamaño superior de las tarjetas del grid al tamaño actual
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const lockMaxUpperSize = () => {
      const cards = Array.from(grid.querySelectorAll('[data-card="project"]')) as HTMLElement[];
      cards.forEach((card) => {
        const w = card.offsetWidth;
        const h = card.offsetHeight;
        card.style.maxWidth = `${w}px`;
        card.style.maxHeight = `${h}px`;
        card.setAttribute('data-max-upper-locked', 'true');
      });
    };

    const fontsReady = (document as any).fonts?.ready || Promise.resolve();
    Promise.resolve(fontsReady).then(() => {
      requestAnimationFrame(lockMaxUpperSize);
    });
  }, [language]);

  // Pre-scramble escalonado por párrafo con ciclo suave y cooldown
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const paras = Array.from(grid.querySelectorAll('[data-card="project"] p')) as HTMLElement[];
    if (!paras.length) return;

    // Guardar texto final canónico para evitar acumulación entre ciclos
    paras.forEach((el) => {
      const final = el.textContent || '';
      el.setAttribute('data-final-text', final);
    });

    // Bloquear dimensiones para que el pre-scramble no haga crecer las frases
    const lockParagraphDimensions = () => {
      paras.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const height = rect.height;
        el.style.height = `${height}px`;
        el.style.maxHeight = `${height}px`;
        el.style.overflow = 'hidden';
      });
    };

    const unlockParagraphDimensions = () => {
      paras.forEach((el) => {
        el.style.height = '';
        el.style.maxHeight = '';
        el.style.overflow = '';
      });
    };

    let tickId: number | null = null;
    let cooldownId: number | null = null;

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*+?';
    const scrambleOnce = (el: HTMLElement) => {
      const final = el.getAttribute('data-final-text') || '';
      const out = final
        .split('')
        .map((c) => (/\s/.test(c) ? c : letters[Math.floor(Math.random() * letters.length)]))
        .join('');
      el.textContent = out;
    };

    const setNormalTextFor = (el: HTMLElement) => {
      const final = el.getAttribute('data-final-text') || '';
      el.textContent = final;
    };

    // Duraciones escalonadas: p0 base, p1 +1s, p2 +2s, p3 +3s
    const baseMsInitial = 4000;
    const baseMsRepeat = 2000; // ciclo suave
    const offsetsMs = paras.map((_, i) => Math.min(i * 1000, 3000));
    const startTick = (baseMsArg: number) => {
      stopTick();
      const endTimes = new Map<HTMLElement, number>();
      const done = new Set<HTMLElement>();
      const now = Date.now();
      paras.forEach((el, i) => {
        endTimes.set(el, now + baseMsArg + (offsetsMs[i] || 0));
      });
      tickId = window.setInterval(() => {
        const t = Date.now();
        paras.forEach((el) => {
          if (done.has(el)) return;
          const end = endTimes.get(el) || 0;
          if (t < end) {
            scrambleOnce(el);
          } else {
            setNormalTextFor(el);
            done.add(el);
          }
        });
        // Cuando todos terminaron, fijar altura, detener y programar próximo ciclo suave
        if (done.size >= paras.length) {
          lockParagraphDimensions();
          stopTick();
          scheduleNextCycle();
        }
      }, 140);
    };

    const stopTick = () => {
      if (tickId !== null) {
        clearInterval(tickId);
        tickId = null;
      }
    };

    const stopCooldown = () => {
      if (cooldownId !== null) {
        clearTimeout(cooldownId);
        cooldownId = null;
      }
    };

    const scheduleNextCycle = () => {
      // No programar si no está en vista
      if (!inView) return;
      stopCooldown();
      const cooldownMs = 12000; // 12s de reposo antes de otro scramble suave
      cooldownId = window.setTimeout(() => {
        // Asegurar texto final y altura bloqueada antes del nuevo ciclo
        paras.forEach(setNormalTextFor);
        lockParagraphDimensions();
        startTick(baseMsRepeat);
      }, cooldownMs);
    };

    if (inView) {
      // Al iniciar, fijar texto final y bloquear altura antes del scramble
      paras.forEach(setNormalTextFor);
      lockParagraphDimensions();
      startTick(baseMsInitial);
    } else {
      stopTick();
      stopCooldown();
      paras.forEach(setNormalTextFor);
    }

    return () => {
      stopTick();
      stopCooldown();
      paras.forEach(setNormalTextFor);
      unlockParagraphDimensions();
    };
  }, [inView, language]);

  return (
    <section
      id="portfolio"
      ref={handleRef}
      className="min-h-[50vh] py-6 relative mb-40 md:mb-56"
      style={{ paddingTop: snapOffset, scrollMarginTop: snapOffset }}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1 }}
          className="text-left mb-0"
        >
          <motion.h2
            className="text-[2.7rem] leading-[1.05] font-bold font-lincolnmitre text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-4 max-w-2xl"
            ref={titleRef}
          >
            {t(language, 'portfolio.title')}
          </motion.h2>
          {/* Match AboutSection text configuration: spacing, width, typography */}
          <div className="space-y-5 text-[0.9em] md:text-[1.02em] font-lincolnmitre max-w-2xl mx-auto leading-[1.3]">
            <div className="split-container">
              <p className="split text-orange-600 dark:text-gray-300 text-justify">
                {t(language, 'portfolio.description')}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
          transition={{ duration: 1, delay: 0.1 }}
          className="grid md:grid-cols-2 gap-x-4 gap-y-4 justify-items-center mt-7"
          ref={gridRef}
        >
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              data-card="project"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: index * 0.6 }}
              whileHover={{ y: -8, rotateY: 4, scale: 1.01 }}
              className={`group relative aspect-square w-[80%] rounded-none border border-white/10 bg-white/5 dark:bg-black/10 hover:border-primary/30 transition-all duration-300 overflow-hidden cursor-pointer ${index % 2 === 0 ? 'md:justify-self-end' : 'md:justify-self-start'}`}
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
                {/* Overlay Actions removed per request */}
              </div>
              {/* Project Content (bottom band inside square) */}
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/35 backdrop-blur-sm">
                <h3 className="text-[0.8em] font-black font-lincolnmitre text-orange-400 dark:text-orange-300 mb-1">
                  {customTitles?.[index] ?? project.title}
                </h3>
                <p className="text-[0.8em] font-extrabold font-lincolnmitre text-orange-400 dark:text-orange-300 mb-2 leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {project.tech.map((tech, techIndex) => (
                    <motion.span
                      key={tech}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: false, amount: 0.2 }}
                      transition={{ delay: (index * 0.2) + (techIndex * 0.1) + 0.5 }}
                      className="px-1 py-[1px] bg-gradient-to-r from-primary/15 to-secondary/15 text-[7.2px] font-lincolnmitre rounded-none border border-primary/20 text-orange-400 dark:text-orange-300 font-extrabold"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <VideogamePopup isVisible={isPopupVisible} onClose={closePopup} minimal={isPopupMinimal} title={popupTitle} />
    </section>
  );
}

export default PortfolioSection;
