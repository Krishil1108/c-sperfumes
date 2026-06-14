'use client'

import React, { useState, useEffect, Suspense } from 'react';
import { useCart } from '../lib/CartContext';
import { Star, ShoppingCart, Grid, LayoutGrid, X } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function ShopContent({ products }) {
  const { addToCart } = useCart();
  const searchParams = useSearchParams();

  // 1. Get unique brands, genders, and concentrations for filter sidebar options
  const brandsList = [...new Set(products.map(p => p.brand))].sort();
  const gendersList = ['Men', 'Women', 'Unisex'];
  const concentrationsList = [...new Set(products.map(p => p.concentration))].sort();

  // Find dynamic max price from products
  const maxProductPrice = Math.max(...products.map(p => p.salePrice), 1500);

  // 2. Filter states
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [selectedConcentrations, setSelectedConcentrations] = useState([]);
  const [maxPrice, setMaxPrice] = useState(maxProductPrice);
  const [stockOnly, setStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('bestselling');
  const [gridCols, setGridCols] = useState(4);
  const [activeTab, setActiveTab] = useState(null); // 'bestsellers' or 'new-arrivals' from URL

  // Parse query parameters on load
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'bestsellers' || tabParam === 'new-arrivals') {
      setActiveTab(tabParam);
    } else {
      setActiveTab(null);
    }
  }, [searchParams]);

  // Handlers for checkbox selections
  const handleBrandChange = (brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const handleGenderChange = (gender) => {
    setSelectedGenders(prev => 
      prev.includes(gender) ? prev.filter(g => g !== gender) : [...prev, gender]
    );
  };

  const handleConcentrationChange = (conc) => {
    setSelectedConcentrations(prev => 
      prev.includes(conc) ? prev.filter(c => c !== conc) : [...prev, conc]
    );
  };

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedGenders([]);
    setSelectedConcentrations([]);
    setMaxPrice(maxProductPrice);
    setStockOnly(false);
    setActiveTab(null);
  };

  // 3. Filter and Sort execution
  let filteredProducts = products.filter(product => {
    // URL Tab Filter
    if (activeTab === 'bestsellers' && !product.isBestseller) return false;
    if (activeTab === 'new-arrivals' && !product.isNewArrival) return false;

    // Brand Filter
    if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) return false;

    // Gender Filter
    if (selectedGenders.length > 0 && !selectedGenders.includes(product.gender)) return false;

    // Concentration Filter
    if (selectedConcentrations.length > 0 && !selectedConcentrations.includes(product.concentration)) return false;

    // Price Filter
    if (product.salePrice > maxPrice) return false;

    // Stock Filter
    if (stockOnly && !product.inStock) return false;

    return true;
  });

  // Sort Logic
  filteredProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') {
      return a.salePrice - b.salePrice;
    }
    if (sortBy === 'price-high') {
      return b.salePrice - a.salePrice;
    }
    if (sortBy === 'name-az') {
      return a.title.localeCompare(b.title);
    }
    // Default: Bestselling (rating/reviews count)
    return b.rating - a.rating;
  });

  return (
    <div className="shop-layout">
      {/* 1. Sidebar Filters */}
      <aside className="sidebar-filter" aria-label="Filters Panel">
        {/* Brand Filter */}
        <div className="filter-section">
          <h3 className="filter-section-title">Designer Brand</h3>
          <div className="filter-group">
            {brandsList.map(brand => (
              <label className="checkbox-label" key={brand}>
                <input 
                  type="checkbox" 
                  checked={selectedBrands.includes(brand)}
                  onChange={() => handleBrandChange(brand)}
                />
                <span>{brand}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Gender Filter */}
        <div className="filter-section">
          <h3 className="filter-section-title">Gender Scent</h3>
          <div className="filter-group">
            {gendersList.map(gender => (
              <label className="checkbox-label" key={gender}>
                <input 
                  type="checkbox" 
                  checked={selectedGenders.includes(gender)}
                  onChange={() => handleGenderChange(gender)}
                />
                <span>{gender}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Concentration Filter */}
        <div className="filter-section">
          <h3 className="filter-section-title">Concentration</h3>
          <div className="filter-group">
            {concentrationsList.map(conc => (
              <label className="checkbox-label" key={conc}>
                <input 
                  type="checkbox" 
                  checked={selectedConcentrations.includes(conc)}
                  onChange={() => handleConcentrationChange(conc)}
                />
                <span>{conc}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Filter */}
        <div className="filter-section">
          <h3 className="filter-section-title">Max Budget</h3>
          <div className="price-range-wrapper">
            <input 
              type="range" 
              className="price-slider"
              min={199}
              max={maxProductPrice}
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
            />
            <div className="price-inputs">
              <span>₹199</span>
              <span style={{ color: 'var(--color-accent)' }}>₹{maxPrice}</span>
            </div>
          </div>
        </div>

        {/* Availability Filter */}
        <div className="filter-section">
          <h3 className="filter-section-title">Availability</h3>
          <div className="filter-group">
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={stockOnly}
                onChange={() => setStockOnly(prev => !prev)}
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </div>
      </aside>

      {/* 2. Main Product Catalog Section */}
      <section style={{ display: 'flex', flexDirection: 'column' }} aria-label="Product Listings">
        {/* Top Control Bar */}
        <div className="catalog-control-bar">
          <span className="results-count">
            Showing {filteredProducts.length} of {products.length} fragrances
          </span>

          <div className="control-actions">
            {/* Grid Switcher (3 col vs 4 col) */}
            <div className="grid-switchers">
              <button 
                className={`grid-btn ${gridCols === 3 ? 'active' : ''}`}
                onClick={() => setGridCols(3)}
                aria-label="3 Column Grid View"
              >
                <LayoutGrid size={18} />
              </button>
              <button 
                className={`grid-btn ${gridCols === 4 ? 'active' : ''}`}
                onClick={() => setGridCols(4)}
                aria-label="4 Column Grid View"
              >
                <Grid size={18} />
              </button>
            </div>

            {/* Sort Dropdown */}
            <select 
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="bestselling">Sort: Bestselling</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-az">Alphabetical: A-Z</option>
            </select>
          </div>
        </div>

        {/* Active Filters Pills row */}
        {(selectedBrands.length > 0 || selectedGenders.length > 0 || selectedConcentrations.length > 0 || maxPrice < maxProductPrice || stockOnly || activeTab) && (
          <div className="active-filters-bar">
            {activeTab && (
              <span className="filter-pill">
                Tab: {activeTab === 'bestsellers' ? 'Bestsellers' : 'New Arrivals'}
                <button className="filter-pill-close" onClick={() => setActiveTab(null)}>
                  <X size={12} />
                </button>
              </span>
            )}
            {selectedBrands.map(b => (
              <span className="filter-pill" key={b}>
                Brand: {b}
                <button className="filter-pill-close" onClick={() => handleBrandChange(b)}>
                  <X size={12} />
                </button>
              </span>
            ))}
            {selectedGenders.map(g => (
              <span className="filter-pill" key={g}>
                Scent: {g}
                <button className="filter-pill-close" onClick={() => handleGenderChange(g)}>
                  <X size={12} />
                </button>
              </span>
            ))}
            {selectedConcentrations.map(c => (
              <span className="filter-pill" key={c}>
                Conc: {c}
                <button className="filter-pill-close" onClick={() => handleConcentrationChange(c)}>
                  <X size={12} />
                </button>
              </span>
            ))}
            {maxPrice < maxProductPrice && (
              <span className="filter-pill">
                Under ₹{maxPrice}
                <button className="filter-pill-close" onClick={() => setMaxPrice(maxProductPrice)}>
                  <X size={12} />
                </button>
              </span>
            )}
            {stockOnly && (
              <span className="filter-pill">
                In Stock
                <button className="filter-pill-close" onClick={() => setStockOnly(false)}>
                  <X size={12} />
                </button>
              </span>
            )}
            <button className="clear-all-btn" onClick={clearAllFilters}>Clear All Filters</button>
          </div>
        )}

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px', backgroundColor: 'var(--color-white)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', marginBottom: '12px' }}>
              No Fragrances Found
            </p>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginBottom: '24px' }}>
              Try loosening your active filters parameters or slider caps.
            </p>
            <button className="btn-primary" onClick={clearAllFilters} style={{ padding: '12px 28px' }}>
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className={`products-grid ${gridCols === 3 ? 'grid-3-col' : 'grid-4-col'}`}>
            {filteredProducts.map((product) => (
              <div 
                className={`product-card ${!product.inStock ? 'sold-out' : ''}`} 
                key={product.id}
              >
                {!product.inStock && (
                  <div className="out-of-stock-label">Sold Out</div>
                )}
                {product.discount > 0 && product.inStock && (
                  <div className="product-badge sale">{product.discount}% OFF</div>
                )}
                
                <Link href={`/product/${product.slug}`} className="product-img-wrapper">
                  <img 
                    src={product.image} 
                    alt={product.title} 
                    className="product-img" 
                  />
                </Link>

                <div className="product-details">
                  <span className="product-brand">{product.brand}</span>
                  
                  <Link href={`/product/${product.slug}`}>
                    <h3 className="product-title">{product.title}</h3>
                  </Link>

                  <div className="product-rating">
                    <Star className="rating-star" fill="#ffb800" color="#ffb800" size={14} />
                    <span className="rating-value">{product.rating}</span>
                    <span className="rating-count">({product.reviewsCount})</span>
                  </div>

                  <span className="product-concentration-badge">{product.concentration}</span>

                  <div className="product-footer">
                    <div className="price-box">
                      {product.price > product.salePrice && (
                        <span className="original-price">₹{product.price}</span>
                      )}
                      <span className="sale-price">₹{product.salePrice}</span>
                    </div>
                    
                    {product.inStock ? (
                      <button 
                        className="btn-add-cart" 
                        onClick={() => addToCart(product)}
                        aria-label={`Add ${product.title} to bag`}
                      >
                        <ShoppingCart size={16} />
                      </button>
                    ) : (
                      <button 
                        className="btn-add-cart" 
                        style={{ backgroundColor: 'var(--color-border)', cursor: 'not-allowed', color: 'var(--color-text-muted)' }}
                        disabled
                        aria-label={`${product.title} Sold Out`}
                      >
                        <X size={16} />
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
  );
}

export default function ShopPageView({ products }) {
  return (
    <Suspense fallback={
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '24px' }}>Loading Olfactory Chamber...</p>
      </div>
    }>
      <ShopContent products={products} />
    </Suspense>
  );
}
