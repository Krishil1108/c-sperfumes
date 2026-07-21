'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../../lib/CartContext';
import { ShoppingBag, ArrowLeft, CheckCircle, Gift, CreditCard, Truck, Lock, ChevronRight, Package } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const loadScript = (src) => new Promise((resolve) => {
  if (document.querySelector(`script[src="${src}"]`)) { resolve(true); return; }
  const script = document.createElement('script');
  script.src = src;
  script.onload = () => resolve(true);
  script.onerror = () => resolve(false);
  document.body.appendChild(script);
});

const STEPS = ['Delivery', 'Payment', 'Review'];

// Reusable styled input
function FormInput({ label, type = 'text', name, value, onChange, placeholder, required }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{
        fontFamily: 'var(--font-label)', fontSize: '10px', fontWeight: '700',
        textTransform: 'uppercase', letterSpacing: '0.18em',
        color: focused ? 'var(--gold)' : 'var(--text-muted)',
        transition: 'color 0.2s'
      }}>
        {label}{required && <span style={{ color: 'var(--gold)', marginLeft: '2px' }}>*</span>}
      </label>
      <input
        type={type} name={name} value={value} onChange={onChange}
        placeholder={placeholder} required={required}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          border: focused ? '1px solid var(--gold)' : '1px solid rgba(0,0,0,0.12)',
          background: 'var(--white)',
          padding: '13px 16px',
          fontFamily: 'var(--font-body)',
          fontSize: '14px',
          color: 'var(--text-dark)',
          outline: 'none',
          borderRadius: '0',
          transition: 'border-color 0.22s, box-shadow 0.22s',
          boxShadow: focused ? '0 0 0 3px rgba(201,168,76,0.1)' : 'none',
          width: '100%',
        }}
      />
    </div>
  );
}

