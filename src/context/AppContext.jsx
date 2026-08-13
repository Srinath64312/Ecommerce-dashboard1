import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_CUSTOMERS } from '../utils/mockData';
import { ORDER_STATUSES, sanitizeOrder, sanitizeProduct } from '../utils/sanitize';

const AppContext = createContext();

const DEFAULT_WIDGETS = ['kpis', 'salesChart', 'recentOrders', 'inventoryAlerts', 'categoryBreakdown'];
const ALLOWED_THEMES = ['dark', 'light'];
const MAX_PERSISTED_RECORDS = 1000;

/**
 * Read a persisted array, running every entry through `sanitizeItem` and
 * dropping malformed records. Persisted state is untrusted input: it can be
 * edited freely from devtools or by any script running on the origin.
 * @param {string} key
 * @param {(item: unknown) => unknown} sanitizeItem
 * @param {Array<unknown>} fallback
 */
function loadPersistedArray(key, sanitizeItem, fallback) {
  try {
    const saved = localStorage.getItem(key);
    const parsed = saved ? JSON.parse(saved) : null;
    if (!Array.isArray(parsed) || parsed.length === 0) return fallback;
    const cleaned = parsed.slice(0, MAX_PERSISTED_RECORDS).map(sanitizeItem).filter(Boolean);
    return cleaned.length > 0 ? cleaned : fallback;
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }) {
  // Theme state
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return ALLOWED_THEMES.includes(saved) ? saved : 'dark';
  });

  // Navigation tab
  const [activeTab, setActiveTab] = useState('overview');

  // Sidebar collapsed state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Global search & filters
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('7d');

  // Data states with LocalStorage persistence
  const [products, setProducts] = useState(
    () => loadPersistedArray('products', sanitizeProduct, INITIAL_PRODUCTS)
  );

  const [orders, setOrders] = useState(
    () => loadPersistedArray('orders', sanitizeOrder, INITIAL_ORDERS)
  );

  const [customers] = useState(INITIAL_CUSTOMERS);

  // Drag and drop widget order on overview
  const [widgets, setWidgets] = useState(() => {
    try {
      const saved = localStorage.getItem('dashboard_widgets');
      const parsed = saved ? JSON.parse(saved) : null;
      if (!Array.isArray(parsed)) return DEFAULT_WIDGETS;
      const unique = [...new Set(parsed.filter(id => DEFAULT_WIDGETS.includes(id)))];
      return unique.length === DEFAULT_WIDGETS.length ? unique : DEFAULT_WIDGETS;
    } catch {
      return DEFAULT_WIDGETS;
    }
  });

  // Modals state
  const [productModal, setProductModal] = useState({ isOpen: false, product: null });
  const [orderModal, setOrderModal] = useState({ isOpen: false, order: null });

  // Toast feedback state
  const [toasts, setToasts] = useState([]);

  // Save to local storage on updates
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('dashboard_widgets', JSON.stringify(widgets));
  }, [widgets]);

  // Toast helper
  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Toggle Theme
  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
    addToast(`Switched to ${theme === 'dark' ? 'Light' : 'Dark'} mode`, 'info');
  };

  // CRUD for Products
  const addProduct = (newProd) => {
    const created = sanitizeProduct({
      ...newProd,
      id: `PROD-${Date.now().toString().slice(-4)}`,
      rating: 5.0,
      salesCount: 0,
    });
    if (!created) {
      addToast('Product could not be saved: invalid details.', 'warning');
      return;
    }
    setProducts(prev => [created, ...prev]);
    addToast(`Product "${created.name}" created successfully!`, 'success');
  };

  const updateProduct = (updatedProd) => {
    const finalProd = sanitizeProduct(updatedProd);
    if (!finalProd) {
      addToast('Product could not be saved: invalid details.', 'warning');
      return;
    }
    setProducts(prev => prev.map(p => p.id === finalProd.id ? finalProd : p));
    addToast(`Updated "${finalProd.name}"`, 'success');
  };

  const deleteProduct = (productId) => {
    const target = products.find(p => p.id === productId);
    setProducts(prev => prev.filter(p => p.id !== productId));
    addToast(`Deleted product "${target?.name || productId}"`, 'warning');
  };

  // Order Status update
  const updateOrderStatus = (orderId, newStatus) => {
    if (!ORDER_STATUSES.includes(newStatus)) return;
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    addToast(`Order ${orderId} status changed to ${newStatus}`, 'success');
  };

  // Compute Inventory Alerts dynamically
  const lowStockProducts = products.filter(p => p.stock <= (p.minStockLevel || 10));

  return (
    <AppContext.Provider value={{
      theme,
      toggleTheme,
      activeTab,
      setActiveTab,
      sidebarCollapsed,
      setSidebarCollapsed,
      searchQuery,
      setSearchQuery,
      dateRange,
      setDateRange,
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      orders,
      updateOrderStatus,
      customers,
      widgets,
      setWidgets,
      productModal,
      setProductModal,
      orderModal,
      setOrderModal,
      lowStockProducts,
      toasts,
      addToast,
      removeToast
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
