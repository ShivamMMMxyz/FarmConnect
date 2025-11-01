import api from './api';

const authService = {
  // Register new user
  register: async (userData) => {
    const { data } = await api.post('/auth/register', userData);
    return data;
  },

  // Login user
  login: async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    return data;
  },

  // Get current user
  getCurrentUser: async () => {
    const { data } = await api.get('/auth/me');
    return data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const { data } = await api.put('/auth/profile', profileData);
    return data;
  },

  // Change password
  changePassword: async (passwordData) => {
    const { data } = await api.put('/auth/change-password', passwordData);
    return data;
  }
};

export default authService;
