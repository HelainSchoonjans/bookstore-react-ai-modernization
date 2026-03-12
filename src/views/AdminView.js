import React, { useState, useEffect } from 'react';
import dataService from '../services/dataService';
import { Availability } from '../services/dataService';
import './AdminView.css';

const AdminView = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
    availableProducts: 0,
    comingProducts: 0,
    discontinuedProducts: 0
  });
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = () => {
    const products = dataService.getAllProducts();
    const categoriesList = dataService.getAllCategories();
    
    const lowStock = products.filter(p => p.stockCount > 0 && p.stockCount < 10).length;
    const outOfStock = products.filter(p => p.stockCount === 0).length;
    const available = products.filter(p => p.availability === Availability.AVAILABLE).length;
    const coming = products.filter(p => p.availability === Availability.COMING).length;
    const discontinued = products.filter(p => p.availability === Availability.DISCONTINUED).length;

    setStats({
      totalProducts: products.length,
      totalCategories: categoriesList.length,
      lowStockProducts: lowStock,
      outOfStockProducts: outOfStock,
      availableProducts: available,
      comingProducts: coming,
      discontinuedProducts: discontinued
    });

    setCategories(categoriesList);
  };

  const handleAddCategory = () => {
    setEditingCategory({ id: -1, name: '' });
    setNewCategoryName('');
    setShowCategoryForm(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory({ ...category });
    setNewCategoryName(category.name);
    setShowCategoryForm(true);
  };

  const handleDeleteCategory = (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category? This will remove it from all products.')) {
      try {
        dataService.deleteCategory(categoryId);
        loadAdminData();
      } catch (error) {
        alert('Error deleting category: ' + error.message);
      }
    }
  };

  const handleSaveCategory = () => {
    if (!newCategoryName.trim()) {
      alert('Category name is required');
      return;
    }

    try {
      dataService.updateCategory({
        ...editingCategory,
        name: newCategoryName.trim()
      });
      loadAdminData();
      setShowCategoryForm(false);
      setEditingCategory(null);
      setNewCategoryName('');
    } catch (error) {
      alert('Error saving category: ' + error.message);
    }
  };

  const handleCancelCategoryEdit = () => {
    setShowCategoryForm(false);
    setEditingCategory(null);
    setNewCategoryName('');
  };

  const getStockLevelClass = (count) => {
    if (count === 0) return 'out-of-stock';
    if (count < 10) return 'low-stock';
    return 'in-stock';
  };

  return (
    <div className="admin-view">
      <div className="admin-header">
        <h2>Administrative Dashboard</h2>
        <p>System management and analytics</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="8" width="24" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 12H24" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 16H20" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 20H16" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3>{stats.totalProducts}</h3>
            <p>Total Products</p>
          </div>
        </div>

        <div className="stat-card secondary">
          <div className="stat-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="6" y="6" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 12L20 12" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 16L20 16" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 20L16 20" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3>{stats.totalCategories}</h3>
            <p>Categories</p>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 4L4 28H28L16 4Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M16 12V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="16" cy="22" r="1" fill="currentColor"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3>{stats.lowStockProducts}</h3>
            <p>Low Stock Items</p>
          </div>
        </div>

        <div className="stat-card danger">
          <div className="stat-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="2"/>
              <path d="M10 16H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3>{stats.outOfStockProducts}</h3>
            <p>Out of Stock</p>
          </div>
        </div>
      </div>

      <div className="admin-sections">
        <div className="admin-section">
          <div className="section-header">
            <h3>Availability Overview</h3>
          </div>
          <div className="availability-stats">
            <div className="availability-item available">
              <span className="label">Available</span>
              <span className="count">{stats.availableProducts}</span>
            </div>
            <div className="availability-item coming">
              <span className="label">Coming Soon</span>
              <span className="count">{stats.comingProducts}</span>
            </div>
            <div className="availability-item discontinued">
              <span className="label">Discontinued</span>
              <span className="count">{stats.discontinuedProducts}</span>
            </div>
          </div>
        </div>

        <div className="admin-section">
          <div className="section-header">
            <h3>Category Management</h3>
            <button className="add-category-btn" onClick={handleAddCategory}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 5V15M5 10H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Add Category
            </button>
          </div>
          
          <div className="categories-list">
            {categories.map(category => (
              <div key={category.id} className="category-item">
                <div className="category-info">
                  <h4>{category.name}</h4>
                  <span className="category-id">ID: {category.id}</span>
                </div>
                <div className="category-actions">
                  <button className="edit-btn" onClick={() => handleEditCategory(category)}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDeleteCategory(category.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-section">
          <div className="section-header">
            <h3>System Information</h3>
          </div>
          <div className="system-info">
            <div className="info-item">
              <span className="label">Application Version:</span>
              <span className="value">1.0.0</span>
            </div>
            <div className="info-item">
              <span className="label">Environment:</span>
              <span className="value">Development</span>
            </div>
            <div className="info-item">
              <span className="label">Data Storage:</span>
              <span className="value">In-Memory (Mock)</span>
            </div>
            <div className="info-item">
              <span className="label">Last Data Refresh:</span>
              <span className="value">{new Date().toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {showCategoryForm && (
        <div className="form-overlay">
          <div className="form-modal">
            <h3>{editingCategory?.id === -1 ? 'Add New Category' : 'Edit Category'}</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleSaveCategory(); }}>
              <div className="form-group">
                <label>Category Name</label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Enter category name"
                  required
                  autoFocus
                />
              </div>
              
              <div className="form-actions">
                <button type="button" onClick={handleCancelCategoryEdit} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminView;
