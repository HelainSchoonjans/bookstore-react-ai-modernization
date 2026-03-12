import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import './NavigationDrawer.css';

const NavigationDrawer = ({ isOpen, onClose, onNavigate, currentView }) => {
  const { isUserInRole, logout } = useAuth();

  const handleNavigation = (view) => {
    onNavigate(view);
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  const navigationItems = [
    {
      id: 'inventory',
      label: 'Inventory',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 4H4C2.89543 4 2 4.89543 2 6V18C2 19.1046 2.89543 20 4 20H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M20 4H13C11.8954 4 11 4.89543 11 6V18C11 19.1046 11.8954 20 13 20H20C21.1046 20 22 19.1046 22 18V6C22 4.89543 21.1046 4 20 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M6 8H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M6 12H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M6 16H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      id: 'about',
      label: 'About',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="12" cy="8" r="1" fill="currentColor"/>
        </svg>
      )
    }
  ];

  // Add admin view only for admin users
  if (isUserInRole('admin')) {
    navigationItems.splice(1, 0, {
      id: 'admin',
      label: 'Admin',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 4C13.1046 4 14 4.89543 14 6C14 7.10457 13.1046 8 12 8C10.8954 8 10 7.10457 10 6C10 4.89543 10.8954 4 12 4Z" fill="currentColor"/>
          <path d="M16 14C16 15.1046 15.1046 16 14 16H10C8.89543 16 8 15.1046 8 14V12C8 10.8954 8.89543 10 10 10H14C15.1046 10 16 10.8954 16 12V14Z" fill="currentColor"/>
          <path d="M6 20C6 18.8954 6.89543 18 8 18H16C17.1046 18 18 18.8954 18 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    });
  }

  return (
    <>
      {isOpen && <div className="drawer-overlay" onClick={onClose} />}
      <div className={`navigation-drawer ${isOpen ? 'open' : ''}`}>
        <nav className="drawer-nav">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${currentView === item.id ? 'active' : ''}`}
              onClick={() => handleNavigation(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
          
          <div className="drawer-divider" />
          
          <button className="nav-item logout-item" onClick={handleLogout}>
            <span className="nav-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </span>
            <span className="nav-label">Logout</span>
          </button>
        </nav>
      </div>
    </>
  );
};

export default NavigationDrawer;
