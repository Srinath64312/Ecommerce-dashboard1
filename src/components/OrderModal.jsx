import React from 'react';
import { X, MapPin, CreditCard, User, CheckCircle, Clock, Package, Truck, XCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const TIMELINE_STEPS = [
  { key: 'Pending',    label: 'Pending',    icon: Clock },
  { key: 'Processing', label: 'Processing', icon: Package },
  { key: 'Shipped',    label: 'Shipped',    icon: Truck },
  { key: 'Delivered',  label: 'Delivered',  icon: CheckCircle },
];

export default function OrderModal() {
  const { orderModal, setOrderModal, updateOrderStatus, addToast } = useApp();
  const { isOpen, order } = orderModal;
  if (!isOpen || !order) return null;

  const isCancelled = order.status === 'Cancelled';
  const currentIdx  = TIMELINE_STEPS.findIndex(s => s.key === order.status);

  function close() { setOrderModal({ isOpen: false, order: null }); }

  function handleStatusChange(newStatus) {
    try {
      updateOrderStatus(order.id, newStatus);
    } catch (err) {
      console.error('Failed to update order status:', err);
      addToast(`Could not update order: ${err.message}`, 'error');
      return;
    }
    setOrderModal({ isOpen: true, order: { ...order, status: newStatus } });
  }

  return (
    <div className="modal-overlay" onClick={close}>
      <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <div className="modal-title">Order {order.id}</div>
            <div className="modal-sub">
              Placed {new Date(order.date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
              {' · '}{order.itemsCount} item(s)
            </div>
          </div>
          <button className="btn btn-icon" style={{ width: 32, height: 32 }} onClick={close}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          {/* Status Timeline */}
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              Order Progress
            </div>

            {isCancelled ? (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.625rem',
                background: 'var(--danger-bg)', border: '1px solid hsla(0,84%,65%,0.25)',
                borderRadius: 'var(--radius-md)', padding: '0.875rem 1rem',
                color: 'var(--danger)', fontWeight: 700
              }}>
                <XCircle size={18} /> This order has been cancelled
              </div>
            ) : (
              <div className="order-timeline">
                {TIMELINE_STEPS.map((step, idx) => {
                  const Icon = step.icon;
                  const done   = idx < currentIdx;
                  const active = idx === currentIdx;
                  return (
                    <div key={step.key} className={`timeline-step${done ? ' done' : active ? ' active' : ''}`}>
                      {/* Connector (not on first step) */}
                      {idx > 0 && (
                        <div className={`timeline-connector${done || active ? ' done' : ''}`}
                          style={{ left: '-50%' }} />
                      )}
                      <div className={`timeline-dot${done ? ' done' : active ? ' active' : ''}`}>
                        <Icon size={14} />
                      </div>
                      <div className="timeline-label">{step.label}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Status update select */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'var(--bg-input)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)', padding: '0.875rem 1rem'
          }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Update Status
            </span>
            <select
              value={order.status}
              onChange={e => handleStatusChange(e.target.value)}
              className="select-filter"
              style={{ minWidth: 160 }}
            >
              {['Pending','Processing','Shipped','Delivered','Cancelled'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Info grid */}
          <div className="info-grid">
            <div className="info-box">
              <div className="info-box-label"><User size={12} /> Customer</div>
              <div className="info-box-val">{order.customer}</div>
              <div className="info-box-sub">{order.email}</div>
            </div>
            <div className="info-box">
              <div className="info-box-label"><CreditCard size={12} /> Payment</div>
              <div className="info-box-val">{order.paymentMethod}</div>
              <div className="info-box-sub" style={{ color: 'var(--success)' }}>Confirmed ✓</div>
            </div>
          </div>

          <div className="info-box">
            <div className="info-box-label"><MapPin size={12} /> Shipping Address</div>
            <div className="info-box-val">{order.shippingAddress || 'Not provided'}</div>
          </div>

          {/* Items table */}
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', marginBottom: '0.625rem' }}>
              Items
            </div>
            <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              <table>
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(order.items || []).map((item, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 600 }}>{item.name}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{item.quantity}</td>
                      <td className="font-mono">${item.price.toFixed(2)}</td>
                      <td className="font-mono font-bold">${(item.quantity * item.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Total */}
          <div style={{
            display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.75rem',
            paddingTop: '0.5rem', borderTop: '1px solid var(--border)', marginTop: '0.25rem'
          }}>
            <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Order Total</span>
            <span className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent)' }}>
              ${order.total.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={close}>Close</button>
        </div>
      </div>
    </div>
  );
}
