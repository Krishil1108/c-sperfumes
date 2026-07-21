'use client'

import React from 'react';
import { useCart } from '../lib/CartContext';
import { X, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CartDrawer() {
  const { cartItems, isCartOpen, setIsCartOpen, updateQty, removeFromCart, cartTotal, cartSubtotal, cartSavings } = useCart();

  return (
    <div
      style={{ position: 'fixed', inset: '0', zIndex: '500', opacity: isCartOpen ? '1' : '0', visibility: isCartOpen ? 'visible' : 'hidden', transition: 'opacity 0.38s ease, visibility 0.38s ease' }}
      onClick={() => setIsCartOpen(false)}
    >
      {/* Backdrop */}
      <div style={{ position: 'absolute', inset: '0', background: 'rgba(10,10,10,0.6)', backdropFilter: 'blur(4px)' }} />

      {/* Drawer Panel */}
      <div
        style={{
          position: 'absolute', top: '0', right: '0', bottom: '0',
          width: 'min(92vw, 460px)',
          background: 'var(--white)',
          transform: isCartOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.42s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex', flexDirection: 'column',
          boxShadow: '-24px 0 64px rgba(0,0,0,0.18)'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ background: 'var(--noir)', padding: '20px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: '0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ShoppingBag size={18} color="var(--gold)" />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: '400', color: 'var(--white)' }}>
              Your Bag
            </span>
            {cartItems.length > 0 && (
              <span style={{ fontFamily: 'var(--font-label)', fontSize: '10px', background: 'var(--gold)', color: 'var(--noir)', padding: '2px 8px', letterSpacing: '0.1em', fontWeight: '700' }}>
                {cartItems.length}
              </span>
            )}
          </div>
          <button onClick={() => setIsCartOpen(false)} style={{ color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
            <X size={22} />
          </button>
        </div>

        {/* Items List */}
        <div style={{ flex: '1', overflowY: 'auto', padding: cartItems.length === 0 ? '0' : '8px 0' }}>
          {cartItems.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '60px 40px', textAlign: 'center' }}>
              <ShoppingBag size={48} color="rgba(0,0,0,0.12)" style={{ marginBottom: '20px' }} />
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: '300', color: 'var(--text-dark)', marginBottom: '8px' }}>Your bag is empty</p>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: '300', marginBottom: '28px' }}>Add a fragrance to get started</p>
              <button onClick={() => setIsCartOpen(false)} className="btn-primary" style={{ display: 'inline-flex' }}>
                Explore Collection
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '88px 1fr auto', gap: '16px', padding: '20px 28px', borderBottom: '1px solid rgba(0,0,0,0.05)', alignItems: 'start' }}>
                {/* Image */}
                <Link href={`/product/${item.slug}`} onClick={() => setIsCartOpen(false)}>
                  <img src={item.image} alt={item.title} style={{ width: '88px', height: '88px', objectFit: 'cover', background: 'var(--pearl)', display: 'block' }} />
                </Link>
                {/* Info */}
                <div>
                  <div style={{ fontFamily: 'var(--font-label)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--gold)', marginBottom: '4px' }}>
                    {item.brand || 'C&S Perfumes'}
                  </div>
                  <Link href={`/product/${item.slug}`} onClick={() => setIsCartOpen(false)}>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: '400', color: 'var(--text-dark)', lineHeight: '1.35', marginBottom: '10px' }}>
                      {item.title}
                    </p>
                  </Link>
                  {/* Qty control */}
                  <div style={{ display: 'inline-flex', border: '1px solid rgba(0,0,0,0.1)', marginBottom: '8px' }}>
                    <button onClick={() => updateQty(item.id, -1)} style={{ width: '30px', height: '30px', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dark)', transition: 'background 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--pearl)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <Minus size={11} />
                    </button>
                    <span style={{ width: '32px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-label)', fontSize: '12px', fontWeight: '600', borderLeft: '1px solid rgba(0,0,0,0.1)', borderRight: '1px solid rgba(0,0,0,0.1)' }}>
                      {item.quantity}
                    </span>
                    <button onClick={() => updateQty(item.id, 1)} style={{ width: '30px', height: '30px', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dark)', transition: 'background 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--pearl)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <Plus size={11} />
                    </button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)}
                    style={{ display: 'block', fontFamily: 'var(--font-label)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '0', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#c00'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                    Remove
                  </button>
                </div>
                {/* Price */}
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: '400', color: 'var(--text-dark)' }}>
                    ₹{item.salePrice * item.quantity}
                  </span>
                  {item.quantity > 1 && (
                    <div style={{ fontFamily: 'var(--font-label)', fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      ₹{item.salePrice} each
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', background: 'var(--cream)', padding: '24px 28px 32px', flexShrink: '0' }}>
            {/* Savings */}
            {cartSavings > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontFamily: 'var(--font-label)', fontSize: '11px', color: '#2d9a5f', letterSpacing: '0.08em' }}>
                <span>Savings</span>
                <span style={{ fontWeight: '600' }}>− ₹{cartSavings}</span>
              </div>
            )}
            {/* Subtotal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <span style={{ fontFamily: 'var(--font-label)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-muted)' }}>Total</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: '400', color: 'var(--text-dark)' }}>₹{cartTotal}</span>
            </div>
            {/* Perks */}
            <p style={{ fontFamily: 'var(--font-label)', fontSize: '10px', textAlign: 'center', color: 'var(--gold)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px' }}>
              ✓ Free shipping &nbsp;·&nbsp; ✓ Gift box included
            </p>
            {/* CTA */}
            <Link
              href="/checkout"
              onClick={() => setIsCartOpen(false)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', background: 'var(--noir)', color: 'var(--white)', padding: '16px', fontFamily: 'var(--font-label)', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.22em', textDecoration: 'none', transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--gold)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--noir)'}>
              <span>Proceed to Checkout</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
