import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  earthdataAPI, 
  type SSTData, 
  type SeaLevelData, 
  type ChlorophyllData, 
  type WindData, 
  type RainfallData,
  type EarthdataDataset 
} from '@/lib/earthdata-api';

// Query keys for React Query
export const earthdataQueryKeys = {
  datasets: ['earthdata', 'datasets'] as const,
  dataset: (id: string) => ['earthdata', 'dataset', id] as const,
  sst: (params: any) => ['earthdata', 'sst', params] as const,
  seaLevel: (params: any) => ['earthdata', 'seaLevel', params] as const,
  chlorophyll: (params: any) => ['earthdata', 'chlorophyll', params] as const,
  wind: (params: any) => ['earthdata', 'wind', params] as const,
  rainfall: (params: any) => ['earthdata', 'rainfall', params] as const,
  qualityMetrics: (datasetId: string) => ['earthdata', 'quality', datasetId] as const,
  temporalCoverage: (datasetId: string) => ['earthdata', 'temporal', datasetId] as const,
};

// Hook for fetching available Earthdata datasets
export const useEarthdataDatasets = () => {
  return useQuery({
    queryKey: earthdataQueryKeys.datasets,
    queryFn: () => earthdataAPI.getAvailableDatasets(),
    staleTime: 300000, // 5 minutes
    refetchInterval: 600000, // Refetch every 10 minutes
  });
};

// Hook for fetching specific dataset information
export const useEarthdataDataset = (datasetId: string) => {
  return useQuery({
    queryKey: earthdataQueryKeys.dataset(datasetId),
    queryFn: () => earthdataAPI.getDatasetInfo(datasetId),
    enabled: !!datasetId,
    staleTime: 300000,
  });
};

// Hook for fetching Sea Surface Temperature data
export const useSSTData = (params: {
  startDate: string;
  endDate: string;
  boundingBox?: [number, number, number, number];
  dataset?: string;
}) => {
  return useQuery({
    queryKey: earthdataQueryKeys.sst(params),
    queryFn: () => earthdataAPI.getSSTData(params),
    enabled: !!(params.startDate && params.endDate),
    staleTime: 180000, // 3 minutes for SST data
    refetchInterval: 300000, // Refetch every 5 minutes
  });
};

// Hook for fetching Sea Level data
export const useSeaLevelData = (params: {
  startDate: string;
  endDate: string;
  boundingBox?: [number, number, number, number];
  dataset?: string;
}) => {
  return useQuery({
    queryKey: earthdataQueryKeys.seaLevel(params),
    queryFn: () => earthdataAPI.getSeaLevelData(params),
    enabled: !!(params.startDate && params.endDate),
    staleTime: 180000,
    refetchInterval: 300000,
  });
};

// Hook for fetching Chlorophyll data
export const useChlorophyllData = (params: {
  startDate: string;
  endDate: string;
  boundingBox?: [number, number, number, number];
  dataset?: string;
}) => {
  return useQuery({
    queryKey: earthdataQueryKeys.chlorophyll(params),
    queryFn: () => earthdataAPI.getChlorophyllData(params),
    enabled: !!(params.startDate && params.endDate),
    staleTime: 300000, // 5 minutes for chlorophyll data
    refetchInterval: 600000, // Refetch every 10 minutes
  });
};

// Hook for fetching Wind data
export const useWindData = (params: {
  startDate: string;
  endDate: string;
  boundingBox?: [number, number, number, number];
  dataset?: string;
}) => {
  return useQuery({
    queryKey: earthdataQueryKeys.wind(params),
    queryFn: () => earthdataAPI.getWindData(params),
    enabled: !!(params.startDate && params.endDate),
    staleTime: 120000, // 2 minutes for wind data
    refetchInterval: 180000, // Refetch every 3 minutes
  });
};

