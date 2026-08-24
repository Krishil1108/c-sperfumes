'use client';

import React, { useState, useEffect } from 'react';
import { dbService } from '../../lib/db';
import { Lock, LogOut, Package, Settings, FileText, Plus, Trash2, Edit3, Save, X, Search, FileSpreadsheet } from 'lucide-react';
import Link from 'next/link';

export default function AdminClient() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [focusedInput, setFocusedInput] = useState('');

  // App data states
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'settings' | 'orders'
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Search/Filter states
  const [prodSearch, setProdSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');

  // Product editor modal states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null means creating new product

  // Product form data
  const [prodForm, setProdForm] = useState({
    title: '', slug: '', description: '', brand: 'C&S Perfumes', category: 'Floral',
    concentration: 'Extrait De Parfum', gender: 'Unisex', notes: '', price: '',
    salePrice: '', discount: '0', rating: '4.8', reviewsCount: '150', image: '',
    images: '', inStock: true, isBestseller: false, isNewArrival: false, hotspotX: '50', hotspotY: '50'
  });

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const prodList = await dbService.getPerfumes();
      const orderList = await dbService.getOrders();
      const settingsData = await dbService.getSiteSettings();
      setProducts(prodList || []);
      setOrders(orderList || []);
      setSettings(settingsData);
    } catch (err) {
      console.error("Failed to load data in admin console:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid username or password.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
  };

  // PRODUCT ACTIONS
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProdForm({
      title: '', slug: '', description: '', brand: 'C&S Perfumes', category: 'Floral',
      concentration: 'Extrait De Parfum', gender: 'Unisex', notes: 'Rose, Jasmine, Musk', price: '4500',
      salePrice: '3800', discount: '15', rating: '4.8', reviewsCount: '80', image: '/images/perfume_elegant_1784660079140.png',
      images: '/images/perfume_elegant_1784660079140.png', inStock: true, isBestseller: false, isNewArrival: true, hotspotX: '50', hotspotY: '50'
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setProdForm({
      title: prod.title || '',
      slug: prod.slug || '',
      description: prod.description || '',
      brand: prod.brand || 'C&S Perfumes',
      category: prod.category || 'Floral',
      concentration: prod.concentration || 'Extrait De Parfum',
      gender: prod.gender || 'Unisex',
      notes: Array.isArray(prod.notes) ? prod.notes.join(', ') : (prod.notes || ''),
      price: prod.price || '',
      salePrice: prod.salePrice || '',
      discount: prod.discount || '0',
      rating: prod.rating || '4.8',
      reviewsCount: prod.reviewsCount || '100',
      image: prod.image || '',
      images: Array.isArray(prod.images) ? prod.images.join(', ') : (prod.image || ''),
      inStock: prod.inStock !== false,
      isBestseller: !!prod.isBestseller,
      isNewArrival: !!prod.isNewArrival,
      hotspotX: prod.hotspot?.x || '50',
      hotspotY: prod.hotspot?.y || '50'
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const formattedNotes = prodForm.notes.split(',').map(n => n.trim()).filter(Boolean);
    const formattedImages = prodForm.images.split(',').map(i => i.trim()).filter(Boolean);

    const productPayload = {
      ...editingProduct,
      title: prodForm.title,
      slug: prodForm.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: prodForm.description,
      brand: prodForm.brand,
      category: prodForm.category,
      concentration: prodForm.concentration,
      gender: prodForm.gender,
      notes: formattedNotes,
      price: parseFloat(prodForm.price),
      salePrice: parseFloat(prodForm.salePrice),
      discount: parseInt(prodForm.discount || 0),
      rating: parseFloat(prodForm.rating || 5.0),
      reviewsCount: parseInt(prodForm.reviewsCount || 0),
      image: prodForm.image || formattedImages[0] || '',
      images: formattedImages,
      inStock: prodForm.inStock,
      isBestseller: prodForm.isBestseller,
      isNewArrival: prodForm.isNewArrival,
      hotspot: {
        x: parseFloat(prodForm.hotspotX || 50),
        y: parseFloat(prodForm.hotspotY || 50)
      }
    };

    if (editingProduct?.id) {
      productPayload.id = editingProduct.id;
      productPayload._id = editingProduct._id;
    }

    try {
      await dbService.saveProduct(productPayload);
      setIsProductModalOpen(false);
      loadData();
    } catch (err) {
      alert("Failed to save product: " + err.message);
    }
  };

  const handleDeleteProduct = async (prodId) => {
    if (confirm("Are you sure you want to delete this perfume? This action cannot be undone.")) {
      try {
        await dbService.deleteProduct(prodId);
        loadData();
      } catch (err) {
        alert("Failed to delete product: " + err.message);
      }
    }
  };

  // EDITORIAL SETTINGS ACTIONS
  const handleUpdateHeroSlide = (index, field, value) => {
    const updatedSlides = [...settings.heroSlides];
    updatedSlides[index] = { ...updatedSlides[index], [field]: value };
    setSettings({ ...settings, heroSlides: updatedSlides });
  };

  const handleAddHeroSlide = () => {
    const updatedSlides = [...settings.heroSlides, {
      title: "New Campaign",
      subtitle: "Sensory notes description...",
      buttonText: "Shop Scent",
      link: "/shop",
      image: "/images/perfume_elegant_1784660079140.png"
    }];
    setSettings({ ...settings, heroSlides: updatedSlides });
  };

  const handleRemoveHeroSlide = (index) => {
    if (settings.heroSlides.length <= 1) {
      alert("You must keep at least one hero slide.");
      return;
    }
    const updatedSlides = settings.heroSlides.filter((_, idx) => idx !== index);
    setSettings({ ...settings, heroSlides: updatedSlides });
  };

  const handleUpdateCategory = (index, field, value) => {
    const updatedCats = [...settings.scentCategories];
    updatedCats[index] = { ...updatedCats[index], [field]: value };
    setSettings({ ...settings, scentCategories: updatedCats });
  };

  const handleUpdatePromise = (index, field, value) => {
    const updatedPromises = [...settings.whyChooseUs];
    updatedPromises[index] = { ...updatedPromises[index], [field]: value };
    setSettings({ ...settings, whyChooseUs: updatedPromises });
  };

  const handleSaveSettings = async () => {
    try {
      await dbService.saveSiteSettings(settings);
      alert("Editorial settings saved successfully!");
      loadData();
    } catch (err) {
      alert("Failed to save settings: " + err.message);
    }
  };

  // ORDER ACTIONS
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await dbService.updateOrderStatus(orderId, newStatus);
      loadData();
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  };

  const exportOrdersToCSV = () => {
    if (orders.length === 0) return;
    const headers = ['Order ID', 'Date', 'Customer', 'Email', 'Phone', 'Total', 'Method', 'Status'];
    const rows = orders.map(o => [
      o.orderId,
      new Date(o._createdAt).toLocaleDateString(),
      o.customerName,
      o.email,
      o.phone,
      o.totalAmount,
      o.paymentMethod,
      o.paymentStatus
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.map(c => `"${c || ''}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `orders_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
  };

  // Filters
  const filteredProducts = products.filter(p => 
    p.title?.toLowerCase().includes(prodSearch.toLowerCase()) || 
    p.brand?.toLowerCase().includes(prodSearch.toLowerCase()) ||
    p.category?.toLowerCase().includes(prodSearch.toLowerCase())
  );

  const filteredOrders = orders.filter(o => 
    o.customerName?.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.orderId?.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.phone?.includes(orderSearch)
  );

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

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: '300', color: 'var(--white)', marginBottom: '8px' }}>Admin Studio</h2>
          <p style={{ fontFamily: 'var(--font-label)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.22em', color: 'var(--gold)', marginBottom: '32px' }}>Website Control Center</p>
          
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <input 
              type="text" 
              placeholder="Username (admin)" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => setFocusedInput('username')}
              onBlur={() => setFocusedInput('')}
              style={{ 
                padding: '14px 16px', 
                width: '100%', 
                border: focusedInput === 'username' ? '1px solid var(--gold)' : '1px solid rgba(255,255,255,0.1)', 
                background: 'rgba(255,255,255,0.05)', 
                outline: 'none', 
                color: 'var(--white)',
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                transition: 'all 0.22s ease',
                borderRadius: '0',
                boxShadow: focusedInput === 'username' ? '0 0 0 3px rgba(201,168,76,0.1)' : 'none'
              }}
              required
            />
            <input 
              type="password" 
              placeholder="Password (admin123)" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedInput('password')}
              onBlur={() => setFocusedInput('')}
              style={{ 
                padding: '14px 16px', 
                width: '100%', 
                border: focusedInput === 'password' ? '1px solid var(--gold)' : '1px solid rgba(255,255,255,0.1)', 
                background: 'rgba(255,255,255,0.05)', 
                outline: 'none', 
                color: 'var(--white)',
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                transition: 'all 0.22s ease',
                borderRadius: '0',
                boxShadow: focusedInput === 'password' ? '0 0 0 3px rgba(201,168,76,0.1)' : 'none'
              }}
              required
            />
            {loginError && <p style={{ color: 'var(--gold-light)', fontSize: '11px', fontFamily: 'var(--font-label)', letterSpacing: '0.05em', textTransform: 'uppercase', margin: '4px 0 8px', textAlign: 'left' }}>⚠️ {loginError}</p>}
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
                transition: 'all 0.3s ease',
                marginTop: '8px'
              }}
              onMouseEnter={e => e.target.style.background = 'var(--gold-light)'}
              onMouseLeave={e => e.target.style.background = 'var(--gold)'}>
              Enter Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Admin header */}
      <header style={{ background: 'var(--noir)', borderBottom: '1px solid rgba(201,168,76,0.15)', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ background: 'var(--cream)', padding: '4px 10px', display: 'flex', borderRadius: '3px' }}>
            <img src="/images/logo.png" alt="C&S" style={{ height: '24px', width: 'auto', filter: 'brightness(0)' }} />
          </span>
          <span style={{ fontFamily: 'var(--font-label)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--gold)' }}>Studio Manager</span>
        </div>
        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.6)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-label)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', transition: 'color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
          <LogOut size={13} />
          Sign Out
        </button>
      </header>

      {/* Main Container */}
      <div style={{ maxWidth: '1200px', width: '100%', margin: '40px auto', padding: '0 32px 80px', flex: '1', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Tab selector */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(201,168,76,0.15)', gap: '4px' }}>
          {[
            { id: 'products', label: 'Perfumes', icon: <Package size={14} /> },
            { id: 'settings', label: 'Editorial Settings', icon: <Settings size={14} /> },
            { id: 'orders', label: 'Client Orders', icon: <FileText size={14} /> }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '14px 24px', background: activeTab === tab.id ? 'var(--white)' : 'transparent',
                border: '1px solid transparent',
                borderBottom: 'none',
                borderColor: activeTab === tab.id ? 'rgba(201,168,76,0.15) rgba(201,168,76,0.15) transparent' : 'transparent',
                fontFamily: 'var(--font-label)', fontSize: '10px', fontWeight: '700',
                textTransform: 'uppercase', letterSpacing: '0.15em',
                color: activeTab === tab.id ? 'var(--gold)' : 'var(--text-muted)',
                cursor: 'pointer', transition: 'all 0.22s ease',
                position: 'relative', top: '1px'
              }}>
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* LOADING SHIMMER */}
        {isLoading ? (
          <div style={{ padding: '64px 0', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: '300' }}>
            Syncing database details...
          </div>
        ) : (
          <div style={{ background: 'var(--white)', border: '1px solid rgba(201,168,76,0.15)', padding: '36px', boxShadow: 'var(--shadow-sm)' }}>
            
            {/* ========================================================
                TAB 1: PRODUCTS MANAGER
                ======================================================== */}
            {activeTab === 'products' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid rgba(201,168,76,0.15)', background: 'var(--cream)', padding: '8px 16px', minWidth: '280px' }}>
                    <Search size={14} color="var(--text-muted)" style={{ marginRight: '10px' }} />
                    <input type="text" placeholder="Search product name, category..." value={prodSearch} onChange={e => setProdSearch(e.target.value)}
                      style={{ border: 'none', background: 'transparent', outline: 'none', fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-dark)', width: '100%' }} />
                  </div>
                  <button onClick={handleOpenAddProduct}
                    style={{ background: 'var(--noir)', color: 'var(--white)', border: 'none', padding: '12px 24px', fontFamily: 'var(--font-label)', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.22s' }}
                    onMouseEnter={e => e.target.style.background = 'var(--gold)'}
                    onMouseLeave={e => e.target.style.background = 'var(--noir)'}>
                    <Plus size={14} /> Add New Scent
                  </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--gold)', background: 'var(--charcoal)' }}>
                        <th style={{ padding: '14px 16px', fontFamily: 'var(--font-label)', fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--white)' }}>Image</th>
                        <th style={{ padding: '14px 16px', fontFamily: 'var(--font-label)', fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--white)' }}>Title</th>
                        <th style={{ padding: '14px 16px', fontFamily: 'var(--font-label)', fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--white)' }}>Category</th>
                        <th style={{ padding: '14px 16px', fontFamily: 'var(--font-label)', fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--white)' }}>Regular Price</th>
                        <th style={{ padding: '14px 16px', fontFamily: 'var(--font-label)', fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--white)' }}>Sale Price</th>
                        <th style={{ padding: '14px 16px', fontFamily: 'var(--font-label)', fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--white)' }}>Stock</th>
                        <th style={{ padding: '14px 16px', fontFamily: 'var(--font-label)', fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--white)' }} style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((p, idx) => (
                        <tr key={p.id || idx} style={{ borderBottom: '1px solid rgba(201,168,76,0.15)', transition: 'background 0.2s' }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(201,168,76,0.01)'}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                          <td style={{ padding: '12px 16px' }}>
                            <img src={p.image} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', background: 'var(--pearl)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '8px 8px 0 0' }} />
                          </td>
                          <td style={{ padding: '12px 16px', fontWeight: '600', color: 'var(--text-dark)' }}>{p.title}</td>
                          <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--text-muted)' }}>{p.category}</td>
                          <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--text-muted)' }}>₹{p.price}</td>
                          <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 'bold', color: 'var(--gold)' }}>₹{p.salePrice}</td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{
                              padding: '3px 8px', fontSize: '9px', fontFamily: 'var(--font-label)', fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase',
                              background: p.inStock !== false ? 'rgba(45,154,95,0.08)' : 'rgba(217,48,37,0.08)',
                              color: p.inStock !== false ? '#1e8e3e' : '#d93025',
                              border: p.inStock !== false ? '1px solid rgba(45,154,95,0.2)' : '1px solid rgba(217,48,37,0.2)'
                            }}>{p.inStock !== false ? 'In Stock' : 'Sold Out'}</span>
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                              <button onClick={() => handleOpenEditProduct(p)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)', transition: 'color 0.2s' }}
                                onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'} title="Edit details"><Edit3 size={15} /></button>
                              <button onClick={() => handleDeleteProduct(p.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'rgba(217,48,37,0.7)', transition: 'color 0.2s' }}
                                onMouseEnter={e => e.currentTarget.style.color = '#d93025'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(217,48,37,0.7)'} title="Delete"><Trash2 size={15} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ========================================================
                TAB 2: SITE EDITORIAL SETTINGS
                ======================================================== */}
            {activeTab === 'settings' && settings && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(201,168,76,0.15)', paddingBottom: '14px' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: '300', color: 'var(--text-dark)' }}>Editorial Settings</h3>
                  <button onClick={handleSaveSettings}
                    style={{ background: 'var(--gold)', color: 'var(--noir)', border: 'none', padding: '12px 28px', fontFamily: 'var(--font-label)', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.3s ease' }}
                    onMouseEnter={e => e.target.style.background = 'var(--gold-light)'}
                    onMouseLeave={e => e.target.style.background = 'var(--gold)'}>
                    <Save size={14} /> Save Page Settings
                  </button>
                </div>

                {/* Section 1: Hero Slider */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h4 style={{ fontFamily: 'var(--font-label)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--gold)', fontWeight: '700' }}>Hero Carousel Campaign Slides</h4>
                    <button onClick={handleAddHeroSlide} style={{ border: '1px solid var(--gold)', background: 'none', cursor: 'pointer', padding: '6px 12px', fontFamily: 'var(--font-label)', fontSize: '9px', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Plus size={10} /> Add Slide
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {settings.heroSlides.map((slide, idx) => (
                      <div key={idx} style={{ border: '1px solid rgba(201,168,76,0.15)', padding: '24px', background: 'var(--cream)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontFamily: 'var(--font-label)', fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)' }}>Slide #{idx + 1}</span>
                          <button onClick={() => handleRemoveHeroSlide(idx)} style={{ color: '#d93025', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-label)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Remove</button>
                        </div>
                        
                        <div style={{ display: 'grid', gap: '14px' }} className="admin-grid-2col">
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={{ fontSize: '10px', fontFamily: 'var(--font-label)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Campaign Title</label>
                            <input type="text" value={slide.title} onChange={e => handleUpdateHeroSlide(idx, 'title', e.target.value)} style={{ padding: '10px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--white)', outline: 'none' }} />
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={{ fontSize: '10px', fontFamily: 'var(--font-label)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Image Path/URL</label>
                            <input type="text" value={slide.image} onChange={e => handleUpdateHeroSlide(idx, 'image', e.target.value)} style={{ padding: '10px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--white)', outline: 'none' }} />
                          </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '10px', fontFamily: 'var(--font-label)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Campaign Subtitle</label>
                          <textarea value={slide.subtitle} onChange={e => handleUpdateHeroSlide(idx, 'subtitle', e.target.value)} rows={2} style={{ padding: '10px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--white)', outline: 'none', resize: 'vertical' }} />
                        </div>

                        <div style={{ display: 'grid', gap: '14px' }} className="admin-grid-2col">
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={{ fontSize: '10px', fontFamily: 'var(--font-label)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Button Text</label>
                            <input type="text" value={slide.buttonText} onChange={e => handleUpdateHeroSlide(idx, 'buttonText', e.target.value)} style={{ padding: '10px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--white)', outline: 'none' }} />
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={{ fontSize: '10px', fontFamily: 'var(--font-label)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Button Link Destination</label>
                            <input type="text" value={slide.link} onChange={e => handleUpdateHeroSlide(idx, 'link', e.target.value)} style={{ padding: '10px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--white)', outline: 'none' }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 2: Scent Categories */}
                <div>
                  <h4 style={{ fontFamily: 'var(--font-label)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--gold)', fontWeight: '700', marginBottom: '16px' }}>Scent Categories Showcase</h4>
                  <div style={{ display: 'grid', gap: '20px' }} className="admin-grid-2col">
                    {settings.scentCategories.map((cat, idx) => (
                      <div key={idx} style={{ border: '1px solid rgba(201,168,76,0.15)', padding: '20px', background: 'var(--cream)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <span style={{ fontFamily: 'var(--font-label)', fontSize: '10px', fontWeight: '700', color: 'var(--text-dark)' }}>{cat.name} Category</span>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '10px', fontFamily: 'var(--font-label)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Short Description</label>
                          <input type="text" value={cat.description} onChange={e => handleUpdateCategory(idx, 'description', e.target.value)} style={{ padding: '10px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--white)', outline: 'none' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '10px', fontFamily: 'var(--font-label)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Image URL</label>
                          <input type="text" value={cat.image} onChange={e => handleUpdateCategory(idx, 'image', e.target.value)} style={{ padding: '10px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--white)', outline: 'none' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 3: Brand Promises */}
                <div>
                  <h4 style={{ fontFamily: 'var(--font-label)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--gold)', fontWeight: '700', marginBottom: '16px' }}>Brand Promises (Why Choose Us)</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {settings.whyChooseUs.map((promise, idx) => (
                      <div key={idx} style={{ border: '1px solid rgba(201,168,76,0.15)', padding: '20px', background: 'var(--cream)', gap: '20px' }} className="admin-promise-row">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '10px', fontFamily: 'var(--font-label)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Promise Title</label>
                          <input type="text" value={promise.title} onChange={e => handleUpdatePromise(idx, 'title', e.target.value)} style={{ padding: '10px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--white)', outline: 'none', fontWeight: 'bold' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '10px', fontFamily: 'var(--font-label)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Description Statement</label>
                          <textarea value={promise.description} onChange={e => handleUpdatePromise(idx, 'description', e.target.value)} rows={2} style={{ padding: '10px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--white)', outline: 'none', resize: 'vertical' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 4: Shop The Look image */}
                <div>
                  <h4 style={{ fontFamily: 'var(--font-label)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--gold)', fontWeight: '700', marginBottom: '16px' }}>Shop The Look Backdrop</h4>
                  <div style={{ border: '1px solid rgba(201,168,76,0.15)', padding: '20px', background: 'var(--cream)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '10px', fontFamily: 'var(--font-label)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Image Path</label>
                    <input type="text" value={settings.shopTheLookImage} onChange={e => setSettings({ ...settings, shopTheLookImage: e.target.value })} style={{ padding: '10px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--white)', outline: 'none' }} />
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================
                TAB 3: ORDERS REGISTRY
                ======================================================== */}
            {activeTab === 'orders' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid rgba(201,168,76,0.15)', background: 'var(--cream)', padding: '8px 16px', minWidth: '280px' }}>
                    <Search size={14} color="var(--text-muted)" style={{ marginRight: '10px' }} />
                    <input type="text" placeholder="Search customer, order id..." value={orderSearch} onChange={e => setOrderSearch(e.target.value)}
                      style={{ border: 'none', background: 'transparent', outline: 'none', fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-dark)', width: '100%' }} />
                  </div>
                  <button onClick={exportOrdersToCSV}
                    style={{ border: '1px solid var(--gold)', background: 'none', color: 'var(--gold)', padding: '11px 22px', fontFamily: 'var(--font-label)', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.22s' }}>
                    <FileSpreadsheet size={13} /> Export CSV
                  </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--gold)', background: 'var(--charcoal)' }}>
                        <th style={{ padding: '14px 16px', fontFamily: 'var(--font-label)', fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--white)' }}>Order ID</th>
                        <th style={{ padding: '14px 16px', fontFamily: 'var(--font-label)', fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--white)' }}>Date</th>
                        <th style={{ padding: '14px 16px', fontFamily: 'var(--font-label)', fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--white)' }}>Customer</th>
                        <th style={{ padding: '14px 16px', fontFamily: 'var(--font-label)', fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--white)' }}>Details</th>
                        <th style={{ padding: '14px 16px', fontFamily: 'var(--font-label)', fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--white)' }}>Total</th>
                        <th style={{ padding: '14px 16px', fontFamily: 'var(--font-label)', fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--white)' }}>Method</th>
                        <th style={{ padding: '14px 16px', fontFamily: 'var(--font-label)', fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--white)' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan="7" style={{ padding: '40px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>No orders match search parameters.</td>
                        </tr>
                      ) : (
                        filteredOrders.map((o, idx) => (
                          <tr key={o._id || idx} style={{ borderBottom: '1px solid rgba(201,168,76,0.15)', transition: 'background 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(201,168,76,0.01)'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                            <td style={{ padding: '14px 16px', fontWeight: 'bold', fontSize: '13px' }}>{o.orderId}</td>
                            <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-muted)' }}>{new Date(o._createdAt).toLocaleDateString()}</td>
                            <td style={{ padding: '14px 16px' }}>
                              <p style={{ fontWeight: '600', margin: '0 0 2px' }}>{o.customerName}</p>
                              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0' }}>{o.phone} | {o.email}</p>
                            </td>
                            <td style={{ padding: '14px 16px', fontSize: '13px' }}>
                              {o.items?.map((it, i) => (
                                <div key={i} style={{ color: 'var(--text-muted)' }}>
                                  {it.title} ({it.quantity}x)
                                </div>
                              ))}
                            </td>
                            <td style={{ padding: '14px 16px', fontWeight: '600', color: 'var(--text-dark)' }}>₹{o.totalAmount}</td>
                            <td style={{ padding: '14px 16px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{o.paymentMethod || 'online'}</td>
                            <td style={{ padding: '14px 16px' }}>
                              <select value={o.paymentStatus || 'Pending'} onChange={e => handleUpdateOrderStatus(o._id, e.target.value)}
                                style={{
                                  padding: '4px 10px',
                                  fontSize: '11px',
                                  fontFamily: 'var(--font-label)',
                                  fontWeight: '700',
                                  textTransform: 'uppercase',
                                  border: '1px solid rgba(201,168,76,0.3)',
                                  background: o.paymentStatus === 'Paid' ? 'rgba(45,154,95,0.08)' : o.paymentStatus === 'Shipped' ? 'rgba(201,168,76,0.08)' : 'rgba(217,48,37,0.08)',
                                  color: o.paymentStatus === 'Paid' ? '#1e8e3e' : o.paymentStatus === 'Shipped' ? 'var(--gold)' : '#d93025',
                                  outline: 'none',
                                  cursor: 'pointer'
                                }}>
                                <option value="Pending">Pending</option>
                                <option value="Paid">Paid</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================================
          PRODUCT EDITOR DIALOG MODAL
          ======================================================== */}
      {isProductModalOpen && (
        <div style={{ position: 'fixed', inset: '0', background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', zIndex: '999', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'var(--white)', border: '1px solid var(--gold)', width: '100%', maxWidth: '780px', maxHeight: '90vh', overflowY: 'auto', padding: '40px', boxShadow: 'var(--shadow-gold)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(201,168,76,0.15)', paddingBottom: '14px', marginBottom: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: '300', color: 'var(--text-dark)' }}>
                {editingProduct ? 'Edit Perfume' : 'Create New Perfume'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Row 1: Title & Slug */}
              <div style={{ display: 'grid', gap: '16px' }} className="admin-grid-2col">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '10px', fontFamily: 'var(--font-label)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>Title *</label>
                  <input type="text" required value={prodForm.title} onChange={e => {
                    const val = e.target.value;
                    const generatedSlug = val.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
                    setProdForm(prev => ({ ...prev, title: val, slug: generatedSlug }));
                  }} style={{ padding: '11px', border: '1px solid rgba(201,168,76,0.2)', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '10px', fontFamily: 'var(--font-label)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>URL Slug (Auto-generated) *</label>
                  <input type="text" required value={prodForm.slug} onChange={e => setProdForm(prev => ({ ...prev, slug: e.target.value }))} style={{ padding: '11px', border: '1px solid rgba(201,168,76,0.2)', outline: 'none' }} />
                </div>
              </div>

              {/* Row 2: Category, Concentration, Gender */}
              <div style={{ display: 'grid', gap: '16px' }} className="admin-grid-3col">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '10px', fontFamily: 'var(--font-label)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>Category</label>
                  <select value={prodForm.category} onChange={e => setProdForm(prev => ({ ...prev, category: e.target.value }))} style={{ padding: '11px', border: '1px solid rgba(201,168,76,0.2)', outline: 'none', background: 'var(--white)' }}>
                    <option value="Woody">Woody</option>
                    <option value="Floral">Floral</option>
                    <option value="Citrus">Citrus</option>
                    <option value="Oriental">Oriental</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '10px', fontFamily: 'var(--font-label)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>Concentration</label>
                  <input type="text" value={prodForm.concentration} onChange={e => setProdForm(prev => ({ ...prev, concentration: e.target.value }))} style={{ padding: '11px', border: '1px solid rgba(201,168,76,0.2)', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '10px', fontFamily: 'var(--font-label)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>Gender</label>
                  <select value={prodForm.gender} onChange={e => setProdForm(prev => ({ ...prev, gender: e.target.value }))} style={{ padding: '11px', border: '1px solid rgba(201,168,76,0.2)', outline: 'none', background: 'var(--white)' }}>
                    <option value="Unisex">Unisex</option>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Prices & Discount */}
              <div style={{ display: 'grid', gap: '16px' }} className="admin-grid-3col">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '10px', fontFamily: 'var(--font-label)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>Regular Price (₹) *</label>
                  <input type="number" required value={prodForm.price} onChange={e => {
                    const priceVal = parseFloat(e.target.value || 0);
                    const saleVal = parseFloat(prodForm.salePrice || 0);
                    const disc = priceVal > 0 ? Math.round(((priceVal - saleVal) / priceVal) * 100) : 0;
                    setProdForm(prev => ({ ...prev, price: e.target.value, discount: Math.max(0, disc).toString() }));
                  }} style={{ padding: '11px', border: '1px solid rgba(201,168,76,0.2)', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '10px', fontFamily: 'var(--font-label)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>Sale Price (₹) *</label>
                  <input type="number" required value={prodForm.salePrice} onChange={e => {
                    const saleVal = parseFloat(e.target.value || 0);
                    const priceVal = parseFloat(prodForm.price || 0);
                    const disc = priceVal > 0 ? Math.round(((priceVal - saleVal) / priceVal) * 100) : 0;
                    setProdForm(prev => ({ ...prev, salePrice: e.target.value, discount: Math.max(0, disc).toString() }));
                  }} style={{ padding: '11px', border: '1px solid rgba(201,168,76,0.2)', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '10px', fontFamily: 'var(--font-label)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>Discount (%)</label>
                  <input type="number" value={prodForm.discount} readOnly style={{ padding: '11px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--cream)', outline: 'none', cursor: 'not-allowed' }} />
                </div>
              </div>

              {/* Description */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '10px', fontFamily: 'var(--font-label)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>Description *</label>
                <textarea required value={prodForm.description} onChange={e => setProdForm(prev => ({ ...prev, description: e.target.value }))} rows={3} style={{ padding: '11px', border: '1px solid rgba(201,168,76,0.2)', outline: 'none', resize: 'vertical' }} />
              </div>

              {/* Scent Notes & Brand */}
              <div style={{ display: 'grid', gap: '16px' }} className="admin-grid-2col">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '10px', fontFamily: 'var(--font-label)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>Scent Accords (comma-separated)</label>
                  <input type="text" placeholder="Rose, Jasmine, Saffron" value={prodForm.notes} onChange={e => setProdForm(prev => ({ ...prev, notes: e.target.value }))} style={{ padding: '11px', border: '1px solid rgba(201,168,76,0.2)', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '10px', fontFamily: 'var(--font-label)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>Brand Name</label>
                  <input type="text" value={prodForm.brand} onChange={e => setProdForm(prev => ({ ...prev, brand: e.target.value }))} style={{ padding: '11px', border: '1px solid rgba(201,168,76,0.2)', outline: 'none' }} />
                </div>
              </div>

              {/* Image Paths */}
              <div style={{ display: 'grid', gap: '16px' }} className="admin-grid-2col">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '10px', fontFamily: 'var(--font-label)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>Primary Image URL *</label>
                  <input type="text" required placeholder="/images/perfume_elegant_...png" value={prodForm.image} onChange={e => setProdForm(prev => ({ ...prev, image: e.target.value }))} style={{ padding: '11px', border: '1px solid rgba(201,168,76,0.2)', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '10px', fontFamily: 'var(--font-label)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>Gallery Image URLs (comma-separated)</label>
                  <input type="text" placeholder="URL1, URL2..." value={prodForm.images} onChange={e => setProdForm(prev => ({ ...prev, images: e.target.value }))} style={{ padding: '11px', border: '1px solid rgba(201,168,76,0.2)', outline: 'none' }} />
                </div>
              </div>

              {/* Hotspot Coordinates (for Shop The Look mapping) */}
              <div style={{ display: 'grid', gap: '16px', alignItems: 'center' }} className="admin-grid-4col">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '10px', fontFamily: 'var(--font-label)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>Hotspot X (%)</label>
                  <input type="number" min="0" max="100" value={prodForm.hotspotX} onChange={e => setProdForm(prev => ({ ...prev, hotspotX: e.target.value }))} style={{ padding: '11px', border: '1px solid rgba(201,168,76,0.2)', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '10px', fontFamily: 'var(--font-label)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>Hotspot Y (%)</label>
                  <input type="number" min="0" max="100" value={prodForm.hotspotY} onChange={e => setProdForm(prev => ({ ...prev, hotspotY: e.target.value }))} style={{ padding: '11px', border: '1px solid rgba(201,168,76,0.2)', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '10px', fontFamily: 'var(--font-label)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>Rating</label>
                  <input type="number" step="0.1" min="1" max="5" value={prodForm.rating} onChange={e => setProdForm(prev => ({ ...prev, rating: e.target.value }))} style={{ padding: '11px', border: '1px solid rgba(201,168,76,0.2)', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '10px', fontFamily: 'var(--font-label)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>Reviews Count</label>
                  <input type="number" min="0" value={prodForm.reviewsCount} onChange={e => setProdForm(prev => ({ ...prev, reviewsCount: e.target.value }))} style={{ padding: '11px', border: '1px solid rgba(201,168,76,0.2)', outline: 'none' }} />
                </div>
              </div>

              {/* Checkboxes: inStock, Bestseller, New Arrival */}
              <div style={{ display: 'flex', gap: '28px', marginTop: '10px', background: 'var(--cream)', padding: '16px 20px', border: '1px solid rgba(201,168,76,0.15)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontFamily: 'var(--font-label)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  <input type="checkbox" checked={prodForm.inStock} onChange={e => setProdForm(prev => ({ ...prev, inStock: e.target.checked }))} style={{ width: '16px', height: '16px', accentColor: 'var(--gold)' }} />
                  In Stock
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontFamily: 'var(--font-label)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  <input type="checkbox" checked={prodForm.isBestseller} onChange={e => setProdForm(prev => ({ ...prev, isBestseller: e.target.checked }))} style={{ width: '16px', height: '16px', accentColor: 'var(--gold)' }} />
                  Bestseller Card
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontFamily: 'var(--font-label)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  <input type="checkbox" checked={prodForm.isNewArrival} onChange={e => setProdForm(prev => ({ ...prev, isNewArrival: e.target.checked }))} style={{ width: '16px', height: '16px', accentColor: 'var(--gold)' }} />
                  New Arrival
                </label>
              </div>

              {/* Form Buttons */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid rgba(201,168,76,0.15)', paddingTop: '20px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsProductModalOpen(false)}
                  style={{ border: '1px solid rgba(0,0,0,0.15)', background: 'transparent', cursor: 'pointer', padding: '12px 24px', fontFamily: 'var(--font-label)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
                  Cancel
                </button>
                <button type="submit"
                  style={{ background: 'var(--gold)', color: 'var(--noir)', border: 'none', cursor: 'pointer', padding: '12px 28px', fontFamily: 'var(--font-label)', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                  {editingProduct ? 'Save Changes' : 'Create Perfume'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
