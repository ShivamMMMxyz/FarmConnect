import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getUserData } from './utils/storage';

// Auth Pages
import Welcome from './pages/Welcome';
// import Login from './pages/Login';
import Login from './pages/Login';
import Register from './pages/Register';

// Farmer Pages
// import FarmerDashboard from './pages/farmer/FarmerDashboard';
import FarmerDashboard from './pages/FarmerDashboard';
// import AddProduct from './pages/farmer/AddProduct';
import AddProduct from './pages/AddProduct';

import MyProducts from './pages/MyProducts';
import AddTool from './pages/AddTool';
import MyTools from './pages/MyTools';

// Customer Pages
import CustomerDashboard from './pages/CustomerDashboard';
import BrowseProducts from './pages//BrowseProducts';
import BrowseTools from './pages/BrowseTools';
import Cart from './pages/Cart';
import Orders from './pages/Orders';

import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = getUserData();
    setUser(userData);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={!user ? <Welcome /> : <Navigate to={user.role === 'farmer' ? '/farmer/dashboard' : '/customer/dashboard'} />} />
        <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to={user.role === 'farmer' ? '/farmer/dashboard' : '/customer/dashboard'} />} />
        <Route path="/register" element={!user ? <Register setUser={setUser} /> : <Navigate to={user.role === 'farmer' ? '/farmer/dashboard' : '/customer/dashboard'} />} />

        {/* Farmer Routes */}
        <Route path="/farmer/dashboard" element={user?.role === 'farmer' ? <FarmerDashboard user={user} setUser={setUser} /> : <Navigate to="/login" />} />
        <Route path="/farmer/products" element={user?.role === 'farmer' ? <MyProducts user={user} setUser={setUser} /> : <Navigate to="/login" />} />
        <Route path="/farmer/products/add" element={user?.role === 'farmer' ? <AddProduct user={user} setUser={setUser} /> : <Navigate to="/login" />} />
        <Route path="/farmer/tools" element={user?.role === 'farmer' ? <MyTools user={user} setUser={setUser} /> : <Navigate to="/login" />} />
        <Route path="/farmer/tools/add" element={user?.role === 'farmer' ? <AddTool user={user} setUser={setUser} /> : <Navigate to="/login" />} />

        {/* Customer Routes */}
        <Route path="/customer/dashboard" element={user?.role === 'customer' ? <CustomerDashboard user={user} setUser={setUser} /> : <Navigate to="/login" />} />
        <Route path="/customer/products" element={user?.role === 'customer' ? <BrowseProducts user={user} setUser={setUser} /> : <Navigate to="/login" />} />
        <Route path="/customer/tools" element={user?.role === 'customer' ? <BrowseTools user={user} setUser={setUser} /> : <Navigate to="/login" />} />
        <Route path="/customer/cart" element={user?.role === 'customer' ? <Cart user={user} setUser={setUser} /> : <Navigate to="/login" />} />
        <Route path="/customer/orders" element={user?.role === 'customer' ? <Orders user={user} setUser={setUser} /> : <Navigate to="/login" />} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
