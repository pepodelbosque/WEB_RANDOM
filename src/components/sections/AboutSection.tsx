import React, { useRef, useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useLanguage } from '../../hooks/useLanguage';
import { t } from '../../utils/translations';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './TripulacionPopUp.module.css';

const AboutSection: React.FC = () => {
  const { language } = useLanguage();
  const [ref] = useInView({
    threshold: 0.3,
    triggerOnce: false,
  });
  const overlayHeaderRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const wasInViewRef = useRef(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [overlayPage, setOverlayPage] = useState(0);
  const dirRef = useRef(1);
  const touchStartYRef = useRef<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const navigateOnCloseRef = useRef(false);
  const overlayImages = useMemo(() => {
    const pool = [
      '/images/brbr1.jpg',
      '/images/pepo1.jpg',
      '/images/seba1.jpg',
      '/images/kate1.jpg',
      '/images/edu1.jpg',
      '/images/cami1.jpg',
      '/images/chini2.jpg',
    ];
    const picks: string[] = [];
    const used = new Set<number>();
    while (picks.length < 6 && used.size < pool.length) {
      const idx = Math.floor(Math.random() * pool.length);
      if (used.has(idx)) continue;
      used.add(idx);
      picks.push(pool[idx]);
    }
    while (picks.length < 6) picks.push(pool[picks.length % pool.length]);
    return picks;
  }, []);
  const desc1 = useMemo(() => t(language, 'about.description1'), [language]);
  const desc2 = useMemo(() => t(language, 'about.description2'), [language]);
  const desc3 = useMemo(() => t(language, 'about.description3'), [language]);
  const allWords = useMemo(() => {
    const text = [desc1, desc2, desc3].filter(Boolean).join(' ');
    return text.split(/(\s+)/).filter((w) => w.length > 0);
  }, [desc1, desc2, desc3]);
  const [partA, partB, partC] = useMemo(() => {
    const total = allWords.length;
    const aEnd = Math.floor(total / 3);
    const bEnd = Math.floor((2 * total) / 3);
    return [allWords.slice(0, aEnd), allWords.slice(aEnd, bEnd), allWords.slice(bEnd)];
  }, [allWords]);
  const RenderTokens: React.FC<{ tokens: string[]; images: string[] }> = ({ tokens, images }) => {
    const elems: React.ReactNode[] = [];
    let imgIdx = 0;
    let count = 0;
    for (let i = 0; i < tokens.length; i++) {
      const tk = tokens[i];
      elems.push(<span key={`w-${i}`}>{tk}</span>);
      count++;
      if (count % 32 === 0 && imgIdx < images.length) {
        const sideRight = imgIdx % 2 === 1;
        elems.push(
          <img
            key={`im-${i}`}
            src={images[imgIdx++]}
            alt={`overlay-${imgIdx}`}
            className={(sideRight ? 'float-right ml-2' : 'float-left mr-2') + ' w-[30%] max-w-[40%] h-auto object-cover rounded-none border border-red-500/30 box-border mb-2'}
            style={{ breakInside: 'avoid-column', shapeOutside: 'inset(0)' }}
          />
        );
      }
    }
    return <>{elems}</>;
  };
  

  

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

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top center',
      onEnter: () => {
        const w = window as any;
        const last = w.__recentScrollAt || 0;
        const mode = w.__accessMode || 'scroll';
        const isRecent = Date.now() - last < 1800;
        if (isRecent && mode !== 'nav' && mode !== 'external' && mode !== 'up') {
          setOverlayOpen(true);
          try { (window as any).lenis?.stop(); } catch (e) { void e; }
        }
      },
      onEnterBack: () => {
        const w = window as any;
        w.__accessMode = 'up';
        try {
          const lenis = (window as any).lenis;
          const hero = document.querySelector('#home');
          if (hero && lenis && typeof lenis.scrollTo === 'function') {
            const header = document.querySelector('nav');
            const headerH = header ? Math.round((header as HTMLElement).getBoundingClientRect().height) : 64;
            lenis.scrollTo(hero, { offset: 0 - headerH, duration: 1.1, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
          } else {
            (hero as any)?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
          }
        } catch (e) { void e; }
      },
    });
    return () => { st.kill(); };
  }, []);

  useEffect(() => {
    const w = window as any;
    const setNatural = () => { w.__accessMode = 'scroll'; w.__recentScrollAt = Date.now(); };
    window.addEventListener('wheel', setNatural, { passive: true } as any);
    window.addEventListener('touchmove', setNatural, { passive: true } as any);
    if (window.location.hash) { w.__accessMode = 'external'; }
    return () => {
      window.removeEventListener('wheel', setNatural as any);
      window.removeEventListener('touchmove', setNatural as any);
    };
  }, []);

  useEffect(() => {
    if (!overlayOpen) return;
    const el = overlayHeaderRef.current;
    if (!el) return;
    const finalText = t(language, 'about.title');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*+?';
    const indices = Array.from(finalText).map((c, i) => (c === ' ' ? -1 : i)).filter((i) => i >= 0);
    const phi = 0.6180339887498948;
    const weights = indices.map((idx) => ({ idx, w: ((idx * phi) % 1) + Math.random() * 0.02 }));
    weights.sort((a, b) => a.w - b.w);
    const revealOrder = weights.map((w) => w.idx);
    const rankMap = new Map<number, number>();
    revealOrder.forEach((idx, rank) => rankMap.set(idx, rank));
    const setScrambledText = (p: number) => {
      const threshold = Math.floor(p * revealOrder.length);
      el.textContent = finalText
        .split('')
        .map((c, i) => {
          if (c === ' ') return c;
          const rank = rankMap.get(i) ?? 0;
          return rank < threshold ? c : chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');
    };
    setScrambledText(0);
    const state = { p: 0 };
    const tl = gsap.to(state, {
      p: 1,
      duration: 1.2,
      ease: 'power3.inOut',
      onUpdate: () => setScrambledText(state.p),
      onComplete: () => { el.textContent = finalText; },
    });
    return () => { tl.kill(); };
  }, [overlayOpen, language]);

  useEffect(() => {
    if (overlayOpen) {
      setOverlayPage(0);
      navigateOnCloseRef.current = false;
      dirRef.current = 1;
    }
  }, [overlayOpen]);

  useEffect(() => {
    const onInfo = () => {
      setOverlayOpen(true);
      try { (window as any).lenis?.stop(); } catch (e) { void e; }
    };
    const onMedia = (ev: any) => {
      const src = ev?.detail?.src as string | undefined;
      (window as any).__accessMode = 'media';
      setSelectedImage(src || null);
      setOverlayOpen(true);
      try { (window as any).lenis?.stop(); } catch (e) { void e; }
    };
    window.addEventListener('openAboutInfoPopup', onInfo as any);
    window.addEventListener('openAboutImagePopup', onMedia as any);
    return () => { window.removeEventListener('openAboutInfoPopup', onInfo as any); };
  }, []);

  useEffect(() => {
    if (!overlayOpen) return;
    const el = overlayHeaderRef.current;
    if (!el) return;
    const finalText = t(language, 'about.title');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*+?';
    const indices = Array.from(finalText).map((c, i) => (c === ' ' ? -1 : i)).filter((i) => i >= 0);
    const phi = 0.6180339887498948;
    const weights = indices.map((idx) => ({ idx, w: ((idx * phi) % 1) + Math.random() * 0.02 }));
    weights.sort((a, b) => a.w - b.w);
    const revealOrder = weights.map((w) => w.idx);
    const rankMap = new Map<number, number>();
    revealOrder.forEach((idx, rank) => rankMap.set(idx, rank));
    const setScrambledText = (p: number) => {
      const threshold = Math.floor(p * revealOrder.length);
      el.textContent = finalText
        .split('')
        .map((c, i) => {
          if (c === ' ') return c;
          const rank = rankMap.get(i) ?? 0;
          return rank < threshold ? c : chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');
    };
    setScrambledText(0);
    const state = { p: 0 };
    const tl = gsap.to(state, {
      p: 1,
      duration: 2,
      ease: 'power2.inOut',
      onUpdate: () => setScrambledText(state.p),
      onComplete: () => { el.textContent = finalText; },
    });
    return () => { tl.kill(); };
  }, [overlayOpen, language]);


  // GSAP split-line animation tied to scroll
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Espera a que las fuentes estén listas para obtener saltos de línea reales
    const ready = (document as any).fonts?.ready || Promise.resolve();

    // Recopila los ScrollTriggers locales para cleanup sin afectar otros triggers
    const localTriggers: ScrollTrigger[] = [];

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

        // Envolver cada línea en un contenedor bloque con overflow oculto y justificar
        const lineWrappers: HTMLElement[] = [];
        lines.forEach((lineWords) => {
          const wrapper = document.createElement('span');
          wrapper.className = 'split-line';
          wrapper.style.display = 'block';
          wrapper.style.overflow = 'hidden';
          wrapper.style.textAlign = 'justify';
          (wrapper.style as any)['textAlignLast'] = 'justify';
          wrapper.style.hyphens = 'auto';
          // Insertar wrapper antes del primer elemento de la línea y mover palabras dentro
          text.insertBefore(wrapper, lineWords[0]);
          lineWords.forEach((word) => wrapper.appendChild(word));
          lineWrappers.push(wrapper);
        });

        // Ajuste fino del espaciado de palabras para rellenar el ancho
        const justifyLines = () => {
          lineWrappers.forEach((wrapper, idx) => {
            // La última línea del párrafo no debe justificarse de forma forzada
            const isLast = idx === lineWrappers.length - 1;
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

        // Animación por líneas con ScrollTrigger (sin markers)
        const anim = gsap.from(lineWrappers, {
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
        const st = (anim as any)?.scrollTrigger as ScrollTrigger | undefined;
        if (st) localTriggers.push(st);

        // Cleanup del listener de resize específico de este contenedor
        ScrollTrigger.addEventListener('refresh', justifyLines);
        const cleanup = () => {
          window.removeEventListener('resize', justifyLines);
          ScrollTrigger.removeEventListener('refresh', justifyLines);
        };
        // Guardar cleanup en el elemento para posibles futuros desmontajes
        (container as any).__justifyCleanup = cleanup;
      });
    });

    return () => {
      // Eliminar solo los ScrollTriggers creados por la animación de líneas
      const section = sectionRef.current;
      if (section) {
        const containers = Array.from(section.querySelectorAll('.split-container')) as HTMLElement[];
        containers.forEach((c) => {
          const fn = (c as any).__justifyCleanup;
          if (typeof fn === 'function') fn();
        });
      }
      // Local triggers se crean por cada contenedor
      // Nota: si se vuelve a montar, GSAP registrará nuevos triggers
      // Evitamos matar triggers ajenos (como el del título)
      // localTriggers acumulados en esta ejecución
      // Si por alguna razón está vacío, no hacemos nada
      // (esto previene impactos fuera de este efecto)
      // Aun así, por seguridad, chequeamos existencia antes de kill
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      (function killLocal() { localTriggers.forEach((st: ScrollTrigger) => st?.kill()); })();
    };
  }, []);



  return (
    <section id="about" ref={handleRef} className="min-h-screen py-20 relative mb-40 md:mb-56">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-1 gap-16 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 1 }}
            className="space-y-8"
          >
            <div className="max-w-2xl mx-auto w-full h-[60vh] md:h-[65vh]" />
          </motion.div>

          {/* Visual Element was here */}
        </div>
      </div>
      <AnimatePresence onExitComplete={() => {
        try {
          const lenis = (window as any).lenis;
          lenis?.start();
          const target = document.getElementById('portfolio');
          if (target) {
            const header = document.querySelector('nav');
            const headerH = header ? Math.round((header as HTMLElement).getBoundingClientRect().height) : 64;
            if (lenis && typeof lenis.scrollTo === 'function') {
              lenis.scrollTo(target, { offset: headerH + 20, duration: 1.05, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
            } else {
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }
        } catch (e) { void e; }
        navigateOnCloseRef.current = false;
        setSelectedImage(null);
      }}>
      {overlayOpen && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className={`${styles.overlay} ${styles.overlayVisible} fixed inset-0 z-50 flex flex-col items-center justify-center`}
          onWheel={(e) => {
            e.preventDefault();
            const dy = e.deltaY || 0;
            if (dy === 0) return;
            dirRef.current = dy > 0 ? 1 : -1;
            if (dy > 0) {
              if (overlayPage < 2) {
                setOverlayPage((p) => Math.min(2, p + 1));
              } else {
                navigateOnCloseRef.current = false;
                setOverlayOpen(false);
                setOverlayPage(0);
              }
            } else {
              if (overlayPage > 0) {
                setOverlayPage((p) => Math.max(0, p - 1));
              } else {
                navigateOnCloseRef.current = false;
                setOverlayOpen(false);
                setOverlayPage(0);
              }
            }
          }}
          onTouchStart={(e) => {
            touchStartYRef.current = e.touches?.[0]?.clientY ?? null;
          }}
          onTouchMove={(e) => {
            const y = e.touches?.[0]?.clientY ?? null;
            if (y == null || touchStartYRef.current == null) return;
            const dy = touchStartYRef.current - y;
            if (Math.abs(dy) < 10) return;
            e.preventDefault();
            dirRef.current = dy > 0 ? 1 : -1;
            if (dy > 0) {
              if (overlayPage < 2) {
                setOverlayPage((p) => Math.min(2, p + 1));
              } else {
                navigateOnCloseRef.current = false;
                setOverlayOpen(false);
                setOverlayPage(0);
              }
            } else {
              if (overlayPage > 0) {
                setOverlayPage((p) => Math.max(0, p - 1));
              } else {
                navigateOnCloseRef.current = false;
                setOverlayOpen(false);
                setOverlayPage(0);
              }
            }
            touchStartYRef.current = y;
          }}
        >
          <div ref={overlayHeaderRef} className="pointer-events-none select-none bg-gradient-to-r from-red-700 via-orange-500 to-red-600 text-transparent bg-clip-text font-lincolnmitre text-[1.6rem] md:text-[2rem] leading-[1] mb-3">{t(language, 'about.title')}</div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className={styles.frame}
            style={{ width: '75vw', maxHeight: '75vh' }}
          >
            <div className={styles.content} style={{ display: 'flex', width: '100%', height: '100%', overflow: 'hidden' }}>
              <motion.div
                key={overlayPage}
                initial={{ x: dirRef.current > 0 ? 120 : -120, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -120, opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className="w-full h-full px-10 pt-14 pb-12 md:px-12 md:pt-16 md:pb-14 box-border overflow-hidden"
              >
                {selectedImage && overlayPage === 0 && (
                  <div className="w-full mb-3 flex items-center justify-center">
                    <img src={selectedImage} alt="selección" className="max-h-[32vh] w-auto object-contain border border-red-600/40" />
                  </div>
                )}
                {overlayPage === 0 && (
                  <div className="w-full h-full" style={{ columnCount: 2 as any, columnGap: '1.05rem', columnFill: 'auto', height: '100%' }}>
                    <div className="text-[0.88em] md:text-[0.98em] tracking-tight font-lincolnmitre text-[rgba(255,0,0,0.85)] leading-[1.6] text-justify" style={{ hyphens: 'auto', overflowWrap: 'anywhere', wordBreak: 'break-word' }}>
                      <RenderTokens tokens={partA} images={[overlayImages[0], overlayImages[1], overlayImages[2]]} />
                    </div>
                  </div>
                )}
                {overlayPage === 1 && (
                  <div className="w-full h-full" style={{ columnCount: 2 as any, columnGap: '1.05rem', columnFill: 'auto', height: '100%' }}>
                    <div className="text-[0.88em] md:text-[0.98em] tracking-tight font-lincolnmitre text-[rgba(255,0,0,0.85)] leading-[1.6] text-justify" style={{ hyphens: 'auto', overflowWrap: 'anywhere', wordBreak: 'break-word' }}>
                      <RenderTokens tokens={partB} images={[overlayImages[3], overlayImages[4], overlayImages[5]]} />
                    </div>
                  </div>
                )}
                {overlayPage === 2 && (
                  <div className="w-full h-full" style={{ columnCount: 2 as any, columnGap: '1.05rem', columnFill: 'auto', height: '100%' }}>
                    <div className="text-[0.88em] md:text-[0.98em] tracking-tight font-lincolnmitre text-[rgba(255,0,0,0.85)] leading-[1.6] text-justify" style={{ hyphens: 'auto', overflowWrap: 'anywhere', wordBreak: 'break-word' }}>
                      <RenderTokens tokens={partC} images={[overlayImages[1], overlayImages[2], overlayImages[0]]} />
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </section>
  );
};

export default AboutSection;
