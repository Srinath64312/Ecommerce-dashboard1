import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Filter, LayoutGrid, List } from 'lucide-react';
import { useApp } from '../context/AppContext';

function StockBar({ stock, minStockLevel = 10, maxStock = 100 }) {
  const pct = Math.min(100, (stock / Math.max(stock, minStockLevel * 5, maxStock)) * 100);
  const cls = stock <= 0 ? 'low' : stock <= minStockLevel ? 'medium' : 'full';
  return (
    <div className="stock-bar-wrap">
      <div className="stock-bar-label">
        <span>Stock</span>
        <span style={{ color: cls === 'low' ? 'var(--danger)' : cls === 'medium' ? 'var(--warning)' : 'var(--success)' }}>
          {stock} units
        </span>
      </div>
      <div className="stock-bar-bg">
        <div className={`stock-bar-fill ${cls}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const cls =
    status === 'In Stock'     ? 'badge-success' :
    status === 'Low Stock'    ? 'badge-warning' :
    'badge-danger';
  return <span className={`badge ${cls}`}>{status}</span>;
}

export default function ProductsSection() {
  const { products, searchQuery, setSearchQuery, deleteProduct, setProductModal, updateProduct, addToast } = useApp();
  const [catFilter, setCatFilter] = useState('All');
  const [stockFilter, setStockFilter] = useState('All');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
  const [selected, setSelected] = useState(new Set());

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filtered = products.filter(p => {
    const q = searchQuery.toLowerCase();
    const matchSearch = p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    const matchCat   = catFilter === 'All' || p.category === catFilter;
    const matchStock = stockFilter === 'All' || p.status === stockFilter;
    return matchSearch && matchCat && matchStock;
  });

  function toggleSelect(id) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }
  function selectAll() {
    setSelected(filtered.length === selected.size ? new Set() : new Set(filtered.map(p => p.id)));
  }

  function changeStock(p, d) {
    try {
      updateProduct({ ...p, stock: Math.max(0, p.stock + d) });
    } catch (err) {
      console.error('Failed to adjust stock:', err);
      addToast(`Could not update stock: ${err.message}`, 'error');
    }
  }

  function handleDelete(p) {
    if (!window.confirm(`Delete "${p.name}"?`)) return;
    try {
      deleteProduct(p.id);
      setSelected(prev => {
        if (!prev.has(p.id)) return prev;
        const next = new Set(prev);
        next.delete(p.id);
        return next;
      });
    } catch (err) {
      console.error('Failed to delete product:', err);
      addToast(`Could not delete product: ${err.message}`, 'error');
    }
  }

  function handleBulkDelete() {
    if (!selected.size) return;
    if (!window.confirm(`Delete ${selected.size} selected product(s)?`)) return;

    const failed = [];
    [...selected].forEach(id => {
      try {
        deleteProduct(id);
      } catch (err) {
        console.error(`Failed to delete product ${id}:`, err);
        failed.push(id);
      }
    });
    setSelected(new Set(failed));
    if (failed.length > 0) {
      addToast(`Could not delete ${failed.length} product(s): ${failed.join(', ')}`, 'error');
    }
  }

  return (
    <div className="section-gap page-fade">
      <div className="section-header">
        <div>
          <h1 className="section-title">Products & Inventory</h1>
          <p className="section-subtitle">Manage catalogue, adjust stock levels, and monitor product health.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setProductModal({ isOpen: true, product: null })}>
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="table-card">
        {/* Controls */}
        <div className="table-controls">
          <div className="search-wrap" style={{ width: 240 }}>
            <Search size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Filter by name, SKU..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <select className="select-filter" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
            {categories.map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
          </select>

          <select className="select-filter" value={stockFilter} onChange={e => setStockFilter(e.target.value)}>
            <option value="All">All Stock Status</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>

          {selected.size > 0 && (
            <button className="btn btn-danger btn-sm" onClick={handleBulkDelete}>
              <Trash2 size={14} /> Delete ({selected.size})
            </button>
          )}

          <div className="ml-auto flex items-center gap-2">
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              {filtered.length} of {products.length} products
            </span>
            <div className="view-toggle">
              <button className={`view-toggle-btn${viewMode === 'table' ? ' active' : ''}`} onClick={() => setViewMode('table')} title="Table view">
                <List size={15} />
              </button>
              <button className={`view-toggle-btn${viewMode === 'grid' ? ' active' : ''}`} onClick={() => setViewMode('grid')} title="Grid view">
                <LayoutGrid size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Grid view */}
        {viewMode === 'grid' && (
          <div style={{ padding: '1.25rem' }}>
            {filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon"><Search size={22} /></div>
                <div className="empty-title">No products found</div>
                <div className="empty-desc">Try adjusting your search or filter criteria</div>
              </div>
            ) : (
              <div className="product-grid">
                {filtered.map(p => (
                  <div key={p.id} className="product-card">
                    <img src={p.image} alt={p.name} className="product-card-img" />
                    <div className="product-card-body">
                      <div className="product-card-name">{p.name}</div>
                      <div className="product-card-price">${p.price.toFixed(2)}</div>
                      <StatusBadge status={p.status} />
                      <StockBar stock={p.stock} minStockLevel={p.minStockLevel} />
                    </div>
                    <div className="product-card-actions">
                      <button className="btn btn-secondary btn-sm" style={{ flex: 1 }}
                        onClick={() => setProductModal({ isOpen: true, product: p })}>
                        <Edit2 size={13} /> Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p)}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Table view */}
        {viewMode === 'table' && (
          <div className="table-wrap">
            {filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon"><Search size={22} /></div>
                <div className="empty-title">No products found</div>
                <div className="empty-desc">Try adjusting your filters or search terms</div>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th style={{ width: 40 }}>
                      <input type="checkbox"
                        checked={selected.size === filtered.length && filtered.length > 0}
                        onChange={selectAll}
                        style={{ cursor: 'pointer' }}
                      />
                    </th>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Cost</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(p => (
                    <tr key={p.id}>
                      <td>
                        <input type="checkbox"
                          checked={selected.has(p.id)}
                          onChange={() => toggleSelect(p.id)}
                          style={{ cursor: 'pointer' }}
                        />
                      </td>
                      <td>
                        <div className="product-thumb">
                          <img src={p.image} alt={p.name} className="product-thumb-img" />
                          <div>
                            <div className="product-thumb-name">{p.name}</div>
                            <div className="product-thumb-sku">{p.sku} · ★{p.rating}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>{p.category}</td>
                      <td><span className="font-mono font-bold">${p.price.toFixed(2)}</span></td>
                      <td><span className="font-mono" style={{ color: 'var(--text-secondary)' }}>${p.cost ? p.cost.toFixed(2) : '—'}</span></td>
                      <td>
                        <div className="stock-ctl">
                          <button className="stock-ctl-btn" onClick={() => changeStock(p, -1)}>−</button>
                          <span className="stock-ctl-val">{p.stock}</span>
                          <button className="stock-ctl-btn" onClick={() => changeStock(p, 1)}>+</button>
                        </div>
                      </td>
                      <td><StatusBadge status={p.status} /></td>
                      <td>
                        <div className="flex gap-1">
                          <button className="btn btn-icon" style={{ width: 30, height: 30 }}
                            title="Edit product"
                            onClick={() => setProductModal({ isOpen: true, product: p })}>
                            <Edit2 size={13} />
                          </button>
                          <button className="btn btn-icon" style={{ width: 30, height: 30, color: 'var(--danger)' }}
                            title="Delete product"
                            onClick={() => handleDelete(p)}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
