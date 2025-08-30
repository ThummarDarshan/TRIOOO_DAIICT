// API Configuration for Marine Data Sources
// This file contains API keys and station configurations

export interface StationConfig {
  id: string;
  name: string;
  type: 'tide_gauge' | 'weather_station' | 'water_quality' | 'wave_buoy';
  location: {
    lat: number;
    lng: number;
    name: string;
  };
  api: 'noaa' | 'ndbc' | 'usgs' | 'stormglass';
  parameters?: string[];
}

// Station configurations for different data types
export const STATIONS: StationConfig[] = [
  // Sea Level (Tide Gauge) - NOAA
  {
    id: '9447130',
    name: 'Seattle Sea Level',
    type: 'tide_gauge',
    location: { lat: 47.6026, lng: -122.3393, name: 'Seattle, WA' },
    api: 'noaa'
  },
  {
    id: '8727520',
    name: 'Miami Sea Level',
    type: 'tide_gauge',
    location: { lat: 25.7617, lng: -80.1918, name: 'Miami, FL' },
    api: 'noaa'
  },
  {
    id: '9410230',
    name: 'San Diego Sea Level',
    type: 'tide_gauge',
    location: { lat: 32.7157, lng: -117.1611, name: 'San Diego, CA' },
    api: 'noaa'
  },
  {
    id: '9443090',
    name: 'Neah Bay Sea Level',
    type: 'tide_gauge',
    location: { lat: 48.3705, lng: -124.6242, name: 'Neah Bay, WA' },
    api: 'noaa'
  },

  // Water Temperature - NDBC
  {
    id: '41012',
    name: 'Miami Water Temperature',
    type: 'weather_station',
    location: { lat: 25.7617, lng: -80.1918, name: 'Miami, FL' },
    api: 'ndbc'
  },
  {
    id: '41013',
    name: 'San Diego Water Temperature',
    type: 'weather_station',
    location: { lat: 32.7157, lng: -117.1611, name: 'San Diego, CA' },
    api: 'ndbc'
  },

  // Wind Speed - NDBC
  {
    id: '41012',
    name: 'Miami Wind Speed',
    type: 'weather_station',
    location: { lat: 25.7617, lng: -80.1918, name: 'Miami, FL' },
    api: 'ndbc'
  },
  {
    id: '41013',
    name: 'San Diego Wind Speed',
    type: 'weather_station',
    location: { lat: 32.7157, lng: -117.1611, name: 'San Diego, CA' },
    api: 'ndbc'
  },

  // Water Quality - USGS
  {
    id: '08030500',
    name: 'Neah Bay Water Quality',
    type: 'water_quality',
    location: { lat: 48.3705, lng: -124.6242, name: 'Neah Bay, WA' },
    api: 'usgs',
    parameters: ['00010', '00095', '00300'] // Temperature, pH, Dissolved Oxygen
  },
  {
    id: '08030500',
    name: 'Columbia River Water Quality',
    type: 'water_quality',
    location: { lat: 45.6189, lng: -122.6726, name: 'Portland, OR' },
    api: 'usgs',
    parameters: ['00010', '00095', '00300']
  }
];

// API Keys (should be stored in environment variables)
export const API_KEYS = {
  // Stormglass Marine Weather API (optional)
  STORMGLASS: process.env.VITE_STORMGLASS_API_KEY || '',
  
  // Marine Traffic API (optional)
  MARINE_TRAFFIC: process.env.VITE_MARINE_TRAFFIC_API_KEY || '',
  
  // OpenWeatherMap API (optional)
  OPENWEATHER: process.env.VITE_OPENWEATHER_API_KEY || ''
};

// API Configuration
export const API_CONFIG = {
  // Enable/disable different data sources
  ENABLE_NOAA: true,        // Sea level data (free, no API key needed)
  ENABLE_NDBC: true,        // Water temperature, wind speed (free, no API key needed)
  ENABLE_USGS: true,        // Water quality (free, no API key needed)
  ENABLE_STORMGLASS: false, // Enhanced marine weather (requires API key)
  ENABLE_MARINE_TRAFFIC: false, // Vessel tracking (requires API key)
  ENABLE_OPENWEATHER: false,    // Additional weather data (requires API key)
  
  // Data refresh intervals (milliseconds)
  REFRESH_INTERVALS: {
    SENSORS: 60000,      // 1 minute
    ALERTS: 30000,       // 30 seconds
    PREDICTIONS: 300000  // 5 minutes
  },
  
  // Rate limits
  RATE_LIMITS: {
    NOAA: 1000,          // requests per hour
    NDBC: 1000,          // requests per hour
    USGS: 1000,          // requests per hour
    STORMGLASS: 100,     // requests per day (free tier)
    MARINE_TRAFFIC: 1000, // requests per day
    OPENWEATHER: 1000    // requests per day (free tier)
  }
};

// Helper functions
export const getStationsByType = (type: StationConfig['type']): StationConfig[] => {
  return STATIONS.filter(station => station.type === type);
};

export const getStationsByAPI = (api: StationConfig['api']): StationConfig[] => {
  return STATIONS.filter(station => station.api === api);
};

export const getStationById = (id: string): StationConfig | undefined => {
  return STATIONS.find(station => station.id === id);
};

// Get enabled stations based on API configuration
export const getEnabledStations = (): StationConfig[] => {
  return STATIONS.filter(station => {
    switch (station.api) {
      case 'noaa':
        return API_CONFIG.ENABLE_NOAA;
      case 'ndbc':
        return API_CONFIG.ENABLE_NDBC;
      case 'usgs':
        return API_CONFIG.ENABLE_USGS;
      case 'stormglass':
        return API_CONFIG.ENABLE_STORMGLASS && API_KEYS.STORMGLASS;
      default:
        return false;
    }
  });
};
