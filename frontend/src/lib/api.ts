// API service for Coastal Threat Alert System
import { realTimeDataService, type RealTimeSensorData } from './real-time-apis';
import { 
  getStationsByType, 
  getEnabledStations, 
  getStationById,
  DATA_REFRESH_INTERVALS 
} from './marine-data-config';

export interface SensorData {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
    name: string;
  };
  type: 'tide_gauge' | 'weather_station' | 'water_quality' | 'wave_buoy' | 'satellite';
  readings: {
    timestamp: string;
    value: number;
    unit: string;
    status: 'normal' | 'warning' | 'critical';
  }[];
  lastUpdated: string;
}

export interface Alert {
  id: string;
  type: 'storm_surge' | 'coastal_erosion' | 'water_pollution' | 'illegal_activity' | 'algal_bloom';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: {
    lat: number;
    lng: number;
    name: string;
  };
  description: string;
  timestamp: string;
  status: 'active' | 'resolved' | 'investigating';
  affectedArea: number; // km²
  recommendations: string[];
}

export interface Prediction {
  id: string;
  type: 'tide_level' | 'storm_surge' | 'erosion_risk' | 'water_quality';
  location: {
    lat: number;
    lng: number;
    name: string;
  };
  forecast: {
    timestamp: string;
    value: number;
    confidence: number;
    risk_level: 'low' | 'medium' | 'high';
  }[];
  model: string;
  lastUpdated: string;
}

export interface HistoricalData {
  sensorId: string;
  parameter: string;
  data: {
    timestamp: string;
    value: number;
    unit: string;
  }[];
  statistics: {
    min: number;
    max: number;
    average: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  };
}

// Mock data for development
const mockSensorData: SensorData[] = [
  {
    id: 'sensor_001',
    name: 'Mumbai Harbor Tide Gauge',
    location: { lat: 18.9217, lng: 72.8347, name: 'Mumbai Harbor' },
    type: 'tide_gauge',
    readings: [
      { timestamp: new Date().toISOString(), value: 2.3, unit: 'm', status: 'normal' },
      { timestamp: new Date(Date.now() - 3600000).toISOString(), value: 2.1, unit: 'm', status: 'normal' },
      { timestamp: new Date(Date.now() - 7200000).toISOString(), value: 1.9, unit: 'm', status: 'normal' }
    ],
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'sensor_002',
    name: 'Goa Beach Weather Station',
    location: { lat: 15.2993, lng: 73.9872, name: 'Goa Beach' },
    type: 'weather_station',
    readings: [
      { timestamp: new Date().toISOString(), value: 24.5, unit: '°C', status: 'normal' },
      { timestamp: new Date(Date.now() - 3600000).toISOString(), value: 25.1, unit: '°C', status: 'normal' },
      { timestamp: new Date(Date.now() - 7200000).toISOString(), value: 25.8, unit: '°C', status: 'normal' }
    ],
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'sensor_003',
    name: 'Chennai Water Quality Monitor',
    location: { lat: 13.0827, lng: 80.2707, name: 'Chennai Coast' },
    type: 'water_quality',
    readings: [
      { timestamp: new Date().toISOString(), value: 7.2, unit: 'pH', status: 'normal' },
      { timestamp: new Date(Date.now() - 3600000).toISOString(), value: 7.1, unit: 'pH', status: 'normal' },
      { timestamp: new Date(Date.now() - 7200000).toISOString(), value: 7.3, unit: 'pH', status: 'normal' }
    ],
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'sensor_004',
    name: 'Kerala Wave Buoy',
    location: { lat: 9.9312, lng: 76.2673, name: 'Kerala Coast' },
    type: 'wave_buoy',
    readings: [
      { timestamp: new Date().toISOString(), value: 1.8, unit: 'm', status: 'warning' },
      { timestamp: new Date(Date.now() - 3600000).toISOString(), value: 1.5, unit: 'm', status: 'normal' },
      { timestamp: new Date(Date.now() - 7200000).toISOString(), value: 1.2, unit: 'm', status: 'normal' }
    ],
    lastUpdated: new Date().toISOString()
  }
];

