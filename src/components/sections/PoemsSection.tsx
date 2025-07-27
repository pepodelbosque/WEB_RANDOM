import React, { useRef, useEffect, useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { t } from '../../utils/translations';
import ScrollStack, { ScrollStackItem } from '../ScrollStack';

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

const PoemsSection: React.FC = () => {
  const { language } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const [hasAutoScrolled, setHasAutoScrolled] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [initialCardIndex, setInitialCardIndex] = useState(0);

  // Listen for scroll up from AboutSection
  useEffect(() => {
    const handleScrollUpFromAbout = () => {
      setInitialCardIndex(3); // Start at card 4 (0-indexed)
      setHasAutoScrolled(false);
      setIsScrolling(true);
      
      setTimeout(() => {
        const section = sectionRef.current;
        if (section) {
          const sectionRect = section.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          const targetPosition = sectionRect.top - (viewportHeight / 2) + (sectionRect.height / 2);
          
          const startPosition = window.pageYOffset;
          const distance = targetPosition;
          const duration = window.innerWidth < 768 ? 1000 : 1200; // Faster on mobile
          let startTime = null;
          
          const easeInOutCubic = (t) => {
            return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
          };
          
          const animateScroll = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const easedProgress = easeInOutCubic(progress);
            
            window.scrollTo(0, startPosition + (distance * easedProgress));
            
            if (progress < 1) {
              requestAnimationFrame(animateScroll);
            } else {
              setHasAutoScrolled(true);
              setIsScrolling(false);
            }
          };
          
          requestAnimationFrame(animateScroll);
        }
      }, 50);
    };

    window.addEventListener('scrollUpFromAbout', handleScrollUpFromAbout);
    return () => window.removeEventListener('scrollUpFromAbout', handleScrollUpFromAbout);
  }, []);

  // Auto-scroll when approaching from above (mobile optimized)
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAutoScrolled && !isScrolling && initialCardIndex === 0) {
            setIsScrolling(true);
            
            setTimeout(() => {
              const sectionRect = section.getBoundingClientRect();
              const viewportHeight = window.innerHeight;
              const sectionTop = sectionRect.top;
              const sectionHeight = sectionRect.height;
              
              const targetPosition = sectionTop - (viewportHeight / 2) + (sectionHeight / 2);
              
              const startPosition = window.pageYOffset;
              const distance = targetPosition;
              const duration = window.innerWidth < 768 ? 1500 : 1800; // Balanced: faster than 3000/4000 but smoother than 1000/1200
              let startTime = null;
              
              const easeInOutCubic = (t) => {
                return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
              };
              
              const animateScroll = (currentTime) => {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / duration, 1);
                const easedProgress = easeInOutCubic(progress);
                
                window.scrollTo(0, startPosition + (distance * easedProgress));
                
                if (progress < 1) {
                  requestAnimationFrame(animateScroll);
                } else {
                  setHasAutoScrolled(true);
                  setIsScrolling(false);
                }
              };
              
              requestAnimationFrame(animateScroll);
            }, window.innerWidth < 768 ? 200 : 300); // Responsive: reduced from 200 to 100
          }
        });
      },
      {
        threshold: window.innerWidth < 768 ? [0.05, 0.1] : [0.05, 0.1, 0.15], // Slower detection: reduced thresholds
        rootMargin: window.innerWidth < 768 ? '30% 0px -30% 0px' : '40% 0px -40% 0px' // Larger margins for slower detection
      }
    );

    observer.observe(section);

    // Reset auto-scroll flag when user scrolls away (mobile optimized)
    const handleScroll = () => {
      if (isScrolling) return;
      
      const sectionRect = section.getBoundingClientRect();
      const threshold = window.innerWidth < 768 ? 50 : 100;
      const isCompletelyOutOfView = sectionRect.bottom < -threshold || sectionRect.top > window.innerHeight + threshold;
      
      if (isCompletelyOutOfView && hasAutoScrolled) {
        setHasAutoScrolled(false);
        setInitialCardIndex(0); // Reset to card 1
      }
    };

    let scrollTimeout;
    const debouncedScrollHandler = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScroll, window.innerWidth < 768 ? 150 : 200); // More responsive debounce
    };

    window.addEventListener('scroll', debouncedScrollHandler, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', debouncedScrollHandler);
      clearTimeout(scrollTimeout);
    };
  }, [hasAutoScrolled, isScrolling, initialCardIndex]);

  return (
    <section 
      ref={sectionRef}
      id="poems" 
      className="min-h-screen pb-20 pt-0 relative flex items-start justify-center"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative max-w-4xl mx-auto">
          <ScrollStack
            itemDistance={window.innerWidth < 768 ? 120 : 150}
            itemScale={0}
            itemStackDistance={window.innerWidth < 768 ? 15 : 20}
            stackPosition="20%"
            scaleEndPosition="10%"
            baseScale={window.innerWidth < 768 ? 0.9 : 0.85}
            scaleDuration={0.8} // Smoother: reduced from 1.5 to 0.8
            rotationAmount={1}
            blurAmount={1.5}
            autoScrollToCenter={false}
            autoScrollToTop={true}
            initialCardIndex={initialCardIndex}
            onReachBottom={() => scrollToSection('about')}
            onReachTop={() => scrollToSection('home')}
          >
            <ScrollStackItem>
              <div className="w-full aspect-square rounded-2xl flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 to-gray-800">
                <img 
                  src="/images/tuto01a.jpeg" 
                  alt="Tutorial Image 1" 
                  className="w-full h-full object-cover rounded-2xl"
                />
                <div className="absolute bottom-4 right-4 bg-primary/20 rounded-lg px-3 py-1">
                  <span className="text-primary text-sm">CARD 1</span>
                </div>
              </div>
            </ScrollStackItem>
            <ScrollStackItem>
              <div className="w-full aspect-square rounded-2xl flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 to-gray-800">
                <img 
                  src="/images/tuto02.jpg" 
                  alt="Tutorial Image 2" 
                  className="w-full h-full object-cover rounded-2xl"
                />
                <div className="absolute bottom-4 right-4 bg-primary/20 rounded-lg px-3 py-1">
                  <span className="text-primary text-sm">CARD 2</span>
                </div>
              </div>
            </ScrollStackItem>
            <ScrollStackItem>
              <div className="w-full aspect-square rounded-2xl flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 to-gray-800">
                <img 
                  src="/images/tuto1.png" 
                  alt="Tutorial Image 3" 
                  className="w-full h-full object-cover rounded-2xl"
                />
                <div className="absolute bottom-4 right-4 bg-primary/20 rounded-lg px-3 py-1">
                  <span className="text-primary text-sm">CARD 3</span>
                </div>
              </div>
            </ScrollStackItem>
            <ScrollStackItem>
              <div className="w-full aspect-square rounded-2xl flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 to-gray-800">
                <img 
                  src="/images/tuto04.jpeg" 
                  alt="Tutorial Image 4" 
                  className="w-full h-full object-cover rounded-2xl"
                />
                <div className="absolute bottom-4 right-4 bg-primary/20 rounded-lg px-3 py-1">
                  <span className="text-primary text-sm">CARD 4</span>
                </div>
              </div>
            </ScrollStackItem>
          </ScrollStack>
        </div>
      </div>
    </section>
  );
};

export default PoemsSection;