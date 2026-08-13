import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast ${toast.type}`}>
          {toast.type === 'success' && <CheckCircle2 size={18} style={{ color: 'var(--success)' }} />}
          {toast.type === 'warning' && <AlertTriangle size={18} style={{ color: 'var(--warning)' }} />}
          {toast.type === 'info' && <Info size={18} style={{ color: 'var(--accent-primary)' }} />}
          
          <span style={{ flex: 1 }}>{toast.message}</span>
          
          <button 
            style={{ background: 'none', border: 'none', color: 'var(--text-subtle)', cursor: 'pointer' }}
            onClick={() => removeToast(toast.id)}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
