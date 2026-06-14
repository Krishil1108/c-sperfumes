import React from 'react';
import { getPerfumes } from '../lib/sanity';
import HeroSlider from '../components/HeroSlider';
import TabbedProducts from '../components/TabbedProducts';
import ShopTheLook from '../components/ShopTheLook';
import TestimonialsWrapper from '../components/TestimonialsWrapper';
import Link from 'next/link';

export const revalidate = 10;

const SCENT_CATEGORIES = [
  {
    name: 'Woody & Oud',
    description: '12 fragrances',
    emoji: '🌳',
    img: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80',
    href: '/shop?scent=woody-oud',
    tagline: 'Deep. Earthy. Timeless.'
  },
  {
    name: 'Floral Bouquet',
    description: '8 fragrances',
    emoji: '🌸',
    img: 'https://images.unsplash.com/photo-1496062031256-47a19d8207e7?auto=format&fit=crop&w=600&q=80',
    href: '/shop?scent=floral',
    tagline: 'Delicate. Romantic. Fresh.'
  },
  {
    name: 'Ocean Aquatic',
    description: '6 fragrances',
    emoji: '🌊',
    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    href: '/shop?scent=aquatic',
    tagline: 'Crisp. Breezy. Free.'
  },
  {
    name: 'Amber & Musk',
    description: '9 fragrances',
    emoji: '✨',
    img: 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=600&q=80',
    href: '/shop?scent=amber-musk',
    tagline: 'Warm. Sensual. Lingering.'
  }
];

const WHY_US = [
  {
    emoji: '👑',
    title: 'Luxury For Everyone',
    desc: 'We bypass wholesale markups to deliver royal, high-concentration scents directly to your door at honest prices.'
  },
  {
    emoji: '🧪',
    title: 'Botanical Formulas',
    desc: 'Crafted with raw cedar, jasmine oil, Moroccan rose water & Indian sandalwood. Free of synthetic phthalates.'
  },
  {
    emoji: '📦',
    title: 'Royal Gift Packaging',
    desc: 'Every order arrives in a gold-embossed champagne sleeve with a custom greeting card — gift-ready by default.'
  }
];

export default async function HomePage() {
  const products = await getPerfumes();

  return (
    <div>
      {/* Hero Slider */}
      <HeroSlider />

      {/* Trust Badges */}
      <section className="trust-badges-bar">
        <div className="container">
          <div className="trust-badges-inner">
            <div className="trust-badge-item">🌿 100% Organic Formula</div>
            <div className="trust-badge-item">🐰 Cruelty-Free & Vegan</div>
            <div className="trust-badge-item">⏳ 12-Hour Long Sillage</div>
            <div className="trust-badge-item">🇮🇳 Crafted in India</div>
          </div>
        </div>
      </section>

      {/* Tabbed Products */}
      <TabbedProducts products={products} />

      {/* Shop the Look */}
      <ShopTheLook products={products} />

      {/* Fragrance Categories */}
      <section className="section-padding" id="categories">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Find Your Signature</span>
            <h2 className="section-title">Shop By Fragrance Family</h2>
            <p style={{ fontSize: '15px', color: 'var(--color-text-muted)', maxWidth: '480px', margin: '0 auto', lineHeight: '1.65' }}>
              Each scent family tells a different story. Discover yours.
            </p>
          </div>

          <div className="scent-categories-grid">
            {SCENT_CATEGORIES.map((cat, idx) => (
              <Link href={cat.href} key={idx} className="scent-category-card">
                <img src={cat.img} alt={cat.name} className="scent-category-img" />
                <div className="scent-category-overlay">
                  <span className="scent-category-emoji">{cat.emoji}</span>
                  <h3 className="scent-category-name">{cat.name}</h3>
                  <span className="scent-category-desc">{cat.description}</span>
                  <span className="scent-category-cta">{cat.tagline} →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <TestimonialsWrapper />

      {/* Why Choose Us */}
      <section className="section-padding" style={{ backgroundColor: 'var(--color-bg-alt)', borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">The Aura Bella Promise</span>
            <h2 className="section-title">Why Choose Us</h2>
          </div>
          <div className="why-us-grid">
            {WHY_US.map((item, idx) => (
              <div className="why-us-item" key={idx}>
                <span className="why-us-emoji">{item.emoji}</span>
                <div>
                  <h3 className="why-us-title">{item.title}</h3>
                  <p className="why-us-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
