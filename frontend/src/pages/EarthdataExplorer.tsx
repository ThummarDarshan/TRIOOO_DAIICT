import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Database, 
  MapPin, 
  Calendar, 
  Download, 
  Filter,
  Search,
  BarChart3,
  Globe,
  Satellite,
  Thermometer,
  Waves,
  Leaf,
  Wind,
  CloudRain
} from 'lucide-react';
import { 
  useEarthdataDatasets, 
  useSSTData, 
  useSeaLevelData, 
  useChlorophyllData, 
  useWindData, 
  useRainfallData,
  useHistoricalTrends 
} from '@/hooks/use-earthdata';

const EarthdataExplorer: React.FC = () => {
  const [selectedParameter, setSelectedParameter] = useState<'sst' | 'seaLevel' | 'chlorophyll' | 'wind' | 'rainfall'>('sst');
  const [selectedDataset, setSelectedDataset] = useState<string>('');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [boundingBox, setBoundingBox] = useState<[number, number, number, number]>([18, 72, 20, 75]);

  const { data: datasets } = useEarthdataDatasets();

  const getParameterIcon = (parameter: string) => {
    switch (parameter) {
      case 'sst': return <Thermometer className="h-5 w-5" />;
      case 'seaLevel': return <Waves className="h-5 w-5" />;
      case 'chlorophyll': return <Leaf className="h-5 w-5" />;
      case 'wind': return <Wind className="h-5 w-5" />;
      case 'rainfall': return <CloudRain className="h-5 w-5" />;
      default: return <BarChart3 className="h-5 w-5" />;
    }
  };

  const getParameterName = (parameter: string) => {
    switch (parameter) {
      case 'sst': return 'Sea Surface Temperature';
      case 'seaLevel': return 'Sea Level';
      case 'chlorophyll': return 'Chlorophyll';
      case 'wind': return 'Wind';
      case 'rainfall': return 'Rainfall';
      default: return parameter;
    }
  };

  const getDefaultDataset = (parameter: string) => {
    switch (parameter) {
      case 'sst': return 'MUR_SST';
      case 'seaLevel': return 'AVISO_SLA';
      case 'chlorophyll': return 'OCEANCOLOR_CHL';
      case 'wind': return 'ASCAT_WIND';
      case 'rainfall': return 'IMERG_RAIN';
      default: return '';
    }
  };

  // Update selected dataset when parameter changes
  React.useEffect(() => {
    setSelectedDataset(getDefaultDataset(selectedParameter));
  }, [selectedParameter]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Satellite className="h-12 w-12" />
              <h1 className="text-4xl font-bold">NASA Earthdata Explorer</h1>
            </div>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Explore real-time oceanographic and climate data from NASA satellites and ocean monitoring systems
            </p>
            <div className="mt-6 flex items-center justify-center space-x-4">
              <Badge variant="secondary" className="bg-white/20 text-white">
                {datasets?.length || 0} Datasets Available
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white">
                Real-time Updates
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white">
                Global Coverage
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Control Panel */}
        <Card className="mb-8 shadow-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-primary" />
              <span>Data Explorer Controls</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Parameter Selection */}
              <div className="space-y-2">
                <Label htmlFor="parameter">Parameter</Label>
                <Select value={selectedParameter} onValueChange={(value: any) => setSelectedParameter(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sst">Sea Surface Temperature</SelectItem>
                    <SelectItem value="seaLevel">Sea Level</SelectItem>
                    <SelectItem value="chlorophyll">Chlorophyll</SelectItem>
                    <SelectItem value="wind">Wind</SelectItem>
                    <SelectItem value="rainfall">Rainfall</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Dataset Selection */}
              <div className="space-y-2">
                <Label htmlFor="dataset">Dataset</Label>
                <Select value={selectedDataset} onValueChange={setSelectedDataset}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {datasets?.filter(d => d.id.includes(selectedParameter.toUpperCase())).map(dataset => (
                      <SelectItem key={dataset.id} value={dataset.id}>
                        {dataset.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range */}
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                />
              </div>
            </div>

            {/* Bounding Box Controls */}
            <div className="mt-6 p-4 bg-muted/30 rounded-lg">
              <Label className="text-sm font-medium mb-3 block">Geographic Bounds (Mumbai Region)</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minLat" className="text-xs">Min Latitude</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={boundingBox[0]}
                    onChange={(e) => setBoundingBox(prev => [parseFloat(e.target.value), prev[1], prev[2], prev[3]])}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minLon" className="text-xs">Min Longitude</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={boundingBox[1]}
                    onChange={(e) => setBoundingBox(prev => [prev[0], parseFloat(e.target.value), prev[2], prev[3]])}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxLat" className="text-xs">Max Latitude</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={boundingBox[2]}
                    onChange={(e) => setBoundingBox(prev => [prev[0], prev[1], parseFloat(e.target.value), prev[3]])}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxLon" className="text-xs">Max Longitude</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={boundingBox[3]}
                    onChange={(e) => setBoundingBox(prev => [prev[0], prev[1], prev[2], parseFloat(e.target.value)])}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex items-center space-x-4">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Search className="h-4 w-4 mr-2" />
                Explore Data
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button variant="outline">
                <Globe className="h-4 w-4 mr-2" />
                View on Map
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Data Visualization Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="visualization">Visualization</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Parameter Overview */}
            <Card className="shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {getParameterIcon(selectedParameter)}
                  <span>{getParameterName(selectedParameter)} Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-800">
                      {selectedDataset || 'N/A'}
                    </div>
                    <div className="text-sm text-blue-600">Selected Dataset</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-800">
                      {dateRange.start} to {dateRange.end}
                    </div>
                    <div className="text-sm text-green-600">Date Range</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-800">
                      {boundingBox[0].toFixed(2)}° to {boundingBox[2].toFixed(2)}° N
                    </div>
                    <div className="text-sm text-purple-600">Geographic Coverage</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dataset Information */}
            {datasets && (
              <Card className="shadow-card border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="h-5 w-5 text-primary" />
                    <span>Dataset Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {datasets.filter(d => d.id === selectedDataset).map(dataset => (
                    <div key={dataset.id} className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg">{dataset.name}</h3>
                        <p className="text-muted-foreground">{dataset.description}</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <div className="text-sm font-medium text-gray-700">Spatial Resolution</div>
                          <div className="text-lg font-semibold">{dataset.spatialResolution}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-700">Temporal Resolution</div>
                          <div className="text-lg font-semibold">{dataset.temporalResolution}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-700">Variables</div>
                          <div className="text-lg font-semibold">{dataset.variables.length}</div>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-2">Available Variables:</div>
                        <div className="flex flex-wrap gap-2">
                          {dataset.variables.map((variable: string, index: number) => (
                            <Badge key={index} variant="outline">
                              {variable}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="visualization" className="space-y-6">
            <Card className="shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <span>Data Visualization</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Interactive charts and maps will be displayed here</p>
                    <p className="text-sm">Select parameters and date range to visualize data</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <Card className="shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <span>Data Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Statistical analysis and trends will be displayed here</p>
                    <p className="text-sm">Generate reports and insights from the selected data</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="export" className="space-y-6">
            <Card className="shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Download className="h-5 w-5 text-primary" />
                  <span>Data Export</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                      <Download className="h-6 w-6 mb-2" />
                      CSV Format
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                      <Download className="h-6 w-6 mb-2" />
                      JSON Format
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                      <Download className="h-6 w-6 mb-2" />
                      NetCDF Format
                    </Button>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-medium mb-2">Export Options</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium">Data Range:</div>
                        <div className="text-muted-foreground">{dateRange.start} to {dateRange.end}</div>
                      </div>
                      <div>
                        <div className="font-medium">Geographic Coverage:</div>
                        <div className="text-muted-foreground">
                          {boundingBox[0].toFixed(2)}°N to {boundingBox[2].toFixed(2)}°N, 
                          {boundingBox[1].toFixed(2)}°E to {boundingBox[3].toFixed(2)}°E
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EarthdataExplorer; 