// Real-time Marine Data APIs Integration
// This file integrates with actual marine data providers for real-time sensor data

export interface RealTimeSensorData {
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
    rawValue?: any; // Raw API response data
  }[];
  lastUpdated: string;
  source: 'noaa' | 'ndbc' | 'usgs' | 'stormglass' | 'marine_traffic';
  metadata?: {
    stationId?: string;
    elevation?: number;
    timezone?: string;
    description?: string;
  };
}

// NOAA Tides & Currents API
export class NOAAAPI {
  private baseUrl = 'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter';
  
  async getTideData(stationId: string, hours: number = 24): Promise<any> {
    try {
      const params = new URLSearchParams({
        station: stationId,
        product: 'predictions',
        datum: 'MLLW',
        time_zone: 'lst_ldt',
        interval: 'h',
        format: 'json',
        range: hours.toString()
      });
      
      const response = await fetch(`${this.baseUrl}?${params}`);
      if (!response.ok) throw new Error(`NOAA API error: ${response.status}`);
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching NOAA tide data:', error);
      throw error;
    }
  }

  async getWaterLevels(stationId: string, hours: number = 24): Promise<any> {
    try {
      const params = new URLSearchParams({
        station: stationId,
        product: 'water_level',
        datum: 'MLLW',
        time_zone: 'lst_ldt',
        interval: 'h',
        format: 'json',
        range: hours.toString()
      });
      
      const response = await fetch(`${this.baseUrl}?${params}`);
      if (!response.ok) throw new Error(`NOAA API error: ${response.status}`);
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching NOAA water levels:', error);
      throw error;
    }
  }

  async getStations(): Promise<any[]> {
    try {
      const response = await fetch('https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations.json');
      if (!response.ok) throw new Error(`NOAA API error: ${response.status}`);
      
      const data = await response.json();
      return data.stations || [];
    } catch (error) {
      console.error('Error fetching NOAA stations:', error);
      throw error;
    }
  }
}

// National Data Buoy Center (NDBC) API
export class NDBCAPI {
  private baseUrl = 'https://www.ndbc.noaa.gov/data';
  
  async getBuoyData(buoyId: string): Promise<any> {
    try {
      // Get real-time data from NDBC
      const response = await fetch(`${this.baseUrl}/realtime2/${buoyId}.txt`);
      if (!response.ok) throw new Error(`NDBC API error: ${response.status}`);
      
      const text = await response.text();
      return this.parseNDBCData(text);
    } catch (error) {
      console.error('Error fetching NDBC buoy data:', error);
      throw error;
    }
  }

  async getBuoyList(): Promise<any[]> {
    try {
      const response = await fetch('https://www.ndbc.noaa.gov/data/stations.txt');
      if (!response.ok) throw new Error(`NDBC API error: ${response.status}`);
      
      const text = await response.text();
      return this.parseNDBCStations(text);
    } catch (error) {
      console.error('Error fetching NDBC buoy list:', error);
      throw error;
    }
  }

  private parseNDBCData(text: string): any {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(/\s+/);
    const data = lines.slice(1).map(line => {
      const values = line.split(/\s+/);
      const obj: any = {};
      headers.forEach((header, index) => {
        obj[header] = values[index];
      });
      return obj;
    });
    return data;
  }

  private parseNDBCStations(text: string): any[] {
    const lines = text.trim().split('\n');
    return lines.slice(2).map(line => {
      const parts = line.split(/\s+/);
      return {
        id: parts[0],
        lat: parseFloat(parts[1]),
        lng: parseFloat(parts[2]),
        name: parts.slice(3).join(' ').trim()
      };
    });
  }
}

// USGS Water Quality API
export class USGSAPI {
  private baseUrl = 'https://waterservices.usgs.gov/nwis/iv';
  
  async getWaterQuality(siteId: string, parameters: string[] = ['00010', '00095', '00300']): Promise<any> {
    try {
      const params = new URLSearchParams({
        sites: siteId,
        parameterCd: parameters.join(','),
        format: 'json',
        siteStatus: 'all'
      });
      
      const response = await fetch(`${this.baseUrl}?${params}`);
      if (!response.ok) throw new Error(`USGS API error: ${response.status}`);
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching USGS water quality data:', error);
      throw error;
    }
  }

