"use client";

import { motion, useMotionValue, useSpring } from 'framer-motion';
import React, { useEffect, useRef } from 'react';
import { useMousePosition } from '@/hooks/use-mouse-position';

interface QasaOrbProps {
  onClick: () => void;
}

const ORB_SIZE = 64;

const OrbitalParticle = ({ i, numParticles }: { i: number; numParticles: number }) => {
  const angle = (i / numParticles) * 360;
  return (
    <motion.div
      className="absolute top-1/2 left-1/2 w-1 h-1 bg-white rounded-full"
      style={{
        boxShadow: '0 0 6px rgba(255, 255, 255, 0.8)',
      }}
      initial={{
        transform: `rotate(${angle}deg) translateY(-${ORB_SIZE / 2 * 0.9}px) rotate(-${angle}deg)`,
      }}
    />
  );
};

export function QasaOrb({ onClick }: QasaOrbProps) {
  const orbRef = useRef<HTMLButtonElement>(null);
  const { x: mouseX, y: mouseY } = useMousePosition();

  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const dx = useMotionValue(0);
  const dy = useMotionValue(0);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  
  const springX = useSpring(dx, springConfig);
  const springY = useSpring(dy, springConfig);
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  useEffect(() => {
    if (orbRef.current && mouseX !== null && mouseY !== null) {
      const rect = orbRef.current.getBoundingClientRect();
      const orbCenterX = rect.left + rect.width / 2;
      const orbCenterY = rect.top + rect.height / 2;
      
      const distance = Math.sqrt((mouseX - orbCenterX)**2 + (mouseY - orbCenterY)**2);
      
      if (distance < 200) {
        const offsetX = (mouseX - orbCenterX) * 0.1;
        const offsetY = (mouseY - orbCenterY) * 0.1;
        dx.set(offsetX);
        dy.set(offsetY);

        const newRotateX = (mouseY - orbCenterY) * -0.05;
        const newRotateY = (mouseX - orbCenterX) * 0.05;
        rotateX.set(newRotateX);
        rotateY.set(newRotateY);
      } else {
        dx.set(0);
        dy.set(0);
        rotateX.set(0);
        rotateY.set(0);
      }
    }
  }, [mouseX, mouseY, dx, dy, rotateX, rotateY]);

  const numParticles = 3;

  return (
    <motion.button
      ref={orbRef}
      onClick={onClick}
      className="fixed bottom-8 right-8 z-50 rounded-full cursor-pointer"
      aria-label="Activate QASA AI Assistant"
      style={{
        width: ORB_SIZE,
        height: ORB_SIZE,
        x: springX,
        y: springY,
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: 'preserve-3d'
      }}
      whileHover={{ scale: 1.25 }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
    >
      {/* Outermost pulse */}
      <motion.div
        className="absolute inset-0 rounded-full border border-[#00E0FF]"
        animate={{
          scale: [1, 1.5, 1, 1.8],
          opacity: [0, 0.5, 0.5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
          times: [0, 0.1, 0.9, 1]
        }}
      />
      
      {/* Soft shadow / outer glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[rgba(0,224,255,0.3)] via-transparent to-transparent rounded-full"
           style={{ filter: 'blur(10px)' }}/>

      {/* Main Orb Body */}
      <div className="relative w-full h-full rounded-full overflow-hidden" 
           style={{
            background: 'radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.8), rgba(100, 255, 218, 0.4) 40%, rgba(0, 224, 255, 0.3) 80%)',
            border: '1px solid rgba(0, 224, 255, 0.5)',
            boxShadow: 'inset 0 0 10px rgba(0, 224, 255, 0.5)'
           }}
      >
        {/* Breathing inner glow */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.4) 0%, transparent 60%)',
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Orbital Particles Container */}
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {Array.from({ length: numParticles }).map((_, i) => (
            <OrbitalParticle key={i} i={i} numParticles={numParticles} />
          ))}
        </motion.div>
      </div>
    </motion.button>
  );
}