// Payment method card
function PaymentCard({ method, label, sub, icon, selected, onSelect }) {
  return (
    <label onClick={onSelect} style={{
      display: 'flex', alignItems: 'center', gap: '14px',
      padding: '16px 18px',
      border: selected ? '1.5px solid var(--gold)' : '1px solid rgba(0,0,0,0.1)',
      background: selected ? 'rgba(201,168,76,0.04)' : 'var(--white)',
      cursor: 'pointer',
      transition: 'border-color 0.22s, background 0.22s',
    }}>
      <div style={{
        width: '20px', height: '20px', borderRadius: '50%',
        border: selected ? '5px solid var(--gold)' : '2px solid rgba(0,0,0,0.2)',
        flexShrink: '0', transition: 'border 0.2s',
        background: 'var(--white)',
      }} />
      <div style={{ color: selected ? 'var(--gold)' : 'rgba(0,0,0,0.4)', flexShrink: '0', display: 'flex' }}>
        {icon}
      </div>
      <div style={{ flex: '1' }}>
        <p style={{ fontFamily: 'var(--font-label)', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-dark)', marginBottom: '2px' }}>{label}</p>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '300' }}>{sub}</p>
      </div>
      {selected && <ChevronRight size={16} color="var(--gold)" />}
    </label>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartSubtotal, cartTotal, cartSavings, clearCart } = useCart();

  const [step, setStep] = useState(0); // 0=Delivery, 1=Payment, 2=Review
  const [formData, setFormData] = useState({
    email: '', firstName: '', lastName: '', address: '', city: '', postalCode: '', phone: ''
  });
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [isProcessing, setIsProcessing] = useState(false);

  const hasTrackedCheckoutRef = useRef(false);
  useEffect(() => {
    if (!hasTrackedCheckoutRef.current && cartItems.length > 0 && typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'InitiateCheckout', { currency: 'INR', value: cartTotal, num_items: cartItems.length });
      hasTrackedCheckoutRef.current = true;
    }
  }, [cartItems, cartTotal]);

  useEffect(() => {
    if (cartItems.length === 0 && !isSuccessOpen) {
      const timer = setTimeout(() => { if (cartItems.length === 0 && !isSuccessOpen) router.push('/'); }, 500);
      return () => clearTimeout(timer);
    }
  }, [cartItems, isSuccessOpen, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDeliveryNext = (e) => {
    e.preventDefault();
    const required = ['email', 'firstName', 'lastName', 'address', 'city', 'postalCode', 'phone'];
    if (required.every(k => formData[k].trim())) setStep(1);
    else alert('Please fill all required delivery fields.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (paymentMethod === 'cod') {
      const generatedId = 'CS-' + Math.floor(100000 + Math.random() * 900000);
      setOrderId(generatedId);
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'Purchase', { currency: 'INR', value: cartTotal, num_items: cartItems.length });
      }
      clearCart();
      setIsSuccessOpen(true);
      return;
    }

    setIsProcessing(true);
    try {
      const scriptLoaded = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!scriptLoaded) { alert('Razorpay SDK failed. Check internet connection.'); setIsProcessing(false); return; }

      const orderResponse = await fetch('/api/razorpay/create-order', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: cartTotal }),
      });
      if (!orderResponse.ok) throw new Error('Failed to create order');
      const order = await orderResponse.json();
      if (order.error) { alert('Server error: ' + order.error); setIsProcessing(false); return; }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, amount: order.amount, currency: order.currency,
        name: 'C&S Perfumes', description: 'Premium Fragrance Order', image: '/logo.png', order_id: order.id,
        handler: async function (response) {
          try {
            const verifyResponse = await fetch('/api/razorpay/verify-payment', {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...response, customer: formData, items: cartItems, totalAmount: cartTotal, paymentMethod }),
            });
            const verifyData = await verifyResponse.json();
            if (verifyData.status === 'success') {
              setOrderId('RP-' + order.id.slice(-6).toUpperCase());
              if (typeof window !== 'undefined' && window.fbq) window.fbq('track', 'Purchase', { currency: 'INR', value: cartTotal });
              clearCart(); setIsSuccessOpen(true);
            } else alert('Payment verification failed. Please contact support.');
          } catch { alert('Verification error. Please contact support.'); }
        },
        prefill: { name: `${formData.firstName} ${formData.lastName}`, email: formData.email, contact: formData.phone },
        theme: { color: '#C9A84C' },
        modal: { ondismiss: () => setIsProcessing(false) },
      };
      new window.Razorpay(options).open();
    } catch (error) {
      alert('Payment initialization failed: ' + error.message);
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh' }}>

      {/* Top Bar */}
      <div style={{ background: 'var(--noir)', borderBottom: '1px solid rgba(201,168,76,0.15)', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-label)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', transition: 'color 0.2s', textDecoration: 'none' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
          <ArrowLeft size={14} />
          Back to Shop
        </Link>

        {/* Checkout logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ background: 'var(--cream)', padding: '4px 10px', borderRadius: '3px', display: 'flex' }}>
            <img src="/logo.png" alt="C&S Perfumes" style={{ height: '28px', width: 'auto' }} />
          </span>
        </div>

        {/* Secure badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-label)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          <Lock size={12} color="var(--gold)" />
          <span>Secure Checkout</span>
        </div>
      </div>

      {/* Step Progress */}
      <div style={{ background: 'var(--white)', borderBottom: '1px solid rgba(0,0,0,0.06)', padding: '0 32px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <button
                onClick={() => i < step && setStep(i)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px', padding: '18px 0',
                  background: 'none', border: 'none', cursor: i < step ? 'pointer' : 'default',
                  fontFamily: 'var(--font-label)', fontSize: '10px', fontWeight: '700',
                  textTransform: 'uppercase', letterSpacing: '0.18em',
                  color: i === step ? 'var(--text-dark)' : i < step ? 'var(--gold)' : 'var(--text-muted)',
                  position: 'relative',
                  transition: 'color 0.2s',
                }}
              >
                <span style={{
                  width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: i === step ? 'var(--noir)' : i < step ? 'var(--gold)' : 'rgba(0,0,0,0.08)',
                  color: i === step ? 'var(--white)' : i < step ? 'var(--noir)' : 'var(--text-muted)',
                  fontSize: '10px', fontWeight: '800', transition: 'background 0.3s, color 0.3s',
                  flexShrink: '0',
                }}>
                  {i < step ? '✓' : i + 1}
                </span>
                {s}
                {/* Active underline */}
                {i === step && (
                  <motion.span layoutId="step-underline"
                    style={{ position: 'absolute', bottom: '0', left: '0', right: '0', height: '2px', background: 'var(--gold)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
                )}
              </button>
              {i < STEPS.length - 1 && (
                <div style={{ flex: '1', maxWidth: '80px', height: '1px', background: i < step ? 'var(--gold)' : 'rgba(0,0,0,0.1)', margin: '0 16px', transition: 'background 0.4s' }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Main Layout */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 32px 80px', display: 'grid', gridTemplateColumns: '1fr 400px', gap: '40px', alignItems: 'start' }} className="checkout-main-grid">

        {/* LEFT: Step Content */}
        <AnimatePresence mode="wait">
          {/* STEP 0: Delivery */}
          {step === 0 && (
            <motion.form key="delivery" onSubmit={handleDeliveryNext}
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ background: 'var(--white)', padding: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: '400', color: 'var(--text-dark)', marginBottom: '4px' }}>Delivery Information</h2>
                <p style={{ fontFamily: 'var(--font-label)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--gold)' }}>Where should we ship your order?</p>
              </div>

              <FormInput label="Email Address" type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="your@email.com" required />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <FormInput label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
                <FormInput label="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
              </div>

              <FormInput label="Street Address" name="address" value={formData.address} onChange={handleInputChange} placeholder="Building, street, landmark..." required />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <FormInput label="City" name="city" value={formData.city} onChange={handleInputChange} required />
                <FormInput label="Postal Pincode" name="postalCode" value={formData.postalCode} onChange={handleInputChange} required />
              </div>

              <FormInput label="Phone Number" type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+91 XXXXX XXXXX" required />

              <motion.button type="submit"
                style={{ background: 'var(--noir)', color: 'var(--white)', border: 'none', padding: '16px 32px', fontFamily: 'var(--font-label)', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.22em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '8px', transition: 'background 0.22s' }}
                whileHover={{ background: '#1C1C1C' }}
                whileTap={{ scale: 0.98 }}>
                Continue to Payment
                <ChevronRight size={16} />
              </motion.button>
            </motion.form>
          )}

          {/* STEP 1: Payment */}
          {step === 1 && (
            <motion.div key="payment"
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ background: 'var(--white)', padding: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: '400', color: 'var(--text-dark)', marginBottom: '4px' }}>Payment Method</h2>
                <p style={{ fontFamily: 'var(--font-label)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--gold)' }}>Choose your preferred payment</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <PaymentCard method="upi" label="UPI" sub="GPay, PhonePe, Paytm — instant & secure"
                  icon={<img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" style={{ width: '28px', filter: paymentMethod === 'upi' ? 'none' : 'grayscale(1)', opacity: paymentMethod === 'upi' ? 1 : 0.4 }} />}
                  selected={paymentMethod === 'upi'} onSelect={() => setPaymentMethod('upi')} />
                <PaymentCard method="online" label="Cards & Netbanking" sub="Visa, Mastercard, Rupay, Net Banking"
                  icon={<CreditCard size={22} />} selected={paymentMethod === 'online'} onSelect={() => setPaymentMethod('online')} />
                <PaymentCard method="cod" label="Cash on Delivery" sub="Pay at your doorstep on arrival"
                  icon={<Truck size={22} />} selected={paymentMethod === 'cod'} onSelect={() => setPaymentMethod('cod')} />
              </div>

              {/* Security note */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.15)' }}>
                <Lock size={13} color="var(--gold)" style={{ flexShrink: '0' }} />
                <p style={{ fontFamily: 'var(--font-label)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  All payments are 256-bit SSL encrypted via Razorpay
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" onClick={() => setStep(0)}
                  style={{ padding: '15px 24px', border: '1px solid rgba(0,0,0,0.12)', background: 'transparent', fontFamily: 'var(--font-label)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', cursor: 'pointer', color: 'var(--text-muted)', transition: 'border-color 0.2s, color 0.2s' }}>
                  Back
                </button>
                <motion.button onClick={() => setStep(2)} type="button"
                  style={{ flex: '1', background: 'var(--noir)', color: 'var(--white)', border: 'none', padding: '15px 24px', fontFamily: 'var(--font-label)', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.22em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                  whileTap={{ scale: 0.98 }}>
                  Review Order <ChevronRight size={16} />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Review & Place Order */}
          {step === 2 && (
            <motion.form key="review" onSubmit={handleSubmit}
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ background: 'var(--white)', padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: '400', color: 'var(--text-dark)', marginBottom: '4px' }}>Review & Confirm</h2>
                <p style={{ fontFamily: 'var(--font-label)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--gold)' }}>Everything looks good?</p>
              </div>

              {/* Delivery summary */}
              <div style={{ padding: '18px 20px', border: '1px solid rgba(0,0,0,0.08)', background: 'var(--cream)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontFamily: 'var(--font-label)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--text-muted)', fontWeight: '700' }}>Delivery To</span>
                  <button type="button" onClick={() => setStep(0)} style={{ fontFamily: 'var(--font-label)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--gold)', background: 'none', border: 'none', cursor: 'pointer' }}>Edit</button>
                </div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '16px', color: 'var(--text-dark)', marginBottom: '2px' }}>{formData.firstName} {formData.lastName}</p>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '300' }}>{formData.address}, {formData.city} — {formData.postalCode}</p>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '300' }}>{formData.email} · {formData.phone}</p>
              </div>

              {/* Payment summary */}
              <div style={{ padding: '18px 20px', border: '1px solid rgba(0,0,0,0.08)', background: 'var(--cream)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontFamily: 'var(--font-label)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--text-muted)', fontWeight: '700' }}>Payment</span>
                  <button type="button" onClick={() => setStep(1)} style={{ fontFamily: 'var(--font-label)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--gold)', background: 'none', border: 'none', cursor: 'pointer' }}>Edit</button>
                </div>
                <p style={{ fontFamily: 'var(--font-label)', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-dark)' }}>
                  {paymentMethod === 'upi' ? '🔵 UPI (GPay / PhonePe / Paytm)' : paymentMethod === 'online' ? '💳 Cards & Netbanking' : '🚚 Cash on Delivery'}
                </p>
              </div>

              {/* Gift box notice */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '16px', background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.2)' }}>
                <Gift size={18} color="var(--gold)" style={{ flexShrink: '0', marginTop: '2px' }} />
                <div>
                  <p style={{ fontFamily: 'var(--font-label)', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--text-dark)', marginBottom: '4px' }}>Free Premium Gift Box Included</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '300', lineHeight: '1.6' }}>Your fragrances will be wrapped in satin cushioning inside our signature gold-foil champagne gift box.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" onClick={() => setStep(1)}
                  style={{ padding: '15px 24px', border: '1px solid rgba(0,0,0,0.12)', background: 'transparent', fontFamily: 'var(--font-label)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  Back
                </button>
                <motion.button type="submit" disabled={isProcessing}
                  style={{ flex: '1', background: isProcessing ? 'var(--graphite)' : 'var(--gold)', color: isProcessing ? 'rgba(255,255,255,0.5)' : 'var(--noir)', border: 'none', padding: '16px 24px', fontFamily: 'var(--font-label)', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.22em', cursor: isProcessing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: 'background 0.25s' }}
                  whileTap={!isProcessing ? { scale: 0.98 } : {}}>
                  <ShoppingBag size={16} />
                  {isProcessing ? 'Processing...' : paymentMethod === 'cod' ? 'Place COD Order' : 'Pay Securely →'}
                </motion.button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* RIGHT: Order Summary (sticky) */}
        <div style={{ position: 'sticky', top: 'calc(var(--header-height) + var(--announcement-height) + 24px)' }}>
          <div style={{ background: 'var(--white)', padding: '32px', marginBottom: '16px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: '400', color: 'var(--text-dark)', marginBottom: '24px' }}>Order Summary</h3>

            {/* Cart Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              {cartItems.map((item) => (
                <div key={item.id} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ position: 'relative', flexShrink: '0' }}>
                    <img src={item.image} alt={item.title} style={{ width: '56px', height: '56px', objectFit: 'cover', background: 'var(--pearl)' }} />
                    {/* qty badge */}
                    <span style={{ position: 'absolute', top: '-7px', right: '-7px', width: '19px', height: '19px', background: 'var(--noir)', color: 'var(--white)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-label)', fontSize: '9px', fontWeight: '700' }}>
                      {item.quantity}
                    </span>
                  </div>
                  <div style={{ flex: '1', minWidth: '0' }}>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: '400', color: 'var(--text-dark)', lineHeight: '1.3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</p>
                    <p style={{ fontFamily: 'var(--font-label)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--gold)', marginTop: '2px' }}>{item.brand || 'C&S Perfumes'}</p>
                  </div>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: '400', color: 'var(--text-dark)', flexShrink: '0' }}>
                    ₹{item.salePrice * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div style={{ borderTop: '1px solid rgba(0,0,0,0.07)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {cartSavings > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-label)', fontSize: '11px', letterSpacing: '0.08em' }}>
                  <span style={{ color: 'var(--text-muted)', textTransform: 'uppercase' }}>You Save</span>
                  <span style={{ color: '#2d9a5f', fontWeight: '600' }}>− ₹{cartSavings}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-label)', fontSize: '11px', letterSpacing: '0.08em' }}>
                <span style={{ color: 'var(--text-muted)', textTransform: 'uppercase' }}>Shipping</span>
                <span style={{ color: '#2d9a5f', fontWeight: '600' }}>FREE</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid rgba(0,0,0,0.07)', marginTop: '4px' }}>
                <span style={{ fontFamily: 'var(--font-label)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-muted)' }}>Total Payable</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: '400', color: 'var(--text-dark)' }}>₹{cartTotal}</span>
              </div>
            </div>
          </div>

          {/* Delivery timeline card */}
          <div style={{ background: 'var(--charcoal)', padding: '22px 24px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <Package size={18} color="var(--gold)" style={{ flexShrink: '0', marginTop: '2px' }} />
            <div>
              <p style={{ fontFamily: 'var(--font-label)', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--gold)', marginBottom: '4px' }}>Estimated Delivery</p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: '400', color: 'var(--white)' }}>3–5 Business Days</p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: '300', marginTop: '4px' }}>Premium insured packaging</p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {isSuccessOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: '0', background: 'rgba(0,0,0,0.75)', zIndex: '1000', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backdropFilter: 'blur(6px)' }}>
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 24 }}
              style={{ background: 'var(--white)', maxWidth: '480px', width: '100%', padding: '52px 40px', textAlign: 'center' }}>

              {/* Success icon */}
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 20 }}
                style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(45,154,95,0.1)', border: '2px solid rgba(45,154,95,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <CheckCircle size={36} color="#2d9a5f" />
              </motion.div>

              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: '300', color: 'var(--text-dark)', marginBottom: '8px' }}>Order Confirmed!</h2>
              <p style={{ fontFamily: 'var(--font-label)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.22em', color: 'var(--gold)', marginBottom: '28px' }}>Thank you for your order</p>

              <div style={{ background: 'var(--cream)', padding: '20px', marginBottom: '32px', textAlign: 'left' }}>
                {[
                  { label: 'Order Reference', value: orderId },
                  { label: 'Delivery Name', value: `${formData.firstName} ${formData.lastName}` },
                  { label: 'Estimated Arrival', value: '3–5 Business Days' },
                  { label: 'Payment', value: paymentMethod === 'online' ? 'Cards/Netbanking' : paymentMethod === 'upi' ? 'UPI' : 'Cash on Delivery' },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '8px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <span style={{ fontFamily: 'var(--font-label)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-muted)' }}>{label}</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '14px', color: 'var(--text-dark)' }}>{value}</span>
                  </div>
                ))}
              </div>

              <motion.button
                onClick={() => { setIsSuccessOpen(false); router.push('/'); }}
                style={{ width: '100%', background: 'var(--noir)', color: 'var(--white)', border: 'none', padding: '16px', fontFamily: 'var(--font-label)', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.22em', cursor: 'pointer' }}
                whileHover={{ background: 'var(--gold)', color: 'var(--noir)' }}
                transition={{ duration: 0.2 }}>
                Continue Shopping
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @media (max-width: 900px) {
          .checkout-main-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
