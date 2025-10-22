import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Eye, Play, Maximize } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { t } from '../../utils/translations';

const FantasmaSection: React.FC = () => {
  const { language } = useLanguage();
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const projects = [
    {
      id: 1,
      title: t(language, 'fantasma.projects.dreamscape.title'),
      description: t(language, 'fantasma.projects.dreamscape.description'),
      image: 'https://images.pexels.com/photos/1089438/pexels-photo-1089438.jpeg?auto=compress&cs=tinysrgb&w=800',
      gradient: 'from-purple-600 via-pink-600 to-red-600',
    },
    {
      id: 2,
      title: t(language, 'fantasma.projects.chaos.title'),
      description: t(language, 'fantasma.projects.chaos.description'),
      image: 'https://images.pexels.com/photos/2832382/pexels-photo-2832382.jpeg?auto=compress&cs=tinysrgb&w=800',
      gradient: 'from-blue-600 via-purple-600 to-pink-600',
    },
  ];

  return (
    <section id="fantasma" ref={ref} className="min-h-screen py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="text-center mb-20"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex justify-center mb-0 px-4"
          >
            <img 
              src="/images/logo-fntsm.png" 
              alt="FNTSM Logo"
              className="h-18 sm:h-18 md:h-24 lg:h-24 xl:h-30 w-auto object-contain"
            />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-sm sm:text-sm md:text-base lg:text-base xl:text-lg font-bold font-lincolnmitre text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary uppercase tracking-wider mb-6 px-4 max-w-full overflow-hidden opacity-50"
            style={{ fontVariant: 'small-caps', wordBreak: 'break-word' }}
          >
            {t(language, 'fantasma.title')}
          </motion.h2>
          <p className="text-lg sm:text-xl font-lincolnmitre text-orange-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
            {t(language, 'fantasma.description')}
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <div className="mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-3xl">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 100, rotateX: -15 }}
              animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ duration: 1, delay: index * 0.3 }}
              whileHover={{ y: -8, rotateY: 4, scale: 1.01 }}
              className="group relative aspect-square rounded-none border border-white/10 bg-white/5 dark:bg-black/10 hover:border-primary/30 transition-all duration-700 overflow-hidden"
            >
              {/* Background image fills square */}
              <motion.img
                src={project.image}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover"
                whileHover={{ scale: 1.06 }}
                transition={{ duration: 0.8 }}
              />

              {/* Soft gradient wash like Portfolio */}
              <div className={`absolute inset-0 bg-gradient-to-t ${project.gradient} opacity-20 group-hover:opacity-35 transition-opacity duration-300`} />

              {/* Top-right action icons (compact) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                className="absolute top-2 right-2 flex items-center gap-1 z-10"
              >
                <motion.button className="p-1 rounded-none bg-red-600/15 backdrop-blur-sm border border-orange-800 text-red-600 hover:text-orange-500 hover:bg-orange-500/15 transition-all duration-200">
                  <Eye size={12} />
                </motion.button>
                <motion.button className="p-1 rounded-none bg-red-600/15 backdrop-blur-sm border border-orange-800 text-red-600 hover:text-orange-500 hover:bg-orange-500/15 transition-all duration-200">
                  <Play size={12} />
                </motion.button>
                <motion.button className="p-1 rounded-none bg-red-600/15 backdrop-blur-sm border border-orange-800 text-red-600 hover:text-orange-500 hover:bg-orange-500/15 transition-all duration-200">
                  <Maximize size={12} />
                </motion.button>
              </motion.div>

              {/* Bottom overlay band (Portfolio style) */}
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/35 backdrop-blur-sm">
                <h3 className="text-sm font-black font-lincolnmitre text-orange-400 dark:text-orange-300 mb-1">
                  {project.title}
                </h3>
                <p className="text-sm font-extrabold font-lincolnmitre text-orange-400 dark:text-orange-300 mb-2 leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Decorative square (matches square style) */}
              <motion.div
                animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
                transition={{ duration: 10, repeat: Infinity }}
                className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-primary to-secondary rounded-none opacity-50"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FantasmaSection;