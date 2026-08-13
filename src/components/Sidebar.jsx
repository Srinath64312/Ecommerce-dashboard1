import React, { useState } from 'react';
import {
  LayoutDashboard, BarChart3, Package, ShoppingCart,
  Users, Store, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const NAV_ITEMS = [
  { id: 'overview',   label: 'Overview',       icon: LayoutDashboard },
  { id: 'analytics',  label: 'Analytics',      icon: BarChart3 },
  { id: 'products',   label: 'Products',       icon: Package },
  { id: 'orders',     label: 'Orders',         icon: ShoppingCart },
  { id: 'customers',  label: 'Customers',      icon: Users },
];

export default function Sidebar() {
  const { activeTab, setActiveTab, lowStockProducts, sidebarCollapsed, setSidebarCollapsed } = useApp();

  return (
    <aside className={`sidebar${sidebarCollapsed ? ' collapsed' : ''}`}>
      {/* Top: logo + toggle */}
      <div className="sidebar-top">
        <div className="sidebar-logo">
          <div className="logo-icon"><Store size={18} /></div>
          <span className="logo-text">StorePulse</span>
        </div>
        <button
          className="sidebar-toggle"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Nav items */}
      <nav className="nav-section">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          const hasBadge = id === 'products' && lowStockProducts.length > 0;
          return (
            <div
              key={id}
              className={`nav-item${isActive ? ' active' : ''}`}
              onClick={() => setActiveTab(id)}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && setActiveTab(id)}
            >
              <span className="nav-icon"><Icon size={18} /></span>
              <span className="nav-label">{label}</span>
              {hasBadge && (
                <span className="nav-badge">{lowStockProducts.length}</span>
              )}
              {/* Tooltip for collapsed mode */}
              {sidebarCollapsed && (
                <div className="nav-tooltip">
                  {label}
                  {hasBadge && ` (${lowStockProducts.length})`}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
