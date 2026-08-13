import React, { useMemo } from 'react';
import { BarChart2, PieChart, TrendingUp, DollarSign, Award, ArrowUpRight, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SALES_TRENDS, CATEGORY_BREAKDOWN } from '../utils/mockData';
import { sanitizeImageUrl } from '../utils/sanitize';

/* ── SVG Donut Chart ─────────────────────────────────────────────────── */
function DonutChart({ data, size = 180, stroke = 32 }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const cx = size / 2, cy = size / 2;
  let offset = 0;

  return (
    <div className="donut-container">
      <svg width={size} height={size} className="donut-svg" style={{ transform: 'rotate(-90deg)' }}>
        {data.map((seg, i) => {
          const pct = seg.percentage / 100;
          const dash = pct * circ;
          const el = (
            <circle
              key={i}
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth={stroke - 4}
              strokeDasharray={`${dash} ${circ - dash}`}
              strokeDashoffset={-offset * circ}
              strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 0.8s ease' }}
            />
          );
          offset += pct;
          return el;
        })}
      </svg>
      <div className="donut-legend">
        {data.map((seg, i) => (
          <div key={i} className="donut-legend-item">
            <div className="donut-legend-dot" style={{ background: seg.color }} />
            <span className="donut-legend-label">{seg.category}</span>
            <span className="donut-legend-pct">{seg.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Multi-bar Chart ─────────────────────────────────────────────────── */
function MultiBarChart({ data }) {
  const maxRev = Math.max(...data.map(d => d.revenue));
  const maxOrd = Math.max(...data.map(d => d.orders));
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 220, paddingBottom: 28, position: 'relative' }}>
      {data.map((d, i) => {
        const revH = Math.max(6, (d.revenue / maxRev) * 100);
        const ordH = Math.max(6, (d.orders / maxOrd) * 100);
        return (
          <div key={i} className="bar-col" style={{ gap: 3 }}>
            <div className="bar-tooltip">
              Rev: ${d.revenue.toLocaleString()} | Orders: {d.orders}
            </div>
            <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end', height: '100%' }}>
              <div className="bar-fill bar-primary" style={{ height: `${revH}%`, flex: 1, animationDelay: `${i * 50}ms` }} />
              <div className="bar-fill bar-secondary" style={{ height: `${ordH}%`, flex: 1, animationDelay: `${i * 50 + 25}ms` }} />
            </div>
            <span className="bar-label">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ── Conversion Funnel ───────────────────────────────────────────────── */
const FUNNEL_STAGES = [
  { label: 'Visitors',   value: 18400, pct: 100,  color: 'var(--accent)' },
  { label: 'Viewed Item',value: 11200, pct: 60.9, color: 'var(--info)' },
  { label: 'Added to Cart', value: 4800, pct: 26.1, color: 'var(--warning)' },
  { label: 'Purchased',  value: 1340,  pct: 7.3,  color: 'var(--success)' },
];

function ConversionFunnel() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {FUNNEL_STAGES.map((s, i) => (
        <div key={i}>
          <div className="cat-meta" style={{ marginBottom: 4 }}>
            <span style={{ fontWeight: 600 }}>{s.label}</span>
            <span className="font-mono" style={{ color: s.color, fontSize: '0.82rem', fontWeight: 700 }}>
              {s.value.toLocaleString()} ({s.pct}%)
            </span>
          </div>
          <div className="cat-bar-bg">
            <div className="cat-bar-fill" style={{ width: `${s.pct}%`, background: s.color }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsSection() {
  const { dateRange, setDateRange, products, orders } = useApp();
  const chartData = SALES_TRENDS[dateRange] || SALES_TRENDS['7d'];

  const totalRevenue = orders.reduce((s, o) => o.status !== 'Cancelled' ? s + o.total : s, 0);
  const validOrders  = orders.filter(o => o.status !== 'Cancelled');
  const aov = validOrders.length ? (totalRevenue / validOrders.length) : 0;

  const topProducts = useMemo(() =>
    [...products].sort((a, b) => b.salesCount - a.salesCount).slice(0, 5),
  [products]);

  return (
    <div className="section-gap page-fade">
      {/* Header */}
      <div className="section-header">
        <div>
          <h1 className="section-title">Analytics & Business Intelligence</h1>
          <p className="section-subtitle">Financial performance, product velocity, and conversion metrics.</p>
        </div>
        <div className="flex gap-2 items-center">
          <Filter size={15} style={{ color: 'var(--text-muted)' }} />
          <select className="select-filter" value={dateRange} onChange={e => setDateRange(e.target.value)}>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="ytd">Year to Date</option>
          </select>
        </div>
      </div>

      {/* KPI Row */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Average Order Value</span>
            <div className="kpi-icon-wrap" style={{ background: 'var(--success-bg)' }}>
              <DollarSign size={18} style={{ color: 'var(--success)' }} />
            </div>
          </div>
          <div className="kpi-value">${aov.toFixed(2)}</div>
          <span className="kpi-trend up"><TrendingUp size={12} /> +4.5% conversion</span>
        </div>
        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Cart Conversion Rate</span>
            <div className="kpi-icon-wrap" style={{ background: 'var(--accent-subtle)' }}>
              <TrendingUp size={18} style={{ color: 'var(--accent)' }} />
            </div>
          </div>
          <div className="kpi-value">3.42%</div>
          <span className="kpi-trend up"><TrendingUp size={12} /> Top 10% benchmark</span>
        </div>
        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Gross Profit Margin</span>
            <div className="kpi-icon-wrap" style={{ background: 'var(--info-bg)' }}>
              <BarChart2 size={18} style={{ color: 'var(--info)' }} />
            </div>
          </div>
          <div className="kpi-value">54.8%</div>
          <span className="kpi-trend up"><TrendingUp size={12} /> Strong inventory margin</span>
        </div>
        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Total Revenue</span>
            <div className="kpi-icon-wrap" style={{ background: 'var(--warning-bg)' }}>
              <ArrowUpRight size={18} style={{ color: 'var(--warning)' }} />
            </div>
          </div>
          <div className="kpi-value">${totalRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
          <span className="kpi-trend up"><TrendingUp size={12} /> +14.8% growth</span>
        </div>
      </div>

      {/* Multi-bar chart */}
      <div className="widget-card">
        <div className="widget-header">
          <div className="widget-title">
            <BarChart2 size={16} style={{ color: 'var(--accent)' }} />
            Revenue & Order Volume
            <div style={{ display: 'flex', gap: 12, marginLeft: 12, alignItems: 'center', fontSize: '0.75rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--accent)' }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: 'var(--accent)' }} />Revenue
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--success)' }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: 'var(--success)' }} />Orders
              </span>
            </div>
          </div>
        </div>
        <div className="widget-body">
          <MultiBarChart data={chartData} />
        </div>
      </div>

      {/* Two-column: Donut + Conversion funnel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        <div className="widget-card">
          <div className="widget-header">
            <div className="widget-title">
              <PieChart size={16} style={{ color: 'var(--info)' }} />
              Revenue by Category
            </div>
          </div>
          <div className="widget-body">
            <DonutChart data={CATEGORY_BREAKDOWN.map(c => ({ ...c, color: c.color }))} />
          </div>
        </div>

        <div className="widget-card">
          <div className="widget-header">
            <div className="widget-title">
              <TrendingUp size={16} style={{ color: 'var(--success)' }} />
              Conversion Funnel
            </div>
          </div>
          <div className="widget-body">
            <ConversionFunnel />
          </div>
        </div>
      </div>

      {/* Top Products table */}
      <div className="table-card">
        <div className="table-controls">
          <div className="widget-title" style={{ fontSize: '0.9375rem' }}>
            <Award size={16} style={{ color: 'var(--warning)' }} />
            Top Performing Products
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Units Sold</th>
                <th>Revenue Generated</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((p, idx) => (
                <tr key={p.id}>
                  <td>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 24, height: 24, borderRadius: '50%',
                      background: idx === 0 ? 'var(--warning-bg)' : 'var(--bg-secondary)',
                      color: idx === 0 ? 'var(--warning)' : 'var(--text-muted)',
                      fontWeight: 800, fontSize: '0.75rem'
                    }}>{idx + 1}</span>
                  </td>
                  <td>
                    <div className="product-thumb">
                      <img src={sanitizeImageUrl(p.image)} alt={p.name} className="product-thumb-img" referrerPolicy="no-referrer" />
                      <div>
                        <div className="product-thumb-name">{p.name}</div>
                        <div className="product-thumb-sku">{p.sku}</div>
                      </div>
                    </div>
                  </td>
                  <td>{p.category}</td>
                  <td className="font-mono" style={{ fontWeight: 600 }}>${p.price.toFixed(2)}</td>
                  <td><strong>{p.salesCount.toLocaleString()}</strong></td>
                  <td>
                    <span className="font-mono" style={{ color: 'var(--success)', fontWeight: 700 }}>
                      ${(p.salesCount * p.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
