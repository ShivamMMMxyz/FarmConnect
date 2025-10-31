import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

// Product API
export const productAPI = {
  getAllProducts: (params) => api.get('/products', { params }),
  getFarmerProducts: () => api.get('/products/farmer'),
  addProduct: (productData) => api.post('/products', productData),
  updateProduct: (id, productData) => api.put(`/products/${id}`, productData),
  deleteProduct: (id) => api.delete(`/products/${id}`),
};

// Tool API
export const toolAPI = {
  getAllTools: (params) => api.get('/tools', { params }),
  getFarmerTools: () => api.get('/tools/farmer'),
  addTool: (toolData) => api.post('/tools', toolData),
  updateTool: (id, toolData) => api.put(`/tools/${id}`, toolData),
  deleteTool: (id) => api.delete(`/tools/${id}`),
};

// Order API
export const orderAPI = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getCustomerOrders: () => api.get('/orders/customer'),
  getOrderById: (id) => api.get(`/orders/${id}`),
};

export default api;
