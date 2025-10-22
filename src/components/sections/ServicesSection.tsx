import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Code2, Palette, Smartphone, Zap, Globe, Users } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { t } from '../../utils/translations';

const ServicesSection: React.FC = () => {
  const { language } = useLanguage();
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
    fallbackInView: true
  });

  const services = [
    {
      icon: Code2,
      title: t(language, 'services.webDevelopment.title'),
      description: t(language, 'services.webDevelopment.description'),
      features: t(language, 'services.webDevelopment.features') as unknown as string[],
      color: 'from-primary to-secondary',
    },
    {
      icon: Palette,
      title: t(language, 'services.uiuxDesign.title'),
      description: t(language, 'services.uiuxDesign.description'),
      features: t(language, 'services.uiuxDesign.features') as unknown as string[],
      color: 'from-secondary to-primary',
    },
    {
      icon: Smartphone,
      title: t(language, 'services.mobileDevelopment.title'),
      description: t(language, 'services.mobileDevelopment.description'),
      features: t(language, 'services.mobileDevelopment.features') as unknown as string[],
      color: 'from-primary via-secondary to-accent',
    },
    {
      icon: Zap,
      title: t(language, 'services.performanceOptimization.title'),
      description: t(language, 'services.performanceOptimization.description'),
      features: t(language, 'services.performanceOptimization.features') as unknown as string[],
      color: 'from-secondary to-accent',
    },
    {
      icon: Globe,
      title: t(language, 'services.seoAnalytics.title'),
      description: t(language, 'services.seoAnalytics.description'),
      features: t(language, 'services.seoAnalytics.features') as unknown as string[],
      color: 'from-accent to-primary',
    },
    {
      icon: Users,
      title: t(language, 'services.consultation.title'),
      description: t(language, 'services.consultation.description'),
      features: t(language, 'services.consultation.features') as unknown as string[],
      color: 'from-primary to-accent',
    },
  ];

  // Crew data for biographic cards (uses images from /public/images)
  const crew = [
    {
      name: "Alex Rivera",
      role: "Director Creativo",
      image: "/images/tuto02.jpg",
      bio: "Explora narrativas visuales y experiencias inmersivas para RANDOM.",
      skills: ["Arte", "Video", "Instalación"],
    },
    {
      name: "Morgan Lee",
      role: "Diseñador",
      image: "/images/tuto04.jpeg",
      bio: "Diseño gráfico y UI centrados en identidad y ritmo visual.",
      skills: ["UI", "Gráfica", "Tipografía"],
    },
    {
      name: "Sam Ortiz",
      role: "Productor",
      image: "/images/tuto01a.jpeg",
      bio: "Producción y coordinación de proyectos experimentales del colectivo.",
      skills: ["Producción", "Gestión", "Calendario"],
    },
    {
      name: "Erika Gómez",
      role: "Curadora",
      image: "/images/tuto1.png",
      bio: "Investiga y articula piezas con foco en contexto y discurso.",
      skills: ["Curaduría", "Investigación", "Arquitectura"],
    },
    {
      name: "Diego Torres",
      role: "Fotógrafo",
      image: "/images/tuto02.jpg",
      bio: "Documenta procesos y obra con estética cruda y precisa.",
      skills: ["Foto", "Color", "Post"],
    },
    {
      name: "Luna Park",
      role: "Editora de Video",
      image: "/images/tuto04.jpeg",
      bio: "Montaje y ritmo audiovisual para piezas e instalaciones.",
      skills: ["Edición", "Narrativa", "Motion"],
    },
    {
      name: "Raúl Méndez",
      role: "Sonidista",
      image: "/images/tuto01a.jpeg",
      bio: "Diseño sonoro y ambiente para experiencias inmersivas.",
      skills: ["Audio", "Foley", "Mezcla"],
    },
    {
      name: "Nora Kim",
      role: "Programadora",
      image: "/images/tuto1.png",
      bio: "Desarrolla herramientas interactivas y visuales generativas.",
      skills: ["Web", "Interactive", "Livecoding"],
    },
    {
      name: "Iker Silva",
      role: "Investigador",
      image: "/images/tuto02.jpg",
      bio: "Analiza procesos y metodologías del colectivo para iterar.",
      skills: ["Análisis", "Escritura", "Archivos"],
    },
  ];

  return (
    <section id="services" ref={ref} className="min-h-screen py-20 relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-lincolnmitre text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-6">
            {t(language, 'services.title')}
          </h2>
          <p className="text-base md:text-lg font-lincolnmitre text-orange-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t(language, 'services.description')}
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {crew.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 100, rotateY: -15 }}
              animate={
                inView
                  ? { opacity: 1, y: 0, rotateY: 0 }
                  : { opacity: 1, y: 0, rotateY: 0 }
              }
              transition={{ duration: 1, delay: index * 0.15 }}
              whileHover={{ y: -8, rotateY: 4, scale: 1.01 }}
              className="group relative aspect-square rounded-none border border-white/10 bg-white/5 dark:bg-black/10 hover:border-primary/30 transition-all duration-300 overflow-hidden"
            >
              {/* Background photo fills the square (crew portrait) */}
              <img
                src={member.image}
                alt={member.name}
                className="absolute inset-0 w-full h-full object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
  
              {/* Bottom overlay band (name, role, bio, skills) */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/35 backdrop-blur-sm">
                <h3 className="text-sm font-black font-lincolnmitre text-orange-400 dark:text-orange-300 mb-1">
                  {member.name}
                </h3>
                <p className="text-xs font-extrabold font-lincolnmitre text-orange-400 dark:text-orange-300 mb-1 leading-tight">
                  {member.role}
                </p>
                <p className="text-[11px] font-extrabold font-lincolnmitre text-orange-400 dark:text-orange-300 mb-2 leading-tight">
                  {member.bio}
                </p>
  
                <div className="flex flex-wrap gap-1.5">
                  {member.skills.map((skill, skillIndex) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={
                        inView
                          ? { opacity: 1, scale: 1 }
                          : { opacity: 1, scale: 1 }
                      }
                      transition={{
                        delay: index * 0.15 + skillIndex * 0.1 + 0.4,
                      }}
                      className="px-2 py-[2px] bg-gradient-to-r from-primary/15 to-secondary/15 text-[10px] font-lincolnmitre rounded-none border border-primary/20 text-orange-400 dark:text-orange-300 font-extrabold"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ServicesSection;