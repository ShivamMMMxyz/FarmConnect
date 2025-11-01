const axios = require('axios');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

// Get crop recommendation
exports.getCropRecommendation = async (req, res) => {
  try {
    const { N, P, K, temperature, humidity, ph, rainfall } = req.body;

    // Validate input
    if (!N || !P || !K || !temperature || !humidity || !ph || !rainfall) {
      return res.status(400).json({
        success: false,
        message: 'All parameters are required: N, P, K, temperature, humidity, ph, rainfall'
      });
    }

    // Call ML service
    const mlResponse = await axios.post(`${ML_SERVICE_URL}/predict`, {
      N: parseFloat(N),
      P: parseFloat(P),
      K: parseFloat(K),
      temperature: parseFloat(temperature),
      humidity: parseFloat(humidity),
      ph: parseFloat(ph),
      rainfall: parseFloat(rainfall)
    });

    res.status(200).json({
      success: true,
      data: mlResponse.data,
      message: 'Crop recommendation generated successfully'
    });

  } catch (error) {
    console.error('ML Service Error:', error.response?.data || error.message);
    
    res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.detail || 'Failed to get crop recommendation',
      error: error.message
    });
  }
};

// Get ML model info
exports.getModelInfo = async (req, res) => {
  try {
    const mlResponse = await axios.get(`${ML_SERVICE_URL}/model-info`);

    res.status(200).json({
      success: true,
      data: mlResponse.data
    });

  } catch (error) {
    console.error('ML Service Error:', error.message);
    
    res.status(500).json({
      success: false,
      message: 'Failed to get model information',
      error: error.message
    });
  }
};

// Health check for ML service
exports.checkMLServiceHealth = async (req, res) => {
  try {
    const mlResponse = await axios.get(`${ML_SERVICE_URL}/health`);

    res.status(200).json({
      success: true,
      data: mlResponse.data,
      ml_service_url: ML_SERVICE_URL
    });

  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'ML service is not available',
      ml_service_url: ML_SERVICE_URL,
      error: error.message
    });
  }
};
