'use client'

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Grid, Star, ShoppingBag } from 'lucide-react';
import { useCart } from '../lib/CartContext';

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/shop', label: 'Shop', icon: Grid },
  { href: '/shop?tab=bestsellers', label: 'Top', icon: Star },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { cartCount, setIsCartOpen } = useCart();

  // Don't show on studio page
  if (pathname?.startsWith('/studio')) return null;

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href.split('?')[0]);
  };

  return (
    <nav className="bottom-nav" aria-label="Mobile Bottom Navigation">
      <div className="bottom-nav-items">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`bottom-nav-item ${isActive(href) ? 'active' : ''}`}
            aria-label={label}
          >
            <span className="bottom-nav-icon">
              <Icon size={22} />
            </span>
            <span>{label}</span>
          </Link>
        ))}

        {/* Cart button */}
        <button
          className={`bottom-nav-item`}
          onClick={() => setIsCartOpen(true)}
          aria-label="Open Shopping Bag"
        >
          <span className="bottom-nav-icon" style={{ position: 'relative' }}>
            <ShoppingBag size={22} />
            {cartCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-8px',
                  background: 'var(--color-accent)',
                  color: 'var(--color-primary)',
                  fontSize: '10px',
                  fontWeight: '800',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 0 2px var(--color-bg)',
                }}
              >
                {cartCount}
              </span>
            )}
          </span>
          <span>Bag</span>
        </button>
      </div>
    </nav>
  );
}
