import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Mail, MessageCircle, Instagram, Youtube } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { t } from '../../utils/translations';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const ContactSection: React.FC = () => {
  const { language } = useLanguage();
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  const sectionRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const introRef = useRef<HTMLParagraphElement | null>(null);
  const handleRef = (el: HTMLElement | null) => {
    ref(el);
    sectionRef.current = el;
  };

  // Formulario eliminado; se reemplaza por botoneras de contacto directas

  // Contact info cells removed per request (Correo, Teléfono, Ubicación)

  // Social icons will be rendered directly in the CTAs block

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
          wrapper.style.textAlign = 'center';
          (wrapper.style as any)['textAlignLast'] = 'center';
          wrapper.style.hyphens = 'auto';
          text.insertBefore(wrapper, lineWords[0]);
          lineWords.forEach((w) => wrapper.appendChild(w));
          wrappers.push(wrapper);
        });

        const justifyLines = () => {
          wrappers.forEach((wrapper) => {
            wrapper.style.textAlign = 'center';
            (wrapper.style as any)['textAlignLast'] = 'center';
            wrapper.style.wordSpacing = '';
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

    const finalText = t(language, 'contact.title');
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

    const config = { appearPreRoll: 1.6, appearMove: 3.8, settle: 5.2, disappear: 1.6, ease: 'power3.inOut' } as const;
    const scrambleState = { p: 0 };

    const introTL = gsap.timeline({ paused: true });
    // Entrada desde arriba: posición inicial negativa
    gsap.set(el, { opacity: 1, y: -40 });
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

  // Scramble reveal en el párrafo de "Conectemos" reactivo al clic
  const handleIntroClick = () => {
    const el = introRef.current;
    if (!el) return;

    const finalText = t(language, 'contact.intro');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*+?';

    // Determinar orden de revelado (pseudo-aleatorio estable por índice)
    const indices = Array.from(finalText)
      .map((c, i) => (/\s/.test(c) ? -1 : i))
      .filter((i) => i >= 0);
    const phi = 0.6180339887498948;
    const weights = indices.map((idx) => ({ idx, w: ((idx * phi) % 1) + Math.random() * 0.02 }));
    weights.sort((a, b) => a.w - b.w);
    const revealOrder = weights.map((w) => w.idx);
    const rankMap = new Map<number, number>();
    revealOrder.forEach((idx, rank) => rankMap.set(idx, rank));

    const state = { p: 0 };
    const setScrambledText = (progress: number) => {
      const threshold = progress * revealOrder.length;
      const out = finalText
        .split('')
        .map((c, i) => {
          if (/\s/.test(c)) return c; // conservar espacios
          const rank = rankMap.get(i) ?? 0;
          return rank < threshold ? c : chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');
      el.textContent = out;
    };

    // Animar revelado
    gsap.to(state, {
      p: 1,
      duration: 1.2,
      ease: 'power2.out',
      onUpdate: () => setScrambledText(state.p),
      onComplete: () => {
        el.textContent = finalText;
      },
    });
  };

  // Mantener siempre en estado pre-scramble fijo (sin bucle) hasta que se haga clic
  useEffect(() => {
    const el = introRef.current;
    if (!el) return;
    const finalText = t(language, 'contact.intro');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*+?';

    const scrambleOnce = () => {
      const out = finalText
        .split('')
        .map((c) => (/\s/.test(c) ? c : chars[Math.floor(Math.random() * chars.length)]))
        .join('');
      el.textContent = out;
    };

    // Establecer una única vez el pre-scramble y mantenerlo fijo
    scrambleOnce();

    return () => {};
  }, [language]);

  // Al salir de la sección, volver al estado inicial (pre-scramble)
  useEffect(() => {
    const section = sectionRef.current;
    const el = introRef.current;
    if (!section || !el) return;
    const finalText = t(language, 'contact.intro');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*+?';

    const scrambleOnce = () => {
      const out = finalText
        .split('')
        .map((c) => (/\s/.test(c) ? c : chars[Math.floor(Math.random() * chars.length)]))
        .join('');
      el.textContent = out;
    };

    const restartPreScramble = () => {
      // Volver al pre-scramble fijo (sin bucle)
      scrambleOnce();
    };

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top center',
      end: 'bottom center',
      onToggle: (self) => {
        if (!self.isActive) {
          // fuera de la sección -> estado inicial
          restartPreScramble();
        }
      },
    });

    return () => {
      st.kill();
    };
  }, [language]);

  return (
  <section id="contact" ref={handleRef} className="pt-0 pb-20 relative mb-24 md:mb-32 -mt-12 md:-mt-16 scroll-mt-24 md:scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="text-center mb-10"
        >
          <h2
            className="text-[2.7rem] leading-[1.05] font-bold font-lincolnmitre text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-6"
            ref={titleRef}
          >
            {t(language, 'contact.title')}
          </h2>
          <div className="split-container">
            <p className="split text-[1.0em] font-lincolnmitre text-orange-600 dark:text-gray-300 max-w-3xl mx-auto leading-[1.3] text-center">
             {t(language, 'contact.description')}
            </p>
          </div>
        </motion.div>

        {/* Iconos centrados alineados con el título */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          className="mb-6"
        >
          <div className="flex flex-wrap items-center justify-center gap-4 max-w-3xl mx-auto dotted-icons">
            <motion.a
              href="mailto:hello@random.dev"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ scale: 1.2, rotate: 10 }}
              whileTap={{ scale: 0.95 }}
            className="group relative overflow-hidden p-3 rounded-none bg-transparent backdrop-blur-md border border-primary/40 text-primary shadow-[0_0_0_1px_rgba(255,0,0,0.12)] hover:border-primary hover:text-amber-300 hover:shadow-[0_0_18px_rgba(255,0,0,0.35)] transition-all duration-500 before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-primary/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition before:duration-700"
              aria-label="Correo"
            >
              <span aria-hidden className="noise-tv absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-60" />
              <Mail size={24} />
            </motion.a>
            <motion.a
              href="https://wa.me/15551234567"
              initial={{ opacity: 0, scale: 0 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
              whileHover={{ scale: 1.2, rotate: 10 }}
              whileTap={{ scale: 0.95 }}
            className="group relative overflow-hidden p-3 rounded-none bg-transparent backdrop-blur-md border border-primary/40 text-primary shadow-[0_0_0_1px_rgba(255,0,0,0.12)] hover:border-primary hover:text-amber-300 hover:shadow-[0_0_18px_rgba(255,0,0,0.35)] transition-all duration-500 before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-primary/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition before:duration-700"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
            >
              <span aria-hidden className="noise-tv absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-60" />
              <MessageCircle size={24} />
            </motion.a>
            <motion.a
              href="#"
              initial={{ opacity: 0, scale: 0 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
              whileHover={{ scale: 1.2, rotate: 10 }}
              whileTap={{ scale: 0.95 }}
            className="group relative overflow-hidden p-3 rounded-none bg-transparent backdrop-blur-md border border-primary/40 text-primary shadow-[0_0_0_1px_rgba(255,0,0,0.12)] hover:border-primary hover:text-amber-300 hover:shadow-[0_0_18px_rgba(255,0,0,0.35)] transition-all duration-500 before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-primary/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition before:duration-700"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <span aria-hidden className="noise-tv absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-60" />
              <Instagram size={24} />
            </motion.a>
            <motion.a
              href="https://youtube.com"
              initial={{ opacity: 0, scale: 0 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.7 }}
              whileHover={{ scale: 1.2, rotate: 10 }}
              whileTap={{ scale: 0.95 }}
            className="group relative overflow-hidden p-3 rounded-none bg-transparent backdrop-blur-md border border-primary/40 text-primary shadow-[0_0_0_1px_rgba(255,0,0,0.12)] hover:border-primary hover:text-amber-300 hover:shadow-[0_0_18px_rgba(255,0,0,0.35)] transition-all duration-500 before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-primary/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition before:duration-700"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
            >
              <span aria-hidden className="noise-tv absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-60" />
              <Youtube size={24} />
            </motion.a>
          </div>
        </motion.div>
        {/* Párrafo centrado debajo del bloque de iconos */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-10 max-w-2xl mx-auto text-center"
        >
          <p
            ref={introRef}
            onClick={handleIntroClick}
            className="text-orange-600 dark:text-gray-300 font-lincolnmitre leading-[1.1] cursor-pointer"
          >
            {t(language, 'contact.intro')}
          </p>
        </motion.div>
        {/* Bloque de "Visítanos" con íconos eliminado; los íconos se subieron arriba */}
      </div>
    </section>
  );
};

export default ContactSection;
