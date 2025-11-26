import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useLanguage } from '../../hooks/useLanguage';
import { t } from '../../utils/translations';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const ServicesSection: React.FC = () => {
  const { language } = useLanguage();
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: false,
    fallbackInView: true
  });
  const sectionRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
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
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.01 }}
          transition={{ duration: 1 }}
          className="text-left mb-24 md:mb-28"
        >
          <motion.h2
            className="text-[2.7rem] font-bold font-lincolnmitre text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-4 max-w-2xl"
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

        {/* Services Grid */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0 }}
          transition={{ duration: 1, delay: 0.1 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-[0.25ch] gap-y-6 justify-items-center"
        >
          {crew.map((member, index) => (
            <motion.div
              key={member.nameKey}
              initial={{ opacity: 0, y: 100, rotateY: -15 }}
              animate={{ opacity: 1, y: 0, rotateY: 0 }}
              transition={{ duration: 1, delay: index * 0.15 }}
              whileHover={{ y: -8, rotateY: 4, scale: 1.01 }}
              className="group relative aspect-square max-w-xs w-[80%] md:w-full mx-auto justify-self-center rounded-none border border-white/10 bg-white/5 dark:bg-black/10 hover:border-primary/30 transition-all duration-300 overflow-hidden"
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
                  {member.skills.map((skill, skillIndex) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        delay: index * 0.15 + skillIndex * 0.1 + 0.4,
                      }}
                      className="px-2 py-[2px] bg-gradient-to-r from-primary/15 to-secondary/15 text-[10px] font-lincolnmitre rounded-none border border-primary/20 text-orange-400/70 dark:text-orange-300/70 font-extrabold"
                    >
                      {t(language, skill)}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default ServicesSection;
