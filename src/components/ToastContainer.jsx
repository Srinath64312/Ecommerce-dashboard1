import React from 'react';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();
  if (!toasts.length) return null;

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          {t.type === 'success' && <CheckCircle2 size={16} style={{ color: 'var(--success)', flexShrink: 0 }} />}
          {t.type === 'warning' && <AlertTriangle size={16} style={{ color: 'var(--warning)', flexShrink: 0 }} />}
          {t.type === 'error'   && <XCircle       size={16} style={{ color: 'var(--danger)',  flexShrink: 0 }} />}
          {t.type === 'info'    && <Info          size={16} style={{ color: 'var(--accent)',  flexShrink: 0 }} />}
          <span style={{ flex: 1, fontSize: '0.875rem' }}>{t.message}</span>
          <button className="toast-close" onClick={() => removeToast(t.id)}>
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
