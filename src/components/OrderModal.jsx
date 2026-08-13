import React from 'react';
import { X, MapPin, CreditCard, Calendar, User, PackageCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function OrderModal() {
  const { orderModal, setOrderModal, updateOrderStatus } = useApp();
  const { isOpen, order } = orderModal;

  if (!isOpen || !order) return null;

  return (
    <div className="modal-overlay" onClick={() => setOrderModal({ isOpen: false, order: null })}>
      <div className="modal-content" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Order Details – {order.id}</h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Placed on {new Date(order.date).toLocaleString()}
            </span>
          </div>
          <button 
            className="btn-icon" 
            style={{ width: '32px', height: '32px' }}
            onClick={() => setOrderModal({ isOpen: false, order: null })}
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Status & Update */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem',
            backgroundColor: 'var(--bg-primary)',
            borderRadius: '12px',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PackageCheck size={18} className="text-muted" />
              <span style={{ fontSize: '0.88rem', fontWeight: '700' }}>Current Status:</span>
              <span className={`badge-status ${order.status.toLowerCase().replace(' ', '-')}`}>
                {order.status}
              </span>
            </div>

            <select 
              value={order.status}
              onChange={(e) => {
                updateOrderStatus(order.id, e.target.value);
                setOrderModal({ isOpen: true, order: { ...order, status: e.target.value } });
              }}
              className="select-filter"
            >
              <option value="Pending">Set Pending</option>
              <option value="Processing">Set Processing</option>
              <option value="Shipped">Set Shipped</option>
              <option value="Delivered">Set Delivered</option>
              <option value="Cancelled">Set Cancelled</option>
            </select>
          </div>

          {/* Customer & Address Details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ padding: '0.9rem', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.4rem' }}>
                <User size={14} />
                CUSTOMER
              </div>
              <div style={{ fontWeight: '700' }}>{order.customer}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.email}</div>
            </div>

            <div style={{ padding: '0.9rem', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.4rem' }}>
                <CreditCard size={14} />
                PAYMENT METHOD
              </div>
              <div style={{ fontWeight: '700' }}>{order.paymentMethod}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--success)' }}>Payment Confirmed</div>
            </div>
          </div>

          <div style={{ padding: '0.9rem', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.4rem' }}>
              <MapPin size={14} />
              SHIPPING ADDRESS
            </div>
            <div style={{ fontWeight: '600', fontSize: '0.88rem' }}>{order.shippingAddress || 'N/A'}</div>
          </div>

          {/* Order Items Table */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.6rem' }}>Items Breakdown</h4>
            <div style={{ border: '1px solid var(--border-color)', borderRadius: '10px', overflow: 'hidden' }}>
              <table>
                <thead>
                  <tr>
                    <th>Item Description</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items && order.items.map((item, idx) => (
                    <tr key={idx}>
                      <td><strong>{item.name}</strong></td>
                      <td>{item.quantity}</td>
                      <td>${item.price.toFixed(2)}</td>
                      <td><strong>${(item.quantity * item.price).toFixed(2)}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Total Summary */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', fontSize: '1.1rem', fontWeight: '800' }}>
            <span>Order Total:</span>
            <span style={{ color: 'var(--accent-primary)' }}>${order.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="modal-footer">
          <button 
            className="btn-secondary"
            onClick={() => setOrderModal({ isOpen: false, order: null })}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
