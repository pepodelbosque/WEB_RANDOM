import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../hooks/useLanguage';
import { t } from '../../utils/translations';

interface CrewMember {
  nameKey: string;
  roleKey: string;
  bioKey: string;
  image: string;
  skills: string[];
}

interface TripulacionPopUpProps {
  isVisible: boolean;
  onClose: () => void;
  title?: string;
  selectedMember?: CrewMember | null;
  description?: string;
  sequenceMembers?: CrewMember[];
}

const TripulacionPopUp: React.FC<TripulacionPopUpProps> = ({ isVisible, onClose, title = 'TRIPULACIÓN', selectedMember = null, description, sequenceMembers = [] }) => {
  const { language } = useLanguage();
  // Smooth physics scrolling state
  const imagesRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hVelRef = useRef(0); // horizontal velocity for banner
  const vVelRef = useRef(0); // vertical velocity for text
  const animRef = useRef<number | null>(null);

  const maxSteps = useMemo(() => sequenceMembers.length, [sequenceMembers]);

  useEffect(() => {
    // Focus container for key events
    const el = containerRef.current;
    if (el) el.focus();
  }, [isVisible]);
  useEffect(() => {
    if (isVisible) {
      (window as any).lenis?.stop();
    } else {
      (window as any).lenis?.start();
    }
    return () => {
      (window as any).lenis?.start();
    };
  }, [isVisible]);

  useEffect(() => {
    // If a selected member is provided, start at its first occurrence in sequence
    // Posicionar inicio en el miembro seleccionado
    if (selectedMember) {
      const idx = sequenceMembers.findIndex((m) => m.nameKey === selectedMember.nameKey);
      if (idx >= 0) {
        const imgEl = imageRefs.current[idx];
        const txtEl = textRefs.current[idx];
        imgEl?.scrollIntoView({ behavior: 'instant', inline: 'start', block: 'nearest' } as any);
        txtEl?.scrollIntoView({ behavior: 'instant', inline: 'nearest', block: 'start' } as any);
      }
    } else {
      // Si no hay miembro, llevar el texto al inicio y las imágenes al principio
      imagesRef.current && (imagesRef.current.scrollLeft = 0);
      textRef.current && (textRef.current.scrollTop = 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMember]);

  // Immediate scroll (used while dragging/touch move)
  const scrollImmediateByDelta = useCallback((deltaY: number) => {
    const banner = imagesRef.current;
    const text = textRef.current;
    if (banner) {
      const max = banner.scrollWidth - banner.clientWidth;
      banner.scrollLeft = Math.max(0, Math.min(max, banner.scrollLeft + deltaY));
    }
    if (text) {
      const max = text.scrollHeight - text.clientHeight;
      // Hacer el scroll del texto 10 veces más lento
      text.scrollTop = Math.max(0, Math.min(max, text.scrollTop + (deltaY * 0.1)));
    }
  }, []);

  // Physics-based impulse (wheel/keys/touch end)
  const startAnimation = useCallback(() => {
    if (animRef.current != null) return;
    const step = () => {
      const banner = imagesRef.current;
      const text = textRef.current;

      if (banner) {
        const max = banner.scrollWidth - banner.clientWidth;
        if (hVelRef.current !== 0) {
          banner.scrollLeft = Math.max(0, Math.min(max, banner.scrollLeft + hVelRef.current));
          hVelRef.current *= 0.985; // fricción más suave
          if (Math.abs(hVelRef.current) < 0.02) hVelRef.current = 0;
        }
      }

      if (text) {
        const max = text.scrollHeight - text.clientHeight;
        if (vVelRef.current !== 0) {
          text.scrollTop = Math.max(0, Math.min(max, text.scrollTop + vVelRef.current));
          vVelRef.current *= 0.985; // fricción más suave
          if (Math.abs(vVelRef.current) < 0.02) vVelRef.current = 0;
        }
      }

      if (hVelRef.current === 0 && vVelRef.current === 0) {
        animRef.current = null;
        return;
      }
      animRef.current = requestAnimationFrame(step);
    };
    animRef.current = requestAnimationFrame(step);
  }, []);

  // Impulso directo (sin escala interna)
  const applyImpulseRaw = useCallback((impulse: number) => {
    hVelRef.current += impulse;
    // Texto: 10 veces más lento respecto al impulso
    vVelRef.current += impulse * 0.1;
    startAnimation();
  }, [startAnimation]);

  const applyImpulse = useCallback((deltaY: number) => {
    // Escalar y limitar el impulso (más suave)
    const impulse = Math.max(-90, Math.min(90, deltaY * 0.45));
    hVelRef.current += impulse;
    // Texto: 10 veces más lento
    vVelRef.current += impulse * 0.1;
    startAnimation();
  }, [startAnimation]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    // Rueda: lo más lento posible → escala mínima y clamp bajo
    const impulse = Math.max(-12, Math.min(12, e.deltaY * 0.02));
    applyImpulseRaw(impulse);
  }, [applyImpulseRaw]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); applyImpulse(60); }
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); applyImpulse(-60); }
    if (e.key === 'Escape') { e.preventDefault(); onClose(); }
  }, [applyImpulse, onClose]);

  // Touch swipe (vertical) for mobile
  const touchStartY = useRef<number | null>(null);
  const touchLastY = useRef<number | null>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const y = e.touches[0]?.clientY ?? 0;
    touchStartY.current = y;
    touchLastY.current = y;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    const y = e.touches[0]?.clientY ?? 0;
    if (touchLastY.current != null) {
      const delta = y - touchLastY.current;
      scrollImmediateByDelta(delta * -1); // invert to match wheel direction
    }
    touchLastY.current = y;
  }, [scrollImmediateByDelta]);

  const onTouchEnd = useCallback(() => {
    if (touchStartY.current == null || touchLastY.current == null) return;
    const delta = touchLastY.current - touchStartY.current;
    const threshold = 8; // sensibilidad
    if (Math.abs(delta) >= threshold) {
      applyImpulse(delta * -1);
    }
    touchStartY.current = null;
    touchLastY.current = null;
  }, [applyImpulse]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex flex-col items-center justify-center p-2 md:p-4"
          onWheel={handleWheel}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="dialog"
          aria-modal="true"
          ref={containerRef}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="flex-grow flex flex-col items-center justify-center text-center overflow-hidden w-full mt-10 md:mt-12">
            {/* Top: banner continuo de imágenes, scroll horizontal */}
            <div
              ref={imagesRef}
              className="w-full h-[45vh] md:h-[50vh] overflow-x-auto overflow-y-hidden no-scrollbar"
            >
              <div className="flex flex-row gap-0 items-center h-full">
                {sequenceMembers.map((m, i) => (
                  <img
                    key={`img-strip-${m.nameKey}-${i}`}
                    ref={(el) => (imageRefs.current[i] = el)}
                    src={m.image}
                    alt={t(language, m.nameKey)}
                    className="h-full w-auto flex-none object-contain rounded-none"
                  />
                ))}
              </div>
            </div>

            {/* Bottom: lista vertical, scroll con rueda */}
            <div
              ref={textRef}
              className="w-full h-[35vh] md:h-[40vh] overflow-y-auto mt-2 md:mt-4 no-scrollbar"
            >
              <div className="max-w-[85vw] md:max-w-2xl mx-auto text-center px-2 md:px-4">
                {description && (
                  <p className="text-[10px] md:text-[12px] font-extrabold font-lincolnmitre text-orange-200/85 leading-[1.3] md:leading-[1.35] mb-3 md:mb-4">
                    {description}
                  </p>
                )}
                {sequenceMembers.map((m, i) => (
                  <div key={`txt-block-${m.nameKey}-${i}`} ref={(el) => (textRefs.current[i] = el)} className="mb-3 md:mb-4">
                    <h3 className="text-base md:text-xl font-black font-lincolnmitre text-orange-300 mb-1 md:mb-2">
                      {t(language, m.nameKey)}
                    </h3>
                    <p className="text-[11px] md:text-sm font-extrabold font-lincolnmitre text-orange-300/80 mb-1 md:mb-2">
                      {t(language, m.roleKey)}
                    </p>
                    <p className="text-[10px] md:text-[12px] font-extrabold font-lincolnmitre text-orange-200/85 leading-[1.3] md:leading-[1.35] mb-1 md:mb-2">
                      {t(language, m.bioKey)}
                    </p>
                    <div className="flex flex-wrap gap-1.5 md:gap-2 justify-center">
                      {m.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-[2px] bg-gradient-to-r from-primary/15 to-secondary/15 text-[10px] md:text-[11px] font-lincolnmitre rounded-none border border-primary/30 text-orange-200/80 font-extrabold"
                        >
                          {t(language, skill)}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Indicador de pasos removido: scroll continuo */}
          </div>
          <motion.button
            onClick={onClose}
            className="mb-8 text-white hover:text-red-500 transition-colors duration-300 font-lincolnmitre uppercase tracking-widest"
            whileHover={{ scale: 1.1, rotate: 1 }}
            whileTap={{ scale: 0.9 }}
          >
            CERRAR
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TripulacionPopUp;
