'use client'

import React, { useState, useEffect } from 'react';
import { useCart } from '../lib/CartContext';
import { Star, ShoppingBag, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getOptimizedImageUrl } from '../lib/image';
import Link from 'next/link';

export default function ProductDetailView({ product }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState('notes');
  const [activeImg, setActiveImg] = useState(0);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  const [reviews, setReviews] = useState([
    { id: 1, author: "Meera K.", rating: 5, date: "2 days ago", comment: "Absolutely exquisite! The woody undertones last for over 10 hours. A true investment fragrance." },
    { id: 2, author: "Aman R.", rating: 4, date: "1 week ago", comment: "Excellent projection. Received three compliments on my first day. Highly recommend for evening wear." },
    { id: 3, author: "Sarah L.", rating: 5, date: "2 weeks ago", comment: "The packaging alone is worth it. But the scent is another level — very mature and sophisticated." },
  ]);
  const [reviewerName, setReviewerName] = useState("");
  const [reviewerRating, setReviewerRating] = useState(5);
  const [reviewerText, setReviewerText] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  useEffect(() => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'ViewContent', {
        content_ids: [product.id || product._id || product.slug],
        content_name: product.title,
        content_category: product.category,
        currency: 'INR',
        value: product.salePrice
      });
    }
  }, [product]);

  const handleAddCart = () => {
    addToCart(product, quantity);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2200);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (reviewerName.trim() && reviewerText.trim()) {
      setReviews([{ id: Date.now(), author: reviewerName, rating: parseInt(reviewerRating), date: "Just now", comment: reviewerText }, ...reviews]);
      setReviewerName(""); setReviewerText(""); setReviewSubmitted(true);
      setTimeout(() => setReviewSubmitted(false), 5000);
    }
  };

  const toggleAccordion = (section) => setActiveAccordion(activeAccordion === section ? null : section);

  const accordionData = [
    {
      key: 'notes',
      label: 'Olfactory Profile',
      content: "This luxury fragrance opens with intense fresh notes, unfolding into a rich heart accord, and finishes on a deeply satisfying, long-lasting base that radiates hours of warm sillage. 100% natural organic extracts. Free of synthetic phthalates and parabens."
    },
    {
      key: 'apply',
      label: 'How To Apply',
      content: "Spray directly on pulse points: behind the ears, on your collarbones, and on your inner wrists. Do not rub the wrists together — this breaks down the fragrance molecules, shortening its sillage lifespan. Apply after moisturising for longer lasting wear."
    },
    {
      key: 'shipping',
      label: 'Shipping & Gifting',
      content: "Orders are packaged inside an exquisite gold-embossed champagne cardboard sleeve. Standard delivery: 3-5 business days. Free shipping on all prepaid orders. Gift message cards available on request."
    }
  ];

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <div className="container" style={{ padding: '18px 32px' }}>
        <nav style={{ fontFamily: 'var(--font-label)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-muted)', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Link href="/" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }}>Home</Link>
          <span style={{ opacity: '0.4' }}>›</span>
          <Link href="/shop" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }}>Shop</Link>
          <span style={{ opacity: '0.4' }}>›</span>
          <span style={{ color: 'var(--text-dark)' }}>{product.title}</span>
        </nav>
      </div>

      {/* Product Hero */}
      <div className="container" style={{ padding: '0 32px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '72px', alignItems: 'start' }} className="detail-main-grid">

          {/* Left: Image Gallery */}
          <div style={{ position: 'sticky', top: 'calc(var(--header-height) + var(--announcement-height) + 24px)' }}>
            {/* Main Image with Arch Masking */}
            <div style={{ 
              background: 'radial-gradient(circle, var(--cream) 0%, var(--pearl) 100%)', 
              aspectRatio: '0.82', 
              overflow: 'hidden', 
              position: 'relative', 
              marginBottom: '18px',
              borderRadius: '260px 260px 0 0',
              border: '1px solid rgba(201,168,76,0.25)',
              boxShadow: 'var(--shadow-gold)'
            }}>
              <motion.img
                key={activeImg}
                src={getOptimizedImageUrl(images[activeImg], 800)}
                alt={product.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
              {product.discount > 0 && product.inStock !== false && (
                <div style={{ position: 'absolute', top: '30px', left: '50%', transform: 'translateX(-50%)', background: 'var(--gold)', color: 'var(--noir)', fontFamily: 'var(--font-label)', fontSize: '10px', fontWeight: '700', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '5px 12px' }}>
                  {product.discount}% OFF
                </div>
              )}
              {product.inStock === false && (
                <div style={{ position: 'absolute', inset: '0', background: 'rgba(10,10,10,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-label)', fontSize: '12px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.9)' }}>Sold Out</span>
                </div>
              )}
            </div>

            {/* Thumbnails with Arch shapes */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    style={{ 
                      width: '76px', 
                      height: '92px', 
                      border: i === activeImg ? '1.5px solid var(--gold)' : '1px solid rgba(201,168,76,0.15)', 
                      background: 'var(--pearl)', 
                      overflow: 'hidden', 
                      cursor: 'pointer', 
                      padding: '0', 
                      transition: 'all 0.3s ease', 
                      flexShrink: '0',
                      borderRadius: '36px 36px 0 0',
                      boxShadow: i === activeImg ? 'var(--shadow-gold)' : 'none'
                    }}>
                    <img src={getOptimizedImageUrl(img, 200)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div style={{ paddingTop: '8px' }}>
            <span style={{ fontFamily: 'var(--font-label)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.28em', color: 'var(--gold)', display: 'block', marginBottom: '14px' }}>
              {product.category || 'C&S Perfumes'}
            </span>

            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 4.5vw, 52px)', fontWeight: '300', color: 'var(--text-dark)', lineHeight: '1.1', marginBottom: '20px' }}>
              {product.title}
            </h1>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '3px' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} fill={i < Math.floor(product.rating) ? 'var(--gold)' : 'none'} color="var(--gold)" />
                ))}
              </div>
              <span style={{ fontFamily: 'var(--font-label)', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
                {product.rating} · {product.reviewsCount + reviews.length - 3} reviews
              </span>
            </div>

            {/* Gold divider */}
            <div style={{ width: '48px', height: '1px', background: 'linear-gradient(90deg, transparent, var(--gold), transparent)', marginBottom: '24px' }} />

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', marginBottom: '28px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '38px', fontWeight: '400', color: 'var(--text-dark)' }}>₹{product.salePrice}</span>
              {product.price > product.salePrice && (
                <>
                  <span style={{ fontFamily: 'var(--font-label)', fontSize: '15px', textDecoration: 'line-through', color: 'var(--text-muted)' }}>₹{product.price}</span>
                  <span style={{ fontFamily: 'var(--font-label)', fontSize: '11px', fontWeight: '700', background: 'var(--gold)', color: 'var(--noir)', padding: '3px 10px', letterSpacing: '0.1em' }}>
                    {product.discount}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p style={{ fontSize: '15px', lineHeight: '1.8', color: 'var(--text-muted)', fontWeight: '300', marginBottom: '28px' }}>
              {product.description}
            </p>

            {/* Scent Notes (Accords) */}
            {product.notes && (
              <div style={{ marginBottom: '28px' }}>
                <span style={{ fontFamily: 'var(--font-label)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.22em', color: 'var(--text-muted)', display: 'block', marginBottom: '12px' }}>
                  Scent Accords
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {product.notes.map((note, i) => (
                    <span key={i} style={{ 
                      fontFamily: 'var(--font-label)', 
                      fontSize: '10px', 
                      padding: '8px 18px', 
                      border: '1px solid rgba(201,168,76,0.2)', 
                      color: 'var(--text-dark)', 
                      letterSpacing: '0.12em', 
                      textTransform: 'uppercase', 
                      transition: 'all 0.3s ease', 
                      cursor: 'default',
                      borderRadius: '16px 16px 0 0',
                      background: 'transparent'
                    }}
                      onMouseEnter={e => { e.target.style.borderColor = 'var(--gold)'; e.target.style.background = 'rgba(201,168,76,0.06)'; e.target.style.boxShadow = '0 4px 12px rgba(201,168,76,0.05)'; }}
                      onMouseLeave={e => { e.target.style.borderColor = 'rgba(201,168,76,0.2)'; e.target.style.background = 'transparent'; e.target.style.boxShadow = 'none'; }}>
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Concentration badge */}
            {product.concentration && (
              <div style={{ marginBottom: '28px' }}>
                <span style={{ fontFamily: 'var(--font-label)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.22em', color: 'var(--text-muted)', display: 'block', marginBottom: '10px' }}>
                  Concentration
                </span>
                <span style={{ 
                  fontFamily: 'var(--font-label)', 
                  fontSize: '11px', 
                  padding: '8px 20px', 
                  border: '1px solid var(--border-light)', 
                  color: 'var(--text-dark)', 
                  letterSpacing: '0.15em', 
                  textTransform: 'uppercase', 
                  display: 'inline-block', 
                  background: 'rgba(201,168,76,0.06)',
                  borderRadius: '16px 16px 0 0'
                }}>
                  {product.concentration}
                </span>
              </div>
            )}

            {/* Qty + Add to Cart */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '36px', alignItems: 'stretch' }}>
              {/* Qty selector */}
              <div style={{ display: 'flex', border: '1px solid rgba(201,168,76,0.25)', background: 'var(--white)', opacity: product.inStock === false ? '0.5' : '1' }}>
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={product.inStock === false}
                  style={{ width: '44px', height: '52px', border: 'none', background: 'transparent', fontSize: '18px', color: 'var(--text-dark)', cursor: 'pointer', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.target.style.background = 'var(--pearl)'}
                  onMouseLeave={e => e.target.style.background = 'transparent'}>−</button>
                <span style={{ width: '44px', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-label)', fontSize: '13px', fontWeight: '600', borderLeft: '1px solid rgba(201,168,76,0.15)', borderRight: '1px solid rgba(201,168,76,0.15)' }}>
                  {product.inStock === false ? 0 : quantity}
                </span>
                <button onClick={() => setQuantity(q => q + 1)} disabled={product.inStock === false}
                  style={{ width: '44px', height: '52px', border: 'none', background: 'transparent', fontSize: '18px', color: 'var(--text-dark)', cursor: 'pointer', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.target.style.background = 'var(--pearl)'}
                  onMouseLeave={e => e.target.style.background = 'transparent'}>+</button>
              </div>

              {/* Add to Bag */}
              {product.inStock !== false ? (
                <button onClick={handleAddCart}
                  style={{ flex: '1', background: addedFeedback ? 'var(--gold)' : 'var(--noir)', color: addedFeedback ? 'var(--noir)' : 'var(--white)', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', fontFamily: 'var(--font-label)', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.22em', transition: 'all 0.3s ease', height: '52px' }}
                  onMouseEnter={e => { if (!addedFeedback) e.target.style.background = 'var(--gold)'; e.target.style.color = 'var(--noir)'; }}
                  onMouseLeave={e => { if (!addedFeedback) e.target.style.background = 'var(--noir)'; e.target.style.color = 'var(--white)'; }}>
                  {addedFeedback ? <><Check size={16} /> Added to Bag</> : <><ShoppingBag size={16} /> Add to Bag</>}
                </button>
              ) : (
                <button disabled style={{ flex: '1', background: 'rgba(0,0,0,0.08)', color: 'var(--text-muted)', border: 'none', cursor: 'not-allowed', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', fontFamily: 'var(--font-label)', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.22em', height: '52px' }}>
                  <ShoppingBag size={16} /> Sold Out
                </button>
              )}
            </div>

            {/* Trust micro-badges */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '36px' }}>
              {['🌿 Organic', '🐰 Cruelty-Free', '🚚 Free Shipping'].map((badge, i) => (
                <div key={i} style={{ border: '1px solid rgba(201,168,76,0.15)', padding: '12px 8px', textAlign: 'center', fontFamily: 'var(--font-label)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', background: 'var(--white)' }}>
                  {badge}
                </div>
              ))}
            </div>

            {/* Accordions */}
            <div style={{ borderTop: '1px solid rgba(201,168,76,0.2)' }}>
              {accordionData.map(({ key, label, content }) => (
                <div key={key} style={{ borderBottom: '1px solid rgba(201,168,76,0.2)' }}>
                  <button onClick={() => toggleAccordion(key)}
                    style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 0', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-label)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.18em', color: activeAccordion === key ? 'var(--gold)' : 'var(--text-muted)', fontWeight: '600', transition: 'color 0.2s' }}>
                    <span>{label}</span>
                    {activeAccordion === key ? <ChevronUp size={16} color="var(--gold)" /> : <ChevronDown size={16} />}
                  </button>
                  <AnimatePresence>
                    {activeAccordion === key && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                        style={{ overflow: 'hidden' }}>
                        <p style={{ paddingBottom: '18px', fontSize: '14px', lineHeight: '1.8', color: 'var(--text-muted)', fontWeight: '300' }}>
                          {content}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div style={{ marginTop: '80px', paddingTop: '64px', borderTop: '1px solid rgba(201,168,76,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '48px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: '300', color: 'var(--text-dark)' }}>Scent Experiences</h2>
            <span style={{ fontFamily: 'var(--font-label)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--gold)' }}>{reviews.length} Reviews</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '64px' }} className="reviews-grid">
            {reviews.map((rev) => (
              <div key={rev.id} style={{ 
                background: 'var(--white)', 
                padding: '28px', 
                border: '1px solid rgba(201,168,76,0.15)', 
                position: 'relative', 
                transition: 'all 0.3s ease'
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.boxShadow = 'var(--shadow-gold)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.15)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '56px', fontWeight: '300', color: 'rgba(201,168,76,0.15)', lineHeight: '1', display: 'block', marginBottom: '-12px', marginTop: '-8px' }}>"</span>
                <p style={{ fontSize: '14px', lineHeight: '1.8', color: 'var(--text-muted)', fontWeight: '300', fontStyle: 'italic', marginBottom: '20px' }}>{rev.comment}</p>
                <div style={{ display: 'flex', gap: '2px', marginBottom: '12px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={11} fill={i < rev.rating ? 'var(--gold)' : 'none'} color="var(--gold)" />
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-label)', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-dark)' }}>{rev.author}</span>
                  <span style={{ fontFamily: 'var(--font-label)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>{rev.date}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Review Form */}
          <div style={{ background: 'var(--charcoal)', padding: '52px', maxWidth: '680px', border: '1px solid rgba(201,168,76,0.2)', boxShadow: 'var(--shadow-gold)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: '300', color: 'var(--white)', marginBottom: '8px' }}>Leave Your Signature</h3>
            <p style={{ fontFamily: 'var(--font-label)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--gold)', marginBottom: '32px' }}>Share your olfactory journey</p>

            {reviewSubmitted && (
              <div style={{ background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.3)', padding: '14px 18px', marginBottom: '24px', fontFamily: 'var(--font-label)', fontSize: '11px', color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                ✓ Your experience has been recorded. Thank you.
              </div>
            )}

            <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <input 
                  type="text" 
                  value={reviewerName} 
                  onChange={e => setReviewerName(e.target.value)} 
                  placeholder="Your Name" 
                  required
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  style={{ 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    background: 'rgba(255,255,255,0.05)', 
                    padding: '14px 16px', 
                    fontFamily: 'var(--font-body)', 
                    fontSize: '14px', 
                    color: 'var(--white)', 
                    outline: 'none', 
                    transition: 'border-color 0.22s, box-shadow 0.22s' 
                  }}
                  onMouseEnter={e => e.target.style.borderColor = 'rgba(201,168,76,0.3)'}
                  onMouseLeave={e => { if (document.activeElement !== e.target) e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                  onFocusCapture={e => { e.target.style.borderColor = 'var(--gold)'; e.target.style.boxShadow = '0 0 0 3px rgba(201,168,76,0.1)'; }}
                  onBlurCapture={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                />
                
                <select 
                  value={reviewerRating} 
                  onChange={e => setReviewerRating(e.target.value)}
                  style={{ 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    background: 'rgba(255,255,255,0.05)', 
                    padding: '14px 16px', 
                    fontFamily: 'var(--font-body)', 
                    fontSize: '14px', 
                    color: 'var(--white)', 
                    outline: 'none', 
                    cursor: 'pointer',
                    transition: 'border-color 0.2s'
                  }}
                  onMouseEnter={e => e.target.style.borderColor = 'rgba(201,168,76,0.3)'}
                  onMouseLeave={e => { if (document.activeElement !== e.target) e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                  onFocusCapture={e => e.target.style.borderColor = 'var(--gold)'}
                  onBlurCapture={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                >
                  <option value={5} style={{ background: 'var(--charcoal)', color: 'var(--white)' }}>5 Stars — Exceptional</option>
                  <option value={4} style={{ background: 'var(--charcoal)', color: 'var(--white)' }}>4 Stars — Splendid</option>
                  <option value={3} style={{ background: 'var(--charcoal)', color: 'var(--white)' }}>3 Stars — Fair</option>
                </select>
              </div>

              <textarea 
                value={reviewerText} 
                onChange={e => setReviewerText(e.target.value)} 
                placeholder="Detail your sensory experience..." 
                required 
                rows={4}
                style={{ 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  background: 'rgba(255,255,255,0.05)', 
                  padding: '14px 16px', 
                  fontFamily: 'var(--font-body)', 
                  fontSize: '14px', 
                  color: 'var(--white)', 
                  outline: 'none', 
                  resize: 'vertical', 
                  transition: 'border-color 0.22s, box-shadow 0.22s' 
                }}
                onMouseEnter={e => e.target.style.borderColor = 'rgba(201,168,76,0.3)'}
                onMouseLeave={e => { if (document.activeElement !== e.target) e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                onFocusCapture={e => { e.target.style.borderColor = 'var(--gold)'; e.target.style.boxShadow = '0 0 0 3px rgba(201,168,76,0.1)'; }}
                onBlurCapture={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
              />

              <button 
                type="submit" 
                style={{ 
                  background: 'var(--gold)', 
                  color: 'var(--noir)', 
                  border: 'none', 
                  padding: '14px 32px', 
                  fontFamily: 'var(--font-label)', 
                  fontSize: '11px', 
                  fontWeight: '700', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.22em', 
                  cursor: 'pointer', 
                  alignSelf: 'flex-start', 
                  transition: 'all 0.3s ease' 
                }}
                onMouseEnter={e => e.target.style.background = 'var(--gold-light)'}
                onMouseLeave={e => e.target.style.background = 'var(--gold)'}>
                Submit Experience
              </button>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          .detail-main-grid { grid-template-columns: 1fr !important; gap: 36px !important; }
        }
        .reviews-grid { display: grid; }
        @media (max-width: 900px) {
          .reviews-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
