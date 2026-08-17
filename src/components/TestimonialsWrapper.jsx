'use client'

import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TESTIMONIALS = [
  {
    id: 1,
    text: "C&S Perfumes Oud is absolutely magical! I sprayed it in the morning and I can still catch hints of sandalwood at 9 PM. Truly premium quality.",
    author: "Aradhana S. — Verified Buyer"
  },
  {
    id: 2,
    text: "Floral Bloom smells like walking through a fresh dew-covered garden of Damask roses. Very gentle yet leaves a lasting impact. Love the champagne packaging!",
    author: "Kabir V. — Elite Member"
  },
  {
    id: 3,
    text: "The visual Scent Finder hotspot is what brought me here, and the Ocean Fresh scent is exactly what I needed. Long sillage, premium feel, and great pricing.",
    author: "Ryan K. — Scent Enthusiast"
  }
];

export default function TestimonialsWrapper({ settings }) {
  const testimonials = settings?.testimonials && settings.testimonials.length > 0
    ? settings.testimonials
    : TESTIMONIALS;

  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials]);

  return (
    <section className="testimonial-editorial-showcase" aria-label="Customer Reviews">
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="section-header">
          <span className="section-subtitle" style={{ color: 'var(--gold)', letterSpacing: '0.35em' }}>Word of Mouth</span>
          <h2 className="section-title" style={{ color: 'var(--white)', fontFamily: 'var(--font-display)', fontWeight: 300 }}>Loved By Connoisseurs</h2>
          <div className="divider-gold" style={{ marginTop: '16px' }}></div>
        </div>

        <div className="testimonial-carousel" style={{ minHeight: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatePresence mode="wait">
            {testimonials.map((t, idx) => (
              idx === activeIdx && (
                <motion.div 
                  key={t.id || idx} 
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  className="testimonial-editorial-slide active"
                >
                  <div className="testimonial-editorial-stars">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className="rating-star" 
                        fill="var(--gold)" 
                        color="var(--gold)" 
                        size={15}
                      />
                    ))}
                  </div>
                  <blockquote className="testimonial-editorial-text">
                    "{t.text}"
                  </blockquote>
                  <cite className="testimonial-editorial-author">
                    {t.author}
                  </cite>
                </motion.div>
              )
            ))}
          </AnimatePresence>
        </div>

        {/* Carousel indicators */}
        <div className="testimonial-dots" style={{ marginTop: '24px' }}>
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              className={`testimonial-dot ${idx === activeIdx ? 'active' : ''}`}
              onClick={() => setActiveIdx(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              style={{ border: 'none' }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
