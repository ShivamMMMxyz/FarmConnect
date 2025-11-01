# Weather Feature Setup Guide

## Overview
A beautiful weather widget has been added to the Farmer Dashboard that displays real-time weather information using the OpenWeather API.

## Setup Instructions

### 1. Get Your OpenWeather API Key
1. Visit [OpenWeather API](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to API Keys section
4. Copy your API key

### 2. Add API Key to Backend .env
Open `backend/.env` and add:
```
OPENWEATHER_API_KEY=your_actual_api_key_here
```

### 3. Restart Backend Server
```powershell
cd backend
npm run dev
```

## Features

### Weather Widget Displays:
- **Current Temperature** - Real-time temperature in Celsius
- **Weather Condition** - Clear description with icon
- **Feels Like** - Apparent temperature
- **Humidity** - Percentage humidity
- **Wind Speed & Direction** - Speed in m/s with compass direction
- **Atmospheric Pressure** - In hPa
- **Cloudiness** - Cloud coverage percentage
- **Visibility** - In kilometers
- **Sunrise & Sunset** - Local times
- **Search Functionality** - Search weather for any city

### Widget Location
- Displayed prominently on the **Farmer Dashboard** (`/farmer/dashboard`)
- Auto-loads weather for farmer's registered farm location
- Allows manual city search

## API Endpoints

### Backend Routes Created:
- `GET /api/weather/current?city=CityName` - Get current weather by city
- `GET /api/weather/current?lat=X&lon=Y` - Get current weather by coordinates
- `GET /api/weather/forecast?city=CityName` - Get 5-day forecast (ready for future use)

## Files Created/Modified

### Backend:
- ✅ `backend/routes/weather.routes.js` - Weather API proxy routes
- ✅ `backend/server.js` - Mounted weather routes
- ✅ `backend/.env.example` - Added API key example

### Frontend:
- ✅ `frontend/src/services/weather.service.js` - Weather service layer
- ✅ `frontend/src/components/WeatherWidget.jsx` - Weather widget component
- ✅ `frontend/src/components/WeatherWidget.css` - Beautiful gradient styling
- ✅ `frontend/src/pages/farmer/FarmerDashboard.jsx` - Integrated widget

## Widget Features

### Automatic Location Detection
- Reads farmer's `farmLocation` from user profile
- Automatically fetches weather on dashboard load

### Manual Search
- Search box at the top of the widget
- Type any city name and click search (🔍)
- Instantly updates weather data

### Beautiful UI
- Purple gradient background
- Smooth animations
- Responsive design (mobile, tablet, desktop)
- Weather icons from OpenWeather
- Clean, modern card layout

### Weather Details Grid
Displays 6 key metrics:
1. **Feels Like** temperature
2. **Humidity** percentage
3. **Wind Speed** with direction
4. **Atmospheric Pressure**
5. **Cloudiness** percentage
6. **Visibility** in km

### Sun Times
- Sunrise time with 🌅 icon
- Sunset time with 🌇 icon
- Formatted in local time

## Error Handling
- Displays user-friendly error messages
- Handles invalid city names
- Handles API key issues
- Dismissible error alerts

## Usage Example

### For Farmers:
1. Log in as a farmer
2. Navigate to Farmer Dashboard
3. Weather widget loads automatically with your farm location
4. To check another city:
   - Type city name in search box
   - Click search button
   - Weather updates instantly

## Testing Without API Key
If you haven't added the API key yet:
- Widget will show "Weather API key not configured" error
- Add your key to `backend/.env` and restart the server

## Future Enhancements (Already Built - Ready to Use)
- 5-day weather forecast endpoint is ready
- Can add forecast cards below current weather
- Can add weather alerts/warnings
- Can add hourly forecast

## Security
- API key stored securely in backend `.env`
- Never exposed to frontend
- Backend acts as proxy to OpenWeather API

## Cost
- **Free tier**: 1,000 API calls per day
- More than enough for typical farm usage
- One call per weather check

## Responsive Design
- **Desktop**: Full layout with all details
- **Tablet**: Optimized grid layout
- **Mobile**: Single column, touch-friendly

Enjoy your new weather feature! 🌤️
