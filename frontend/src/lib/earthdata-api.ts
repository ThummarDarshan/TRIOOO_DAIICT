// NASA Earthdata API Service for Coastal Monitoring
// Provides access to oceanographic and climate data

export interface EarthdataConfig {
  baseUrl: string;
  apiKey?: string;
  username?: string;
  password?: string;
}

export interface EarthdataDataset {
  id: string;
  name: string;
  description: string;
  variables: string[];
  temporalResolution: string;
  spatialResolution: string;
  lastUpdated: string;
}

export interface OceanDataPoint {
  timestamp: string;
  latitude: number;
  longitude: number;
  value: number;
  unit: string;
  quality: 'good' | 'fair' | 'poor';
  source: string;
}

export interface SSTData extends OceanDataPoint {
  depth?: number; // Sea surface temperature (usually 0m)
  anomaly?: number; // Temperature anomaly from climatology
}

export interface SeaLevelData extends OceanDataPoint {
  anomaly?: number; // Sea level anomaly from mean
  trend?: number; // Long-term trend
}

export interface ChlorophyllData extends OceanDataPoint {
  concentration: number; // Chlorophyll-a concentration
  bloomRisk: 'low' | 'medium' | 'high';
}

export interface WindData extends OceanDataPoint {
  direction: number; // Wind direction in degrees
  speed: number; // Wind speed
  gust?: number; // Wind gust speed
}

export interface RainfallData extends OceanDataPoint {
  intensity: 'light' | 'moderate' | 'heavy' | 'extreme';
  accumulation: number; // Total rainfall
  duration: number; // Duration in hours
}

export interface EarthdataQueryParams {
  dataset: string;
  variables: string[];
  startDate: string;
  endDate: string;
  boundingBox?: [number, number, number, number]; // [minLat, minLon, maxLat, maxLon]
  resolution?: string;
  format?: 'netcdf' | 'json' | 'csv';
}

export interface EarthdataResponse<T> {
  data: T[];
  metadata: {
    totalCount: number;
    timeRange: {
      start: string;
      end: string;
    };
    spatialCoverage: {
      boundingBox: [number, number, number, number];
      resolution: string;
    };
    dataQuality: {
      completeness: number;
      accuracy: number;
    };
  };
  error?: string;
}

class EarthdataAPIService {
  private config: EarthdataConfig;
  private datasets: Map<string, EarthdataDataset>;

  constructor(config: EarthdataConfig) {
    this.config = config;
    this.datasets = this.initializeDatasets();
  }

