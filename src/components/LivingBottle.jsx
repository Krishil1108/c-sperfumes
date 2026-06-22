'use client';

import React from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

export default function LivingBottle({ image, alt }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth the mouse movements
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  // Transform mouse values into rotation degrees
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);
  
  // Transform for the aura to move opposite to the bottle tilt
  const auraX = useTransform(mouseXSpring, [-0.5, 0.5], ["-20px", "20px"]);
  const auraY = useTransform(mouseYSpring, [-0.5, 0.5], ["-20px", "20px"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Normalize values between -0.5 and 0.5
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div 
      className="living-bottle-container"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1200 }}
    >
      <motion.div 
        className="living-bottle-inner"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d"
        }}
      >
        {/* The Scent Aura */}
        <motion.div 
          className="living-bottle-aura"
          style={{ x: auraX, y: auraY }}
        ></motion.div>
        
        {/* The Floating Bottle */}
        <motion.img 
          src={image} 
          alt={alt} 
          className="living-bottle-img"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          style={{ translateZ: 50 }} // Push the bottle out in Z space for 3D effect
        />
      </motion.div>
    </div>
  );
}
