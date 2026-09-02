import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, collection, getDocs, deleteDoc, addDoc, query, orderBy } from 'firebase/firestore';
import mockProducts from '../../data/mockProducts.json';

// Default mock site settings matching the initial state
const defaultSiteSettings = {
  logo: '/images/logo.png',
  heroSlides: [
    {
      title: "Floral Bloom Extrait",
      subtitle: "A soft, romantic whisper of Damask Rose, Moroccan Jasmine, and white musk — crafted for absolute daily elegance.",
      buttonText: "Shop Floral Notes",
      link: "/shop?category=Floral",
      image: "/images/perfume_elegant_1784660079140.png"
    },
    {
      title: "Night Fever Oud",
      subtitle: "Intense black cardamom, rich smoked agarwood, and warm leather. Designed for mysterious, late-night projection.",
      buttonText: "Shop Woody Notes",
      link: "/shop?category=Woody",
      image: "/images/perfume_sleek_1784660046118.png"
    },
    {
      title: "Saffron Royale",
      subtitle: "Crushed saffron threads, amber resins, and sweet cedar wood. A royal scent that leaves a gold-dust trace.",
      buttonText: "Shop Oriental",
      link: "/shop?category=Oriental",
      image: "/images/perfume_gold_1784661624207.png"
    }
  ],
  scentCategories: [
    { name: "Woody", description: "Warm cedar, agarwood & vetiver bases", image: "/images/perfume_sleek_1784660046118.png" },
    { name: "Floral", description: "Fresh jasmine, tuberose & rose blends", image: "/images/perfume_elegant_1784660079140.png" },
    { name: "Citrus", description: "Zesty bergamot, lemon & neroli", image: "/images/perfume_modern_1784660067627.png" },
    { name: "Oriental", description: "Sweet vanilla, spices & amber notes", image: "/images/perfume_gold_1784661624207.png" }
  ],
  whyChooseUs: [
    { title: "100% Organic", description: "Our fragrances are formulated using purely natural, organic plant extracts and essential oil concentrates." },
    { title: "No Phthalates", description: "Free of synthetic parabens, chemical binders, and toxic petroleum derivatives for pure breathability." },
    { title: "Sartorial Gifting", description: "Each order is packaged inside our signature gold-embossed champagne cards and custom velvet sleeves." }
  ],
  shopTheLookImage: "/images/perfume_vintage_1784660057925.png"
};

// Check if Firebase environment variables are provided
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const isFirebaseConfigured = !!(firebaseConfig.apiKey && firebaseConfig.projectId);

let db = null;
if (isFirebaseConfigured) {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    console.log("Firebase Database Initialized successfully!");
  } catch (err) {
    console.error("Failed to initialize Firebase app:", err);
  }
} else {
  console.log("Firebase credentials not detected. Falling back to LocalStorage DB Mode.");
}

// Helper to get local storage data with initial seeding fallback
function getLocalData(key, defaultData) {
  if (typeof window === 'undefined') return defaultData;
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(item);
  } catch (e) {
    console.error(`Error reading ${key} from localStorage:`, e);
    return defaultData;
  }
}

