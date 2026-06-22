import React from 'react';
import { getPerfumes, getSiteSettings } from '../lib/sanity';
import HeroSlider from '../components/HeroSlider';
import TabbedProducts from '../components/TabbedProducts';
import ShopTheLook from '../components/ShopTheLook';
import TestimonialsWrapper from '../components/TestimonialsWrapper';
import Link from 'next/link';
import { Crown, FlaskConical, Gift, Shield, Leaf, Sparkles } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import InfiniteMarquee from '../components/InfiniteMarquee';

export const revalidate = 10;

const SCENT_CATEGORIES = [
  {
    name: 'Woody & Oud',
    description: '12 fragrances',
    emoji: '🌳',
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80',
    href: '/shop?scent=woody-oud',
    tagline: 'Deep. Earthy. Timeless.'
  },
  {
    name: 'Floral Bouquet',
    description: '8 fragrances',
    emoji: '🌸',
    image: 'https://images.unsplash.com/photo-1496062031256-47a19d8207e7?auto=format&fit=crop&w=600&q=80',
    href: '/shop?scent=floral',
    tagline: 'Delicate. Romantic. Fresh.'
  },
  {
    name: 'Ocean Aquatic',
    description: '6 fragrances',
    emoji: '🌊',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    href: '/shop?scent=aquatic',
    tagline: 'Crisp. Breezy. Free.'
  },
  {
    name: 'Amber & Musk',
    description: '9 fragrances',
    emoji: '✨',
    image: 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=600&q=80',
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

const TRUST_BADGES = [
  "🌿 100% Organic Formula",
  "🐰 Cruelty-Free & Vegan",
  "⏳ 12-Hour Long Sillage",
  "🇮🇳 Crafted in India"
];

function renderWhyUsIcon(item) {
  if (item.iconUploadUrl) {
    return (
      <img 
        src={item.iconUploadUrl} 
        alt={item.title} 
        className="why-us-custom-icon" 
      />
    );
  }

  const iconName = item.iconType?.toLowerCase() || '';
  const emoji = item.emoji || '';

  let IconComponent = Sparkles;
  
  if (iconName === 'crown' || emoji === '👑') {
    IconComponent = Crown;
  } else if (iconName === 'flask' || emoji === '🧪') {
    IconComponent = FlaskConical;
  } else if (iconName === 'gift' || emoji === '📦') {
    IconComponent = Gift;
  } else if (iconName === 'shield') {
    IconComponent = Shield;
  } else if (iconName === 'leaf') {
    IconComponent = Leaf;
  } else if (iconName === 'sparkles') {
    IconComponent = Sparkles;
  }

  return <IconComponent className="why-us-vector-icon" strokeWidth={1.2} />;
}

export default async function HomePage() {
  const products = await getPerfumes();
  const settings = await getSiteSettings();

  const categories = settings?.scentCategories && settings.scentCategories.length > 0
    ? settings.scentCategories
    : SCENT_CATEGORIES;

  const whyUs = settings?.whyChooseUs && settings.whyChooseUs.length > 0
    ? settings.whyChooseUs
    : WHY_US;

  const promiseSubtitle = settings?.brandName
    ? `The ${settings.brandName} Promise`
    : "The Ishaya Luxury Perfume Promise";

  const scentSubtitle = settings?.scentSubtitle || "Find Your Signature";
  const scentTitle = settings?.scentTitle || "Shop By Fragrance Family";
  const scentDescription = settings?.scentDescription || "Each scent family tells a different story. Discover yours.";

  return (
    <div>
      {/* Hero Slider */}
      <HeroSlider settings={settings} />

      {/* Trust Badges */}
      <InfiniteMarquee items={TRUST_BADGES} />

      {/* Tabbed Products */}
      <ScrollReveal yOffset={60}>
        <TabbedProducts products={products} />
      </ScrollReveal>

      {/* Shop the Look */}
      <ScrollReveal yOffset={60}>
        <ShopTheLook products={products} settings={settings} />
      </ScrollReveal>

      {/* Fragrance Categories */}
      <section className="section-padding" id="categories">
        <div className="container">
          <ScrollReveal delay={0.1}>
            <div className="section-header">
              <span className="section-subtitle">{scentSubtitle}</span>
              <h2 className="section-title">{scentTitle}</h2>
              <p style={{ fontSize: '15px', color: 'var(--color-text-muted)', maxWidth: '480px', margin: '0 auto', lineHeight: '1.65' }}>
                {scentDescription}
              </p>
            </div>
          </ScrollReveal>

          <div className="scent-categories-grid">
            {categories.map((cat, idx) => (
              <ScrollReveal delay={0.1 * idx} key={idx}>
                <Link href={cat.href || "/shop"} className="scent-category-card premium-card interactive-hover overflow-hidden group">
                  <div className="scent-category-img-wrapper transition-transform duration-700 ease-out group-hover:scale-110">
                    <img src={cat.image} alt={cat.name} className="scent-category-img" />
                  </div>
                  <div className="scent-category-overlay transition-opacity duration-500 group-hover:bg-black/60">
                    <div className="scent-category-content">
                      <span className="scent-category-emoji transition-transform duration-500 group-hover:scale-125">{cat.emoji}</span>
                      <h3 className="scent-category-name">{cat.name}</h3>
                      <span className="scent-category-desc text-white/80 group-hover:text-white transition-colors">{cat.description}</span>
                      <div className="scent-category-line scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                      <span className="scent-category-cta opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">{cat.tagline}</span>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <ScrollReveal yOffset={60}>
        <TestimonialsWrapper settings={settings} />
      </ScrollReveal>

      {/* Why Choose Us */}
      <section className="section-padding premium-why-us">
        <div className="why-us-bg-glow"></div>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <ScrollReveal>
            <div className="section-header">
              <span className="section-subtitle glow-text">{promiseSubtitle}</span>
              <h2 className="section-title font-serif">Why Choose Us</h2>
            </div>
          </ScrollReveal>
          <div className="why-us-grid-editorial">
            {whyUs.map((item, idx) => (
              <ScrollReveal delay={0.15 * idx} key={idx}>
                <div className="why-us-editorial-item group interactive-hover transition-transform duration-500 hover:-translate-y-2">
                  <div className="why-us-icon-container group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(197,168,128,0.4)] transition-all duration-500">
                    {renderWhyUsIcon(item)}
                  </div>
                  <div className="why-us-editorial-content">
                    <h3 className="why-us-editorial-title font-serif">{item.title}</h3>
                    <p className="why-us-editorial-desc">{item.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