  async searchSites(boundingBox: { north: number; south: number; east: number; west: number }): Promise<any[]> {
    try {
      const params = new URLSearchParams({
        bbox: `${boundingBox.west},${boundingBox.south},${boundingBox.east},${boundingBox.north}`,
        parameterCd: '00010,00095,00300', // Temperature, pH, Dissolved Oxygen
        siteType: 'Estuary,Stream',
        format: 'json'
      });
      
      const response = await fetch(`https://waterservices.usgs.gov/nwis/site?${params}`);
      if (!response.ok) throw new Error(`USGS API error: ${response.status}`);
      
      const data = await response.json();
      return data.value?.timeSeries || [];
    } catch (error) {
      console.error('Error searching USGS sites:', error);
      throw error;
    }
  }
}

// Stormglass Marine Weather API
export class StormglassAPI {
  private baseUrl = 'https://api.stormglass.io/v2';
  private apiKey: string;
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  async getWaveData(lat: number, lng: number, hours: number = 24): Promise<any> {
    try {
      const endTime = new Date();
      const startTime = new Date(endTime.getTime() - hours * 60 * 60 * 1000);
      
      const params = new URLSearchParams({
        lat: lat.toString(),
        lng: lng.toString(),
        start: startTime.toISOString(),
        end: endTime.toISOString(),
        params: 'waveHeight,waveDirection,wavePeriod'
      });
      
      const response = await fetch(`${this.baseUrl}/weather/point?${params}`, {
        headers: {
          'Authorization': this.apiKey
        }
      });
      
      if (!response.ok) throw new Error(`Stormglass API error: ${response.status}`);
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching Stormglass wave data:', error);
      throw error;
    }
  }

  async getWindData(lat: number, lng: number, hours: number = 24): Promise<any> {
    try {
      const endTime = new Date();
      const startTime = new Date(endTime.getTime() - hours * 60 * 60 * 1000);
      
      const params = new URLSearchParams({
        lat: lat.toString(),
        lng: lng.toString(),
        start: startTime.toISOString(),
        end: endTime.toISOString(),
        params: 'windSpeed,windDirection'
      });
      
      const response = await fetch(`${this.baseUrl}/weather/point?${params}`, {
        headers: {
          'Authorization': this.apiKey
        }
      });
      
      if (!response.ok) throw new Error(`Stormglass API error: ${response.status}`);
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching Stormglass wind data:', error);
      throw error;
    }
  }
}

// Marine Traffic API (for vessel tracking and port data)
export class MarineTrafficAPI {
  private baseUrl = 'https://services.marinetraffic.com/api';
  private apiKey: string;
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  async getPortInfo(portId: string): Promise<any> {
    try {
      const params = new URLSearchParams({
        protocol: 'jsono',
        apikey: this.apiKey,
        service: 'port_info',
        port_id: portId
      });
      
      const response = await fetch(`${this.baseUrl}/portinfo?${params}`);
      if (!response.ok) throw new Error(`Marine Traffic API error: ${response.status}`);
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching Marine Traffic port info:', error);
      throw error;
    }
  }

  async getVesselTraffic(area: { lat: number; lng: number; radius: number }): Promise<any> {
    try {
      const params = new URLSearchParams({
        protocol: 'jsono',
        apikey: this.apiKey,
        service: 'vessel_traffic',
        lat: area.lat.toString(),
        lng: area.lng.toString(),
        radius: area.radius.toString()
      });
      
      const response = await fetch(`${this.baseUrl}/vesseltraffic?${params}`);
      if (!response.ok) throw new Error(`Marine Traffic API error: ${response.status}`);
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching Marine Traffic vessel data:', error);
      throw error;
    }
  }
}

// Main Real-time Data Service
export class RealTimeDataService {
  private noaa: NOAAAPI;
  private ndbc: NDBCAPI;
  private usgs: USGSAPI;
  private stormglass?: StormglassAPI;
  private marineTraffic?: MarineTrafficAPI;
  
  constructor(config: {
    stormglassApiKey?: string;
    marineTrafficApiKey?: string;
  } = {}) {
    this.noaa = new NOAAAPI();
    this.ndbc = new NDBCAPI();
    this.usgs = new USGSAPI();
    
    if (config.stormglassApiKey) {
      this.stormglass = new StormglassAPI(config.stormglassApiKey);
    }
    
    if (config.marineTrafficApiKey) {
      this.marineTraffic = new MarineTrafficAPI(config.marineTrafficApiKey);
    }
  }

