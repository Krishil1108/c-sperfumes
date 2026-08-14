'use client';

import { useState } from 'react';
import { ShoppingBag, FileSpreadsheet, Lock } from 'lucide-react';
import Link from 'next/link';

export default function OrdersClient({ initialOrders }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [focused, setFocused] = useState(false);

  // Protect the page with the studio password
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_STUDIO_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password. Access denied.');
    }
  };

  const exportToCSV = () => {
    if (!initialOrders || initialOrders.length === 0) return;

    // Define CSV headers
    const headers = ['Order ID', 'Date', 'Customer Name', 'Email', 'Phone', 'Total Amount', 'Status'];
    
    // Map data to rows
    const rows = initialOrders.map(order => [
      order.orderId,
      new Date(order._createdAt).toLocaleDateString(),
      order.customerName,
      order.email,
      order.phone,
      order.totalAmount,
      order.paymentStatus
    ]);

    // Construct CSV string
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell || ''}"`).join(','))
    ].join('\n');

    // Create a Blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `orders_export_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: 'var(--cream)', padding: '24px' }}>
        <div style={{ 
          maxWidth: '420px', 
          width: '100%', 
          padding: '52px 40px', 
          background: 'var(--charcoal)', 
          border: '1px solid var(--gold)', 
          boxShadow: 'var(--shadow-gold)',
          textAlign: 'center' 
        }}>
          
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', display: 'flex', alignItems: 'center', justify: 'center', margin: '0 auto 20px', color: 'var(--gold)' }}>
            <Lock size={22} />
          </div>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: '300', color: 'var(--white)', marginBottom: '8px' }}>Admin Portal</h2>
          <p style={{ fontFamily: 'var(--font-label)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.22em', color: 'var(--gold)', marginBottom: '32px' }}>Enter Studio Credentials</p>
          
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <input 
              type="password" 
              placeholder="Admin Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              style={{ 
                padding: '14px 16px', 
                width: '100%', 
                border: focused ? '1px solid var(--gold)' : '1px solid rgba(255,255,255,0.1)', 
                background: 'rgba(255,255,255,0.05)', 
                outline: 'none', 
                color: 'var(--white)',
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                transition: 'all 0.22s ease',
                borderRadius: '0',
                boxShadow: focused ? '0 0 0 3px rgba(201,168,76,0.1)' : 'none'
              }}
            />
            {error && <p style={{ color: 'var(--gold-light)', fontSize: '12px', fontFamily: 'var(--font-label)', letterSpacing: '0.05em', textTransform: 'uppercase', margin: '4px 0 8px' }}>⚠️ {error}</p>}
            <button type="submit" 
              style={{ 
                padding: '15px 20px', 
                background: 'var(--gold)', 
                color: 'var(--noir)', 
                border: 'none', 
                cursor: 'pointer', 
                width: '100%',
                fontFamily: 'var(--font-label)',
                fontSize: '11px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.22em',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={e => e.target.style.background = 'var(--gold-light)'}
              onMouseLeave={e => e.target.style.background = 'var(--gold)'}>
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh', padding: '48px 0 80px' }}>
      <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* Dashboard Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ fontFamily: 'var(--font-label)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.3em', color: 'var(--gold)', display: 'block', marginBottom: '8px' }}>
              Management Console
            </span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '38px', fontWeight: '300', color: 'var(--text-dark)', margin: 0 }}>
              Customer Orders
            </h1>
          </div>
          
          <button 
            onClick={exportToCSV}
            style={{ 
              padding: '14px 28px', 
              background: 'var(--noir)', 
              color: 'var(--white)', 
              border: '1px solid var(--noir)', 
              cursor: 'pointer', 
              fontFamily: 'var(--font-label)',
              fontSize: '11px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={e => { e.target.style.background = 'var(--gold)'; e.target.style.color = 'var(--noir)'; e.target.style.borderColor = 'var(--gold)'; }}
            onMouseLeave={e => { e.target.style.background = 'var(--noir)'; e.target.style.color = 'var(--white)'; e.target.style.borderColor = 'var(--noir)'; }}
          >
            <FileSpreadsheet size={14} />
            Export to CSV
          </button>
        </div>

        {/* Orders Table Container */}
        <div style={{ 
          background: 'var(--white)', 
          border: '1px solid rgba(201,168,76,0.15)', 
          boxShadow: 'var(--shadow-sm)',
          overflowX: 'auto'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--charcoal)', borderBottom: '2px solid var(--gold)' }}>
                <th style={{ padding: '18px 20px', fontFamily: 'var(--font-label)', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--white)' }}>Order ID</th>
                <th style={{ padding: '18px 20px', fontFamily: 'var(--font-label)', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--white)' }}>Date</th>
                <th style={{ padding: '18px 20px', fontFamily: 'var(--font-label)', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--white)' }}>Customer</th>
                <th style={{ padding: '18px 20px', fontFamily: 'var(--font-label)', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--white)' }}>Email</th>
                <th style={{ padding: '18px 20px', fontFamily: 'var(--font-label)', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--white)' }}>Phone</th>
                <th style={{ padding: '18px 20px', fontFamily: 'var(--font-label)', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--white)' }}>Amount</th>
                <th style={{ padding: '18px 20px', fontFamily: 'var(--font-label)', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--white)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {initialOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: '300' }}>
                    No client orders recorded.
                  </td>
                </tr>
              ) : (
                initialOrders.map((order, idx) => (
                  <tr 
                    key={order._id || idx} 
                    style={{ borderBottom: '1px solid rgba(201,168,76,0.15)', transition: 'background 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(201,168,76,0.02)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '18px 20px', fontWeight: 'bold', fontSize: '13px', color: 'var(--text-dark)' }}>{order.orderId || '-'}</td>
                    <td style={{ padding: '18px 20px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: '300' }}>{new Date(order._createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '18px 20px', fontSize: '14px', fontWeight: '500', color: 'var(--text-dark)' }}>{order.customerName}</td>
                    <td style={{ padding: '18px 20px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: '300' }}>{order.email}</td>
                    <td style={{ padding: '18px 20px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: '300' }}>{order.phone}</td>
                    <td style={{ padding: '18px 20px', fontSize: '15px', fontWeight: '600', fontFamily: 'var(--font-display)', color: 'var(--text-dark)' }}>₹{order.totalAmount}</td>
                    <td style={{ padding: '18px 20px' }}>
                      <span style={{ 
                        padding: '5px 12px', 
                        background: order.paymentStatus === 'Paid' ? 'rgba(45,154,95,0.08)' : 'rgba(217,48,37,0.08)', 
                        color: order.paymentStatus === 'Paid' ? '#1e8e3e' : '#d93025',
                        border: order.paymentStatus === 'Paid' ? '1px solid rgba(45,154,95,0.25)' : '1px solid rgba(217,48,37,0.25)',
                        fontSize: '11px',
                        fontFamily: 'var(--font-label)',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em'
                      }}>
                        {order.paymentStatus || 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
