# NASA Earthdata Integration

## Overview

This application now integrates with NASA Earthdata APIs to provide real-time oceanographic and climate data for coastal monitoring and early warning systems. The integration replaces the previous mock APIs with actual NASA satellite and ocean monitoring data.

## 🌊 Data Sources

### Sea Surface Temperature (SST)
- **MUR SST**: Multi-scale Ultra-high Resolution Sea Surface Temperature (1km resolution, daily updates)
- **GHRSST L4**: Group for High Resolution Sea Surface Temperature Level 4 (5km resolution, daily updates)

### Sea Level
- **AVISO SLA**: Archiving, Validation and Interpretation of Satellite Oceanographic data (0.25° resolution, daily updates)
- **Jason SLA**: Jason satellite altimetry sea level data (0.2° resolution, 10-day updates)

### Chlorophyll
- **Ocean Color Chlorophyll**: NASA Ocean Color chlorophyll-a concentration (4km resolution, 8-day updates)
- **VIIRS Chlorophyll**: Visible Infrared Imaging Radiometer Suite chlorophyll data (750m resolution, daily updates)

### Wind
- **ASCAT Wind**: Advanced Scatterometer wind vector data (25km resolution, daily updates)
- **CCMP Wind**: Cross-Calibrated Multi-Platform wind data (0.25° resolution, 6-hourly updates)

### Rainfall
- **IMERG Rainfall**: Integrated Multi-satellitE Retrievals for GPM rainfall (0.1° resolution, 30-minute updates)
- **TRMM Rainfall**: Tropical Rainfall Measuring Mission precipitation data (0.25° resolution, 3-hourly updates)

## 🚀 New Features

### 1. Earthdata Panel (Dashboard)
- Real-time oceanographic data display
- Risk assessment based on multiple parameters
- Data quality metrics and source information
- Threat level indicators and recommendations

### 2. Earthdata Explorer Page
- Advanced data filtering and selection
- Geographic bounding box controls
- Date range selection
- Dataset information and metadata
- Export capabilities (CSV, JSON, NetCDF)

### 3. Enhanced Hooks
- `useOceanographicSummary`: Real-time summary of all oceanographic parameters
- `useCoastalThreatAssessment`: AI-powered threat assessment
- `useHistoricalTrends`: Historical data analysis and trends
- `useDataQualityMetrics`: Data quality and reliability metrics

## 📊 Data Parameters

### Sea Surface Temperature
- **Unit**: °C
- **Risk Levels**: 
  - Low: < 28°C
  - Medium: 28-30°C
  - High: > 30°C
- **Trends**: Increasing, Decreasing, Stable

### Sea Level
- **Unit**: meters
- **Risk Levels**:
  - Low: < 0.3m anomaly
  - Medium: 0.3-0.5m anomaly
  - High: > 0.5m anomaly
- **Long-term Trend**: ~3mm/year rise

### Chlorophyll
- **Unit**: mg/m³
- **Risk Levels**:
  - Low: < 0.5 mg/m³
  - Medium: 0.5-1.0 mg/m³
  - High: > 1.0 mg/m³
- **Bloom Risk**: Low, Medium, High

### Wind
- **Unit**: m/s
- **Risk Levels**:
  - Low: < 10 m/s
  - Medium: 10-15 m/s
  - High: > 15 m/s
- **Direction**: 0-360°

### Rainfall
- **Unit**: mm
- **Risk Levels**:
  - Low: < 25mm (24h)
  - Medium: 25-50mm (24h)
  - High: > 50mm (24h)
- **Intensity**: Light, Moderate, Heavy, Extreme

## 🔧 Technical Implementation

### API Service (`src/lib/earthdata-api.ts`)
```typescript
class EarthdataAPIService {
  // Fetch SST data
  async getSSTData(params: EarthdataQueryParams): Promise<EarthdataResponse<SSTData>>
  
  // Fetch sea level data
  async getSeaLevelData(params: EarthdataQueryParams): Promise<EarthdataResponse<SeaLevelData>>
  
  // Fetch chlorophyll data
  async getChlorophyllData(params: EarthdataQueryParams): Promise<EarthdataResponse<ChlorophyllData>>
  
  // Fetch wind data
  async getWindData(params: EarthdataQueryParams): Promise<EarthdataResponse<WindData>>
  
  // Fetch rainfall data
  async getRainfallData(params: EarthdataQueryParams): Promise<EarthdataResponse<RainfallData>>
}
```

### React Hooks (`src/hooks/use-earthdata.ts`)
```typescript
// Real-time oceanographic summary
export const useOceanographicSummary = (boundingBox?: [number, number, number, number])

// Coastal threat assessment
export const useCoastalThreatAssessment = (boundingBox?: [number, number, number, number])

// Historical trends analysis
export const useHistoricalTrends = (parameter: string, days: number = 30)

// Data quality metrics
export const useDataQualityMetrics = (datasetId: string)
```

### Components
- **EarthdataPanel**: Main dashboard component for real-time data display
- **EarthdataDatasets**: Dataset information and metadata display
- **EarthdataExplorer**: Advanced data exploration and analysis page

## 🗺️ Geographic Coverage

