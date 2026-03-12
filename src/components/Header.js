import React from 'react';
import './Header.css';

const Header = ({ onMenuToggle }) => {
  return (
    <header className="app-header">
      <div className="header-left">
        <button className="menu-toggle" onClick={onMenuToggle} aria-label="Toggle menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <div className="brand">
          <div className="brand-logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="4" fill="#667eea"/>
              <path d="M8 12L16 8L24 12L16 16L8 12Z" fill="white"/>
              <path d="M8 20L16 16L24 20L16 24L8 20Z" fill="white" opacity="0.7"/>
            </svg>
          </div>
          <h1 className="brand-title">Bookstore</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
