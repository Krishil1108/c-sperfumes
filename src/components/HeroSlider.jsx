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
    visible: { opacity: 1, transition: { staggerChildren: 0.18, delayChildren: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.5 } }
  };

  const itemVariants = {
    hidden: { y: 28, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] } }
  };

  return (
    <section className="hero-section" aria-label="Hero Campaigns">
      {slides.map((slide, idx) => (
        <div
          key={slide.id || idx}
          className={`hero-slide ${idx === activeIdx ? 'active' : ''}`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="hero-bg-media"
            style={{
              animation: idx === activeIdx ? 'kenBurns 10s ease-out forwards' : 'none',
              transformOrigin: 'center center'
            }}
          />

          <div className="container" style={{ width: '100%' }}>
            <AnimatePresence mode="wait">
              {idx === activeIdx && (
                <motion.div
                  className="hero-content"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <motion.span variants={itemVariants} className="hero-tagline">
                    {slide.tagline}
                  </motion.span>
                  <motion.h1 variants={itemVariants} className="hero-title" style={{ whiteSpace: 'pre-line' }}>
                    {slide.title}
                  </motion.h1>
                  <motion.p variants={itemVariants} className="hero-desc">
                    {slide.desc}
                  </motion.p>
                  <motion.div variants={itemVariants} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <Link href={slide.link || "/#bestsellers"} className="btn-primary">
                      <span>{slide.btnText}</span>
                      <ArrowRight size={16} />
                    </Link>
                    <Link href="/shop" className="btn-outline">
                      <span>View All</span>
                    </Link>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ))}

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