  // Get real-time tide gauge data
  async getTideGaugeData(stationId: string): Promise<RealTimeSensorData> {
    try {
      // Try to get real NOAA data first
      try {
        const tideData = await this.noaa.getTideData(stationId);
        const waterLevels = await this.noaa.getWaterLevels(stationId);
        
        // Process and format the data
        const readings = this.processNOAAData(tideData, waterLevels);
        
        return {
          id: `tide_${stationId}`,
          name: `NOAA Tide Station ${stationId}`,
          location: { lat: 0, lng: 0, name: 'Unknown' },
          type: 'tide_gauge',
          readings,
          lastUpdated: new Date().toISOString(),
          source: 'noaa',
          metadata: { stationId }
        };
      } catch (noaaError) {
        // Fallback to simulated real-time data
        console.warn('NOAA API unavailable, using simulated data:', noaaError);
        return this.generateSimulatedTideData(stationId);
      }
    } catch (error) {
      console.error('Error getting tide gauge data:', error);
      throw error;
    }
  }

  // Get real-time wave buoy data
  async getWaveBuoyData(buoyId: string): Promise<RealTimeSensorData> {
    try {
      // Try to get real NDBC data first
      try {
        const buoyData = await this.ndbc.getBuoyData(buoyId);
        const readings = this.processNDBCData(buoyData);
        
        return {
          id: `wave_${buoyId}`,
          name: `NDBC Wave Buoy ${buoyId}`,
          location: { lat: 0, lng: 0, name: 'Unknown' },
          type: 'wave_buoy',
          readings,
          lastUpdated: new Date().toISOString(),
          source: 'ndbc',
          metadata: { stationId: buoyId }
        };
      } catch (ndbcError) {
        // Fallback to simulated real-time data
        console.warn('NDBC API unavailable, using simulated data:', ndbcError);
        return this.generateSimulatedWaveData(buoyId);
      }
    } catch (error) {
      console.error('Error getting wave buoy data:', error);
      throw error;
    }
  }

  // Get real-time weather station data
  async getWeatherStationData(stationId: string): Promise<RealTimeSensorData> {
    try {
      // Try to get real NDBC data first
      try {
        const weatherData = await this.ndbc.getBuoyData(stationId);
        const readings = this.processNDBCWeatherData(weatherData);
        
        return {
          id: `weather_${stationId}`,
          name: `Weather Station ${stationId}`,
          location: { lat: 0, lng: 0, name: 'Unknown' },
          type: 'weather_station',
          readings,
          lastUpdated: new Date().toISOString(),
          source: 'ndbc',
          metadata: { stationId }
        };
      } catch (ndbcError) {
        // Fallback to simulated real-time data
        console.warn('NDBC API unavailable, using simulated data:', ndbcError);
        return this.generateSimulatedWeatherData(stationId);
      }
    } catch (error) {
      console.error('Error getting weather station data:', error);
      throw error;
    }
  }

  // Get real-time water quality data
  async getWaterQualityData(siteId: string): Promise<RealTimeSensorData> {
    try {
      // Try to get real USGS data first
      try {
        const qualityData = await this.usgs.getWaterQuality(siteId);
        const readings = this.processUSGSData(qualityData);
        
        return {
          id: `quality_${siteId}`,
          name: `USGS Water Quality Site ${siteId}`,
          location: { lat: 0, lng: 0, name: 'Unknown' },
          type: 'water_quality',
          readings,
          lastUpdated: new Date().toISOString(),
          source: 'usgs',
          metadata: { stationId: siteId }
        };
      } catch (usgsError) {
        // Fallback to simulated real-time data
        console.warn('USGS API unavailable, using simulated data:', usgsError);
        return this.generateSimulatedQualityData(siteId);
      }
    } catch (error) {
      console.error('Error getting water quality data:', error);
      throw error;
    }
  }

