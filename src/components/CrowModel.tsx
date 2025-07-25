import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, BufferGeometry, Material } from 'three';
import * as THREE from 'three';

interface CrowModelProps {
  progress: number;
}

const CrowModel: React.FC<CrowModelProps> = ({ progress }) => {
  const meshRef = useRef<Mesh>(null);
  const wingLeftRef = useRef<Mesh>(null);
  const wingRightRef = useRef<Mesh>(null);

  // Create crow geometry using basic shapes
  const crowGeometry = useMemo(() => {
    const group = new THREE.Group();
    
    // Body (ellipsoid)
    const bodyGeometry = new THREE.SphereGeometry(0.8, 16, 12);
    bodyGeometry.scale(1, 0.6, 1.2);
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x1a1a1a });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.set(0, 0, 0);
    group.add(body);
    
    // Head
    const headGeometry = new THREE.SphereGeometry(0.5, 12, 10);
    const headMaterial = new THREE.MeshPhongMaterial({ color: 0x0f0f0f });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.set(0, 0.3, 0.8);
    group.add(head);
    
    // Beak
    const beakGeometry = new THREE.ConeGeometry(0.1, 0.4, 6);
    const beakMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
    const beak = new THREE.Mesh(beakGeometry, beakMaterial);
    beak.position.set(0, 0.2, 1.2);
    beak.rotation.x = Math.PI / 2;
    group.add(beak);
    
    // Eyes
    const eyeGeometry = new THREE.SphereGeometry(0.08, 8, 6);
    const eyeMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.2, 0.4, 1.0);
    group.add(leftEye);
    
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.2, 0.4, 1.0);
    group.add(rightEye);
    
    return group;
  }, []);

  // Wing geometries
  const wingGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(1.5, 0.3);
    shape.lineTo(1.8, -0.2);
    shape.lineTo(1.2, -0.8);
    shape.lineTo(0.3, -0.5);
    shape.lineTo(0, 0);
    
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: 0.1,
      bevelEnabled: false
    });
    
    return geometry;
  }, []);

  // Animation based on progress
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
    
    // Wing flapping based on progress
    if (wingLeftRef.current && wingRightRef.current) {
      const flapSpeed = 2 + (progress / 100) * 3;
      const flapAngle = Math.sin(state.clock.elapsedTime * flapSpeed) * 0.3;
      
      wingLeftRef.current.rotation.z = flapAngle;
      wingRightRef.current.rotation.z = -flapAngle;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Main crow body */}
      <primitive object={crowGeometry} />
      
      {/* Left wing */}
      <mesh ref={wingLeftRef} position={[-0.6, 0, 0]} rotation={[0, 0, 0.2]}>
        <primitive object={wingGeometry} />
        <meshPhongMaterial color={0x1a1a1a} />
      </mesh>
      
      {/* Right wing */}
      <mesh ref={wingRightRef} position={[0.6, 0, 0]} rotation={[0, Math.PI, -0.2]}>
        <primitive object={wingGeometry} />
        <meshPhongMaterial color={0x1a1a1a} />
      </mesh>
    </group>
  );
};

export default CrowModel;