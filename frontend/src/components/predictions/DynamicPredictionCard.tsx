import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useOceanographicSummary, useCoastalThreatAssessment } from '@/hooks/use-earthdata';
import { AlertTriangle } from 'lucide-react';

interface DynamicPredictionCardProps {
  parameter: 'sst' | 'seaLevel' | 'chlorophyll' | 'wind' | 'rainfall';
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  className?: string;
}

export const DynamicPredictionCard: React.FC<DynamicPredictionCardProps> = ({
  parameter,
  title,
  icon: Icon,
  className = ''
}) => {
  const { data: oceanSummary, isLoading } = useOceanographicSummary();
  const { data: threatAssessment } = useCoastalThreatAssessment();

  const getParameterData = () => {
    if (!oceanSummary) return null;
    
    switch (parameter) {
      case 'sst':
        return {
          prediction: `${oceanSummary.parameters.seaSurfaceTemperature.value}°C`,
          confidence: Math.round(oceanSummary.dataQuality.sst.accuracy * 100),
          timeframe: 'Next 6 hours',
          riskLevel: oceanSummary.parameters.seaSurfaceTemperature.risk,
          details: generatePredictionDetails('sst', oceanSummary.parameters.seaSurfaceTemperature.value, oceanSummary.parameters.seaSurfaceTemperature.anomaly)
        };
      case 'seaLevel':
        return {
          prediction: `${oceanSummary.parameters.seaLevel.value} m`,
          confidence: Math.round(oceanSummary.dataQuality.seaLevel.accuracy * 100),
          timeframe: 'Next 12 hours',
          riskLevel: oceanSummary.parameters.seaLevel.risk,
          details: generatePredictionDetails('seaLevel', oceanSummary.parameters.seaLevel.value, oceanSummary.parameters.seaLevel.trend)
        };
      case 'chlorophyll':
        return {
          prediction: oceanSummary.parameters.chlorophyll.bloomRisk === 'high' ? 'High bloom risk' : 'Normal levels',
          confidence: Math.round(oceanSummary.dataQuality.chlorophyll.accuracy * 100),
          timeframe: 'Next 48 hours',
          riskLevel: oceanSummary.parameters.chlorophyll.risk,
          details: generatePredictionDetails('chlorophyll', oceanSummary.parameters.chlorophyll.value, oceanSummary.parameters.chlorophyll.bloomRisk)
        };
      case 'wind':
        return {
          prediction: `${oceanSummary.parameters.wind.speed} m/s`,
          confidence: Math.round(oceanSummary.dataQuality.wind.accuracy * 100),
          timeframe: 'Next 24 hours',
          riskLevel: oceanSummary.parameters.wind.risk,
          details: generatePredictionDetails('wind', oceanSummary.parameters.wind.speed, oceanSummary.parameters.wind.direction)
        };
      case 'rainfall':
        return {
          prediction: `${oceanSummary.parameters.rainfall.total} mm`,
          confidence: Math.round(oceanSummary.dataQuality.rainfall.accuracy * 100),
          timeframe: 'Next 12 hours',
          riskLevel: oceanSummary.parameters.rainfall.risk,
          details: generatePredictionDetails('rainfall', oceanSummary.parameters.rainfall.total, oceanSummary.parameters.rainfall.intensity)
        };
      default:
        return null;
    }
  };

  const generatePredictionDetails = (param: string, value: number, additional: any): string => {
    const details = {
      sst: {
        normal: 'Temperature within normal seasonal range',
        elevated: 'Above-average temperatures detected',
        high: 'Elevated temperatures may impact marine life'
      },
      seaLevel: {
        stable: 'Sea level remains stable',
        rising: 'Gradual sea level rise continuing',
        high: 'Elevated sea levels may cause coastal flooding'
      },
      chlorophyll: {
        low: 'Normal chlorophyll levels maintained',
        medium: 'Moderate algal activity detected',
        high: 'High algal bloom risk - monitor water quality'
      },
      wind: {
        calm: 'Calm wind conditions expected',
        moderate: 'Moderate wind speeds forecast',
        strong: 'Strong winds may affect marine operations'
      },
      rainfall: {
        minimal: 'Minimal precipitation expected',
        moderate: 'Moderate rainfall forecast',
        heavy: 'Heavy rainfall may cause runoff issues'
      }
    };

    let intensity = 'normal';
    if (param === 'sst' && value > 30) intensity = 'high';
    if (param === 'wind' && value > 20) intensity = 'strong';
    if (param === 'rainfall' && value > 5) intensity = 'heavy';
    if (param === 'chlorophyll' && additional === 'high') intensity = 'high';
    if (param === 'seaLevel' && additional > 0.2) intensity = 'high';

    return details[param as keyof typeof details][intensity as keyof typeof details.sst] || 'Normal conditions expected';
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return 'text-warning';
      case 'medium': return 'text-advisory';
      case 'low': return 'text-safe';
      default: return 'text-muted-foreground';
    }
  };

  const getRiskBadgeVariant = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return 'bg-warning text-warning-foreground';
      case 'medium': return 'bg-advisory text-advisory-foreground';
      case 'low': return 'bg-safe text-safe-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (isLoading) {
    return (
      <Card className={`shadow-card border-border/50 hover:shadow-ocean transition-smooth ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon className="h-5 w-5 text-primary" />
              <span>{title}</span>
            </div>
            <div className="w-16 h-6 bg-gray-300 rounded animate-pulse"></div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-32 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
          </div>
          <div className="h-3 bg-gray-300 rounded w-full animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  const predictionData = getParameterData();
  
  if (!predictionData) {
    return (
      <Card className={`shadow-card border-border/50 hover:shadow-ocean transition-smooth ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon className="h-5 w-5 text-primary" />
              <span>{title}</span>
            </div>
            <Badge variant="outline">No Data</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-4">
            <p className="text-sm">Prediction data unavailable</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`shadow-card border-border/50 hover:shadow-ocean transition-smooth ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon className="h-5 w-5 text-primary" />
            <span>{title}</span>
          </div>
          <Badge className={getRiskBadgeVariant(predictionData.riskLevel)}>
            {predictionData.riskLevel.toUpperCase()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Prediction</span>
            <span className="text-sm text-muted-foreground">{predictionData.timeframe}</span>
          </div>
          <p className={`text-lg font-semibold ${getRiskColor(predictionData.riskLevel)}`}>
            {predictionData.prediction}
          </p>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Confidence</span>
            <span className="text-sm font-medium text-foreground">{predictionData.confidence}%</span>
          </div>
          <Progress value={predictionData.confidence} className="h-2" />
        </div>

        <p className="text-sm text-muted-foreground">{predictionData.details}</p>
        
        {/* Additional threat assessment info */}
        {threatAssessment && threatAssessment.overallRisk !== 'low' && (
          <div className="mt-3 p-2 bg-warning/10 border border-warning/20 rounded-lg">
            <div className="flex items-center space-x-2 text-warning-600">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-xs font-medium">Threat Assessment Active</span>
            </div>
            <p className="text-xs text-warning-600 mt-1">
              {threatAssessment.recommendations[0]}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 