const mockAlerts: Alert[] = [
  {
    id: 'alert_001',
    type: 'storm_surge',
    severity: 'high',
    location: { lat: 18.9217, lng: 72.8347, name: 'Mumbai Harbor' },
    description: 'High tide warning: Expected storm surge of 3.2m within 6 hours',
    timestamp: new Date().toISOString(),
    status: 'active',
    affectedArea: 25.5,
    recommendations: [
      'Evacuate low-lying coastal areas',
      'Secure fishing vessels and equipment',
      'Monitor local weather updates'
    ]
  },
  {
    id: 'alert_002',
    type: 'water_pollution',
    severity: 'medium',
    location: { lat: 13.0827, lng: 80.2707, name: 'Chennai Coast' },
    description: 'Elevated levels of industrial pollutants detected in coastal waters',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    status: 'investigating',
    affectedArea: 8.2,
    recommendations: [
      'Avoid swimming in affected areas',
      'Report any unusual water conditions',
      'Environmental team investigating source'
    ]
  }
];

const mockPredictions: Prediction[] = [
  {
    id: 'pred_001',
    type: 'tide_level',
    location: { lat: 18.9217, lng: 72.8347, name: 'Mumbai Harbor' },
    forecast: [
      { timestamp: new Date(Date.now() + 3600000).toISOString(), value: 2.8, confidence: 0.85, risk_level: 'medium' },
      { timestamp: new Date(Date.now() + 7200000).toISOString(), value: 3.2, confidence: 0.78, risk_level: 'high' },
      { timestamp: new Date(Date.now() + 10800000).toISOString(), value: 2.9, confidence: 0.82, risk_level: 'medium' }
    ],
    model: 'AI-Tide-Predictor-v2.1',
    lastUpdated: new Date().toISOString()
  }
];

// API service class
export class CoastalAPI {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string = 'https://api.coastalguardian.com/v1', apiKey: string = '') {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  // Get all sensor data
  async getSensorData(): Promise<SensorData[]> {
    try {
      // For development/testing, you can force mock data by uncommenting this line:
      return mockSensorData;
      
      // Get mixed sensor data with different types (sea level, temperature, wind, water quality)
      const mixedSensors = await this.getMixedSensorData();
      if (mixedSensors.length > 0) {
        return mixedSensors;
      }
      
      // Fallback to original real-time data if mixed data fails
      const realTimeSensors = await this.getRealTimeSensorData();
      if (realTimeSensors.length > 0) {
        return realTimeSensors;
      }
      
      // Final fallback to mock data
      return Promise.resolve(mockSensorData);
    } catch (error) {
      console.error('Error fetching sensor data:', error);
      return mockSensorData; // Fallback to mock data
    }
  }

  // Get mixed sensor data with different types
  async getMixedSensorData(): Promise<SensorData[]> {
    try {
      const sensors: SensorData[] = [];
      
      // 1. Sea Level (Tide Gauge) - NOAA API
      try {
        const tideData = await realTimeDataService.getTideGaugeData('9447130'); // Seattle
        tideData.name = 'Seattle Sea Level';
        tideData.location = { lat: 47.6026, lng: -122.3393, name: 'Seattle, WA' };
        sensors.push(this.convertRealTimeToSensorData(tideData));
      } catch (error) {
        console.warn('NOAA tide data unavailable:', error);
      }
      
      // 2. Water Temperature - NDBC API
      try {
        const tempData = await realTimeDataService.getWeatherStationData('41012'); // Miami
        tempData.name = 'Miami Water Temperature';
        tempData.location = { lat: 25.7617, lng: -80.1918, name: 'Miami, FL' };
        sensors.push(this.convertRealTimeToSensorData(tempData));
      } catch (error) {
        console.warn('NDBC temperature data unavailable:', error);
      }
      
      // 3. Wind Speed - NDBC API
      try {
        const windData = await realTimeDataService.getWindSpeedData('41013'); // San Diego
        windData.name = 'San Diego Wind Speed';
        windData.location = { lat: 32.7157, lng: -117.1611, name: 'San Diego, CA' };
        sensors.push(this.convertRealTimeToSensorData(windData));
      } catch (error) {
        console.warn('NDBC wind data unavailable:', error);
      }
      
      // 4. Water Quality - USGS API
      try {
        const qualityData = await realTimeDataService.getWaterQualityData('08030500'); // USGS site
        qualityData.name = 'Neah Bay Water Quality';
        qualityData.location = { lat: 48.3705, lng: -124.6242, name: 'Neah Bay, WA' };
        sensors.push(this.convertRealTimeToSensorData(qualityData));
      } catch (error) {
        console.warn('USGS water quality data unavailable:', error);
      }
      
      return sensors;
    } catch (error) {
      console.error('Error getting mixed sensor data:', error);
      return mockSensorData; // Fallback to mock data
    }
  }

