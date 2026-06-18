'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../lib/CartContext';
import { Search, ShoppingBag, Sparkles, Menu, X, ChevronRight, Home, Grid, Star, Phone } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import mockProducts from '../../data/mockProducts.json';

const ANNOUNCEMENTS = [
  "✨ LUXURY PERFUME SALE — FLAT 30% OFF ✨",
  "📦 FREE SHIPPING ON ALL PREPAID ORDERS 📦",
  "💝 GIFT BOX INCLUDED WITH EVERY PURCHASE 💝"
];

const SEARCH_PLACEHOLDERS = [
  "Search for Rose...",
  "Search for Oud...",
  "Search for Citrus...",
  "Search for Amber...",
  "Search for Woody..."
];

export default function Header({ settings }) {
  const { cartCount, setIsCartOpen } = useCart();
  const router = useRouter();
  const pathname = usePathname();

  // Settings parsing with fallbacks
  const announcements = settings?.announcements && settings.announcements.length > 0
    ? settings.announcements
    : ANNOUNCEMENTS;
  const searchPlaceholders = settings?.searchPlaceholders && settings.searchPlaceholders.length > 0
    ? settings.searchPlaceholders
    : SEARCH_PLACEHOLDERS;

  // Announcement Rotator
  const [announcementIdx, setAnnouncementIdx] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setAnnouncementIdx((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [announcements]);

  // Search Placeholder Animator
  const [placeholder, setPlaceholder] = useState("");
  const [phIdx, setPhIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = searchPlaceholders[phIdx];
    let typingSpeed = isDeleting ? 40 : 100;

    if (!isDeleting && charIdx === currentText.length) {
      typingSpeed = 2000;
      setIsDeleting(true);
    } else if (isDeleting && charIdx === 0) {
      setIsDeleting(false);
      setPhIdx((prev) => (prev + 1) % searchPlaceholders.length);
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
  }, [charIdx, isDeleting, phIdx, searchPlaceholders]);

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

  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const navLinks = [
    { href: '/', label: 'Home', icon: <Home size={20} /> },
    { href: '/shop', label: 'Shop All', icon: <Grid size={20} /> },
    { href: '/shop?tab=bestsellers', label: 'Bestsellers', icon: <Star size={20} /> },
    { href: '/shop?tab=new-arrivals', label: 'New Arrivals', icon: <Sparkles size={20} /> },
  ];

  return (
    <>
      {/* Announcement Bar */}
      <div className="announcement-bar">
        <span className="announcement-text" key={announcementIdx}>{announcements[announcementIdx]}</span>
      </div>

      <header className="main-header">
        <div className="container header-container">
          <div className="header-left-group">
            {/* Hamburger — mobile only */}
            <button
              className="icon-btn mobile-menu-btn"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Navigation Menu"
            >
              <Menu size={22} />
            </button>

            {/* Logo */}
            <Link href="/" className="logo">
              <img src={settings?.logo || "/logo.svg"} alt={settings?.brandName || "Ishaya Luxury Perfume"} className="logo-img" />
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="nav-links desktop-nav">
            <Link href="/shop" className="nav-link">Shop All</Link>
            <Link href="/shop?tab=bestsellers" className="nav-link">Bestsellers</Link>
            <Link href="/shop?tab=new-arrivals" className="nav-link">New Arrivals</Link>
          </nav>

          {/* Header Actions */}
          <div className="header-actions">
            {/* Desktop Search */}
            <div className="search-bar-wrapper desktop-search" ref={searchRef}>
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

            {/* Mobile Search Toggle */}
            <button
              className="icon-btn mobile-search-btn"
              onClick={() => setMobileSearchOpen(prev => !prev)}
              aria-label="Toggle Search"
            >
              <Search size={20} />
            </button>

            {/* Cart Button */}
            <button className="icon-btn" onClick={() => setIsCartOpen(true)} aria-label="Open Shopping Bag">
              <ShoppingBag size={20} />
              {cartCount > 0 && <span className="cart-count-badge">{cartCount}</span>}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar (slides down) */}
        <div className={`mobile-search-bar ${mobileSearchOpen ? 'open' : ''}`}>
          <div className="mobile-search-inner" ref={mobileSearchOpen ? searchRef : null}>
            <Search size={16} className="mobile-search-icon" />
            <input
              type="text"
              className="mobile-search-input"
              placeholder="Search fragrances..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.trim().length > 1 && setShowSuggestions(true)}
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(''); setShowSuggestions(false); }} className="mobile-search-clear">
                <X size={16} />
              </button>
            )}
          </div>
          {showSuggestions && suggestions.length > 0 && mobileSearchOpen && (
            <div className="search-suggestions mobile-suggestions">
              {suggestions.map((item) => (
                <div
                  key={item.id}
                  className="suggestion-item"
                  onClick={() => { handleSuggestionClick(item.slug); setMobileSearchOpen(false); }}
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
      </header>

      {/* Mobile Drawer Overlay */}
      <div
        className={`mobile-drawer-overlay ${mobileMenuOpen ? 'active' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Slide-out Drawer */}
      <div className={`mobile-drawer ${mobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-drawer-header">
          <Link href="/" className="logo" onClick={() => setMobileMenuOpen(false)}>
            <img src={settings?.logo || "/logo.png"} alt={settings?.brandName || "Ishaya Luxury Perfume"} className="logo-img" />
          </Link>
          <button className="icon-btn" onClick={() => setMobileMenuOpen(false)} aria-label="Close Menu">
            <X size={24} />
          </button>
        </div>

        <nav className="mobile-drawer-nav">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`mobile-nav-item ${pathname === link.href ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="mobile-nav-icon">{link.icon}</span>
              <span className="mobile-nav-label">{link.label}</span>
              <ChevronRight size={18} className="mobile-nav-chevron" />
            </Link>
          ))}
        </nav>

        <div className="mobile-drawer-footer">
          <p className="mobile-drawer-promo">🎁 Free gift box on every order</p>
          <p className="mobile-drawer-promo">🚚 Free shipping on prepaid orders</p>
        </div>
      </div>
    </>
  );
}
