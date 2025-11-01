import api from './api';

const productService = {
  // Get all products
  getAllProducts: async (params = {}) => {
    const { data } = await api.get('/products', { params });
    return data;
  },

  // Get product by ID
  getProductById: async (id) => {
    const { data } = await api.get(`/products/${id}`);
    return data;
  },

  // Get farmer's products
  getMyProducts: async () => {
    const { data } = await api.get('/products/farmer');
    return data;
  },

  // Create new product
  createProduct: async (productData) => {
    const { data } = await api.post('/products', productData);
    return data;
  },

  // Update product
  updateProduct: async (id, productData) => {
    const { data } = await api.put(`/products/${id}`, productData);
    return data;
  },

  // Delete product
  deleteProduct: async (id) => {
    const { data } = await api.delete(`/products/${id}`);
    return data;
  },

  // Search products
  searchProducts: async (searchTerm) => {
    const { data } = await api.get(`/products/search?q=${searchTerm}`);
    return data;
  },

  // Filter products by category
  getProductsByCategory: async (category) => {
    const { data } = await api.get(`/products?category=${category}`);
    return data;
  }
};

export default productService;
