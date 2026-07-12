'use client';

import { useState, useEffect } from 'react';

export default function OrdersClient({ initialOrders }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Protect the page with the studio password
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_STUDIO_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f9f9f9' }}>
        <form onSubmit={handleLogin} style={{ padding: '40px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '20px', color: '#333' }}>Admin Login</h2>
          <input 
            type="password" 
            placeholder="Enter Admin Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '10px', width: '100%', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          {error && <p style={{ color: 'red', fontSize: '14px', marginBottom: '15px' }}>{error}</p>}
          <button type="submit" style={{ padding: '10px 20px', background: '#000', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%' }}>
            Access Dashboard
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', color: '#111' }}>Orders Dashboard</h1>
        <button 
          onClick={exportToCSV}
          style={{ padding: '10px 20px', background: '#bfa15f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          ⬇️ Export to CSV (Excel)
        </button>
      </div>

      <div style={{ overflowX: 'auto', background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f4f4f4', borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '15px', color: '#555' }}>Order ID</th>
              <th style={{ padding: '15px', color: '#555' }}>Date</th>
              <th style={{ padding: '15px', color: '#555' }}>Customer Name</th>
              <th style={{ padding: '15px', color: '#555' }}>Email</th>
              <th style={{ padding: '15px', color: '#555' }}>Phone</th>
              <th style={{ padding: '15px', color: '#555' }}>Amount</th>
              <th style={{ padding: '15px', color: '#555' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {initialOrders.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ padding: '30px', textAlign: 'center', color: '#888' }}>
                  No orders found.
                </td>
              </tr>
            ) : (
              initialOrders.map((order) => (
                <tr key={order._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '15px', fontWeight: 'bold' }}>{order.orderId || '-'}</td>
                  <td style={{ padding: '15px' }}>{new Date(order._createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '15px' }}>{order.customerName}</td>
                  <td style={{ padding: '15px' }}>{order.email}</td>
                  <td style={{ padding: '15px' }}>{order.phone}</td>
                  <td style={{ padding: '15px' }}>₹{order.totalAmount}</td>
                  <td style={{ padding: '15px' }}>
                    <span style={{ 
                      padding: '4px 10px', 
                      background: order.paymentStatus === 'Paid' ? '#e6f4ea' : '#fef0f0', 
                      color: order.paymentStatus === 'Paid' ? '#1e8e3e' : '#d93025',
                      borderRadius: '12px',
                      fontSize: '13px',
                      fontWeight: 'bold'
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
  );
}
