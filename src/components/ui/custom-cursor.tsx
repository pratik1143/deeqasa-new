'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.closest('button') ||
          target.closest('a') ||
          target.getAttribute('role') === 'button')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden hidden md:block">
      {/* Outer Glowing Trailing Aura */}
      <motion.div
        className="absolute rounded-full bg-blue-500/20 blur-xl pointer-events-none"
        animate={{
          x: mousePosition.x - (isHovered ? 40 : 25),
          y: mousePosition.y - (isHovered ? 40 : 25),
          width: isHovered ? 80 : 50,
          height: isHovered ? 80 : 50,
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 250, mass: 0.5 }}
      />

      {/* Inner Precision Cursor Dot */}
      <motion.div
        className="absolute rounded-full bg-white border border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.8)] pointer-events-none"
        animate={{
          x: mousePosition.x - (isHovered ? 8 : 4),
          y: mousePosition.y - (isHovered ? 8 : 4),
          width: isHovered ? 16 : 8,
          height: isHovered ? 16 : 8,
          opacity: 0.9,
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 400, mass: 0.1 }}
      />
    </div>
  );
}
