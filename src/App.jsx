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
import ErrorBoundary from './components/ErrorBoundary';

function MainAppContent() {
  const { activeTab, sidebarCollapsed, addToast } = useApp();

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
          <ErrorBoundary
            label={activeTab}
            onError={() => addToast('This section failed to load. See the console for details.', 'error')}
          >
            {sections[activeTab]}
          </ErrorBoundary>
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
    <ErrorBoundary label="App">
      <AppProvider>
        <MainAppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}
