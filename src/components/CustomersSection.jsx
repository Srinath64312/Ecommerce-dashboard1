import React from 'react';
import { Search, Mail, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function CustomersSection() {
  const { customers, searchQuery, setSearchQuery } = useApp();

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="section-header">
        <div>
          <h1 className="section-title">Customer Directory</h1>
          <p className="section-subtitle">Track customer lifetime value, purchase history, and account tiers.</p>
        </div>
      </div>

      <div className="table-card">
        <div className="table-controls">
          <div className="search-box" style={{ width: '280px' }}>
            <Search size={16} className="text-muted" />
            <input 
              type="text" 
              placeholder="Search customers..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
            Total Registered Customers: <strong>{customers.length}</strong>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Email</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Tier</th>
                <th>Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map(c => (
                <tr key={c.id}>
                  <td><strong>{c.name}</strong></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}>
                      <Mail size={14} />
                      <span>{c.email}</span>
                    </div>
                  </td>
                  <td>{c.ordersCount} orders</td>
                  <td><strong style={{ color: 'var(--success)' }}>${c.totalSpent.toFixed(2)}</strong></td>
                  <td>
                    <span className={`badge-status ${c.status === 'VIP' ? 'shipped' : 'in-stock'}`}>
                      {c.status === 'VIP' && <ShieldCheck size={13} style={{ marginRight: '3px' }} />}
                      {c.status}
                    </span>
                  </td>
                  <td>{c.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
