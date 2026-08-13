import React, { useState, useEffect } from 'react';
import { X, UploadCloud } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ProductModal() {
  const { productModal, setProductModal, addProduct, updateProduct } = useApp();
  const { isOpen, product } = productModal;

  const isEditing = !!product;

  const [formData, setFormData] = useState({
    name: '',
    category: 'Electronics',
    price: '',
    cost: '',
    stock: '',
    minStockLevel: '10',
    sku: '',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=80'
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category: product.category || 'Electronics',
        price: product.price ? String(product.price) : '',
        cost: product.cost ? String(product.cost) : '',
        stock: product.stock !== undefined ? String(product.stock) : '',
        minStockLevel: product.minStockLevel ? String(product.minStockLevel) : '10',
        sku: product.sku || '',
        image: product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=80'
      });
    } else {
      setFormData({
        name: '',
        category: 'Electronics',
        price: '',
        cost: '',
        stock: '',
        minStockLevel: '10',
        sku: '',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=80'
      });
    }
  }, [product]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      cost: parseFloat(formData.cost) || 0,
      stock: parseInt(formData.stock, 10) || 0,
      minStockLevel: parseInt(formData.minStockLevel, 10) || 10,
    };

    if (isEditing) {
      updateProduct({ ...product, ...payload });
    } else {
      addProduct(payload);
    }

    setProductModal({ isOpen: false, product: null });
  };

  return (
    <div className="modal-overlay" onClick={() => setProductModal({ isOpen: false, product: null })}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{isEditing ? 'Edit Product Details' : 'Add New Product'}</h2>
          <button 
            className="btn-icon" 
            style={{ width: '32px', height: '32px' }}
            onClick={() => setProductModal({ isOpen: false, product: null })}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Product Name</label>
              <input 
                type="text" 
                required 
                placeholder="e.g. Ergonomic Wireless Mouse"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Computers">Computers</option>
                  <option value="Home & Living">Home & Living</option>
                  <option value="Fashion">Fashion</option>
                </select>
              </div>

              <div className="form-group">
                <label>SKU (Stock Keeping Unit)</label>
                <input 
                  type="text" 
                  required 
                  placeholder="ELEC-1001"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Retail Price ($)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  required 
                  placeholder="99.99"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Unit Cost ($)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  placeholder="45.00"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Current Stock Units</label>
                <input 
                  type="number" 
                  required 
                  placeholder="25"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Low Stock Warning Threshold</label>
                <input 
                  type="number" 
                  placeholder="10"
                  value={formData.minStockLevel}
                  onChange={(e) => setFormData({ ...formData, minStockLevel: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Image URL</label>
              <input 
                type="text" 
                placeholder="https://..."
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              />
              {formData.image && (
                <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img src={formData.image} alt="Preview" style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Image preview active</span>
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button 
              type="button" 
              className="btn-secondary"
              onClick={() => setProductModal({ isOpen: false, product: null })}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {isEditing ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
