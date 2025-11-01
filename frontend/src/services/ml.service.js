import axios from 'axios';

const ML_SERVICE_URL = import.meta.env.VITE_ML_SERVICE_URL || 'http://localhost:8001';

const mlService = {
  // Get crop recommendation
  getCropRecommendation: async (soilData) => {
    const { data } = await axios.post(`${ML_SERVICE_URL}/predict`, soilData);
    return data;
  },

  // Get ML model info
  getModelInfo: async () => {
    const { data } = await axios.get(`${ML_SERVICE_URL}/model-info`);
    return data;
  },

  // Check ML service health
  checkHealth: async () => {
    const { data } = await axios.get(`${ML_SERVICE_URL}/health`);
    return data;
  }
};

export default mlService;
