'use client'

import React, { useState, useEffect } from 'react';
import { useCart } from '../../lib/CartContext';
import { ShoppingBag, ArrowLeft, CheckCircle, Gift, CreditCard, Truck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Qfix doesn't use an external script loader like Razorpay. We build a form dynamically instead.

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
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [isProcessing, setIsProcessing] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(formData).every(val => val.trim().length > 0)) {
      if (paymentMethod === 'cod') {
        const generatedId = 'AB-' + Math.floor(100000 + Math.random() * 900000);
        setOrderId(generatedId);
        setIsSuccessOpen(true);
        return;
      }

      } else {
        setIsProcessing(true);
        try {
          const response = await fetch('/api/qfix/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              amount: cartTotal,
              customerName: `${formData.firstName} ${formData.lastName}`,
              customerEmail: formData.email,
              customerPhone: formData.phone
            })
          });
          
          if (!response.ok) throw new Error('Network response was not ok');
          const formFields = await response.json();
          
          if (formFields.error) {
            alert('Server error generating Qfix payload. Please check your credentials.');
            setIsProcessing(false);
            return;
          }

          // Dynamically create a form and submit it to Qfix endpoint
          const form = document.createElement('form');
          form.method = 'POST';
          form.action = process.env.NEXT_PUBLIC_QFIX_ENDPOINT_URL || 'https://secure.qfixinfo.com/v2/payment';
          
          for (const key in formFields) {
            if (formFields.hasOwnProperty(key)) {
              const hiddenField = document.createElement('input');
              hiddenField.type = 'hidden';
              hiddenField.name = key;
              hiddenField.value = formFields[key];
              form.appendChild(hiddenField);
            }
          }
          
          document.body.appendChild(form);
          form.submit();
          
        } catch (error) {
          console.error(error);
          alert('Payment initialization failed');
          setIsProcessing(false);
        }
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

          <div className="form-group" style={{ marginTop: '16px' }}>
            <label className="form-label">Payment Method</label>
            <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
              
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', border: paymentMethod === 'upi' ? '2px solid var(--color-accent)' : '1px solid var(--color-border)', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.3s' }}>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="upi" 
                  checked={paymentMethod === 'upi'} 
                  onChange={() => setPaymentMethod('upi')} 
                  style={{ width: '18px', height: '18px', accentColor: 'var(--color-accent)' }}
                />
                <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" style={{ width: '32px', filter: paymentMethod === 'upi' ? 'none' : 'grayscale(1)' }} />
                <div style={{ flex: 1 }}>
                  <span style={{ display: 'block', fontWeight: '600' }}>UPI (GPay, PhonePe, Paytm)</span>
                  <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Fast and secure payment via UPI Apps</span>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', border: paymentMethod === 'online' ? '2px solid var(--color-accent)' : '1px solid var(--color-border)', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.3s' }}>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="online" 
                  checked={paymentMethod === 'online'} 
                  onChange={() => setPaymentMethod('online')} 
                  style={{ width: '18px', height: '18px', accentColor: 'var(--color-accent)' }}
                />
                <CreditCard size={24} style={{ color: paymentMethod === 'online' ? 'var(--color-accent)' : 'inherit' }} />
                <div style={{ flex: 1 }}>
                  <span style={{ display: 'block', fontWeight: '600' }}>Cards & Netbanking</span>
                  <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Credit Cards, Debit Cards, Net Banking</span>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', border: paymentMethod === 'cod' ? '2px solid var(--color-accent)' : '1px solid var(--color-border)', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.3s' }}>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="cod" 
                  checked={paymentMethod === 'cod'} 
                  onChange={() => setPaymentMethod('cod')} 
                  style={{ width: '18px', height: '18px', accentColor: 'var(--color-accent)' }}
                />
                <Truck size={24} style={{ color: paymentMethod === 'cod' ? 'var(--color-accent)' : 'inherit' }} />
                <div style={{ flex: 1 }}>
                  <span style={{ display: 'block', fontWeight: '600' }}>Cash On Delivery</span>
                  <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Pay at your doorstep when receiving the package</span>
                </div>
              </label>
            </div>
          </div>

          <button type="submit" className="checkout-btn" style={{ marginTop: '12px' }} disabled={isProcessing}>
            <ShoppingBag size={18} />
            <span>{isProcessing ? 'Processing...' : (paymentMethod === 'online' || paymentMethod === 'upi' ? 'Pay Securely with Qfix' : 'Place Cash On Delivery Order')}</span>
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
              <p><strong>Payment Method:</strong> {paymentMethod === 'online' ? 'Cards/Netbanking' : paymentMethod === 'upi' ? 'UPI' : 'Cash On Delivery'}</p>
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
