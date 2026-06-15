'use client'

import { NextStudio } from 'next-sanity/studio';
import config from '../../../../sanity.config';
import { useState } from 'react';
import { Sparkles, Lock, Eye, EyeOff } from 'lucide-react';

// Simple owner-only password gate for Sanity Studio
// The password is stored as an env var: NEXT_PUBLIC_STUDIO_PASSWORD
// If no env var is set, defaults to 'ishaya-admin'
const STUDIO_PASSWORD = process.env.NEXT_PUBLIC_STUDIO_PASSWORD || 'ishaya-admin';

export default function StudioPage() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === STUDIO_PASSWORD) {
      setAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password. Owner access only.');
      setPassword('');
    }
  };

  if (authenticated) {
    return <NextStudio config={config} />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #121212 0%, #1e1a15 50%, #121212 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'var(--font-sans)',
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(197,168,128,0.2)',
        borderRadius: '24px',
        padding: '48px 40px',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center',
        boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '8px' }}>
          <Sparkles fill="#c5a880" color="#c5a880" size={28} />
          <span style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '24px', fontWeight: '700', color: '#fff', letterSpacing: '0.05em' }}>
            ISHAYA LUXURY
          </span>
        </div>
        <p style={{ fontSize: '11px', color: '#c5a880', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '36px' }}>
          Owner Studio Access
        </p>

        {/* Lock Icon */}
        <div style={{
          width: '64px',
          height: '64px',
          background: 'rgba(197,168,128,0.12)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          border: '1px solid rgba(197,168,128,0.3)',
        }}>
          <Lock size={26} color="#c5a880" />
        </div>

        <h1 style={{ color: '#fff', fontSize: '20px', marginBottom: '8px', fontFamily: 'Playfair Display, serif' }}>
          Restricted Area
        </h1>
        <p style={{ color: '#888', fontSize: '14px', marginBottom: '32px', lineHeight: '1.6' }}>
          This is the content management studio. Owner authentication required.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter owner password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.06)',
                border: error ? '1px solid #e03131' : '1px solid rgba(255,255,255,0.12)',
                borderRadius: '12px',
                padding: '14px 48px 14px 18px',
                fontSize: '15px',
                color: '#fff',
                fontFamily: 'var(--font-sans)',
                outline: 'none',
                transition: 'border 0.2s',
              }}
              onFocus={(e) => { e.target.style.borderColor = 'rgba(197,168,128,0.6)'; }}
              onBlur={(e) => { if (!error) e.target.style.borderColor = 'rgba(255,255,255,0.12)'; }}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(p => !p)}
              style={{
                position: 'absolute',
                right: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#888',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && (
            <p style={{ color: '#e03131', fontSize: '13px', marginBottom: '16px', textAlign: 'left' }}>
              ⚠ {error}
            </p>
          )}

          <button
            type="submit"
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #c5a880, #b0936c)',
              color: '#121212',
              border: 'none',
              borderRadius: '12px',
              padding: '15px',
              fontSize: '14px',
              fontWeight: '800',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              cursor: 'pointer',
              transition: 'transform 0.15s, box-shadow 0.15s',
              fontFamily: 'var(--font-sans)',
            }}
            onMouseEnter={(e) => { e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 8px 20px rgba(197,168,128,0.35)'; }}
            onMouseLeave={(e) => { e.target.style.transform = ''; e.target.style.boxShadow = ''; }}
          >
            Access Studio
          </button>
        </form>

        <p style={{ marginTop: '24px', fontSize: '12px', color: '#555', lineHeight: '1.6' }}>
          Not the website owner?{' '}
          <a href="/" style={{ color: '#c5a880', textDecoration: 'none' }}>
            Return to store →
          </a>
        </p>
      </div>
    </div>
  );
}
