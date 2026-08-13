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
  const { activeTab, sidebarCollapsed } = useApp();

  // Map of tab content — keyed so React unmounts/mounts for transition
  const sections = {
    overview:   <OverviewSection />,
    analytics:  <AnalyticsSection />,
    products:   <ProductsSection />,
    orders:     <OrdersSection />,
    customers:  <CustomersSection />,
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className={`main-wrapper${sidebarCollapsed ? ' collapsed' : ''}`}>
        <Header />
        <main className="content-body" key={activeTab}>
          {sections[activeTab]}
        </main>
      </div>
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
