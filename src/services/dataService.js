import { generateCategories, generateProducts, Availability } from '../data/mockData';

/**
 * Mock data service that mimics the Vaadin app's MockDataService
 */
class DataService {
  constructor() {
    this.categories = generateCategories();
    this.products = generateProducts(this.categories);
    this.nextProductId = this.products.length + 1;
    this.nextCategoryId = this.categories.length + 1;
  }

  // Singleton pattern
  static getInstance() {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  getAllProducts() {
    return [...this.products];
  }

  getAllCategories() {
    return [...this.categories];
  }

  updateProduct(product) {
    if (product.id < 0) {
      // New product
      product.id = this.nextProductId++;
      this.products.push(product);
      return product;
    }

    const index = this.products.findIndex(p => p.id === product.id);
    if (index !== -1) {
      this.products[index] = product;
      return product;
    }

    throw new Error(`Product with id ${product.id} not found`);
  }

  getProductById(productId) {
    return this.products.find(p => p.id === productId) || null;
  }

  updateCategory(category) {
    if (category.id < 0) {
      category.id = this.nextCategoryId++;
      this.categories.push(category);
      return category;
    }

    const index = this.categories.findIndex(c => c.id === category.id);
    if (index !== -1) {
      this.categories[index] = category;
      return category;
    }

    throw new Error(`Category with id ${category.id} not found`);
  }

  deleteCategory(categoryId) {
    const index = this.categories.findIndex(c => c.id === categoryId);
    if (index !== -1) {
      this.categories.splice(index, 1);
      // Remove category from all products
      this.products.forEach(product => {
        product.category = product.category.filter(cat => cat.id !== categoryId);
      });
      return true;
    }
    return false;
  }

  deleteProduct(productId) {
    const index = this.products.findIndex(p => p.id === productId);
    if (index !== -1) {
      this.products.splice(index, 1);
      return true;
    }
    throw new Error(`Product with id ${productId} not found`);
  }

  searchProducts(query) {
    const lowercaseQuery = query.toLowerCase();
    return this.products.filter(product => 
      product.productName.toLowerCase().includes(lowercaseQuery) ||
      product.category.some(cat => cat.name.toLowerCase().includes(lowercaseQuery))
    );
  }

  filterProductsByCategory(categoryId) {
    return this.products.filter(product => 
      product.category.some(cat => cat.id === categoryId)
    );
  }
}

export default DataService.getInstance();
export { Availability };
