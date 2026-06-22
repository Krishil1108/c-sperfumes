'use client'

import React, { useState, useRef } from 'react';
import { useCart } from '../lib/CartContext';
import { Star, ShoppingBag, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LivingBottle from './LivingBottle';
import MagneticButton from './MagneticButton';

export default function ProductDetailView({ product }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState('notes');
  const carouselRef = useRef(null);

  // Interactive Reviews state
  const [reviews, setReviews] = useState([
    { id: 1, author: "Meera K.", rating: 5, date: "2 days ago", comment: "Absolutely exquisite! Smells incredibly elegant and expensive. The woody undertones last for over 10 hours." },
    { id: 2, author: "Aman R.", rating: 4, date: "1 week ago", comment: "Excellent projection. Received three compliments on my first day of wearing it. Highly recommend for evening wear." },
    { id: 3, author: "Sarah L.", rating: 5, date: "2 weeks ago", comment: "The packaging alone is worth it. But the scent is another level. Very mature and sophisticated." },
  ]);
  const [reviewerName, setReviewerName] = useState("");
  const [reviewerRating, setReviewerRating] = useState(5);
  const [reviewerText, setReviewerText] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const mainImage = product.images && product.images[0] ? product.images[0] : product.image;

  const handleAddCart = () => {
    addToCart(product, quantity);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (reviewerName.trim() && reviewerText.trim()) {
      const newReview = {
        id: Date.now(),
        author: reviewerName,
        rating: parseInt(reviewerRating),
        date: "Just now",
        comment: reviewerText
      };
      setReviews([newReview, ...reviews]);
      setReviewerName("");
      setReviewerText("");
      setReviewSubmitted(true);
      setTimeout(() => setReviewSubmitted(false), 5000);
    }
  };

  const toggleAccordion = (section) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  return (
    <div className="product-page-container">
      {/* Cinematic Sticky Left Column */}
      <div className="product-visuals-col">
        <LivingBottle image={mainImage} alt={product.title} />
      </div>

      {/* Scrolling Right Column */}
      <div className="product-details-col">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="product-header-block"
        >
          <span className="product-category-tag">{product.category}</span>
          <h1 className="product-main-title font-serif">{product.title}</h1>
          <div className="title-divider"></div>
          
          <div className="product-rating interactive-hover">
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
            <span className="rating-count">({product.reviewsCount + reviews.length - 2} Reviews)</span>
          </div>

          <div className="product-price-block">
            <span className="sale-price">₹{product.salePrice}</span>
            {product.price > product.salePrice && (
              <>
                <span className="original-price">₹{product.price}</span>
                <span className="discount-tag">({product.discount}% OFF)</span>
              </>
            )}
          </div>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="product-description-text"
        >
          {product.description}
        </motion.p>

        {product.notes && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="product-notes-block"
          >
            <span className="notes-label">Scent Accords & Notes:</span>
            <div className="detail-notes">
              {product.notes.map((note, i) => (
                <span key={i} className="note-badge">{note}</span>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="product-action-block"
        >
          <div className="qty-selector">
            <button className="qty-btn interactive-hover" onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
            <span className="qty-value">{quantity}</span>
            <button className="qty-btn interactive-hover" onClick={() => setQuantity(q => q + 1)}>+</button>
          </div>

          <MagneticButton className="add-cart-magnetic" onClick={handleAddCart}>
            <span className="btn-glow"></span>
            <ShoppingBag size={20} className="relative z-10" />
            <span className="relative z-10 font-bold uppercase tracking-widest text-sm">Add to Bag</span>
          </MagneticButton>
        </motion.div>

        {/* Animated Accordions */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="details-accordion mt-12"
        >
          {['notes', 'apply', 'shipping'].map((section) => {
            const labels = { notes: "Olfactory Profile", apply: "How To Apply", shipping: "Shipping & Gifting" };
            const content = {
              notes: "This luxury fragrance opens with intense fresh notes, unfolding into an rich heart accord, and finishes on a deeply satisfying, long-lasting base that radiates hours of warm sillage. 100% natural organic extracts.",
              apply: "Spray directly on pulse points: behind the ears, on your collarbones, and on your inner wrists. Do not rub the wrists together, as this breaks down the fragrance molecules, shortening its sillage lifespan.",
              shipping: "Orders are packaged inside an exquisite gold-embossed champagne cardboard sleeve. Standard delivery takes 3-5 business days. We provide free shipping for all online prepaid orders."
            };
            
            return (
              <div className="accordion-item" key={section}>
                <button className="accordion-trigger interactive-hover" onClick={() => toggleAccordion(section)}>
                  <span>{labels[section]}</span>
                  <motion.div animate={{ rotate: activeAccordion === section ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    <ChevronDown size={18} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {activeAccordion === section && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="accordion-content-wrapper overflow-hidden"
                    >
                      <div className="accordion-content-inner">
                        {content[section]}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </motion.div>

        {/* Ultra-Premium Reviews Section */}
        <div className="luxury-reviews-section">
          <div className="reviews-header">
            <h2 className="reviews-title">Scent Experiences</h2>
            <span className="reviews-count">{reviews.length} Entries</span>
          </div>
          
          <div className="reviews-list">
            {reviews.map((rev) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="review-entry" 
                key={rev.id}
              >
                <div className="review-quote-mark">"</div>
                
                <p className="review-comment">
                  {rev.comment}
                </p>
                
                <div className="review-author-block">
                  <div className="review-stars">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} fill={i < rev.rating ? '#c5a880' : 'none'} color="#c5a880" size={14} />
                    ))}
                  </div>
                  <div className="review-divider"></div>
                  <div className="review-meta">
                    <span className="review-author-name">{rev.author}</span>
                    <span className="review-date-text">{rev.date}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Refined Soft-Tone Review Form */}
          <div className="luxury-form-container">
            <div className="luxury-form-bg-blob"></div>
            
            <div className="luxury-form-content">
              <h3 className="form-title">Leave your signature</h3>
              <p className="form-subtitle">Share your olfactory journey with our community.</p>
              
              {reviewSubmitted && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="form-success-msg"
                >
                  Your experience has been elegantly recorded. Thank you.
                </motion.div>
              )}
              
              <form onSubmit={handleReviewSubmit} className="luxury-form">
                <div className="form-grid-2">
                  <div className="input-wrapper">
                    <input 
                      type="text" 
                      className="elegant-input" 
                      placeholder="Your Name" 
                      value={reviewerName} 
                      onChange={(e) => setReviewerName(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="input-wrapper">
                    <select 
                      className="elegant-input" 
                      value={reviewerRating} 
                      onChange={(e) => setReviewerRating(e.target.value)}
                    >
                      <option value={5}>5 Stars (Exceptional)</option>
                      <option value={4}>4 Stars (Splendid)</option>
                      <option value={3}>3 Stars (Fair)</option>
                    </select>
                  </div>
                </div>
                <div className="input-wrapper">
                  <textarea 
                    className="elegant-textarea" 
                    placeholder="Detail your sensory experience..." 
                    value={reviewerText} 
                    onChange={(e) => setReviewerText(e.target.value)} 
                    required 
                  />
                </div>
                <div className="form-submit-wrapper">
                  <button type="submit" className="elegant-submit-btn">
                    Submit Experience
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
