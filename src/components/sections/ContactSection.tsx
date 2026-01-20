import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Mail, MessageCircle, Instagram, Youtube, Phone, Send, Paperclip, Camera, Share, Link as LinkIcon, Globe, Wifi, Radio, Activity, Bell, Skull, Banana, Gem, Apple, Cherry, Cake, Candy, CandyCane, Carrot, Cat, Bird, Bone, Bomb, Beer, Bike, Anchor, Rocket, Umbrella, Cloud, Sun, Moon, Star, Flame, Heart, Music, Car, Coffee, Crown, Leaf, Flower, Fish, Aperture, Award, Gift, Ghost } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { t } from '../../utils/translations';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MirloStrip from '../MirloStrip';

const ContactSection: React.FC = () => {
  const { language } = useLanguage();
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  const [introObserveRef, introIsInView] = useInView({
    threshold: 0.3,
    triggerOnce: false,
  });
  const [overlayObserveRef, overlayInView] = useInView({
    threshold: 0.2,
    triggerOnce: false,
  });
  const sectionRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const introRef = useRef<HTMLParagraphElement | null>(null);
  const [isPortrait, setIsPortrait] = useState(false);
  const [birdProgress, setBirdProgress] = useState(0);
  const [birdAutoPlay, setBirdAutoPlay] = useState(false);
  const handleRef = (el: HTMLElement | null) => {
    ref(el);
    sectionRef.current = el;
  };

  // Variants para entrada sutil con zoom + fade en iconos
  const iconContainerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.15 },
    },
  } as const;

  const iconItemVariants = {
    initial: { opacity: 0, scale: 0.92 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: 'easeOut' } },
  } as const;

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

  // Progreso de scroll para animar el pájaro (0–100 dentro de la sección)
  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const top = el.offsetTop;
      const height = Math.max(el.offsetHeight, 1);
      const y = window.scrollY;
      const p = Math.min(Math.max((y - top) / height, 0), 1);
      setBirdProgress(Math.round(p * 100));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Auto-play del mirlo: 15s al entrar específicamente al bloque "Conectemos"
  useEffect(() => {
    if (!introIsInView) return;
    setBirdAutoPlay(true);
    const t = setTimeout(() => setBirdAutoPlay(false), 15000);
    return () => clearTimeout(t);
  }, [introIsInView]);

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

    const config = { appearPreRoll: 1.2, appearMove: 1.4, settle: 5.2, disappear: 1.6, ease: 'power3.inOut' } as const;
    const scrambleState = { p: 0 };

    const introTL = gsap.timeline({ paused: true });
    gsap.set(el, { opacity: 0, y: -40 });
    introTL
      .to(scrambleState, { p: 0.35, duration: config.appearPreRoll, ease: config.ease, onUpdate: () => setScrambledText(scrambleState.p) })
      .to(scrambleState, { p: 0.92, duration: config.appearMove, ease: config.ease, onUpdate: () => setScrambledText(scrambleState.p) }, 0)
      .to(el, { opacity: 1, y: 0, duration: config.appearMove, ease: config.ease }, 0)
      .to(scrambleState, { p: 1, duration: config.settle, ease: config.ease, onUpdate: () => setScrambledText(scrambleState.p) });

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top 75%',
      end: 'bottom 25%',
      onEnter: () => {
        gsap.set(el, { opacity: 0, y: -40 });
        scrambleState.p = 0;
        setScrambledText(0);
        introTL.play(0);
      },
      onEnterBack: () => {
        gsap.set(el, { opacity: 0, y: -40 });
        scrambleState.p = 0;
        setScrambledText(0);
        introTL.play(0);
      },
    });

    return () => {
      st.kill();
      introTL.kill();
    };
  }, [language]);

  useEffect(() => {
    const updateOrientation = () => {
      const mp = window.matchMedia('(orientation: portrait)');
      setIsPortrait(mp.matches);
    };
    updateOrientation();
    window.addEventListener('resize', updateOrientation);
    window.addEventListener('orientationchange', updateOrientation);
    return () => {
      window.removeEventListener('resize', updateOrientation);
      window.removeEventListener('orientationchange', updateOrientation);
    };
  }, []);

  const descriptionRef = useRef<HTMLParagraphElement | null>(null);

  // Efecto de Glitch Perpetuo (Hard Scramble)
  useEffect(() => {
    const element = descriptionRef.current;
    if (!element) return;

    // Guardar texto original si no está guardado
    const originalText = t(language, 'contact.description');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*+?';
    
    // Función para generar texto glitcheado (mayoría caracteres random)
    const generateGlitchText = () => {
      // 80% de probabilidad de carácter random, 20% original
      return originalText
        .split('')
        .map(char => {
          if (/\s/.test(char)) return char;
          return Math.random() > 0.2 ? chars[Math.floor(Math.random() * chars.length)] : char;
        })
        .join('');
    };

    // Timeline infinito de glitch
    const glitchTl = gsap.timeline({ repeat: -1 });
    
    // Actualizar texto cada 50ms-150ms
    glitchTl.to({}, {
      duration: 0.08,
      repeat: -1,
      onRepeat: () => {
        // Solo aplicar si no estamos mostrando el mensaje de "copiado"
        if (isCopiedRef.current) return;
        
        element.textContent = generateGlitchText();
      }
    });

    return () => {
      glitchTl.kill();
    };
  }, [language]);

  const isCopiedRef = useRef(false);

  const scrambleTo = (element: HTMLElement, newText: string) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*+?';
    
    // Configurar índices y orden de revelado para el nuevo texto
    const indices = Array.from(newText)
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
      const out = newText
        .split('')
        .map((c, i) => {
          if (/\s/.test(c)) return c;
          const rank = rankMap.get(i) ?? 0;
          return rank < threshold ? c : chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');
      element.textContent = out;
    };

    gsap.killTweensOf(state); // Detener animación previa si existe
    gsap.to(state, {
      p: 1,
      duration: 1.2,
      ease: 'power2.out',
      onUpdate: () => setScrambledText(state.p),
      onComplete: () => {
        element.textContent = newText;
      },
    });
  };

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
  <section id="contact" ref={handleRef} className="pt-0 pb-0 relative mb-0 -mt-12 md:-mt-16 scroll-mt-24 md:scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={(node) => { contentRef.current = node; overlayObserveRef(node); }}
          className="relative"
          style={
            isPortrait
              ? undefined
              : ({
                  ['--contact-frame-left' as any]: '20%',
                  ['--contact-frame-right' as any]: '20%',
                  ['--contact-frame-top' as any]: 'clamp(4px, 1vw, 12px)',
                  ['--contact-frame-bottom' as any]: 'clamp(4px, 1vw, 12px)',
                  marginLeft: 'var(--contact-frame-left)',
                  marginRight: 'var(--contact-frame-right)',
                  marginTop: 'var(--contact-frame-top)',
                  marginBottom: 'var(--contact-frame-bottom)',
                } as React.CSSProperties)
          }
        >
          {!isPortrait && (
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={overlayInView ? { opacity: 1, scale: 1, boxShadow: '0 0 18px rgba(165,0,0,0.35)', scaleY: 1.1, y: '-10%' } : { opacity: 0, scale: 0.94, boxShadow: '0 0 0 rgba(165,0,0,0)', y: '-10%' }}
              transition={{ duration: 1.8, ease: 'easeInOut' }}
              className="pointer-events-none"
              style={{ position: 'absolute', top: 'var(--contact-frame-top)', bottom: 'var(--contact-frame-bottom)', left: '5%', right: '5%', border: '2px solid rgba(165,0,0,0.7)', zIndex: 5, transformOrigin: 'center' }}
            />
          )}
          <div className="contact-inner" style={isPortrait ? undefined : ({ paddingLeft: '12%', paddingRight: '12%' } as React.CSSProperties)}>
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
            <p 
              ref={descriptionRef}
              className="split text-[1.0em] font-lincolnmitre text-orange-600 dark:text-gray-300 leading-[1.3] text-center" 
              style={{ maxWidth: '100%', hyphens: 'auto', wordBreak: 'break-word', whiteSpace: 'pre-line' }}
            >
             {t(language, 'contact.description')}
            </p>
          </div>
        </motion.div>

        {/* Iconos centrados alineados con el título */}
        <motion.div
          variants={iconContainerVariants}
          initial="initial"
          animate={inView ? 'animate' : 'initial'}
          className="mb-6"
        >
          <div className="flex flex-wrap items-center justify-center gap-4 max-w-3xl mx-auto dotted-icons">
            <motion.a
              href="mailto:fntsm.cine@gmail.com"
              onClick={(e) => {
                e.preventDefault();
                navigator.clipboard.writeText('fntsm.cine@gmail.com');
                
                if (descriptionRef.current) {
                  isCopiedRef.current = true;
                  // Iniciar efecto pulsante (colores de la paleta: primary/secondary)
                  gsap.to(descriptionRef.current, {
                    color: '#ef4444', // Red-500 (Primary)
                    duration: 0.1, 
                    repeat: -1,
                    yoyo: true,
                    ease: "steps(1)", 
                    startAt: { color: '#7f1d1d' } // Red-900 (Dark Red - alto contraste sin usar blanco)
                  });

                  scrambleTo(descriptionRef.current, "correo copiado\nen tu clipboard\nFNTSM.CINE@GMAIL.COM");
                  
                  setTimeout(() => {
                    if (descriptionRef.current) {
                      // Detener efecto pulsante y restaurar color
                      gsap.killTweensOf(descriptionRef.current, "color");
                      gsap.to(descriptionRef.current, {
                        color: "inherit", // O limpiar el estilo inline
                        duration: 0.5,
                        onComplete: () => {
                          if (descriptionRef.current) descriptionRef.current.style.color = "";
                          isCopiedRef.current = false;
                        }
                      });
                      
                      scrambleTo(descriptionRef.current, t(language, 'contact.description'));
                    }
                  }, 7000);
                }
              }}
              variants={iconItemVariants}
              whileHover={{ scale: 1.2, rotate: 10 }}
              whileTap={{ scale: 0.95 }}
            className="group relative overflow-hidden p-3 rounded-none bg-transparent backdrop-blur-md border border-primary/40 text-primary shadow-[0_0_0_1px_rgba(255,0,0,0.12)] hover:border-primary hover:text-amber-300 hover:shadow-[0_0_18px_rgba(255,0,0,0.35)] transition-all duration-500 before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-primary/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition before:duration-700"
              aria-label="Correo"
            >
              <span aria-hidden className="noise-tv absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-60" />
              <ScrambleIcon Original={Heart} HoverIcon={Mail} size={24} exclude={[MessageCircle, Instagram, Youtube]} startDelay={0} />
            </motion.a>
            <motion.a
              href="https://wa.me/15551234567"
              variants={iconItemVariants}
              whileHover={{ scale: 1.2, rotate: 10 }}
              whileTap={{ scale: 0.95 }}
            className="group relative overflow-hidden p-3 rounded-none bg-transparent backdrop-blur-md border border-primary/40 text-primary shadow-[0_0_0_1px_rgba(255,0,0,0.12)] hover:border-primary hover:text-amber-300 hover:shadow-[0_0_18px_rgba(255,0,0,0.35)] transition-all duration-500 before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-primary/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition before:duration-700"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
            >
              <span aria-hidden className="noise-tv absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-60" />
              <ScrambleIcon Original={Bird} HoverIcon={MessageCircle} size={24} exclude={[Mail, Instagram, Youtube]} startDelay={800} />
            </motion.a>
            <motion.a
              href="https://instagram.com/fntsm.random"
              variants={iconItemVariants}
              whileHover={{ scale: 1.2, rotate: 10 }}
              whileTap={{ scale: 0.95 }}
            className="group relative overflow-hidden p-3 rounded-none bg-transparent backdrop-blur-md border border-primary/40 text-primary shadow-[0_0_0_1px_rgba(255,0,0,0.12)] hover:border-primary hover:text-amber-300 hover:shadow-[0_0_18px_rgba(255,0,0,0.35)] transition-all duration-500 before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-primary/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition before:duration-700"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <span aria-hidden className="noise-tv absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-60" />
              <ScrambleIcon Original={Skull} HoverIcon={Instagram} size={24} exclude={[Mail, MessageCircle, Youtube]} startDelay={1600} />
            </motion.a>
            <motion.a
              href="https://www.youtube.com/@fantasmafntsm5585/posts"
              variants={iconItemVariants}
              whileHover={{ scale: 1.2, rotate: 10 }}
              whileTap={{ scale: 0.95 }}
            className="group relative overflow-hidden p-3 rounded-none bg-transparent backdrop-blur-md border border-primary/40 text-primary shadow-[0_0_0_1px_rgba(255,0,0,0.12)] hover:border-primary hover:text-amber-300 hover:shadow-[0_0_18px_rgba(255,0,0,0.35)] transition-all duration-500 before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-primary/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition before:duration-700"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
            >
              <span aria-hidden className="noise-tv absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-60" />
              <ScrambleIcon Original={Ghost} HoverIcon={Youtube} size={24} exclude={[Mail, MessageCircle, Instagram]} startDelay={2400} />
            </motion.a>
          </div>
        </motion.div>
        {/* Párrafo centrado debajo del bloque de iconos */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-10 text-center"
        >
          <p
            ref={(node) => {
              introRef.current = node;
              introObserveRef(node);
            }}
            onClick={handleIntroClick}
            className="text-orange-600 dark:text-gray-300 font-lincolnmitre leading-[1.1] cursor-pointer"
            style={{ maxWidth: '100%', hyphens: 'auto', wordBreak: 'break-word', whiteSpace: 'normal' }}
          >
            {t(language, 'contact.intro')}
          </p>
        </motion.div>
        {/* Secuencia 2D del mirlo: auto-play 5s al entrar, luego reactivo al mouse */}
        <div
          className="-mt-[3.75rem] mb-[3rem] flex justify-center cursor-pointer"
          onClick={handleIntroClick}
          role="button"
          aria-label="Activar conversión de texto en Conectemos"
        >
          <MirloStrip progress={birdProgress} autoPlay={birdAutoPlay} />
          </div>
        </div>
        {/* Bloque de "Visítanos" con íconos eliminado; los íconos se subieron arriba */}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
  const ScrambleIcon: React.FC<{ Original: any; HoverIcon?: any; size?: number; exclude?: any[]; startDelay?: number } > = ({ Original, HoverIcon, size = 24, exclude = [], startDelay = 0 }) => {
    const [useMotionReduced] = useState(() => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const [mode, setMode] = useState<'scramble' | 'original'>('scramble');
    const [IconComp, setIconComp] = useState<any>(Original);
    const pool = [
      Phone, Send, Paperclip, Camera, Share, LinkIcon, Globe, Wifi, Radio, Activity, Bell,
      Skull, Banana, Gem, Apple, Cherry, Cake, Candy, CandyCane, Carrot, Cat, Bird, Bone, Bomb, Beer, Bike,
      Anchor, Rocket, Umbrella, Cloud, Sun, Moon, Star, Flame, Heart, Music, Car, Coffee, Crown, Leaf, Flower,
      Fish, Aperture, Award, Gift, Ghost
    ].filter((ic) => {
      return ic !== Original && !exclude.includes(ic);
    });
    const tickRef = useRef<number | null>(null);
    const phaseRef = useRef<'scramble' | 'original'>('scramble');
    const idxRef = useRef<number>(-1);

    useEffect(() => {
      if (useMotionReduced) {
        setMode('original');
        setIconComp(Original);
        return;
      }

      const SCRAMBLE_MS = 3000;
      const ORIGINAL_MS = 4000;
      const STEP_MS = Math.max(Math.floor(SCRAMBLE_MS / 50), 50);

      const pickNext = () => {
        if (!pool.length) {
          setIconComp(Original);
          return;
        }
        let next = Math.floor(Math.random() * pool.length);
        if (next === idxRef.current) {
          next = (next + 1) % pool.length;
        }
        idxRef.current = next;
        setIconComp(pool[next]);
      };

      const startScramble = () => {
        phaseRef.current = 'scramble';
        setMode('scramble');
        pickNext();
        const endAt = Date.now() + SCRAMBLE_MS;
        const step = () => {
          if (Date.now() < endAt) {
            pickNext();
            tickRef.current = window.setTimeout(step, STEP_MS);
          } else {
            startOriginal();
          }
        };
        tickRef.current = window.setTimeout(step, STEP_MS);
      };

      const startOriginal = () => {
        phaseRef.current = 'original';
        setMode('original');
        setIconComp(Original);
        tickRef.current = window.setTimeout(() => {
          startScramble();
        }, ORIGINAL_MS);
      };

      const delay = Math.max(0, startDelay);
      tickRef.current = window.setTimeout(() => {
        startScramble();
      }, delay);
      return () => {
        if (tickRef.current !== null) {
          clearTimeout(tickRef.current);
          tickRef.current = null;
        }
      };
    }, [Original, useMotionReduced]);

    const Current = IconComp;
    return (
      <span className="relative inline-grid" style={{ placeItems: 'center' }}>
        <span className={`transition-opacity duration-200 ${mode === 'scramble' ? 'opacity-100' : 'opacity-0'} group-hover:opacity-0`}>
          <Current size={size} />
        </span>
        <span className={`absolute inset-0 transition-opacity duration-200 ${mode === 'original' ? 'opacity-100' : 'opacity-0'} group-hover:opacity-0`} style={{ display: 'grid', placeItems: 'center' }}>
          <Original size={size} />
        </span>
        {HoverIcon ? (
          <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ display: 'grid', placeItems: 'center' }}>
            <HoverIcon size={size} />
          </span>
        ) : null}
      </span>
    );
  };
