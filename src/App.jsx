import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import OverviewSection from './components/OverviewSection';
import AnalyticsSection from './components/AnalyticsSection';
import ProductsSection from './components/ProductsSection';
import OrdersSection from './components/OrdersSection';
import CustomersSection from './components/CustomersSection';
import ProductModal from './components/ProductModal';
import OrderModal from './components/OrderModal';
import ToastContainer from './components/ToastContainer';

function MainAppContent() {
  const { activeTab } = useApp();

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-wrapper">
        <Header />
        <main className="content-body">
          {activeTab === 'overview' && <OverviewSection />}
          {activeTab === 'analytics' && <AnalyticsSection />}
          {activeTab === 'products' && <ProductsSection />}
          {activeTab === 'orders' && <OrdersSection />}
          {activeTab === 'customers' && <CustomersSection />}
        </main>
      </div>

      {/* Global Modals & Feedback */}
      <ProductModal />
      <OrderModal />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
