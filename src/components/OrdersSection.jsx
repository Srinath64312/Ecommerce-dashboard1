import React, { useState } from 'react';
import { Search, Eye, Filter, Download } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { exportToCSV } from '../utils/csvExporter';

export default function OrdersSection() {
  const { orders, searchQuery, setSearchQuery, updateOrderStatus, setOrderModal } = useApp();
  const [statusFilter, setStatusFilter] = useState('All');

  const statuses = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="section-header">
        <div>
          <h1 className="section-title">Order Management</h1>
          <p className="section-subtitle">Process customer orders, update shipping statuses, and review full order details.</p>
        </div>
        <button 
          className="btn-secondary"
          onClick={() => exportToCSV(orders, 'orders_database.csv')}
        >
          <Download size={16} />
          <span>Export Orders CSV</span>
        </button>
      </div>

      <div className="table-card">
        {/* Table Filters */}
        <div className="table-controls">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', flex: 1 }}>
            <div className="search-box" style={{ width: '280px' }}>
              <Search size={16} className="text-muted" />
              <input 
                type="text" 
                placeholder="Search order ID, customer name..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={16} className="text-muted" />
              <select 
                className="select-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {statuses.map((s, i) => (
                  <option key={i} value={s}>Status: {s}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
            Total Orders: <strong>{filteredOrders.length}</strong>
          </div>
        </div>

        {/* Orders Table */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date & Time</th>
                <th>Payment</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(o => (
                  <tr key={o.id}>
                    <td><strong>{o.id}</strong></td>
                    <td>
                      <div>
                        <div style={{ fontWeight: '700' }}>{o.customer}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>{o.email}</div>
                      </div>
                    </td>
                    <td>{new Date(o.date).toLocaleString()}</td>
                    <td>{o.paymentMethod}</td>
                    <td><strong style={{ color: 'var(--text-main)' }}>${o.total.toFixed(2)}</strong></td>
                    <td>
                      {/* Inline Status Dropdown */}
                      <select 
                        value={o.status}
                        onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                        className={`badge-status ${o.status.toLowerCase().replace(' ', '-')}`}
                        style={{ border: 'none', cursor: 'pointer', outline: 'none' }}
                      >
                        <option value="Pending" style={{ color: 'var(--text-main)', background: 'var(--bg-secondary)' }}>Pending</option>
                        <option value="Processing" style={{ color: 'var(--text-main)', background: 'var(--bg-secondary)' }}>Processing</option>
                        <option value="Shipped" style={{ color: 'var(--text-main)', background: 'var(--bg-secondary)' }}>Shipped</option>
                        <option value="Delivered" style={{ color: 'var(--text-main)', background: 'var(--bg-secondary)' }}>Delivered</option>
                        <option value="Cancelled" style={{ color: 'var(--text-main)', background: 'var(--bg-secondary)' }}>Cancelled</option>
                      </select>
                    </td>
                    <td>
                      <button 
                        className="btn-icon"
                        style={{ width: '34px', height: '34px' }}
                        title="View Full Order Details"
                        onClick={() => setOrderModal({ isOpen: true, order: o })}
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
