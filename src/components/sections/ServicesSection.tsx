import React, { useRef, useEffect, useState } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useLanguage } from '../../hooks/useLanguage';
import { t } from '../../utils/translations';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const ServicesSection: React.FC = () => {
  const { language } = useLanguage();
  const [ref] = useInView({
    threshold: 0.2,
    triggerOnce: false,
    fallbackInView: true
  });
  const sectionRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const leftBtnRef = useRef<HTMLButtonElement | null>(null);
  const rightBtnRef = useRef<HTMLButtonElement | null>(null);
  const heartControls = useAnimationControls();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);
  const stepRef = useRef(0);
  const maxIndexRef = useRef(0);
  const dirRef = useRef<1 | -1>(1); // 1 = derecha, -1 = izquierda
  const currentIndexRef = useRef(0);
  const leadMsRef = useRef(500); // adelantar latido 0.5s
  const skipNextPulseRef = useRef(false); // evita doble latido cuando ya se lanzó con adelanto
  const autoPausedUntilRef = useRef(0); // timestamp hasta el que el auto-movimiento debe pausar
  const pauseMsRef = useRef(3000); // pausa automática 3s tras interacción
  const handleRef = (el: HTMLElement | null) => {
    ref(el);
    sectionRef.current = el;
  };

  // Mantener ref sincronizada
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  // Latido del corazón al cambiar índice (solo si no hubo adelanto explícito)
  useEffect(() => {
    if (skipNextPulseRef.current) return;
    heartControls.start({
      scale: [1, 1.25, 1],
      transition: { duration: 0.45, ease: 'easeInOut', times: [0, 0.5, 1] }
    });
  }, [currentIndex, heartControls]);

  // Helper: lanzar latido y mover después del adelanto
  const pulseThenMoveTo = (nextIdx: number) => {
    skipNextPulseRef.current = true;
    heartControls.start({
      scale: [1, 1.25, 1],
      transition: { duration: 0.45, ease: 'easeInOut', times: [0, 0.5, 1] }
    });
    window.setTimeout(() => {
      setCurrentIndex(nextIdx);
      // permitir próximos latidos desde el efecto normal
      skipNextPulseRef.current = false;
    }, leadMsRef.current);
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

  // Scramble Reveal del título (homogéneo, sincronizado con ScrollTrigger)
  useEffect(() => {
    const el = titleRef.current;
    const section = sectionRef.current;
    if (!el || !section) return;

    const finalText = 'TRIPULACIÓN';
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

    return () => {
      st.kill();
      introTL.kill();
    };
  }, [language]);

  // Inicialización y listeners (una vez por idioma/render)
  useEffect(() => {
    const container = carouselRef.current;
    const track = trackRef.current;
    const leftBtn = leftBtnRef.current;
    const rightBtn = rightBtnRef.current;
    if (!container || !track) return;

    // Desactivar animación de marquee automática para este carrusel
    container.setAttribute('data-direction', 'manual');
    container.removeAttribute('data-reverse');
    track.style.animationName = 'none';
    track.style.transition = 'transform 300ms ease';

    const computeMetrics = () => {
      const firstItem = track.querySelector('[role="listitem"]') as HTMLElement | null;
      const gapStr = getComputedStyle(track).columnGap || getComputedStyle(track).gap || '0';
      const gap = parseFloat(gapStr) || 0;
      const cardWidth = firstItem ? firstItem.offsetWidth : 0;
      const step = cardWidth + gap;
      stepRef.current = step;
      const containerWidth = container.clientWidth;
      const perView = step > 0 ? Math.max(1, Math.floor((containerWidth + gap) / step)) : 1;
      const itemCount = track.querySelectorAll('[role="listitem"]').length;
      const newMax = Math.max(0, itemCount - perView);
      setMaxIndex(newMax);
      maxIndexRef.current = newMax;
      setCurrentIndex((prev) => Math.min(prev, newMax));
    };

    // Bloquear tamaño máximo de tarjetas al tamaño actual
    const relockCards = () => {
      const cards = Array.from(track.querySelectorAll('[role="listitem"]')) as HTMLElement[];
      cards.forEach((card) => {
        // Quitar bloqueos para medir tamaño natural
        card.style.width = '';
        card.style.minWidth = '';
        card.style.maxWidth = '';
      });
      // Forzar reflow y medir
      void track.offsetWidth;
      cards.forEach((card) => {
        const w = card.offsetWidth;
        // Bloquear que crezca o se achique: fijar ancho, min y max
        card.style.width = `${w}px`;
        card.style.minWidth = `${w}px`;
        card.style.maxWidth = `${w}px`;
        card.setAttribute('data-max-locked', 'true');
      });
    };

    // Primera medición y bloqueo
    relockCards();
    
    computeMetrics();

    const applyTransform = (idx: number) => {
      const dx = -idx * (stepRef.current || 0);
      track.style.transform = `translateX(${dx}px)`;
    };
    // Handlers
    const onLeftClick = () => {
      const prev = currentIndexRef.current;
      const next = Math.max(0, prev - 1);
      // pausar auto-movimiento durante 3s
      autoPausedUntilRef.current = Date.now() + pauseMsRef.current;
      pulseThenMoveTo(next);
    };
    const onRightClick = () => {
      const prev = currentIndexRef.current;
      const next = Math.min(maxIndexRef.current, prev + 1);
      // pausar auto-movimiento durante 3s
      autoPausedUntilRef.current = Date.now() + pauseMsRef.current;
      pulseThenMoveTo(next);
    };
    const onLeftKey = (e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onLeftClick(); } };
    const onRightKey = (e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onRightClick(); } };
    leftBtn?.addEventListener('click', onLeftClick);
    leftBtn?.addEventListener('keydown', onLeftKey);
    rightBtn?.addEventListener('click', onRightClick);
    rightBtn?.addEventListener('keydown', onRightKey);

    // Recalcular en resize
    const onResize = () => computeMetrics();
    window.addEventListener('resize', onResize);

    // Rebloquear tras carga de fuentes
    const fontsReady = (document as any).fonts?.ready || Promise.resolve();
    Promise.resolve(fontsReady).then(() => {
      // Esperar al layout final y then relock
      requestAnimationFrame(() => {
        relockCards();
        computeMetrics();
      });
    });

    // Observar cambios de contenido y re-bloquear
    const mo = new MutationObserver(() => {
      // Schedule para evitar múltiples triggers
      requestAnimationFrame(() => {
        relockCards();
        computeMetrics();
      });
    });
    mo.observe(track, { subtree: true, childList: true, characterData: true });

    return () => {
      leftBtn?.removeEventListener('click', onLeftClick);
      leftBtn?.removeEventListener('keydown', onLeftKey);
      rightBtn?.removeEventListener('click', onRightClick);
      rightBtn?.removeEventListener('keydown', onRightKey);
      window.removeEventListener('resize', onResize);
      mo.disconnect();
    };
  }, [language]);

  // Aplicar transformación cuando cambie el índice o métricas
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const dx = -currentIndex * (stepRef.current || 0);
    track.style.transform = `translateX(${dx}px)`;
  }, [currentIndex, maxIndex]);

  // Mantener referencia de maxIndex sincronizada
  useEffect(() => {
    maxIndexRef.current = maxIndex;
  }, [maxIndex]);

  // Auto movimiento ping-pong cada 3s, con latido adelantado
  useEffect(() => {
    const intervalMs = 3000;
    const timer = window.setInterval(() => {
      if (maxIndexRef.current <= 0) return;
      // saltar movimiento si estamos en ventana de pausa por interacción
      if (Date.now() < autoPausedUntilRef.current) return;
      const prev = currentIndexRef.current;
      let next = prev + dirRef.current;
      if (next >= maxIndexRef.current) {
        next = maxIndexRef.current;
        dirRef.current = -1;
      } else if (next <= 0) {
        next = 0;
        dirRef.current = 1;
      }
      pulseThenMoveTo(next);
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, []);

  // Crew data for biographic cards (uses images from /public/images)
  const crew = [
    {
      nameKey: "services.crew.barbara.name",
      roleKey: "services.crew.barbara.role",
      image: "/images/brbr1.jpg",
      bioKey: "services.crew.barbara.bio",
      skills: ["Arte", "Video", "plan"],
    },
    {
      nameKey: "services.crew.pepo.name",
      roleKey: "services.crew.pepo.role",
      image: "/images/pepo1.jpg",
      bioKey: "services.crew.pepo.bio",
      skills: ["CINE", "animacion", "guión"],
    },
    {
      nameKey: "services.crew.sebastian.name",
      roleKey: "services.crew.sebastian.role",
      image: "/images/seba1.jpg",
      bioKey: "services.crew.sebastian.bio",
      skills: ["ESTUDIO", "Gestión", "CULTURA"],
    },
    {
      nameKey: "services.crew.katherine.name",
      roleKey: "services.crew.katherine.role",
      image: "/images/kate1.jpg",
      bioKey: "services.crew.katherine.bio",
      skills: ["Sueños", "Relato", "Poética"],
    },
    {
      nameKey: "services.crew.eduardo.name",
      roleKey: "services.crew.eduardo.role",
      image: "/images/edu1.jpg",
      bioKey: "services.crew.eduardo.bio",
      skills: ["Sueños", "Memoria", "Diálogo"],
    },
    {
      nameKey: "services.crew.camila.name",
      roleKey: "services.crew.camila.role",
      image: "/images/cami1.jpg",
      bioKey: "services.crew.camila.bio",
      skills: ["Teoría", "estudio", "Sueños"],
    },
    {
      nameKey: "services.crew.chini.name",
      roleKey: "services.crew.chini.role",
      image: "/images/chini2.jpg",
      bioKey: "services.crew.chini.bio",
      skills: ["Sueños", "Relato", "Memoria"],
    },
    {
      nameKey: "services.crew.yeikob.name",
      roleKey: "services.crew.yeikob.role",
      image: "/images/yeikob1.jpg",
      bioKey: "services.crew.yeikob.bio",
      skills: ["Sueños", "Relato", "Memoria"],
    },
    {
      nameKey: "services.crew.nacho.name",
      roleKey: "services.crew.nacho.role",
      image: "/images/nacho1.jpg",
      bioKey: "services.crew.nacho.bio",
      skills: ["Sueños", "Relato", "Memoria"],
    },
    {
      nameKey: "services.crew.marco.name",
      roleKey: "services.crew.marco.role",
      image: "/images/marco1.jpg",
      bioKey: "services.crew.marco.bio",
      skills: ["Sueños", "Relato", "Memoria"],
    },
    {
      nameKey: "services.crew.chico.name",
      roleKey: "services.crew.chico.role",
      image: "/images/chico1.jpg",
      bioKey: "services.crew.chico.bio",
      skills: ["Sueños", "Relato", "Memoria"],
    },
    {
      nameKey: "services.crew.erika.name",
      roleKey: "services.crew.erika.role",
      image: "/images/death1.jpg",
      bioKey: "services.crew.erika.bio",
      skills: ["Curaduría", "Investigación", "Arquitectura"],
    },
    
  ];

  return (
    <section id="services" ref={handleRef} className="min-h-screen py-20 relative mb-40 md:mb-56">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-left mb-24 md:mb-28"
        >
          <motion.h2
            className="text-[2.7rem] leading-[1.05] font-bold font-lincolnmitre text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-4 max-w-2xl"
            ref={titleRef}
          >
            TRIPULACIÓN
          </motion.h2>
          <div className="split-container">
            <p className="split text-[0.9em] md:text-[1.02em] font-lincolnmitre text-orange-600 dark:text-gray-300 max-w-3xl mx-auto text-justify leading-[1.3]">
              {t(language, 'services.description')}
            </p>
          </div>
        </motion.div>

        {/* Carrusel con navegación discreta por botones */}
        <motion.div
          className="auto-carousel no-scrollbar -mt-12 md:-mt-14"
          ref={carouselRef}
          role="region"
          aria-label="Carrusel de tripulación"
          tabIndex={0}
          data-direction="manual"
          data-indicators="false"
        >
          <div id="crew-carousel-track" className="auto-carousel-track flex gap-x-[1ch] justify-start items-stretch" ref={trackRef} role="list">
          {crew.map((member, index) => (
            <motion.div
              key={`${member.nameKey}-${index}`}
              whileHover={{ y: -8, rotateY: 4, scale: 1.01 }}
              className="group relative aspect-square max-w-xs w-[52%] md:w-[14.3rem] flex-shrink-0 rounded-none border border-white/10 bg-white/5 dark:bg-black/10 hover:border-primary/30 transition-all duration-300 overflow-hidden"
              role="listitem"
            >
              {/* Background photo fills the square (crew portrait) */}
              <img
                src={member.image}
                alt={t(language, member.nameKey)}
                className="absolute inset-0 w-full h-full object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
  
              {/* Bottom overlay band (name, role, bio, skills) */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/35 backdrop-blur-sm">
                <h3 className="text-sm font-black font-lincolnmitre text-orange-400/70 dark:text-orange-300/70 mb-1">
                  {t(language, member.nameKey)}
                </h3>
                <p className="text-xs font-extrabold font-lincolnmitre text-orange-400/70 dark:text-orange-300/70 mb-1 leading-tight">
                  {t(language, member.roleKey)}
                </p>
                <p className="text-[11px] font-extrabold font-lincolnmitre text-orange-400/70 dark:text-orange-300/70 mb-2 leading-tight">
                  {t(language, member.bioKey)}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {member.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-[2px] bg-gradient-to-r from-primary/15 to-secondary/15 text-[10px] font-lincolnmitre rounded-none border border-primary/20 text-orange-400/70 dark:text-orange-300/70 font-extrabold"
                    >
                      {t(language, skill)}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
          </div>
          {/* Botones de control de velocidad */}
          <div className="mt-3 flex items-center justify-center gap-3">
            <button
              ref={leftBtnRef}
              type="button"
              aria-label="Anterior"
              aria-controls="crew-carousel-track"
              disabled={currentIndex <= 0}
              className="inline-flex items-center justify-center w-9 h-6 sm:w-10 sm:h-7 rounded-none border border-red-500/30 bg-red-500/10 dark:bg-red-500/10 text-red-500/80 dark:text-red-400/80 font-lincolnmitre hover:border-red-500/50 hover:bg-red-500/15 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-3.5 text-orange-700 dark:text-orange-500" aria-hidden="true">
                {/* Triángulo apuntando a la izquierda (punteado, sin relleno) */}
                <path d="M14 7 L7 12 L14 17 Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1.2 3" />
              </svg>
            </button>
            {/* Icono de calavera con solo trazo, palpita internamente */}
            <span
              aria-hidden="true"
              className="inline-flex items-center justify-center w-9 h-6 sm:w-10 sm:h-7 rounded-none border border-red-500/30 bg-red-500/10 dark:bg-red-500/10 text-red-500/80 dark:text-red-400/80 select-none"
            >
              <motion.svg
                initial={{ scale: 1 }}
                animate={heartControls}
                style={{ originX: 0.5, originY: 0.5 }}
                viewBox="0 0 24 24"
                className="w-5 h-3.5 text-orange-700 dark:text-orange-500"
              >
                {/* Corazón con puntillismo (stroke punteado y fino) */}
                <path
                  d="M3.172 5.172a4 4 0 015.656 0L12 8.343l3.172-3.171a4 4 0 115.656 5.656L12 21 3.172 10.828a4 4 0 010-5.656z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="1.2 3"
                />
              </motion.svg>
            </span>
            <button
              ref={rightBtnRef}
              type="button"
              aria-label="Siguiente"
              aria-controls="crew-carousel-track"
              disabled={currentIndex >= maxIndex}
              className="inline-flex items-center justify-center w-9 h-6 sm:w-10 sm:h-7 rounded-none border border-red-500/30 bg-red-500/10 dark:bg-red-500/10 text-red-500/80 dark:text-red-400/80 font-lincolnmitre hover:border-red-500/50 hover:bg-red-500/15 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-3.5 text-orange-700 dark:text-orange-500" aria-hidden="true">
                {/* Triángulo apuntando a la derecha (punteado, sin relleno) */}
                <path d="M10 7 L17 12 L10 17 Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1.2 3" />
              </svg>
            </button>
          </div>
          {/* Indicadores opcionales (desactivados por defecto) */}
          {/*
          <div className="auto-carousel-indicators" aria-hidden="true">
            {crew.map((_, i) => (
              <span key={i} className={"dot" + (i === 0 ? ' active' : '')} />
            ))}
          </div>
          */}
        </motion.div>
      </div>
    </section>
  );
}

export default ServicesSection;
