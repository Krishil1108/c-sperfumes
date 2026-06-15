'use client'

import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const HERO_SLIDES = [
  {
    id: 1,
    tagline: "The Royal Essence of Arabia",
    title: "Oud & Gold Collection",
    desc: "Experience the ultimate expression of woody sophistication, featuring rare Indonesian Agarwood, Persian saffron, and golden amber notes.",
    link: "/#bestsellers",
    btnText: "Explore Collection",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1600&q=80"
  },
  {
    id: 2,
    tagline: "A Bouquet of Liquid Emotions",
    title: "Floral Bloom Extrait",
    desc: "A soft, romantic whisper of Damask Rose, Moroccan Jasmine, and light white musk, crafted for absolute daily elegance.",
    link: "/#bestsellers",
    btnText: "Shop Floral Notes",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1600&q=80"
  },
  {
    id: 3,
    tagline: "Pure Aquatic Wilderness",
    title: "Ocean Fresh Eau De Parfum",
    desc: "Unleash the refreshing splash of ozone, Italian bergamot, and earthy sea moss. Long-lasting sillage built for the modern summer voyager.",
    link: "/#bestsellers",
    btnText: "Browse Aquatics",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1600&q=80"
  }
];

export default function HeroSlider({ settings }) {
  const slides = settings?.heroSlides && settings.heroSlides.length > 0
    ? settings.heroSlides
    : HERO_SLIDES;

  const [activeIdx, setActiveIdx] = useState(0);

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides]);

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
          />
          
          <div className="container">
            <div className="hero-content">
              <span className="hero-tagline">{slide.tagline}</span>
              <h1 className="hero-title">{slide.title}</h1>
              <p className="hero-desc">{slide.desc}</p>
              <Link href={slide.link || "/#bestsellers"} className="btn-primary">
                <span>{slide.btnText}</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      ))}

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
