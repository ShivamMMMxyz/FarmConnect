const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const mlController = require('../controllers/ml.controller');

// @route   POST /api/ml/predict
// @desc    Get crop recommendation
// @access  Protected (Farmers only)
router.post('/predict', authMiddleware, mlController.getCropRecommendation);

// @route   GET /api/ml/model-info
// @desc    Get ML model information
// @access  Protected
router.get('/model-info', authMiddleware, mlController.getModelInfo);

// @route   GET /api/ml/health
// @desc    Check ML service health
// @access  Public
router.get('/health', mlController.checkMLServiceHealth);

module.exports = router;
