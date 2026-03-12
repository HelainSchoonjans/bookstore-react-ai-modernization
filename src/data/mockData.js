// Mock data generator for the bookstore app
export const Availability = {
  AVAILABLE: 'AVAILABLE',
  COMING: 'COMING',
  DISCONTINUED: 'DISCONTINUED'
};

// Generate mock categories
export const generateCategories = () => {
  return [
    { id: 1, name: 'Fiction' },
    { id: 2, name: 'Non-Fiction' },
    { id: 3, name: 'Science Fiction' },
    { id: 4, name: 'Mystery' },
    { id: 5, name: 'Romance' },
    { id: 6, name: 'Technology' },
    { id: 7, name: 'Business' },
    { id: 8, name: 'History' }
  ];
};

// Generate mock products
export const generateProducts = (categories) => {
  const products = [
    {
      id: 1,
      productName: 'The Great Gatsby',
      price: 12.99,
      category: [categories[0]], // Fiction
      stockCount: 25,
      availability: Availability.AVAILABLE
    },
    {
      id: 2,
      productName: 'To Kill a Mockingbird',
      price: 14.99,
      category: [categories[0]], // Fiction
      stockCount: 30,
      availability: Availability.AVAILABLE
    },
    {
      id: 3,
      productName: '1984',
      price: 13.99,
      category: [categories[0], categories[2]], // Fiction, Science Fiction
      stockCount: 15,
      availability: Availability.AVAILABLE
    },
    {
      id: 4,
      productName: 'Dune',
      price: 16.99,
      category: [categories[2]], // Science Fiction
      stockCount: 20,
      availability: Availability.AVAILABLE
    },
    {
      id: 5,
      productName: 'The Hobbit',
      price: 15.99,
      category: [categories[2]], // Science Fiction
      stockCount: 35,
      availability: Availability.AVAILABLE
    },
    {
      id: 6,
      productName: 'Sapiens',
      price: 18.99,
      category: [categories[1]], // Non-Fiction
      stockCount: 12,
      availability: Availability.AVAILABLE
    },
    {
      id: 7,
      productName: 'The Da Vinci Code',
      price: 14.99,
      category: [categories[3]], // Mystery
      stockCount: 28,
      availability: Availability.AVAILABLE
    },
    {
      id: 8,
      productName: 'Pride and Prejudice',
      price: 11.99,
      category: [categories[4]], // Romance
      stockCount: 22,
      availability: Availability.AVAILABLE
    },
    {
      id: 9,
      productName: 'Clean Code',
      price: 32.99,
      category: [categories[5]], // Technology
      stockCount: 18,
      availability: Availability.AVAILABLE
    },
    {
      id: 10,
      productName: 'The Lean Startup',
      price: 24.99,
      category: [categories[6]], // Business
      stockCount: 10,
      availability: Availability.COMING
    },
    {
      id: 11,
      productName: 'Steve Jobs',
      price: 19.99,
      category: [categories[1], categories[6]], // Non-Fiction, Business
      stockCount: 8,
      availability: Availability.AVAILABLE
    },
    {
      id: 12,
      productName: 'The Art of War',
      price: 9.99,
      category: [categories[7]], // History
      stockCount: 0,
      availability: Availability.DISCONTINUED
    }
  ];

  return products;
};