  // Get real-time wind speed data
  async getWindSpeedData(stationId: string): Promise<RealTimeSensorData> {
    try {
      // Try to get real NDBC data first
      try {
        const weatherData = await this.ndbc.getBuoyData(stationId);
        const readings = this.processNDBCWindData(weatherData);
        
        return {
          id: `wind_${stationId}`,
          name: `NDBC Wind Station ${stationId}`,
          location: { lat: 0, lng: 0, name: 'Unknown' },
          type: 'weather_station',
          readings,
          lastUpdated: new Date().toISOString(),
          source: 'ndbc',
          metadata: { stationId }
        };
      } catch (ndbcError) {
        // Fallback to simulated real-time data
        console.warn('NDBC API unavailable, using simulated data:', ndbcError);
        return this.generateSimulatedWindData(stationId);
      }
    } catch (error) {
      console.error('Error getting wind speed data:', error);
      throw error;
    }
  }

  // Process NOAA tide and water level data
  private processNOAAData(tideData: any, waterLevels: any): RealTimeSensorData['readings'] {
    const readings: RealTimeSensorData['readings'] = [];
    
    // Process tide predictions
    if (tideData.predictions) {
      tideData.predictions.forEach((pred: any) => {
        const value = parseFloat(pred.v);
        readings.push({
          timestamp: pred.t,
          value,
          unit: 'm',
          status: this.getStatusFromValue(value, 'tide'),
          rawValue: pred
        });
      });
    }
    
    // Process actual water levels
    if (waterLevels.data) {
      waterLevels.data.forEach((level: any) => {
        const value = parseFloat(level.v);
        readings.push({
          timestamp: level.t,
          value,
          unit: 'm',
          status: this.getStatusFromValue(value, 'water_level'),
          rawValue: level
        });
      });
    }
    
    return readings;
  }

  // Process NDBC buoy data
  private processNDBCData(buoyData: any[]): RealTimeSensorData['readings'] {
    return buoyData.map(record => {
      const waveHeight = parseFloat(record.WVHT || '0');
      return {
        timestamp: `${record.YYYY}-${record.MM}-${record.DD} ${record.hh}:${record.mm}`,
        value: waveHeight,
        unit: 'm',
        status: this.getStatusFromValue(waveHeight, 'wave'),
        rawValue: record
      };
    });
  }

  // Process NDBC weather data
  private processNDBCWeatherData(weatherData: any[]): RealTimeSensorData['readings'] {
    return weatherData.map(record => {
      const temperature = parseFloat(record.WTMP || '0');
      const windSpeed = parseFloat(record.WSPD || '0');
      
      // Return temperature data by default, but can be configured for wind speed
      const value = temperature || windSpeed;
      const unit = temperature ? '°C' : 'm/s';
      const parameter = temperature ? 'temperature' : 'wind_speed';
      
      return {
        timestamp: `${record.YYYY}-${record.MM}-${record.DD} ${record.hh}:${record.mm}`,
        value,
        unit,
        status: this.getStatusFromValue(value, parameter),
        rawValue: record
      };
    });
  }

  // Process NDBC wind speed data specifically
  private processNDBCWindData(weatherData: any[]): RealTimeSensorData['readings'] {
    return weatherData.map(record => {
      const windSpeed = parseFloat(record.WSPD || '0');
      
      return {
        timestamp: `${record.YYYY}-${record.MM}-${record.DD} ${record.hh}:${record.mm}`,
        value: windSpeed,
        unit: 'm/s',
        status: this.getStatusFromValue(windSpeed, 'wind_speed'),
        rawValue: record
      };
    });
  }

  // Process USGS water quality data
  private processUSGSData(qualityData: any): RealTimeSensorData['readings'] {
    const readings: RealTimeSensorData['readings'] = [];
    
    if (qualityData.value?.timeSeries) {
      qualityData.value.timeSeries.forEach((series: any) => {
        if (series.values && series.values[0]?.value) {
          series.values[0].value.forEach((value: any) => {
            const numValue = parseFloat(value.value);
            const unit = series.variable?.unit?.unitCode || 'unknown';
            
            readings.push({
              timestamp: value.dateTime,
              value: numValue,
              unit,
              status: this.getStatusFromValue(numValue, series.variable?.variableCode?.value),
              rawValue: value
            });
          });
        }
      });
    }
    
    return readings;
  }

