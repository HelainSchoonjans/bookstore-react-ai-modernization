import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { currentUser, logout, isUserInRole } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Bookstore Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {currentUser}!</span>
          <span className={`role-badge ${isUserInRole('admin') ? 'admin' : 'user'}`}>
            {isUserInRole('admin') ? 'Admin' : 'User'}
          </span>
          <button onClick={handleLogout} className="logout-button">
            Sign Out
          </button>
        </div>
      </header>
      
      <main className="dashboard-main">
        <div className="welcome-card">
          <h2>Welcome to the Bookstore</h2>
          <p>This is the main dashboard for the bookstore application.</p>
          
          {isUserInRole('admin') && (
            <div className="admin-section">
              <h3>Admin Features</h3>
              <p>You have administrative privileges and can access all features.</p>
            </div>
          )}
          
          <div className="user-section">
            <h3>Available Features</h3>
            <ul>
              <li>Browse books</li>
              <li>View book details</li>
              <li>Search books</li>
              {isUserInRole('admin') && <li>Manage books (Admin only)</li>}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
