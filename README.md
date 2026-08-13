# StorePulse AI — E-Commerce Admin & Analytics Dashboard 🛒📊

> **Deploython 2.0 — Project 5: E-Commerce Admin & Analytics Dashboard**  
> A state-of-the-art, feature-rich static E-Commerce Admin & Analytics Dashboard built with **React**, **Vite**, and a **Vanilla CSS Design System**.

---

## 🌟 Features Overview

### 🏆 Core Hackathon Features (100 Points Base)
- **Responsive Admin Dashboard** with a sleek collapsible sidebar navigation.
- **KPI Metrics Overview**: Live summary cards tracking Total Revenue, Orders, Active Customers, and In-Stock Product Counts with percentage trend indicators.
- **Product & Inventory Management**: Interactive data grid with search, category filtering, instant stock increment/decrement, cost/price tracking, and stock status badges (`In Stock`, `Low Stock`, `Out of Stock`).
- **Order Management & Workflow**: Complete orders database featuring inline order status updates (`Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`) and order detail view modals.
- **Analytics & Financial Visualization**: Interactive SVG sales trend bar charts, revenue share by product category progress bars, and top-selling product leaderboards.

### 🚀 Bonus Features Included (+5 Extra Points Each)
1. 📊 **Interactive SVG Charts**: Dynamic chart visualization supporting revenue, order count, and unit sales metrics.
2. 📅 **Date-Range Analytics Filter**: Real-time filtering across **Last 7 Days**, **Last 30 Days**, and **Year-to-Date (YTD)**.
3. ⚠️ **Inventory Alert System**: Automated triggers for low-stock (<10 units) and out-of-stock items, featuring notification popovers and alert banners.
4. 🧩 **Drag-and-Drop Dashboard Widgets**: Reorder Overview dashboard widgets interactively; layout order persists across sessions.
5. 🔄 **Order Status Management**: Change order fulfillment states directly from table dropdowns or detailed order modals with live badge updates.
6. ✏️ **Product Editing Modal**: Interactive form modal for creating and updating product names, SKUs, pricing, stock levels, categories, and image URL previews.
7. 📄 **CSV Export UI**: Download tabular data for Inventory, Orders, or financial summaries directly into `.csv` files.
8. 🌙 **Dark/Light Theme Toggle**: Seamless dynamic theme switching powered by a custom HSL CSS variable system.
9. 💾 **LocalStorage State Persistence**: Products, orders, widget arrangements, and theme preferences automatically persist across browser reloads.

---

## 🛠️ Technology Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: Vanilla CSS with custom HSL color tokens, glassmorphism, responsive grids, and CSS animations
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data Export**: Custom CSV blob builder (`csvExporter.js`)
- **State Management**: React Context API (`AppContext.jsx`) with `localStorage` synchronization

---

## 🚀 Quick Start Guide

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18 or higher) installed.

### Installation

1. Navigate to the project directory:
   ```bash
   cd e:\Projects\ecommerce-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```text
   http://localhost:5173
   ```

---

## 📦 Production Build & Deployment

To generate a production-ready build bundle:

```bash
npm run build
```

The optimized static output will be located in the `dist/` directory.

### Suggested Free Deployment Platforms (60 Points)
- **Vercel**: Import the GitHub repository or run `npx vercel`
- **Netlify**: Drag and drop the `dist/` folder or link your Git repository
- **GitHub Pages**: Deploy via `gh-pages` branch or GitHub Actions
- **Render**: Connect repository as a Static Site with build command `npm run build` and publish directory `dist`
- **Cloudflare Pages**: Connect repository with framework preset Vite

---

## 📁 Project Structure

```text
ecommerce-dashboard/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css                 # Primary CSS Design System (HSL, dark/light theme)
│   ├── context/
│   │   └── AppContext.jsx        # Global state, theme switcher, LocalStorage sync
│   ├── utils/
│   │   ├── mockData.js           # Products, orders, customer data, & trends
│   │   └── csvExporter.js        # Tabular data to CSV exporter
│   └── components/
│       ├── Sidebar.jsx           # Responsive navigation sidebar
│       ├── Header.jsx            # Search, theme toggle, export, notifications
│       ├── OverviewSection.jsx   # KPI cards, drag & drop widgets, sales chart
│       ├── AnalyticsSection.jsx  # Financial reports, AOV, category shares
│       ├── ProductsSection.jsx   # Inventory management grid & actions
│       ├── OrdersSection.jsx     # Order management & inline status updates
│       ├── CustomersSection.jsx  # Customer database & tier rankings
│       ├── ProductModal.jsx      # Add/Edit product modal form
│       ├── OrderModal.jsx        # Detailed order view modal
│       └── ToastContainer.jsx    # Real-time feedback notification toasts
└── README.md
```

---

## 📝 License & Attribution
Developed for **Deploython 2.0 Hackathon**. Built with ❤️ using React & Vite.