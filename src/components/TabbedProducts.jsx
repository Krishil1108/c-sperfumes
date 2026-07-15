'use client'

import React, { useState } from 'react';
import { useCart } from '../lib/CartContext';
import { Star, ShoppingCart, X } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function TabbedProducts({ products }) {
  const [activeTab, setActiveTab] = useState('bestsellers');
  const { addToCart } = useCart();

  const filteredProducts = products.filter(p => {
    if (activeTab === 'bestsellers') return p.isBestseller;
    return p.isNewArrival;
  });

  return (
    <section className="section-padding" id="bestsellers">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">Exquisite Creations</span>
          <h2 className="section-title">Shop Our Collections</h2>
        </div>

        <div className="tab-container">
          <button 
            className={`tab-btn interactive-hover ${activeTab === 'bestsellers' ? 'active' : ''}`}
            onClick={() => setActiveTab('bestsellers')}
          >
            Bestsellers
          </button>
          <button 
            className={`tab-btn interactive-hover ${activeTab === 'new-arrivals' ? 'active' : ''}`}
            onClick={() => setActiveTab('new-arrivals')}
            id="new-arrivals"
          >
            New Arrivals
          </button>
        </div>

        <motion.div layout className="products-grid">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className={`product-card group interactive-hover transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(197,168,128,0.15)] ${product.inStock === false ? 'sold-out' : ''}`} 
                key={product.id}
              >
                {product.inStock === false && (
                  <div className="out-of-stock-label">Sold Out</div>
                )}
                {product.discount > 0 && product.inStock !== false && (
                  <div className="product-badge sale">{product.discount}% OFF</div>
                )}
                
                <Link href={`/product/${product.slug}`} className="product-img-wrapper overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.title} 
                    className="product-img transition-transform duration-700 group-hover:scale-105" 
                  />
                </Link>

                <div className="product-details">
                  <div className="product-notes">
                    {product.notes ? product.notes.slice(0, 3).join(" • ") : "Luxury"}
                  </div>
                  
                  <Link href={`/product/${product.slug}`}>
                    <h3 className="product-title group-hover:text-[var(--color-accent)] transition-colors">{product.title}</h3>
                  </Link>

                  <div className="product-rating">
                    <div style={{ display: 'flex' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className="rating-star" 
                          fill={i < Math.floor(product.rating) ? '#ffb800' : 'none'} 
                          color="#ffb800" 
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
                      <button 
                        className="btn-add-cart interactive-hover" 
                        onClick={() => addToCart(product)}
                        aria-label={`Add ${product.title} to bag`}
                      >
                        <ShoppingCart size={16} />
                      </button>
                    ) : (
                      <button 
                        className="btn-add-cart" 
                        style={{ backgroundColor: 'var(--color-border)', cursor: 'not-allowed', color: 'var(--color-text-muted)' }}
                        disabled
                        aria-label={`${product.title} Sold Out`}
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