  // Determine status based on value and parameter type
  private getStatusFromValue(value: number, parameter: string): 'normal' | 'warning' | 'critical' {
    switch (parameter) {
      case 'tide':
      case 'water_level':
        if (value > 3.0) return 'critical';
        if (value > 2.5) return 'warning';
        return 'normal';
      
      case 'wave':
        if (value > 4.0) return 'critical';
        if (value > 2.5) return 'warning';
        return 'normal';
      
      case 'temperature':
        if (value > 35 || value < 0) return 'critical';
        if (value > 30 || value < 5) return 'warning';
        return 'normal';
      
      case 'wind_speed':
        if (value > 25) return 'critical';
        if (value > 15) return 'warning';
        return 'normal';
      
      case 'ph':
        if (value < 6.0 || value > 9.0) return 'critical';
        if (value < 6.5 || value > 8.5) return 'warning';
        return 'normal';
      
      default:
        return 'normal';
    }
  }

  // Generate simulated real-time tide data
  private generateSimulatedTideData(stationId: string): RealTimeSensorData {
    const now = new Date();
    const readings = [];
    
    // Generate 24 hours of simulated tide data
    for (let i = 0; i < 24; i++) {
      const time = new Date(now.getTime() - (23 - i) * 3600000);
      // Simulate tide cycle with some randomness
      const baseValue = 1.5 + Math.sin((i / 24) * 2 * Math.PI) * 0.8;
      const randomVariation = (Math.random() - 0.5) * 0.3;
      const value = Math.max(0, baseValue + randomVariation);
      
      readings.push({
        timestamp: time.toISOString(),
        value: parseFloat(value.toFixed(2)),
        unit: 'm',
        status: this.getStatusFromValue(value, 'tide'),
        rawValue: { simulated: true, value }
      });
    }
    
    return {
      id: `tide_${stationId}`,
      name: `NOAA Tide Station ${stationId}`,
      location: { lat: 0, lng: 0, name: 'Simulated Station' },
      type: 'tide_gauge',
      readings,
      lastUpdated: now.toISOString(),
      source: 'noaa',
      metadata: { stationId, simulated: true }
    };
  }

  // Generate simulated real-time wave buoy data
  private generateSimulatedWaveData(buoyId: string): RealTimeSensorData {
    const now = new Date();
    const readings = [];
    
    // Generate 24 hours of simulated wave data
    for (let i = 0; i < 24; i++) {
      const time = new Date(now.getTime() - (23 - i) * 3600000);
      // Simulate wave patterns with some randomness
      const baseValue = 1.2 + Math.sin((i / 24) * 2 * Math.PI) * 0.6;
      const randomVariation = (Math.random() - 0.5) * 0.4;
      const value = Math.max(0.1, baseValue + randomVariation);
      
      readings.push({
        timestamp: time.toISOString(),
        value: parseFloat(value.toFixed(2)),
        unit: 'm',
        status: this.getStatusFromValue(value, 'wave'),
        rawValue: { simulated: true, value }
      });
    }
    
    return {
      id: `wave_${buoyId}`,
      name: `NDBC Wave Buoy ${buoyId}`,
      location: { lat: 0, lng: 0, name: 'Simulated Buoy' },
      type: 'wave_buoy',
      readings,
      lastUpdated: now.toISOString(),
      source: 'ndbc',
      metadata: { stationId: buoyId, simulated: true }
    };
  }

  // Generate simulated real-time weather data
  private generateSimulatedWeatherData(stationId: string): RealTimeSensorData {
    const now = new Date();
    const readings = [];
    
    // Generate 24 hours of simulated weather data
    for (let i = 0; i < 24; i++) {
      const time = new Date(now.getTime() - (23 - i) * 3600000);
      // Simulate temperature with daily cycle
      const baseTemp = 20 + Math.sin((i / 24) * 2 * Math.PI) * 8;
      const randomVariation = (Math.random() - 0.5) * 3;
      const value = baseTemp + randomVariation;
      
      readings.push({
        timestamp: time.toISOString(),
        value: parseFloat(value.toFixed(1)),
        unit: '°C',
        status: this.getStatusFromValue(value, 'temperature'),
        rawValue: { simulated: true, value }
      });
    }
    
    return {
      id: `weather_${stationId}`,
      name: `Weather Station ${stationId}`,
      location: { lat: 0, lng: 0, name: 'Simulated Weather' },
      type: 'weather_station',
      readings,
      lastUpdated: now.toISOString(),
      source: 'ndbc',
      metadata: { stationId, simulated: true }
    };
  }

