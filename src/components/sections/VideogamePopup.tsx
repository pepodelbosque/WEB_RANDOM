// Top-level imports and Model component within VideogamePopup.tsx
import React, { useEffect, Suspense, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface VideogamePopupProps {
  isVisible: boolean;
  onClose: () => void;
}

const Model: React.FC = () => {
  const { scene } = useGLTF('/fonts/models/arcade_machine_standup.glb');
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!groupRef.current || !scene) return;

    // Paint entire model black by overriding materials
    scene.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh) {
        const makeBlack = () =>
          new THREE.MeshStandardMaterial({
            color: new THREE.Color(0, 0, 0),
            roughness: 1,
            metalness: 0,
          });

        if (Array.isArray(mesh.material)) {
          mesh.material = mesh.material.map(() => makeBlack());
        } else {
          mesh.material = makeBlack();
        }
      }
    });

    // Compute fit scale from original bounds
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const fitScale = maxDim > 0 ? 2.0 / maxDim : 1;

    // Scale the scene, then recenter to origin (pivot at center)
    scene.scale.setScalar(fitScale);
    const scaledBox = new THREE.Box3().setFromObject(scene);
    const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
    groupRef.current.position.set(-scaledCenter.x, -scaledCenter.y, -scaledCenter.z);
  }, [scene]);

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
};

useGLTF.preload('/fonts/models/arcade_machine_standup.glb');

const VideogamePopup: React.FC<VideogamePopupProps> = ({ isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      window.lenis?.stop();
    } else {
      window.lenis?.start();
    }
    return () => {
      window.lenis?.start();
    };
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex flex-col items-center justify-center p-4"
        >
          <div className="flex-grow flex flex-col items-center justify-center text-center overflow-y-auto">
            <motion.h2 
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-5xl font-bold font-lincolnmitre text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-8"
            >
              VIDEOGAME
            </motion.h2>
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="text-white/70 w-full max-w-3xl mx-auto"
            >
              {/* 3D Model Viewer - red lighting, no red frame */}
              <div className="w-full h-64 sm:h-80 md:h-[420px] bg-black/40 relative">
                <Canvas shadows>
                  <PerspectiveCamera makeDefault position={[0, 1, 3]} />
                  {/* Red lights with stronger intensity and rim fill */}
                  <ambientLight color="#330000" intensity={0.7} />
                  <directionalLight color="#ff3333" position={[4, 4, 4]} intensity={3.0} />
                  <directionalLight color="#aa0000" position={[-3, 2, -2]} intensity={1.8} />
                  <spotLight
                    color="#ff0000"
                    position={[0, 4, 2]}
                    intensity={5.0}
                    angle={0.7}
                    penumbra={0.5}
                    castShadow
                  />
                  <Suspense fallback={null}>
                    <Model />
                  </Suspense>
                  <OrbitControls enablePan={false} target={[0, 0, 0]} />
                </Canvas>
              </div>
            </motion.div>
          </div>
          <motion.button
            onClick={onClose}
            className="mb-8 text-white hover:text-red-500 transition-colors duration-300 font-lincolnmitre uppercase tracking-widest"
            whileHover={{ scale: 1.1, rotate: 1 }}
            whileTap={{ scale: 0.9 }}
          >
            EXIT
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default VideogamePopup;