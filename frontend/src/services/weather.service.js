import api from './api';

const weatherService = {
  // Get current weather by city name
  getCurrentWeatherByCity: async (city) => {
    const { data } = await api.get('/weather/current', {
      params: { city }
    });
    return data;
  },

  // Get current weather by coordinates
  getCurrentWeatherByCoords: async (lat, lon) => {
    const { data } = await api.get('/weather/current', {
      params: { lat, lon }
    });
    return data;
  },

  // Get 5-day forecast by city
  getForecastByCity: async (city) => {
    const { data } = await api.get('/weather/forecast', {
      params: { city }
    });
    return data;
  },

  // Get 5-day forecast by coordinates
  getForecastByCoords: async (lat, lon) => {
    const { data } = await api.get('/weather/forecast', {
      params: { lat, lon }
    });
    return data;
  }
};

export default weatherService;
