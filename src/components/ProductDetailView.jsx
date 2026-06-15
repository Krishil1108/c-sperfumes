'use client'

import React, { useState } from 'react';
import { useCart } from '../lib/CartContext';
import { Star, ShoppingBag, ChevronDown, ChevronUp } from 'lucide-react';

export default function ProductDetailView({ product }) {
  const { addToCart } = useCart();
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState('notes');

  // Interactive Reviews state
  const [reviews, setReviews] = useState([
    { id: 1, author: "Meera K.", rating: 5, date: "2 days ago", comment: "Absolutely exquisite! Smells incredibly elegant and expensive. The woody undertones last for over 10 hours." },
    { id: 2, author: "Aman R.", rating: 4, date: "1 week ago", comment: "Excellent projection. Received three compliments on my first day of wearing it. Highly recommend for evening wear." }
  ]);
  const [reviewerName, setReviewerName] = useState("");
  const [reviewerRating, setReviewerRating] = useState(5);
  const [reviewerText, setReviewerText] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Gallery images list (ensures fallback gallery is filled)
  const imagesList = (product.images && product.images.filter(Boolean).length > 0)
    ? product.images.filter(Boolean)
    : (product.image ? [product.image] : []);

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
    <div className="detail-grid">
      {/* Product Image Gallery */}
      <div className="gallery-wrapper">
        <div className="main-image-holder">
          <img 
            src={imagesList[activeImgIdx]} 
            alt={product.title} 
            className="main-image" 
          />
        </div>
        {imagesList.length > 1 && (
          <div className="thumbnails-holder">
            {imagesList.map((imgUrl, idx) => (
              <div 
                key={idx} 
                className={`thumb-holder ${idx === activeImgIdx ? 'active' : ''}`}
                onClick={() => setActiveImgIdx(idx)}
              >
                <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="thumb-image" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Details Info */}
      <div className="detail-info">
        <span style={{ fontSize: '12px', color: 'var(--color-accent)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          {product.category}
        </span>
        <h1 className="detail-title">{product.title}</h1>
        
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
          <span className="rating-count">({product.reviewsCount + reviews.length - 2} Customer Reviews)</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', margin: '8px 0' }}>
          <span className="sale-price" style={{ fontSize: '28px' }}>₹{product.salePrice}</span>
          {product.price > product.salePrice && (
            <>
              <span className="original-price" style={{ fontSize: '18px' }}>₹{product.price}</span>
              <span style={{ color: '#0ca678', fontSize: '14px', fontWeight: '600' }}>({product.discount}% OFF)</span>
            </>
          )}
        </div>

        <p style={{ color: 'var(--color-text-muted)', fontSize: '15px', lineHeight: '1.7' }}>
          {product.description}
        </p>

        {product.notes && (
          <div style={{ margin: '12px 0' }}>
            <span style={{ display: 'block', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', color: 'var(--color-primary)', marginBottom: '8px' }}>
              Scent Accords & Notes:
            </span>
            <div className="detail-notes">
              {product.notes.map((note, i) => (
                <span key={i} className="note-badge">{note}</span>
              ))}
            </div>
          </div>
        )}

        <div className="qty-selector-wrapper">
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: '40px', padding: '6px' }}>
            <button className="qty-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ padding: '4px' }}>
              -
            </button>
            <span className="qty-value" style={{ padding: '0 16px', minWidth: '40px', textAlign: 'center' }}>{quantity}</span>
            <button className="qty-btn" onClick={() => setQuantity(q => q + 1)} style={{ padding: '4px' }}>
              +
            </button>
          </div>

          <button className="add-cart-large" onClick={handleAddCart}>
            <ShoppingBag size={18} />
            <span>Add to Bag</span>
          </button>
        </div>

        {/* Product Details Accordion */}
        <div className="details-accordion">
          <div className={`accordion-item ${activeAccordion === 'notes' ? 'active' : ''}`}>
            <button className="accordion-trigger" onClick={() => toggleAccordion('notes')}>
              <span>Olfactory Profile</span>
              {activeAccordion === 'notes' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            <div className="accordion-content">
              This luxury fragrance opens with intense fresh notes, unfolding into an rich heart accord, and finishes on a deeply satisfying, long-lasting base that radiates hours of warm sillage. 100% natural organic extracts.
            </div>
          </div>

          <div className={`accordion-item ${activeAccordion === 'apply' ? 'active' : ''}`}>
            <button className="accordion-trigger" onClick={() => toggleAccordion('apply')}>
              <span>How To Apply</span>
              {activeAccordion === 'apply' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            <div className="accordion-content">
              Spray directly on pulse points: behind the ears, on your collarbones, and on your inner wrists. Do not rub the wrists together, as this breaks down the fragrance molecules, shortening its sillage lifespan.
            </div>
          </div>

          <div className={`accordion-item ${activeAccordion === 'shipping' ? 'active' : ''}`}>
            <button className="accordion-trigger" onClick={() => toggleAccordion('shipping')}>
              <span>Shipping & Premium Gifting</span>
              {activeAccordion === 'shipping' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            <div className="accordion-content">
              Orders are packaged inside an exquisite gold-embossed champagne cardboard sleeve. Standard delivery takes 3-5 business days. We provide free shipping for all online prepaid orders.
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="reviews-section">
          <h2>Customer Experience</h2>
          
          <div className="review-list">
            {reviews.map((rev) => (
              <div className="review-card" key={rev.id}>
                <div className="review-author-info">
                  <span className="review-author">{rev.author}</span>
                  <span className="review-date">{rev.date}</span>
                </div>
                <div style={{ display: 'flex', gap: '2px', marginBottom: '8px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="rating-star" 
                      fill={i < rev.rating ? '#ffb800' : 'none'} 
                      color="#ffb800" 
                      size={14}
                    />
                  ))}
                </div>
                <p className="review-text">{rev.comment}</p>
              </div>
            ))}
          </div>

          {/* Review Submission Form */}
          <form className="review-form" onSubmit={handleReviewSubmit}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Share Your Experience</h3>
            {reviewSubmitted && (
              <div style={{ color: '#0ca678', fontSize: '14px', fontWeight: '600', marginBottom: '16px' }}>
                Thank you! Your experience has been recorded and added to our logs.
              </div>
            )}
            <div className="checkout-form-grid" style={{ gridTemplateColumns: '1.2fr 0.8fr' }}>
              <div className="form-group">
                <label className="form-label">Your Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Scent Rating</label>
                <select 
                  className="form-input" 
                  value={reviewerRating}
                  onChange={(e) => setReviewerRating(e.target.value)}
                >
                  <option value={5}>5 Stars (Excellent)</option>
                  <option value={4}>4 Stars (Very Good)</option>
                  <option value={3}>3 Stars (Average)</option>
                  <option value={2}>2 Stars (Poor)</option>
                  <option value={1}>1 Star (Unsatisfactory)</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Review Details</label>
              <textarea 
                className="form-textarea" 
                value={reviewerText}
                onChange={(e) => setReviewerText(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-primary" style={{ padding: '12px 28px', fontSize: '13px' }}>
              Submit Scent Review
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