function setLocalData(key, data) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage:`, e);
  }
}

// DATABASE SERVICE
export const dbService = {
  // PRODUCTS
  async getPerfumes() {
    if (db) {
      try {
        const colRef = collection(db, 'products');
        const snap = await getDocs(colRef);
        const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (list.length > 0) return list;
        
        // Seed Firestore if empty
        console.log("Seeding Firestore with initial mock products...");
        for (const prod of mockProducts) {
          const docId = prod.id || prod._id || prod.slug;
          await setDoc(doc(db, 'products', docId), prod);
        }
        return mockProducts;
      } catch (err) {
        console.error("Firestore error in getPerfumes, using local fallback:", err);
      }
    }
    return getLocalData('cns_products', mockProducts);
  },

  async getPerfumeBySlug(slug) {
    const list = await this.getPerfumes();
    return list.find(p => p.slug === slug || p.id === slug) || null;
  },

  async saveProduct(product) {
    const docId = product.id || product._id || product.slug || ('p-' + Math.floor(Math.random() * 1000000));
    const normalizedProduct = { ...product, id: docId, _id: docId };

    if (db) {
      try {
        await setDoc(doc(db, 'products', docId), normalizedProduct);
        return normalizedProduct;
      } catch (err) {
        console.error("Firestore error in saveProduct:", err);
      }
    }

    const current = getLocalData('cns_products', mockProducts);
    const index = current.findIndex(p => p.id === docId);
    if (index > -1) {
      current[index] = normalizedProduct;
    } else {
      current.unshift(normalizedProduct);
    }
    setLocalData('cns_products', current);
    return normalizedProduct;
  },

  async deleteProduct(productId) {
    if (db) {
      try {
        await deleteDoc(doc(db, 'products', productId));
        return true;
      } catch (err) {
        console.error("Firestore error in deleteProduct:", err);
      }
    }

    const current = getLocalData('cns_products', mockProducts);
    const filtered = current.filter(p => p.id !== productId && p._id !== productId);
    setLocalData('cns_products', filtered);
    return true;
  },

  async bulkSaveProducts(newProductsList, overwrite = false) {
    const normalizedList = newProductsList.map(prod => {
      const docId = prod.id || prod._id || prod.slug || ('p-' + Math.floor(Math.random() * 10000000));
      return { ...prod, id: docId, _id: docId };
    });

    if (db) {
      try {
        for (const prod of normalizedList) {
          await setDoc(doc(db, 'products', prod.id), prod);
        }
      } catch (err) {
        console.error("Firestore error in bulkSaveProducts:", err);
      }
    }

    let updatedList = [];
    if (overwrite) {
      updatedList = [...normalizedList];
    } else {
      const current = getLocalData('cns_products', mockProducts);
      const map = new Map();
      current.forEach(p => map.set(p.id || p.slug, p));
      normalizedList.forEach(p => map.set(p.id || p.slug, p));
      updatedList = Array.from(map.values());
    }

    setLocalData('cns_products', updatedList);
    return updatedList;
  },

  // SITE SETTINGS
  async getSiteSettings() {
    if (db) {
      try {
        const docRef = doc(db, 'siteSettings', 'global');
        const snap = await getDoc(docRef);
        if (snap.exists()) return snap.data();
        
        // Seed if not exists
        await setDoc(docRef, defaultSiteSettings);
        return defaultSiteSettings;
      } catch (err) {
        console.error("Firestore error in getSiteSettings, using local fallback:", err);
      }
    }
    return getLocalData('cns_site_settings', defaultSiteSettings);
  },

  async saveSiteSettings(settings) {
    if (db) {
      try {
        await setDoc(doc(db, 'siteSettings', 'global'), settings);
        return settings;
      } catch (err) {
        console.error("Firestore error in saveSiteSettings:", err);
      }
    }
    setLocalData('cns_site_settings', settings);
    return settings;
  },

  // ORDERS
  async getOrders() {
    if (db) {
      try {
        const colRef = collection(db, 'orders');
        const snap = await getDocs(colRef);
        return snap.docs.map(doc => ({ _id: doc.id, ...doc.data() })).sort((a, b) => new Date(b._createdAt || 0) - new Date(a._createdAt || 0));
      } catch (err) {
        console.error("Firestore error in getOrders:", err);
      }
    }
    return getLocalData('cns_orders', []);
  },

  async saveOrder(order) {
    const orderData = {
      ...order,
      _createdAt: order._createdAt || new Date().toISOString()
    };

    if (db) {
      try {
        const colRef = collection(db, 'orders');
        const docRef = await addDoc(colRef, orderData);
        return { _id: docRef.id, ...orderData };
      } catch (err) {
        console.error("Firestore error in saveOrder:", err);
      }
    }

    const current = getLocalData('cns_orders', []);
    const newOrder = { _id: 'o-' + Math.floor(Math.random() * 1000000), ...orderData };
    current.unshift(newOrder);
    setLocalData('cns_orders', current);
    return newOrder;
  },

  async updateOrderStatus(orderId, status) {
    if (db) {
      try {
        const docRef = doc(db, 'orders', orderId);
        await setDoc(docRef, { paymentStatus: status }, { merge: true });
        return true;
      } catch (err) {
        console.error("Firestore error in updateOrderStatus:", err);
      }
    }

    const current = getLocalData('cns_orders', []);
    const index = current.findIndex(o => o._id === orderId);
    if (index > -1) {
      current[index].paymentStatus = status;
      setLocalData('cns_orders', current);
    }
    return true;
  }
};
