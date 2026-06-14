'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../lib/CartContext';
import { Search, ShoppingBag, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import mockProducts from '../../data/mockProducts.json';

const ANNOUNCEMENTS = [
  "✨ LUXURY PERFUME SALE - FLAT 30% OFF ✨",
  "📦 FREE SHIPPING ON ALL PREPAID ORDERS 📦",
  "💝 EXQUISITE GIFT BOX INCLUDED WITH EVERY PURCHASE 💝"
];

const SEARCH_PLACEHOLDERS = [
  "Search for Rose...",
  "Search for Oud...",
  "Search for Citrus...",
  "Search for Amber...",
  "Search for Woody..."
];

export default function Header() {
  const { cartCount, setIsCartOpen } = useCart();
  const router = useRouter();

  // Announcement Rotator
  const [announcementIdx, setAnnouncementIdx] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setAnnouncementIdx((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Search Placeholder Animator
  const [placeholder, setPlaceholder] = useState("");
  const [phIdx, setPhIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = SEARCH_PLACEHOLDERS[phIdx];
    let typingSpeed = isDeleting ? 40 : 100;

    if (!isDeleting && charIdx === currentText.length) {
      typingSpeed = 2000; // Pause at end of text
      setIsDeleting(true);
    } else if (isDeleting && charIdx === 0) {
      setIsDeleting(false);
      setPhIdx((prev) => (prev + 1) % SEARCH_PLACEHOLDERS.length);
      typingSpeed = 500;
    }

    const timeout = setTimeout(() => {
      setPlaceholder(
        isDeleting 
          ? currentText.substring(0, charIdx - 1) 
          : currentText.substring(0, charIdx + 1)
      );
      setCharIdx((prev) => (isDeleting ? prev - 1 : prev + 1));
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [charIdx, isDeleting, phIdx]);

  // Search Live Suggestions
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const filtered = mockProducts
        .filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSuggestionClick = (slug) => {
    setSearchQuery("");
    setShowSuggestions(false);
    router.push(`/product/${slug}`);
  };

  return (
    <>
      <div className="announcement-bar">
        <span className="announcement-text">{ANNOUNCEMENTS[announcementIdx]}</span>
      </div>

      <header className="main-header">
        <div className="container header-container">
          <Link href="/" className="logo">
            <Sparkles className="logo-icon" fill="#c5a880" size={24} />
            <div>
              <span>AURA BELLA</span>
              <span className="logo-sub">Luxury Scents</span>
            </div>
          </Link>

          <nav className="nav-links">
            <Link href="/shop" className="nav-link">Shop All</Link>
            <Link href="/shop?tab=bestsellers" className="nav-link">Bestsellers</Link>
            <Link href="/shop?tab=new-arrivals" className="nav-link">New Arrivals</Link>
            <Link href="/#notes" className="nav-link">Scent Notes</Link>
            <Link href="/studio" className="nav-link" style={{ color: 'var(--color-accent)' }}>Sanity Studio</Link>
          </nav>

          <div className="header-actions">
            <div className="search-bar-wrapper" ref={searchRef}>
              <Search className="search-icon" />
              <input 
                type="text" 
                className="search-input" 
                placeholder={placeholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim().length > 1 && setShowSuggestions(true)}
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className="search-suggestions">
                  {suggestions.map((item) => (
                    <div 
                      key={item.id} 
                      className="suggestion-item"
                      onClick={() => handleSuggestionClick(item.slug)}
                    >
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '4px' }} 
                      />
                      <span>{item.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button className="icon-btn" onClick={() => setIsCartOpen(true)} aria-label="Open Shopping Bag">
              <ShoppingBag size={20} />
              {cartCount > 0 && <span className="cart-count-badge">{cartCount}</span>}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
