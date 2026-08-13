import React, { useState } from 'react';
import { Search, Moon, Sun, Bell, Download, Plus, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { exportToCSV } from '../utils/csvExporter';

export default function Header() {
  const { 
    theme, 
    toggleTheme, 
    searchQuery, 
    setSearchQuery, 
    dateRange, 
    setDateRange,
    lowStockProducts,
    products,
    orders,
    activeTab,
    setProductModal
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);

  const handleExport = () => {
    if (activeTab === 'products') {
      exportToCSV(products, `inventory_report_${dateRange}.csv`);
    } else if (activeTab === 'orders') {
      exportToCSV(orders, `orders_report_${dateRange}.csv`);
    } else {
      // Default overview export
      const summary = products.map(p => ({
        ID: p.id,
        Name: p.name,
        Category: p.category,
        Price: `$${p.price}`,
        Stock: p.stock,
        Status: p.status
      }));
      exportToCSV(summary, `store_overview_${dateRange}.csv`);
    }
  };

  return (
    <header className="header">
      <div className="search-box">
        <Search size={18} className="text-muted" />
        <input 
          type="text" 
          placeholder="Search products, orders, customers..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="header-actions">
        {/* Date Range Selector */}
        <select 
          className="select-filter"
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="ytd">Year to Date (YTD)</option>
        </select>

        {/* CSV Export Button */}
        <button className="btn-secondary" onClick={handleExport} title="Export CSV Data">
          <Download size={16} />
          <span>Export CSV</span>
        </button>

        {/* Quick Add Product Button */}
        <button 
          className="btn-primary"
          onClick={() => setProductModal({ isOpen: true, product: null })}
        >
          <Plus size={16} />
          <span>Add Product</span>
        </button>

        {/* Theme Toggle Button */}
        <button className="btn-icon" onClick={toggleTheme} title="Toggle Dark/Light Mode">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications Popover Toggle */}
        <div style={{ position: 'relative' }}>
          <button 
            className="btn-icon" 
            onClick={() => setShowNotifications(!showNotifications)}
            title="Inventory Alerts & Notifications"
          >
            <Bell size={18} />
            {lowStockProducts.length > 0 && <span className="notification-dot"></span>}
          </button>

          {showNotifications && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '50px',
              width: '320px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '14px',
              boxShadow: 'var(--shadow-lg)',
              padding: '1rem',
              zIndex: 60
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontWeight: '700' }}>
                <span>Notifications ({lowStockProducts.length})</span>
                <span 
                  style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', cursor: 'pointer' }}
                  onClick={() => setShowNotifications(false)}
                >
                  Close
                </span>
              </div>
              {lowStockProducts.length === 0 ? (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  All stock levels are optimal! No warnings.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '240px', overflowY: 'auto' }}>
                  {lowStockProducts.map(p => (
                    <div key={p.id} style={{
                      padding: '0.6rem',
                      backgroundColor: 'var(--bg-primary)',
                      borderRadius: '8px',
                      borderLeft: `4px solid ${p.stock <= 0 ? 'var(--danger)' : 'var(--warning)'}`,
                      fontSize: '0.82rem'
                    }}>
                      <div style={{ fontWeight: '700' }}>{p.name}</div>
                      <div style={{ color: 'var(--text-muted)' }}>
                        Status: <strong style={{ color: p.stock <= 0 ? 'var(--danger)' : 'var(--warning)' }}>{p.status}</strong> ({p.stock} remaining)
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
