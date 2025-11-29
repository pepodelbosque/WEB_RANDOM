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
  const touchStartXRef = useRef<number | null>(null);
  const lastChangeRef = useRef(0);
  const lastScrollDirRef = useRef<'up' | 'down'>('down');
  const pageRef = useRef<HTMLDivElement | null>(null);
  const originRef = useRef<{ y: number; inAbout: boolean } | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isPortrait, setIsPortrait] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  
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
  const [pagesTokens, setPagesTokens] = useState<string[][]>([partA, partB, partC]);

  useEffect(() => {
    const portrait = isPortrait || isCompact;
    if (portrait) {
      const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
      const available = Math.max(0, Math.floor(vh * 0.70));
      const baseLine = (() => {
        const el = pageRef.current || overlayRef.current;
        if (el) {
          const cs = window.getComputedStyle(el);
          const lh = parseFloat(cs.lineHeight || '22');
          return isNaN(lh) ? 22 : lh;
        }
        return 22;
      })();
      const wordsPerLine = 7;
      const perPage = Math.max(90, Math.floor((available / baseLine) * wordsPerLine));
      const out: string[][] = [];
      for (let i = 0; i < allWords.length; i += perPage) out.push(allWords.slice(i, i + perPage));
      setPagesTokens(out.length ? out : [allWords]);
    } else {
      setPagesTokens([partA, partB, partC]);
    }
  }, [overlayOpen, isPortrait, isCompact, allWords, partA, partB, partC]);

  useEffect(() => {
    setOverlayPage((p) => Math.min(p, Math.max(0, pagesTokens.length - 1)));
  }, [pagesTokens]);
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
        const dir = w.__scrollDir || 'down';
        const isRecent = Date.now() - last < 1800;
        if (isRecent && mode === 'scroll' && dir !== 'up') {
          setOverlayOpen(true);
          try { (window as any).lenis?.stop(); } catch (e) { void e; }
        }
      },
      onEnterBack: () => {
        const w = window as any;
        const last = w.__recentScrollAt || 0;
        const mode = w.__accessMode || 'scroll';
        const dir = w.__scrollDir || 'up';
        const isRecent = Date.now() - last < 1800;
        const rect = sectionRef.current?.getBoundingClientRect();
        const vh = window.innerHeight || 800;
        const nearHero = rect ? rect.bottom <= (vh * 0.08) : false;
        const portfolio = document.getElementById('portfolio');
        const titleEl = portfolio?.querySelector('h1, h2, [data-section-title], .section-title') as HTMLElement | null;
        let okGallery = true;
        if (titleEl) {
          const cs = window.getComputedStyle(titleEl);
          const lh = parseFloat(cs.lineHeight || '24');
          const threshold = (isNaN(lh) ? 24 : lh) * 4;
          const tr = titleEl.getBoundingClientRect();
          okGallery = tr.top >= threshold;
        }
        if (isRecent && mode === 'scroll' && dir === 'up' && nearHero && okGallery) {
          try {
            const lenis = (window as any).lenis;
            lenis?.start();
            const header = document.querySelector('nav');
            const headerH = header ? Math.round((header as HTMLElement).getBoundingClientRect().height) : 64;
            const hero = document.getElementById('home');
            if (hero && lenis && typeof lenis.scrollTo === 'function') {
              lenis.scrollTo(hero, { offset: -headerH, duration: 1.15, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
            } else {
              hero?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            (window as any).__accessMode = 'nav';
          } catch (e) { void e; }
        }
      },
    });
    return () => { st.kill(); };
  }, []);

  useEffect(() => {
    const w = window as any;
    const setWheel = (ev: WheelEvent) => {
      w.__accessMode = 'scroll';
      w.__recentScrollAt = Date.now();
      w.__scrollDir = (ev.deltaY > 0 ? 'down' : 'up');
    };
    let lastTouchY: number | null = null;
    const onTouchStart = (ev: TouchEvent) => { lastTouchY = ev.touches?.[0]?.clientY ?? null; };
    const onTouchMove = (ev: TouchEvent) => {
      w.__accessMode = 'scroll';
      w.__recentScrollAt = Date.now();
      const y = ev.touches?.[0]?.clientY ?? null;
      if (y != null && lastTouchY != null) {
        w.__scrollDir = (lastTouchY - y > 0 ? 'down' : 'up');
      }
      lastTouchY = y;
    };
    window.addEventListener('wheel', setWheel as any, { passive: true } as any);
    window.addEventListener('touchstart', onTouchStart as any, { passive: true } as any);
    window.addEventListener('touchmove', onTouchMove as any, { passive: true } as any);
    if (window.location.hash) { w.__accessMode = 'external'; }
    return () => {
      window.removeEventListener('wheel', setWheel as any);
      window.removeEventListener('touchstart', onTouchStart as any);
      window.removeEventListener('touchmove', onTouchMove as any);
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
      try {
        const y = window.scrollY || 0;
        const rect = sectionRef.current?.getBoundingClientRect();
        const inAbout = !!rect && rect.top < (window.innerHeight || 0) && rect.bottom > 0;
        originRef.current = { y, inAbout };
      } catch (e) { void e; }
      setOverlayPage(0);
      navigateOnCloseRef.current = false;
      dirRef.current = 1;
      // Focus the overlay for accessibility
      requestAnimationFrame(() => overlayRef.current?.focus?.());
      lastChangeRef.current = 0;
    }
  }, [overlayOpen]);

  const stepAdvance = (dir: 'up' | 'down') => {
    lastScrollDirRef.current = dir;
    const now = Date.now();
    if (now - lastChangeRef.current < 360) return;
    lastChangeRef.current = now;
    setOverlayPage((p) => {
      const max = Math.max(0, pagesTokens.length - 1);
      if (dir === 'down') {
        if (p < max) return p + 1;
        navigateOnCloseRef.current = false;
        setOverlayOpen(false);
        return p;
      } else {
        if (p > 0) return p - 1;
        return p;
      }
    });
    };

  const pageScrollState = () => {
    const el = pageRef.current as HTMLElement | null;
    if (!el) return { scrollable: false, atTop: true, atBottom: true };
    const maxScroll = el.scrollHeight - el.clientHeight;
    const scrollable = maxScroll > 4;
    const atTop = el.scrollTop <= 0;
    const atBottom = el.scrollTop >= (maxScroll - 1);
    return { scrollable, atTop, atBottom };
  };

  useEffect(() => {
    const updateOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
      const mm = window.matchMedia('(max-width: 1024px)');
      setIsCompact(mm.matches);
    };
    updateOrientation();
    window.addEventListener('resize', updateOrientation);
    window.addEventListener('orientationchange', updateOrientation);
    return () => {
      window.removeEventListener('resize', updateOrientation);
      window.removeEventListener('orientationchange', updateOrientation);
    };
  }, []);

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
    <section id="about" ref={handleRef} className="min-h-[12.5vh] py-0 relative mb-0" style={{ marginBottom: '20vh' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-1 gap-0 items-center">
          {/* Text Content removed: no empty spacer */}

          {/* Visual Element was here */}
        </div>
      </div>
      <AnimatePresence onExitComplete={() => {
        try {
          const lenis = (window as any).lenis;
          lenis?.start();
          const header = document.querySelector('nav');
          const headerH = header ? Math.round((header as HTMLElement).getBoundingClientRect().height) : 64;
          const origin = originRef.current;
          if (origin?.inAbout) {
            const y = origin.y;
            if (lenis && typeof lenis.scrollTo === 'function') {
              lenis.scrollTo(y, { duration: 1.1, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
            } else {
              window.scrollTo({ top: y, behavior: 'smooth' });
            }
          } else {
          const goHero = lastScrollDirRef.current === 'up';
          if (goHero) {
            const home = document.getElementById('home');
            if (home) {
              const opts = { offset: -headerH, duration: 1.15, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) };
              if (lenis && typeof lenis.scrollTo === 'function') lenis.scrollTo(home, opts as any);
              else home.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          } else {
            const portfolio = document.getElementById('portfolio');
            const titleEl = portfolio?.querySelector('h2');
            const targetEl = titleEl || portfolio;
            if (targetEl) {
              const margin = Math.round(window.innerHeight * 0.19);
              const opts = { offset: headerH + margin, duration: 1.15, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) };
              if (lenis && typeof lenis.scrollTo === 'function') {
                lenis.scrollTo(targetEl, opts as any);
              } else {
                const rect = targetEl.getBoundingClientRect();
                const top = (window.scrollY || 0) + rect.top - (headerH + margin);
                window.scrollTo({ top, behavior: 'smooth' });
              }
              try { window.dispatchEvent(new CustomEvent('portfolioEntrance')); } catch (e) { void e; }
            }
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
          transition={{ duration: 0.9, ease: 'easeInOut' }}
          className={`${styles.overlay} ${styles.overlayVisible} fixed inset-0 z-50 flex flex-col items-center justify-center w-full h-full`}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
          style={{ paddingTop: isCompact ? '15vh' : undefined, paddingBottom: isCompact ? '15vh' : undefined }}
          onWheel={(e) => {
            const dx = e.deltaX || 0;
            const dy = e.deltaY || 0;
            const useVertical = Math.abs(dy) >= Math.abs(dx);
            const s = pageScrollState();
            if (useVertical && s.scrollable) {
              if ((dy > 0 && !s.atBottom) || (dy < 0 && !s.atTop)) {
                return; // permitir scroll interno
              }
            }
            e.preventDefault();
            const dir = useVertical ? (dy > 0 ? 'down' : 'up') : (dx > 0 ? 'down' : 'up');
            dirRef.current = dir === 'down' ? 1 : -1;
            stepAdvance(dir);
          }}
          onTouchStart={(e) => {
            touchStartYRef.current = e.touches?.[0]?.clientY ?? null;
            touchStartXRef.current = e.touches?.[0]?.clientX ?? null;
          }}
          onTouchMove={(e) => {
            const y = e.touches?.[0]?.clientY ?? null;
            const x = e.touches?.[0]?.clientX ?? null;
            if (y == null || touchStartYRef.current == null) return;
            const dy = touchStartYRef.current - y;
            const dx = (touchStartXRef.current != null && x != null) ? (touchStartXRef.current - x) : 0;
            const useVertical = Math.abs(dy) >= Math.abs(dx);
            const s = pageScrollState();
            if (useVertical && s.scrollable) {
              if ((dy > 0 && !s.atBottom) || (dy < 0 && !s.atTop)) {
                touchStartYRef.current = y;
                if (x != null) touchStartXRef.current = x;
                return; // permitir scroll interno
              }
            }
            e.preventDefault();
            const dir = useVertical ? (dy > 0 ? 'down' : 'up') : (dx > 0 ? 'down' : 'up');
            dirRef.current = dir === 'down' ? 1 : -1;
            stepAdvance(dir);
            touchStartYRef.current = y;
            if (x != null) touchStartXRef.current = x;
          }}
        >
          <div ref={overlayHeaderRef} className="relative z-10 pointer-events-none select-none bg-gradient-to-r from-red-700 via-orange-500 to-red-600 text-transparent bg-clip-text font-lincolnmitre text-[1.6rem] md:text-[2rem] leading-[1] mb-3">{t(language, 'about.title')}</div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
            className={`${styles.frame}`}
            style={{ width: isCompact ? '100vw' : '75vw', height: isCompact ? 'calc(100vh - 30vh)' : undefined, maxHeight: isCompact ? undefined : '75vh' }}
          >
            <div className={styles.content} style={{ display: 'flex', width: '100%', height: '100%', overflow: 'hidden' }}>
              <motion.div
                key={overlayPage}
                initial={{ x: dirRef.current > 0 ? 120 : -120, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -120, opacity: 0 }}
                transition={{ duration: 1.1, ease: 'easeInOut' }}
                ref={pageRef}
                className="w-full h-full px-3 pt-10 pb-10 md:px-10 md:pt-14 md:pb-12 box-border"
                style={{ overflowY: 'hidden', overscrollBehavior: 'contain' }}
              >
                {selectedImage && overlayPage === 0 && (
                  <div className="w-full mb-3 flex items-center justify-center">
                    <img src={selectedImage} alt="selección" className="max-h-[32vh] w-auto object-contain border border-red-600/40" />
                  </div>
                )}
                <div className="w-full h-full" style={{ columnCount: (isPortrait ? 1 : 2) as any, columnGap: '1.05rem', columnFill: 'auto', height: '100%' }}>
                  <div className="text-[0.88em] md:text-[0.98em] tracking-tight font-lincolnmitre text-[rgba(255,0,0,0.85)] leading-[1.6] text-justify" style={{ hyphens: 'auto', overflowWrap: 'anywhere', wordBreak: 'break-word' }}>
                    <RenderTokens tokens={pagesTokens[Math.min(overlayPage, pagesTokens.length - 1)]} images={overlayImages} />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
          {(() => {
            const max = Math.max(0, pagesTokens.length - 1);
            const pct = max > 0 ? Math.round((overlayPage / max) * 100) : 100;
            return (
              <div className="relative z-10 mt-2 w-44 flex items-center gap-2">
                <div className="h-1 w-full bg-red-800/40 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-orange-500 to-red-600" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-[10px] font-lincolnmitre text-orange-400 tabular-nums">{pct}%</span>
              </div>
            );
          })()}
        </motion.div>
      )}
      </AnimatePresence>
    </section>
  );
};

export default AboutSection;
