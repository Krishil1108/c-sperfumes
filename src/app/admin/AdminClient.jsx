'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { dbService } from '../../lib/db';
import { 
  Lock, LogOut, Package, Settings, FileText, Plus, Trash2, Edit3, Save, X, Search, 
  FileSpreadsheet, Upload, Download, HelpCircle, CheckCircle, AlertCircle, Copy, 
  LayoutGrid, List, Filter, ArrowUpDown, RefreshCw, Sparkles, TrendingUp, 
  DollarSign, Star, Check, AlertTriangle, Eye, ShieldCheck
} from 'lucide-react';
import Link from 'next/link';

// Sample Template Data for Excel/CSV Import
const SAMPLE_CSV_ROWS = [
  {
    title: "Oud Noir Extrait",
    slug: "oud-noir-extrait",
    brand: "C&S Perfumes",
    category: "Woody",
    concentration: "Extrait De Parfum",
    gender: "Unisex",
    price: "4800",
    salePrice: "3999",
    discount: "17",
    notes: "Cambodian Oud, Smoked Amber, Sandalwood",
    rating: "4.9",
    reviewsCount: "120",
    image: "/images/perfume_elegant_1784660079140.png",
    inStock: "true",
    isBestseller: "true",
    isNewArrival: "false",
    description: "A commanding oud fragrance enveloped in rich smoked amber and creamy sandalwood."
  },
  {
    title: "Moroccan Jasmine Bloom",
    slug: "moroccan-jasmine-bloom",
    brand: "C&S Perfumes",
    category: "Floral",
    concentration: "Eau De Parfum",
    gender: "Women",
    price: "4200",
    salePrice: "3499",
    discount: "17",
    notes: "Moroccan Jasmine, White Musk, Damask Rose",
    rating: "4.8",
    reviewsCount: "85",
    image: "/images/perfume_sleek_1784660046118.png",
    inStock: "true",
    isBestseller: "false",
    isNewArrival: "true",
    description: "Velvety Moroccan jasmine petals mingled with morning dew and sweet white musk."
  },
  {
    title: "Mediterranean Azure",
    slug: "mediterranean-azure",
    brand: "C&S Perfumes",
    category: "Citrus",
    concentration: "Eau De Parfum",
    gender: "Men",
    price: "3900",
    salePrice: "3200",
    discount: "18",
    notes: "Calabrian Bergamot, Sea Salt, Cedarwood",
    rating: "4.7",
    reviewsCount: "94",
    image: "/images/perfume_modern_1784660067627.png",
    inStock: "true",
    isBestseller: "true",
    isNewArrival: "true",
    description: "Crisp marine breeze kissed with zesty Calabrian bergamot and sun-drenched coastal cedar."
  }
];

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

  // View Mode: 'card' (default) or 'list'
  const [viewMode, setViewMode] = useState('card');

  // Search & Filter states for Products
  const [prodSearch, setProdSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');
  const [selectedStock, setSelectedStock] = useState('all');
  const [selectedBadge, setSelectedBadge] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Order search state
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // Toast alert feedback
  const [toast, setToast] = useState(null);

  // Product editor modal states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Excel/CSV Import & Guide Modals
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importData, setImportData] = useState([]);
  const [importErrors, setImportErrors] = useState([]);
  const [importMode, setImportMode] = useState('append'); // 'append' | 'overwrite'
  const fileInputRef = useRef(null);

  // Product form data
  const [prodForm, setProdForm] = useState({
    title: '', slug: '', description: '', brand: 'C&S Perfumes', category: 'Floral',
    concentration: 'Extrait De Parfum', gender: 'Unisex', notes: '', price: '',
    salePrice: '', discount: '0', rating: '4.8', reviewsCount: '150', image: '',
    images: '', inStock: true, isBestseller: false, isNewArrival: false, hotspotX: '50', hotspotY: '50'
  });

  // Load saved viewMode preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedView = localStorage.getItem('cns_admin_view_mode');
      if (savedView === 'card' || savedView === 'list') {
        setViewMode(savedView);
      }
    }
  }, []);

  const handleSetViewMode = (mode) => {
    setViewMode(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cns_admin_view_mode', mode);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3800);
  };

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
      showToast("Error loading catalog data.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      setLoginError('');
      showToast("Welcome to C&S Studio Console");
    } else {
      setLoginError('Invalid credentials. Use admin / admin123');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
  };

  // KPI Calculations
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const inStockCount = products.filter(p => p.inStock !== false).length;
    const outOfStockCount = totalProducts - inStockCount;
    const bestsellersCount = products.filter(p => p.isBestseller).length;
    const newArrivalsCount = products.filter(p => p.isNewArrival).length;
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + (parseFloat(o.totalAmount) || 0), 0);
    return { totalProducts, inStockCount, outOfStockCount, bestsellersCount, newArrivalsCount, totalOrders, totalRevenue };
  }, [products, orders]);

  // Unique Categories
  const categoriesList = useMemo(() => {
    const cats = new Set(products.map(p => p.category).filter(Boolean));
    return ['Woody', 'Floral', 'Citrus', 'Oriental', ...Array.from(cats)].filter((v, i, a) => a.indexOf(v) === i);
  }, [products]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    let result = products.filter(p => {
      // Keyword search
      if (prodSearch.trim()) {
        const q = prodSearch.toLowerCase();
        const matchesTitle = p.title?.toLowerCase().includes(q);
        const matchesBrand = p.brand?.toLowerCase().includes(q);
        const matchesCategory = p.category?.toLowerCase().includes(q);
        const matchesSlug = p.slug?.toLowerCase().includes(q);
        const matchesNotes = Array.isArray(p.notes) 
          ? p.notes.some(n => n.toLowerCase().includes(q))
          : p.notes?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesBrand && !matchesCategory && !matchesSlug && !matchesNotes) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'all' && p.category?.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }

      // Gender filter
      if (selectedGender !== 'all' && p.gender?.toLowerCase() !== selectedGender.toLowerCase()) {
        return false;
      }

      // Stock filter
      if (selectedStock === 'instock' && p.inStock === false) return false;
      if (selectedStock === 'soldout' && p.inStock !== false) return false;

      // Badge filter
      if (selectedBadge === 'bestseller' && !p.isBestseller) return false;
      if (selectedBadge === 'newarrival' && !p.isNewArrival) return false;
      if (selectedBadge === 'onsale' && (!p.discount || p.discount <= 0)) return false;

      return true;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'title-asc') return (a.title || '').localeCompare(b.title || '');
      if (sortBy === 'title-desc') return (b.title || '').localeCompare(a.title || '');
      if (sortBy === 'price-low') return (parseFloat(a.salePrice) || 0) - (parseFloat(b.salePrice) || 0);
      if (sortBy === 'price-high') return (parseFloat(b.salePrice) || 0) - (parseFloat(a.salePrice) || 0);
      if (sortBy === 'rating-desc') return (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0);
      if (sortBy === 'stock-first') return (b.inStock !== false ? 1 : 0) - (a.inStock !== false ? 1 : 0);
      if (sortBy === 'soldout-first') return (a.inStock !== false ? 1 : 0) - (b.inStock !== false ? 1 : 0);
      if (sortBy === 'bestsellers') return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
      if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      return 0;
    });

    return result;
  }, [products, prodSearch, selectedCategory, selectedGender, selectedStock, selectedBadge, sortBy]);

  const hasActiveFilters = Boolean(prodSearch || selectedCategory !== 'all' || selectedGender !== 'all' || selectedStock !== 'all' || selectedBadge !== 'all');

  const handleResetFilters = () => {
    setProdSearch('');
    setSelectedCategory('all');
    setSelectedGender('all');
    setSelectedStock('all');
    setSelectedBadge('all');
    setSortBy('newest');
  };

  // PRODUCT ACTIONS
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProdForm({
      title: '', slug: '', description: '', brand: 'C&S Perfumes', category: 'Floral',
      concentration: 'Extrait De Parfum', gender: 'Unisex', notes: 'Damask Rose, Moroccan Jasmine, White Musk', price: '4500',
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

  const handleDuplicateProduct = (prod) => {
    setEditingProduct(null);
    const newTitle = `${prod.title} (Copy)`;
    const newSlug = `${prod.slug || 'fragrance'}-copy-${Math.floor(Math.random() * 1000)}`;
    setProdForm({
      ...prod,
      title: newTitle,
      slug: newSlug,
      notes: Array.isArray(prod.notes) ? prod.notes.join(', ') : (prod.notes || ''),
      images: Array.isArray(prod.images) ? prod.images.join(', ') : (prod.image || ''),
      inStock: true
    });
    setIsProductModalOpen(true);
    showToast(`Duplicating "${prod.title}"`);
  };

  const handleToggleStock = async (prod) => {
    const updated = { ...prod, inStock: prod.inStock === false ? true : false };
    try {
      await dbService.saveProduct(updated);
      setProducts(prev => prev.map(p => (p.id === prod.id ? updated : p)));
      showToast(`${prod.title} marked as ${updated.inStock ? 'In Stock' : 'Sold Out'}`);
    } catch (err) {
      showToast("Failed to update stock status: " + err.message, "error");
    }
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
      price: parseFloat(prodForm.price) || 0,
      salePrice: parseFloat(prodForm.salePrice) || parseFloat(prodForm.price) || 0,
      discount: parseInt(prodForm.discount || 0),
      rating: parseFloat(prodForm.rating || 5.0),
      reviewsCount: parseInt(prodForm.reviewsCount || 0),
      image: prodForm.image || formattedImages[0] || '/images/perfume_elegant_1784660079140.png',
      images: formattedImages.length > 0 ? formattedImages : [prodForm.image || '/images/perfume_elegant_1784660079140.png'],
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
      showToast(editingProduct ? "Perfume updated successfully!" : "New perfume created!");
      loadData();
    } catch (err) {
      showToast("Failed to save perfume: " + err.message, "error");
    }
  };

  const handleDeleteProduct = async (prodId, prodTitle) => {
    if (confirm(`Are you sure you want to delete "${prodTitle || 'this perfume'}"? This action cannot be undone.`)) {
      try {
        await dbService.deleteProduct(prodId);
        showToast("Perfume removed from catalog.");
        loadData();
      } catch (err) {
        showToast("Failed to delete perfume: " + err.message, "error");
      }
    }
  };

  // EXCEL / CSV EXPORT
  const exportProductsToCSV = (onlyFiltered = false) => {
    const listToExport = onlyFiltered ? filteredProducts : products;
    if (listToExport.length === 0) {
      showToast("No products to export.", "error");
      return;
    }

    const headers = [
      'Title', 'Slug', 'Brand', 'Category', 'Concentration', 'Gender',
      'Price', 'Sale Price', 'Discount %', 'Scent Notes', 'Rating', 'Reviews Count',
      'In Stock', 'Is Bestseller', 'Is New Arrival', 'Image URL', 'Description'
    ];

    const escapeCell = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = listToExport.map(p => [
      escapeCell(p.title),
      escapeCell(p.slug),
      escapeCell(p.brand || 'C&S Perfumes'),
      escapeCell(p.category || 'Floral'),
      escapeCell(p.concentration || 'Extrait De Parfum'),
      escapeCell(p.gender || 'Unisex'),
      escapeCell(p.price || ''),
      escapeCell(p.salePrice || ''),
      escapeCell(p.discount || '0'),
      escapeCell(Array.isArray(p.notes) ? p.notes.join(', ') : (p.notes || '')),
      escapeCell(p.rating || '4.8'),
      escapeCell(p.reviewsCount || '100'),
      escapeCell(p.inStock !== false ? 'TRUE' : 'FALSE'),
      escapeCell(p.isBestseller ? 'TRUE' : 'FALSE'),
      escapeCell(p.isNewArrival ? 'TRUE' : 'FALSE'),
      escapeCell(p.image || ''),
      escapeCell(p.description || '')
    ]);

    // Include UTF-8 BOM for flawless opening in Microsoft Excel and Numbers
    const csvString = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `cns_perfumes_${onlyFiltered ? 'filtered_' : 'catalog_'}${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    showToast(`Exported ${listToExport.length} perfumes to Excel/CSV.`);
  };

  // DOWNLOAD SAMPLE TEMPLATE
  const handleDownloadSampleTemplate = () => {
    const headers = [
      'Title', 'Slug', 'Brand', 'Category', 'Concentration', 'Gender',
      'Price', 'Sale Price', 'Discount %', 'Scent Notes', 'Rating', 'Reviews Count',
      'In Stock', 'Is Bestseller', 'Is New Arrival', 'Image URL', 'Description'
    ];

    const escapeCell = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = SAMPLE_CSV_ROWS.map(p => [
      escapeCell(p.title),
      escapeCell(p.slug),
      escapeCell(p.brand),
      escapeCell(p.category),
      escapeCell(p.concentration),
      escapeCell(p.gender),
      escapeCell(p.price),
      escapeCell(p.salePrice),
      escapeCell(p.discount),
      escapeCell(p.notes),
      escapeCell(p.rating),
      escapeCell(p.reviewsCount),
      escapeCell(p.inStock),
      escapeCell(p.isBestseller),
      escapeCell(p.isNewArrival),
      escapeCell(p.image),
      escapeCell(p.description)
    ]);

    const csvString = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `cns_perfumes_import_template.csv`;
    link.click();
    showToast("Template downloaded! Open in Excel or Google Sheets.");
  };

  // ROBUST CSV PARSER
  const parseCSV = (text) => {
    const lines = [];
    let currentRow = [];
    let currentCell = '';
    let insideQuotes = false;

    // Clean BOM if present
    const cleanText = text.replace(/^\uFEFF/, '');

    for (let i = 0; i < cleanText.length; i++) {
      const char = cleanText[i];
      const nextChar = cleanText[i + 1];

      if (char === '"') {
        if (insideQuotes && nextChar === '"') {
          currentCell += '"';
          i++; // Skip escaped quote
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (char === ',' && !insideQuotes) {
        currentRow.push(currentCell.trim());
        currentCell = '';
      } else if ((char === '\r' || char === '\n') && !insideQuotes) {
        if (char === '\r' && nextChar === '\n') i++; // Handle CRLF
        currentRow.push(currentCell.trim());
        if (currentRow.some(c => c.length > 0)) {
          lines.push(currentRow);
        }
        currentRow = [];
        currentCell = '';
      } else {
        currentCell += char;
      }
    }
    if (currentCell.length > 0 || currentRow.length > 0) {
      currentRow.push(currentCell.trim());
      if (currentRow.some(c => c.length > 0)) {
        lines.push(currentRow);
      }
    }

    return lines;
  };

  // EXCEL / CSV FILE UPLOAD HANDLER
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const content = evt.target.result;
        const parsedRows = parseCSV(content);

        if (parsedRows.length < 2) {
          showToast("File appears empty or missing header row.", "error");
          return;
        }

        const rawHeaders = parsedRows[0].map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
        const dataRows = parsedRows.slice(1);

        // Header mapping dictionary
        const findIndex = (aliases) => {
          return rawHeaders.findIndex(h => aliases.some(alias => h.includes(alias)));
        };

        const titleIdx = findIndex(['title', 'name', 'productname', 'fragrance']);
        const priceIdx = findIndex(['price', 'regularprice', 'mrp', 'cost']);
        const salePriceIdx = findIndex(['saleprice', 'offerprice', 'discountedprice']);
        const catIdx = findIndex(['category', 'scentfamily', 'family', 'collection']);
        const genderIdx = findIndex(['gender', 'target', 'for']);
        const concIdx = findIndex(['concentration', 'type', 'perfumetype']);
        const notesIdx = findIndex(['notes', 'scentnotes', 'accords', 'ingredients']);
        const brandIdx = findIndex(['brand', 'maker', 'designer']);
        const descIdx = findIndex(['description', 'desc', 'details', 'summary']);
        const imgIdx = findIndex(['image', 'imageurl', 'photo', 'picture']);
        const stockIdx = findIndex(['stock', 'instock', 'available', 'status']);
        const bestsellerIdx = findIndex(['bestseller', 'isbestseller', 'top', 'popular']);
        const newArrivalIdx = findIndex(['newarrival', 'isnewarrival', 'new', 'latest']);
        const slugIdx = findIndex(['slug', 'url', 'handle']);

        if (titleIdx === -1) {
          showToast("Missing required 'Title' column in uploaded spreadsheet.", "error");
          return;
        }

        const validList = [];
        const errorsList = [];

        dataRows.forEach((row, rowIdx) => {
          const rowNum = rowIdx + 2;
          const title = row[titleIdx]?.trim();
          
          if (!title) {
            errorsList.push(`Row ${rowNum}: Skipped due to empty Title.`);
            return;
          }

          const rawPrice = parseFloat(row[priceIdx]?.replace(/[^0-9.]/g, '')) || 0;
          const rawSalePrice = salePriceIdx !== -1 ? (parseFloat(row[salePriceIdx]?.replace(/[^0-9.]/g, '')) || rawPrice) : rawPrice;
          const price = rawPrice || rawSalePrice || 3500;
          const salePrice = rawSalePrice || price;
          const discount = price > salePrice ? Math.round(((price - salePrice) / price) * 100) : 0;

          const category = (catIdx !== -1 && row[catIdx]?.trim()) || 'Floral';
          const gender = (genderIdx !== -1 && row[genderIdx]?.trim()) || 'Unisex';
          const concentration = (concIdx !== -1 && row[concIdx]?.trim()) || 'Extrait De Parfum';
          const brand = (brandIdx !== -1 && row[brandIdx]?.trim()) || 'C&S Perfumes';
          const description = (descIdx !== -1 && row[descIdx]?.trim()) || `Experience the rich sensory profile of ${title}. Formulated with pure botanical oils.`;
          const image = (imgIdx !== -1 && row[imgIdx]?.trim()) || '/images/perfume_elegant_1784660079140.png';

          const notesRaw = notesIdx !== -1 ? row[notesIdx] : 'Damask Rose, Amber, Musk';
          const notes = notesRaw ? notesRaw.split(/[,;|]/).map(n => n.trim()).filter(Boolean) : ['Luxury Scents'];

          const slug = (slugIdx !== -1 && row[slugIdx]?.trim()) 
            ? row[slugIdx].trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') 
            : title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

          // Parse Boolean flags
          const parseBool = (val, defaultVal = false) => {
            if (val === undefined || val === null || val === '') return defaultVal;
            const s = String(val).trim().toLowerCase();
            return s === 'true' || s === 'yes' || s === '1' || s === 'in stock' || s === 'available';
          };

          const inStock = stockIdx !== -1 ? parseBool(row[stockIdx], true) : true;
          const isBestseller = bestsellerIdx !== -1 ? parseBool(row[bestsellerIdx], false) : false;
          const isNewArrival = newArrivalIdx !== -1 ? parseBool(row[newArrivalIdx], false) : false;

          validList.push({
            id: slug,
            _id: slug,
            title,
            slug,
            brand,
            category,
            concentration,
            gender,
            price,
            salePrice,
            discount,
            notes,
            rating: 4.8,
            reviewsCount: 85,
            image,
            images: [image],
            inStock,
            isBestseller,
            isNewArrival,
            description,
            hotspot: { x: 50, y: 50 }
          });
        });

        if (validList.length === 0) {
          showToast("No valid fragrance records found in spreadsheet.", "error");
          return;
        }

        setImportData(validList);
        setImportErrors(errorsList);
        setIsImportModalOpen(true);
      } catch (err) {
        console.error("CSV parse error:", err);
        showToast("Error parsing file: " + err.message, "error");
      }
    };
    reader.readAsText(file);
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleConfirmImport = async () => {
    if (importData.length === 0) return;
    setIsLoading(true);
    try {
      await dbService.bulkSaveProducts(importData, importMode === 'overwrite');
      showToast(`Successfully imported ${importData.length} perfumes into catalog!`);
      setIsImportModalOpen(false);
      setImportData([]);
      loadData();
    } catch (err) {
      showToast("Import error: " + err.message, "error");
    } finally {
      setIsLoading(false);
    }
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
      
      {/* Toast Notification Banner */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 10000,
          background: toast.type === 'error' ? '#8a1c14' : 'var(--noir)',
          color: 'var(--white)',
          padding: '14px 20px',
          border: `1px solid ${toast.type === 'error' ? '#d93025' : 'var(--gold)'}`,
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontFamily: 'var(--font-label)',
          fontSize: '11px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase'
        }}>
          {toast.type === 'error' ? <AlertCircle size={16} color="#ff6b6b" /> : <CheckCircle size={16} color="var(--gold)" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Admin header */}
      <header style={{ background: 'var(--noir)', borderBottom: '1px solid rgba(201,168,76,0.15)', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ background: 'var(--cream)', padding: '4px 10px', display: 'flex', borderRadius: '3px' }}>
            <img src="/images/logo.png" alt="C&S" style={{ height: '24px', width: 'auto', filter: 'brightness(0)' }} />
          </span>
          <span style={{ fontFamily: 'var(--font-label)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--gold)' }}>Studio Manager</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link href="/" target="_blank" style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-label)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
            <Eye size={13} /> View Live Store
          </Link>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.6)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-label)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
            <LogOut size={13} /> Sign Out
          </button>
        </div>
      </header>

      {/* Hidden File Input for Excel/CSV Import */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept=".csv, .txt, .tsv" 
        style={{ display: 'none' }} 
      />

      {/* Main Container */}
      <div style={{ maxWidth: '1360px', width: '100%', margin: '32px auto', padding: '0 24px 80px', flex: '1', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Executive KPI Stats Overview */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          
          <div style={{ background: 'var(--white)', border: '1px solid rgba(201,168,76,0.2)', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '6px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)' }}>
              <span style={{ fontFamily: 'var(--font-label)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Total Fragrances</span>
              <Package size={15} color="var(--gold)" />
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--text-dark)', fontWeight: '400' }}>
              {stats.totalProducts}
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              <strong style={{ color: '#1e8e3e' }}>{stats.inStockCount} In Stock</strong> • <span style={{ color: '#d93025' }}>{stats.outOfStockCount} Sold Out</span>
            </span>
          </div>

          <div style={{ background: 'var(--white)', border: '1px solid rgba(201,168,76,0.2)', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '6px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)' }}>
              <span style={{ fontFamily: 'var(--font-label)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Featured Badges</span>
              <Sparkles size={15} color="var(--gold)" />
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--text-dark)', fontWeight: '400' }}>
              {stats.bestsellersCount + stats.newArrivalsCount}
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {stats.bestsellersCount} Bestsellers • {stats.newArrivalsCount} New Arrivals
            </span>
          </div>

          <div style={{ background: 'var(--white)', border: '1px solid rgba(201,168,76,0.2)', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '6px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)' }}>
              <span style={{ fontFamily: 'var(--font-label)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Client Orders</span>
              <FileText size={15} color="var(--gold)" />
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--text-dark)', fontWeight: '400' }}>
              {stats.totalOrders}
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Recorded Transactions
            </span>
          </div>

          <div style={{ background: 'var(--white)', border: '1px solid rgba(201,168,76,0.2)', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '6px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)' }}>
              <span style={{ fontFamily: 'var(--font-label)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Gross Sales Value</span>
              <DollarSign size={15} color="var(--gold)" />
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--gold)', fontWeight: '500' }}>
              ₹{stats.totalRevenue.toLocaleString()}
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Combined Store Value
            </span>
          </div>

        </div>

        {/* Tab selector */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(201,168,76,0.2)', gap: '4px' }}>
          {[
            { id: 'products', label: `Perfumes (${products.length})`, icon: <Package size={14} /> },
            { id: 'settings', label: 'Editorial Settings', icon: <Settings size={14} /> },
            { id: 'orders', label: `Client Orders (${orders.length})`, icon: <FileText size={14} /> }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '14px 24px', background: activeTab === tab.id ? 'var(--white)' : 'transparent',
                border: '1px solid transparent',
                borderBottom: 'none',
                borderColor: activeTab === tab.id ? 'rgba(201,168,76,0.2) rgba(201,168,76,0.2) transparent' : 'transparent',
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
          <div style={{ background: 'var(--white)', border: '1px solid rgba(201,168,76,0.15)', padding: '64px 0', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: '300' }}>
            Syncing database details...
          </div>
        ) : (
          <div style={{ background: 'var(--white)', border: '1px solid rgba(201,168,76,0.15)', padding: '32px', boxShadow: 'var(--shadow-sm)' }}>
            
            {/* ========================================================
                TAB 1: PRODUCTS MANAGER (CARD VIEW + LIST VIEW + IMPORT/EXPORT)
                ======================================================== */}
            {activeTab === 'products' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Top Action Bar: Search, Import/Export, Guide & Create */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                  
                  {/* Left: Search input */}
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid rgba(201,168,76,0.2)', background: 'var(--cream)', padding: '10px 16px', minWidth: '300px', flex: '1 1 300px' }}>
                    <Search size={15} color="var(--text-muted)" style={{ marginRight: '10px' }} />
                    <input 
                      type="text" 
                      placeholder="Search title, brand, category, notes..." 
                      value={prodSearch} 
                      onChange={e => setProdSearch(e.target.value)}
                      style={{ border: 'none', background: 'transparent', outline: 'none', fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-dark)', width: '100%' }} 
                    />
                    {prodSearch && (
                      <button onClick={() => setProdSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  {/* Right Action Buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    
                    {/* View Switcher: Card View vs List View */}
                    <div style={{ display: 'flex', border: '1px solid rgba(201,168,76,0.3)', background: 'var(--cream)' }}>
                      <button 
                        onClick={() => handleSetViewMode('card')} 
                        title="Card View (Default)"
                        style={{ 
                          padding: '9px 13px', 
                          border: 'none', 
                          background: viewMode === 'card' ? 'var(--noir)' : 'transparent', 
                          color: viewMode === 'card' ? 'var(--gold)' : 'var(--text-muted)', 
                          cursor: 'pointer', 
                          display: 'flex', 
                          alignItems: 'center',
                          gap: '6px',
                          fontFamily: 'var(--font-label)',
                          fontSize: '10px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em'
                        }}>
                        <LayoutGrid size={14} /> Cards
                      </button>
                      <button 
                        onClick={() => handleSetViewMode('list')} 
                        title="List/Table View"
                        style={{ 
                          padding: '9px 13px', 
                          border: 'none', 
                          borderLeft: '1px solid rgba(201,168,76,0.3)',
                          background: viewMode === 'list' ? 'var(--noir)' : 'transparent', 
                          color: viewMode === 'list' ? 'var(--gold)' : 'var(--text-muted)', 
                          cursor: 'pointer', 
                          display: 'flex', 
                          alignItems: 'center',
                          gap: '6px',
                          fontFamily: 'var(--font-label)',
                          fontSize: '10px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em'
                        }}>
                        <List size={14} /> Table
                      </button>
                    </div>

                    {/* Import Guide & Template Button */}
                    <button 
                      onClick={() => setIsGuideModalOpen(true)}
                      style={{ 
                        background: 'transparent', 
                        border: '1px solid rgba(201,168,76,0.35)', 
                        color: 'var(--text-dark)', 
                        padding: '10px 16px', 
                        fontFamily: 'var(--font-label)', 
                        fontSize: '10px', 
                        fontWeight: '700', 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.1em', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px', 
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.35)'; e.currentTarget.style.color = 'var(--text-dark)'; }}
                    >
                      <HelpCircle size={14} color="var(--gold)" /> Import Guide
                    </button>

                    {/* Import Excel/CSV Button */}
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      style={{ 
                        background: 'transparent', 
                        border: '1px solid rgba(201,168,76,0.35)', 
                        color: 'var(--text-dark)', 
                        padding: '10px 16px', 
                        fontFamily: 'var(--font-label)', 
                        fontSize: '10px', 
                        fontWeight: '700', 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.1em', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px', 
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.35)'; e.currentTarget.style.color = 'var(--text-dark)'; }}
                    >
                      <Upload size={14} color="var(--gold)" /> Import Excel
                    </button>

                    {/* Export Excel/CSV Button */}
                    <button 
                      onClick={() => exportProductsToCSV(hasActiveFilters)}
                      style={{ 
                        background: 'transparent', 
                        border: '1px solid rgba(201,168,76,0.35)', 
                        color: 'var(--text-dark)', 
                        padding: '10px 16px', 
                        fontFamily: 'var(--font-label)', 
                        fontSize: '10px', 
                        fontWeight: '700', 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.1em', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px', 
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.35)'; e.currentTarget.style.color = 'var(--text-dark)'; }}
                    >
                      <Download size={14} color="var(--gold)" /> Export CSV
                    </button>

                    {/* Add New Scent Button */}
                    <button 
                      onClick={handleOpenAddProduct}
                      style={{ 
                        background: 'var(--gold)', 
                        color: 'var(--noir)', 
                        border: 'none', 
                        padding: '10px 20px', 
                        fontFamily: 'var(--font-label)', 
                        fontSize: '10px', 
                        fontWeight: '700', 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.15em', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        cursor: 'pointer', 
                        transition: 'all 0.22s' 
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--gold-light)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'var(--gold)'}
                    >
                      <Plus size={14} /> Add Scent
                    </button>

                  </div>

                </div>

                {/* Filter & Sort Controls Bar */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: 'var(--cream)', border: '1px solid rgba(201,168,76,0.15)', flexWrap: 'wrap', gap: '12px' }}>
                  
                  {/* Filter Dropdowns */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-label)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', fontWeight: '600' }}>
                      <Filter size={12} color="var(--gold)" /> Filter By:
                    </span>

                    {/* Category Filter */}
                    <select 
                      value={selectedCategory} 
                      onChange={e => setSelectedCategory(e.target.value)}
                      style={{ padding: '6px 10px', border: '1px solid rgba(201,168,76,0.25)', background: 'var(--white)', fontSize: '12px', outline: 'none', cursor: 'pointer' }}
                    >
                      <option value="all">All Categories</option>
                      {categoriesList.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>

                    {/* Gender Filter */}
                    <select 
                      value={selectedGender} 
                      onChange={e => setSelectedGender(e.target.value)}
                      style={{ padding: '6px 10px', border: '1px solid rgba(201,168,76,0.25)', background: 'var(--white)', fontSize: '12px', outline: 'none', cursor: 'pointer' }}
                    >
                      <option value="all">All Genders</option>
                      <option value="Unisex">Unisex</option>
                      <option value="Men">Men</option>
                      <option value="Women">Women</option>
                    </select>

                    {/* Stock Status Filter */}
                    <select 
                      value={selectedStock} 
                      onChange={e => setSelectedStock(e.target.value)}
                      style={{ padding: '6px 10px', border: '1px solid rgba(201,168,76,0.25)', background: 'var(--white)', fontSize: '12px', outline: 'none', cursor: 'pointer' }}
                    >
                      <option value="all">All Stock Status</option>
                      <option value="instock">In Stock Only</option>
                      <option value="soldout">Sold Out Only</option>
                    </select>

                    {/* Badge Filter */}
                    <select 
                      value={selectedBadge} 
                      onChange={e => setSelectedBadge(e.target.value)}
                      style={{ padding: '6px 10px', border: '1px solid rgba(201,168,76,0.25)', background: 'var(--white)', fontSize: '12px', outline: 'none', cursor: 'pointer' }}
                    >
                      <option value="all">All Badges</option>
                      <option value="bestseller">Bestsellers</option>
                      <option value="newarrival">New Arrivals</option>
                      <option value="onsale">On Sale</option>
                    </select>

                    {hasActiveFilters && (
                      <button 
                        onClick={handleResetFilters}
                        style={{ padding: '6px 10px', background: 'none', border: '1px solid #d93025', color: '#d93025', fontFamily: 'var(--font-label)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <RefreshCw size={10} /> Reset
                      </button>
                    )}
                  </div>

                  {/* Sort By Dropdown */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-label)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', fontWeight: '600' }}>
                      <ArrowUpDown size={12} color="var(--gold)" /> Sort:
                    </span>
                    <select 
                      value={sortBy} 
                      onChange={e => setSortBy(e.target.value)}
                      style={{ padding: '6px 10px', border: '1px solid rgba(201,168,76,0.25)', background: 'var(--white)', fontSize: '12px', outline: 'none', cursor: 'pointer' }}
                    >
                      <option value="newest">New Arrivals First</option>
                      <option value="bestsellers">Bestsellers First</option>
                      <option value="title-asc">Title: A to Z</option>
                      <option value="title-desc">Title: Z to A</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating-desc">Highest Rated</option>
                      <option value="stock-first">In Stock First</option>
                      <option value="soldout-first">Sold Out First</option>
                    </select>
                  </div>

                </div>

                {/* Results Count Summary */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
                  <span>Showing <strong>{filteredProducts.length}</strong> of {products.length} fragrances</span>
                  {hasActiveFilters && <span style={{ color: 'var(--gold)', fontSize: '11px' }}>Filtered Results Active</span>}
                </div>

                {/* ========================================================
                    VIEW 1: CARD VIEW (DEFAULT)
                    ======================================================== */}
                {viewMode === 'card' && (
                  <div>
                    {filteredProducts.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--cream)', border: '1px solid rgba(201,168,76,0.15)' }}>
                        <p style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--text-dark)', marginBottom: '8px' }}>No Fragrances Match Criteria</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '20px' }}>Try loosening your filters or keyword search query.</p>
                        <button onClick={handleResetFilters} className="btn-primary" style={{ display: 'inline-flex' }}>Reset All Filters</button>
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                        {filteredProducts.map((p, idx) => (
                          <div 
                            key={p.id || idx}
                            style={{ 
                              background: 'var(--white)', 
                              border: '1px solid rgba(201,168,76,0.2)', 
                              display: 'flex', 
                              flexDirection: 'column', 
                              position: 'relative',
                              boxShadow: 'var(--shadow-sm)',
                              transition: 'all 0.25s ease'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.boxShadow = 'var(--shadow-gold-soft)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
                          >
                            {/* Product Card Image Frame with Arch Curve */}
                            <div style={{ 
                              position: 'relative', 
                              aspectRatio: '1', 
                              background: 'radial-gradient(circle, var(--cream) 0%, var(--pearl) 100%)', 
                              borderBottom: '1px solid rgba(201,168,76,0.15)',
                              overflow: 'hidden',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <img 
                                src={p.image || '/images/perfume_elegant_1784660079140.png'} 
                                alt={p.title} 
                                style={{ width: '80%', height: '80%', objectFit: 'contain', transition: 'transform 0.4s ease' }}
                              />

                              {/* Badges Overlay */}
                              <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {p.isBestseller && (
                                  <span style={{ background: 'var(--gold)', color: 'var(--noir)', padding: '3px 8px', fontSize: '9px', fontFamily: 'var(--font-label)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                    ★ Bestseller
                                  </span>
                                )}
                                {p.isNewArrival && (
                                  <span style={{ background: 'var(--noir)', color: 'var(--white)', padding: '3px 8px', fontSize: '9px', fontFamily: 'var(--font-label)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                    ✨ New
                                  </span>
                                )}
                                {p.discount > 0 && p.inStock !== false && (
                                  <span style={{ background: '#d93025', color: 'var(--white)', padding: '3px 8px', fontSize: '9px', fontFamily: 'var(--font-label)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                    {p.discount}% OFF
                                  </span>
                                )}
                              </div>

                              {/* Stock status badge */}
                              <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                                <span style={{
                                  padding: '3px 8px', fontSize: '9px', fontFamily: 'var(--font-label)', fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase',
                                  background: p.inStock !== false ? 'rgba(45,154,95,0.9)' : 'rgba(217,48,37,0.9)',
                                  color: 'var(--white)',
                                  borderRadius: '2px'
                                }}>
                                  {p.inStock !== false ? 'In Stock' : 'Sold Out'}
                                </span>
                              </div>
                            </div>

                            {/* Card Content Details */}
                            <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', flex: '1', justifyContent: 'space-between', gap: '14px' }}>
                              
                              <div>
                                {/* Category & Gender Tags */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                  <span style={{ fontSize: '10px', fontFamily: 'var(--font-label)', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--gold)', fontWeight: '600' }}>
                                    {p.category || 'Floral'} • {p.gender || 'Unisex'}
                                  </span>
                                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-label)' }}>
                                    {p.concentration || 'Extrait'}
                                  </span>
                                </div>

                                {/* Title */}
                                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '17px', color: 'var(--text-dark)', fontWeight: '400', margin: '0 0 6px 0', lineHeight: '1.3' }}>
                                  {p.title}
                                </h4>

                                {/* Scent notes */}
                                <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '0 0 12px 0', fontStyle: 'italic', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                  {Array.isArray(p.notes) ? p.notes.join(' · ') : (p.notes || 'Luxury accords')}
                                </p>

                                {/* Price Box */}
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                  {p.price > p.salePrice && (
                                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                                      ₹{p.price}
                                    </span>
                                  )}
                                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--text-dark)', fontWeight: '500' }}>
                                    ₹{p.salePrice}
                                  </span>
                                </div>
                              </div>

                              {/* Action Footer */}
                              <div style={{ borderTop: '1px solid rgba(201,168,76,0.15)', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                
                                {/* Quick stock toggle */}
                                <button 
                                  onClick={() => handleToggleStock(p)}
                                  title={p.inStock !== false ? "Click to mark as Sold Out" : "Click to mark as In Stock"}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    fontFamily: 'var(--font-label)',
                                    fontSize: '9px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.08em',
                                    color: p.inStock !== false ? '#1e8e3e' : '#d93025'
                                  }}
                                >
                                  {p.inStock !== false ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                                  {p.inStock !== false ? 'In Stock' : 'Sold Out'}
                                </button>

                                {/* Action Buttons */}
                                <div style={{ display: 'flex', gap: '6px' }}>
                                  <button 
                                    onClick={() => handleDuplicateProduct(p)} 
                                    title="Duplicate / Clone"
                                    style={{ padding: '6px 8px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--cream)', cursor: 'pointer', color: 'var(--text-muted)', transition: 'all 0.2s' }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                                  >
                                    <Copy size={13} />
                                  </button>

                                  <button 
                                    onClick={() => handleOpenEditProduct(p)} 
                                    title="Edit Perfume"
                                    style={{ padding: '6px 8px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--cream)', cursor: 'pointer', color: 'var(--text-muted)', transition: 'all 0.2s' }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                                  >
                                    <Edit3 size={13} />
                                  </button>

                                  <button 
                                    onClick={() => handleDeleteProduct(p.id, p.title)} 
                                    title="Delete Perfume"
                                    style={{ padding: '6px 8px', border: '1px solid rgba(217,48,37,0.2)', background: 'rgba(217,48,37,0.05)', cursor: 'pointer', color: '#d93025', transition: 'all 0.2s' }}
                                    onMouseEnter={e => { e.currentTarget.style.background = '#d93025'; e.currentTarget.style.color = '#fff'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(217,48,37,0.05)'; e.currentTarget.style.color = '#d93025'; }}
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>

                              </div>

                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ========================================================
                    VIEW 2: LIST / TABLE VIEW
                    ======================================================== */}
                {viewMode === 'list' && (
                  <div style={{ overflowX: 'auto', border: '1px solid rgba(201,168,76,0.15)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid var(--gold)', background: 'var(--charcoal)' }}>
                          <th style={{ padding: '14px 16px', fontFamily: 'var(--font-label)', fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--white)' }}>Image</th>
                          <th style={{ padding: '14px 16px', fontFamily: 'var(--font-label)', fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--white)' }}>Title & Notes</th>
                          <th style={{ padding: '14px 16px', fontFamily: 'var(--font-label)', fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--white)' }}>Category</th>
                          <th style={{ padding: '14px 16px', fontFamily: 'var(--font-label)', fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--white)' }}>Gender</th>
                          <th style={{ padding: '14px 16px', fontFamily: 'var(--font-label)', fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--white)' }}>Price</th>
                          <th style={{ padding: '14px 16px', fontFamily: 'var(--font-label)', fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--white)' }}>Sale Price</th>
                          <th style={{ padding: '14px 16px', fontFamily: 'var(--font-label)', fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--white)' }}>Stock</th>
                          <th style={{ padding: '14px 16px', fontFamily: 'var(--font-label)', fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--white)', textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProducts.length === 0 ? (
                          <tr>
                            <td colSpan="8" style={{ padding: '40px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
                              No fragrances match criteria.
                            </td>
                          </tr>
                        ) : (
                          filteredProducts.map((p, idx) => (
                            <tr key={p.id || idx} style={{ borderBottom: '1px solid rgba(201,168,76,0.15)', transition: 'background 0.2s' }}
                              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(201,168,76,0.02)'}
                              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                              <td style={{ padding: '12px 16px' }}>
                                <img src={p.image || '/images/perfume_elegant_1784660079140.png'} alt="" style={{ width: '44px', height: '44px', objectFit: 'cover', background: 'var(--pearl)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '6px' }} />
                              </td>
                              <td style={{ padding: '12px 16px' }}>
                                <div style={{ fontWeight: '600', color: 'var(--text-dark)', fontSize: '14px' }}>{p.title}</div>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                  {Array.isArray(p.notes) ? p.notes.join(' · ') : (p.notes || '')}
                                </div>
                              </td>
                              <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--text-muted)' }}>{p.category || 'Floral'}</td>
                              <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--text-muted)' }}>{p.gender || 'Unisex'}</td>
                              <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--text-muted)' }}>₹{p.price}</td>
                              <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 'bold', color: 'var(--gold)' }}>₹{p.salePrice}</td>
                              <td style={{ padding: '12px 16px' }}>
                                <button 
                                  onClick={() => handleToggleStock(p)}
                                  style={{
                                    padding: '4px 10px', fontSize: '9px', fontFamily: 'var(--font-label)', fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase',
                                    background: p.inStock !== false ? 'rgba(45,154,95,0.08)' : 'rgba(217,48,37,0.08)',
                                    color: p.inStock !== false ? '#1e8e3e' : '#d93025',
                                    border: p.inStock !== false ? '1px solid rgba(45,154,95,0.2)' : '1px solid rgba(217,48,37,0.2)',
                                    cursor: 'pointer'
                                  }}
                                  title="Click to toggle stock"
                                >
                                  {p.inStock !== false ? 'In Stock' : 'Sold Out'}
                                </button>
                              </td>
                              <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                  <button onClick={() => handleDuplicateProduct(p)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} title="Duplicate"><Copy size={15} /></button>
                                  <button onClick={() => handleOpenEditProduct(p)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} title="Edit"><Edit3 size={15} /></button>
                                  <button onClick={() => handleDeleteProduct(p.id, p.title)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#d93025' }} title="Delete"><Trash2 size={15} /></button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                  
                  {/* Order Search */}
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid rgba(201,168,76,0.2)', background: 'var(--cream)', padding: '10px 16px', minWidth: '300px', flex: '1 1 300px' }}>
                    <Search size={14} color="var(--text-muted)" style={{ marginRight: '10px' }} />
                    <input 
                      type="text" 
                      placeholder="Search customer, order id, phone, email..." 
                      value={orderSearch} 
                      onChange={e => setOrderSearch(e.target.value)}
                      style={{ border: 'none', background: 'transparent', outline: 'none', fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-dark)', width: '100%' }} 
                    />
                    {orderSearch && (
                      <button onClick={() => setOrderSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  {/* Status filter & export */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <select 
                      value={orderStatusFilter} 
                      onChange={e => setOrderStatusFilter(e.target.value)}
                      style={{ padding: '10px 14px', border: '1px solid rgba(201,168,76,0.25)', background: 'var(--cream)', fontSize: '12px', outline: 'none', cursor: 'pointer' }}
                    >
                      <option value="all">All Order Statuses</option>
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>

                    <button onClick={exportOrdersToCSV}
                      style={{ border: '1px solid var(--gold)', background: 'none', color: 'var(--gold)', padding: '10px 20px', fontFamily: 'var(--font-label)', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.22s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--gold)'; e.currentTarget.style.color = 'var(--noir)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--gold)'; }}
                    >
                      <FileSpreadsheet size={14} /> Export Orders
                    </button>
                  </div>

                </div>

                {/* Orders Table */}
                <div style={{ overflowX: 'auto', border: '1px solid rgba(201,168,76,0.15)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--gold)', background: 'var(--charcoal)' }}>
                        <th style={{ padding: '14px 16px', fontFamily: 'var(--font-label)', fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--white)' }}>Order ID</th>
                        <th style={{ padding: '14px 16px', fontFamily: 'var(--font-label)', fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--white)' }}>Date</th>
                        <th style={{ padding: '14px 16px', fontFamily: 'var(--font-label)', fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--white)' }}>Customer</th>
                        <th style={{ padding: '14px 16px', fontFamily: 'var(--font-label)', fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--white)' }}>Items Ordered</th>
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
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(201,168,76,0.02)'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                            <td style={{ padding: '14px 16px', fontWeight: 'bold', fontSize: '13px' }}>{o.orderId}</td>
                            <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-muted)' }}>{new Date(o._createdAt).toLocaleDateString()}</td>
                            <td style={{ padding: '14px 16px' }}>
                              <p style={{ fontWeight: '600', margin: '0 0 2px' }}>{o.customerName}</p>
                              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0' }}>{o.phone} • {o.email}</p>
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
                                  padding: '5px 10px',
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
          MODAL 1: EXCEL IMPORT GUIDE & SAMPLE TEMPLATE DOWNLOAD
          ======================================================== */}
      {isGuideModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'var(--white)', border: '1px solid var(--gold)', width: '100%', maxWidth: '840px', maxHeight: '90vh', overflowY: 'auto', padding: '36px', boxShadow: 'var(--shadow-gold)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(201,168,76,0.15)', paddingBottom: '16px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileSpreadsheet size={22} color="var(--gold)" />
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: '300', color: 'var(--text-dark)', margin: 0 }}>
                    Excel & CSV Import Guide
                  </h3>
                  <p style={{ fontFamily: 'var(--font-label)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                    Specifications & Format Rules
                  </p>
                </div>
              </div>
              <button onClick={() => setIsGuideModalOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Download Template Banner */}
              <div style={{ background: 'var(--cream)', border: '1px solid rgba(201,168,76,0.3)', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', margin: '0 0 4px', color: 'var(--text-dark)' }}>Ready-to-Use Excel Template</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>Download our sample CSV spreadsheet pre-populated with example fragrances.</p>
                </div>
                <button 
                  onClick={handleDownloadSampleTemplate}
                  style={{ background: 'var(--gold)', color: 'var(--noir)', border: 'none', padding: '10px 20px', fontFamily: 'var(--font-label)', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                >
                  <Download size={14} /> Download Sample Template (.csv)
                </button>
              </div>

              {/* Mandatory Fields Table */}
              <div>
                <h4 style={{ fontFamily: 'var(--font-label)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.18em', color: '#d93025', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertCircle size={14} /> Mandatory Columns (Required)
                </h4>
                <div style={{ overflowX: 'auto', border: '1px solid rgba(201,168,76,0.15)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: 'var(--charcoal)', color: 'var(--white)' }}>
                        <th style={{ padding: '10px 14px', fontFamily: 'var(--font-label)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Column Header</th>
                        <th style={{ padding: '10px 14px', fontFamily: 'var(--font-label)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Type</th>
                        <th style={{ padding: '10px 14px', fontFamily: 'var(--font-label)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Example</th>
                        <th style={{ padding: '10px 14px', fontFamily: 'var(--font-label)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Guidelines</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                        <td style={{ padding: '10px 14px', fontWeight: '600' }}>Title</td>
                        <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Text</td>
                        <td style={{ padding: '10px 14px', fontStyle: 'italic' }}>Oud & Gold Extrait</td>
                        <td style={{ padding: '10px 14px' }}>The full product name shown on product cards and checkout.</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                        <td style={{ padding: '10px 14px', fontWeight: '600' }}>Price / Sale Price</td>
                        <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Number</td>
                        <td style={{ padding: '10px 14px', fontStyle: 'italic' }}>4500</td>
                        <td style={{ padding: '10px 14px' }}>Numbers only (no currency symbols). Sale price is the final price.</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                        <td style={{ padding: '10px 14px', fontWeight: '600' }}>Category</td>
                        <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Text</td>
                        <td style={{ padding: '10px 14px', fontStyle: 'italic' }}>Woody, Floral, Citrus, Oriental</td>
                        <td style={{ padding: '10px 14px' }}>Used for homepage family grouping and catalog filters.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Optional Fields Table */}
              <div>
                <h4 style={{ fontFamily: 'var(--font-label)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--gold)', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle size={14} /> Optional Columns & Formatting
                </h4>
                <div style={{ overflowX: 'auto', border: '1px solid rgba(201,168,76,0.15)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: 'var(--charcoal)', color: 'var(--white)' }}>
                        <th style={{ padding: '10px 14px', fontFamily: 'var(--font-label)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Column Header</th>
                        <th style={{ padding: '10px 14px', fontFamily: 'var(--font-label)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Accepted Formats</th>
                        <th style={{ padding: '10px 14px', fontFamily: 'var(--font-label)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Default if Empty</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                        <td style={{ padding: '10px 14px', fontWeight: '600' }}>Scent Notes</td>
                        <td style={{ padding: '10px 14px' }}>Comma-separated e.g. <span style={{ fontStyle: 'italic' }}>Rose, Amber, Musk</span></td>
                        <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Auto-populated luxury note</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                        <td style={{ padding: '10px 14px', fontWeight: '600' }}>Gender</td>
                        <td style={{ padding: '10px 14px' }}>Unisex, Men, Women</td>
                        <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Unisex</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                        <td style={{ padding: '10px 14px', fontWeight: '600' }}>Concentration</td>
                        <td style={{ padding: '10px 14px' }}>Extrait De Parfum, Eau De Parfum</td>
                        <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Extrait De Parfum</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                        <td style={{ padding: '10px 14px', fontWeight: '600' }}>In Stock</td>
                        <td style={{ padding: '10px 14px' }}>TRUE / FALSE or YES / NO</td>
                        <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>TRUE</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                        <td style={{ padding: '10px 14px', fontWeight: '600' }}>Image URL</td>
                        <td style={{ padding: '10px 14px' }}>Full HTTPS link or local path e.g. <span style={{ fontStyle: 'italic' }}>/images/perfume_...png</span></td>
                        <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Default bottle image</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Best practices list */}
              <div style={{ background: 'var(--cream)', padding: '16px 20px', borderLeft: '3px solid var(--gold)', fontSize: '12px', color: 'var(--text-dark)', lineHeight: '1.6' }}>
                <strong>Important Tips:</strong>
                <ul style={{ margin: '6px 0 0 0', paddingLeft: '20px' }}>
                  <li>Always save spreadsheet as <strong>CSV (Comma Delimited)</strong> or <strong>CSV UTF-8</strong>.</li>
                  <li>Do not include currency symbols like <code>₹</code> or <code>$</code> in the Price column.</li>
                  <li>If updating existing fragrances, you can include the original <code>Slug</code> to update rather than duplicate.</li>
                </ul>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid rgba(201,168,76,0.15)', paddingTop: '16px' }}>
                <button 
                  onClick={() => setIsGuideModalOpen(false)}
                  style={{ background: 'var(--noir)', color: 'var(--white)', border: 'none', padding: '10px 24px', fontFamily: 'var(--font-label)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', cursor: 'pointer' }}
                >
                  Close Guide
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: EXCEL IMPORT PREVIEW & CONFIRMATION
          ======================================================== */}
      {isImportModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'var(--white)', border: '1px solid var(--gold)', width: '100%', maxWidth: '960px', maxHeight: '90vh', overflowY: 'auto', padding: '36px', boxShadow: 'var(--shadow-gold)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(201,168,76,0.15)', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: '300', color: 'var(--text-dark)', margin: 0 }}>
                  Import Preview & Verification
                </h3>
                <p style={{ fontFamily: 'var(--font-label)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                  {importData.length} valid fragrances ready to import
                </p>
              </div>
              <button onClick={() => setIsImportModalOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Warnings/Errors if any */}
              {importErrors.length > 0 && (
                <div style={{ background: 'rgba(217,48,37,0.06)', border: '1px solid rgba(217,48,37,0.2)', padding: '12px 16px', fontSize: '12px', color: '#d93025' }}>
                  <strong>{importErrors.length} Warnings / Skipped Rows:</strong>
                  <ul style={{ margin: '4px 0 0', paddingLeft: '20px' }}>
                    {importErrors.map((err, i) => <li key={i}>{err}</li>)}
                  </ul>
                </div>
              )}

              {/* Import Mode Selection */}
              <div style={{ background: 'var(--cream)', padding: '16px 20px', border: '1px solid rgba(201,168,76,0.2)', display: 'flex', gap: '32px', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'var(--font-label)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700' }}>Import Mode:</span>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                  <input type="radio" name="importMode" checked={importMode === 'append'} onChange={() => setImportMode('append')} />
                  <strong>Append & Update</strong> (Keep existing catalog, update matches)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                  <input type="radio" name="importMode" checked={importMode === 'overwrite'} onChange={() => setImportMode('overwrite')} />
                  <strong style={{ color: '#d93025' }}>Clean Overwrite</strong> (Replace all current products)
                </label>
              </div>

              {/* Data Preview Table */}
              <div style={{ overflowX: 'auto', border: '1px solid rgba(201,168,76,0.15)', maxHeight: '360px', overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                  <thead style={{ position: 'sticky', top: 0, background: 'var(--charcoal)', color: 'var(--white)', zIndex: 2 }}>
                    <tr>
                      <th style={{ padding: '10px 14px', fontFamily: 'var(--font-label)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Title</th>
                      <th style={{ padding: '10px 14px', fontFamily: 'var(--font-label)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Category</th>
                      <th style={{ padding: '10px 14px', fontFamily: 'var(--font-label)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Gender</th>
                      <th style={{ padding: '10px 14px', fontFamily: 'var(--font-label)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Regular Price</th>
                      <th style={{ padding: '10px 14px', fontFamily: 'var(--font-label)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Sale Price</th>
                      <th style={{ padding: '10px 14px', fontFamily: 'var(--font-label)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Stock</th>
                      <th style={{ padding: '10px 14px', fontFamily: 'var(--font-label)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {importData.map((item, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                        <td style={{ padding: '10px 14px', fontWeight: '600' }}>{item.title}</td>
                        <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>{item.category}</td>
                        <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>{item.gender}</td>
                        <td style={{ padding: '10px 14px' }}>₹{item.price}</td>
                        <td style={{ padding: '10px 14px', fontWeight: 'bold', color: 'var(--gold)' }}>₹{item.salePrice}</td>
                        <td style={{ padding: '10px 14px' }}>
                          <span style={{ color: item.inStock ? '#1e8e3e' : '#d93025', fontWeight: '600', fontSize: '10px' }}>
                            {item.inStock ? 'IN STOCK' : 'SOLD OUT'}
                          </span>
                        </td>
                        <td style={{ padding: '10px 14px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          {Array.isArray(item.notes) ? item.notes.join(', ') : item.notes}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid rgba(201,168,76,0.15)', paddingTop: '16px' }}>
                <button 
                  onClick={() => setIsImportModalOpen(false)}
                  style={{ background: 'transparent', border: '1px solid rgba(0,0,0,0.15)', padding: '10px 20px', fontFamily: 'var(--font-label)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmImport}
                  style={{ background: 'var(--gold)', color: 'var(--noir)', border: 'none', padding: '10px 24px', fontFamily: 'var(--font-label)', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.15em', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Upload size={14} /> Commit & Import ({importData.length})
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 3: PRODUCT EDITOR DIALOG MODAL
          ======================================================== */}
      {isProductModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', zIndex: 999, backdropFilter: 'blur(4px)' }}>
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
              <div style={{ display: 'flex', gap: '28px', marginTop: '10px', background: 'var(--cream)', padding: '16px 20px', border: '1px solid rgba(201,168,76,0.15)', flexWrap: 'wrap' }}>
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
