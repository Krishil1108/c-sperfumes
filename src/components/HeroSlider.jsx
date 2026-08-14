'use client'

import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const HERO_SLIDES = [
  {
    id: 1,
    tagline: "The Royal Essence of Arabia",
    title: "Oud & Gold\nCollection",
    desc: "Experience the ultimate expression of woody sophistication — rare Indonesian Agarwood, Persian saffron, and golden amber notes.",
    link: "/#bestsellers",
    btnText: "Explore Collection",
    image: "/images/perfume_elegant_1784660079140.png"
  },
  {
    id: 2,
    tagline: "A Bouquet of Liquid Emotions",
    title: "Floral Bloom\nExtrait",
    desc: "A soft, romantic whisper of Damask Rose, Moroccan Jasmine, and white musk — crafted for absolute daily elegance.",
    link: "/#bestsellers",
    btnText: "Shop Floral Notes",
    image: "/images/perfume_sleek_1784660046118.png"
  },
  {
    id: 3,
    tagline: "Pure Aquatic Wilderness",
    title: "Ocean Fresh\nEau De Parfum",
    desc: "The refreshing cascade of ozone, Italian bergamot, and earthy sea moss. A long-lasting sillage for the modern voyager.",
    link: "/#bestsellers",
    btnText: "Browse Aquatics",
    image: "/images/perfume_modern_1784660067627.png"
  }
];

export default function HeroSlider({ settings }) {
  const slides = settings?.heroSlides && settings.heroSlides.length > 0
    ? settings.heroSlides
    : HERO_SLIDES;

  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.15, delayChildren: 0.1 } 
    },
    exit: { opacity: 0, transition: { duration: 0.4 } }
  };

  const itemVariants = {
    hidden: { y: 24, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } 
    }
  };

  const imageVariants = {
    hidden: { scale: 1.15, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1, 
      transition: { duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] } 
    },
    exit: { 
      scale: 0.95, 
      opacity: 0, 
      transition: { duration: 0.6 } 
    }
  };

  return (
    <section className="hero-section" aria-label="Hero Campaigns" style={{ background: 'var(--noir)', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ width: '100%', position: 'relative', zIndex: 5 }}>
        <div className="hero-split-container">
          
          {/* Left Panel: Animated Editorial Text */}
          <div className="hero-text-panel">
            <AnimatePresence mode="wait">
              {slides.map((slide, idx) => (
                idx === activeIdx && (
                  <motion.div
                    key={slide.id || idx}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="hero-content"
                    style={{ padding: 0, margin: 0 }}
                  >
                    <motion.span variants={itemVariants} className="hero-tagline">
                      {slide.tagline}
                    </motion.span>
                    <motion.h1 variants={itemVariants} className="hero-title" style={{ whiteSpace: 'pre-line', color: 'var(--white)' }}>
                      {slide.title}
                    </motion.h1>
                    <motion.p variants={itemVariants} className="hero-desc" style={{ color: 'rgba(255,255,255,0.7)' }}>
                      {slide.desc}
                    </motion.p>
                    <motion.div variants={itemVariants} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                      <Link href={slide.link || "/#bestsellers"} className="btn-primary">
                        <span>{slide.btnText}</span>
                        <ArrowRight size={16} />
                      </Link>
                      <Link href="/shop" className="btn-outline" style={{ color: 'var(--white)', border: '1px solid rgba(255,255,255,0.25)' }}>
                        <span>View All</span>
                      </Link>
                    </motion.div>
                  </motion.div>
                )
              ))}
            </AnimatePresence>
          </div>

          {/* Right Panel: Dynamic Scent Visualizer Frame */}
          <div className="hero-image-panel">
            {/* Ambient luxury vector decoration rings */}
            <div className="hero-deco-ring hero-ring-1"></div>
            <div className="hero-deco-ring hero-ring-2"></div>
            
            <AnimatePresence mode="wait">
              {slides.map((slide, idx) => (
                idx === activeIdx && (
                  <div key={slide.id || idx} className="hero-arch-frame">
                    <motion.img
                      variants={imageVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      src={slide.image}
                      alt={slide.title}
                      className="hero-slide-image"
                    />
                  </div>
                )
              ))}
            </AnimatePresence>
          </div>
          
        </div>
      </div>

      {/* Slide counter */}
      <div style={{ position: 'absolute', bottom: '32px', right: '32px', zIndex: 10, color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-label)', fontSize: '11px', letterSpacing: '0.15em', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: 'var(--gold)', fontSize: '15px', fontFamily: 'var(--font-display)' }}>0{activeIdx + 1}</span>
        <span>/</span>
        <span>0{slides.length}</span>
      </div>

      {/* Nav dots */}
      <div className="hero-nav-dots">
        {slides.map((_, idx) => (
          <button
            key={idx}
            className={`hero-dot ${idx === activeIdx ? 'active' : ''}`}
            onClick={() => setActiveIdx(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
