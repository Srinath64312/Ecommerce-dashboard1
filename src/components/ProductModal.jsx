import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PRODUCT_CATEGORIES as CATEGORIES, sanitizeImageUrl, sanitizeNumber } from '../utils/sanitize';

export default function ProductModal() {
  const { productModal, setProductModal, addProduct, updateProduct } = useApp();
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
    const payload = {
      ...form,
      price: sanitizeNumber(form.price, { max: 1_000_000 }),
      cost: sanitizeNumber(form.cost, { max: 1_000_000 }),
      stock: sanitizeNumber(form.stock, { integer: true, max: 1_000_000 }),
      minStockLevel: sanitizeNumber(form.minStockLevel, { integer: true, max: 1_000_000, fallback: 10 }),
      image: sanitizeImageUrl(form.image),
    };
    if (isEditing) {
      updateProduct({ ...product, ...payload });
    } else {
      addProduct(payload);
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
                <input className="form-input" type="number" step="0.01" min="0" required placeholder="99.99"
                  value={form.price} onChange={e => set('price', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Unit Cost ($)</label>
                <input className="form-input" type="number" step="0.01" min="0" placeholder="45.00"
                  value={form.cost} onChange={e => set('cost', e.target.value)} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Stock Units *</label>
                <input className="form-input" type="number" min="0" step="1" required placeholder="25"
                  value={form.stock} onChange={e => set('stock', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Low Stock Threshold</label>
                <input className="form-input" type="number" min="0" step="1" placeholder="10"
                  value={form.minStockLevel} onChange={e => set('minStockLevel', e.target.value)} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Product Image URL</label>
              <input className="form-input" type="url" placeholder="https://..."
                value={form.image} onChange={e => set('image', e.target.value)} />
              {form.image && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <img src={sanitizeImageUrl(form.image)} alt="Preview" referrerPolicy="no-referrer"
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
