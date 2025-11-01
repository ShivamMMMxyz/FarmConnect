import api from './api';

// Auth Services
export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
};

// Product Services
export const productService = {
  getAllProducts: (params) => api.get('/products', { params }),
  getProductById: (id) => api.get(`/products/${id}`),
  createProduct: (productData) => api.post('/products', productData),
  updateProduct: (id, productData) => api.put(`/products/${id}`, productData),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  getMyProducts: () => api.get('/products/farmer'),
};

// Tool Services
export const toolService = {
  getAllTools: (params) => api.get('/tools', { params }),
  getToolById: (id) => api.get(`/tools/${id}`),
  createTool: (toolData) => api.post('/tools', toolData),
  updateTool: (id, toolData) => api.put(`/tools/${id}`, toolData),
  deleteTool: (id) => api.delete(`/tools/${id}`),
  getMyTools: () => api.get('/tools/my-tools'),
};

// Order Services
export const orderService = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getMyOrders: () => api.get('/orders/my-orders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
  updateOrderStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
};

// ML Services
export const mlService = {
  predictCrop: (soilData) => api.post('/ml/predict', soilData),
  getModelInfo: () => api.get('/ml/model-info'),
  checkMLHealth: () => api.get('/ml/health'),
};
