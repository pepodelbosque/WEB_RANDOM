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
          <p className="text-base md:text-lg font-lincolnmitre text-orange-600 dark:text-gray-300 max-w-3xl mx-auto text-left">
            {t(language, 'services.description')}
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {crew.map((member, index) => (
            <motion.div
              key={member.nameKey}
              initial={{ opacity: 0, y: 100, rotateY: -15 }}
              animate={
                inView
                  ? { opacity: 1, y: 0, rotateY: 0 }
                  : { opacity: 1, y: 0, rotateY: 0 }
              }
              transition={{ duration: 1, delay: index * 0.15 }}
              whileHover={{ y: -8, rotateY: 4, scale: 1.01 }}
              className="group relative aspect-square max-w-xs w-full rounded-none border border-white/10 bg-white/5 dark:bg-black/10 hover:border-primary/30 transition-all duration-300 overflow-hidden"
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
                      animate={
                        inView
                          ? { opacity: 1, scale: 1 }
                          : { opacity: 1, scale: 1 }
                      }
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
        </div>
      </div>
    </section>
  );
}

export default ServicesSection;