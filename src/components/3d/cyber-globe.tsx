"use client";

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Stars, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function OrbitingParticles() {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, mathColors] = useMemo(() => {
    const count = 2000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const color = new THREE.Color();

    for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        const radius = 2.5 + Math.random() * 1.5;

        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);

        positions.set([x, y, z], i * 3);
        
        // Wacus theme colors: vibrant blue and cyan
        const mixedColor = color.lerpColors(
          new THREE.Color('#1A8CFF'), 
          new THREE.Color('#00E5FF'), 
          Math.random()
        );
        colors.set([mixedColor.r, mixedColor.g, mixedColor.b], i * 3);
    }
    return [positions, colors];
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      pointsRef.current.rotation.z = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} colors={mathColors} stride={3}>
      <PointMaterial transparent vertexColors size={0.02} sizeAttenuation={true} depthWrite={false} />
    </Points>
  );
}

function CoreSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
        meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
        meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1.8, 64, 64]}>
      <MeshDistortMaterial
        color="#1A8CFF"
        attach="material"
        distort={0.4}
        speed={1.5}
        roughness={0.5}
        metalness={0.2}
        wireframe={true}
        transparent={true}
        opacity={0.3}
      />
    </Sphere>
  );
}

export function CyberGlobe() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#1A8CFF" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00E5FF" />
        
        <CoreSphere />
        <OrbitingParticles />
      </Canvas>
    </div>
  );
}
