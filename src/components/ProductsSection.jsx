import React, { useState } from 'react';
import { Plus, Edit2, Trash2, AlertCircle, PackageCheck, Search, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ProductsSection() {
  const { 
    products, 
    searchQuery, 
    setSearchQuery, 
    deleteProduct, 
    setProductModal,
    updateProduct
  } = useApp();

  const [categoryFilter, setCategoryFilter] = useState('All');
  const [stockFilter, setStockFilter] = useState('All');

  // Categories list
  const categories = ['All', ...new Set(products.map(p => p.category))];

  // Filter products by global search + section filters
  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesStock = stockFilter === 'All' || p.status === stockFilter;

    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleStockQuickChange = (product, delta) => {
    const newStock = Math.max(0, product.stock + delta);
    updateProduct({ ...product, stock: newStock });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="section-header">
        <div>
          <h1 className="section-title">Product & Inventory Management</h1>
          <p className="section-subtitle">Manage catalog items, monitor real-time stock levels, and update prices.</p>
        </div>
        <button 
          className="btn-primary"
          onClick={() => setProductModal({ isOpen: true, product: null })}
        >
          <Plus size={18} />
          <span>Add New Product</span>
        </button>
      </div>

      <div className="table-card">
        {/* Filter Controls */}
        <div className="table-controls">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', flex: 1 }}>
            <div className="search-box" style={{ width: '260px' }}>
              <Search size={16} className="text-muted" />
              <input 
                type="text" 
                placeholder="Filter by name, SKU..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={16} className="text-muted" />
              <select 
                className="select-filter"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map((c, i) => (
                  <option key={i} value={c}>Category: {c}</option>
                ))}
              </select>
            </div>

            <select 
              className="select-filter"
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
            >
              <option value="All">Stock Status: All</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
            Showing <strong>{filteredProducts.length}</strong> of {products.length} products
          </div>
        </div>

        {/* Products Table */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Cost</th>
                <th>Stock Level</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No products matched your search filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div className="product-cell">
                        <img src={p.image} alt={p.name} className="product-img" />
                        <div>
                          <div style={{ fontWeight: '700' }}>{p.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>SKU: {p.sku} | Rating: ★ {p.rating}</div>
                        </div>
                      </div>
                    </td>
                    <td>{p.category}</td>
                    <td><strong>${p.price.toFixed(2)}</strong></td>
                    <td style={{ color: 'var(--text-muted)' }}>${p.cost ? p.cost.toFixed(2) : '-'}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button 
                          style={{
                            width: '24px', height: '24px', borderRadius: '4px',
                            border: '1px solid var(--border-color)', background: 'var(--bg-secondary)',
                            color: 'var(--text-main)', cursor: 'pointer'
                          }}
                          onClick={() => handleStockQuickChange(p, -1)}
                        >
                          -
                        </button>
                        <span style={{ fontWeight: '700', minWidth: '24px', textAlign: 'center' }}>
                          {p.stock}
                        </span>
                        <button 
                          style={{
                            width: '24px', height: '24px', borderRadius: '4px',
                            border: '1px solid var(--border-color)', background: 'var(--bg-secondary)',
                            color: 'var(--text-main)', cursor: 'pointer'
                          }}
                          onClick={() => handleStockQuickChange(p, 1)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>
                      <span className={`badge-status ${p.status.toLowerCase().replace(/\s+/g, '-')}`}>
                        {p.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button 
                          className="btn-icon"
                          style={{ width: '34px', height: '34px' }}
                          title="Edit Product Details"
                          onClick={() => setProductModal({ isOpen: true, product: p })}
                        >
                          <Edit2 size={15} />
                        </button>
                        <button 
                          className="btn-icon"
                          style={{ width: '34px', height: '34px', color: 'var(--danger)' }}
                          title="Delete Product"
                          onClick={() => {
                            if (window.confirm(`Delete product "${p.name}"?`)) {
                              deleteProduct(p.id);
                            }
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
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
