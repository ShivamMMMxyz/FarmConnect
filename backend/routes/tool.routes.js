const express = require('express');
const router = express.Router();
const Tool = require('../models/Tool');
const { authMiddleware, isFarmer } = require('../middleware/auth');

// @route   GET /api/tools
// @desc    Get all available tools
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { type, search } = req.query;
    let query = { isAvailable: true };

    if (type && type !== 'all') {
      query.type = type;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const tools = await Tool.find(query)
      .populate('farmer', 'name phone farmLocation')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: tools.length,
      tools
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching tools',
      error: error.message 
    });
  }
});

// @route   GET /api/tools/farmer
// @desc    Get tools by logged-in farmer
// @access  Private (Farmer)
router.get('/farmer', authMiddleware, isFarmer, async (req, res) => {
  try {
    const tools = await Tool.find({ farmer: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: tools.length,
      tools
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching your tools',
      error: error.message 
    });
  }
});

// @route   POST /api/tools
// @desc    Add new tool for rent
// @access  Private (Farmer)
router.post('/', authMiddleware, isFarmer, async (req, res) => {
  try {
    const { name, type, description, rentalPrice, condition, images, specifications } = req.body;

    const tool = new Tool({
      name,
      type,
      description,
      rentalPrice,
      condition,
      images: images || [],
      specifications,
      farmer: req.user._id,
      farmerName: req.user.name,
      location: req.user.farmLocation
    });

    await tool.save();

    res.status(201).json({
      success: true,
      message: 'Tool added successfully',
      tool
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error adding tool',
      error: error.message 
    });
  }
});

// @route   PUT /api/tools/:id
// @desc    Update tool
// @access  Private (Farmer)
router.put('/:id', authMiddleware, isFarmer, async (req, res) => {
  try {
    const tool = await Tool.findOne({ 
      _id: req.params.id, 
      farmer: req.user._id 
    });

    if (!tool) {
      return res.status(404).json({ 
        success: false, 
        message: 'Tool not found or unauthorized' 
      });
    }

    const updates = req.body;
    Object.keys(updates).forEach(key => {
      tool[key] = updates[key];
    });

    await tool.save();

    res.json({
      success: true,
      message: 'Tool updated successfully',
      tool
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error updating tool',
      error: error.message 
    });
  }
});

// @route   DELETE /api/tools/:id
// @desc    Delete tool
// @access  Private (Farmer)
router.delete('/:id', authMiddleware, isFarmer, async (req, res) => {
  try {
    const tool = await Tool.findOneAndDelete({ 
      _id: req.params.id, 
      farmer: req.user._id 
    });

    if (!tool) {
      return res.status(404).json({ 
        success: false, 
        message: 'Tool not found or unauthorized' 
      });
    }

    res.json({
      success: true,
      message: 'Tool deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting tool',
      error: error.message 
    });
  }
});

module.exports = router;
