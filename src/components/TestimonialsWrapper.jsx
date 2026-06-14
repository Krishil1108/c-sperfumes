'use client'

import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

const TESTIMONIALS = [
  {
    id: 1,
    text: "Aura Bella Oud is absolutely magical! I sprayed it in the morning and I can still catch hints of sandalwood at 9 PM. Truly premium quality.",
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

export default function TestimonialsWrapper() {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="section-padding testimonials" aria-label="Customer Reviews">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle" style={{ color: 'var(--color-accent)' }}>Word of Mouth</span>
          <h2 className="section-title">Loved By Connoisseurs</h2>
        </div>

        <div className="testimonial-carousel">
          {TESTIMONIALS.map((t, idx) => (
            <div 
              key={t.id} 
              className={`testimonial-slide ${idx === activeIdx ? 'active' : ''}`}
            >
              <div className="testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className="rating-star" 
                    fill="#ffb800" 
                    color="#ffb800" 
                    size={18}
                  />
                ))}
              </div>
              <blockquote className="testimonial-text">
                "{t.text}"
              </blockquote>
              <cite className="testimonial-author">
                {t.author}
              </cite>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
