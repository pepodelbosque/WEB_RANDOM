import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { t } from '../../utils/translations';
import ScrollStack, { ScrollStackItem } from '../ScrollStack';

// Navigation function to scroll to other sections
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

const PoemsSection: React.FC = () => {
  const { language } = useLanguage();

  return (
    <section id="poems" className="min-h-screen pb-20 pt-0 relative flex items-start justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative max-w-4xl mx-auto">
          <ScrollStack
            itemDistance={150}  // Reduced from 200
            itemScale={0}  // Minimal scaling
            itemStackDistance={20}  // Reduced from 30
            stackPosition="20%"
            scaleEndPosition="10%"
            baseScale={0.85}
            scaleDuration={0.5}
            rotationAmount={1}  // No rotation
            blurAmount={1.5}  // No blur
            autoScrollToCenter={true}
            autoScrollToTop={true}
            onReachBottom={() => scrollToSection('about')}
            onReachTop={() => scrollToSection('home')}
          >
            <ScrollStackItem>
              <div className="w-full aspect-square rounded-2xl flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 to-gray-800">
                <img 
                  src="/images/tuto1.png" 
                  alt="Tutorial Image" 
                  className="w-full h-full object-cover rounded-2xl"
                />
                <div className="absolute bottom-4 right-4 bg-primary/20 rounded-lg px-3 py-1">
                  <span className="text-primary text-sm">PREVIEW</span>
                </div>
              </div>
            </ScrollStackItem>
            <ScrollStackItem>
              <div className="w-full aspect-square rounded-2xl flex flex-col justify-center items-center">
                <span className="text-4xl font-dirtyline text-primary uppercase">HOLA</span>
              </div>
            </ScrollStackItem>
            <ScrollStackItem>
              <div className="w-full aspect-square rounded-2xl flex flex-col justify-center items-center">
                <span className="text-4xl font-dirtyline text-primary uppercase">COMO ESTAN</span>
              </div>
            </ScrollStackItem>
            <ScrollStackItem>
              <div className="w-full aspect-square rounded-2xl flex flex-col justify-center items-center">
                <span className="text-4xl font-dirtyline text-primary uppercase">BIEN Y USTEDES</span>
              </div>
            </ScrollStackItem>
          </ScrollStack>
        </div>
      </div>
    </section>
  );
};

export default PoemsSection;