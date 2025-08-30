# SeaWatch Guardian - API Setup Guide

## Required Data Types

Your dashboard needs to display these marine data types:

1. **Sea Level** (meters) - NOAA Tides & Currents API
2. **Water Temperature** (°C) - NDBC (National Data Buoy Center) API  
3. **Wind Speed** (m/s) - NDBC API
4. **Water Quality** (pH) - USGS Water Quality API

## Free APIs (No API Key Required)

### 1. NOAA Tides & Currents API
- **Purpose**: Sea level data
- **Rate Limit**: 1000 requests/hour
- **Stations**: Seattle (9447130), Miami (8727520), San Diego (9410230), Neah Bay (9443090)
- **Data**: Water levels in meters
- **Status**: ✅ Already configured

### 2. NDBC (National Data Buoy Center) API
- **Purpose**: Water temperature and wind speed
- **Rate Limit**: 1000 requests/hour
- **Buoys**: Miami (41012), San Diego (41013)
- **Data**: Temperature (°C), Wind Speed (m/s)
- **Status**: ✅ Already configured

### 3. USGS Water Quality API
- **Purpose**: Water quality parameters
- **Rate Limit**: 1000 requests/hour
- **Sites**: Various USGS monitoring stations
- **Data**: pH, temperature, dissolved oxygen
- **Status**: ✅ Already configured

## Optional Enhanced APIs (Require API Keys)

### 4. Stormglass Marine Weather API
- **Purpose**: Enhanced marine weather data
- **Rate Limit**: 100 requests/day (free tier)
- **Get API Key**: https://stormglass.io
- **Data**: Wave height, wind direction, air pressure
- **Status**: ⚠️ Requires API key

### 5. Marine Traffic API
- **Purpose**: Vessel tracking and port data
- **Rate Limit**: 1000 requests/day
- **Get API Key**: https://www.marinetraffic.com/en/api/
- **Data**: Vessel positions, port information
- **Status**: ⚠️ Requires API key

### 6. OpenWeatherMap API
- **Purpose**: Additional weather data
- **Rate Limit**: 1000 requests/day (free tier)
- **Get API Key**: https://openweathermap.org/api
- **Data**: Air temperature, humidity, pressure
- **Status**: ⚠️ Requires API key

## Current Configuration

Your dashboard is currently configured to use:

- ✅ **NOAA API** for sea level data (Seattle, Miami, San Diego, Neah Bay)
- ✅ **NDBC API** for water temperature and wind speed
- ✅ **USGS API** for water quality data
- ⚠️ **Optional APIs** disabled (require API keys)

## Data Display

With the current setup, your dashboard will show:

1. **Seattle Sea Level**: Water level in meters (m)
2. **Miami Water Temperature**: Temperature in Celsius (°C)  
3. **San Diego Wind Speed**: Wind speed in meters per second (m/s)
4. **Neah Bay Water Quality**: pH values

## To Enable Optional APIs

1. Get API keys from the respective services
2. Create a `.env.local` file in your project root
3. Add your API keys:

```bash
# Optional Enhanced APIs
VITE_STORMGLASS_API_KEY=your_stormglass_api_key_here
VITE_MARINE_TRAFFIC_API_KEY=your_marinetraffic_api_key_here
VITE_OPENWEATHER_API_KEY=your_openweather_api_key_here

# Enable/disable APIs
VITE_ENABLE_STORMGLASS=true
VITE_ENABLE_MARINE_TRAFFIC=true
VITE_ENABLE_OPENWEATHER=true
```

## Testing

To test with mock data instead of real APIs:

1. Open `src/lib/api.ts`
2. Uncomment this line: `return mockSensorData;`
3. This will show different units for testing

## Troubleshooting

- **All values showing in meters**: This happens when only NOAA tide data is available
- **API errors**: Check console for specific error messages
- **Rate limiting**: APIs have hourly/daily limits
- **CORS issues**: Some APIs may require server-side requests

## Next Steps

1. Test the current setup (should show different units)
2. Add optional API keys if needed
3. Configure additional stations as required
4. Monitor API usage and rate limits
