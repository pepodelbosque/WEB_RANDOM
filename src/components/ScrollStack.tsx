import { useLayoutEffect, useRef, useCallback, useEffect } from "react";
import Lenis from "lenis";

export interface ScrollStackProps {
  children: React.ReactNode;
  className?: string;
  itemDistance?: number;
  itemScale?: number;
  itemStackDistance?: number;
  stackPosition?: string;
  scaleEndPosition?: string;
  baseScale?: number;
  scaleDuration?: number;
  rotationAmount?: number;
  blurAmount?: number;
  onStackComplete?: () => void;
  autoScrollToCenter?: boolean;
  autoScrollToTop?: boolean;
  initialCardIndex?: number; // Add this prop
  onReachBottom?: () => void;
  onReachTop?: () => void;
}

export const ScrollStackItem = ({ children, itemClassName = "" }) => (
  <div
    className={`scroll-stack-card relative w-full h-80 my-4 origin-top will-change-transform ${itemClassName}`.trim()}
    style={{
      backfaceVisibility: 'hidden',
      transformStyle: 'preserve-3d',
    }}
  >
    {children}
  </div>
);

const ScrollStack = ({
  children,
  className = "",
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = "20%",
  scaleEndPosition = "10%",
  baseScale = 0.85,
  scaleDuration = 0.5,
  rotationAmount = 0,
  blurAmount = 0,
  onStackComplete,
  autoScrollToCenter = true,
  autoScrollToTop = false,
  initialCardIndex = 0, // Add this prop with default value
  onReachBottom,
  onReachTop,
}: ScrollStackProps) => {
  const scrollerRef = useRef(null);
  const stackCompletedRef = useRef(false);
  const animationFrameRef = useRef(null);
  const lenisRef = useRef(null);
  const cardsRef = useRef([]);
  const lastTransformsRef = useRef(new Map());
  const isUpdatingRef = useRef(false);
  const isAtBottomRef = useRef(false);
  const isAtTopRef = useRef(false);

  const calculateProgress = useCallback((scrollTop, start, end) => {
    if (scrollTop < start) return 0;
    if (scrollTop > end) return 1;
    return (scrollTop - start) / (end - start);
  }, []);

  const parsePercentage = useCallback((value, containerHeight) => {
    if (typeof value === 'string' && value.includes('%')) {
      return (parseFloat(value) / 100) * containerHeight;
    }
    return parseFloat(value);
  }, []);

  const updateCardTransforms = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller || !cardsRef.current.length || isUpdatingRef.current) return;

    isUpdatingRef.current = true;

    const scrollTop = scroller.scrollTop;
    const containerHeight = scroller.clientHeight;
    const stackPositionPx = parsePercentage(stackPosition, containerHeight);
    const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight);
    const endElement = scroller.querySelector('.scroll-stack-end');
    const endElementTop = endElement ? endElement.offsetTop : 0;

    cardsRef.current.forEach((card, i) => {
      if (!card) return;
  
      const cardTop = card.offsetTop;
      
      // Remove individual card multipliers - all cards move the same way
      const triggerStart = cardTop - stackPositionPx - (itemStackDistance * i);
      const triggerEnd = cardTop - scaleEndPositionPx;
      const pinStart = cardTop - stackPositionPx - (itemStackDistance * i);
      const pinEnd = endElementTop - containerHeight / 2;
  
      const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
      const targetScale = baseScale + (i * itemScale);
      const scale = 1 - scaleProgress * (1 - targetScale);
      const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0;
  
      // Unified opacity calculation for all cards
      const fadeInStart = cardTop - containerHeight * 1.2;
      const fadeInEnd = cardTop - containerHeight * 0.5;
      const fadeInProgress = calculateProgress(scrollTop, fadeInStart, fadeInEnd);
      
      // Fade out when overlapped by next card
      const nextCardTrigger = cardsRef.current[i + 1] ? 
        cardsRef.current[i + 1].offsetTop - stackPositionPx - itemStackDistance : Infinity;
      const fadeOutStart = nextCardTrigger - containerHeight * 0.8;
      const fadeOutEnd = nextCardTrigger + containerHeight * 0.5;
      const fadeOutProgress = calculateProgress(scrollTop, fadeOutStart, fadeOutEnd);
      
      let opacity = fadeInProgress * (1 - fadeOutProgress);
      opacity = Math.max(0, Math.min(1, opacity));
  
      let blur = 0;
      if (blurAmount) {
        let topCardIndex = 0;
        for (let j = 0; j < cardsRef.current.length; j++) {
          const jCardTop = cardsRef.current[j].offsetTop;
          // Remove individual multipliers for blur calculation too
          const jTriggerStart = jCardTop - stackPositionPx - (itemStackDistance * j);
          if (scrollTop >= jTriggerStart) {
            topCardIndex = j;
          }
        }
        
        if (i < topCardIndex) {
          const depthInStack = topCardIndex - i;
          blur = Math.max(0, depthInStack * blurAmount);
        }
      }
  
      let translateY = 0;
      const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;
      
      if (isPinned) {
        // Remove individual multipliers for translateY calculation
        translateY = scrollTop - cardTop + stackPositionPx + (itemStackDistance * i);
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPositionPx + (itemStackDistance * i);
      }
  
      const newTransform = {
        translateY: Math.round(translateY * 100) / 100,
        scale: Math.round(scale * 1000) / 1000,
        rotation: Math.round(rotation * 100) / 100,
        blur: Math.round(blur * 100) / 100,
        opacity: Math.round(opacity * 1000) / 1000
      };
  
      const lastTransform = lastTransformsRef.current.get(i);
      const hasChanged = !lastTransform ||
        Math.abs(lastTransform.translateY - newTransform.translateY) > 0.1 ||
        Math.abs(lastTransform.scale - newTransform.scale) > 0.001 ||
        Math.abs(lastTransform.rotation - newTransform.rotation) > 0.1 ||
        Math.abs(lastTransform.blur - newTransform.blur) > 0.1 ||
        Math.abs((lastTransform.opacity || 1) - newTransform.opacity) > 0.01;
  
      if (hasChanged) {
        const transform = `translate3d(0, ${newTransform.translateY}px, 0) scale(${newTransform.scale}) rotate(${newTransform.rotation}deg)`;
        const filter = newTransform.blur > 0 ? `blur(${newTransform.blur}px)` : '';
  
        card.style.transform = transform;
        card.style.filter = filter;
        card.style.opacity = newTransform.opacity.toString();
        
        lastTransformsRef.current.set(i, newTransform);
      }
  
      if (i === cardsRef.current.length - 1) {
        const isInView = scrollTop >= pinStart && scrollTop <= pinEnd;
        if (isInView && !stackCompletedRef.current) {
          stackCompletedRef.current = true;
          onStackComplete?.();
        } else if (!isInView && stackCompletedRef.current) {
          stackCompletedRef.current = false;
        }
      }
    });
  
    isUpdatingRef.current = false;
  }, [
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    onStackComplete,
    calculateProgress,
    parsePercentage,
  ]);

  const handleScroll = useCallback(() => {
    updateCardTransforms();
  }, [updateCardTransforms]);

  const checkScrollPosition = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const scrollTop = scroller.scrollTop;
    const scrollHeight = scroller.scrollHeight;
    const clientHeight = scroller.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight - 10) {  // Near bottom
      if (!isAtBottomRef.current) {
        isAtBottomRef.current = true;
        onReachBottom?.();
      }
    } else {
      isAtBottomRef.current = false;
    }

    if (scrollTop <= 10) {  // Near top
      if (!isAtTopRef.current) {
        isAtTopRef.current = true;
        onReachTop?.();
      }
    } else {
      isAtTopRef.current = false;
    }
  }, [onReachBottom, onReachTop]);

  const setupLenis = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
  
    const lenis = new Lenis({
      wrapper: scroller,
      content: scroller.querySelector('.scroll-stack-inner'),
      duration: 3.5, // Much slower: increased from 1.2 to 3.5
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 0.8, // Much slower: reduced from 2.5 to 0.8
      infinite: false,
      wheelMultiplier: 0.4, // Much slower: reduced from 1.5 to 0.4
      lerp: 0.05, // Much slower: reduced from 0.15 to 0.05
      syncTouch: true,
    });

    lenisRef.current = lenis;

    const animate = (time) => {
      lenis.raf(time);
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animationFrameRef.current = requestAnimationFrame(animate);

    lenis.on('scroll', handleScroll);

    return () => {
      lenis.destroy();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleScroll]);

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    // Force scroll to top immediately on mount/refresh
    scroller.scrollTop = 0;

    // Collect card references
    cardsRef.current = Array.from(scroller.querySelectorAll('.scroll-stack-card'));

    // Setup Lenis smooth scrolling
    const cleanup = setupLenis();

    // Initial transform update
    updateCardTransforms();

    return cleanup;
  }, [setupLenis, updateCardTransforms]);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.on('scroll', checkScrollPosition);
    }
    return () => {
      if (lenis) lenis.off('scroll', checkScrollPosition);
    };
  }, [checkScrollPosition]);

  // Auto-scroll on mount with initialCardIndex support
  useEffect(() => {
    if (lenisRef.current && scrollerRef.current && cardsRef.current.length > 0) {
      const targetCard = cardsRef.current[initialCardIndex];
      
      if (targetCard && initialCardIndex > 0) {
        // Scroll to specific card immediately
        const containerHeight = scrollerRef.current.clientHeight;
        const stackPositionPx = parsePercentage(stackPosition, containerHeight);
        const targetScrollPosition = targetCard.offsetTop - stackPositionPx - (itemStackDistance * initialCardIndex);
        
        lenisRef.current.scrollTo(targetScrollPosition, { duration: 0, immediate: true });
        
        // Optional smooth scroll after initial positioning
        setTimeout(() => {
          if (autoScrollToTop && initialCardIndex === 0) {
            lenisRef.current.scrollTo(0, { duration: 3.0 }); // Much slower: increased from 1.5 to 3.0
          }
        }, 200); // Slower delay: increased from 100 to 200
      } else {
        // Default behavior for card 1
        lenisRef.current.scrollTo(0, { duration: 0, immediate: true });
        
        setTimeout(() => {
          if (autoScrollToTop) {
            lenisRef.current.scrollTo(0, { duration: 3.0 }); // Much slower: increased from 1.5 to 3.0
          }
        }, 200); // Slower delay: increased from 100 to 200
      }
    }
  }, [autoScrollToTop, initialCardIndex, stackPosition, itemStackDistance, parsePercentage]);

  return (
    <div
      ref={scrollerRef}
      className={`scroll-stack-container relative w-full h-screen overflow-auto ${className}`}
      style={{
        scrollBehavior: 'auto',
      }}
    >
      <div className="scroll-stack-inner relative">
        {children}
        <div className="scroll-stack-end h-96" />
      </div>
    </div>
  );
};

export default ScrollStack;