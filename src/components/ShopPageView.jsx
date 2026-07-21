'use client'

import React, { useState, useEffect, Suspense } from 'react';
import { useCart } from '../lib/CartContext';
import { Star, ShoppingCart, Grid, LayoutGrid, X, SlidersHorizontal, Search } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getOptimizedImageUrl } from '../lib/image';

function ShopContent({ products }) {
  const { addToCart } = useCart();
  const searchParams = useSearchParams();

  const brandsList = [...new Set(products.map(p => p.brand))].sort();
  const gendersList = ['Men', 'Women', 'Unisex'];
  const concentrationsList = [...new Set(products.map(p => p.concentration))].sort();
  const maxProductPrice = Math.max(...products.map(p => p.salePrice), 1500);

  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [selectedConcentrations, setSelectedConcentrations] = useState([]);
  const [maxPrice, setMaxPrice] = useState(maxProductPrice);
  const [stockOnly, setStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('bestselling');
  const [gridCols, setGridCols] = useState(4);
  const [activeTab, setActiveTab] = useState(null);
  const [selectedScent, setSelectedScent] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    setActiveTab(tabParam === 'bestsellers' || tabParam === 'new-arrivals' ? tabParam : null);
    const scentParam = searchParams.get('scent');
    setSelectedScent(scentParam || null);
  }, [searchParams]);

  const handleBrandChange = (brand) => setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);
  const handleGenderChange = (gender) => setSelectedGenders(prev => prev.includes(gender) ? prev.filter(g => g !== gender) : [...prev, gender]);
  const handleConcentrationChange = (conc) => setSelectedConcentrations(prev => prev.includes(conc) ? prev.filter(c => c !== conc) : [...prev, conc]);
  const clearAllFilters = () => { setSelectedBrands([]); setSelectedGenders([]); setSelectedConcentrations([]); setMaxPrice(maxProductPrice); setStockOnly(false); setActiveTab(null); setSelectedScent(null); setSearchQuery(''); };

  let filteredProducts = products.filter(product => {
    if (activeTab === 'bestsellers' && !product.isBestseller) return false;
    if (activeTab === 'new-arrivals' && !product.isNewArrival) return false;
    if (selectedScent) {
      const notes = product.notes ? product.notes.map(n => n.toLowerCase()) : [];
      if (selectedScent === 'woody-oud' && !notes.some(n => ['woody','oud','sandalwood','cedarwood','patchouli','earthy'].includes(n))) return false;
      if (selectedScent === 'floral' && !notes.some(n => ['floral','rose','jasmine','orchid','lily','violet'].includes(n))) return false;
      if (selectedScent === 'aquatic' && !notes.some(n => ['aquatic','fresh','sea breeze'].includes(n))) return false;
      if (selectedScent === 'amber-musk' && !notes.some(n => ['amber','musk','sweet','vanilla','caramel'].includes(n))) return false;
    }
    if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) return false;
    if (selectedGenders.length > 0 && !selectedGenders.includes(product.gender)) return false;
    if (selectedConcentrations.length > 0 && !selectedConcentrations.includes(product.concentration)) return false;
    if (product.salePrice > maxPrice) return false;
    if (stockOnly && !product.inStock) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!product.title?.toLowerCase().includes(q) && !product.brand?.toLowerCase().includes(q) && !product.notes?.some(n => n.toLowerCase().includes(q))) return false;
    }
    return true;
  });

  filteredProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.salePrice - b.salePrice;
    if (sortBy === 'price-high') return b.salePrice - a.salePrice;
    if (sortBy === 'name-az') return a.title.localeCompare(b.title);
    return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
  });

  const activeFiltersCount = selectedBrands.length + selectedGenders.length + selectedConcentrations.length + (maxPrice < maxProductPrice ? 1 : 0) + (stockOnly ? 1 : 0) + (activeTab ? 1 : 0) + (selectedScent ? 1 : 0);

  const FilterPanelContent = () => (
    <>
      {/* Search */}
      <div style={{ marginBottom: '28px', paddingBottom: '28px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <h3 style={{ fontFamily: 'var(--font-label)', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.22em', color: 'var(--text-dark)', marginBottom: '12px' }}>Search</h3>
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search fragrances..."
            style={{ width: '100%', border: '1px solid rgba(0,0,0,0.1)', background: 'transparent', padding: '10px 12px 10px 34px', fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-dark)', outline: 'none', borderRadius: '0' }}
          />
        </div>
      </div>

      {/* Brand Filter */}
      <div style={{ marginBottom: '28px', paddingBottom: '28px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <h3 style={{ fontFamily: 'var(--font-label)', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.22em', color: 'var(--text-dark)', marginBottom: '14px' }}>Brand</h3>
        {brandsList.map(brand => (
          <label key={brand} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '7px 0', cursor: 'pointer', fontSize: '13px', color: selectedBrands.includes(brand) ? 'var(--text-dark)' : 'var(--text-muted)', fontWeight: selectedBrands.includes(brand) ? '600' : '300' }}>
            <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => handleBrandChange(brand)}
              style={{ width: '15px', height: '15px', accentColor: 'var(--gold)', cursor: 'pointer' }} />
            {brand}
          </label>
        ))}
      </div>

      {/* Gender */}
      <div style={{ marginBottom: '28px', paddingBottom: '28px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <h3 style={{ fontFamily: 'var(--font-label)', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.22em', color: 'var(--text-dark)', marginBottom: '14px' }}>Gender Scent</h3>
        {gendersList.map(gender => (
          <label key={gender} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '7px 0', cursor: 'pointer', fontSize: '13px', color: selectedGenders.includes(gender) ? 'var(--text-dark)' : 'var(--text-muted)', fontWeight: selectedGenders.includes(gender) ? '600' : '300' }}>
            <input type="checkbox" checked={selectedGenders.includes(gender)} onChange={() => handleGenderChange(gender)}
              style={{ width: '15px', height: '15px', accentColor: 'var(--gold)', cursor: 'pointer' }} />
            {gender}
          </label>
        ))}
      </div>

      {/* Concentration */}
      <div style={{ marginBottom: '28px', paddingBottom: '28px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <h3 style={{ fontFamily: 'var(--font-label)', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.22em', color: 'var(--text-dark)', marginBottom: '14px' }}>Concentration</h3>
        {concentrationsList.map(conc => (
          <label key={conc} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '7px 0', cursor: 'pointer', fontSize: '13px', color: selectedConcentrations.includes(conc) ? 'var(--text-dark)' : 'var(--text-muted)', fontWeight: selectedConcentrations.includes(conc) ? '600' : '300' }}>
            <input type="checkbox" checked={selectedConcentrations.includes(conc)} onChange={() => handleConcentrationChange(conc)}
              style={{ width: '15px', height: '15px', accentColor: 'var(--gold)', cursor: 'pointer' }} />
            {conc}
          </label>
        ))}
      </div>

      {/* Price */}
      <div style={{ marginBottom: '28px', paddingBottom: '28px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <h3 style={{ fontFamily: 'var(--font-label)', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.22em', color: 'var(--text-dark)', marginBottom: '14px' }}>Max Budget</h3>
        <input type="range" min={199} max={maxProductPrice} value={maxPrice} onChange={e => setMaxPrice(parseInt(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--gold)', margin: '0 0 10px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-label)', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
          <span>₹199</span>
          <span style={{ color: 'var(--gold)', fontWeight: '600' }}>₹{maxPrice}</span>
        </div>
      </div>

      {/* In Stock */}
      <div style={{ marginBottom: '12px' }}>
        <h3 style={{ fontFamily: 'var(--font-label)', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.22em', color: 'var(--text-dark)', marginBottom: '14px' }}>Availability</h3>
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', color: 'var(--text-muted)', fontWeight: '300' }}>
          <input type="checkbox" checked={stockOnly} onChange={() => setStockOnly(prev => !prev)}
            style={{ width: '15px', height: '15px', accentColor: 'var(--gold)', cursor: 'pointer' }} />
          In Stock Only
        </label>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div style={{ position: 'fixed', inset: '0', background: 'rgba(0,0,0,0.6)', zIndex: '400', backdropFilter: 'blur(4px)' }} onClick={() => setMobileFilterOpen(false)} />
      )}
      <div style={{
        position: 'fixed', top: '0', left: '0', bottom: '0', width: 'min(85vw, 340px)',
        background: 'var(--cream)', zIndex: '500', transform: mobileFilterOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.38s cubic-bezier(0.4, 0, 0.2, 1)', overflowY: 'auto',
        display: 'flex', flexDirection: 'column'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid rgba(0,0,0,0.08)', background: 'var(--noir)', position: 'sticky', top: '0', zIndex: '10' }}>
          <span style={{ fontFamily: 'var(--font-label)', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.22em', color: 'var(--white)' }}>
            Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </span>
          <button onClick={() => setMobileFilterOpen(false)} style={{ color: 'rgba(255,255,255,0.6)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>
        <div style={{ padding: '24px', flex: '1' }}>
          <FilterPanelContent />
          <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }} onClick={() => setMobileFilterOpen(false)}>
            Show {filteredProducts?.length ?? products.length} Results
          </button>
          {activeFiltersCount > 0 && (
            <button onClick={() => { clearAllFilters(); setMobileFilterOpen(false); }}
              style={{ display: 'block', width: '100%', textAlign: 'center', marginTop: '12px', fontFamily: 'var(--font-label)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}>
              Clear All Filters
            </button>
          )}
        </div>
      </div>

      {/* Shop Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '0', minHeight: '100vh', background: 'var(--cream)' }}
        className="shop-two-col">
        
        {/* Sidebar */}
        <aside style={{ borderRight: '1px solid rgba(0,0,0,0.07)', padding: '40px 28px', position: 'sticky', top: 'calc(var(--header-height) + var(--announcement-height))', height: 'fit-content', maxHeight: 'calc(100vh - var(--header-height) - var(--announcement-height))', overflowY: 'auto' }}
          className="shop-sidebar-desktop">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: '400', color: 'var(--text-dark)' }}>Refine</h2>
            {activeFiltersCount > 0 && (
              <button onClick={clearAllFilters} style={{ fontFamily: 'var(--font-label)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--gold)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600' }}>
                Clear ({activeFiltersCount})
              </button>
            )}
          </div>
          <FilterPanelContent />
        </aside>

        {/* Main Content */}
        <section style={{ padding: '40px 32px' }}>

          {/* Mobile filter toggle */}
          <button onClick={() => setMobileFilterOpen(true)}
            style={{ display: 'none', alignItems: 'center', gap: '8px', border: '1px solid rgba(0,0,0,0.12)', padding: '10px 16px', background: 'transparent', fontFamily: 'var(--font-label)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', cursor: 'pointer', marginBottom: '20px', color: 'var(--text-dark)' }}
            className="shop-mobile-filter-btn">
            <SlidersHorizontal size={14} />
            Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </button>

          {/* Control Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <span style={{ fontFamily: 'var(--font-label)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-muted)' }}>
              {filteredProducts.length} Fragrances
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Grid toggle */}
              <div style={{ display: 'flex', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '0' }}>
                <button onClick={() => setGridCols(3)} aria-label="3 col"
                  style={{ padding: '7px 10px', border: 'none', background: gridCols === 3 ? 'var(--noir)' : 'transparent', color: gridCols === 3 ? 'var(--white)' : 'var(--text-muted)', cursor: 'pointer', transition: 'background 0.2s' }}>
                  <LayoutGrid size={15} />
                </button>
                <button onClick={() => setGridCols(4)} aria-label="4 col"
                  style={{ padding: '7px 10px', border: 'none', borderLeft: '1px solid rgba(0,0,0,0.1)', background: gridCols === 4 ? 'var(--noir)' : 'transparent', color: gridCols === 4 ? 'var(--white)' : 'var(--text-muted)', cursor: 'pointer', transition: 'background 0.2s' }}>
                  <Grid size={15} />
                </button>
              </div>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="sort-select">
                <option value="bestselling">Bestselling</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-az">Alphabetical</option>
              </select>
            </div>
          </div>

          {/* Active Filter Pills */}
          {activeFiltersCount > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
              {[...selectedBrands.map(b => ({ label: `Brand: ${b}`, clear: () => handleBrandChange(b) })),
                ...selectedGenders.map(g => ({ label: `Gender: ${g}`, clear: () => handleGenderChange(g) })),
                ...selectedConcentrations.map(c => ({ label: `Conc: ${c}`, clear: () => handleConcentrationChange(c) })),
                ...(maxPrice < maxProductPrice ? [{ label: `Under ₹${maxPrice}`, clear: () => setMaxPrice(maxProductPrice) }] : []),
                ...(stockOnly ? [{ label: 'In Stock', clear: () => setStockOnly(false) }] : []),
                ...(activeTab ? [{ label: activeTab === 'bestsellers' ? 'Bestsellers' : 'New Arrivals', clear: () => setActiveTab(null) }] : []),
                ...(selectedScent ? [{ label: `Scent: ${selectedScent}`, clear: () => setSelectedScent(null) }] : []),
              ].map((pill, i) => (
                <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 12px', border: '1px solid rgba(201,168,76,0.4)', background: 'rgba(201,168,76,0.06)', fontFamily: 'var(--font-label)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-dark)' }}>
                  {pill.label}
                  <button onClick={pill.clear} style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: '0' }}>
                    <X size={11} />
                  </button>
                </span>
              ))}
              <button onClick={clearAllFilters} style={{ fontFamily: 'var(--font-label)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gold)', background: 'none', border: '1px solid var(--gold)', padding: '5px 12px', cursor: 'pointer' }}>
                Clear All
              </button>
            </div>
          )}

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 24px', background: 'var(--white)', border: '1px solid rgba(0,0,0,0.06)' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: '300', marginBottom: '12px', color: 'var(--text-dark)' }}>No Fragrances Found</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px', fontWeight: '300' }}>Try loosening your filter parameters.</p>
              <button className="btn-primary" onClick={clearAllFilters} style={{ display: 'inline-flex' }}>Clear All Filters</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${gridCols}, 1fr)`, gap: '20px' }} className={`products-grid-responsive g${gridCols}`}>
              {filteredProducts.map((product) => (
                <div className={`product-card ${!product.inStock ? 'sold-out' : ''}`} key={product.id} style={{ position: 'relative' }}>
                  {!product.inStock && <div className="out-of-stock-label">Sold Out</div>}
                  {product.discount > 0 && product.inStock && <div className="product-badge sale">{product.discount}% OFF</div>}
                  <Link href={`/product/${product.slug}`} className="product-img-wrapper" style={{ display: 'block', position: 'relative', overflow: 'hidden' }}>
                    <img src={getOptimizedImageUrl(product.image, 400)} alt={product.title} className="product-img" />
                    <div className="royal-quick-add">View Product</div>
                  </Link>
                  <div className="product-details">
                    <div className="product-notes">{product.brand || 'C&S Perfumes'}</div>
                    <Link href={`/product/${product.slug}`}>
                      <h3 className="product-title">{product.title}</h3>
                    </Link>
                    <div className="product-rating">
                      <Star className="rating-star" fill="var(--gold)" color="var(--gold)" size={12} />
                      <span className="rating-value">{product.rating}</span>
                      <span className="rating-count">({product.reviewsCount})</span>
                    </div>
                    {product.concentration && (
                      <span style={{ fontFamily: 'var(--font-label)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', paddingTop: '2px' }}>{product.concentration}</span>
                    )}
                    <div className="product-footer">
                      <div className="price-box">
                        {product.price > product.salePrice && <span className="original-price">₹{product.price}</span>}
                        <span className="sale-price">₹{product.salePrice}</span>
                      </div>
                      {product.inStock ? (
                        <button className="btn-add-cart" onClick={() => addToCart(product)} aria-label={`Add ${product.title} to bag`}>
                          <ShoppingCart size={15} />
                        </button>
                      ) : (
                        <button className="btn-add-cart" style={{ background: 'rgba(0,0,0,0.08)', cursor: 'not-allowed', color: 'var(--text-muted)' }} disabled>
                          <X size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .shop-two-col { grid-template-columns: 1fr !important; }
          .shop-sidebar-desktop { display: none !important; }
          .shop-mobile-filter-btn { display: flex !important; }
        }
        .products-grid-responsive { display: grid; }
        .products-grid-responsive.g3 { grid-template-columns: repeat(3, 1fr); }
        .products-grid-responsive.g4 { grid-template-columns: repeat(4, 1fr); }
        @media (max-width: 1100px) { .products-grid-responsive.g4 { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px) { .products-grid-responsive { grid-template-columns: repeat(2, 1fr) !important; gap: 14px !important; } }
      `}</style>
    </>
  );
}

export default function ShopPageView({ products }) {
  return (
    <>
      {/* Shop Hero Banner */}
      <div style={{ background: 'var(--noir)', padding: '64px 0 52px', textAlign: 'center', position: 'relative', overflow: 'hidden', borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
        <div style={{ position: 'absolute', inset: '0', background: 'radial-gradient(ellipse at 50% 100%, rgba(201,168,76,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <span style={{ fontFamily: 'var(--font-label)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.32em', color: 'var(--gold)', display: 'block', marginBottom: '16px' }}>
          Our Olfactory Archive
        </span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 8vw, 80px)', fontWeight: '300', color: 'var(--white)', margin: '0', lineHeight: '1.05', position: 'relative' }}>
          The Collection
        </h1>
      </div>

      <Suspense fallback={
        <div style={{ textAlign: 'center', padding: '100px 0', background: 'var(--cream)' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: '300', color: 'var(--text-dark)' }}>Curating your collection...</p>
        </div>
      }>
        <ShopContent products={products} />
      </Suspense>
    </>
  );
}
