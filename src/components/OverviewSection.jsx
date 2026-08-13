import React, { useState } from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Package, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  GripVertical,
  Eye,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SALES_TRENDS, CATEGORY_BREAKDOWN } from '../utils/mockData';

export default function OverviewSection() {
  const { 
    products, 
    orders, 
    customers, 
    dateRange, 
    lowStockProducts,
    setActiveTab,
    setOrderModal,
    widgets,
    setWidgets
  } = useApp();

  const [draggedWidget, setDraggedWidget] = useState(null);

  // Compute live KPIs based on state
  const totalRevenue = orders.reduce((sum, o) => o.status !== 'Cancelled' ? sum + o.total : sum, 0);
  const totalOrders = orders.length;
  const totalCustomers = customers.length;
  const activeProductsCount = products.filter(p => p.stock > 0).length;

  const currentChartData = SALES_TRENDS[dateRange] || SALES_TRENDS['7d'];
  const maxRevenueInChart = Math.max(...currentChartData.map(d => d.revenue));

  // Drag and drop handlers for dashboard widgets
  const handleDragStart = (e, index) => {
    setDraggedWidget(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedWidget === null || draggedWidget === index) return;
    
    const updated = [...widgets];
    const draggedItem = updated[draggedWidget];
    updated.splice(draggedWidget, 1);
    updated.splice(index, 0, draggedItem);
    setDraggedWidget(index);
    setWidgets(updated);
  };

  const renderWidgetContent = (widgetId) => {
    switch (widgetId) {
      case 'kpis':
        return (
          <div className="kpi-grid">
            <div className="kpi-card">
              <div className="kpi-top">
                <span className="kpi-label">Total Revenue</span>
                <div className="kpi-icon" style={{ backgroundColor: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-primary)' }}>
                  <DollarSign size={22} />
                </div>
              </div>
              <div className="kpi-value">${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
              <div className="kpi-trend up">
                <TrendingUp size={14} />
                <span>+14.8% vs last period</span>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-top">
                <span className="kpi-label">Total Orders</span>
                <div className="kpi-icon" style={{ backgroundColor: 'rgba(6, 182, 212, 0.15)', color: 'var(--info)' }}>
                  <ShoppingBag size={22} />
                </div>
              </div>
              <div className="kpi-value">{totalOrders}</div>
              <div className="kpi-trend up">
                <TrendingUp size={14} />
                <span>+8.2% vs last period</span>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-top">
                <span className="kpi-label">Total Customers</span>
                <div className="kpi-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)' }}>
                  <Users size={22} />
                </div>
              </div>
              <div className="kpi-value">{totalCustomers}</div>
              <div className="kpi-trend up">
                <TrendingUp size={14} />
                <span>+12.4% new signups</span>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-top">
                <span className="kpi-label">In-Stock Products</span>
                <div className="kpi-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: 'var(--warning)' }}>
                  <Package size={22} />
                </div>
              </div>
              <div className="kpi-value">{activeProductsCount} / {products.length}</div>
              <div className={`kpi-trend ${lowStockProducts.length > 0 ? 'down' : 'up'}`}>
                {lowStockProducts.length > 0 ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
                <span>{lowStockProducts.length} low stock warnings</span>
              </div>
            </div>
          </div>
        );

      case 'salesChart':
        return (
          <div className="widget-card">
            <div className="widget-header">
              <div className="widget-title">
                <GripVertical size={18} className="drag-handle" />
                <span>Revenue & Sales Overview ({dateRange.toUpperCase()})</span>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Drag widget to reorder</span>
            </div>

            <div className="chart-container">
              {currentChartData.map((d, i) => {
                const heightPercent = Math.max(15, (d.revenue / maxRevenueInChart) * 100);
                return (
                  <div key={i} className="chart-bar-wrapper">
                    <div className="chart-tooltip">
                      ${d.revenue.toLocaleString()} ({d.orders} orders)
                    </div>
                    <div className="chart-bar" style={{ height: `${heightPercent}%` }}></div>
                    <span className="chart-label">{d.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'inventoryAlerts':
        if (lowStockProducts.length === 0) return null;
        return (
          <div className="alert-banner">
            <div className="alert-info">
              <AlertTriangle size={22} />
              <span>
                Attention Required: <strong>{lowStockProducts.length} product(s)</strong> are currently low or out of stock!
              </span>
            </div>
            <button className="btn-secondary" onClick={() => setActiveTab('products')}>
              Manage Stock
              <ArrowRight size={16} />
            </button>
          </div>
        );

      case 'recentOrders':
        return (
          <div className="widget-card">
            <div className="widget-header">
              <div className="widget-title">
                <GripVertical size={18} className="drag-handle" />
                <span>Recent Customer Orders</span>
              </div>
              <button 
                className="btn-secondary" 
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.82rem' }}
                onClick={() => setActiveTab('orders')}
              >
                View All
              </button>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 4).map(o => (
                    <tr key={o.id}>
                      <td><strong>{o.id}</strong></td>
                      <td>{o.customer}</td>
                      <td>{new Date(o.date).toLocaleDateString()}</td>
                      <td>{o.itemsCount} item(s)</td>
                      <td><strong>${o.total.toFixed(2)}</strong></td>
                      <td>
                        <span className={`badge-status ${o.status.toLowerCase().replace(' ', '-')}`}>
                          {o.status}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn-icon" 
                          style={{ width: '32px', height: '32px' }}
                          onClick={() => setOrderModal({ isOpen: true, order: o })}
                        >
                          <Eye size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'categoryBreakdown':
        return (
          <div className="widget-card">
            <div className="widget-header">
              <div className="widget-title">
                <GripVertical size={18} className="drag-handle" />
                <span>Sales Share by Product Category</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
              {CATEGORY_BREAKDOWN.map((cat, idx) => (
                <div key={idx} className="category-item">
                  <div className="category-meta">
                    <span>{cat.category}</span>
                    <span style={{ color: cat.color }}>{cat.percentage}% (${cat.revenue.toLocaleString()})</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div 
                      className="progress-bar-fill" 
                      style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="section-header">
        <div>
          <h1 className="section-title">Dashboard Overview</h1>
          <p className="section-subtitle">Real-time performance indicators and operational alerts.</p>
        </div>
      </div>

      {widgets.map((widgetId, index) => (
        <div
          key={widgetId}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={(e) => handleDragOver(e, index)}
          className={`drag-wrapper ${draggedWidget === index ? 'dragging' : ''}`}
        >
          {renderWidgetContent(widgetId)}
        </div>
      ))}
    </div>
  );
}
