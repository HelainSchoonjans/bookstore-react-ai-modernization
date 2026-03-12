import React, { useState, useEffect, useRef } from 'react';
import dataService from '../services/dataService';
import { Availability } from '../services/dataService';
import { useAuth } from '../contexts/AuthContext';
import './InventoryView.css';

const InventoryView = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(9);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  
  const searchInputRef = useRef(null);
  const { logout } = useAuth();

  useEffect(() => {
    loadData();
    setupKeyboardShortcuts();
    return () => {
      cleanupKeyboardShortcuts();
    };
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery, selectedCategory]);

  const setupKeyboardShortcuts = () => {
    const handleKeyDown = (event) => {
      // Ctrl+F: Focus search field
      if (event.ctrlKey && event.key === 'f') {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
      // Alt+N: New product
      else if (event.altKey && event.key === 'n') {
        event.preventDefault();
        handleAddProduct();
      }
      // Ctrl+L: Logout
      else if (event.ctrlKey && event.key === 'l') {
        event.preventDefault();
        logout();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  };

  const cleanupKeyboardShortcuts = () => {
    document.removeEventListener('keydown', setupKeyboardShortcuts);
  };

  const loadData = () => {
    setProducts(dataService.getAllProducts());
    setCategories(dataService.getAllCategories());
  };

  const filterProducts = () => {
    let filtered = products;

    // Filter by search query
    if (searchQuery) {
      filtered = dataService.searchProducts(searchQuery);
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product =>
        product.category.some(cat => cat.id === parseInt(selectedCategory))
      );
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleAddProduct = () => {
    setEditingProduct({
      id: -1,
      productName: '',
      price: 0,
      category: [],
      stockCount: 0,
      availability: Availability.COMING
    });
    setShowForm(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct({ ...product });
    setShowForm(true);
  };

  const handleDeleteProduct = (product) => {
    setProductToDelete(product);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      try {
        dataService.deleteProduct(productToDelete.id);
        loadData();
        setShowDeleteDialog(false);
        setProductToDelete(null);
      } catch (error) {
        alert('Error deleting product: ' + error.message);
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setProductToDelete(null);
  };

  const handleSaveProduct = (productData) => {
    try {
      dataService.updateProduct(productData);
      loadData();
      setShowForm(false);
      setEditingProduct(null);
    } catch (error) {
      alert('Error saving product: ' + error.message);
    }
  };

  const handleCancelEdit = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getAvailabilityBadgeClass = (availability) => {
    switch (availability) {
      case Availability.AVAILABLE:
        return 'available';
      case Availability.COMING:
        return 'coming';
      case Availability.DISCONTINUED:
        return 'discontinued';
      default:
        return '';
    }
  };

  return (
    <div className="inventory-view">
      <div className="inventory-header">
        <h2>Inventory Management</h2>
        <button className="add-product-btn" onClick={handleAddProduct}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 5V15M5 10H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Add Product
        </button>
      </div>

      <div className="inventory-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search products... (Ctrl+F)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            ref={searchInputRef}
          />
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="2"/>
            <path d="M14 14L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>

        <div className="category-filter">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="results-info">
        <span>Showing {currentProducts.length} of {filteredProducts.length} products</span>
        {filteredProducts.length > productsPerPage && (
          <span>Page {currentPage} of {totalPages}</span>
        )}
      </div>

      <div className="products-grid">
        {currentProducts.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-header">
              <h3>{product.productName}</h3>
              <span className={`availability-badge ${getAvailabilityBadgeClass(product.availability)}`}>
                {product.availability}
              </span>
            </div>
            
            <div className="product-details">
              <div className="detail-row">
                <span className="label">Price:</span>
                <span className="value">${product.price.toFixed(2)}</span>
              </div>
              <div className="detail-row">
                <span className="label">Stock:</span>
                <span className="value">{product.stockCount}</span>
              </div>
              <div className="detail-row">
                <span className="label">Category:</span>
                <span className="value">
                  {product.category.map(cat => cat.name).join(', ')}
                </span>
              </div>
            </div>

            <div className="product-actions">
              <button className="edit-btn" onClick={() => handleEditProduct(product)}>
                Edit
              </button>
              <button className="delete-btn" onClick={() => handleDeleteProduct(product)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          
          <div className="pagination-numbers">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                className={`pagination-number ${currentPage === index + 1 ? 'active' : ''}`}
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
          
          <button
            className="pagination-btn"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {showForm && (
        <ProductForm
          product={editingProduct}
          categories={categories}
          onSave={handleSaveProduct}
          onCancel={handleCancelEdit}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="dialog-overlay">
          <div className="dialog-modal">
            <h3>Confirm Delete</h3>
            <p>
              Are you sure you want to delete "{productToDelete?.productName}"? 
              This action cannot be undone.
            </p>
            <div className="dialog-actions">
              <button className="cancel-btn" onClick={cancelDelete}>
                Cancel
              </button>
              <button className="delete-btn" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ProductForm = ({ product, categories, onSave, onCancel }) => {
  const [formData, setFormData] = useState(product);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCategoryChange = (categoryId) => {
    const category = categories.find(cat => cat.id === parseInt(categoryId));
    if (category) {
      setFormData(prev => ({
        ...prev,
        category: prev.category.some(cat => cat.id === category.id)
          ? prev.category.filter(cat => cat.id !== category.id)
          : [...prev.category, category]
      }));
    }
  };

  return (
    <div className="form-overlay">
      <div className="form-modal">
        <h3>{product.id === -1 ? 'Add New Product' : 'Edit Product'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              value={formData.productName}
              onChange={(e) => handleInputChange('productName', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Price</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
              required
            />
          </div>

          <div className="form-group">
            <label>Stock Count</label>
            <input
              type="number"
              min="0"
              value={formData.stockCount}
              onChange={(e) => handleInputChange('stockCount', parseInt(e.target.value))}
              required
            />
          </div>

          <div className="form-group">
            <label>Availability</label>
            <select
              value={formData.availability}
              onChange={(e) => handleInputChange('availability', e.target.value)}
            >
              <option value={Availability.AVAILABLE}>Available</option>
              <option value={Availability.COMING}>Coming</option>
              <option value={Availability.DISCONTINUED}>Discontinued</option>
            </select>
          </div>

          <div className="form-group">
            <label>Categories</label>
            <div className="category-checkboxes">
              {categories.map(category => (
                <label key={category.id} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.category.some(cat => cat.id === category.id)}
                    onChange={() => handleCategoryChange(category.id)}
                  />
                  {category.name}
                </label>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryView;