// Hook for fetching Rainfall data
export const useRainfallData = (params: {
  startDate: string;
  endDate: string;
  boundingBox?: [number, number, number, number];
  dataset?: string;
}) => {
  return useQuery({
    queryKey: earthdataQueryKeys.rainfall(params),
    queryFn: () => earthdataAPI.getRainfallData(params),
    enabled: !!(params.startDate && params.endDate),
    staleTime: 60000, // 1 minute for rainfall data
    refetchInterval: 120000, // Refetch every 2 minutes
  });
};

// Hook for fetching data quality metrics
export const useDataQualityMetrics = (datasetId: string) => {
  return useQuery({
    queryKey: earthdataQueryKeys.qualityMetrics(datasetId),
    queryFn: () => earthdataAPI.getDataQualityMetrics(datasetId),
    enabled: !!datasetId,
    staleTime: 600000, // 10 minutes
  });
};

// Hook for fetching temporal coverage information
export const useTemporalCoverage = (datasetId: string) => {
  return useQuery({
    queryKey: earthdataQueryKeys.temporalCoverage(datasetId),
    queryFn: () => earthdataAPI.getTemporalCoverage(datasetId),
    enabled: !!datasetId,
    staleTime: 600000, // 10 minutes
  });
};

// Hook for getting real-time oceanographic data summary
export const useOceanographicSummary = (boundingBox?: [number, number, number, number]) => {
  const now = new Date();
  const startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(); // Last 24 hours
  const endDate = now.toISOString();
  
  const defaultBbox: [number, number, number, number] = boundingBox || [18, 72, 20, 75]; // Mumbai region
  
  const { data: sstData, isLoading: sstLoading } = useSSTData({
    startDate,
    endDate,
    boundingBox: defaultBbox,
    dataset: 'MUR_SST'
  });
  
  const { data: seaLevelData, isLoading: seaLevelLoading } = useSeaLevelData({
    startDate,
    endDate,
    boundingBox: defaultBbox,
    dataset: 'AVISO_SLA'
  });
  
  const { data: chlorophyllData, isLoading: chlorophyllLoading } = useChlorophyllData({
    startDate,
    endDate,
    boundingBox: defaultBbox,
    dataset: 'OCEANCOLOR_CHL'
  });
  
  const { data: windData, isLoading: windLoading } = useWindData({
    startDate,
    endDate,
    boundingBox: defaultBbox,
    dataset: 'ASCAT_WIND'
  });
  
  const { data: rainfallData, isLoading: rainfallLoading } = useRainfallData({
    startDate,
    endDate,
    boundingBox: defaultBbox,
    dataset: 'IMERG_RAIN'
  });

  const summary = React.useMemo(() => {
    if (!sstData?.data || !seaLevelData?.data || !chlorophyllData?.data || 
        !windData?.data || !rainfallData?.data) {
      return null;
    }

    // Calculate averages and trends for each parameter
    const sstAvg = sstData.data.reduce((sum, point) => sum + point.value, 0) / sstData.data.length;
    const seaLevelAvg = seaLevelData.data.reduce((sum, point) => sum + point.value, 0) / seaLevelData.data.length;
    const chlorophyllAvg = chlorophyllData.data.reduce((sum, point) => sum + point.value, 0) / chlorophyllData.data.length;
    const windAvg = windData.data.reduce((sum, point) => sum + point.speed, 0) / windData.data.length;
    const rainfallTotal = rainfallData.data.reduce((sum, point) => sum + point.accumulation, 0);

    // Determine risk levels
    const sstRisk = sstAvg > 30 ? 'high' : sstAvg > 28 ? 'medium' : 'low';
    const seaLevelRisk = Math.abs(seaLevelAvg) > 0.5 ? 'high' : Math.abs(seaLevelAvg) > 0.3 ? 'medium' : 'low';
    const chlorophyllRisk = chlorophyllAvg > 1.0 ? 'high' : chlorophyllAvg > 0.5 ? 'medium' : 'low';
    const windRisk = windAvg > 15 ? 'high' : windAvg > 10 ? 'medium' : 'low';
    const rainfallRisk = rainfallTotal > 50 ? 'high' : rainfallTotal > 25 ? 'medium' : 'low';

    return {
      timestamp: new Date().toISOString(),
      location: {
        boundingBox: defaultBbox,
        center: {
          lat: (defaultBbox[0] + defaultBbox[2]) / 2,
          lng: (defaultBbox[1] + defaultBbox[3]) / 2
        }
      },
      parameters: {
        seaSurfaceTemperature: {
          value: Math.round(sstAvg * 100) / 100,
          unit: '°C',
          risk: sstRisk,
          trend: sstData.data.length > 1 ? 
            (sstData.data[sstData.data.length - 1].value - sstData.data[0].value) > 0 ? 'increasing' : 'decreasing' : 'stable'
        },
        seaLevel: {
          value: Math.round(seaLevelAvg * 1000) / 1000,
          unit: 'm',
          risk: seaLevelRisk,
          trend: seaLevelData.data.length > 1 ? 
            (seaLevelData.data[seaLevelData.data.length - 1].value - seaLevelData.data[0].value) > 0 ? 'increasing' : 'decreasing' : 'stable'
        },
        chlorophyll: {
          value: Math.round(chlorophyllAvg * 1000) / 1000,
          unit: 'mg/m³',
          risk: chlorophyllRisk,
          bloomRisk: chlorophyllData.data[0]?.bloomRisk || 'low'
        },
        wind: {
          speed: Math.round(windAvg * 10) / 10,
          unit: 'm/s',
          risk: windRisk,
          direction: windData.data[0]?.direction || 0
        },
        rainfall: {
          total: Math.round(rainfallTotal * 100) / 100,
          unit: 'mm',
          risk: rainfallRisk,
          intensity: rainfallData.data[0]?.intensity || 'light'
        }
      },
      overallRisk: [sstRisk, seaLevelRisk, chlorophyllRisk, windRisk, rainfallRisk]
        .filter(risk => risk === 'high').length > 2 ? 'high' :
        [sstRisk, seaLevelRisk, chlorophyllRisk, windRisk, rainfallRisk]
        .filter(risk => risk === 'high').length > 0 ? 'medium' : 'low',
      dataQuality: {
        sst: sstData.metadata.dataQuality,
        seaLevel: seaLevelData.metadata.dataQuality,
        chlorophyll: chlorophyllData.metadata.dataQuality,
        wind: windData.metadata.dataQuality,
        rainfall: rainfallData.metadata.dataQuality
      }
    };
  }, [sstData, seaLevelData, chlorophyllData, windData, rainfallData, defaultBbox]);

  return {
    data: summary,
    isLoading: sstLoading || seaLevelLoading || chlorophyllLoading || windLoading || rainfallLoading,
    error: sstData?.error || seaLevelData?.error || chlorophyllData?.error || windData?.error || rainfallData?.error
  };
};

