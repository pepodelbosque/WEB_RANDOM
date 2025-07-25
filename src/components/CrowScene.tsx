import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import CrowModel from './CrowModel';

interface CrowSceneProps {
  progress: number;
}

const CrowScene: React.FC<CrowSceneProps> = ({ progress }) => {
  return (
    <div className="w-80 h-80 mx-auto">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 2, 5]} />
        
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={0.8} 
          color={0xff0000}
          castShadow
        />
        <directionalLight 
          position={[-5, 3, 2]} 
          intensity={0.6} 
          color={0xff7300}
        />
        
        {/* Crow Model */}
        <Suspense fallback={null}>
          <CrowModel progress={progress} />
        </Suspense>
        
        {/* Optional: Allow user to rotate the view */}
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate
          autoRotateSpeed={1}
        />
      </Canvas>
    </div>
  );
};

export default CrowScene;