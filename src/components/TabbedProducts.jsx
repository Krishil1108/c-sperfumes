'use client'

import React, { useState } from 'react';
import { useCart } from '../lib/CartContext';
import { Star, ShoppingCart, X } from 'lucide-react';
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
          <span className="section-subtitle">Exquisite Creations</span>
          <h2 className="section-title">Our Collections</h2>
          <div className="divider-gold" style={{ marginTop: '16px' }}></div>
        </div>

        {/* Animated Tab Bar */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '48px' }}>
          <div style={{ display: 'inline-flex', position: 'relative', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
            {tabs.map((tab) => (
              <button
                key={tab.key}
                id={tab.id}
                onClick={() => handleTabChange(tab.key)}
                style={{
                  position: 'relative',
                  padding: '14px 36px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-label)',
                  fontSize: '11px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.18em',
                  color: activeTab === tab.key ? 'var(--text-dark)' : 'var(--text-muted)',
                  transition: 'color 0.25s ease',
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
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
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
                  x: dir > 0 ? 60 : -60,
                  opacity: 0,
                }),
                center: {
                  x: 0,
                  opacity: 1,
                },
                exit: (dir) => ({
                  x: dir > 0 ? -60 : 60,
                  opacity: 0,
                }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 280, damping: 30 },
                opacity: { duration: 0.22 },
              }}
              className="products-grid"
            >
              {filteredProducts.map((product, idx) => (
                <motion.div
                  key={product.id}
                  className={`product-card ${product.inStock === false ? 'sold-out' : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                  style={{ position: 'relative' }}
                >
                  {product.inStock === false && <div className="out-of-stock-label">Sold Out</div>}
                  {product.discount > 0 && product.inStock !== false && (
                    <div className="product-badge sale">{product.discount}% OFF</div>
                  )}

                  <Link href={`/product/${product.slug}`} className="product-img-wrapper" style={{ display: 'block', position: 'relative', overflow: 'hidden' }}>
                    <img
                      src={getOptimizedImageUrl(product.image, 400)}
                      alt={product.title}
                      className="product-img"
                    />
                    <div className="royal-quick-add">Quick View</div>
                  </Link>

                  <div className="product-details">
                    <div className="product-notes">
                      {product.notes ? product.notes.slice(0, 3).join(' · ') : 'Luxury Fragrance'}
                    </div>

                    <Link href={`/product/${product.slug}`}>
                      <h3 className="product-title">{product.title}</h3>
                    </Link>

                    <div className="product-rating">
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="rating-star"
                            fill={i < Math.floor(product.rating) ? 'var(--gold)' : 'none'}
                            color="var(--gold)"
                          />
                        ))}
                      </div>
                      <span className="rating-value">{product.rating}</span>
                      <span className="rating-count">({product.reviewsCount})</span>
                    </div>

                    <div className="product-footer">
                      <div className="price-box">
                        {product.price > product.salePrice && (
                          <span className="original-price">₹{product.price}</span>
                        )}
                        <span className="sale-price">₹{product.salePrice}</span>
                      </div>

                      {product.inStock !== false ? (
                        <motion.button
                          className="btn-add-cart interactive-hover"
                          onClick={() => addToCart(product)}
                          aria-label={`Add ${product.title} to bag`}
                          whileTap={{ scale: 0.88 }}
                          whileHover={{ scale: 1.08 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        >
                          <ShoppingCart size={15} />
                        </motion.button>
                      ) : (
                        <button
                          className="btn-add-cart"
                          style={{ background: 'rgba(0,0,0,0.08)', cursor: 'not-allowed', color: 'var(--text-muted)' }}
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
        <div style={{ textAlign: 'center', marginTop: '52px' }}>
          <Link href="/shop" className="btn-outline" style={{ display: 'inline-flex', color: 'var(--text-dark)', border: '1px solid rgba(0,0,0,0.15)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.15)'; e.currentTarget.style.color = 'var(--text-dark)'; }}>
            <span>View All Fragrances</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
