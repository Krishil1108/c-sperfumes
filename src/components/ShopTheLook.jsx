'use client'

import React, { useState } from 'react';
import { useCart } from '../lib/CartContext';
import { Star, ShoppingCart, X } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

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
    <section className="section-padding shop-the-look">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">Visual Scent Finder</span>
          <h2 className="section-title">Shop The Fragrance Look</h2>
        </div>

        <div className="stl-container">
          <div className="stl-visualizer">
            <img 
              src={stlImage} 
              alt="Shop the Scent Portrait" 
              className="stl-image"
            />
            
            {hotspotProducts.map((p, idx) => {
              const coords = pinCoordinates[idx];
              return (
                <div 
                  key={p.id}
                  className={`hotspot-pin interactive-hover ${idx === activeIdx ? 'active' : ''}`}
                  style={{ top: `${coords.y}%`, left: `${coords.x}%` }}
                  onClick={() => setActiveIdx(idx)}
                >
                  <div className="hotspot-trigger">
                    <div className="hotspot-pulse"></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="stl-card-holder">
            <AnimatePresence mode="wait">
              {activeProduct && (
                <motion.div 
                  key={activeProduct.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`product-card group ${activeProduct.inStock === false ? 'sold-out' : ''}`} style={{ width: '100%' }}
                >
                  {activeProduct.inStock === false && (
                    <div className="out-of-stock-label">Sold Out</div>
                  )}
                  {activeProduct.discount > 0 && activeProduct.inStock !== false && (
                    <div className="product-badge sale">{activeProduct.discount}% OFF</div>
                  )}
                  
                  <Link href={`/product/${activeProduct.slug}`} className="product-img-wrapper overflow-hidden" style={{ maxHeight: '280px' }}>
                    <img 
                      src={activeProduct.image} 
                      alt={activeProduct.title} 
                      className="product-img transition-transform duration-700 group-hover:scale-105"
                    />
                  </Link>

                  <div className="product-details">
                    <span style={{ fontSize: '11px', color: 'var(--color-accent)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>
                      FEATURED SCENT
                    </span>
                    <div className="product-notes">
                      {activeProduct.notes ? activeProduct.notes.join(" • ") : "Luxury Notes"}
                    </div>
                    
                    <Link href={`/product/${activeProduct.slug}`}>
                      <h3 className="product-title group-hover:text-[var(--color-accent)] transition-colors" style={{ fontSize: '20px' }}>{activeProduct.title}</h3>
                    </Link>

                    <div className="product-rating">
                      <div style={{ display: 'flex' }}>
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className="rating-star" 
                            fill={i < Math.floor(activeProduct.rating) ? '#ffb800' : 'none'} 
                            color="#ffb800" 
                          />
                        ))}
                      </div>
                      <span className="rating-value">{activeProduct.rating}</span>
                    </div>

                    <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '20px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {activeProduct.description}
                    </p>

                    <div className="product-footer">
                      <div className="price-box">
                        {activeProduct.price > activeProduct.salePrice && (
                          <span className="original-price">₹{activeProduct.price}</span>
                        )}
                        <span className="sale-price">₹{activeProduct.salePrice}</span>
                      </div>
                      
                      {activeProduct.inStock !== false ? (
                        <button 
                          className="btn-add-cart interactive-hover" 
                          onClick={() => addToCart(activeProduct)}
                          aria-label="Add featured product to bag"
                        >
                          <ShoppingCart size={16} />
                        </button>
                      ) : (
                        <button 
                          className="btn-add-cart" 
                          style={{ backgroundColor: 'var(--color-border)', cursor: 'not-allowed', color: 'var(--color-text-muted)' }}
                          disabled
                          aria-label={`${activeProduct.title} Sold Out`}
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
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
