import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_CUSTOMERS } from '../utils/mockData';
import { readJSON, readString, writeJSON, writeRaw } from '../utils/storage';

const AppContext = createContext();

const DEFAULT_WIDGETS = ['kpis', 'salesChart', 'recentOrders', 'inventoryAlerts', 'categoryBreakdown'];

const isNonEmptyArray = (v) => Array.isArray(v) && v.length > 0;

export function AppProvider({ children }) {
  // Errors raised while restoring persisted state, surfaced once mounted
  const restoreErrors = useRef([]);
  const recordRestore = (label, error) => {
    if (error) restoreErrors.current.push(label);
  };

  // Theme state
  const [theme, setTheme] = useState(() => {
    const { value, error } = readString('theme', 'dark');
    recordRestore('theme', error);
    return value;
  });

  // Navigation tab
  const [activeTab, setActiveTab] = useState('overview');

  // Sidebar collapsed state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Global search & filters
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('7d');

  // Data states with LocalStorage persistence
  const [products, setProducts] = useState(() => {
    const { value, error } = readJSON('products', INITIAL_PRODUCTS, isNonEmptyArray);
    recordRestore('saved products', error);
    return value;
  });

  const [orders, setOrders] = useState(() => {
    const { value, error } = readJSON('orders', INITIAL_ORDERS, isNonEmptyArray);
    recordRestore('saved orders', error);
    return value;
  });

  const [customers] = useState(INITIAL_CUSTOMERS);

  // Drag and drop widget order on overview
  const [widgets, setWidgets] = useState(() => {
    const { value, error } = readJSON('dashboard_widgets', DEFAULT_WIDGETS, isNonEmptyArray);
    recordRestore('dashboard layout', error);
    return value;
  });

  // Modals state
  const [productModal, setProductModal] = useState({ isOpen: false, product: null });
  const [orderModal, setOrderModal] = useState({ isOpen: false, order: null });

  // Toast feedback state
  const [toasts, setToasts] = useState([]);

  // Toast helper
  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // One warning per storage key, so a persistently failing write cannot spam toasts
  const warnedKeys = useRef(new Set());
  const reportPersistFailure = (key, label) => {
    if (warnedKeys.current.has(key)) return;
    warnedKeys.current.add(key);
    addToast(`Could not save ${label} — changes will be lost when you reload.`, 'error');
  };

  // Report restore failures once the toast system is mounted
  useEffect(() => {
    const failed = restoreErrors.current;
    restoreErrors.current = [];
    if (failed.length > 0) {
      addToast(`Could not restore ${failed.join(', ')} — defaults loaded instead.`, 'warning');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save to local storage on updates
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (writeRaw('theme', theme)) reportPersistFailure('theme', 'your theme preference');
  }, [theme]);

  useEffect(() => {
    if (writeJSON('products', products)) reportPersistFailure('products', 'product changes');
  }, [products]);

  useEffect(() => {
    if (writeJSON('orders', orders)) reportPersistFailure('orders', 'order changes');
  }, [orders]);

  useEffect(() => {
    if (writeJSON('dashboard_widgets', widgets)) reportPersistFailure('dashboard_widgets', 'your dashboard layout');
  }, [widgets]);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Toggle Theme
  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
    addToast(`Switched to ${theme === 'dark' ? 'Light' : 'Dark'} mode`, 'info');
  };

  const stockStatus = (stock, minStockLevel) =>
    stock <= 0 ? 'Out of Stock' : (stock <= (minStockLevel || 10) ? 'Low Stock' : 'In Stock');

  // CRUD for Products
  const addProduct = (newProd) => {
    if (!newProd || typeof newProd.name !== 'string' || !newProd.name) {
      throw new Error('A product name is required');
    }
    const created = {
      ...newProd,
      id: `PROD-${Date.now().toString(36).toUpperCase()}`,
      rating: 5.0,
      salesCount: 0,
      status: stockStatus(newProd.stock, newProd.minStockLevel)
    };
    setProducts(prev => [created, ...prev]);
    addToast(`Product "${created.name}" created successfully!`, 'success');
  };

  const updateProduct = (updatedProd) => {
    if (!updatedProd || !updatedProd.id) {
      throw new Error('Cannot update a product without an id');
    }
    if (!products.some(p => p.id === updatedProd.id)) {
      throw new Error(`Product ${updatedProd.id} no longer exists`);
    }
    const finalProd = { ...updatedProd, status: stockStatus(updatedProd.stock, updatedProd.minStockLevel) };
    setProducts(prev => prev.map(p => p.id === finalProd.id ? finalProd : p));
    addToast(`Updated "${finalProd.name}"`, 'success');
  };

  const deleteProduct = (productId) => {
    const target = products.find(p => p.id === productId);
    if (!target) {
      throw new Error(`Product ${productId} no longer exists`);
    }
    setProducts(prev => prev.filter(p => p.id !== productId));
    addToast(`Deleted product "${target.name || productId}"`, 'warning');
  };

  // Order Status update
  const updateOrderStatus = (orderId, newStatus) => {
    if (!orders.some(o => o.id === orderId)) {
      throw new Error(`Order ${orderId} no longer exists`);
    }
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
