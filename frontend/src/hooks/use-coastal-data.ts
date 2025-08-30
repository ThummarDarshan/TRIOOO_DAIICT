import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coastalAPI, type SensorData, type Alert, type Prediction, type HistoricalData } from '@/lib/api';
import React from 'react'; // Added missing import for React.useEffect

// Query keys for React Query
export const queryKeys = {
  sensors: ['sensors'] as const,
  sensor: (id: string) => ['sensor', id] as const,
  alerts: ['alerts'] as const,
  predictions: ['predictions'] as const,
  historicalData: (sensorId: string, parameter: string, days: number) => 
    ['historicalData', sensorId, parameter, days] as const,
};

// Hook for fetching all sensor data
export const useSensors = () => {
  return useQuery({
    queryKey: queryKeys.sensors,
    queryFn: () => coastalAPI.getSensorData(), // This will use mock data with different units
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute for real-time updates
  });
};

// Hook for fetching a specific sensor
export const useSensor = (id: string) => {
  return useQuery({
    queryKey: queryKeys.sensor(id),
    queryFn: () => coastalAPI.getSensorById(id),
    enabled: !!id,
    staleTime: 30000,
  });
};

// Hook for fetching all alerts
export const useAlerts = () => {
  return useQuery({
    queryKey: queryKeys.alerts,
    queryFn: () => coastalAPI.getAlerts(),
    staleTime: 15000, // 15 seconds for alerts (more frequent updates)
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

// Hook for fetching predictions
export const usePredictions = () => {
  return useQuery({
    queryKey: queryKeys.predictions,
    queryFn: () => coastalAPI.getPredictions(),
    staleTime: 60000, // 1 minute
    refetchInterval: 300000, // Refetch every 5 minutes
  });
};

// Hook for fetching historical data
export const useHistoricalData = (sensorId: string, parameter: string, days: number = 30) => {
  return useQuery({
    queryKey: queryKeys.historicalData(sensorId, parameter, days),
    queryFn: () => coastalAPI.getHistoricalData(sensorId, parameter, days),
    enabled: !!sensorId && !!parameter,
    staleTime: 300000, // 5 minutes
  });
};

// Hook for creating new alerts
export const useCreateAlert = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (alert: Omit<Alert, 'id' | 'timestamp'>) => 
      coastalAPI.createAlert(alert),
    onSuccess: () => {
      // Invalidate and refetch alerts
      queryClient.invalidateQueries({ queryKey: queryKeys.alerts });
    },
  });
};

// Hook for updating sensor readings
export const useUpdateSensorReading = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      sensorId, 
      reading 
    }: { 
      sensorId: string; 
      reading: Omit<SensorData['readings'][0], 'timestamp'> 
    }) => coastalAPI.updateSensorReading(sensorId, reading),
    onSuccess: (_, { sensorId }) => {
      // Invalidate and refetch sensor data
      queryClient.invalidateQueries({ queryKey: queryKeys.sensor(sensorId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.sensors });
    },
  });
};

