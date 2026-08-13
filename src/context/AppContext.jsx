import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_CUSTOMERS } from '../utils/mockData';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  // Navigation tab
  const [activeTab, setActiveTab] = useState('overview');

  // Global search & filters
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('7d');

  // Data states with LocalStorage persistence
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('products');
      const parsed = saved ? JSON.parse(saved) : null;
      return (Array.isArray(parsed) && parsed.length > 0) ? parsed : INITIAL_PRODUCTS;
    } catch (e) {
      return INITIAL_PRODUCTS;
    }
  });

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('orders');
      const parsed = saved ? JSON.parse(saved) : null;
      return (Array.isArray(parsed) && parsed.length > 0) ? parsed : INITIAL_ORDERS;
    } catch (e) {
      return INITIAL_ORDERS;
    }
  });

  const [customers] = useState(INITIAL_CUSTOMERS);

  // Drag and drop widget order on overview
  const [widgets, setWidgets] = useState(() => {
    try {
      const saved = localStorage.getItem('dashboard_widgets');
      const parsed = saved ? JSON.parse(saved) : null;
      return (Array.isArray(parsed) && parsed.length > 0) ? parsed : ['kpis', 'salesChart', 'recentOrders', 'inventoryAlerts', 'categoryBreakdown'];
    } catch (e) {
      return ['kpis', 'salesChart', 'recentOrders', 'inventoryAlerts', 'categoryBreakdown'];
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
    const created = {
      ...newProd,
      id: `PROD-${Date.now().toString().slice(-4)}`,
      rating: 5.0,
      salesCount: 0,
      status: newProd.stock <= 0 ? 'Out of Stock' : (newProd.stock <= (newProd.minStockLevel || 10) ? 'Low Stock' : 'In Stock')
    };
    setProducts(prev => [created, ...prev]);
    addToast(`Product "${created.name}" created successfully!`, 'success');
  };

  const updateProduct = (updatedProd) => {
    const computedStatus = updatedProd.stock <= 0 ? 'Out of Stock' : (updatedProd.stock <= (updatedProd.minStockLevel || 10) ? 'Low Stock' : 'In Stock');
    const finalProd = { ...updatedProd, status: computedStatus };
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
