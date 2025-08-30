import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Thermometer, 
  Waves, 
  Leaf, 
  Wind, 
  CloudRain,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useOceanographicSummary, useCoastalThreatAssessment } from '@/hooks/use-earthdata';

interface EarthdataPanelProps {
  boundingBox?: [number, number, number, number];
  className?: string;
}

export const EarthdataPanel: React.FC<EarthdataPanelProps> = ({ 
  boundingBox, 
  className = '' 
}) => {
  const { data: oceanSummary, isLoading } = useOceanographicSummary(boundingBox);
  const { data: threatAssessment } = useCoastalThreatAssessment(boundingBox);

  if (isLoading) {
    return (
      <Card className={`shadow-card border-border/50 ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Thermometer className="h-5 w-5 text-primary" />
            <span>NASA Earthdata Ocean Monitoring</span>
            <Badge variant="outline">Loading...</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-300 rounded animate-pulse"></div>
                  <div>
                    <div className="h-4 bg-gray-300 rounded w-24 animate-pulse mb-1"></div>
                    <div className="h-3 bg-gray-300 rounded w-32 animate-pulse"></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-6 bg-gray-300 rounded w-16 animate-pulse mb-1"></div>
                  <div className="h-3 bg-gray-300 rounded w-20 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!oceanSummary) {
    return (
      <Card className={`shadow-card border-border/50 ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Thermometer className="h-5 w-5 text-primary" />
            <span>NASA Earthdata Ocean Monitoring</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <Thermometer className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No Earthdata available</p>
            <p className="text-sm">Check API connection and data availability</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'default';
      default: return 'outline';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'decreasing': return <TrendingDown className="h-4 w-4 text-green-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getQualityColor = (quality: any) => {
    const avgQuality = (quality.completeness + quality.accuracy) / 2;
    if (avgQuality >= 0.9) return 'text-green-600';
    if (avgQuality >= 0.8) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className={`shadow-card border-border/50 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Thermometer className="h-5 w-5 text-primary" />
          <span>NASA Earthdata Ocean Monitoring</span>
          <Badge variant={threatAssessment?.threatLevel === 'high' ? 'destructive' : 'outline'}>
            {threatAssessment?.threatLevel || 'low'} Risk
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Real-time oceanographic data from NASA satellites and ocean monitoring systems
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Threat Assessment Banner */}
        {threatAssessment && threatAssessment.threatLevel !== 'low' && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div className="flex-1">
                <h4 className="font-semibold text-red-800">
                  Coastal Threat Alert - Risk Level: {threatAssessment.threatLevel.toUpperCase()}
                </h4>
                <p className="text-sm text-red-700 mt-1">
                  Threat Score: {threatAssessment.threatScore}/100
                </p>
                <div className="mt-2">
                  <p className="text-sm text-red-700 font-medium">Risk Factors:</p>
                  <ul className="text-sm text-red-600 mt-1 space-y-1">
                    {threatAssessment.threatFactors.map((factor, index) => (
                      <li key={index}>• {factor}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Oceanographic Parameters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Sea Surface Temperature */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Thermometer className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Sea Surface Temperature</span>
              </div>
              <Badge variant={getRiskColor(oceanSummary.parameters.seaSurfaceTemperature.risk)}>
                {oceanSummary.parameters.seaSurfaceTemperature.risk}
              </Badge>
            </div>
            <div className="text-2xl font-bold text-blue-800 mb-2">
              {oceanSummary.parameters.seaSurfaceTemperature.value}°C
            </div>
            <div className="flex items-center space-x-2 text-sm text-blue-600">
              {getTrendIcon(oceanSummary.parameters.seaSurfaceTemperature.trend)}
              <span className="capitalize">{oceanSummary.parameters.seaSurfaceTemperature.trend}</span>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-xs text-blue-600 mb-1">
                <span>Data Quality</span>
                <span>{Math.round(oceanSummary.dataQuality.sst.accuracy * 100)}%</span>
              </div>
              <Progress value={oceanSummary.dataQuality.sst.accuracy * 100} className="h-2" />
            </div>
          </div>

          {/* Sea Level */}
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Waves className="h-5 w-5 text-green-600" />
                <span className="font-medium">Sea Level</span>
              </div>
              <Badge variant={getRiskColor(oceanSummary.parameters.seaLevel.risk)}>
                {oceanSummary.parameters.seaLevel.risk}
              </Badge>
            </div>
            <div className="text-2xl font-bold text-green-800 mb-2">
              {oceanSummary.parameters.seaLevel.value}m
            </div>
            <div className="flex items-center space-x-2 text-sm text-green-600">
              {getTrendIcon(oceanSummary.parameters.seaLevel.trend)}
              <span className="capitalize">{oceanSummary.parameters.seaLevel.trend}</span>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-xs text-green-600 mb-1">
                <span>Data Quality</span>
                <span>{Math.round(oceanSummary.dataQuality.seaLevel.accuracy * 100)}%</span>
              </div>
              <Progress value={oceanSummary.dataQuality.seaLevel.accuracy * 100} className="h-2" />
            </div>
          </div>

          {/* Chlorophyll */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Leaf className="h-5 w-5 text-emerald-600" />
                <span className="font-medium">Chlorophyll</span>
              </div>
              <Badge variant={getRiskColor(oceanSummary.parameters.chlorophyll.risk)}>
                {oceanSummary.parameters.chlorophyll.risk}
              </Badge>
            </div>
            <div className="text-2xl font-bold text-emerald-800 mb-2">
              {oceanSummary.parameters.chlorophyll.value} mg/m³
            </div>
            <div className="text-sm text-emerald-600 mb-3">
              Bloom Risk: <span className="font-medium">{oceanSummary.parameters.chlorophyll.bloomRisk}</span>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-xs text-emerald-600 mb-1">
                <span>Data Quality</span>
                <span>{Math.round(oceanSummary.dataQuality.chlorophyll.accuracy * 100)}%</span>
              </div>
              <Progress value={oceanSummary.dataQuality.chlorophyll.accuracy * 100} className="h-2" />
            </div>
          </div>

          {/* Wind */}
          <div className="p-4 bg-cyan-50 border border-cyan-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Wind className="h-5 w-5 text-cyan-600" />
                <span className="font-medium">Wind</span>
              </div>
              <Badge variant={getRiskColor(oceanSummary.parameters.wind.risk)}>
                {oceanSummary.parameters.wind.risk}
              </Badge>
            </div>
            <div className="text-2xl font-bold text-cyan-800 mb-2">
              {oceanSummary.parameters.wind.speed} m/s
            </div>
            <div className="text-sm text-cyan-600 mb-3">
              Direction: <span className="font-medium">{oceanSummary.parameters.wind.direction}°</span>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-xs text-cyan-600 mb-1">
                <span>Data Quality</span>
                <span>{Math.round(oceanSummary.dataQuality.wind.accuracy * 100)}%</span>
              </div>
              <Progress value={oceanSummary.dataQuality.wind.accuracy * 100} className="h-2" />
            </div>
          </div>
        </div>

        {/* Rainfall Section */}
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <CloudRain className="h-5 w-5 text-purple-600" />
              <span className="font-medium">Rainfall (24h)</span>
            </div>
            <Badge variant={getRiskColor(oceanSummary.parameters.rainfall.risk)}>
              {oceanSummary.parameters.rainfall.risk}
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-2xl font-bold text-purple-800">
                {oceanSummary.parameters.rainfall.total} mm
              </div>
              <div className="text-sm text-purple-600">Total Accumulation</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-purple-800 capitalize">
                {oceanSummary.parameters.rainfall.intensity}
              </div>
              <div className="text-sm text-purple-600">Intensity</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-purple-800">
                {oceanSummary.parameters.rainfall.duration}h
              </div>
              <div className="text-sm text-purple-600">Duration</div>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-xs text-purple-600 mb-1">
              <span>Data Quality</span>
              <span>{Math.round(oceanSummary.dataQuality.rainfall.accuracy * 100)}%</span>
            </div>
            <Progress value={oceanSummary.dataQuality.rainfall.accuracy * 100} className="h-2" />
          </div>
        </div>

        {/* Data Source Information */}
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-3">Data Sources & Quality</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="font-medium">Data Sources</span>
              </div>
              <ul className="space-y-1 text-gray-600">
                <li>• MUR SST (1km resolution)</li>
                <li>• AVISO Sea Level (0.25° resolution)</li>
                <li>• Ocean Color Chlorophyll (4km resolution)</li>
                <li>• ASCAT Wind (25km resolution)</li>
                <li>• IMERG Rainfall (0.1° resolution)</li>
              </ul>
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="font-medium">Update Frequency</span>
              </div>
              <ul className="space-y-1 text-gray-600">
                <li>• SST: Daily updates</li>
                <li>• Sea Level: Daily updates</li>
                <li>• Chlorophyll: 8-day updates</li>
                <li>• Wind: Daily updates</li>
                <li>• Rainfall: 30-minute updates</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Last Updated */}
        <div className="text-xs text-muted-foreground text-center">
          Last updated: {new Date(oceanSummary.timestamp).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
}; 