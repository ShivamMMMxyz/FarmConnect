const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token, authorization denied' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from token
    req.user = await User.findById(decoded.userId).select('-password');
    
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Token is not valid' 
    });
  }
};

// Middleware to check if user is a farmer
const isFarmer = (req, res, next) => {
  if (req.user.role !== 'farmer') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Farmers only.' 
    });
  }
  next();
};

// Middleware to check if user is a customer
const isCustomer = (req, res, next) => {
  if (req.user.role !== 'customer') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Customers only.' 
    });
  }
  next();
};

module.exports = { authMiddleware, isFarmer, isCustomer };
