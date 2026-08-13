import React, { useState, useRef, useEffect } from 'react';
import { Search, Sun, Moon, Bell, Download, Plus, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { exportToCSV } from '../utils/csvExporter';

export default function Header() {
  const {
    theme, toggleTheme,
    searchQuery, setSearchQuery,
    dateRange, setDateRange,
    lowStockProducts, products, orders,
    activeTab, setProductModal, addToast,
  } = useApp();

  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef(null);
  const searchRef = useRef(null);

  // Close notif when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // ⌘K shortcut to focus search
  useEffect(() => {
    function handler(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    }
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  function handleExport() {
    try {
      if (activeTab === 'products') {
        exportToCSV(products.map(p => ({
          ID: p.id, Name: p.name, Category: p.category,
          Price: p.price, Stock: p.stock, Status: p.status
        })), 'inventory.csv');
      } else if (activeTab === 'orders') {
        exportToCSV(orders.map(o => ({
          ID: o.id, Customer: o.customer, Total: o.total,
          Status: o.status, Date: o.date
        })), 'orders.csv');
      } else {
        exportToCSV(products.map(p => ({
          ID: p.id, Name: p.name, Stock: p.stock, Status: p.status
        })), 'overview.csv');
      }
      addToast('Export downloaded', 'success');
    } catch (err) {
      console.error('CSV export failed:', err);
      addToast(`Export failed: ${err.message}`, 'error');
    }
  }

  return (
    <header className="header">
      {/* Search */}
      <div className="search-wrap">
        <Search size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
        <input
          ref={searchRef}
          type="text"
          placeholder="Search anything..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        {searchQuery ? (
          <button
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}
            onClick={() => setSearchQuery('')}
          >
            <X size={13} />
          </button>
        ) : (
          <span className="search-kbd">⌘K</span>
        )}
      </div>

      {/* Right actions */}
      <div className="header-right">
        <select
          className="select-filter"
          value={dateRange}
          onChange={e => setDateRange(e.target.value)}
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="ytd">Year to Date</option>
        </select>

        <button className="btn btn-secondary btn-sm" onClick={handleExport} title="Export CSV">
          <Download size={15} />
          Export
        </button>

        <button
          className="btn btn-primary btn-sm"
          onClick={() => setProductModal({ isOpen: true, product: null })}
        >
          <Plus size={15} />
          Add Product
        </button>

        <button className="btn btn-icon" onClick={toggleTheme} title="Toggle theme">
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Notifications */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            className="btn btn-icon notif-btn"
            onClick={() => setShowNotif(v => !v)}
            title="Inventory alerts"
          >
            <Bell size={16} />
            {lowStockProducts.length > 0 && <span className="notif-dot" />}
          </button>

          {showNotif && (
            <div className="notif-popover">
              <div className="notif-header">
                <span>Inventory Alerts ({lowStockProducts.length})</span>
                <button
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}
                  onClick={() => setShowNotif(false)}
                >
                  <X size={14} />
                </button>
              </div>
              {lowStockProducts.length === 0 ? (
                <div className="notif-empty">All inventory levels are optimal ✓</div>
              ) : (
                <div className="notif-list">
                  {lowStockProducts.map(p => (
                    <div key={p.id} className={`notif-item ${p.stock === 0 ? 'danger' : 'warning'}`}>
                      <div className="notif-item-name">{p.name}</div>
                      <div className="notif-item-meta">
                        <span style={{ color: p.stock === 0 ? 'var(--danger)' : 'var(--warning)', fontWeight: 700 }}>
                          {p.status}
                        </span>
                        {' '}· {p.stock} units remaining
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
