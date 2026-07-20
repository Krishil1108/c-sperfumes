'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../../lib/CartContext';
import { ShoppingBag, ArrowLeft, CheckCircle, Gift, CreditCard, Truck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const loadScript = (src) => {
  return new Promise((resolve) => {
    // Avoid loading the script multiple times
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

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

  // OTP Verification States
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState('');

  const hasTrackedCheckoutRef = useRef(false);

  useEffect(() => {
    if (!hasTrackedCheckoutRef.current && cartItems.length > 0 && typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'InitiateCheckout', {
        currency: 'INR',
        value: cartTotal,
        num_items: cartItems.length
      });
      hasTrackedCheckoutRef.current = true;
    }
  }, [cartItems, cartTotal]);


  // Protect page: Redirect to home if cart is empty and success is not showing
  useEffect(() => {
    if (cartItems.length === 0 && !isSuccessOpen) {
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
    
    // Reset verification if phone changes
    if (name === 'phone') {
      setIsPhoneVerified(false);
      setIsOtpSent(false);
      setOtp('');
      setOtpError('');
    }
  };

  const handleSendOtp = async () => {
    if (!formData.phone || formData.phone.length < 10) {
      setOtpError('Please enter a valid phone number first.');
      return;
    }
    
    setIsSendingOtp(true);
    setOtpError('');
    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone })
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setIsOtpSent(true);
      } else {
        setOtpError(data.error || 'Failed to send OTP.');
      }
    } catch (err) {
      console.error(err);
      setOtpError('Failed to send OTP. Please try again.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setOtpError('Please enter the OTP.');
      return;
    }

    setIsVerifyingOtp(true);
    setOtpError('');
    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone, otp })
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setIsPhoneVerified(true);
        setIsOtpSent(false); // Hide OTP input once verified
      } else {
        setOtpError(data.error || 'Invalid OTP.');
      }
    } catch (err) {
      console.error(err);
      setOtpError('Failed to verify OTP. Please try again.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const allFilled = Object.values(formData).every(val => val.trim().length > 0);
    if (!allFilled) {
      alert('Please fill in all required fields.');
      return;
    }

    if (!isPhoneVerified) {
      alert('Please verify your phone number using OTP before placing the order.');
      return;
    }


    // --- Cash On Delivery ---
    if (paymentMethod === 'cod') {
      const generatedId = 'AB-' + Math.floor(100000 + Math.random() * 900000);
      setOrderId(generatedId);
      
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'Purchase', {
          currency: 'INR',
          value: cartTotal,
          num_items: cartItems.length
        });
      }
      
      setIsSuccessOpen(true);
      return;
    }

    // --- Online Payment via Razorpay (UPI / Cards / Netbanking) ---
    setIsProcessing(true);
    try {
      // Step 1: Load Razorpay checkout script
      const scriptLoaded = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!scriptLoaded) {
        alert('Razorpay SDK failed to load. Please check your internet connection.');
        setIsProcessing(false);
        return;
      }

      // Step 2: Create order on the backend
      const orderResponse = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: cartTotal }),
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create Razorpay order on server.');
      }
      const order = await orderResponse.json();

      if (order.error) {
        alert('Server error: ' + order.error);
        setIsProcessing(false);
        return;
      }

      // Step 3: Open Razorpay Checkout modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Ishaya Luxury Perfumes',
        description: 'Premium Olfactory Delivery Order',
        image: '/logo.png',
        order_id: order.id,
        handler: async function (response) {
          // Step 4: Verify payment signature on the backend
          try {
            const verifyResponse = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                customer: formData,
                items: cartItems,
                totalAmount: cartTotal,
                paymentMethod: paymentMethod,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.status === 'success') {
              const generatedId = 'RP-' + order.id.slice(-6).toUpperCase();
              setOrderId(generatedId);
              
              if (typeof window !== 'undefined' && window.fbq) {
                window.fbq('track', 'Purchase', {
                  currency: 'INR',
                  value: cartTotal,
                  num_items: cartItems.length
                });
              }
              
              clearCart();
              setIsSuccessOpen(true);
            } else {
              alert('Payment verification failed. Please contact support.');
            }
          } catch (err) {
            console.error('Verification error:', err);
            alert('Payment verification error. Please contact support.');
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#d4af37',
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error('Payment initialization error:', error);
      alert('Payment initialization failed: ' + error.message);
      setIsProcessing(false);
    }
  };

  const handleCloseSuccess = () => {
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
            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                type="tel"
                name="phone"
                className="form-input"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={isPhoneVerified}
                required
                style={{ flex: 1 }}
              />
              {!isPhoneVerified && (
                <button 
                  type="button" 
                  onClick={handleSendOtp} 
                  disabled={isSendingOtp || formData.phone.length < 10}
                  style={{
                    padding: '0 16px',
                    backgroundColor: 'var(--color-bg-alt)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '4px',
                    cursor: (isSendingOtp || formData.phone.length < 10) ? 'not-allowed' : 'pointer',
                    fontWeight: '500',
                    color: 'var(--color-text)',
                    minWidth: '100px'
                  }}
                >
                  {isSendingOtp ? 'Sending...' : (isOtpSent ? 'Resend' : 'Verify')}
                </button>
              )}
              {isPhoneVerified && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0ca678', padding: '0 16px', fontWeight: '500' }}>
                  <CheckCircle size={18} /> Verified
                </div>
              )}
            </div>
            {otpError && <p style={{ color: '#fa5252', fontSize: '13px', marginTop: '6px' }}>{otpError}</p>}
            
            {isOtpSent && !isPhoneVerified && (
              <div style={{ marginTop: '12px', padding: '16px', backgroundColor: 'var(--color-bg-alt)', borderRadius: '6px', border: '1px solid var(--color-border)' }}>
                <label className="form-label">Enter OTP Sent to {formData.phone}</label>
                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP (Mock: 123456)"
                    maxLength={6}
                    style={{ flex: 1, padding: '10px 12px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={isVerifyingOtp || !otp}
                    style={{
                      padding: '0 16px',
                      backgroundColor: 'var(--color-accent)',
                      color: 'var(--color-bg)',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: (isVerifyingOtp || !otp) ? 'not-allowed' : 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    {isVerifyingOtp ? 'Verifying...' : 'Confirm'}
                  </button>
                </div>
              </div>
            )}
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
                  <span style={{ display: 'block', fontWeight: '600' }}>Cards &amp; Netbanking</span>
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
            <span>{isProcessing ? 'Processing...' : (paymentMethod === 'online' || paymentMethod === 'upi' ? 'Pay Securely with Razorpay' : 'Place Cash On Delivery Order')}</span>
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
