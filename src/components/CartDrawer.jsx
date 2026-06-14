'use client'

import React from 'react';
import { useCart } from '../lib/CartContext';
import { X, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CartDrawer() {
  const { 
    cartItems, 
    isCartOpen, 
    setIsCartOpen, 
    updateQty, 
    removeFromCart, 
    cartTotal, 
    cartSubtotal,
    cartSavings 
  } = useCart();

  return (
    <div className={`cart-drawer-overlay ${isCartOpen ? 'active' : ''}`} onClick={() => setIsCartOpen(false)}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2 className="cart-title">Your Scent Bag ({cartItems.length})</h2>
          <button className="cart-close-btn" onClick={() => setIsCartOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="cart-items">
          {cartItems.length === 0 ? (
            <div className="cart-empty-message">
              <p>Your bag is currently empty.</p>
              <button 
                onClick={() => setIsCartOpen(false)} 
                className="btn-primary" 
                style={{ marginTop: '24px', padding: '12px 28px' }}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div className="cart-item" key={item.id}>
                <img src={item.image} alt={item.title} className="cart-item-img" />
                <div className="cart-item-info">
                  <span className="cart-item-title">{item.title}</span>
                  <span className="cart-item-price">₹{item.salePrice}</span>
                  <div className="cart-item-qty">
                    <button className="qty-btn" onClick={() => updateQty(item.id, -1)}>
                      <Minus size={12} />
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => updateQty(item.id, 1)}>
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
                <button className="cart-remove-btn" onClick={() => removeFromCart(item.id)}>
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-summary">
            <div className="summary-row">
              <span>Subtotal (M.R.P.)</span>
              <span style={{ textDecoration: 'line-through', color: '#888' }}>₹{cartSubtotal}</span>
            </div>
            {cartSavings > 0 && (
              <div className="summary-row" style={{ color: '#0ca678', fontWeight: '500' }}>
                <span>Scent Discount</span>
                <span>- ₹{cartSavings}</span>
              </div>
            )}
            <div className="summary-row total">
              <span>Total Amount</span>
              <span>₹{cartTotal}</span>
            </div>
            <p style={{ fontSize: '11px', color: '#767676', textAlign: 'center' }}>
              Free standard shipping and premium gift boxing included!
            </p>
            <Link 
              href="/checkout" 
              className="checkout-btn"
              onClick={() => setIsCartOpen(false)}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