  // Get mock sensor data for testing (shows different units)
  async getMockSensorData(): Promise<SensorData[]> {
    return Promise.resolve(mockSensorData);
  }

  // Get sensor data by ID
  async getSensorById(id: string): Promise<SensorData | null> {
    try {
      const sensors = await this.getSensorData();
      return sensors.find(sensor => sensor.id === id) || null;
    } catch (error) {
      console.error('Error fetching sensor by ID:', error);
      return null;
    }
  }

  // Get all alerts
  async getAlerts(): Promise<Alert[]> {
    try {
      // In production, this would be a real API call
      // const response = await fetch(`${this.baseUrl}/alerts`, {
      //   headers: { 'Authorization': `Bearer ${this.apiKey}` }
      // });
      // return response.json();
      
      return Promise.resolve(mockAlerts);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      return mockAlerts;
    }
  }

  // Get predictions
  async getPredictions(): Promise<Prediction[]> {
    try {
      return Promise.resolve(mockPredictions);
    } catch (error) {
      console.error('Error fetching predictions:', error);
      return mockPredictions;
    }
  }

  // Get historical data for a sensor
  async getHistoricalData(sensorId: string, parameter: string, days: number = 30): Promise<HistoricalData | null> {
    try {
      // Generate mock historical data
      const data = Array.from({ length: days * 24 }, (_, i) => ({
        timestamp: new Date(Date.now() - (days * 24 - i) * 3600000).toISOString(),
        value: Math.random() * 10 + 15, // Random values between 15-25
        unit: '°C'
      }));

      const values = data.map(d => d.value);
      const min = Math.min(...values);
      const max = Math.max(...values);
      const average = values.reduce((a, b) => a + b, 0) / values.length;

      return {
        sensorId,
        parameter,
        data,
        statistics: {
          min,
          max,
          average,
          trend: 'stable' as const
        }
      };
    } catch (error) {
      console.error('Error fetching historical data:', error);
      return null;
    }
  }

  // Create new alert
  async createAlert(alert: Omit<Alert, 'id' | 'timestamp'>): Promise<Alert | null> {
    try {
      const newAlert: Alert = {
        ...alert,
        id: `alert_${Date.now()}`,
        timestamp: new Date().toISOString()
      };
      
      // In production, this would POST to the API
      // const response = await fetch(`${this.baseUrl}/alerts`, {
      //   method: 'POST',
      //   headers: { 
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${this.apiKey}` 
      //   },
      //   body: JSON.stringify(newAlert)
      // });
      // return response.json();
      
      return newAlert;
    } catch (error) {
      console.error('Error creating alert:', error);
      return null;
    }
  }

  // Update sensor reading
  async updateSensorReading(sensorId: string, reading: Omit<SensorData['readings'][0], 'timestamp'>): Promise<boolean> {
    try {
      // In production, this would PUT to the API
      // const response = await fetch(`${this.baseUrl}/sensors/${sensorId}/readings`, {
      //   method: 'PUT',
      //   headers: { 
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${this.apiKey}` 
      //   },
      //   body: JSON.stringify(reading)
      // });
      // return response.ok;
      
      return true;
    } catch (error) {
      console.error('Error updating sensor reading:', error);
      return false;
    }
  }

