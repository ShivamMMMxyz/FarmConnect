const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { authMiddleware, isFarmer } = require('../middleware/auth');

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
  // Show only products that are marked inStock and have quantity > 0 for public listing
  let query = { inStock: true, quantity: { $gt: 0 } };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const products = await Product.find(query)
      .populate('farmer', 'name phone farmLocation')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching products',
      error: error.message 
    });
  }
});

// @route   GET /api/products/farmer
// @desc    Get products by logged-in farmer
// @access  Private (Farmer)
router.get('/farmer', authMiddleware, isFarmer, async (req, res) => {
  try {
    const products = await Product.find({ farmer: req.user._id })
      .sort({ createdAt: -1 });

    // Ensure returned objects always have a numeric `quantity` property (legacy documents may lack it)
    const normalized = products.map(p => {
      const obj = p.toObject();
      if (obj.quantity === undefined || obj.quantity === null) obj.quantity = 0;
      return obj;
    });

    res.json({
      success: true,
      count: normalized.length,
      data: normalized
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching your products',
      error: error.message 
    });
  }
});

// @route   POST /api/products
// @desc    Add new product
// @access  Private (Farmer)
router.post('/', authMiddleware, isFarmer, async (req, res) => {
  try {
    const { name, category, description, price, unit, inStock, image, quantity } = req.body;

    const product = new Product({
      name,
      category,
      description,
      price,
      unit,
      quantity: quantity !== undefined ? quantity : 0,
      inStock: inStock !== undefined ? inStock : true,
      image,
      farmer: req.user._id,
      farmerName: req.user.name,
      farmLocation: req.user.farmLocation
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      data: product
    });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error adding product',
      error: error.message 
    });
  }
});

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private (Farmer)
router.put('/:id', authMiddleware, isFarmer, async (req, res) => {
  try {
    const product = await Product.findOne({ 
      _id: req.params.id, 
      farmer: req.user._id 
    });

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found or unauthorized' 
      });
    }

    const updates = req.body;
    Object.keys(updates).forEach(key => {
      product[key] = updates[key];
    });

    await product.save();

    res.json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error updating product',
      error: error.message 
    });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product
// @access  Private (Farmer)
router.delete('/:id', authMiddleware, isFarmer, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ 
      _id: req.params.id, 
      farmer: req.user._id 
    });

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found or unauthorized' 
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting product',
      error: error.message 
    });
  }
});

module.exports = router;
