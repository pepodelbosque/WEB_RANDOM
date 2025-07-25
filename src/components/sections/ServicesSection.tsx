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
  });

  const services = [
    {
      icon: Code2,
      title: t(language, 'services.webDevelopment.title'),
      description: t(language, 'services.webDevelopment.description'),
      features: t(language, 'services.webDevelopment.features') as string[],
      color: 'from-primary to-secondary',
    },
    {
      icon: Palette,
      title: t(language, 'services.uiuxDesign.title'),
      description: t(language, 'services.uiuxDesign.description'),
      features: t(language, 'services.uiuxDesign.features') as string[],
      color: 'from-secondary to-primary',
    },
    {
      icon: Smartphone,
      title: t(language, 'services.mobileDevelopment.title'),
      description: t(language, 'services.mobileDevelopment.description'),
      features: t(language, 'services.mobileDevelopment.features') as string[],
      color: 'from-primary via-secondary to-accent',
    },
    {
      icon: Zap,
      title: t(language, 'services.performanceOptimization.title'),
      description: t(language, 'services.performanceOptimization.description'),
      features: t(language, 'services.performanceOptimization.features') as string[],
      color: 'from-secondary to-accent',
    },
    {
      icon: Globe,
      title: t(language, 'services.seoAnalytics.title'),
      description: t(language, 'services.seoAnalytics.description'),
      features: t(language, 'services.seoAnalytics.features') as string[],
      color: 'from-accent to-primary',
    },
    {
      icon: Users,
      title: t(language, 'services.consultation.title'),
      description: t(language, 'services.consultation.description'),
      features: t(language, 'services.consultation.features') as string[],
      color: 'from-primary to-accent',
    },
  ];

  return (
    <section id="services" ref={ref} className="min-h-screen py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl font-bold font-avenuex text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-6">
            {t(language, 'services.title')}
          </h2>
          <p className="text-xl font-avenuex text-orange-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t(language, 'services.description')}
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 100, rotateY: -15 }}
              animate={inView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
              transition={{ duration: 1, delay: index * 0.15 }}
              whileHover={{ 
                y: -15,
                scale: 1.03,
                rotateX: 5,
              }}
              className="group relative bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:border-primary/50 transition-all duration-500 overflow-hidden"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              
              {/* Floating Icon Background */}
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 20, repeat: Infinity }}
                className={`absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br ${service.color} opacity-10 rounded-full`}
              />

              {/* Icon */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 10 }}
                className={`inline-flex p-4 bg-gradient-to-r ${service.color} rounded-2xl mb-6 relative z-10`}
              >
                <service.icon size={32} className="text-white" />
              </motion.div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-2xl font-bold font-avenuex text-orange-800 dark:text-white mb-4">
                  {service.title}
                </h3>
                <p className="text-orange-600 dark:text-gray-300 font-avenuex mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <motion.li
                      key={feature}
                      initial={{ opacity: 0, x: -20 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: (index * 0.15) + (featureIndex * 0.1) + 0.5 }}
                      className="flex items-center text-sm font-avenuex text-orange-600 dark:text-gray-400"
                    >
                      <motion.div 
                        whileHover={{ scale: 1.2 }}
                        className="w-2 h-2 bg-gradient-to-r from-primary to-secondary rounded-full mr-3"
                      />
                      {feature}
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Decorative Elements */}
              <motion.div
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute bottom-4 left-4 w-4 h-4 bg-primary rounded-full opacity-30"
              />
              <motion.div
                animate={{ 
                  scale: [1.5, 1, 1.5],
                  opacity: [0.6, 0.3, 0.6],
                }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute top-8 right-12 w-3 h-3 bg-secondary rounded-full opacity-30"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;