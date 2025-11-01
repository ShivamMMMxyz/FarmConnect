import { useState, useEffect } from 'react';
// import weatherService from '../../services/weather.service';
import weatherService from '../services/weather.service';
import './WeatherWidget.css';

const WeatherWidget = ({ location }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [city, setCity] = useState(location || '');
  const [searchCity, setSearchCity] = useState('');

  useEffect(() => {
    if (city) {
      fetchWeather(city);
    }
  }, [city]);

  const fetchWeather = async (cityName) => {
    try {
      setLoading(true);
      setError('');
      const response = await weatherService.getCurrentWeatherByCity(cityName);
      setWeather(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch weather data');
      console.error('Weather error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchCity.trim()) {
      setCity(searchCity.trim());
    }
  };

  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const formatTime = (timestamp, timezone) => {
    const date = new Date((timestamp + timezone) * 1000);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: 'UTC'
    });
  };

  const getWindDirection = (degrees) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  if (loading && !weather) {
    return (
      <div className="weather-widget">
        <div className="weather-header">
          <h3>🌤️ Weather</h3>
        </div>
        <div className="weather-loading">
          <div className="spinner"></div>
          <p>Loading weather...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="weather-widget">
      <div className="weather-header">
        <h3>🌤️ Weather</h3>
        <form onSubmit={handleSearch} className="weather-search">
          <input
            type="text"
            placeholder="Enter city name..."
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            className="weather-search-input"
          />
          <button type="submit" className="weather-search-btn">
            🔍
          </button>
        </form>
      </div>

      {error && (
        <div className="weather-error">
          <p>{error}</p>
          <button onClick={() => setError('')} className="btn-dismiss">×</button>
        </div>
      )}

      {weather && !error && (
        <div className="weather-content">
          <div className="weather-main">
            <div className="weather-location">
              <h4>{weather.location}, {weather.country}</h4>
              <p className="weather-description">{weather.description}</p>
            </div>
            <div className="weather-temp-display">
              <img 
                src={getWeatherIcon(weather.icon)} 
                alt={weather.main}
                className="weather-icon-large"
              />
              <div className="temperature-large">
                {weather.temperature}°C
              </div>
            </div>
          </div>

          <div className="weather-details-grid">
            <div className="weather-detail-item">
              <span className="detail-icon">🌡️</span>
              <div className="detail-content">
                <span className="detail-label">Feels Like</span>
                <span className="detail-value">{weather.feelsLike}°C</span>
              </div>
            </div>

            <div className="weather-detail-item">
              <span className="detail-icon">💧</span>
              <div className="detail-content">
                <span className="detail-label">Humidity</span>
                <span className="detail-value">{weather.humidity}%</span>
              </div>
            </div>

            <div className="weather-detail-item">
              <span className="detail-icon">💨</span>
              <div className="detail-content">
                <span className="detail-label">Wind Speed</span>
                <span className="detail-value">
                  {weather.windSpeed} m/s {getWindDirection(weather.windDirection)}
                </span>
              </div>
            </div>

            <div className="weather-detail-item">
              <span className="detail-icon">🔽</span>
              <div className="detail-content">
                <span className="detail-label">Pressure</span>
                <span className="detail-value">{weather.pressure} hPa</span>
              </div>
            </div>

            <div className="weather-detail-item">
              <span className="detail-icon">☁️</span>
              <div className="detail-content">
                <span className="detail-label">Cloudiness</span>
                <span className="detail-value">{weather.cloudiness}%</span>
              </div>
            </div>

            <div className="weather-detail-item">
              <span className="detail-icon">👁️</span>
              <div className="detail-content">
                <span className="detail-label">Visibility</span>
                <span className="detail-value">{(weather.visibility / 1000).toFixed(1)} km</span>
              </div>
            </div>
          </div>

          <div className="weather-sun-times">
            <div className="sun-time">
              <span className="sun-icon">🌅</span>
              <div>
                <span className="sun-label">Sunrise</span>
                <span className="sun-value">{formatTime(weather.sunrise, weather.timezone)}</span>
              </div>
            </div>
            <div className="sun-time">
              <span className="sun-icon">🌇</span>
              <div>
                <span className="sun-label">Sunset</span>
                <span className="sun-value">{formatTime(weather.sunset, weather.timezone)}</span>
              </div>
            </div>
          </div>

          <div className="weather-footer">
            <p className="weather-updated">
              Last updated: {new Date(weather.timestamp * 1000).toLocaleTimeString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
