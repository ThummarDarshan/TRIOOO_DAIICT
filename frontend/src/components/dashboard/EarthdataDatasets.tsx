import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Database, 
  Clock, 
  MapPin, 
  BarChart3, 
  Download,
  ExternalLink,
  Info,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useEarthdataDatasets, useDataQualityMetrics, useTemporalCoverage } from '@/hooks/use-earthdata';

export const EarthdataDatasets: React.FC = () => {
  const { data: datasets, isLoading } = useEarthdataDatasets();

  if (isLoading) {
    return (
      <Card className="shadow-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-primary" />
            <span>Available Earthdata Datasets</span>
            <Badge variant="outline">Loading...</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-5 bg-gray-300 rounded w-32 animate-pulse"></div>
                  <div className="w-20 h-6 bg-gray-300 rounded animate-pulse"></div>
                </div>
                <div className="h-4 bg-gray-300 rounded w-48 animate-pulse mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-64 animate-pulse"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!datasets || datasets.length === 0) {
    return (
      <Card className="shadow-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-primary" />
            <span>Available Earthdata Datasets</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <Database className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No datasets available</p>
            <p className="text-sm">Check API connection and data availability</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Database className="h-5 w-5 text-primary" />
          <span>Available Earthdata Datasets</span>
          <Badge variant="outline">{datasets.length} datasets</Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          NASA Earthdata provides access to a wide range of oceanographic and climate datasets
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {datasets.map((dataset) => (
          <DatasetCard key={dataset.id} dataset={dataset} />
        ))}
      </CardContent>
    </Card>
  );
};

interface DatasetCardProps {
  dataset: any;
}

const DatasetCard: React.FC<DatasetCardProps> = ({ dataset }) => {
  const { data: qualityMetrics } = useDataQualityMetrics(dataset.id);
  const { data: temporalCoverage } = useTemporalCoverage(dataset.id);

  const getDatasetIcon = (datasetId: string) => {
    if (datasetId.includes('SST')) return '🌡️';
    if (datasetId.includes('SLA') || datasetId.includes('JASON')) return '🌊';
    if (datasetId.includes('CHL')) return '🌿';
    if (datasetId.includes('WIND')) return '💨';
    if (datasetId.includes('RAIN')) return '🌧️';
    return '📊';
  };

  const getDatasetColor = (datasetId: string) => {
    if (datasetId.includes('SST')) return 'bg-blue-50 border-blue-200';
    if (datasetId.includes('SLA') || datasetId.includes('JASON')) return 'bg-green-50 border-green-200';
    if (datasetId.includes('CHL')) return 'bg-emerald-50 border-emerald-200';
    if (datasetId.includes('WIND')) return 'bg-cyan-50 border-cyan-200';
    if (datasetId.includes('RAIN')) return 'bg-purple-50 border-purple-200';
    return 'bg-gray-50 border-gray-200';
  };

  const getQualityColor = (value: number) => {
    if (value >= 0.9) return 'text-green-600';
    if (value >= 0.8) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getQualityBadge = (value: number) => {
    if (value >= 0.9) return <Badge variant="default" className="bg-green-100 text-green-800">Excellent</Badge>;
    if (value >= 0.8) return <Badge variant="secondary">Good</Badge>;
    return <Badge variant="destructive">Fair</Badge>;
  };

  return (
    <div className={`p-4 rounded-lg border ${getDatasetColor(dataset.id)}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{getDatasetIcon(dataset.id)}</span>
          <div>
            <h3 className="font-semibold text-gray-800">{dataset.name}</h3>
            <p className="text-sm text-gray-600">{dataset.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {qualityMetrics && (
            <div className="text-right">
              <div className="text-sm font-medium text-gray-700">
                Quality: {Math.round(qualityMetrics.accuracy * 100)}%
              </div>
              {getQualityBadge(qualityMetrics.accuracy)}
            </div>
          )}
        </div>
      </div>

      {/* Dataset Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <MapPin className="h-4 w-4 text-gray-500" />
          <div>
            <div className="text-sm font-medium text-gray-700">Resolution</div>
            <div className="text-xs text-gray-600">{dataset.spatialResolution}</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-gray-500" />
          <div>
            <div className="text-sm font-medium text-gray-700">Update Frequency</div>
            <div className="text-xs text-gray-600">{dataset.temporalResolution}</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-4 w-4 text-gray-500" />
          <div>
            <div className="text-sm font-medium text-gray-700">Variables</div>
            <div className="text-xs text-gray-600">{dataset.variables.length} parameters</div>
          </div>
        </div>
      </div>

      {/* Variables List */}
      <div className="mb-4">
        <div className="text-sm font-medium text-gray-700 mb-2">Available Variables:</div>
        <div className="flex flex-wrap gap-2">
          {dataset.variables.map((variable: string, index: number) => (
            <Badge key={index} variant="outline" className="text-xs">
              {variable}
            </Badge>
          ))}
        </div>
      </div>

      {/* Quality Metrics */}
      {qualityMetrics && (
        <div className="mb-4">
          <div className="text-sm font-medium text-gray-700 mb-2">Data Quality Metrics:</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Completeness</span>
                <span>{Math.round(qualityMetrics.completeness * 100)}%</span>
              </div>
              <Progress value={qualityMetrics.completeness * 100} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Accuracy</span>
                <span>{Math.round(qualityMetrics.accuracy * 100)}%</span>
              </div>
              <Progress value={qualityMetrics.accuracy * 100} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Timeliness</span>
                <span>{Math.round(qualityMetrics.timeliness * 100)}%</span>
              </div>
              <Progress value={qualityMetrics.timeliness * 100} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Spatial Coverage</span>
                <span>{Math.round(qualityMetrics.spatialCoverage * 100)}%</span>
              </div>
              <Progress value={qualityMetrics.spatialCoverage * 100} className="h-2" />
            </div>
          </div>
        </div>
      )}

      {/* Temporal Coverage */}
      {temporalCoverage && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-sm font-medium text-gray-700 mb-2">Temporal Coverage:</div>
          <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
            <div>
              <span className="font-medium">Start:</span> {new Date(temporalCoverage.startDate).toLocaleDateString()}
            </div>
            <div>
              <span className="font-medium">End:</span> {new Date(temporalCoverage.endDate).toLocaleDateString()}
            </div>
            <div>
              <span className="font-medium">Resolution:</span> {temporalCoverage.temporalResolution}
            </div>
            <div>
              <span className="font-medium">Updates:</span> {temporalCoverage.updateFrequency}
            </div>
          </div>
        </div>
      )}

      {/* Last Updated */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Last updated: {new Date(dataset.lastUpdated).toLocaleString()}</span>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="h-7">
            <Info className="h-3 w-3 mr-1" />
            Details
          </Button>
          <Button variant="outline" size="sm" className="h-7">
            <Download className="h-3 w-3 mr-1" />
            Download
          </Button>
          <Button variant="outline" size="sm" className="h-7">
            <ExternalLink className="h-3 w-3 mr-1" />
            API
          </Button>
        </div>
      </div>
    </div>
  );
}; 