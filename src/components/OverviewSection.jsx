import React, { useState, useEffect } from 'react';
import {
  DollarSign, ShoppingBag, Users, Package,
  TrendingUp, TrendingDown, AlertTriangle,
  GripVertical, ArrowRight, Eye, CheckCircle,
  Clock, Zap, Activity
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SALES_TRENDS, CATEGORY_BREAKDOWN } from '../utils/mockData';

// Animated counter hook
function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setValue(target); clearInterval(timer); }
      else setValue(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return value;
}

// Sparkline SVG
function Sparkline({ data, color }) {
  if (!data || data.length < 2) return null;
  const w = 80, h = 32;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  });
  return (
    <svg width={w} height={h} className="sparkline">
      <polyline
        points={pts.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />
    </svg>
  );
}

// KPI Card with animated counter
function KpiCard({ label, value, prefix = '', suffix = '', trend, trendDir, color, iconBg, icon: Icon, sparkData }) {
  const animated = useCountUp(value, 1000);
  const display = prefix + (value >= 1000 ? animated.toLocaleString() : animated) + suffix;
  return (
    <div className="kpi-card">
      <div className="kpi-top">
        <span className="kpi-label">{label}</span>
        <div className="kpi-icon-wrap" style={{ background: iconBg }}>
          <Icon size={18} style={{ color }} />
        </div>
      </div>
      <div className="kpi-value">{display}</div>
      <div className="kpi-bottom">
        <span className={`kpi-trend ${trendDir}`}>
          {trendDir === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {trend}
        </span>
        <Sparkline data={sparkData} color={color} />
      </div>
    </div>
  );
}

// Bar Chart
function BarChart({ data, dateRange }) {
  const maxRev = Math.max(...data.map(d => d.revenue));
  return (
    <div className="bar-chart">
      {data.map((d, i) => {
        const h = Math.max(8, (d.revenue / maxRev) * 100);
        return (
          <div key={i} className="bar-col">
            <div className="bar-tooltip">
              ${d.revenue.toLocaleString()} · {d.orders} orders
            </div>
            <div
              className="bar-fill bar-primary"
              style={{ height: `${h}%`, animationDelay: `${i * 60}ms` }}
            />
            <span className="bar-label">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// Activity feed mock data
const ACTIVITY_ITEMS = [
  { icon: <ShoppingBag size={14} />, iconBg: 'var(--accent-subtle)', iconColor: 'var(--accent)', text: <><strong>Alex Morgan</strong> placed order ORD-9081 for <strong>$389.49</strong></>, time: '2 min ago' },
  { icon: <AlertTriangle size={14} />, iconBg: 'var(--warning-bg)', iconColor: 'var(--warning)', text: <><strong>Stainless Steel Bottle</strong> is running low — only <strong>5 units</strong> left</>, time: '14 min ago' },
  { icon: <CheckCircle size={14} />, iconBg: 'var(--success-bg)', iconColor: 'var(--success)', text: <>Order <strong>ORD-9082</strong> by Sophia Chen marked as <strong>Processing</strong></>, time: '42 min ago' },
  { icon: <Users size={14} />, iconBg: 'hsla(158,64%,52%,0.12)', iconColor: 'var(--success)', text: <><strong>Elena Rostova</strong> registered as a new customer</>, time: '1 hr ago' },
  { icon: <Package size={14} />, iconBg: 'var(--danger-bg)', iconColor: 'var(--danger)', text: <><strong>Minimalist Leather Backpack</strong> is now out of stock</>, time: '3 hr ago' },
];

export default function OverviewSection() {
  const { products, orders, customers, dateRange, lowStockProducts, setActiveTab, setOrderModal, widgets, setWidgets } = useApp();
  const [dragging, setDragging] = useState(null);

  const chartData = SALES_TRENDS[dateRange] || SALES_TRENDS['7d'];
  const totalRevenue = orders.reduce((s, o) => o.status !== 'Cancelled' ? s + o.total : s, 0);
  const inStock = products.filter(p => p.stock > 0).length;

  // Sparklines (just cycle through chartData revenue values)
  const sparkRev   = chartData.map(d => d.revenue);
  const sparkOrd   = chartData.map(d => d.orders);
  const sparkCust  = [120, 145, 130, 160, 188, 175, 200];
  const sparkProd  = products.map(p => p.stock).slice(0, 7);

  function handleDragStart(e, idx) {
    setDragging(idx);
    e.dataTransfer.effectAllowed = 'move';
  }
  function handleDragOver(e, idx) {
    e.preventDefault();
    if (dragging === null || dragging === idx) return;
    const next = [...widgets];
    const item = next.splice(dragging, 1)[0];
    next.splice(idx, 0, item);
    setDragging(idx);
    setWidgets(next);
  }
  function handleDragEnd() { setDragging(null); }

  const renderWidget = (wid) => {
    switch (wid) {
      case 'kpis':
        return (
          <div className="kpi-grid">
            <KpiCard
              label="Total Revenue" value={Math.round(totalRevenue)} prefix="$"
              trend="+14.8% vs last period" trendDir="up"
              color="var(--accent)" iconBg="var(--accent-subtle)" icon={DollarSign}
              sparkData={sparkRev}
            />
            <KpiCard
              label="Total Orders" value={orders.length}
              trend="+8.2% vs last period" trendDir="up"
              color="var(--info)" iconBg="var(--info-bg)" icon={ShoppingBag}
              sparkData={sparkOrd}
            />
            <KpiCard
              label="Customers" value={customers.length}
              trend="+12.4% new signups" trendDir="up"
              color="var(--success)" iconBg="var(--success-bg)" icon={Users}
              sparkData={sparkCust}
            />
            <KpiCard
              label="In-Stock Products" value={inStock} suffix={`/${products.length}`}
              trend={lowStockProducts.length > 0 ? `${lowStockProducts.length} need attention` : 'All levels optimal'}
              trendDir={lowStockProducts.length > 0 ? 'down' : 'up'}
              color="var(--warning)" iconBg="var(--warning-bg)" icon={Package}
              sparkData={sparkProd}
            />
          </div>
        );

      case 'salesChart':
        return (
          <div className="widget-card">
            <div className="widget-header">
              <div className="widget-title">
                <Activity size={16} style={{ color: 'var(--accent)' }} />
                Revenue Overview <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 500 }}>({dateRange.toUpperCase()})</span>
              </div>
              <GripVertical size={16} style={{ color: 'var(--text-muted)', cursor: 'grab' }} />
            </div>
            <div className="widget-body">
              <BarChart data={chartData} />
            </div>
          </div>
        );

      case 'inventoryAlerts':
        if (lowStockProducts.length === 0) return null;
        return (
          <div style={{
            background: 'var(--warning-bg)',
            border: '1px solid hsla(38,92%,60%,0.25)',
            borderRadius: 'var(--radius-lg)',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--warning)', fontWeight: 700 }}>
              <AlertTriangle size={20} />
              <span>
                {lowStockProducts.length} product{lowStockProducts.length > 1 ? 's' : ''} need stock attention
              </span>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('products')}>
              Manage Inventory <ArrowRight size={14} />
            </button>
          </div>
        );

      case 'recentOrders':
        return (
          <div className="widget-card">
            <div className="widget-header">
              <div className="widget-title">
                <ShoppingBag size={16} style={{ color: 'var(--accent)' }} />
                Recent Orders
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setActiveTab('orders')}>
                View all <ArrowRight size={13} />
              </button>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map(o => (
                    <tr key={o.id}>
                      <td><span className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{o.id}</span></td>
                      <td><span style={{ fontWeight: 600 }}>{o.customer}</span></td>
                      <td><span className="font-mono font-bold">${o.total.toFixed(2)}</span></td>
                      <td>
                        <span className={`badge ${
                          o.status === 'Delivered' ? 'badge-success' :
                          o.status === 'Shipped'   ? 'badge-info' :
                          o.status === 'Cancelled' ? 'badge-danger' :
                          'badge-warning'
                        }`}>{o.status}</span>
                      </td>
                      <td>
                        <button className="btn btn-icon" style={{ width: 28, height: 28 }}
                          onClick={() => setOrderModal({ isOpen: true, order: o })}>
                          <Eye size={13} />
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
                <Zap size={16} style={{ color: 'var(--warning)' }} />
                Revenue by Category
              </div>
            </div>
            <div className="widget-body">
              {CATEGORY_BREAKDOWN.map((c, i) => (
                <div key={i} className="cat-item">
                  <div className="cat-meta">
                    <span>{c.category}</span>
                    <span className="cat-pct" style={{ color: c.color }}>{c.percentage}%</span>
                  </div>
                  <div className="cat-bar-bg">
                    <div className="cat-bar-fill" style={{ width: `${c.percentage}%`, background: c.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'activityFeed':
        return (
          <div className="widget-card">
            <div className="widget-header">
              <div className="widget-title">
                <Clock size={16} style={{ color: 'var(--info)' }} />
                Live Activity Feed
              </div>
            </div>
            <div className="widget-body" style={{ padding: '0 1.25rem' }}>
              <div className="activity-list">
                {ACTIVITY_ITEMS.map((item, i) => (
                  <div key={i} className="activity-item">
                    <div className="activity-icon" style={{ background: item.iconBg, color: item.iconColor }}>
                      {item.icon}
                    </div>
                    <div>
                      <div className="activity-text">{item.text}</div>
                      <div className="activity-time">{item.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="section-gap page-fade">
      <div className="section-header">
        <div>
          <h1 className="section-title">Dashboard Overview</h1>
          <p className="section-subtitle">Real-time performance metrics — drag widgets to customise your layout.</p>
        </div>
      </div>

      {widgets.map((wid, idx) => {
        const content = renderWidget(wid);
        if (!content) return null;
        return (
          <div
            key={wid}
            className={`drag-wrapper${dragging === idx ? ' dragging' : ''}`}
            draggable
            onDragStart={e => handleDragStart(e, idx)}
            onDragOver={e => handleDragOver(e, idx)}
            onDragEnd={handleDragEnd}
          >
            {content}
          </div>
        );
      })}
    </div>
  );
}
