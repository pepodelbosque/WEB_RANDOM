import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

declare global {
  interface Window {
    lenis: Lenis;
    lenisRecomputeSections?: () => void;
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
        if (lastWheel !== BASE_WHEEL) lastWheel = BASE_WHEEL;
        if (lastTouch !== BASE_TOUCH) lastTouch = BASE_TOUCH;
        if (lastDuration !== BASE_DURATION) lastDuration = BASE_DURATION;
        return;
      }
      const progress = clamp((scrollY - s.top) / s.height, 0, 1);
      const factor = speedFromProgress(progress);

      // Apply smoothly: avoid thrashing by only updating when change is significant
      const targetWheel = BASE_WHEEL * factor;
      const targetTouch = BASE_TOUCH * factor;
      const targetDuration = BASE_DURATION / factor; // inverse: slower -> longer duration

      if (Math.abs(targetWheel - lastWheel) > 0.02) lastWheel = targetWheel;
      if (Math.abs(targetTouch - lastTouch) > 0.05) lastTouch = targetTouch;
      if (Math.abs(targetDuration - lastDuration) > 0.02) lastDuration = targetDuration;
    };

    let snapTimer: number | null = null;
    const clearSnapTimer = () => { if (snapTimer !== null) { clearTimeout(snapTimer); snapTimer = null; } };
    const nearestSection = (y: number) => {
      let nearest: SectionBounds | null = null;
      let best = Infinity;
      for (const s of sections) {
        const d = Math.abs(y - s.top);
        if (d < best) { best = d; nearest = s; }
      }
      return nearest;
    };
    lenis.on('scroll', (e: any) => {
      updateSpeedForScroll(e.scroll);
      clearSnapTimer();
      const v = Math.abs(e.velocity ?? 0);
      if (v < 0.08 && !e.animated) {
        snapTimer = window.setTimeout(() => {
          const target = nearestSection(e.scroll);
          if (!target) return;
          const dist = Math.abs(e.scroll - target.top);
          const win = Math.max(window.innerHeight, 1) * 0.35;
          if (dist <= win) {
            const header = document.querySelector('nav');
            const headerH = header ? Math.round(header.getBoundingClientRect().height) : 64;
            const snapOffset = (target.el.id === 'contact') ? -Math.round(window.innerHeight * 0.2) : (target.el.id === 'portfolio') ? headerH + 90 : 0;
            lenis.scrollTo(target.el, {
              offset: snapOffset,
              duration: 0.8,
              easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            });
          }
        }, 120);
      }
    });

    const ready = (document as any).fonts?.ready || Promise.resolve();
    Promise.resolve(ready).then(() => {
      computeSections();
      window.lenisRecomputeSections = computeSections;
    });
    window.addEventListener('resize', computeSections);
    window.addEventListener('orientationchange', computeSections);

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      window.removeEventListener('resize', computeSections);
      window.removeEventListener('orientationchange', computeSections);
      lenis.destroy();
    };
  }, []);
};
