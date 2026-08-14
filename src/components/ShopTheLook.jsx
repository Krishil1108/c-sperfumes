'use client'

import React, { useState } from 'react';
import { useCart } from '../lib/CartContext';
import { Star, ShoppingBag, X } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { getOptimizedImageUrl } from '../lib/image';

export default function ShopTheLook({ products, settings }) {
  // We'll select 3 beautiful products to associate with hotspots
  const hotspotProducts = products.slice(0, 3);
  
  // Set default offsets for pins on our background flatlay image
  const pinCoordinates = [
    { x: 30, y: 35 }, // Pin for product 0
    { x: 65, y: 45 }, // Pin for product 1
    { x: 45, y: 75 }  // Pin for product 2
  ];

  const [activeIdx, setActiveIdx] = useState(0);
  const { addToCart } = useCart();
  
  const activeProduct = hotspotProducts[activeIdx] || products[0];
  const stlImage = settings?.shopTheLookImage || "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=80";

  return (
    <section className="section-padding shop-the-look" style={{ background: 'var(--charcoal)', position: 'relative', overflow: 'hidden' }}>
      {/* Dynamic backdrop subtle glow */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="section-header">
          <span className="section-subtitle" style={{ color: 'var(--gold)', letterSpacing: '0.35em' }}>Visual Scent Finder</span>
          <h2 className="section-title" style={{ color: 'var(--white)', fontFamily: 'var(--font-display)', fontWeight: 300 }}>Shop The Fragrance Portrait</h2>
          <div className="divider-gold" style={{ marginTop: '16px' }}></div>
        </div>

        <div className="stl-container">
          {/* Flatlay Visualizer with Hotspots */}
          <div className="stl-visualizer" style={{ border: '1px solid rgba(201,168,76,0.2)', boxShadow: 'var(--shadow-gold)' }}>
            <img 
              src={getOptimizedImageUrl(stlImage, 1200)} 
              alt="Shop the Scent Portrait" 
              className="stl-image"
            />
            
            {hotspotProducts.map((p, idx) => {
              const coords = pinCoordinates[idx];
              return (
                <button 
                  key={p.id || idx}
                  className={`hotspot-pin interactive-hover ${idx === activeIdx ? 'active' : ''}`}
                  style={{ top: `${coords.y}%`, left: `${coords.x}%`, border: 'none', background: 'none' }}
                  onClick={() => setActiveIdx(idx)}
                  aria-label={`Select product ${p.title}`}
                >
                  <div className="hotspot-trigger">
                    <div className="hotspot-pulse"></div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Glowing Selected Product Overlay Box */}
          <div className="stl-card-holder">
            <AnimatePresence mode="wait">
              {activeProduct && (
                <motion.div 
                  key={activeProduct.id || activeProduct._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className={`stl-floating-card ${activeProduct.inStock === false ? 'sold-out' : ''}`}
                >
                  {activeProduct.inStock === false && (
                    <div className="out-of-stock-label" style={{ borderRadius: '0' }}>Sold Out</div>
                  )}
                  {activeProduct.discount > 0 && activeProduct.inStock !== false && (
                    <div className="product-badge sale" style={{ borderRadius: '0', background: 'var(--gold)', color: 'var(--noir)' }}>{activeProduct.discount}% OFF</div>
                  )}
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '20px', alignItems: 'start' }}>
                    <Link 
                      href={`/product/${activeProduct.slug}`} 
                      className="product-img-wrapper" 
                      style={{ aspectRatio: '0.85', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '40px 40px 0 0', overflow: 'hidden' }}
                    >
                      <img 
                        src={getOptimizedImageUrl(activeProduct.image, 300)} 
                        alt={activeProduct.title} 
                        className="product-img"
                        style={{ height: '100%', objectFit: 'cover' }}
                      />
                    </Link>

                    <div>
                      <span style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: '600', letterSpacing: '0.2em', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                        Olfactory Hotspot
                      </span>
                      <div className="product-notes" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', marginBottom: '4px' }}>
                        {activeProduct.notes ? activeProduct.notes.slice(0, 2).join(" • ") : "Luxury Notes"}
                      </div>
                      
                      <Link href={`/product/${activeProduct.slug}`}>
                        <h3 className="product-title" style={{ fontSize: '20px', fontFamily: 'var(--font-display)', color: 'var(--white)', fontWeight: 300 }}>
                          {activeProduct.title}
                        </h3>
                      </Link>

                      <div className="product-rating" style={{ marginTop: '6px' }}>
                        <div style={{ display: 'flex', gap: '2px' }}>
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className="rating-star" 
                              fill={i < Math.floor(activeProduct.rating) ? 'var(--gold)' : 'none'} 
                              color="var(--gold)" 
                              style={{ width: '11px', height: '11px' }}
                            />
                          ))}
                        </div>
                        <span className="rating-value" style={{ fontSize: '11px', color: 'var(--white)' }}>{activeProduct.rating}</span>
                      </div>
                    </div>
                  </div>

                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', margin: '18px 0 20px', lineStretch: '1.6', fontWeight: 300, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {activeProduct.description}
                  </p>

                  <div className="product-footer" style={{ borderTop: '1px solid rgba(201,168,76,0.2)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="price-box">
                      {activeProduct.price > activeProduct.salePrice && (
                        <span className="original-price" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>₹{activeProduct.price}</span>
                      )}
                      <span className="sale-price" style={{ color: 'var(--white)', fontSize: '22px', fontFamily: 'var(--font-display)' }}>
                        ₹{activeProduct.salePrice}
                      </span>
                    </div>
                    
                    {activeProduct.inStock !== false ? (
                      <motion.button 
                        className="btn-add-cart interactive-hover" 
                        onClick={() => addToCart(activeProduct)}
                        aria-label="Add featured product to bag"
                        whileTap={{ scale: 0.9 }}
                        whileHover={{ scale: 1.06 }}
                        style={{ background: 'var(--gold)', color: 'var(--noir)', border: 'none', borderRadius: '50%', width: '44px', height: '44px' }}
                      >
                        <ShoppingBag size={16} />
                      </motion.button>
                    ) : (
                      <button 
                        className="btn-add-cart" 
                        style={{ backgroundColor: 'rgba(255,255,255,0.1)', cursor: 'not-allowed', color: 'rgba(255,255,255,0.3)', border: 'none', borderRadius: '50%', width: '44px', height: '44px' }}
                        disabled
                        aria-label={`${activeProduct.title} Sold Out`}
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
