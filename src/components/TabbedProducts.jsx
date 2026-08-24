'use client'

import React, { useState } from 'react';
import { useCart } from '../lib/CartContext';
import { Star, ShoppingBag, X } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { getOptimizedImageUrl } from '../lib/image';

export default function TabbedProducts({ products }) {
  const [activeTab, setActiveTab] = useState('bestsellers');
  const [direction, setDirection] = useState(1); // 1 = right→left, -1 = left→right
  const { addToCart } = useCart();

  const filteredProducts = products.filter(p => {
    if (activeTab === 'bestsellers') return p.isBestseller;
    return p.isNewArrival;
  });

  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    setDirection(tab === 'new-arrivals' ? 1 : -1);
    setActiveTab(tab);
  };

  const tabs = [
    { key: 'bestsellers', label: 'Bestsellers' },
    { key: 'new-arrivals', label: 'New Arrivals', id: 'new-arrivals' },
  ];

  return (
    <section className="section-padding" id="bestsellers" style={{ background: 'var(--cream)', overflow: 'hidden' }}>
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle" style={{ letterSpacing: '0.35em', fontSize: '10px' }}>Exquisite Creations</span>
          <h2 className="section-title" style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}>Olfactory Masterpieces</h2>
          <div className="divider-gold" style={{ marginTop: '16px' }}></div>
        </div>

        {/* Animated Tab Bar */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '56px' }}>
          <div style={{ display: 'inline-flex', position: 'relative', borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
            {tabs.map((tab) => (
              <button
                key={tab.key}
                id={tab.id}
                onClick={() => handleTabChange(tab.key)}
                style={{
                  position: 'relative',
                  padding: '16px clamp(16px, 4.5vw, 40px)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-label)',
                  fontSize: '11px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.22em',
                  color: activeTab === tab.key ? 'var(--text-dark)' : 'var(--text-muted)',
                  transition: 'color 0.3s ease',
                }}
              >
                {tab.label}
                {/* Animated gold underline */}
                <AnimatePresence>
                  {activeTab === tab.key && (
                    <motion.span
                      layoutId="tab-underline"
                      style={{
                        position: 'absolute',
                        bottom: '-1px',
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: 'var(--gold)',
                        borderRadius: '2px 2px 0 0',
                      }}
                      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                    />
                  )}
                </AnimatePresence>
              </button>
            ))}
          </div>
        </div>

        {/* Animated Products Grid */}
        <div style={{ position: 'relative' }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeTab}
              custom={direction}
              variants={{
                enter: (dir) => ({
                  x: dir > 0 ? 40 : -40,
                  opacity: 0,
                }),
                center: {
                  x: 0,
                  opacity: 1,
                },
                exit: (dir) => ({
                  x: dir > 0 ? -40 : 40,
                  opacity: 0,
                }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 28 },
                opacity: { duration: 0.2 },
              }}
              className="products-grid"
            >
              {filteredProducts.map((product, idx) => (
                <motion.div
                  key={product.id || product._id || idx}
                  className={`product-card-elevated ${product.inStock === false ? 'sold-out' : ''}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  {product.inStock === false && <div className="out-of-stock-label" style={{ borderRadius: '0' }}>Sold Out</div>}
                  {product.discount > 0 && product.inStock !== false && (
                    <div className="product-badge sale" style={{ borderRadius: '0' }}>{product.discount}% OFF</div>
                  )}

                  <Link 
                    href={`/product/${product.slug}`} 
                    className="product-img-wrapper" 
                    style={{ position: 'relative', overflow: 'hidden' }}
                  >
                    <img
                      src={getOptimizedImageUrl(product.image, 400)}
                      alt={product.title}
                      className="product-img"
                    />
                    <div className="royal-quick-add" style={{ fontStyle: 'italic', letterSpacing: '0.25em' }}>View Essence</div>
                  </Link>

                  <div className="product-details">
                    <div className="product-notes" style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', fontStyle: 'italic' }}>
                      {product.notes ? product.notes.slice(0, 2).join(' · ') : 'Luxury Note'}
                    </div>

                    <Link href={`/product/${product.slug}`} style={{ marginTop: '4px' }}>
                      <h3 className="product-title" style={{ fontWeight: '400', fontFamily: 'var(--font-display)', fontSize: '18px' }}>
                        {product.title}
                      </h3>
                    </Link>

                    <div className="product-rating" style={{ marginTop: '8px' }}>
                      <div style={{ display: 'flex', gap: '3px' }}>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="rating-star"
                            fill={i < Math.floor(product.rating) ? 'var(--gold)' : 'none'}
                            color="var(--gold)"
                            style={{ width: '11px', height: '11px' }}
                          />
                        ))}
                      </div>
                      <span className="rating-value" style={{ fontSize: '11px', fontWeight: '500', marginLeft: '4px' }}>{product.rating}</span>
                      <span className="rating-count" style={{ fontSize: '10px' }}>({product.reviewsCount})</span>
                    </div>

                    <div className="product-footer">
                      <div className="price-box">
                        {product.price > product.salePrice && (
                          <span className="original-price" style={{ fontSize: '11px' }}>₹{product.price}</span>
                        )}
                        <span className="sale-price" style={{ fontSize: '20px', fontFamily: 'var(--font-display)', color: 'var(--text-dark)' }}>
                          ₹{product.salePrice}
                        </span>
                      </div>

                      {product.inStock !== false ? (
                        <motion.button
                          className="btn-add-cart interactive-hover"
                          onClick={() => addToCart(product)}
                          aria-label={`Add ${product.title} to bag`}
                          whileTap={{ scale: 0.88 }}
                          whileHover={{ scale: 1.08 }}
                          transition={{ type: 'spring', stiffness: 450, damping: 18 }}
                          style={{ width: '42px', height: '42px' }}
                        >
                          <ShoppingBag size={15} />
                        </motion.button>
                      ) : (
                        <button
                          className="btn-add-cart"
                          style={{ background: 'rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.05)', cursor: 'not-allowed', color: 'var(--text-muted)', width: '42px', height: '42px' }}
                          disabled
                        >
                          <X size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* View All CTA */}
        <div style={{ textAlign: 'center', marginTop: '56px' }}>
          <Link 
            href="/shop" 
            className="btn-outline" 
            style={{ 
              display: 'inline-flex', 
              color: 'var(--text-dark)', 
              borderColor: 'rgba(201, 168, 76, 0.4)', 
              background: 'transparent',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.background = 'rgba(201, 168, 76, 0.05)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(201, 168, 76, 0.4)'; e.currentTarget.style.background = 'transparent'; }}
          >
            <span>Reveal All Scents</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
