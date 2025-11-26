import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useLanguage } from '../../hooks/useLanguage';
import { t } from '../../utils/translations';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const AboutSection: React.FC = () => {
  const { language } = useLanguage();
  const [ref] = useInView({
    threshold: 0.3,
    triggerOnce: false,
  });
  
  const sectionRef = useRef<HTMLElement>(null);
  const wasInViewRef = useRef(false);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  

  

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

  // GSAP Secret Scramble Reveal para el título
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const el = titleRef.current;
    if (!el) return;

    const finalText = t(language, 'about.title');
    el.textContent = finalText; // asegura texto final como base

    // Scramble en toda la frase con revelado uniforme (no solo izquierda→derecha)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*+?';
    const indices = Array.from(finalText).map((c, i) => (c === ' ' ? -1 : i)).filter((i) => i >= 0);
    // Orden de revelado más homogéneo (tipo "blue noise") usando la razón áurea
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

    // Orquestación en tres fases: entrada, asentamiento y salida
    const config = {
      appearPreRoll: 0.45,
      appearMove: 1.4,
      settle: 3.0,
      disappear: 1.6,
      ease: 'power3.inOut',
    } as const;

    const scrambleState = { p: 0 };

    // ENTRADA + ASENTAMIENTO
    const introTL = gsap.timeline({ paused: true });
    gsap.set(el, { opacity: 1, y: 40 });
    // 1) Iniciar efecto ANTES del deslizamiento
    introTL.to(scrambleState, {
      p: 0.35,
      duration: config.appearPreRoll,
      ease: config.ease,
      onUpdate: () => setScrambledText(scrambleState.p),
    });
    // 1) Deslizamiento hacia posición final con efecto activo
    introTL.fromTo(
      el,
      { opacity: 1, y: 40 },
      { opacity: 1, y: 0, duration: config.appearMove, ease: config.ease }
    );
    introTL.to(scrambleState, {
      p: 0.75,
      duration: config.appearMove,
      ease: config.ease,
      onUpdate: () => setScrambledText(scrambleState.p),
    }, '<');
    // 2) Transformación gradual hasta forma definitiva
    introTL.to(scrambleState, {
      p: 1,
      duration: config.settle,
      ease: config.ease,
      onUpdate: () => setScrambledText(scrambleState.p),
    });
    introTL.add(() => { el.textContent = finalText; });

    // SALIDA: reactivar efecto y mantener hasta desaparecer
    const outroTL = gsap.timeline({ paused: true });
    outroTL.to(scrambleState, {
      p: 0.4,
      duration: 0.3,
      ease: config.ease,
      onUpdate: () => setScrambledText(scrambleState.p),
    });
    outroTL.to(el, {
      opacity: 0,
      y: -40,
      duration: config.disappear,
      ease: config.ease,
    }, '<');
    outroTL.to(scrambleState, {
      p: 1,
      duration: config.disappear,
      ease: config.ease,
      onUpdate: () => setScrambledText(scrambleState.p),
    }, '<');
    outroTL.add(() => { el.textContent = finalText; });

    // ScrollTrigger para sincronizar fases con entrada/salida de la sección
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 95%',
      end: 'bottom 5%',
      onEnter: () => introTL.restart(),
      onEnterBack: () => introTL.restart(),
      // La salida inicia cuando el título ya está posicionado (y=0)
      onLeave: () => outroTL.restart(),
      onLeaveBack: () => outroTL.restart(),
    });

    return () => {
      introTL.kill();
      outroTL.kill();
      st.kill();
    };
  }, [language]);


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
            <motion.h2 
              className="text-[2.7rem] font-bold font-lincolnmitre text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary max-w-2xl mx-auto"
              ref={titleRef}
            >
              {t(language, 'about.title')}
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="space-y-5 text-[0.9em] md:text-[1.02em] font-lincolnmitre text-red-600 dark:text-white max-w-2xl mx-auto leading-[1.3]"
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
