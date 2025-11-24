import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

declare global {
  interface Window {
    lenis: Lenis;
  }
}

export const useLenis = () => {
  useEffect(() => {
    const BASE_DURATION = 1.2;
    const BASE_WHEEL = 1;
    const BASE_TOUCH = 2;

    const lenis = new Lenis({
      duration: BASE_DURATION,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: BASE_WHEEL,
      touchMultiplier: BASE_TOUCH,
      smoothTouch: true,
    });

    window.lenis = lenis;

    // Compute section bounds for non-linear speed mapping
    type SectionBounds = { el: HTMLElement; top: number; height: number; bottom: number };
    let sections: SectionBounds[] = [];

    const computeSections = () => {
      const els = Array.from(document.querySelectorAll<HTMLElement>('section'));
      sections = els.map((el) => {
        const rect = el.getBoundingClientRect();
        const top = rect.top + window.pageYOffset;
        const height = Math.max(el.offsetHeight, rect.height);
        return { el, top, height, bottom: top + height };
      });
    };

    // Easing helpers
    const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    const easeInCubic = (t: number) => t * t * t;

    // Map progress in section to speed factor
    // Zones: 0–0.2 fast, 0.2–0.8 slow to 0.5x, 0.8–1 fast again
    const FAST = 1.5; // 150% speed
    const MID = 0.5;  // 50% speed

    const speedFromProgress = (p: number) => {
      const x = clamp(p, 0, 1);
      if (x <= 0.2) return FAST;
      if (x >= 0.8) {
        const t = (x - 0.8) / 0.2; // 0..1
        return lerp(MID, FAST, easeInCubic(t));
      }
      // middle zone 0.2..0.8
      const t = (x - 0.2) / 0.6; // 0..1
      return lerp(FAST, MID, easeOutCubic(t));
    };

    // Update Lenis speed multipliers based on current scroll position
    let lastWheel = BASE_WHEEL;
    let lastTouch = BASE_TOUCH;
    let lastDuration = BASE_DURATION;

    const updateSpeedForScroll = (scrollY: number) => {
      // Find active section
      const s = sections.find((sec) => scrollY >= sec.top && scrollY < sec.bottom);
      if (!s) {
        // Default speed
        if (lastWheel !== BASE_WHEEL) {
          lenis.options.wheelMultiplier = BASE_WHEEL;
          lastWheel = BASE_WHEEL;
        }
        if (lastTouch !== BASE_TOUCH) {
          lenis.options.touchMultiplier = BASE_TOUCH;
          lastTouch = BASE_TOUCH;
        }
        if (lastDuration !== BASE_DURATION) {
          lenis.options.duration = BASE_DURATION;
          lastDuration = BASE_DURATION;
        }
        return;
      }
      const progress = clamp((scrollY - s.top) / s.height, 0, 1);
      const factor = speedFromProgress(progress);

      // Apply smoothly: avoid thrashing by only updating when change is significant
      const targetWheel = BASE_WHEEL * factor;
      const targetTouch = BASE_TOUCH * factor;
      const targetDuration = BASE_DURATION / factor; // inverse: slower -> longer duration

      if (Math.abs(targetWheel - lastWheel) > 0.02) {
        lenis.options.wheelMultiplier = targetWheel;
        lastWheel = targetWheel;
      }
      if (Math.abs(targetTouch - lastTouch) > 0.05) {
        lenis.options.touchMultiplier = targetTouch;
        lastTouch = targetTouch;
      }
      if (Math.abs(targetDuration - lastDuration) > 0.02) {
        lenis.options.duration = targetDuration;
        lastDuration = targetDuration;
      }
    };

    // Sync and update speed on each Lenis scroll
    lenis.on('scroll', (e: any) => {
      updateSpeedForScroll(e.scroll);
    });

    const ready = (document as any).fonts?.ready || Promise.resolve();
    Promise.resolve(ready).then(() => {
      computeSections();
    });
    window.addEventListener('resize', computeSections);

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      window.removeEventListener('resize', computeSections);
      lenis.destroy();
    };
  }, []);
};
