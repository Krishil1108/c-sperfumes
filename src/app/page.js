import React from 'react';
import { getPerfumes } from '../lib/sanity';
import HeroSlider from '../components/HeroSlider';
import TabbedProducts from '../components/TabbedProducts';
import ShopTheLook from '../components/ShopTheLook';
import TestimonialsWrapper from '../components/TestimonialsWrapper';
import Link from 'next/link';

export const revalidate = 10; // Revalidate static content every 10 seconds

export default async function HomePage() {
  const products = await getPerfumes();

  const notesList = [
    { name: 'Woody & Oud', count: '12 Scents', img: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=400&q=80' },
    { name: 'Floral Nectars', count: '8 Scents', img: 'https://images.unsplash.com/photo-1496062031256-47a19d8207e7?auto=format&fit=crop&w=400&q=80' },
    { name: 'Ocean Aquatics', count: '6 Scents', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80' },
    { name: 'Amber & Musk', count: '9 Scents', img: 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=400&q=80' }
  ];

  return (
    <div>
      {/* Campaign Slider Banner */}
      <HeroSlider />

      {/* Trust Badges Banner */}
      <section style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-accent)', padding: '24px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', gap: '24px', textAlign: 'center', fontSize: '14px', textTransform: 'uppercase', fontWeight: '500', letterSpacing: '0.1em' }}>
          <div>🌿 100% Organic Formula</div>
          <div>🐰 Cruelty-Free & Vegan</div>
          <div>⏳ 12-Hour Long Sillage</div>
          <div>🇮🇳 Proudly Crafted in India</div>
        </div>
      </section>

      {/* Tabbed Products (Bestsellers & New Arrivals) */}
      <TabbedProducts products={products} />

      {/* Shop the Look Hotspots Section */}
      <ShopTheLook products={products} />

      {/* Scent Notes Grid */}
      <section className="section-padding" id="notes">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Aromatherapy Profile</span>
            <h2 className="section-title">Shop By Olfactory Notes</h2>
          </div>

          <div className="notes-grid">
            {notesList.map((note, idx) => (
              <div className="note-box" key={idx}>
                <img src={note.img} alt={note.name} className="note-img" />
                <div className="note-overlay">
                  <h3 className="note-name">{note.name}</h3>
                  <span className="note-count">{note.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Testimonial Slider */}
      <TestimonialsWrapper />

      {/* Why Choose Us */}
      <section className="section-padding" style={{ backgroundColor: 'var(--color-bg-alt)', borderTop: '1px solid var(--color-border)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>👑</div>
            <h3 style={{ fontSize: '18px', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Luxury For Everyone</h3>
            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
              We bypass intermediate wholesale markups to deliver royal, high-concentration scents directly to your doorstep.
            </p>
          </div>
          <div>
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>🧪</div>
            <h3 style={{ fontSize: '18px', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Botanical Formulations</h3>
            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
              Formulated with raw cedar, jasmine oil, Moroccan rose water, and Indian sandalwood. Completely free of synthetic phthalates.
            </p>
          </div>
          <div>
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>📦</div>
            <h3 style={{ fontSize: '18px', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Royal Gift Packaging</h3>
            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
              Every order arrives encased in an exquisite gold-embossed champagne cardboard sleeve, complete with custom greeting card notes.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
