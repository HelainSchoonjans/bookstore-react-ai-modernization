import React, { useState, useEffect, useRef } from 'react';
import dataService from '../services/dataService';
import { Availability } from '../services/dataService';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { useFocusTrap } from '../hooks/useFocusTrap';
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
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const searchInputRef = useRef(null);
  const deleteDialogRef = useFocusTrap(showDeleteDialog);
  const { logout } = useAuth();
  const { success, error } = useToast();

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
      setIsDeleting(true);
      try {
        dataService.deleteProduct(productToDelete.id);
        loadData();
        setShowDeleteDialog(false);
        setProductToDelete(null);
        success(`"${productToDelete.productName}" has been deleted successfully.`);
      } catch (error) {
        error('Error deleting product: ' + error.message);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setProductToDelete(null);
  };

  const handleSaveProduct = async (productData) => {
    setIsSaving(true);
    try {
      dataService.updateProduct(productData);
      loadData();
      setShowForm(false);
      setEditingProduct(null);
      const message = productData.id === -1 
        ? `"${productData.productName}" has been added successfully.`
        : `"${productData.productName}" has been updated successfully.`;
      success(message);
    } catch (error) {
      error('Error saving product: ' + error.message);
    } finally {
      setIsSaving(false);
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
        <div className="header-actions">
          <button 
            className="logout-btn" 
            onClick={logout}
            aria-label="Logout (Ctrl+L)"
            title="Logout (Ctrl+L)"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M6 5V15M3 8H9M3 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M13 3L17 7L13 11M17 7H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Logout
          </button>
          <button 
            className="add-product-btn" 
            onClick={handleAddProduct}
            aria-label="Add new product (Alt+N)"
            title="Add new product (Alt+N)"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M10 5V15M5 10H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Add Product
          </button>
        </div>
      </div>

      <div className="inventory-controls">
        <div className="search-box">
          <label htmlFor="search-input" className="visually-hidden">Search products</label>
          <input
            id="search-input"
            type="text"
            placeholder="Search products... (Ctrl+F)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            ref={searchInputRef}
            aria-label="Search products by name or category"
            aria-describedby="search-help"
          />
          <span id="search-help" className="visually-hidden">Press Ctrl+F to focus this field</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="2"/>
            <path d="M14 14L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>

        <div className="category-filter">
          <label htmlFor="category-select" className="visually-hidden">Filter by category</label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            aria-label="Filter products by category"
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

      <div className="results-info" aria-live="polite" aria-atomic="true">
        <span>Showing {currentProducts.length} of {filteredProducts.length} products</span>
        {filteredProducts.length > productsPerPage && (
          <span>Page {currentPage} of {totalPages}</span>
        )}
      </div>

      <div className="products-grid" role="grid" aria-label="Product inventory">
        {currentProducts.map(product => (
          <div key={product.id} className="product-card" role="gridcell">
            <div className="product-header">
              <h3>{product.productName}</h3>
              <span 
                className={`availability-badge ${getAvailabilityBadgeClass(product.availability)}`}
                aria-label={`Availability: ${product.availability}`}
              >
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
              <button 
                className="edit-btn" 
                onClick={() => handleEditProduct(product)}
                aria-label={`Edit ${product.productName}`}
              >
                Edit
              </button>
              <button 
                className="delete-btn" 
                onClick={() => handleDeleteProduct(product)}
                aria-label={`Delete ${product.productName}`}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination" role="navigation" aria-label="Product pagination">
          <button
            className="pagination-btn"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Go to previous page"
            aria-disabled={currentPage === 1}
          >
            Previous
          </button>
          
          <div className="pagination-numbers" role="group" aria-label="Page numbers">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                className={`pagination-number ${currentPage === index + 1 ? 'active' : ''}`}
                onClick={() => paginate(index + 1)}
                aria-label={`Go to page ${index + 1}`}
                aria-current={currentPage === index + 1 ? 'page' : undefined}
              >
                {index + 1}
              </button>
            ))}
          </div>
          
          <button
            className="pagination-btn"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Go to next page"
            aria-disabled={currentPage === totalPages}
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
          isSaving={isSaving}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="dialog-overlay" role="dialog" aria-modal="true" aria-labelledby="delete-dialog-title" aria-describedby="delete-dialog-description">
          <div className="dialog-modal" ref={deleteDialogRef}>
            <h3 id="delete-dialog-title">Confirm Delete</h3>
            <p id="delete-dialog-description">
              Are you sure you want to delete "{productToDelete?.productName}"? 
              This action cannot be undone.
            </p>
            <div className="dialog-actions">
              <button 
                className="cancel-btn" 
                onClick={cancelDelete}
                disabled={isDeleting}
                aria-label="Cancel deletion"
              >
                Cancel
              </button>
              <button 
                className="delete-btn" 
                onClick={confirmDelete}
                disabled={isDeleting}
                aria-label={`Delete ${productToDelete?.productName}`}
              >
                {isDeleting ? (
                  <LoadingSpinner size="small" text="Deleting..." />
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ProductForm = ({ product, categories, onSave, onCancel, isSaving }) => {
  const [formData, setFormData] = useState(product);
  const formRef = useFocusTrap(true);

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
    <div className="form-overlay" role="dialog" aria-modal="true" aria-labelledby="form-title">
      <div className="form-modal" ref={formRef}>
        <h3 id="form-title">{product.id === -1 ? 'Add New Product' : 'Edit Product'}</h3>
        <form onSubmit={handleSubmit} aria-label="Product information form">
          <div className="form-group">
            <label htmlFor="product-name">Product Name</label>
            <input
              id="product-name"
              type="text"
              value={formData.productName}
              onChange={(e) => handleInputChange('productName', e.target.value)}
              required
              aria-required="true"
              aria-describedby="product-name-help"
            />
            <span id="product-name-help" className="visually-hidden">Enter the name of the product</span>
          </div>

          <div className="form-group">
            <label htmlFor="product-price">Price</label>
            <input
              id="product-price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
              required
              aria-required="true"
              aria-describedby="product-price-help"
            />
            <span id="product-price-help" className="visually-hidden">Enter the product price in dollars</span>
          </div>

          <div className="form-group">
            <label htmlFor="product-stock">Stock Count</label>
            <input
              id="product-stock"
              type="number"
              min="0"
              value={formData.stockCount}
              onChange={(e) => handleInputChange('stockCount', parseInt(e.target.value))}
              required
              aria-required="true"
              aria-describedby="product-stock-help"
            />
            <span id="product-stock-help" className="visually-hidden">Enter the number of items in stock</span>
          </div>

          <div className="form-group">
            <label htmlFor="product-availability">Availability</label>
            <select
              id="product-availability"
              value={formData.availability}
              onChange={(e) => handleInputChange('availability', e.target.value)}
              aria-describedby="product-availability-help"
            >
              <option value={Availability.AVAILABLE}>Available</option>
              <option value={Availability.COMING}>Coming</option>
              <option value={Availability.DISCONTINUED}>Discontinued</option>
            </select>
            <span id="product-availability-help" className="visually-hidden">Select the product availability status</span>
          </div>

          <div className="form-group">
            <fieldset aria-describedby="categories-help">
              <legend>Categories</legend>
              <div className="category-checkboxes">
                {categories.map(category => (
                  <label key={category.id} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.category.some(cat => cat.id === category.id)}
                      onChange={() => handleCategoryChange(category.id)}
                      aria-describedby={`category-${category.id}-help`}
                    />
                    {category.name}
                    <span id={`category-${category.id}-help`} className="visually-hidden">
                      {formData.category.some(cat => cat.id === category.id) 
                        ? `Remove ${category.name} category` 
                        : `Add ${category.name} category`}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <span id="categories-help" className="visually-hidden">Select one or more categories for the product</span>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={onCancel} 
              className="cancel-btn"
              disabled={isSaving}
              aria-label="Cancel product form"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="save-btn"
              disabled={isSaving}
              aria-label={product.id === -1 ? 'Add new product' : 'Update product'}
            >
              {isSaving ? (
                <LoadingSpinner size="small" text="Saving..." />
              ) : (
                'Save'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryView;