  // Get real-time sensor data from marine APIs
  private async getRealTimeSensorData(): Promise<SensorData[]> {
    const sensors: SensorData[] = [];
    
    try {
      // Get tide gauge data from NOAA
      const tideStations = getStationsByType('tide_gauge');
      for (const station of tideStations) {
        try {
          const tideData = await realTimeDataService.getTideGaugeData(station.id);
          // Update location with real station data
          tideData.location = station.location;
          tideData.name = station.name;
          sensors.push(this.convertRealTimeToSensorData(tideData));
        } catch (error) {
          console.warn(`NOAA tide data unavailable for station ${station.id}:`, error);
        }
      }

      // Get wave buoy data from NDBC
      const waveStations = getStationsByType('wave_buoy');
      for (const station of waveStations) {
        try {
          const waveData = await realTimeDataService.getWaveBuoyData(station.id);
          // Update location with real station data
          waveData.location = station.location;
          waveData.name = station.name;
          sensors.push(this.convertRealTimeToSensorData(waveData));
        } catch (error) {
          console.warn(`NDBC wave data unavailable for station ${station.id}:`, error);
        }
      }

      // Get water quality data from USGS
      const qualityStations = getStationsByType('water_quality');
      for (const station of qualityStations) {
        try {
          const qualityData = await realTimeDataService.getWaterQualityData(station.id);
          // Update location with real station data
          qualityData.location = station.location;
          qualityData.name = station.name;
          sensors.push(this.convertRealTimeToSensorData(qualityData));
        } catch (error) {
          console.warn(`USGS water quality data unavailable for station ${station.id}:`, error);
        }
      }

      // Get weather station data from NDBC
      const weatherStations = getStationsByType('weather_station');
      for (const station of weatherStations) {
        try {
          const weatherData = await realTimeDataService.getWeatherStationData(station.id);
          // Update location with real station data
          weatherData.location = station.location;
          weatherData.name = station.name;
          sensors.push(this.convertRealTimeToSensorData(weatherData));
        } catch (error) {
          console.warn(`NDBC weather data unavailable for station ${station.id}:`, error);
        }
      }

    } catch (error) {
      console.error('Error fetching real-time sensor data:', error);
    }

    return sensors;
  }

  // Helper to convert RealTimeSensorData to SensorData
  private convertRealTimeToSensorData(realTimeData: RealTimeSensorData): SensorData {
    const sensor: SensorData = {
      id: realTimeData.id,
      name: realTimeData.name,
      location: realTimeData.location,
      type: realTimeData.type,
      readings: [],
      lastUpdated: new Date().toISOString()
    };

    // Map readings based on type with correct units
    if (realTimeData.type === 'tide_gauge') {
      sensor.readings = realTimeData.readings.map(r => ({
        timestamp: r.timestamp,
        value: r.value,
        unit: r.unit || 'm', // Use unit from real-time data, fallback to meters
        status: r.status || 'normal'
      }));
    } else if (realTimeData.type === 'wave_buoy') {
      sensor.readings = realTimeData.readings.map(r => ({
        timestamp: r.timestamp,
        value: r.value,
        unit: r.unit || 'm', // Use unit from real-time data, fallback to meters
        status: r.status || 'normal'
      }));
    } else if (realTimeData.type === 'water_quality') {
      sensor.readings = realTimeData.readings.map(r => ({
        timestamp: r.timestamp,
        value: r.value,
        unit: r.unit || 'pH', // Use unit from real-time data, fallback to pH
        status: r.status || 'normal'
      }));
    } else if (realTimeData.type === 'weather_station') {
      sensor.readings = realTimeData.readings.map(r => ({
        timestamp: r.timestamp,
        value: r.value,
        unit: r.unit || '°C', // Use unit from real-time data, fallback to Celsius
        status: r.status || 'normal'
      }));
    } else {
      // Default case - use units from real-time data
      sensor.readings = realTimeData.readings.map(r => ({
        timestamp: r.timestamp,
        value: r.value,
        unit: r.unit || 'unknown',
        status: r.status || 'normal'
      }));
    }

    return sensor;
  }
}

// Export default instance
export const coastalAPI = new CoastalAPI();