// Hook for real-time data updates (WebSocket simulation)
export const useRealTimeUpdates = () => {
  const queryClient = useQueryClient();
  
  // This would typically use WebSocket or Server-Sent Events
  // For now, we'll simulate real-time updates with setInterval
  React.useEffect(() => {
    const interval = setInterval(() => {
      // Invalidate queries to trigger refetches
      queryClient.invalidateQueries({ queryKey: queryKeys.sensors });
      queryClient.invalidateQueries({ queryKey: queryKeys.alerts });
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [queryClient]);

  return null;
};

// Hook for getting sensor statistics
export const useSensorStatistics = () => {
  const { data: sensors, isLoading } = useSensors();
  
  const statistics = React.useMemo(() => {
    if (!sensors) return null;
    
    const totalSensors = sensors.length;
    const activeSensors = sensors.filter(s => 
      new Date(s.lastUpdated).getTime() > Date.now() - 300000 // Last 5 minutes
    ).length;
    
    const sensorsByType = sensors.reduce((acc, sensor) => {
      acc[sensor.type] = (acc[sensor.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const sensorsByStatus = sensors.reduce((acc, sensor) => {
      const latestReading = sensor.readings[sensor.readings.length - 1];
      if (latestReading) {
        acc[latestReading.status] = (acc[latestReading.status] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    return {
      total: totalSensors,
      active: activeSensors,
      inactive: totalSensors - activeSensors,
      byType: sensorsByType,
      byStatus: sensorsByStatus,
    };
  }, [sensors]);
  
  return {
    data: statistics,
    isLoading
  };
};

// Hook for getting alert statistics
export const useAlertStatistics = () => {
  const { data: alerts, isLoading } = useAlerts();
  
  const statistics = React.useMemo(() => {
    if (!alerts) return null;
    
    const totalAlerts = alerts.length;
    const activeAlerts = alerts.filter(a => a.status === 'active').length;
    const resolvedAlerts = alerts.filter(a => a.status === 'resolved').length;
    
    const alertsBySeverity = alerts.reduce((acc, alert) => {
      acc[alert.severity] = (acc[alert.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const alertsByType = alerts.reduce((acc, alert) => {
      acc[alert.type] = (acc[alert.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      total: totalAlerts,
      active: activeAlerts,
      resolved: resolvedAlerts,
      bySeverity: alertsBySeverity,
      byType: alertsByType,
    };
  }, [alerts]);
  
  return {
    data: statistics,
    isLoading
  };
};

// Hook for getting coastal threat risk assessment
export const useRiskAssessment = () => {
  const { data: sensors, isLoading: sensorsLoading } = useSensors();
  const { data: alerts, isLoading: alertsLoading } = useAlerts();
  const { data: predictions, isLoading: predictionsLoading } = usePredictions();
  
  const riskAssessment = React.useMemo(() => {
    if (!sensors || !alerts || !predictions) return null;
    
    // Calculate overall risk based on multiple factors
    let riskScore = 0;
    let riskFactors: string[] = [];
    
    // Factor 1: Active alerts
    const activeAlerts = alerts.filter(a => a.status === 'active');
    if (activeAlerts.length > 0) {
      const highSeverityAlerts = activeAlerts.filter(a => 
        a.severity === 'high' || a.severity === 'critical'
      );
      riskScore += highSeverityAlerts.length * 25;
      riskFactors.push(`${highSeverityAlerts.length} high-severity alerts active`);
    }
    
    // Factor 2: Sensor warnings
    const warningSensors = sensors.filter(s => {
      const latestReading = s.readings[s.readings.length - 1];
      return latestReading && latestReading.status === 'warning';
    });
    if (warningSensors.length > 0) {
      riskScore += warningSensors.length * 15;
      riskFactors.push(`${warningSensors.length} sensors showing warnings`);
    }
    
    // Factor 3: High-risk predictions
    const highRiskPredictions = predictions.filter(p => 
      p.forecast.some(f => f.risk_level === 'high')
    );
    if (highRiskPredictions.length > 0) {
      riskScore += highRiskPredictions.length * 20;
      riskFactors.push(`${highRiskPredictions.length} high-risk predictions`);
    }
    
    // Determine overall risk level
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (riskScore >= 80) riskLevel = 'critical';
    else if (riskScore >= 60) riskLevel = 'high';
    else if (riskScore >= 30) riskLevel = 'medium';
    
    return {
      riskScore,
      riskLevel,
      riskFactors,
      recommendations: [
        'Monitor all active alerts closely',
        'Review sensor readings for anomalies',
        'Prepare emergency response protocols',
        'Communicate with affected communities'
      ]
    };
  }, [sensors, alerts, predictions]);
  
  // Return object with data and isLoading properties
  return {
    data: riskAssessment,
    isLoading: sensorsLoading || alertsLoading || predictionsLoading
  };
};
