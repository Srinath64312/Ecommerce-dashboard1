import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const CATEGORIES = ['Electronics', 'Computers', 'Home & Living', 'Fashion'];

/**
 * Parse a form field into a non-negative number.
 * Returns null for invalid input so bad values surface instead of becoming 0.
 */
function parseNumber(raw, { required = false, integer = false, fallback = 0 } = {}) {
  const trimmed = String(raw ?? '').trim();
  if (trimmed === '') return required ? null : fallback;

  const parsed = integer ? Number(trimmed) : parseFloat(trimmed);
  if (!Number.isFinite(parsed) || parsed < 0) return null;
  if (integer && !Number.isInteger(parsed)) return null;
  return parsed;
}

export default function ProductModal() {
  const { productModal, setProductModal, addProduct, updateProduct, addToast } = useApp();
  const { isOpen, product } = productModal;
  const isEditing = !!product;

  const blankForm = {
    name: '', category: 'Electronics', price: '', cost: '',
    stock: '', minStockLevel: '10', sku: '',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=80'
  };

  const [form, setForm] = useState(blankForm);

  useEffect(() => {
    setForm(product ? {
      name: product.name || '',
      category: product.category || 'Electronics',
      price: product.price != null ? String(product.price) : '',
      cost: product.cost != null ? String(product.cost) : '',
      stock: product.stock != null ? String(product.stock) : '',
      minStockLevel: product.minStockLevel != null ? String(product.minStockLevel) : '10',
      sku: product.sku || '',
      image: product.image || blankForm.image,
    } : blankForm);
  }, [product]);

  if (!isOpen) return null;

  function set(field, val) { setForm(f => ({ ...f, [field]: val })); }

  function handleSubmit(e) {
    e.preventDefault();

    const price = parseNumber(form.price, { required: true });
    const cost = parseNumber(form.cost, { fallback: 0 });
    const stock = parseNumber(form.stock, { required: true, integer: true });
    const minStockLevel = parseNumber(form.minStockLevel, { fallback: 10, integer: true });

    const errors = [];
    if (!form.name.trim()) errors.push('Product name is required');
    if (!form.sku.trim()) errors.push('SKU is required');
    if (price === null) errors.push('Retail price must be a number of 0 or more');
    if (cost === null) errors.push('Unit cost must be a number of 0 or more');
    if (stock === null) errors.push('Stock units must be a whole number of 0 or more');
    if (minStockLevel === null) errors.push('Low stock threshold must be a whole number of 0 or more');

    if (errors.length > 0) {
      addToast(errors.join('. '), 'error');
      return;
    }

    const payload = {
      ...form,
      name: form.name.trim(),
      sku: form.sku.trim(),
      price,
      cost,
      stock,
      minStockLevel,
    };

    try {
      if (isEditing) {
        updateProduct({ ...product, ...payload });
      } else {
        addProduct(payload);
      }
    } catch (err) {
      console.error('Failed to save product:', err);
      addToast(`Could not save product: ${err.message}`, 'error');
      return;
    }

    setProductModal({ isOpen: false, product: null });
  }

  function close() { setProductModal({ isOpen: false, product: null }); }

  return (
    <div className="modal-overlay" onClick={close}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-title">{isEditing ? 'Edit Product' : 'New Product'}</div>
            <div className="modal-sub">{isEditing ? `Updating ${product.name}` : 'Add a new item to your catalogue'}</div>
          </div>
          <button className="btn btn-icon" style={{ width: 32, height: 32 }} onClick={close}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Product Name *</label>
              <input className="form-input" required placeholder="e.g. Wireless Ergonomic Mouse"
                value={form.name} onChange={e => set('name', e.target.value)} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" value={form.category} onChange={e => set('category', e.target.value)}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">SKU *</label>
                <input className="form-input" required placeholder="ELEC-1001"
                  value={form.sku} onChange={e => set('sku', e.target.value)} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Retail Price ($) *</label>
                <input className="form-input" type="number" step="0.01" required placeholder="99.99"
                  value={form.price} onChange={e => set('price', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Unit Cost ($)</label>
                <input className="form-input" type="number" step="0.01" placeholder="45.00"
                  value={form.cost} onChange={e => set('cost', e.target.value)} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Stock Units *</label>
                <input className="form-input" type="number" required placeholder="25"
                  value={form.stock} onChange={e => set('stock', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Low Stock Threshold</label>
                <input className="form-input" type="number" placeholder="10"
                  value={form.minStockLevel} onChange={e => set('minStockLevel', e.target.value)} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Product Image URL</label>
              <input className="form-input" type="url" placeholder="https://..."
                value={form.image} onChange={e => set('image', e.target.value)} />
              {form.image && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <img src={form.image} alt="Preview"
                    style={{ width: 52, height: 52, borderRadius: 'var(--radius-md)', objectFit: 'cover', border: '1px solid var(--border)' }}
                    onError={e => e.target.style.display = 'none'}
                  />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Image preview</span>
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={close}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              {isEditing ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
