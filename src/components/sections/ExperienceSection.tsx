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
      achievements: t(language, 'experience.jobs.seniorCreativeDeveloper.achievements') as unknown as string[],
      gradient: 'from-primary to-secondary',
    },
    {
      id: 2,
      title: t(language, 'experience.jobs.fullStackDeveloper.title'),
      company: t(language, 'experience.jobs.fullStackDeveloper.company'),
      location: t(language, 'experience.jobs.fullStackDeveloper.location'),
      period: t(language, 'experience.jobs.fullStackDeveloper.period'),
      description: t(language, 'experience.jobs.fullStackDeveloper.description'),
      achievements: t(language, 'experience.jobs.fullStackDeveloper.achievements') as unknown as string[],
      gradient: 'from-secondary to-primary',
    },
    {
      id: 3,
      title: t(language, 'experience.jobs.frontendDeveloper.title'),
      company: t(language, 'experience.jobs.frontendDeveloper.company'),
      location: t(language, 'experience.jobs.frontendDeveloper.location'),
      period: t(language, 'experience.jobs.frontendDeveloper.period'),
      description: t(language, 'experience.jobs.frontendDeveloper.description'),
      achievements: t(language, 'experience.jobs.frontendDeveloper.achievements') as unknown as string[],
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
          <h2 className="text-5xl font-bold font-lincolnmitre text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-6">
            Experiencia
          </h2>
          <p className="text-xl font-lincolnmitre text-orange-600 dark:text-gray-300 max-w-3xl mx-auto">
            Un viaje a través del desarrollo creativo y la innovación digital
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ExperienceSection;