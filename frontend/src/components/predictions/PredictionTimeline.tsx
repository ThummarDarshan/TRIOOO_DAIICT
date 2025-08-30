import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Activity
} from 'lucide-react';
import { useOceanographicSummary, useHistoricalTrends } from '@/hooks/use-earthdata';

interface TimelineDataPoint {
  date: string;
  value: number;
  unit: string;
  confidence: number;
  risk: 'low' | 'medium' | 'high';
  trend: 'increasing' | 'decreasing' | 'stable';
  anomaly?: number;
  prediction: string;
}

interface PredictionTimelineProps {
  className?: string;
}

export const PredictionTimeline: React.FC<PredictionTimelineProps> = ({ className = '' }) => {
  const [selectedParameter, setSelectedParameter] = useState<'sst' | 'seaLevel' | 'chlorophyll' | 'wind' | 'rainfall'>('sst');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '14d' | '30d'>('7d');
  const [isLoading, setIsLoading] = useState(false);
  
  const { data: oceanSummary } = useOceanographicSummary();
  const { data: historicalData } = useHistoricalTrends(selectedParameter, 30);

  // Generate dynamic timeline data based on selected parameter
  const generateTimelineData = (): TimelineDataPoint[] => {
    if (!oceanSummary) return [];
    
    const days = selectedTimeframe === '7d' ? 7 : selectedTimeframe === '14d' ? 14 : 30;
    const data: TimelineDataPoint[] = [];
    
    const baseValues = {
      sst: { base: 28.5, unit: '°C', range: { min: 25, max: 32 } },
      seaLevel: { base: 0.12, unit: 'm', range: { min: -0.2, max: 0.3 } },
      chlorophyll: { base: 0.8, unit: 'mg/m³', range: { min: 0.1, max: 2.0 } },
      wind: { base: 12.5, unit: 'm/s', range: { min: 5, max: 25 } },
      rainfall: { base: 2.1, unit: 'mm', range: { min: 0, max: 10 } }
    };
    
    const base = baseValues[selectedParameter];
    const currentDate = new Date();
    
    for (let i = 0; i < days; i++) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() + i);
      
      // Add realistic variations based on parameter type
      let variation = 0;
      let trend = 'stable' as const;
      
      if (selectedParameter === 'sst') {
        // Daily temperature cycle + seasonal trend
        variation = Math.sin(i * 0.9) * 2 + (i * 0.1);
        trend = i > 3 ? 'increasing' : 'stable';
      } else if (selectedParameter === 'seaLevel') {
        // Tidal patterns + gradual rise
        variation = Math.sin(i * 1.4) * 0.1 + (i * 0.002);
        trend = 'increasing';
      } else if (selectedParameter === 'chlorophyll') {
        // Bloom cycles
        variation = Math.sin(i * 0.7) * 0.5 + (i * 0.05);
        trend = i > 5 ? 'increasing' : 'stable';
      } else if (selectedParameter === 'wind') {
        // Weather patterns
        variation = Math.sin(i * 1.2) * 5 + (i * 0.3);
        trend = i > 2 ? 'decreasing' : 'stable';
      } else if (selectedParameter === 'rainfall') {
        // Precipitation patterns
        variation = Math.sin(i * 0.8) * 3 + (i * 0.2);
        trend = i > 4 ? 'increasing' : 'stable';
      }
      
      const value = Math.max(base.range.min, Math.min(base.range.max, base.base + variation));
      const confidence = Math.max(70, Math.min(95, 90 - (i * 2) + (Math.random() - 0.5) * 10));
      
      // Risk assessment based on value and trend
      let risk: 'low' | 'medium' | 'high' = 'low';
      if (selectedParameter === 'sst' && value > 30) risk = 'medium';
      if (selectedParameter === 'wind' && value > 20) risk = 'medium';
      if (selectedParameter === 'rainfall' && value > 5) risk = 'medium';
      if (selectedParameter === 'chlorophyll' && value > 1.5) risk = 'medium';
      if (i > days * 0.7) risk = 'medium'; // Higher risk for distant predictions
      
      data.push({
        date: date.toISOString().split('T')[0],
        value: Math.round(value * 100) / 100,
        unit: base.unit,
        confidence: Math.round(confidence),
        risk,
        trend,
        anomaly: selectedParameter === 'sst' ? (value - base.base) : undefined,
        prediction: generatePrediction(selectedParameter, value, trend, i)
      });
    }
    
    return data;
  };

  const generatePrediction = (param: string, value: number, trend: string, dayOffset: number): string => {
    const predictions = {
      sst: {
        low: 'Normal temperature range maintained',
        medium: 'Slight temperature increase expected',
        high: 'Above-average temperatures predicted'
      },
      seaLevel: {
        low: 'Stable sea level conditions',
        medium: 'Gradual sea level rise continuing',
        high: 'Accelerated sea level rise expected'
      },
      chlorophyll: {
        low: 'Normal chlorophyll levels',
        medium: 'Moderate algal activity',
        high: 'High algal bloom risk'
      },
      wind: {
        low: 'Calm wind conditions',
        medium: 'Moderate wind speeds',
        high: 'Strong winds expected'
      },
      rainfall: {
        low: 'Minimal precipitation',
        medium: 'Moderate rainfall expected',
        high: 'Heavy rainfall predicted'
      }
    };
    
    const intensity = dayOffset < 3 ? 'low' : dayOffset < 7 ? 'medium' : 'high';
    return predictions[param as keyof typeof predictions][intensity as keyof typeof predictions.sst] || 'Normal conditions expected';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getRiskBadgeVariant = (risk: string) => {
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

  const timelineData = generateTimelineData();

  if (isLoading) {
    return (
      <Card className={`shadow-card border-border/50 ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-primary" />
            <span>Prediction Timeline</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Activity className="h-16 w-16 mx-auto mb-4 opacity-50 animate-spin" />
              <p className="text-lg">Loading prediction timeline...</p>
              <p className="text-sm">Analyzing NASA Earthdata trends</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`shadow-card border-border/50 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5 text-primary" />
          <span>Prediction Timeline</span>
        </CardTitle>
        <div className="flex items-center space-x-4 mt-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Parameter:</span>
            <Select value={selectedParameter} onValueChange={(value: any) => setSelectedParameter(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sst">Sea Surface Temperature</SelectItem>
                <SelectItem value="seaLevel">Sea Level</SelectItem>
                <SelectItem value="chlorophyll">Chlorophyll</SelectItem>
                <SelectItem value="wind">Wind Speed</SelectItem>
                <SelectItem value="rainfall">Rainfall</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Timeframe:</span>
            <Select value={selectedTimeframe} onValueChange={(value: any) => setSelectedTimeframe(value)}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="14d">14 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {timelineData.length > 0 ? (
          <div className="space-y-4">
            {/* Timeline Header */}
            <div className="grid grid-cols-6 gap-4 text-xs font-medium text-muted-foreground border-b pb-2">
              <div className="col-span-2">Date</div>
              <div>Predicted Value</div>
              <div>Confidence</div>
              <div>Risk Level</div>
              <div>Trend</div>
            </div>
            
            {/* Timeline Data */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {timelineData.map((point, index) => (
                <div key={index} className="grid grid-cols-6 gap-4 items-center p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="col-span-2">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{new Date(point.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}</div>
                        <div className="text-xs text-muted-foreground">
                          {index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : `+${index} days`}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="font-semibold">
                      {point.value} {point.unit}
                    </div>
                    {point.anomaly && (
                      <div className={`text-xs ${point.anomaly > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {point.anomaly > 0 ? '+' : ''}{point.anomaly.toFixed(2)}°C
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium">{point.confidence}%</div>
                    <div className="w-16 bg-gray-200 rounded-full h-1.5 mt-1">
                      <div 
                        className="bg-primary h-1.5 rounded-full" 
                        style={{ width: `${point.confidence}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <Badge variant={getRiskBadgeVariant(point.risk)} size="sm">
                      {point.risk.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {getTrendIcon(point.trend)}
                    <span className="text-sm capitalize">{point.trend}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-lg font-semibold text-primary">
                  {timelineData.filter(p => p.risk === 'high').length}
                </div>
                <div className="text-xs text-muted-foreground">High Risk Days</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-secondary">
                  {Math.round(timelineData.reduce((acc, p) => acc + p.confidence, 0) / timelineData.length)}%
                </div>
                <div className="text-xs text-muted-foreground">Avg Confidence</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">
                  {timelineData.filter(p => p.trend === 'stable').length}
                </div>
                <div className="text-xs text-muted-foreground">Stable Days</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-80 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Activity className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No timeline data available</p>
              <p className="text-sm">Select a parameter to view predictions</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 