// Hook for getting coastal threat assessment based on Earthdata
export const useCoastalThreatAssessment = (boundingBox?: [number, number, number, number]) => {
  const { data: oceanSummary, isLoading } = useOceanographicSummary(boundingBox);
  
  const threatAssessment = React.useMemo(() => {
    if (!oceanSummary) return null;

    let threatScore = 0;
    let threatFactors: string[] = [];
    let recommendations: string[] = [];

    // Assess SST threats
    if (oceanSummary.parameters.seaSurfaceTemperature.risk === 'high') {
      threatScore += 25;
      threatFactors.push('Elevated sea surface temperature');
      recommendations.push('Monitor for coral bleaching and marine heat waves');
    }

    // Assess sea level threats
    if (oceanSummary.parameters.seaLevel.risk === 'high') {
      threatScore += 30;
      threatFactors.push('Abnormal sea level variations');
      recommendations.push('Prepare for potential coastal flooding');
    }

    // Assess chlorophyll threats
    if (oceanSummary.parameters.chlorophyll.risk === 'high') {
      threatScore += 20;
      threatFactors.push('High chlorophyll concentration');
      recommendations.push('Monitor for harmful algal blooms');
    }

    // Assess wind threats
    if (oceanSummary.parameters.wind.risk === 'high') {
      threatScore += 15;
      threatFactors.push('High wind speeds');
      recommendations.push('Prepare for storm conditions');
    }

    // Assess rainfall threats
    if (oceanSummary.parameters.rainfall.risk === 'high') {
      threatScore += 20;
      threatFactors.push('Heavy rainfall');
      recommendations.push('Monitor for runoff and water quality issues');
    }

    // Determine overall threat level
    let threatLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (threatScore >= 80) threatLevel = 'critical';
    else if (threatScore >= 60) threatLevel = 'high';
    else if (threatScore >= 30) threatLevel = 'medium';

    return {
      threatScore,
      threatLevel,
      threatFactors,
      recommendations,
      timestamp: oceanSummary.timestamp,
      location: oceanSummary.location,
      parameters: oceanSummary.parameters
    };
  }, [oceanSummary]);

  return {
    data: threatAssessment,
    isLoading
  };
};