  private initializeDatasets(): Map<string, EarthdataDataset> {
    const datasets = new Map<string, EarthdataDataset>();
    
    // Sea Surface Temperature datasets
    datasets.set('MUR_SST', {
      id: 'MUR_SST',
      name: 'MUR Sea Surface Temperature',
      description: 'Multi-scale Ultra-high Resolution Sea Surface Temperature',
      variables: ['sst', 'sst_anomaly'],
      temporalResolution: 'daily',
      spatialResolution: '1km',
      lastUpdated: new Date().toISOString()
    });

    datasets.set('GHRSST_L4', {
      id: 'GHRSST_L4',
      name: 'GHRSST Level 4 SST',
      description: 'Group for High Resolution Sea Surface Temperature Level 4',
      variables: ['sst', 'quality'],
      temporalResolution: 'daily',
      spatialResolution: '5km',
      lastUpdated: new Date().toISOString()
    });

    // Sea Level datasets
    datasets.set('AVISO_SLA', {
      id: 'AVISO_SLA',
      name: 'AVISO Sea Level Anomaly',
      description: 'Archiving, Validation and Interpretation of Satellite Oceanographic data',
      variables: ['sla', 'adt', 'ugos', 'vgos'],
      temporalResolution: 'daily',
      spatialResolution: '0.25°',
      lastUpdated: new Date().toISOString()
    });

    datasets.set('JASON_SLA', {
      id: 'JASON_SLA',
      name: 'Jason Sea Level Anomaly',
      description: 'Jason satellite altimetry sea level data',
      variables: ['sla', 'wind_speed', 'wave_height'],
      temporalResolution: '10-day',
      spatialResolution: '0.2°',
      lastUpdated: new Date().toISOString()
    });

    // Chlorophyll datasets
    datasets.set('OCEANCOLOR_CHL', {
      id: 'OCEANCOLOR_CHL',
      name: 'Ocean Color Chlorophyll',
      description: 'NASA Ocean Color chlorophyll-a concentration',
      variables: ['chlor_a', 'chlor_a_anom', 'quality'],
      temporalResolution: '8-day',
      spatialResolution: '4km',
      lastUpdated: new Date().toISOString()
    });

    datasets.set('VIIRS_CHL', {
      id: 'VIIRS_CHL',
      name: 'VIIRS Chlorophyll',
      description: 'Visible Infrared Imaging Radiometer Suite chlorophyll data',
      variables: ['chlor_a', 'nflh', 'quality'],
      temporalResolution: 'daily',
      spatialResolution: '750m',
      lastUpdated: new Date().toISOString()
    });

    // Wind datasets
    datasets.set('ASCAT_WIND', {
      id: 'ASCAT_WIND',
      name: 'ASCAT Wind',
      description: 'Advanced Scatterometer wind vector data',
      variables: ['wind_speed', 'wind_direction', 'quality'],
      temporalResolution: 'daily',
      spatialResolution: '25km',
      lastUpdated: new Date().toISOString()
    });

    datasets.set('CCMP_WIND', {
      id: 'CCMP_WIND',
      name: 'CCMP Wind',
      description: 'Cross-Calibrated Multi-Platform wind data',
      variables: ['uwnd', 'vwnd', 'wind_speed', 'quality'],
      temporalResolution: '6-hourly',
      spatialResolution: '0.25°',
      lastUpdated: new Date().toISOString()
    });

    // Rainfall datasets
    datasets.set('IMERG_RAIN', {
      id: 'IMERG_RAIN',
      name: 'IMERG Rainfall',
      description: 'Integrated Multi-satellitE Retrievals for GPM rainfall',
      variables: ['precipitation', 'precipitation_quality', 'latent_heat'],
      temporalResolution: '30-minute',
      spatialResolution: '0.1°',
      lastUpdated: new Date().toISOString()
    });

    datasets.set('TRMM_RAIN', {
      id: 'TRMM_RAIN',
      name: 'TRMM Rainfall',
      description: 'Tropical Rainfall Measuring Mission precipitation data',
      variables: ['precipitation', 'precipitation_quality', 'latent_heat'],
      temporalResolution: '3-hourly',
      spatialResolution: '0.25°',
      lastUpdated: new Date().toISOString()
    });

    return datasets;
  }

  // Get available datasets
  async getAvailableDatasets(): Promise<EarthdataDataset[]> {
    return Array.from(this.datasets.values());
  }

  // Get dataset information
  async getDatasetInfo(datasetId: string): Promise<EarthdataDataset | null> {
    return this.datasets.get(datasetId) || null;
  }

