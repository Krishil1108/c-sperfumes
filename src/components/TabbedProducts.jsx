'use client'

import React, { useState } from 'react';
import { useCart } from '../lib/CartContext';
import { Star, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

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
            className={`tab-btn ${activeTab === 'bestsellers' ? 'active' : ''}`}
            onClick={() => setActiveTab('bestsellers')}
          >
            Bestsellers
          </button>
          <button 
            className={`tab-btn ${activeTab === 'new-arrivals' ? 'active' : ''}`}
            onClick={() => setActiveTab('new-arrivals')}
            id="new-arrivals"
          >
            New Arrivals
          </button>
        </div>

        <div className="products-grid">
          {filteredProducts.map((product) => (
            <div className="product-card" key={product.id}>
              {product.discount > 0 && (
                <div className="product-badge sale">{product.discount}% OFF</div>
              )}
              
              <Link href={`/product/${product.slug}`} className="product-img-wrapper">
                <img 
                  src={product.image} 
                  alt={product.title} 
                  className="product-img" 
                />
              </Link>

              <div className="product-details">
                <div className="product-notes">
                  {product.notes ? product.notes.slice(0, 3).join(" • ") : "Luxury"}
                </div>
                
                <Link href={`/product/${product.slug}`}>
                  <h3 className="product-title">{product.title}</h3>
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
                  
                  <button 
                    className="btn-add-cart" 
                    onClick={() => addToCart(product)}
                    aria-label={`Add ${product.title} to bag`}
                  >
                    <ShoppingCart size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