  // Generate simulated real-time water quality data
  private generateSimulatedQualityData(siteId: string): RealTimeSensorData {
    const now = new Date();
    const readings = [];
    
    // Generate 24 hours of simulated water quality data
    for (let i = 0; i < 24; i++) {
      const time = new Date(now.getTime() - (23 - i) * 3600000);
      // Simulate pH with slight variations
      const basePH = 7.2 + Math.sin((i / 24) * 2 * Math.PI) * 0.3;
      const randomVariation = (Math.random() - 0.5) * 0.2;
      const value = basePH + randomVariation;
      
      readings.push({
        timestamp: time.toISOString(),
        value: parseFloat(value.toFixed(2)),
        unit: 'pH',
        status: this.getStatusFromValue(value, 'ph'),
        rawValue: { simulated: true, value }
      });
    }
    
    return {
      id: `quality_${siteId}`,
      name: `USGS Water Quality Site ${siteId}`,
      location: { lat: 0, lng: 0, name: 'Simulated Quality' },
      type: 'water_quality',
      readings,
      lastUpdated: now.toISOString(),
      source: 'usgs',
      metadata: { stationId: siteId, simulated: true }
    };
  }

  // Generate simulated real-time wind speed data
  private generateSimulatedWindData(stationId: string): RealTimeSensorData {
    const now = new Date();
    const readings = [];
    
    // Generate 24 hours of simulated wind speed data
    for (let i = 0; i < 24; i++) {
      const time = new Date(now.getTime() - (23 - i) * 3600000);
      // Simulate wind speed with daily patterns
      const baseSpeed = 8 + Math.sin((i / 24) * 2 * Math.PI) * 4;
      const randomVariation = (Math.random() - 0.5) * 3;
      const value = Math.max(0, baseSpeed + randomVariation);
      
      readings.push({
        timestamp: time.toISOString(),
        value: parseFloat(value.toFixed(1)),
        unit: 'm/s',
        status: this.getStatusFromValue(value, 'wind_speed'),
        rawValue: { simulated: true, value }
      });
    }
    
    return {
      id: `wind_${stationId}`,
      name: `Wind Speed Station ${stationId}`,
      location: { lat: 0, lng: 0, name: 'Simulated Wind' },
      type: 'weather_station',
      readings,
      lastUpdated: now.toISOString(),
      source: 'ndbc',
      metadata: { stationId, simulated: true }
    };
  }

  // Get mixed sensor data for dashboard display
  async getMixedSensorData(): Promise<RealTimeSensorData[]> {
    try {
      const sensors: RealTimeSensorData[] = [];
      
      // Get tide gauge data (water level in meters)
      try {
        const tideData = await this.getTideGaugeData('9447130'); // Seattle
        sensors.push(tideData);
      } catch (error) {
        console.warn('Failed to get tide data:', error);
      }
      
      // Get weather station data (temperature in Celsius)
      try {
        const weatherData = await this.getWeatherStationData('41012'); // Miami
        sensors.push(weatherData);
      } catch (error) {
        console.warn('Failed to get weather data:', error);
      }
      
      // Get water quality data (pH values)
      try {
        const qualityData = await this.getWaterQualityData('08030500'); // USGS site
        sensors.push(qualityData);
      } catch (error) {
        console.warn('Failed to get water quality data:', error);
      }
      
      // Get wave buoy data (wave height in meters)
      try {
        const waveData = await this.getWaveBuoyData('41012'); // NDBC buoy
        sensors.push(waveData);
      } catch (error) {
        console.warn('Failed to get wave data:', error);
      }
      
      return sensors;
    } catch (error) {
      console.error('Error getting mixed sensor data:', error);
      // Fallback to simulated data
      return [
        this.generateSimulatedTideData('seattle'),
        this.generateSimulatedWeatherData('miami'),
        this.generateSimulatedQualityData('chennai'),
        this.generateSimulatedWaveData('kerala')
      ];
    }
  }
}

// Export instances
export const noaaAPI = new NOAAAPI();
export const ndbcAPI = new NDBCAPI();
export const usgsAPI = new USGSAPI();

// Export the main service
export const realTimeDataService = new RealTimeDataService();
