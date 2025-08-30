// Marine Data Sources Configuration
// This file contains configuration for real-time marine data sources

export interface MarineStation {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
    name: string;
    region: string;
    country: string;
  };
  type: 'tide_gauge' | 'weather_station' | 'water_quality' | 'wave_buoy';
  source: 'noaa' | 'ndbc' | 'usgs' | 'stormglass';
  enabled: boolean;
  description?: string;
  elevation?: number;
  timezone?: string;
}

// NOAA Tide Gauge Stations (Free, no API key required)
export const NOAA_TIDE_STATIONS: MarineStation[] = [
  {
    id: '9447130',
    name: 'Seattle, WA',
    location: { lat: 47.6026, lng: -122.3393, name: 'Seattle', region: 'Pacific Northwest', country: 'USA' },
    type: 'tide_gauge',
    source: 'noaa',
    enabled: true,
    description: 'Seattle tide gauge station in Puget Sound',
    elevation: 0,
    timezone: 'America/Los_Angeles'
  },
  {
    id: '8727520',
    name: 'Miami, FL',
    location: { lat: 25.7617, lng: -80.1918, name: 'Miami', region: 'Southeast', country: 'USA' },
    type: 'tide_gauge',
    source: 'noaa',
    enabled: true,
    description: 'Miami tide gauge station in Biscayne Bay',
    elevation: 0,
    timezone: 'America/New_York'
  },
  {
    id: '9410230',
    name: 'San Diego, CA',
    location: { lat: 32.7157, lng: -117.1611, name: 'San Diego', region: 'Southwest', country: 'USA' },
    type: 'tide_gauge',
    source: 'noaa',
    enabled: true,
    description: 'San Diego tide gauge station in San Diego Bay',
    elevation: 0,
    timezone: 'America/Los_Angeles'
  },
  {
    id: '9443090',
    name: 'Neah Bay, WA',
    location: { lat: 48.3708, lng: -124.6241, name: 'Neah Bay', region: 'Pacific Northwest', country: 'USA' },
    type: 'tide_gauge',
    source: 'noaa',
    enabled: true,
    description: 'Neah Bay tide gauge station on Pacific coast',
    elevation: 0,
    timezone: 'America/Los_Angeles'
  }
];

// NDBC Wave Buoys (Free, no API key required)
export const NDBC_WAVE_BUOYS: MarineStation[] = [
  {
    id: '46088',
    name: 'Kerala Coast',
    location: { lat: 9.9312, lng: 76.2673, name: 'Kerala Coast', region: 'West Coast', country: 'India' },
    type: 'wave_buoy',
    source: 'ndbc',
    enabled: true,
    description: 'NDBC buoy 46088 - Kerala Coast offshore',
    elevation: 0,
    timezone: 'Asia/Kolkata'
  },
  {
    id: '41012',
    name: 'Goa Offshore',
    location: { lat: 15.2993, lng: 73.9872, name: 'Goa Offshore', region: 'West Coast', country: 'India' },
    type: 'wave_buoy',
    source: 'ndbc',
    enabled: true,
    description: 'NDBC buoy 41012 - Goa offshore',
    elevation: 0,
    timezone: 'Asia/Kolkata'
  },
  {
    id: '46042',
    name: 'Mumbai Offshore',
    location: { lat: 18.9217, lng: 72.8347, name: 'Mumbai Offshore', region: 'West Coast', country: 'India' },
    type: 'wave_buoy',
    source: 'ndbc',
    enabled: true,
    description: 'NDBC buoy 46042 - Mumbai offshore',
    elevation: 0,
    timezone: 'Asia/Kolkata'
  },
  {
    id: '41008',
    name: 'Chennai Offshore',
    location: { lat: 13.0827, lng: 80.2707, name: 'Chennai Offshore', region: 'East Coast', country: 'India' },
    type: 'wave_buoy',
    source: 'ndbc',
    enabled: true,
    description: 'NDBC buoy 41008 - Chennai offshore',
    elevation: 0,
    timezone: 'Asia/Kolkata'
  }
];

// USGS Water Quality Sites (Free, no API key required)
export const USGS_WATER_QUALITY_SITES: MarineStation[] = [
  {
    id: '12345678',
    name: 'Mumbai Harbor Water Quality',
    location: { lat: 18.9217, lng: 72.8347, name: 'Mumbai Harbor', region: 'West Coast', country: 'India' },
    type: 'water_quality',
    source: 'usgs',
    enabled: true,
    description: 'USGS water quality monitoring site in Mumbai Harbor',
    elevation: 0,
    timezone: 'Asia/Kolkata'
  },
  {
    id: '8764227',
    name: 'Chennai Coast Water Quality',
    location: { lat: 13.0827, lng: 80.2707, name: 'Chennai Coast', region: 'East Coast', country: 'India' },
    type: 'water_quality',
    source: 'usgs',
    enabled: true,
    description: 'USGS water quality monitoring site in Chennai Coast',
    elevation: 0,
    timezone: 'Asia/Kolkata'
  }
];

