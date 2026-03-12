import React from 'react';
import './AboutView.css';

const AboutView = () => {
  return (
    <div className="about-view">
      <div className="about-container">
        <div className="about-header">
          <h2>About Bookstore</h2>
          <p>Learn more about our bookstore management application</p>
        </div>

        <div className="about-content">
          <div className="about-section">
            <h3>Application Overview</h3>
            <p>
              Bookstore is a comprehensive inventory management system designed to help businesses
              efficiently manage their book inventory, track stock levels, and provide excellent
              customer service.
            </p>
          </div>

          <div className="about-section">
            <h3>Key Features</h3>
            <ul className="feature-list">
              <li>
                <strong>Inventory Management:</strong> Add, edit, and delete products with ease
              </li>
              <li>
                <strong>Search & Filter:</strong> Find products quickly using search and category filters
              </li>
              <li>
                <strong>Stock Tracking:</strong> Monitor stock levels and availability status
              </li>
              <li>
                <strong>Category Organization:</strong> Organize products by categories for better management
              </li>
              <li>
                <strong>Role-Based Access:</strong> Different access levels for regular users and administrators
              </li>
              <li>
                <strong>Responsive Design:</strong> Works seamlessly on desktop and mobile devices
              </li>
            </ul>
          </div>

          <div className="about-section">
            <h3>Technology Stack</h3>
            <div className="tech-grid">
              <div className="tech-item">
                <h4>Frontend</h4>
                <ul>
                  <li>React 19</li>
                  <li>Modern CSS</li>
                  <li>Responsive Design</li>
                </ul>
              </div>
              <div className="tech-item">
                <h4>Backend (Mock)</h4>
                <ul>
                  <li>JavaScript Services</li>
                  <li>Local Storage</li>
                  <li>Mock Data Generation</li>
                </ul>
              </div>
              <div className="tech-item">
                <h4>Authentication</h4>
                <ul>
                  <li>Mock Security</li>
                  <li>Role-Based Access</li>
                  <li>Session Management</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="about-section">
            <h3>User Roles</h3>
            <div className="role-cards">
              <div className="role-card">
                <h4>Regular User</h4>
                <p>Can view and edit inventory, search products, and manage stock levels.</p>
                <ul>
                  <li>View all products</li>
                  <li>Add/Edit products</li>
                  <li>Search and filter</li>
                </ul>
              </div>
              <div className="role-card admin">
                <h4>Administrator</h4>
                <p>Has access to all regular user features plus administrative functions.</p>
                <ul>
                  <li>All regular user permissions</li>
                  <li>Admin dashboard access</li>
                  <li>System management</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="about-section">
            <h3>Getting Started</h3>
            <div className="getting-started">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h4>Login</h4>
                  <p>Use any username where the password equals the username (e.g., "admin"/"admin" for admin access)</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h4>Navigate</h4>
                  <p>Use the navigation drawer to access different sections of the application</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h4>Manage Inventory</h4>
                  <p>Add, edit, or delete products using the inventory management interface</p>
                </div>
              </div>
            </div>
          </div>

          <div className="about-section">
            <h3>Version Information</h3>
            <div className="version-info">
              <div className="version-item">
                <span className="label">Version:</span>
                <span className="value">1.0.0</span>
              </div>
              <div className="version-item">
                <span className="label">Last Updated:</span>
                <span className="value">March 2026</span>
              </div>
              <div className="version-item">
                <span className="label">Environment:</span>
                <span className="value">Development</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutView;
