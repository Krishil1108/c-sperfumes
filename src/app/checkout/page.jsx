'use client'

import React, { useState, useEffect } from 'react';
import { useCart } from '../../lib/CartContext';
import { ShoppingBag, ArrowLeft, CheckCircle, Gift } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const router = useRouter();
  const { 
    cartItems, 
    cartSubtotal, 
    cartTotal, 
    cartSavings, 
    clearCart 
  } = useCart();

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: ''
  });

  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Protect page: Redirect to home if cart is empty and success is not showing
  useEffect(() => {
    if (cartItems.length === 0 && !isSuccessOpen) {
      // Small timeout to allow state hydration
      const timer = setTimeout(() => {
        if (cartItems.length === 0 && !isSuccessOpen) {
          router.push('/');
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [cartItems, isSuccessOpen, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate form is filled
    if (Object.values(formData).every(val => val.trim().length > 0)) {
      // Mock order generation ID
      const generatedId = 'AB-' + Math.floor(100000 + Math.random() * 900000);
      setOrderId(generatedId);
      setIsSuccessOpen(true);
    }
  };

  const handleCloseSuccess = () => {
    clearCart(); // Clear cart state
    setIsSuccessOpen(false);
    router.push('/');
  };

  return (
    <div className="container section-padding">
      <div style={{ marginBottom: '24px' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '500', color: 'var(--color-accent)' }}>
          <ArrowLeft size={16} />
          <span>Back to Fragrances</span>
        </Link>
      </div>

      <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Secured Checkout</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '32px' }}>Complete your premium olfactory delivery order.</p>

      <div className="checkout-grid">
        {/* Shipping Form */}
        <form onSubmit={handleSubmit} className="checkout-box" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h2 className="checkout-box-title">Shipping Address</h2>
          
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              name="email"
              className="form-input" 
              value={formData.email}
              onChange={handleInputChange}
              required 
            />
          </div>

          <div className="checkout-form-grid">
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input 
                type="text" 
                name="firstName"
                className="form-input" 
                value={formData.firstName}
                onChange={handleInputChange}
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input 
                type="text" 
                name="lastName"
                className="form-input" 
                value={formData.lastName}
                onChange={handleInputChange}
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Delivery Street Address</label>
            <input 
              type="text" 
              name="address"
              className="form-input" 
              placeholder="Apartment, suite, unit, block number, etc."
              value={formData.address}
              onChange={handleInputChange}
              required 
            />
          </div>

          <div className="checkout-form-grid">
            <div className="form-group">
              <label className="form-label">City</label>
              <input 
                type="text" 
                name="city"
                className="form-input" 
                value={formData.city}
                onChange={handleInputChange}
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Postal Pincode</label>
              <input 
                type="text" 
                name="postalCode"
                className="form-input" 
                value={formData.postalCode}
                onChange={handleInputChange}
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number (For Delivery Updates)</label>
            <input 
              type="tel" 
              name="phone"
              className="form-input" 
              value={formData.phone}
              onChange={handleInputChange}
              required 
            />
          </div>

          <button type="submit" className="checkout-btn" style={{ marginTop: '12px' }}>
            <ShoppingBag size={18} />
            <span>Place Secure Cash On Delivery Order</span>
          </button>
        </form>

        {/* Order Summary sidebar */}
        <div className="checkout-box" style={{ height: 'fit-content' }}>
          <h2 className="checkout-box-title">Bag Summary</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            {cartItems.map((item) => (
              <div key={item.id} style={{ display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--color-border)' }} 
                  />
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: '500' }}>{item.title}</p>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Qty: {item.quantity}</p>
                  </div>
                </div>
                <span style={{ fontSize: '14px', fontWeight: '600' }}>₹{item.salePrice * item.quantity}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid var(--color-border)', paddingTop: '20px' }}>
            <div className="summary-row">
              <span>Bag Subtotal</span>
              <span style={{ textDecoration: 'line-through', color: '#888' }}>₹{cartSubtotal}</span>
            </div>
            {cartSavings > 0 && (
              <div className="summary-row" style={{ color: '#0ca678', fontWeight: '500' }}>
                <span>Discount Applied</span>
                <span>- ₹{cartSavings}</span>
              </div>
            )}
            <div className="summary-row">
              <span>Standard Insured Shipping</span>
              <span style={{ color: '#0ca678', fontWeight: '500' }}>FREE</span>
            </div>
            <div className="summary-row total" style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
              <span>Total Payable</span>
              <span>₹{cartTotal}</span>
            </div>
          </div>

          <div style={{ marginTop: '24px', padding: '16px', backgroundColor: 'var(--color-bg-alt)', borderRadius: '6px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <Gift size={20} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Free Premium Gifting Pack</p>
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                Your scents will be nested in fine luxury satin cushioning inside our signature gold-foil champagne gift box.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal Overlay */}
      {isSuccessOpen && (
        <div className="success-modal-overlay">
          <div className="success-modal">
            <div className="success-icon-box">
              <CheckCircle size={40} />
            </div>
            <h2 className="success-title">Order Confirmed!</h2>
            <p className="success-text">
              Your luxury order has been placed. We have sent a confirmation email to <strong>{formData.email}</strong>.
            </p>
            <div style={{ backgroundColor: 'var(--color-bg-alt)', borderRadius: '6px', padding: '16px', marginBottom: '32px', textAlign: 'left', fontSize: '14px' }}>
              <p style={{ marginBottom: '6px' }}><strong>Order Reference:</strong> {orderId}</p>
              <p style={{ marginBottom: '6px' }}><strong>Delivery Name:</strong> {formData.firstName} {formData.lastName}</p>
              <p style={{ marginBottom: '6px' }}><strong>Estimated Arrival:</strong> 3 - 5 Business Days</p>
              <p><strong>Payment Method:</strong> Cash On Delivery</p>
            </div>
            <button onClick={handleCloseSuccess} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
