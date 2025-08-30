# Real-Time Marine Data Setup Guide

This guide explains how to set up real-time data integration for the Coastal Threat Alert System.

## 🚀 Quick Start

1. Copy `env.example` to `.env.local`
2. Set `VITE_ENABLE_REAL_MARINE_DATA=true`
3. The system will automatically use free NOAA, NDBC, and USGS APIs
4. For enhanced data, add optional API keys (see below)

## 📡 Free Data Sources (No API Keys Required)

### NOAA Tides & Currents
- **Status**: ✅ Enabled by default
- **Data**: Tide predictions, water levels, current speeds
- **Coverage**: US coastal waters
- **Rate Limit**: 1000 requests/hour
- **Stations**: Seattle, Miami, San Diego, Neah Bay

### National Data Buoy Center (NDBC)
- **Status**: ✅ Enabled by default
- **Data**: Wave heights, wind speed/direction, air/water temperature
- **Coverage**: US coastal waters and Great Lakes
- **Rate Limit**: 1000 requests/hour
- **Buoys**: Grays Harbor, Duck NC, Monterey Bay

### USGS Water Quality
- **Status**: ✅ Enabled by default
- **Data**: Temperature, pH, dissolved oxygen, turbidity
- **Coverage**: US rivers, estuaries, coastal areas
- **Rate Limit**: 1000 requests/hour
- **Sites**: Columbia River, Mississippi Delta

## 🔑 Optional Enhanced Data Sources

### Stormglass Marine Weather API
- **Status**: ⚠️ Requires API key
- **Data**: Wave height/direction, wind speed/direction, air pressure
- **Coverage**: Global marine weather
- **Rate Limit**: 100 requests/day (free tier)
- **Setup**: Get API key from [Stormglass](https://stormglass.io)

```bash
# Add to .env.local
VITE_STORMGLASS_API_KEY=your_api_key_here
VITE_STORMGLASS_ENABLED=true
```

### Marine Traffic API
- **Status**: ⚠️ Requires API key
- **Data**: Vessel positions, port information, maritime traffic
- **Coverage**: Global maritime traffic
- **Rate Limit**: 1000 requests/day
- **Setup**: Get API key from [Marine Traffic](https://www.marinetraffic.com/en/api/)

```bash
# Add to .env.local
VITE_MARINE_TRAFFIC_API_KEY=your_api_key_here
VITE_MARINE_TRAFFIC_ENABLED=true
```

### OpenWeatherMap API
- **Status**: ⚠️ Requires API key
- **Data**: Air temperature, humidity, pressure, wind
- **Coverage**: Global weather data
- **Rate Limit**: 1000 requests/day (free tier)
- **Setup**: Get API key from [OpenWeatherMap](https://openweathermap.org/api)

```bash
# Add to .env.local
VITE_OPENWEATHER_API_KEY=your_api_key_here
VITE_OPENWEATHER_ENABLED=true
```

## ⚙️ Configuration

### Environment Variables

```bash
# Enable/disable real-time marine data
VITE_ENABLE_REAL_MARINE_DATA=true

# Individual service toggles
VITE_NOAA_ENABLED=true
VITE_NDBC_ENABLED=true
VITE_USGS_ENABLED=true
VITE_STORMGLASS_ENABLED=false
VITE_MARINE_TRAFFIC_ENABLED=false
VITE_OPENWEATHER_ENABLED=false

# Data refresh intervals (milliseconds)
VITE_SENSOR_REFRESH_INTERVAL=60000      # 1 minute
VITE_ALERT_REFRESH_INTERVAL=30000       # 30 seconds
VITE_PREDICTION_REFRESH_INTERVAL=300000 # 5 minutes
```

### Station Configuration

The system comes pre-configured with real marine stations:

- **Tide Gauges**: 4 NOAA stations across US coasts
- **Wave Buoys**: 4 NDBC buoys in key coastal areas
- **Water Quality**: 2 USGS monitoring sites
- **Weather Stations**: 2 NDBC weather buoys

## 🔄 Data Flow

1. **Real-time APIs** → Fetch current sensor readings
2. **Data Processing** → Convert to standardized format
3. **Status Assessment** → Determine normal/warning/critical levels
4. **Dashboard Display** → Show real-time sensor data
5. **Alert Generation** → Trigger alerts based on thresholds

## 📊 Data Types & Units

| Sensor Type | Data | Unit | Normal Range | Warning Range | Critical Range |
|-------------|------|------|--------------|---------------|----------------|
| Tide Gauge | Water Level | meters | 0-2.5m | 2.5-3.0m | >3.0m |
| Wave Buoy | Wave Height | meters | 0-2.5m | 2.5-4.0m | >4.0m |
| Weather Station | Temperature | °C | 5-30°C | 0-5°C or 30-35°C | <0°C or >35°C |
| Water Quality | pH | pH units | 6.5-8.5 | 6.0-6.5 or 8.5-9.0 | <6.0 or >9.0 |

## 🚨 Error Handling & Fallbacks

- **API Unavailable**: Falls back to mock data
- **Rate Limit Exceeded**: Uses cached data when available
- **Network Issues**: Retries with exponential backoff
- **Invalid Data**: Filters out corrupted readings

## 🔧 Troubleshooting

### Common Issues

1. **No Real-time Data Showing**
   - Check `VITE_ENABLE_REAL_MARINE_DATA=true`
   - Verify individual service toggles are enabled
   - Check browser console for API errors

2. **Slow Data Updates**
   - Adjust refresh intervals in environment variables
   - Check network connectivity to marine APIs
   - Verify rate limits haven't been exceeded

3. **Missing Stations**
   - Check station configuration in `marine-data-config.ts`
   - Verify station IDs are correct
   - Ensure stations are enabled

### Debug Mode

Enable debug logging:

```bash
VITE_DEBUG_MODE=true
VITE_VERBOSE_LOGGING=true
```

## 📈 Performance Considerations

- **Free APIs**: Limited to 1000 requests/hour
- **Data Caching**: Implemented to reduce API calls
- **Batch Requests**: Multiple stations fetched in parallel
- **Smart Refresh**: Only updates changed data

## 🔮 Future Enhancements

- **WebSocket Support**: Real-time data streaming
- **Historical Data**: Long-term trend analysis
- **Machine Learning**: Predictive analytics
- **Global Coverage**: International marine data sources
- **Custom Alerts**: User-defined threshold notifications

## 📚 API Documentation

- [NOAA Tides & Currents API](https://tidesandcurrents.noaa.gov/api/)
- [NDBC Data Access](https://www.ndbc.noaa.gov/data_access.shtml)
- [USGS Water Services](https://waterservices.usgs.gov/)
- [Stormglass API](https://docs.stormglass.io/)
- [Marine Traffic API](https://www.marinetraffic.com/en/api/)

## 🤝 Support

For issues with real-time data integration:

1. Check the troubleshooting section above
2. Review browser console for error messages
3. Verify environment variable configuration
4. Test individual API endpoints manually
5. Check rate limits and API status

---

**Note**: Free APIs have rate limits and may occasionally be unavailable. The system gracefully falls back to mock data to ensure continuous operation.
