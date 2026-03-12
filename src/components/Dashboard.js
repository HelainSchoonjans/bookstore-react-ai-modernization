import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Header from './Header';
import NavigationDrawer from './NavigationDrawer';
import InventoryView from '../views/InventoryView';
import AboutView from '../views/AboutView';
import AdminView from '../views/AdminView';
import './Dashboard.css';

const Dashboard = () => {
  const { currentUser, logout, isUserInRole } = useAuth();
  const [currentView, setCurrentView] = useState('inventory');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleNavigation = (view) => {
    setCurrentView(view);
  };

  const handleLogout = () => {
    logout();
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'inventory':
        return <InventoryView />;
      case 'about':
        return <AboutView />;
      case 'admin':
        return isUserInRole('admin') ? <AdminView /> : <div className="access-denied">Access Denied</div>;
      default:
        return <InventoryView />;
    }
  };

  return (
    <div className="dashboard-layout">
      <Header onMenuToggle={handleMenuToggle} />
      
      <div className="dashboard-content">
        <NavigationDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onNavigate={handleNavigation}
          currentView={currentView}
        />
        
        <main className="main-content">
          {renderCurrentView()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
