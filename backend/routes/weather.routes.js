const express = require('express');
const router = express.Router();
const axios = require('axios');
const { authMiddleware } = require('../middleware/auth');

// @route   GET /api/weather/current
// @desc    Get current weather for a location
// @access  Private
router.get('/current', authMiddleware, async (req, res) => {
  try {
    const { city, lat, lon } = req.query;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: 'Weather API key not configured'
      });
    }

    let url;
    if (lat && lon) {
      // Use coordinates if provided
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    } else if (city) {
      // Use city name
      url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please provide either city name or coordinates (lat, lon)'
      });
    }

    const response = await axios.get(url);
    const weatherData = response.data;

    // Format the response
    const formattedData = {
      success: true,
      data: {
        location: weatherData.name,
        country: weatherData.sys.country,
        temperature: Math.round(weatherData.main.temp),
        feelsLike: Math.round(weatherData.main.feels_like),
        humidity: weatherData.main.humidity,
        pressure: weatherData.main.pressure,
        windSpeed: weatherData.wind.speed,
        windDirection: weatherData.wind.deg,
        description: weatherData.weather[0].description,
        main: weatherData.weather[0].main,
        icon: weatherData.weather[0].icon,
        visibility: weatherData.visibility,
        cloudiness: weatherData.clouds.all,
        sunrise: weatherData.sys.sunrise,
        sunset: weatherData.sys.sunset,
        timezone: weatherData.timezone,
        timestamp: weatherData.dt
      }
    };

    res.json(formattedData);
  } catch (error) {
    console.error('Weather API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error fetching weather data',
      error: error.message
    });
  }
});

// @route   GET /api/weather/forecast
// @desc    Get 5-day weather forecast
// @access  Private
router.get('/forecast', authMiddleware, async (req, res) => {
  try {
    const { city, lat, lon } = req.query;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: 'Weather API key not configured'
      });
    }

    let url;
    if (lat && lon) {
      url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    } else if (city) {
      url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please provide either city name or coordinates'
      });
    }

    const response = await axios.get(url);
    const forecastData = response.data;

    // Format the forecast (daily summary)
    const dailyForecasts = {};
    forecastData.list.forEach(item => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      if (!dailyForecasts[date]) {
        dailyForecasts[date] = {
          date: item.dt,
          temp: item.main.temp,
          tempMin: item.main.temp_min,
          tempMax: item.main.temp_max,
          description: item.weather[0].description,
          icon: item.weather[0].icon,
          humidity: item.main.humidity,
          windSpeed: item.wind.speed
        };
      }
    });

    res.json({
      success: true,
      data: {
        location: forecastData.city.name,
        country: forecastData.city.country,
        forecasts: Object.values(dailyForecasts).slice(0, 5)
      }
    });
  } catch (error) {
    console.error('Weather Forecast Error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching weather forecast',
      error: error.message
    });
  }
});

module.exports = router;