// Hook for getting historical trends
export const useHistoricalTrends = (parameter: 'sst' | 'seaLevel' | 'chlorophyll' | 'wind' | 'rainfall', days: number = 30) => {
  const now = new Date();
  const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();
  const endDate = now.toISOString();
  
  const defaultBbox: [number, number, number, number] = [18, 72, 20, 75]; // Mumbai region
  
  const { data: sstData } = useSSTData({
    startDate,
    endDate,
    boundingBox: defaultBbox
  });
  
  const { data: seaLevelData } = useSeaLevelData({
    startDate,
    endDate,
    boundingBox: defaultBbox
  });
  
  const { data: chlorophyllData } = useChlorophyllData({
    startDate,
    endDate,
    boundingBox: defaultBbox
  });
  
  const { data: windData } = useWindData({
    startDate,
    endDate,
    boundingBox: defaultBbox
  });
  
  const { data: rainfallData } = useRainfallData({
    startDate,
    endDate,
    boundingBox: defaultBbox
  });

  const trends = React.useMemo(() => {
    let data: any = null;
    
    switch (parameter) {
      case 'sst':
        data = sstData;
        break;
      case 'seaLevel':
        data = seaLevelData;
        break;
      case 'chlorophyll':
        data = chlorophyllData;
        break;
      case 'wind':
        data = windData;
        break;
      case 'rainfall':
        data = rainfallData;
        break;
    }

    if (!data?.data || data.data.length === 0) return null;

    // Calculate trend statistics
    const values = data.data.map((point: any) => 
      parameter === 'wind' ? point.speed : point.value
    );
    
    const timestamps = data.data.map((point: any) => new Date(point.timestamp).getTime());
    
    // Simple linear regression for trend
    const n = values.length;
    const sumX = timestamps.reduce((sum, t) => sum + t, 0);
    const sumY = values.reduce((sum, v) => sum + v, 0);
    const sumXY = timestamps.reduce((sum, t, i) => sum + t * values[i], 0);
    const sumXX = timestamps.reduce((sum, t) => sum + t * t, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const trend = slope > 0.001 ? 'increasing' : slope < -0.001 ? 'decreasing' : 'stable';
    
    return {
      parameter,
      timeRange: { start: startDate, end: endDate },
      statistics: {
        min: Math.min(...values),
        max: Math.max(...values),
        average: values.reduce((sum, v) => sum + v, 0) / n,
        trend,
        slope: Math.round(slope * 1000000) / 1000000,
        dataPoints: n
      },
      data: data.data,
      metadata: data.metadata
    };
  }, [parameter, days, sstData, seaLevelData, chlorophyllData, windData, rainfallData]);

  return {
    data: trends,
    isLoading: !sstData || !seaLevelData || !chlorophyllData || !windData || !rainfallData
  };
};

// Import React for useMemo
import React from 'react'; 