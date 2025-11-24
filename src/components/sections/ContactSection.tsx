import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Mail, Phone, MapPin, Send, Github, Linkedin, Twitter } from 'lucide-react';
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
  const handleRef = (el: HTMLElement | null) => {
    ref(el);
    sectionRef.current = el;
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Form submitted:', formData);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: Mail,
      label: t(language, 'contact.contactInfo.email'),
      value: 'hello@random.dev',
      href: 'mailto:hello@random.dev',
    },
    {
      icon: Phone,
      label: t(language, 'contact.contactInfo.phone'),
      value: '+1 (555) 123-4567',
      href: 'tel:+15551234567',
    },
    {
      icon: MapPin,
      label: t(language, 'contact.contactInfo.location'),
      value: 'San Francisco, CA',
      href: '#',
    },
  ];

  const socialLinks = [
    { icon: Github, href: 'https://github.com', label: 'GitHub' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
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

  return (
    <section id="contact" ref={handleRef} className="min-h-screen py-20 relative mb-24 md:mb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl font-bold font-lincolnmitre text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-6">
           {t(language, 'contact.title')}
          </h2>
          <div className="split-container">
            <p className="split text-[1.0em] font-lincolnmitre text-orange-600 dark:text-gray-300 max-w-3xl mx-auto leading-[1.3] text-justify">
             {t(language, 'contact.description')}
            </p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-3xl font-bold font-lincolnmitre text-orange-800 dark:text-white mb-6">
                {t(language, 'contact.getInTouch')}
              </h3>
              <p className="text-orange-600 dark:text-gray-300 font-lincolnmitre leading-relaxed mb-8">
                {t(language, 'contact.intro')}
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <motion.a
                  key={info.label}
                  href={info.href}
                  initial={{ opacity: 0, x: -50 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 10 }}
                  className="flex items-center space-x-4 p-4 bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-2xl border border-white/20 hover:border-primary/50 transition-all duration-300"
                >
                  <motion.div 
                    className="p-2 rounded-none bg-red-600/20 backdrop-blur-sm border border-orange-800"
                    whileHover={{ scale: 1.1, rotate: 2 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <info.icon size={24} className="text-red-600" />
                  </motion.div>
                  <div>
                    <div className="text-sm font-lincolnmitre text-gray-600 dark:text-gray-400">
                      {info.label}
                    </div>
                    <div className="font-lincolnmitre text-gray-800 dark:text-white">
                      {info.value}
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.8 }}
              className="pt-8"
            >
              <h4 className="text-xl font-bold font-lincolnmitre text-gray-800 dark:text-white mb-6">
                {t(language, 'contact.followMe')}
              </h4>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 rounded-none bg-red-600/20 backdrop-blur-sm border border-orange-800 text-red-600 hover:bg-gradient-to-r hover:from-red-600 hover:via-orange-500 hover:to-yellow-500 hover:text-white hover:shadow-lg transition-all duration-300"
                  >
                    <social.icon size={24} />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  <label htmlFor="name" className="block text-sm font-lincolnmitre text-orange-700 dark:text-gray-300 mb-2">
                   {t(language, 'contact.form.name')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 dark:bg-black/20 backdrop-blur-lg border border-white/20 rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300 font-lincolnmitre text-orange-800 dark:text-white placeholder-orange-500 dark:placeholder-gray-500"
                   placeholder={t(language, 'contact.form.namePlaceholder')}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <label htmlFor="email" className="block text-sm font-lincolnmitre text-orange-700 dark:text-gray-300 mb-2">
                   {t(language, 'contact.form.email')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 dark:bg-black/20 backdrop-blur-lg border border-white/20 rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300 font-lincolnmitre text-orange-800 dark:text-white placeholder-orange-500 dark:placeholder-gray-500"
                   placeholder={t(language, 'contact.form.emailPlaceholder')}
                  />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                <label htmlFor="subject" className="block text-sm font-lincolnmitre text-orange-700 dark:text-gray-300 mb-2">
                 {t(language, 'contact.form.subject')}
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 dark:bg-black/20 backdrop-blur-lg border border-white/20 rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300 font-lincolnmitre text-orange-800 dark:text-white placeholder-orange-500 dark:placeholder-gray-500"
                 placeholder={t(language, 'contact.form.subjectPlaceholder')}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <label htmlFor="message" className="block text-sm font-lincolnmitre text-orange-700 dark:text-gray-300 mb-2">
                 {t(language, 'contact.form.message')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-white/10 dark:bg-black/20 backdrop-blur-lg border border-white/20 rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300 font-lincolnmitre text-orange-800 dark:text-white placeholder-orange-500 dark:placeholder-gray-500 resize-none"
                 placeholder={t(language, 'contact.form.messagePlaceholder')}
                />
              </motion.div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.9 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-8 py-4 rounded-none bg-red-600/20 backdrop-blur-sm border border-orange-800 text-red-600 font-lincolnmitre hover:bg-gradient-to-r hover:from-red-600 hover:via-orange-500 hover:to-yellow-500 hover:text-white hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                {isSubmitting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    <span>{t(language, 'contact.form.sendMessage')}</span>
                    <Send size={20} />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
