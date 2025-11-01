import api from './api';

const orderService = {
  // Get all user orders
  getMyOrders: async () => {
    const { data } = await api.get('/orders');
    return data;
  },

  // Get order by ID
  getOrderById: async (id) => {
    const { data } = await api.get(`/orders/${id}`);
    return data;
  },

  // Create new order
  createOrder: async (orderData) => {
    const { data } = await api.post('/orders', orderData);
    return data;
  },

  // Update order status
  updateOrderStatus: async (id, status) => {
    const { data } = await api.put(`/orders/${id}/status`, { status });
    return data;
  },

  // Cancel order
  cancelOrder: async (id) => {
    const { data } = await api.put(`/orders/${id}/cancel`);
    return data;
  }
};

export default orderService;
