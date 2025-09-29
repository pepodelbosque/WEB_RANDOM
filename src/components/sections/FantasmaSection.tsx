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
    {
      id: 3,
      title: t(language, 'fantasma.projects.convergence.title'),
      description: t(language, 'fantasma.projects.convergence.description'),
      image: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=800',
      gradient: 'from-green-600 via-blue-600 to-purple-600',
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 100, rotateX: -15 }}
              animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ duration: 1, delay: index * 0.3 }}
              whileHover={{ 
                y: -20,
                rotateY: 10,
                scale: 1.05,
              }}
              className="group relative bg-white/5 dark:bg-black/10 backdrop-blur-lg rounded-3xl overflow-hidden border border-white/10 hover:border-primary/30 transition-all duration-700"
            >
              {/* Image Container */}
              <div className="relative h-80 overflow-hidden">
                <motion.img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-120 transition-transform duration-1000"
                  whileHover={{ scale: 1.2 }}
                />
                
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${project.gradient} opacity-0 group-hover:opacity-60 transition-opacity duration-500`} />
                
                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center space-x-4"
                >
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 2 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="p-2 rounded-none bg-red-600/20 backdrop-blur-sm border border-orange-800 text-red-600 hover:text-orange-500 hover:bg-orange-500/20 transition-all duration-200"
                  >
                    <Eye size={24} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: -2 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="p-2 rounded-none bg-red-600/20 backdrop-blur-sm border border-orange-800 text-red-600 hover:text-orange-500 hover:bg-orange-500/20 transition-all duration-200"
                  >
                    <Play size={24} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 2 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="p-2 rounded-none bg-red-600/20 backdrop-blur-sm border border-orange-800 text-red-600 hover:text-orange-500 hover:bg-orange-500/20 transition-all duration-200"
                  >
                    <Maximize size={24} />
                  </motion.button>
                </motion.div>

                {/* Title Reveal */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent"
                >
                  <h3 className="text-2xl font-bold font-lincolnmitre text-white mb-2">
                    {project.title}
                  </h3>
                  <p className="text-white/80 font-lincolnmitre text-sm leading-relaxed">
                    {project.description}
                  </p>
                </motion.div>
              </div>

              {/* Decorative Elements */}
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 15, repeat: Infinity }}
                className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full opacity-60"
              />
              
              <motion.div
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute bottom-4 left-4 w-3 h-3 bg-primary rounded-full opacity-40"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FantasmaSection;