  // Fetch Sea Surface Temperature data
  async getSSTData(params: {
    startDate: string;
    endDate: string;
    boundingBox?: [number, number, number, number];
    dataset?: string;
  }): Promise<EarthdataResponse<SSTData>> {
    const dataset = params.dataset || 'MUR_SST';
    const datasetInfo = this.datasets.get(dataset);
    
    if (!datasetInfo) {
      throw new Error(`Dataset ${dataset} not found`);
    }

    try {
      // Simulate API call to Earthdata
      const mockData = this.generateMockSSTData(params);
      
      return {
        data: mockData,
        metadata: {
          totalCount: mockData.length,
          timeRange: {
            start: params.startDate,
            end: params.endDate
          },
          spatialCoverage: {
            boundingBox: params.boundingBox || [-90, -180, 90, 180],
            resolution: datasetInfo.spatialResolution
          },
          dataQuality: {
            completeness: 0.95,
            accuracy: 0.92
          }
        }
      };
    } catch (error) {
      return {
        data: [],
        metadata: {
          totalCount: 0,
          timeRange: { start: params.startDate, end: params.endDate },
          spatialCoverage: { boundingBox: [0, 0, 0, 0], resolution: 'unknown' },
          dataQuality: { completeness: 0, accuracy: 0 }
        },
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Fetch Sea Level data
  async getSeaLevelData(params: {
    startDate: string;
    endDate: string;
    boundingBox?: [number, number, number, number];
    dataset?: string;
  }): Promise<EarthdataResponse<SeaLevelData>> {
    const dataset = params.dataset || 'AVISO_SLA';
    const datasetInfo = this.datasets.get(dataset);
    
    if (!datasetInfo) {
      throw new Error(`Dataset ${dataset} not found`);
    }

    try {
      const mockData = this.generateMockSeaLevelData(params);
      
      return {
        data: mockData,
        metadata: {
          totalCount: mockData.length,
          timeRange: {
            start: params.startDate,
            end: params.endDate
          },
          spatialCoverage: {
            boundingBox: params.boundingBox || [-90, -180, 90, 180],
            resolution: datasetInfo.spatialResolution
          },
          dataQuality: {
            completeness: 0.88,
            accuracy: 0.89
          }
        }
      };
    } catch (error) {
      return {
        data: [],
        metadata: {
          totalCount: 0,
          timeRange: { start: params.startDate, end: params.endDate },
          spatialCoverage: { boundingBox: [0, 0, 0, 0], resolution: 'unknown' },
          dataQuality: { completeness: 0, accuracy: 0 }
        },
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Fetch Chlorophyll data
  async getChlorophyllData(params: {
    startDate: string;
    endDate: string;
    boundingBox?: [number, number, number, number];
    dataset?: string;
  }): Promise<EarthdataResponse<ChlorophyllData>> {
    const dataset = params.dataset || 'OCEANCOLOR_CHL';
    const datasetInfo = this.datasets.get(dataset);
    
    if (!datasetInfo) {
      throw new Error(`Dataset ${dataset} not found`);
    }

    try {
      const mockData = this.generateMockChlorophyllData(params);
      
      return {
        data: mockData,
        metadata: {
          totalCount: mockData.length,
          timeRange: {
            start: params.startDate,
            end: params.endDate
          },
          spatialCoverage: {
            boundingBox: params.boundingBox || [-90, -180, 90, 180],
            resolution: datasetInfo.spatialResolution
          },
          dataQuality: {
            completeness: 0.82,
            accuracy: 0.85
          }
        }
      };
    } catch (error) {
      return {
        data: [],
        metadata: {
          totalCount: 0,
          timeRange: { start: params.startDate, end: params.endDate },
          spatialCoverage: { boundingBox: [0, 0, 0, 0], resolution: 'unknown' },
          dataQuality: { completeness: 0, accuracy: 0 }
        },
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Fetch Wind data
  async getWindData(params: {
    startDate: string;
    endDate: string;
    boundingBox?: [number, number, number, number];
    dataset?: string;
  }): Promise<EarthdataResponse<WindData>> {
    const dataset = params.dataset || 'ASCAT_WIND';
    const datasetInfo = this.datasets.get(dataset);
    
    if (!datasetInfo) {
      throw new Error(`Dataset ${dataset} not found`);
    }

    try {
      const mockData = this.generateMockWindData(params);
      
      return {
        data: mockData,
        metadata: {
          totalCount: mockData.length,
          timeRange: {
            start: params.startDate,
            end: params.endDate
          },
          spatialCoverage: {
            boundingBox: params.boundingBox || [-90, -180, 90, 180],
            resolution: datasetInfo.spatialResolution
          },
          dataQuality: {
            completeness: 0.91,
            accuracy: 0.87
          }
        }
      };
    } catch (error) {
      return {
        data: [],
        metadata: {
          totalCount: 0,
          timeRange: { start: params.startDate, end: params.endDate },
          spatialCoverage: { boundingBox: [0, 0, 0, 0], resolution: 'unknown' },
          dataQuality: { completeness: 0, accuracy: 0 }
        },
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Fetch Rainfall data
  async getRainfallData(params: {
    startDate: string;
    endDate: string;
    boundingBox?: [number, number, number, number];
    dataset?: string;
  }): Promise<EarthdataResponse<RainfallData>> {
    const dataset = params.dataset || 'IMERG_RAIN';
    const datasetInfo = this.datasets.get(dataset);
    
    if (!datasetInfo) {
      throw new Error(`Dataset ${dataset} not found`);
    }

    try {
      const mockData = this.generateMockRainfallData(params);
      
      return {
        data: mockData,
        metadata: {
          totalCount: mockData.length,
          timeRange: {
            start: params.startDate,
            end: params.endDate
          },
          spatialCoverage: {
            boundingBox: params.boundingBox || [-90, -180, 90, 180],
            resolution: datasetInfo.spatialResolution
          },
          dataQuality: {
            completeness: 0.94,
            accuracy: 0.90
          }
        }
      };
    } catch (error) {
      return {
        data: [],
        metadata: {
          totalCount: 0,
          timeRange: { start: params.startDate, end: params.endDate },
          spatialCoverage: { boundingBox: [0, 0, 0, 0], resolution: 'unknown' },
          dataQuality: { completeness: 0, accuracy: 0 }
        },
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Generate mock SST data for development
  private generateMockSSTData(params: any): SSTData[] {
    const data: SSTData[] = [];
    const startDate = new Date(params.startDate);
    const endDate = new Date(params.endDate);
    const bbox = params.boundingBox || [18, 72, 20, 75]; // Mumbai region
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      for (let lat = bbox[0]; lat <= bbox[2]; lat += 0.1) {
        for (let lon = bbox[1]; lon <= bbox[3]; lon += 0.1) {
          const baseTemp = 25 + Math.sin((d.getTime() / (365 * 24 * 60 * 60 * 1000)) * 2 * Math.PI) * 5;
          const temp = baseTemp + (Math.random() - 0.5) * 2;
          
          data.push({
            timestamp: d.toISOString(),
            latitude: lat,
            longitude: lon,
            value: Math.round(temp * 100) / 100,
            unit: '°C',
            quality: Math.random() > 0.1 ? 'good' : 'fair',
            source: 'MUR_SST',
            depth: 0,
            anomaly: Math.round((temp - baseTemp) * 100) / 100
          });
        }
      }
    }
    
    return data;
  }

  // Generate mock sea level data
  private generateMockSeaLevelData(params: any): SeaLevelData[] {
    const data: SeaLevelData[] = [];
    const startDate = new Date(params.startDate);
    const endDate = new Date(params.endDate);
    const bbox = params.boundingBox || [18, 72, 20, 75];
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      for (let lat = bbox[0]; lat <= bbox[2]; lat += 0.25) {
        for (let lon = bbox[1]; lon <= bbox[3]; lon += 0.25) {
          const baseLevel = 0.5 + Math.sin((d.getTime() / (12.4 * 60 * 60 * 1000)) * 2 * Math.PI) * 0.3;
          const level = baseLevel + (Math.random() - 0.5) * 0.1;
          
          data.push({
            timestamp: d.toISOString(),
            latitude: lat,
            longitude: lon,
            value: Math.round(level * 1000) / 1000,
            unit: 'm',
            quality: Math.random() > 0.15 ? 'good' : 'fair',
            source: 'AVISO_SLA',
            anomaly: Math.round((level - baseLevel) * 1000) / 1000,
            trend: 0.003 // 3mm/year rise
          });
        }
      }
    }
    
    return data;
  }

  // Generate mock chlorophyll data
  private generateMockChlorophyllData(params: any): ChlorophyllData[] {
    const data: ChlorophyllData[] = [];
    const startDate = new Date(params.startDate);
    const endDate = new Date(params.endDate);
    const bbox = params.boundingBox || [18, 72, 20, 75];
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 8)) {
      for (let lat = bbox[0]; lat <= bbox[2]; lat += 0.04) {
        for (let lon = bbox[1]; lon <= bbox[3]; lon += 0.04) {
          const baseChl = 0.5 + Math.sin((d.getTime() / (365 * 24 * 60 * 60 * 1000)) * 2 * Math.PI) * 0.3;
          const chl = Math.max(0.01, baseChl + (Math.random() - 0.5) * 0.2);
          
          data.push({
            timestamp: d.toISOString(),
            latitude: lat,
            longitude: lon,
            value: Math.round(chl * 1000) / 1000,
            unit: 'mg/m³',
            quality: Math.random() > 0.2 ? 'good' : 'fair',
            source: 'OCEANCOLOR_CHL',
            concentration: Math.round(chl * 1000) / 1000,
            bloomRisk: chl > 1.0 ? 'high' : chl > 0.5 ? 'medium' : 'low'
          });
        }
      }
    }
    
    return data;
  }

  // Generate mock wind data
  private generateMockWindData(params: any): WindData[] {
    const data: WindData[] = [];
    const startDate = new Date(params.startDate);
    const endDate = new Date(params.endDate);
    const bbox = params.boundingBox || [18, 72, 20, 75];
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      for (let lat = bbox[0]; lat <= bbox[2]; lat += 0.25) {
        for (let lon = bbox[1]; lon <= bbox[3]; lon += 0.25) {
          const baseSpeed = 8 + Math.sin((d.getTime() / (24 * 60 * 60 * 1000)) * 2 * Math.PI) * 3;
          const speed = Math.max(0.5, baseSpeed + (Math.random() - 0.5) * 4);
          const direction = Math.random() * 360;
          
          data.push({
            timestamp: d.toISOString(),
            latitude: lat,
            longitude: lon,
            value: Math.round(speed * 10) / 10,
            unit: 'm/s',
            quality: Math.random() > 0.1 ? 'good' : 'fair',
            source: 'ASCAT_WIND',
            direction: Math.round(direction),
            speed: Math.round(speed * 10) / 10,
            gust: Math.round((speed + Math.random() * 5) * 10) / 10
          });
        }
      }
    }
    
    return data;
  }

  // Generate mock rainfall data
  private generateMockRainfallData(params: any): RainfallData[] {
    const data: RainfallData[] = [];
    const startDate = new Date(params.startDate);
    const endDate = new Date(params.endDate);
    const bbox = params.boundingBox || [18, 72, 20, 75];
    
    for (let d = new Date(startDate); d <= endDate; d.setHours(d.getHours() + 3)) {
      for (let lat = bbox[0]; lat <= bbox[2]; lat += 0.1) {
        for (let lon = bbox[1]; lon <= bbox[3]; lon += 0.1) {
          const rainfall = Math.random() > 0.7 ? Math.random() * 50 : 0;
          const intensity = rainfall > 30 ? 'heavy' : rainfall > 15 ? 'moderate' : rainfall > 5 ? 'light' : 'light';
          
          data.push({
            timestamp: d.toISOString(),
            latitude: lat,
            longitude: lon,
            value: Math.round(rainfall * 100) / 100,
            unit: 'mm',
            quality: Math.random() > 0.1 ? 'good' : 'fair',
            source: 'IMERG_RAIN',
            intensity,
            accumulation: Math.round(rainfall * 100) / 100,
            duration: 3
          });
        }
      }
    }
    
    return data;
  }

  // Get data quality metrics
  async getDataQualityMetrics(datasetId: string): Promise<{
    completeness: number;
    accuracy: number;
    timeliness: number;
    spatialCoverage: number;
  }> {
    const dataset = this.datasets.get(datasetId);
    if (!dataset) {
      throw new Error(`Dataset ${datasetId} not found`);
    }

    // Mock quality metrics based on dataset type
    const baseMetrics = {
      completeness: 0.9,
      accuracy: 0.85,
      timeliness: 0.95,
      spatialCoverage: 0.88
    };

    // Adjust based on dataset characteristics
    if (datasetId.includes('SST')) {
      baseMetrics.accuracy = 0.92;
      baseMetrics.timeliness = 0.98;
    } else if (datasetId.includes('CHL')) {
      baseMetrics.accuracy = 0.82;
      baseMetrics.completeness = 0.85;
    } else if (datasetId.includes('WIND')) {
      baseMetrics.accuracy = 0.87;
      baseMetrics.spatialCoverage = 0.92;
    } else if (datasetId.includes('RAIN')) {
      baseMetrics.accuracy = 0.90;
      baseMetrics.timeliness = 0.99;
    }

    return baseMetrics;
  }

  // Get temporal coverage for a dataset
  async getTemporalCoverage(datasetId: string): Promise<{
    startDate: string;
    endDate: string;
    temporalResolution: string;
    updateFrequency: string;
  }> {
    const dataset = this.datasets.get(datasetId);
    if (!dataset) {
      throw new Error(`Dataset ${datasetId} not found`);
    }

    const now = new Date();
    const startDate = new Date(now.getFullYear() - 5, 0, 1); // 5 years ago

    return {
      startDate: startDate.toISOString(),
      endDate: now.toISOString(),
      temporalResolution: dataset.temporalResolution,
      updateFrequency: dataset.temporalResolution
    };
  }
}

// Export default instance with default configuration
export const earthdataAPI = new EarthdataAPIService({
  baseUrl: 'https://cmr.earthdata.nasa.gov',
  // Add your Earthdata credentials here
  // username: process.env.EARTHDATA_USERNAME,
  // password: process.env.EARTHDATA_PASSWORD,
});

export default EarthdataAPIService; 