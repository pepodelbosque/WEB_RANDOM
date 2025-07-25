import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Calendar, MapPin, Award, TrendingUp } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { t } from '../../utils/translations';

const ExperienceSection: React.FC = () => {
  const { language } = useLanguage();
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const experiences = [
    {
      id: 1,
      title: t(language, 'experience.jobs.seniorCreativeDeveloper.title'),
      company: t(language, 'experience.jobs.seniorCreativeDeveloper.company'),
      location: t(language, 'experience.jobs.seniorCreativeDeveloper.location'),
      period: t(language, 'experience.jobs.seniorCreativeDeveloper.period'),
      description: t(language, 'experience.jobs.seniorCreativeDeveloper.description'),
      achievements: t(language, 'experience.jobs.seniorCreativeDeveloper.achievements') as string[],
      gradient: 'from-primary to-secondary',
    },
    {
      id: 2,
      title: t(language, 'experience.jobs.fullStackDeveloper.title'),
      company: t(language, 'experience.jobs.fullStackDeveloper.company'),
      location: t(language, 'experience.jobs.fullStackDeveloper.location'),
      period: t(language, 'experience.jobs.fullStackDeveloper.period'),
      description: t(language, 'experience.jobs.fullStackDeveloper.description'),
      achievements: t(language, 'experience.jobs.fullStackDeveloper.achievements') as string[],
      gradient: 'from-secondary to-primary',
    },
    {
      id: 3,
      title: t(language, 'experience.jobs.frontendDeveloper.title'),
      company: t(language, 'experience.jobs.frontendDeveloper.company'),
      location: t(language, 'experience.jobs.frontendDeveloper.location'),
      period: t(language, 'experience.jobs.frontendDeveloper.period'),
      description: t(language, 'experience.jobs.frontendDeveloper.description'),
      achievements: t(language, 'experience.jobs.frontendDeveloper.achievements') as string[],
      gradient: 'from-primary via-secondary to-accent',
    },
  ];

  const stats = [
    { number: '50+', label: t(language, 'experience.stats.projectsCompleted'), icon: TrendingUp },
    { number: '5+', label: t(language, 'experience.stats.yearsExperience'), icon: Calendar },
    { number: '20+', label: t(language, 'experience.stats.happyClients'), icon: Award },
    { number: '99%', label: t(language, 'experience.stats.clientSatisfaction'), icon: TrendingUp },
  ];

  return (
    <section id="experience" ref={ref} className="min-h-screen py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl font-bold font-avenuex text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-6">
            {t(language, 'experience.title')}
          </h2>
          <p className="text-xl font-avenuex text-orange-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t(language, 'experience.description')}
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="text-center bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
            >
              <div className="inline-flex p-3 bg-gradient-to-r from-primary to-secondary rounded-xl mb-4">
                <stat.icon size={24} className="text-white" />
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 2, delay: 0.6 + index * 0.1 }}
                className="text-3xl font-bold font-avenuex text-primary mb-2"
              >
                {stat.number}
              </motion.div>
              <div className="text-sm font-avenuex text-orange-600 dark:text-gray-400">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Experience Timeline */}
        <div className="space-y-12">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, delay: 0.6 + index * 0.2 }}
              className={`flex flex-col lg:flex-row gap-8 items-center ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Timeline Dot */}
              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  className={`w-16 h-16 bg-gradient-to-r ${exp.gradient} rounded-full flex items-center justify-center relative z-10`}
                >
                  <Calendar size={24} className="text-white" />
                </motion.div>
                
                {/* Connecting Line */}
                {index < experiences.length - 1 && (
                  <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-0.5 h-24 bg-gradient-to-b from-primary to-secondary opacity-30" />
                )}
              </div>

              {/* Content Card */}
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                className="flex-1 bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:border-primary/50 transition-all duration-500"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold font-avenuex text-orange-800 dark:text-white mb-2">
                      {exp.title}
                    </h3>
                    <div className="text-lg font-avenuex text-primary mb-2">
                      {exp.company}
                    </div>
                  </div>
                  <div className="flex flex-col md:items-end space-y-2">
                    <div className="flex items-center text-sm font-avenuex text-gray-600 dark:text-gray-400">
                      <Calendar size={16} className="mr-2" />
                      {exp.period}
                    </div>
                    <div className="flex items-center text-sm font-avenuex text-gray-600 dark:text-gray-400">
                      <MapPin size={16} className="mr-2" />
                      {exp.location}
                    </div>
                  </div>
                </div>

                <p className="text-orange-600 dark:text-gray-300 font-avenuex mb-6 leading-relaxed">
                  {exp.description}
                </p>

                <div>
                  <h4 className="text-lg font-bold font-avenuex text-orange-800 dark:text-white mb-4">
                    {t(language, 'experience.keyAchievements')}
                  </h4>
                  <ul className="space-y-2">
                    {exp.achievements.map((achievement, achIndex) => (
                      <motion.li
                        key={achIndex}
                        initial={{ opacity: 0, x: -20 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.8 + index * 0.2 + achIndex * 0.1 }}
                        className="flex items-start text-sm font-avenuex text-orange-600 dark:text-gray-400"
                      >
                        <motion.div 
                          whileHover={{ scale: 1.3 }}
                          className="w-2 h-2 bg-gradient-to-r from-primary to-secondary rounded-full mr-3 mt-2 flex-shrink-0"
                        />
                        {achievement}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;