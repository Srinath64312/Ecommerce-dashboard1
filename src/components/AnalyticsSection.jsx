import React from 'react';
import { BarChart2, PieChart, TrendingUp, DollarSign, Award, ArrowUpRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SALES_TRENDS, CATEGORY_BREAKDOWN } from '../utils/mockData';

export default function AnalyticsSection() {
  const { dateRange, setDateRange, products, orders } = useApp();

  const chartData = SALES_TRENDS[dateRange] || SALES_TRENDS['7d'];
  const maxRevenue = Math.max(...chartData.map(d => d.revenue));

  // Compute metrics
  const totalRevenue = orders.reduce((sum, o) => o.status !== 'Cancelled' ? sum + o.total : sum, 0);
  const validOrdersCount = orders.filter(o => o.status !== 'Cancelled').length;
  const aov = validOrdersCount > 0 ? (totalRevenue / validOrdersCount) : 0;

  // Top selling products sorted by salesCount
  const sortedBySales = [...products].sort((a, b) => b.salesCount - a.salesCount);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="section-header">
        <div>
          <h1 className="section-title">Analytics & Business Intelligence</h1>
          <p className="section-subtitle">Deep dive into financial performance, product sales velocity, and category breakdown.</p>
        </div>
        <select 
          className="select-filter"
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
        >
          <option value="7d">Last 7 Days Analysis</option>
          <option value="30d">Last 30 Days Analysis</option>
          <option value="ytd">Year-to-Date (YTD) Analysis</option>
        </select>
      </div>

      {/* Analytics KPI Bar */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Average Order Value (AOV)</span>
            <div className="kpi-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)' }}>
              <DollarSign size={22} />
            </div>
          </div>
          <div className="kpi-value">${aov.toFixed(2)}</div>
          <div className="kpi-trend up">
            <TrendingUp size={14} />
            <span>+4.5% conversion increase</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Cart Conversion Rate</span>
            <div className="kpi-icon" style={{ backgroundColor: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-primary)' }}>
              <TrendingUp size={22} />
            </div>
          </div>
          <div className="kpi-value">3.42%</div>
          <div className="kpi-trend up">
            <TrendingUp size={14} />
            <span>Top 10% benchmark</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Gross Profit Margin</span>
            <div className="kpi-icon" style={{ backgroundColor: 'rgba(6, 182, 212, 0.15)', color: 'var(--info)' }}>
              <BarChart2 size={22} />
            </div>
          </div>
          <div className="kpi-value">54.8%</div>
          <div className="kpi-trend up">
            <TrendingUp size={14} />
            <span>Strong inventory margin</span>
          </div>
        </div>
      </div>

      {/* Main Analytics Chart */}
      <div className="widget-card">
        <div className="widget-header">
          <div className="widget-title">
            <BarChart2 size={20} style={{ color: 'var(--accent-primary)' }} />
            <span>Revenue Growth & Order Volumes</span>
          </div>
        </div>

        <div className="chart-container" style={{ height: '300px' }}>
          {chartData.map((d, idx) => {
            const barHeight = Math.max(15, (d.revenue / maxRevenue) * 100);
            return (
              <div key={idx} className="chart-bar-wrapper">
                <div className="chart-tooltip">
                  Revenue: ${d.revenue.toLocaleString()} | Orders: {d.orders} | Units: {d.units}
                </div>
                <div className="chart-bar" style={{ height: `${barHeight}%` }}></div>
                <span className="chart-label">{d.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid: Top Selling Products & Category Share */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div className="table-card">
          <div className="table-controls">
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={18} style={{ color: 'var(--warning)' }} />
              Top Performing Products
            </h3>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Units Sold</th>
                  <th>Total Revenue</th>
                </tr>
              </thead>
              <tbody>
                {sortedBySales.slice(0, 5).map(p => (
                  <tr key={p.id}>
                    <td>
                      <div className="product-cell">
                        <img src={p.image} alt={p.name} className="product-img" />
                        <div>
                          <div style={{ fontWeight: '700' }}>{p.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>SKU: {p.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td>{p.category}</td>
                    <td>${p.price.toFixed(2)}</td>
                    <td><strong>{p.salesCount}</strong></td>
                    <td><strong style={{ color: 'var(--success)' }}>${(p.salesCount * p.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="widget-card">
          <div className="widget-header">
            <div className="widget-title">
              <PieChart size={18} style={{ color: 'var(--info)' }} />
              <span>Revenue by Category</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '0.5rem' }}>
            {CATEGORY_BREAKDOWN.map((cat, i) => (
              <div key={i} className="category-item">
                <div className="category-meta">
                  <span>{cat.category}</span>
                  <span style={{ color: cat.color }}>${cat.revenue.toLocaleString()} ({cat.percentage}%)</span>
                </div>
                <div className="progress-bar-bg">
                  <div 
                    className="progress-bar-fill"
                    style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
