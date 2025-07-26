import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Brain, Heart, Lightbulb, Target } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { t } from '../../utils/translations';

const AboutSection: React.FC = () => {
  const { language } = useLanguage();
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const skills = [
    { name: t(language, 'about.skills.creativeThinking'), icon: Brain, level: 95 },
    { name: t(language, 'about.skills.problemSolving'), icon: Target, level: 90 },
    { name: t(language, 'about.skills.userExperience'), icon: Heart, level: 88 },
    { name: t(language, 'about.skills.innovation'), icon: Lightbulb, level: 92 },
  ];

  return (
    <section id="about" ref={ref} className="min-h-screen py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-1 gap-16 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1 }}
            className="space-y-8"
          >
            <motion.h2 
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-5xl font-bold font-avenuex text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary"
            >
              {t(language, 'about.title')}
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.4 }}
              className="space-y-6 text-base md:text-lg font-avenuex text-red-600 dark:text-white max-w-2xl mx-auto leading-normal"
            >
              <p>
                {t(language, 'about.description1')}
              </p>
              
              <p>
                {t(language, 'about.description2')}
              </p>

              <p>
                {t(language, 'about.description3')}
              </p>
            </motion.div>

            {/* Skills */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.6 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold font-avenuex text-primary">{t(language, 'about.coreStrengths')}</h3>
              <div className="space-y-4">
                {skills.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, x: -50 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.8 + index * 0.1 }}
                    className="flex items-center space-x-4"
                  >
                    <div className="p-2 bg-gradient-to-r from-primary to-secondary rounded-lg">
                      <skill.icon size={24} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-avenuex text-orange-800 dark:text-gray-200">{skill.name}</span>
                        <span className="font-avenuex text-sm text-orange-600 dark:text-gray-400">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={inView ? { width: `${skill.level}%` } : {}}
                          transition={{ duration: 1.5, delay: 1 + index * 0.1 }}
                          className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Visual Element was here */}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;