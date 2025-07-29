import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ExternalLink, Github, Eye } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { t } from '../../utils/translations';

const PortfolioSection: React.FC = () => {
  const { language } = useLanguage();
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const projects = [
    {
      id: 1,
      title: t(language, 'portfolio.projects.organicEcommerce.title'),
      description: t(language, 'portfolio.projects.organicEcommerce.description'),
      image: 'https://images.pexels.com/photos/3584967/pexels-photo-3584967.jpeg?auto=compress&cs=tinysrgb&w=800',
      tech: ['React', 'Node.js', 'MongoDB'],
      gradient: 'from-primary to-secondary',
    },
    {
      id: 2,
      title: t(language, 'portfolio.projects.motionStudio.title'),
      description: t(language, 'portfolio.projects.motionStudio.description'),
      image: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=800',
      tech: ['Next.js', 'Framer Motion', 'GSAP'],
      gradient: 'from-secondary to-primary',
    },
    {
      id: 3,
      title: t(language, 'portfolio.projects.forestDashboard.title'),
      description: t(language, 'portfolio.projects.forestDashboard.description'),
      image: 'https://images.pexels.com/photos/853199/pexels-photo-853199.jpeg?auto=compress&cs=tinysrgb&w=800',
      tech: ['Vue.js', 'D3.js', 'Firebase'],
      gradient: 'from-primary via-secondary to-accent',
    },
    {
      id: 4,
      title: t(language, 'portfolio.projects.naturePortfolio.title'),
      description: t(language, 'portfolio.projects.naturePortfolio.description'),
      image: 'https://images.pexels.com/photos/1670187/pexels-photo-1670187.jpeg?auto=compress&cs=tinysrgb&w=800',
      tech: ['React', 'Three.js', 'GSAP'],
      gradient: 'from-secondary to-accent',
    },
  ];

  return (
    <section id="portfolio" ref={ref} className="min-h-screen py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl font-bold font-lincolnmitre text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-6">
            {t(language, 'portfolio.title')}
          </h2>
          <p className="text-xl font-lincolnmitre text-orange-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t(language, 'portfolio.description')}
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 100, rotateX: -15 }}
              animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ duration: 1, delay: index * 0.2 }}
              whileHover={{ 
                y: -10,
                rotateY: 5,
                scale: 1.02,
              }}
              className="group relative bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-3xl overflow-hidden border border-white/20 hover:border-primary/50 transition-all duration-500"
            >
              {/* Project Image */}
              <div className="relative h-64 overflow-hidden">
                <motion.img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  whileHover={{ scale: 1.1 }}
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${project.gradient} opacity-20 group-hover:opacity-40 transition-opacity duration-300`} />
                
                {/* Overlay Actions */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 flex items-center justify-center space-x-4 bg-black/50"
                >
                  <motion.button
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 bg-primary rounded-full text-white hover:bg-secondary transition-colors"
                  >
                    <Eye size={20} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.2, rotate: -5 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 bg-secondary rounded-full text-white hover:bg-primary transition-colors"
                  >
                    <Github size={20} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 bg-accent rounded-full text-white hover:bg-primary transition-colors"
                  >
                    <ExternalLink size={20} />
                  </motion.button>
                </motion.div>
              </div>

              {/* Project Content */}
              <div className="p-8">
                <h3 className="text-2xl font-bold font-lincolnmitre text-orange-800 dark:text-white mb-3">
                  {project.title}
                </h3>
                <p className="text-orange-600 dark:text-gray-300 font-lincolnmitre mb-6 leading-relaxed">
                  {project.description}
                </p>
                
                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech, techIndex) => (
                    <motion.span
                      key={tech}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={inView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: (index * 0.2) + (techIndex * 0.1) + 0.5 }}
                      className="px-3 py-1 bg-gradient-to-r from-primary/20 to-secondary/20 text-sm font-lincolnmitre rounded-full border border-primary/30"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Floating decoration */}
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 10, repeat: Infinity }}
                className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full opacity-60"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;