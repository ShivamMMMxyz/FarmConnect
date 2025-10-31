const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { authMiddleware, isCustomer } = require('../middleware/auth');

// @route   POST /api/orders
// @desc    Create new order
// @access  Private (Customer)
router.post('/', authMiddleware, isCustomer, async (req, res) => {
  try {
    const { orderType, items, totalAmount, deliveryAddress } = req.body;

    const order = new Order({
      customer: req.user._id,
      orderType,
      items,
      totalAmount,
      deliveryAddress
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error creating order',
      error: error.message 
    });
  }
});

// @route   GET /api/orders/customer
// @desc    Get orders for logged-in customer
// @access  Private (Customer)
router.get('/customer', authMiddleware, isCustomer, async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching orders',
      error: error.message 
    });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email phone');

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    // Check if user is authorized to view this order
    if (order.customer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to view this order' 
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching order',
      error: error.message 
    });
  }
});

module.exports = router;
