import React, { useState } from 'react';
import { Search, Eye, Download } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { exportToCSV } from '../utils/csvExporter';

const ALL_STATUSES = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

function getStatusBadgeClass(status) {
  switch (status) {
    case 'Delivered':  return 'badge-success';
    case 'Shipped':    return 'badge-info';
    case 'Cancelled':  return 'badge-danger';
    default:           return 'badge-warning';
  }
}

export default function OrdersSection() {
  const { orders, searchQuery, setSearchQuery, updateOrderStatus, setOrderModal } = useApp();
  const [statusTab, setStatusTab] = useState('All');

  const tabCounts = ALL_STATUSES.reduce((acc, s) => {
    acc[s] = s === 'All' ? orders.length : orders.filter(o => o.status === s).length;
    return acc;
  }, {});

  const filtered = orders.filter(o => {
    const q = searchQuery.toLowerCase();
    const matchSearch = o.id.toLowerCase().includes(q) ||
      o.customer.toLowerCase().includes(q) ||
      o.email.toLowerCase().includes(q);
    const matchTab = statusTab === 'All' || o.status === statusTab;
    return matchSearch && matchTab;
  });

  return (
    <div className="section-gap page-fade">
      <div className="section-header">
        <div>
          <h1 className="section-title">Order Management</h1>
          <p className="section-subtitle">Process orders, update statuses, and review customer details.</p>
        </div>
        <button className="btn btn-secondary" onClick={() => exportToCSV(orders, 'orders.csv')}>
          <Download size={15} /> Export CSV
        </button>
      </div>

      <div className="table-card">
        {/* Status tab-bar */}
        <div className="status-tabs">
          {ALL_STATUSES.map(s => (
            <div
              key={s}
              className={`status-tab${statusTab === s ? ' active' : ''}`}
              onClick={() => setStatusTab(s)}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && setStatusTab(s)}
            >
              {s}
              <span className="status-count">{tabCounts[s]}</span>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="table-controls">
          <div className="search-wrap" style={{ width: 280 }}>
            <Search size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search order ID, customer..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <span className="ml-auto" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            {filtered.length} order{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Table */}
        <div className="table-wrap">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><Search size={22} /></div>
              <div className="empty-title">No orders found</div>
              <div className="empty-desc">Try a different status tab or clear your search</div>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Payment</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>View</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(o => (
                  <tr key={o.id}>
                    <td>
                      <span className="font-mono" style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                        {o.id}
                      </span>
                    </td>
                    <td>
                      <div>
                        <div style={{ fontWeight: 700 }}>{o.customer}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{o.email}</div>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
                      {new Date(o.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{o.paymentMethod}</td>
                    <td>
                      <span className="font-mono font-bold">${o.total.toFixed(2)}</span>
                    </td>
                    <td>
                      <select
                        value={o.status}
                        onChange={e => updateOrderStatus(o.id, e.target.value)}
                        className={`status-select badge ${getStatusBadgeClass(o.status)}`}
                      >
                        {['Pending','Processing','Shipped','Delivered','Cancelled'].map(s => (
                          <option key={s} value={s} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button
                        className="btn btn-icon"
                        style={{ width: 30, height: 30 }}
                        title="View order details"
                        onClick={() => setOrderModal({ isOpen: true, order: o })}
                      >
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
