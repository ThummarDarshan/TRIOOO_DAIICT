import React from 'react';
import { SensorCard } from '@/components/dashboard/SensorCard';
import { AlertPanel } from '@/components/dashboard/AlertPanel';
import { RealTimeDataTest } from '@/components/dashboard/RealTimeDataTest';
import { EarthdataPanel } from '@/components/dashboard/EarthdataPanel';
import { EarthdataDatasets } from '@/components/dashboard/EarthdataDatasets';
import { EarthdataOceanographicCard } from '@/components/dashboard/EarthdataOceanographicCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Waves, 
  Thermometer, 
  Wind, 
  Droplets, 
  Activity,
  MapPin,
  AlertTriangle,
  TrendingUp,
  Shield,
  Satellite,
  Leaf,
  Database,
  ExternalLink,
  CloudRain
} from 'lucide-react';
import heroImage from '@/assets/hero-coastal-monitoring.jpg';
import { useSensors, useAlerts, usePredictions, useRiskAssessment, useRealTimeUpdates } from '@/hooks/use-coastal-data';
import { Badge } from '@/components/ui/badge';

const Dashboard = () => {
  // Initialize real-time updates
  useRealTimeUpdates();
  
  // Fetch data from API
  const { data: sensors, isLoading: sensorsLoading } = useSensors();
  const { data: alerts, isLoading: alertsLoading } = useAlerts();
  const { data: predictions, isLoading: predictionsLoading } = usePredictions();
  const { data: riskAssessment, isLoading: riskLoading } = useRiskAssessment();

  // Transform sensor data for display
  const sensorData = React.useMemo(() => {
    if (!sensors) return [];
    
    return sensors.slice(0, 4).map(sensor => {
      const latestReading = sensor.readings[sensor.readings.length - 1];
      const previousReading = sensor.readings[sensor.readings.length - 2];
      
      if (!latestReading) return null;
      
      const change = previousReading ? 
        ((latestReading.value - previousReading.value) / previousReading.value) * 100 : 0;
      
      const getIcon = (type: string) => {
        switch (type) {
          case 'tide_gauge': return Waves;
          case 'weather_station': return Thermometer;
          case 'water_quality': return Droplets;
          case 'wave_buoy': return TrendingUp;
          default: return Activity;
        }
      };
      
      const getTrend = (change: number) => {
        if (Math.abs(change) < 5) return 'stable' as const;
        return change > 0 ? 'up' as const : 'down' as const;
      };
      
      return {
        title: sensor.name.split(' ').slice(-2).join(' '), // Get last two words
        value: latestReading.value,
        unit: latestReading.unit,
        change: Math.abs(change),
        icon: getIcon(sensor.type),
        trend: getTrend(change),
        status: latestReading.status
      };
    }).filter(Boolean);
  }, [sensors]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <div className="relative h-80 bg-gradient-ocean overflow-hidden">
        <img 
          src={heroImage} 
          alt="Coastal monitoring stations" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-primary-foreground">
            <h1 className="text-4xl font-bold mb-4">NASA Earthdata Coastal Monitoring</h1>
            <p className="text-xl opacity-90">Real-time oceanographic data from NASA satellites for coastal safety</p>
            {(sensorsLoading || alertsLoading || predictionsLoading || riskLoading) && (
              <div className="mt-4 flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <span className="text-sm opacity-75 ml-2">Loading NASA Earthdata...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* NASA Earthdata Oceanographic Data Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <EarthdataOceanographicCard 
            parameter="sst" 
            title="Sea Surface Temperature" 
            icon={Thermometer}
            color="blue"
          />
          <EarthdataOceanographicCard 
            parameter="seaLevel" 
            title="Sea Level" 
            icon={Waves}
            color="green"
          />
          <EarthdataOceanographicCard 
            parameter="chlorophyll" 
            title="Chlorophyll" 
            icon={Leaf}
            color="emerald"
          />
          <EarthdataOceanographicCard 
            parameter="wind" 
            title="Wind Speed" 
            icon={Wind}
            color="cyan"
          />
          <EarthdataOceanographicCard 
            parameter="rainfall" 
            title="Rainfall" 
            icon={CloudRain}
            color="purple"
          />
        </div>

        {/* Risk Assessment Banner */}
        {riskLoading ? (
          <Card className="mb-6 border-gray-200 bg-gray-50 shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-gray-300 rounded animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-48 animate-pulse mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-64 animate-pulse"></div>
                </div>
                <div className="w-20 h-6 bg-gray-300 rounded animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        ) : riskAssessment && riskAssessment.riskLevel !== 'low' ? (
          <Card className="mb-6 border-red-200 bg-red-50 shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-6 w-6 text-red-600" />
                <div className="flex-1">
                  <h3 className="font-semibold text-red-800">
                    Coastal Threat Alert - Risk Level: {riskAssessment.riskLevel.toUpperCase()}
                  </h3>
                  <p className="text-sm text-red-700 mt-1">
                    {riskAssessment.riskFactors.join(', ')}
                  </p>
                </div>
                <Badge variant={riskAssessment.riskLevel === 'critical' ? 'destructive' : 'secondary'}>
                  Risk Score: {riskAssessment.riskLevel === 'critical' ? riskAssessment.riskScore : riskAssessment.riskScore}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ) : null}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* NASA Earthdata Real-time Monitoring */}
          <Card className="lg:col-span-2 shadow-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Satellite className="h-5 w-5 text-primary" />
                <span>NASA Earthdata Real-time Monitoring</span>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Powered by NASA
                </Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Live oceanographic data from NASA satellites and ocean monitoring systems
              </p>
            </CardHeader>
            <CardContent>
              <EarthdataPanel boundingBox={[18, 72, 20, 75]} />
            </CardContent>
          </Card>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Alerts Panel */}
            <AlertPanel />
            
            {/* NASA Earthdata Datasets Panel */}
            <Card className="shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5 text-primary" />
                  <span>Available Datasets</span>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    NASA
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">MUR SST</span>
                      <Badge variant="outline" className="text-xs">1km</Badge>
                    </div>
                    <p className="text-xs text-blue-600">Sea Surface Temperature</p>
                    <p className="text-xs text-blue-500 mt-1">Daily updates</p>
                  </div>
                  
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">AVISO SLA</span>
                      <Badge variant="outline" className="text-xs">0.25°</Badge>
                    </div>
                    <p className="text-xs text-green-600">Sea Level Anomaly</p>
                    <p className="text-xs text-green-500 mt-1">Daily updates</p>
                  </div>
                  
                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Ocean Color</span>
                      <Badge variant="outline" className="text-xs">4km</Badge>
                    </div>
                    <p className="text-xs text-emerald-600">Chlorophyll-a</p>
                    <p className="text-xs text-emerald-500 mt-1">8-day updates</p>
                  </div>
                  
                  <div className="p-3 bg-cyan-50 rounded-lg border border-cyan-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">ASCAT Wind</span>
                      <Badge variant="outline" className="text-xs">25km</Badge>
                    </div>
                    <p className="text-xs text-cyan-600">Wind Vectors</p>
                    <p className="text-xs text-cyan-500 mt-1">Daily updates</p>
                  </div>
                </div>
                
                <div className="mt-4 text-center">
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="h-3 w-3 mr-2" />
                    View All Datasets
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* NASA Earthdata Integration Section */}
        <div className="mt-6 space-y-6">
          <Card className="shadow-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Satellite className="h-5 w-5 text-primary" />
                <span>NASA Earthdata Integration</span>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Powered by NASA
                </Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Real-time oceanographic and climate data from NASA satellites and ocean monitoring systems
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Earthdata Panel */}
                <EarthdataPanel boundingBox={[18, 72, 20, 75]} />
                
                {/* Earthdata Datasets */}
                <EarthdataDatasets />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Real-Time Data Test Section */}
        <RealTimeDataTest />

        {/* Coastal Map Section */}
        <Card className="mt-6 shadow-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-primary" />
              <span>Coastal Monitoring Map</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MapPin className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Interactive coastal map will be displayed here</p>
                <p className="text-sm">Sensor locations, danger zones, and safe areas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;