### Default Region: Mumbai, India
- **Bounding Box**: [18°N, 72°E, 20°N, 75°E]
- **Coverage Area**: ~6,000 km²
- **Resolution**: Variable based on dataset (0.1° to 1km)

### Customizable Regions
- Users can define custom bounding boxes
- Support for global coverage
- Automatic dataset resolution selection

## 📈 Data Quality Metrics

### Completeness
- Percentage of expected data points available
- Temporal and spatial coverage assessment
- Missing data identification

### Accuracy
- Validation against ground truth data
- Uncertainty quantification
- Quality flags and confidence scores

### Timeliness
- Data latency assessment
- Update frequency monitoring
- Real-time availability status

### Spatial Coverage
- Geographic extent validation
- Resolution consistency
- Boundary condition handling

## 🔐 Authentication & Access

### NASA Earthdata Requirements
- **Base URL**: https://cmr.earthdata.nasa.gov
- **Authentication**: Username/password (optional)
- **Rate Limits**: Variable by dataset
- **Data Access**: Public datasets, no API key required

### Environment Variables
```bash
# Optional: Add to .env file
EARTHDATA_USERNAME=your_username
EARTHDATA_PASSWORD=your_password
```

## 📊 Data Export & Integration

### Export Formats
- **CSV**: Tabular data for spreadsheet analysis
- **JSON**: Structured data for API integration
- **NetCDF**: Scientific data format for analysis tools

### Integration Points
- **Dashboard**: Real-time monitoring and alerts
- **Reports**: Historical analysis and trends
- **Predictions**: AI model input data
- **Education**: Training and awareness materials

## 🚨 Threat Assessment Algorithm

### Risk Scoring (0-100)
- **Active Alerts**: 25 points per high-severity alert
- **Sensor Warnings**: 15 points per warning sensor
- **High-Risk Predictions**: 20 points per high-risk prediction
- **Parameter Thresholds**: Variable based on parameter type

### Risk Levels
- **Low**: 0-29 points
- **Medium**: 30-59 points
- **High**: 60-79 points
- **Critical**: 80-100 points

### Recommendations
- Monitor active alerts closely
- Review sensor readings for anomalies
- Prepare emergency response protocols
- Communicate with affected communities

## 🔄 Real-Time Updates

### Update Frequencies
- **SST**: Every 5 minutes
- **Sea Level**: Every 5 minutes
- **Chlorophyll**: Every 10 minutes
- **Wind**: Every 3 minutes
- **Rainfall**: Every 2 minutes

### Data Refresh
- Automatic background updates
- Manual refresh capabilities
- WebSocket simulation for real-time feel
- Cache invalidation strategies

## 🛠️ Development & Testing

### Mock Data
- Development uses simulated data
- Realistic parameter ranges and trends
- Seasonal and diurnal variations
- Quality degradation simulation

### Testing
- Unit tests for API service
- Integration tests for hooks
- Component testing with mock data
- Performance testing for large datasets

## 📚 Usage Examples

### Basic Dashboard Integration
```typescript
import { EarthdataPanel } from '@/components/dashboard/EarthdataPanel';

// In your dashboard component
<EarthdataPanel boundingBox={[18, 72, 20, 75]} />
```

### Custom Data Fetching
```typescript
import { useSSTData } from '@/hooks/use-earthdata';

const { data: sstData, isLoading } = useSSTData({
  startDate: '2024-01-01',
  endDate: '2024-01-07',
  boundingBox: [18, 72, 20, 75],
  dataset: 'MUR_SST'
});
```

### Threat Assessment
```typescript
import { useCoastalThreatAssessment } from '@/hooks/use-earthdata';

const { data: threatAssessment, isLoading } = useCoastalThreatAssessment([18, 72, 20, 75]);

if (threatAssessment?.threatLevel === 'high') {
  // Trigger alert system
}
```

## 🔮 Future Enhancements

### Planned Features
- Interactive maps with Leaflet/Mapbox
- Advanced charting with D3.js
- Machine learning predictions
- Mobile app integration
- API rate limiting and caching
- Multi-language support

### Data Sources
- Additional satellite missions
- In-situ sensor networks
- Climate model outputs
- Historical reconstructions
- Regional partnerships

## 📞 Support & Documentation

### NASA Earthdata Resources
- [Earthdata Search](https://search.earthdata.nasa.gov/)
- [API Documentation](https://cmr.earthdata.nasa.gov/apis/)
- [Data Access Guide](https://earthdata.nasa.gov/learn/user-resources)
- [Community Forum](https://forum.earthdata.nasa.gov/)

### Application Support
- Check console for API errors
- Verify network connectivity
- Review data quality metrics
- Monitor update frequencies
- Validate geographic bounds

## 🎯 Benefits

### For Coastal Communities
- Real-time threat monitoring
- Early warning capabilities
- Data-driven decision making
- Improved safety protocols

### For Researchers
- High-quality satellite data
- Standardized data formats
- Historical trend analysis
- Export and integration tools

### For Emergency Responders
- Situational awareness
- Risk assessment tools
- Communication protocols
- Response coordination

---

**Note**: This integration provides a foundation for real-time coastal monitoring using NASA's comprehensive Earth observation data. The system is designed to be scalable, maintainable, and user-friendly while providing access to world-class oceanographic and climate data. 