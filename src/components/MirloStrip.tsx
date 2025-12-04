import React, { useMemo, useEffect, useState, useRef } from 'react';

interface MirloStripProps {
  progress: number; // 0–100
  width?: number; // px
  height?: number; // px
  autoPlay?: boolean; // cuando true, avanza frames automáticamente
  scale?: number; // escala visual del sprite (0–1)
  disableWheel?: boolean; // si true, no escucha la rueda
  progressSpeed?: number; // multiplica avance según progreso (1=normal)
}

const MirloStrip: React.FC<MirloStripProps> = ({ progress, width = 320, height = 320, autoPlay = false, scale = 0.5, disableWheel = false, progressSpeed = 1 }) => {
  const frames = useMemo(
    () =>
      [
        '/images/CarpetitaMirloStrip/1a.png',
        '/images/CarpetitaMirloStrip/1b.png',
        '/images/CarpetitaMirloStrip/1c.png',
        '/images/CarpetitaMirloStrip/1d.png',
        '/images/CarpetitaMirloStrip/1e.png',
        '/images/CarpetitaMirloStrip/1f.png',
      ].sort((a, b) => a.localeCompare(b)),
    []
  );

  const [loaded, setLoaded] = useState(0);
  const [overrideIdx, setOverrideIdx] = useState<number | null>(null);
  const progressRef = useRef(progress);
  const autoPlayRef = useRef<boolean>(!!autoPlay);
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);
  useEffect(() => {
    autoPlayRef.current = !!autoPlay;
  }, [autoPlay]);

  useEffect(() => {
    let mounted = true;
    const imgs = frames.map((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        if (mounted) setLoaded((v) => v + 1);
      };
      return img;
    });
    return () => {
      mounted = false;
      // clean image onload references
      imgs.forEach((img) => (img.onload = null));
    };
  }, [frames]);

  let baseIdx: number;
  if (progressSpeed === 1) {
    baseIdx = Math.min(
      frames.length - 1,
      Math.max(0, Math.round((progress / 100) * (frames.length - 1)))
    );
  } else {
    const raw = Math.round((progress / 100) * frames.length * progressSpeed);
    baseIdx = ((raw % frames.length) + frames.length) % frames.length;
  }
  const idx = overrideIdx ?? baseIdx;

  // ligero desplazamiento horizontal para sensación de movimiento
  // anclado: sin desplazamientos ni rotaciones

  // Rueda global: avanzar o retroceder frames incluso si la página no se desplaza
  useEffect(() => {
    if (disableWheel) return;
    const onWheel = (e: WheelEvent) => {
      // Durante autoPlay, ignorar entrada de rueda
      if (autoPlayRef.current) return;
      const dir = e.deltaY > 0 ? 1 : -1;
      setOverrideIdx((prev) => {
        const base = Math.min(
          frames.length - 1,
          Math.max(0, Math.round((progressRef.current / 100) * (frames.length - 1)))
        );
        const current = prev ?? base;
        const next = current + dir;
        if (next < 0) return frames.length - 1; // ciclo hacia atrás
        if (next >= frames.length) return 0; // ciclo hacia adelante
        return next;
      });
    };
    window.addEventListener('wheel', onWheel, { passive: true });
    return () => window.removeEventListener('wheel', onWheel);
  }, [frames.length, disableWheel]);

  // AutoPlay: avanzar automáticamente mientras esté activo
  useEffect(() => {
    if (!autoPlay) return;
    const id = setInterval(() => {
      setOverrideIdx((prev) => {
        const base = Math.min(
          frames.length - 1,
          Math.max(0, Math.round((progressRef.current / 100) * (frames.length - 1)))
        );
        const current = prev ?? base;
        const next = current + 1;
        return next >= frames.length ? 0 : next;
      });
    }, 240); // ~4.2 fps: más lento y suave
    return () => clearInterval(id);
  }, [autoPlay, frames.length]);

  return (
    <div
      className="relative"
      style={{ width, height }}
      aria-label="Secuencia de mirlo"
    >
      {loaded < frames.length && (
        <div className="absolute inset-0 grid place-items-center text-sm text-gray-400">Cargando…</div>
      )}
      <img
        src={frames[idx]}
        alt="Mirlo en vuelo"
        style={{
          display: 'block',
          marginTop: 0,
          marginBottom: 0,
          padding: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          transform: `scale(${scale})`,
          transformOrigin: 'center',
          transition: 'transform 80ms linear, filter 80ms linear',
          opacity: 0,
        }}
      />
      <span
        style={{
          position: 'absolute',
          inset: 0,
          display: 'block',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(180deg, #000000 0%, #2a0000 55%, #3a1400 100%)',
          WebkitMaskImage: `url(${frames[idx]})`,
          WebkitMaskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          WebkitMaskSize: 'contain',
          maskImage: `url(${frames[idx]})`,
          maskRepeat: 'no-repeat',
          maskPosition: 'center',
          maskSize: 'contain',
          transform: `scale(${scale})`,
          transformOrigin: 'center',
          transition: 'transform 80ms linear, filter 80ms linear',
          filter: 'brightness(0.82) drop-shadow(0 8px 14px rgba(0,0,0,0.45))',
        }}
      />
    </div>
  );
};

export default MirloStrip;
