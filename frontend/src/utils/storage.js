// Store token in localStorage
export const storeToken = (token) => {
  localStorage.setItem('token', token);
};

// Get token from localStorage
export const getToken = () => {
  return localStorage.getItem('token');
};

// Remove token from localStorage
export const removeToken = () => {
  localStorage.removeItem('token');
};

// Store user data in localStorage
export const storeUserData = (userData) => {
  localStorage.setItem('user', JSON.stringify(userData));
};

// Get user data from localStorage
export const getUserData = () => {
  const userData = localStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
};

// Remove user data from localStorage
export const removeUserData = () => {
  localStorage.removeItem('user');
};

// Logout
export const logout = () => {
  removeToken();
  removeUserData();
};

// Aliases for compatibility
export const clearToken = removeToken;
export const clearUserData = removeUserData;