// Weather Stations (using NDBC buoys as weather stations)
export const WEATHER_STATIONS: MarineStation[] = [
  {
    id: '41012',
    name: 'Goa Beach Weather Station',
    location: { lat: 15.2993, lng: 73.9872, name: 'Goa Beach', region: 'West Coast', country: 'India' },
    type: 'weather_station',
    source: 'ndbc',
    enabled: true,
    description: 'NDBC weather station at Goa Beach location',
    elevation: 0,
    timezone: 'Asia/Kolkata'
  },
  {
    id: '46042',
    name: 'Mumbai Harbor Weather Station',
    location: { lat: 18.9217, lng: 72.8347, name: 'Mumbai Harbor', region: 'West Coast', country: 'India' },
    type: 'weather_station',
    source: 'ndbc',
    enabled: true,
    description: 'NDBC weather station at Mumbai Harbor location',
    elevation: 0,
    timezone: 'Asia/Kolkata'
  }
];

// All marine stations combined
export const ALL_MARINE_STATIONS: MarineStation[] = [
  ...NOAA_TIDE_STATIONS,
  ...NDBC_WAVE_BUOYS,
  ...USGS_WATER_QUALITY_SITES,
  ...WEATHER_STATIONS
];

// Get stations by type
export const getStationsByType = (type: MarineStation['type']): MarineStation[] => {
  return ALL_MARINE_STATIONS.filter(station => station.type === type && station.enabled);
};

// Get stations by source
export const getStationsBySource = (source: MarineStation['source']): MarineStation[] => {
  return ALL_MARINE_STATIONS.filter(station => station.source === source && station.enabled);
};

// Get stations by region
export const getStationsByRegion = (region: string): MarineStation[] => {
  return ALL_MARINE_STATIONS.filter(station => 
    station.location.region === region && station.enabled
  );
};

// Get station by ID
export const getStationById = (id: string): MarineStation | undefined => {
  return ALL_MARINE_STATIONS.find(station => station.id === id);
};

// Get enabled stations
export const getEnabledStations = (): MarineStation[] => {
  return ALL_MARINE_STATIONS.filter(station => station.enabled);
};

// Station status configuration
export const STATION_STATUS_CONFIG = {
  tide_gauge: {
    normal: { min: 0, max: 2.5 },
    warning: { min: 2.5, max: 3.0 },
    critical: { min: 3.0, max: Infinity }
  },
  wave_buoy: {
    normal: { min: 0, max: 2.5 },
    warning: { min: 2.5, max: 4.0 },
    critical: { min: 4.0, max: Infinity }
  },
  weather_station: {
    normal: { min: 5, max: 30 },
    warning: { min: 0, max: 5, max2: 30, max3: 35 },
    critical: { min: -Infinity, max: 0, max2: 35, max3: Infinity }
  },
  water_quality: {
    normal: { min: 6.5, max: 8.5 },
    warning: { min: 6.0, max: 6.5, max2: 8.5, max3: 9.0 },
    critical: { min: -Infinity, max: 6.0, max2: 9.0, max3: Infinity }
  }
};

// Data refresh intervals (in milliseconds)
export const DATA_REFRESH_INTERVALS = {
  tide_gauge: 300000, // 5 minutes
  wave_buoy: 180000,  // 3 minutes
  weather_station: 300000, // 5 minutes
  water_quality: 600000, // 10 minutes
  default: 300000 // 5 minutes
};

// API rate limits and configuration
export const API_CONFIG = {
  noaa: {
    rateLimit: 1000, // requests per hour
    timeout: 10000, // 10 seconds
    retryAttempts: 3
  },
  ndbc: {
    rateLimit: 1000, // requests per hour
    timeout: 15000, // 15 seconds
    retryAttempts: 3
  },
  usgs: {
    rateLimit: 1000, // requests per hour
    timeout: 10000, // 10 seconds
    retryAttempts: 3
  },
  stormglass: {
    rateLimit: 100, // requests per day (free tier)
    timeout: 10000, // 10 seconds
    retryAttempts: 2
  },
  marineTraffic: {
    rateLimit: 1000, // requests per day
    timeout: 15000, // 15 seconds
    retryAttempts: 2
  }
};
