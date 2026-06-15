'use client'

import React, { useState } from 'react';
import { Sparkles, Send, Instagram, Facebook, Youtube, Twitter } from 'lucide-react';
import Link from 'next/link';

export default function Footer({ settings }) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const trustItems = settings?.footerTrustItems && settings.footerTrustItems.length > 0
    ? settings.footerTrustItems
    : ["✓ 100% Organic Extracts", "✓ Long-Lasting Sillage", "✓ Cruelty-Free & Vegan", "✓ Made in India with Love"];

  return (
    <footer className="premium-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand-col">
            <Link href="/" className="logo">
              <img src={settings?.logo || "/logo.png"} alt={settings?.brandName || "Ishaya Luxury Perfume"} className="logo-img" />
              <div>
                <span>{settings?.brandName || "ISHAYA LUXURY"}</span>
                <span className="logo-sub">{settings?.brandSubtitle || "Perfumes"}</span>
              </div>
            </Link>
            <p className="footer-desc">
              {settings?.footerDesc || "Curating high-end organic perfumes formulated with authentic essential oils, natural botanical extracts, and premium luxury craftsmanship."}
            </p>
            <div className="footer-socials">
              <a href={settings?.footerInstagram || "https://instagram.com"} target="_blank" rel="noreferrer" className="social-icon" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href={settings?.footerFacebook || "https://facebook.com"} target="_blank" rel="noreferrer" className="social-icon" aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href={settings?.footerYoutube || "https://youtube.com"} target="_blank" rel="noreferrer" className="social-icon" aria-label="Youtube">
                <Youtube size={18} />
              </a>
              <a href={settings?.footerTwitter || "https://twitter.com"} target="_blank" rel="noreferrer" className="social-icon" aria-label="Twitter">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="footer-title">Shop Online</h3>
            <div className="footer-links">
              <Link href="/#bestsellers" className="footer-link">Bestseller Perfumes</Link>
              <Link href="/#new-arrivals" className="footer-link">New Arrivals</Link>
              <Link href="/#notes" className="footer-link">Oud Collections</Link>
              <Link href="/#notes" className="footer-link">Floral Notes</Link>
              <Link href="/#notes" className="footer-link">Gifting Sets</Link>
            </div>
          </div>

          <div>
            <h3 className="footer-title">Help & Support</h3>
            <div className="footer-links">
              <Link href="/#contact" className="footer-link">Track Your Order</Link>
              <Link href="/#contact" className="footer-link">Returns & Exchanges</Link>
              <Link href="/#contact" className="footer-link">Shipping Policy</Link>
              <Link href="/#contact" className="footer-link">Frequently Asked Questions</Link>
              <Link href="/#contact" className="footer-link">Contact Customer Support</Link>
            </div>
          </div>

          <div>
            <h3 className="footer-title">{settings?.brandName ? `Join ${settings.brandName.split(" ")[0]} VIP` : "Join Ishaya VIP"}</h3>
            <p className="footer-desc" style={{ fontSize: '13px', color: '#afafaf' }}>
              Subscribe to unlock 15% off your first luxury fragrance order and receive weekly scent pairing articles.
            </p>
            <div className="footer-newsletter-wrapper">
              <form className="footer-newsletter-form" onSubmit={handleSubscribe}>
                <input 
                  type="email" 
                  className="newsletter-input" 
                  placeholder={subscribed ? "Subscription Active!" : "Enter your email..."}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={subscribed}
                  required
                />
                <button type="submit" className="btn-newsletter" aria-label="Subscribe">
                  <Send size={16} />
                </button>
              </form>
              {subscribed && (
                <p style={{ color: 'var(--color-accent)', fontSize: '12px', marginTop: '8px', fontWeight: '500' }}>
                  Thank you! Check your inbox for your welcome coupon code.
                </p>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'center', paddingBottom: '40px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', textAlign: 'center' }}>
          {trustItems.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#afafaf' }}>
              <span style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>✓</span> {item.replace("✓ ", "")}
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <p>{settings?.footerCopyright || `© ${new Date().getFullYear()} Ishaya Luxury Perfumes. All Rights Reserved. Built as a high-fidelity replica store.`}</p>
        </div>
      </div>
    </footer>
  );
}
