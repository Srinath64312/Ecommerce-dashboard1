import React from 'react';
import { Search, Mail, ShieldCheck, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function CustomersSection() {
  const { customers, searchQuery, setSearchQuery } = useApp();

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="section-gap page-fade">
      <div className="section-header">
        <div>
          <h1 className="section-title">Customer Directory</h1>
          <p className="section-subtitle">Customer lifetime value, purchase history, and account tiers.</p>
        </div>
      </div>

      <div className="table-card">
        <div className="table-controls">
          <div className="search-wrap" style={{ width: 280 }}>
            <Search size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <span className="ml-auto" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            {filtered.length} customer{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="table-wrap">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><Search size={22} /></div>
              <div className="empty-title">No customers found</div>
              <div className="empty-desc">Try adjusting your search</div>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Orders</th>
                  <th>Total Spent</th>
                  <th>Tier</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: '50%',
                          background: 'var(--accent-subtle)',
                          color: 'var(--accent)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 800, fontSize: '0.875rem', flexShrink: 0
                        }}>
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700 }}>{c.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Mail size={11} />{c.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td><span style={{ fontWeight: 600 }}>{c.ordersCount}</span> orders</td>
                    <td>
                      <span className="font-mono font-bold" style={{ color: 'var(--success)' }}>
                        ${c.totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${c.status === 'VIP' ? 'badge-info' : 'badge-success'}`}>
                        {c.status === 'VIP' && <Star size={10} style={{ marginRight: 2 }} />}
                        {c.status}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>{c.joined}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
