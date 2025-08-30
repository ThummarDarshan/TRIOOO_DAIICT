import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import { coastalAPI } from '@/lib/api';
import { getEnabledStations } from '@/lib/marine-data-config';
import type { SensorData } from '@/lib/api';

export const RealTimeDataTest: React.FC = () => {
  const [sensors, setSensors] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(false);

  useEffect(() => {
    // Real-time data is always enabled now
    setIsRealTimeEnabled(true);
    fetchSensorData();
  }, []);

  const fetchSensorData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await coastalAPI.getSensorData();
      setSensors(data);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sensor data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSourceIcon = (sensor: SensorData) => {
    if (sensor.id.startsWith('tide_')) return '🌊';
    if (sensor.id.startsWith('wave_')) return '🏄';
    if (sensor.id.startsWith('weather_')) return '🌤️';
    if (sensor.id.startsWith('quality_')) return '🔬';
    return '📡';
  };

  const getSourceName = (sensor: SensorData) => {
    if (sensor.id.startsWith('tide_')) return 'NOAA';
    if (sensor.id.startsWith('wave_')) return 'NDBC';
    if (sensor.id.startsWith('weather_')) return 'NDBC';
    if (sensor.id.startsWith('quality_')) return 'USGS';
    return 'Unknown';
  };

  const enabledStations = getEnabledStations();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Real-Time Data Test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {sensors.length}
              </div>
              <div className="text-sm text-blue-600">Active Sensors</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {enabledStations.length}
              </div>
              <div className="text-sm text-green-600">Configured Stations</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {isRealTimeEnabled ? 'ON' : 'OFF'}
              </div>
              <div className="text-sm text-purple-600">Real-Time Mode</div>
            </div>
          </div>

          {/* Configuration Status */}
          <Alert>
            <Wifi className="h-4 w-4" />
            <AlertDescription>
              <strong>Real-time data is {isRealTimeEnabled ? 'enabled' : 'disabled'}</strong>
              {isRealTimeEnabled ? (
                <span className="text-green-600"> - Fetching live data from marine APIs</span>
              ) : (
                <span className="text-gray-600"> - Using mock data for development</span>
              )}
            </AlertDescription>
          </Alert>

          {/* Control Panel */}
          <div className="flex gap-2">
            <Button 
              onClick={fetchSensorData} 
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Fetching...' : 'Refresh Data'}
            </Button>
            
            {lastUpdate && (
              <Badge variant="outline" className="ml-auto">
                Last update: {lastUpdate.toLocaleTimeString()}
              </Badge>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Station Configuration */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Configured Marine Stations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {enabledStations.map((station) => (
                <div key={station.id} className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">
                      {station.type === 'tide_gauge' ? '🌊' : 
                       station.type === 'wave_buoy' ? '🏄' : 
                       station.type === 'weather_station' ? '🌤️' : '🔬'}
                    </span>
                    <span className="font-medium text-sm">{station.name}</span>
                  </div>
                  <div className="text-xs text-gray-600">
                    <div>ID: {station.id}</div>
                    <div>Type: {station.type.replace('_', ' ')}</div>
                    <div>Source: {station.source.toUpperCase()}</div>
                    <div>Region: {station.location.region}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sensor Data Display */}
          {sensors.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Live Sensor Data</h3>
              <div className="space-y-3">
                {sensors.map((sensor) => (
                  <Card key={sensor.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{getSourceIcon(sensor)}</span>
                          <div>
                            <div className="font-medium">{sensor.name}</div>
                            <div className="text-sm text-gray-600">
                              {sensor.location.name} • {getSourceName(sensor)}
                            </div>
                          </div>
                        </div>
                        <Badge className={getStatusColor(sensor.readings[0]?.status || 'normal')}>
                          {sensor.readings[0]?.status || 'unknown'}
                        </Badge>
                      </div>
                      
                      {sensor.readings.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                          {sensor.readings.slice(0, 4).map((reading, index) => (
                            <div key={index} className="text-center">
                              <div className="text-lg font-bold">
                                {reading.value.toFixed(2)}
                              </div>
                              <div className="text-xs text-gray-600">
                                {reading.unit}
                              </div>
                              <div className="text-xs text-gray-500">
                                {new Date(reading.timestamp).toLocaleTimeString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Setup Instructions */}
          {!isRealTimeEnabled && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>To enable real-time data:</strong>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Copy <code>env.example</code> to <code>.env.local</code></li>
                  <li>Set <code>VITE_ENABLE_REAL_MARINE_DATA=true</code></li>
                  <li>Restart the development server</li>
                </ol>
                <div className="mt-2 text-sm text-gray-600">
                  See <code>REAL_TIME_SETUP.md</code> for detailed instructions.
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
