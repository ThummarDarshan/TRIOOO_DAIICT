import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Upload, 
  MapPin, 
  Camera,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  User,
  Phone,
  Mail,
  Globe,
  Navigation,
  Info,
  Shield,
  AlertCircle,
  X,
  Plus,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FormData {
  // Basic Information
  incidentType: string;
  incidentTitle: string;
  description: string;
  severity: string;
  
  // Location Details
  location: string;
  coordinates: string;
  sector: string;
  nearestLandmark: string;
  
  // Incident Details
  dateTime: string;
  weatherConditions: string;
  tideLevel: string;
  windSpeed: string;
  
  // Environmental Impact
  affectedArea: string;
  marineLifeImpact: string;
  waterQualityImpact: string;
  publicHealthRisk: boolean;
  
  // Response Actions
  immediateActions: string;
  authoritiesNotified: boolean;
  emergencyServicesCalled: boolean;
  
  // Reporter Information
  reporterName: string;
  reporterPhone: string;
  reporterEmail: string;
  organization: string;
  relationshipToIncident: string;
  
  // Evidence & Documentation
  photos: File[];
  videos: File[];
  additionalNotes: string;
  
  // Privacy & Consent
  consentToContact: boolean;
  consentToShare: boolean;
}

const incidentTypes = [
  { value: 'oil-spill', label: 'Oil Spill', description: 'Petroleum or chemical spills in water' },
  { value: 'water-pollution', label: 'Water Pollution', description: 'Contamination of coastal waters' },
  { value: 'dead-marine-life', label: 'Dead Marine Life', description: 'Unusual mortality of fish or marine animals' },
  { value: 'unusual-tides', label: 'Unusual Tides', description: 'Abnormal tidal patterns or levels' },
  { value: 'coastal-erosion', label: 'Coastal Erosion', description: 'Accelerated shoreline loss' },
  { value: 'algal-bloom', label: 'Algal Bloom', description: 'Harmful algal blooms or red tides' },
  { value: 'marine-debris', label: 'Marine Debris', description: 'Large amounts of floating waste' },
  { value: 'vessel-incident', label: 'Vessel Incident', description: 'Ship grounding, collision, or sinking' },
  { value: 'sewage-discharge', label: 'Sewage Discharge', description: 'Untreated wastewater release' },
  { value: 'chemical-release', label: 'Chemical Release', description: 'Industrial chemical discharge' },
  { value: 'other', label: 'Other', description: 'Other environmental incidents' }
];

const severityLevels = [
  { value: 'low', label: 'Low', description: 'Minimal impact, easily contained' },
  { value: 'medium', label: 'Medium', description: 'Moderate impact, requires attention' },
  { value: 'high', label: 'High', description: 'Significant impact, immediate response needed' },
  { value: 'critical', label: 'Critical', description: 'Severe impact, emergency response required' }
];

const sectors = [
  'Sector A-1 (North Beach)',
  'Sector A-2 (Central Beach)',
  'Sector A-3 (South Beach)',
  'Sector B-1 (North Harbor)',
  'Sector B-2 (Central Harbor)',
  'Sector B-3 (South Harbor)',
  'Sector C-1 (Marine Reserve North)',
  'Sector C-2 (Marine Reserve Central)',
  'Sector C-3 (Marine Reserve South)',
  'Sector D-1 (Industrial Zone)',
  'Sector D-2 (Commercial Zone)',
  'Sector D-3 (Residential Zone)'
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'low': return 'bg-safe text-safe-foreground';
    case 'medium': return 'bg-advisory text-advisory-foreground';
    case 'high': return 'bg-warning text-warning-foreground';
    case 'critical': return 'bg-emergency text-emergency-foreground';
    default: return 'bg-muted text-muted-foreground';
  }
};

const IncidentReport = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdvancedFields, setShowAdvancedFields] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    // Basic Information
    incidentType: '',
    incidentTitle: '',
    description: '',
    severity: '',
    
    // Location Details
    location: '',
    coordinates: '',
    sector: '',
    nearestLandmark: '',
    
    // Incident Details
    dateTime: new Date().toISOString().slice(0, 16),
    weatherConditions: '',
    tideLevel: '',
    windSpeed: '',
    
    // Environmental Impact
    affectedArea: '',
    marineLifeImpact: '',
    waterQualityImpact: '',
    publicHealthRisk: false,
    
    // Response Actions
    immediateActions: '',
    authoritiesNotified: false,
    emergencyServicesCalled: false,
    
    // Reporter Information
    reporterName: '',
    reporterPhone: '',
    reporterEmail: '',
    organization: '',
    relationshipToIncident: '',
    
    // Evidence & Documentation
    photos: [],
    videos: [],
    additionalNotes: '',
    
    // Privacy & Consent
    consentToContact: false,
    consentToShare: false
  });

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field: 'photos' | 'videos', files: FileList | null) => {
    if (!files) return;
    
    const newFiles = Array.from(files);
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ...newFiles]
    }));
  };

  const removeFile = (field: 'photos' | 'videos', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    const requiredFields = ['incidentType', 'incidentTitle', 'description', 'severity', 'location', 'reporterName'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof FormData]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: `Please fill in: ${missingFields.join(', ')}`,
        variant: "destructive"
      });
      return false;
    }
    
    if (formData.incidentType === 'other' && !formData.description) {
      toast({
        title: "Missing Description",
        description: "Please provide a detailed description for custom incident types",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Report Submitted Successfully",
        description: "Your incident report has been submitted and is under review. A reference number will be sent to your email.",
      });
      
      // Reset form
      setFormData({
        incidentType: '',
        incidentTitle: '',
        description: '',
        severity: '',
        location: '',
        coordinates: '',
        sector: '',
        nearestLandmark: '',
        dateTime: new Date().toISOString().slice(0, 16),
        weatherConditions: '',
        tideLevel: '',
        windSpeed: '',
        affectedArea: '',
        marineLifeImpact: '',
        waterQualityImpact: '',
        publicHealthRisk: false,
        immediateActions: '',
        authoritiesNotified: false,
        emergencyServicesCalled: false,
        reporterName: '',
        reporterPhone: '',
        reporterEmail: '',
        organization: '',
        relationshipToIncident: '',
        photos: [],
        videos: [],
        additionalNotes: '',
        consentToContact: false,
        consentToShare: false
      });
      
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Submit Incident Report</h1>
          <p className="text-muted-foreground">Report coastal incidents and environmental concerns to help protect our marine ecosystems</p>
        </div>

        <Card className="shadow-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-primary" />
              <span>Incident Report Form</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Provide detailed information about the incident to help authorities respond effectively
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Info className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="incidentType">Incident Type *</Label>
                    <Select value={formData.incidentType} onValueChange={(value) => handleInputChange('incidentType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select incident type" />
                      </SelectTrigger>
                      <SelectContent>
                        {incidentTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div>
                              <div className="font-medium">{type.label}</div>
                              <div className="text-xs text-muted-foreground">{type.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="severity">Severity Level *</Label>
                    <Select value={formData.severity} onValueChange={(value) => handleInputChange('severity', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        {severityLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            <div className="flex items-center space-x-2">
                              <Badge className={getSeverityColor(level.value)} variant="secondary">
                                {level.label}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{level.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="incidentTitle">Incident Title *</Label>
                  <Input
                    id="incidentTitle"
                    placeholder="Brief, descriptive title of the incident"
                    value={formData.incidentTitle}
                    onChange={(e) => handleInputChange('incidentTitle', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Detailed Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide comprehensive details about what you observed, when it happened, and any relevant circumstances..."
                    className="min-h-[120px]"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Include specific details about the incident, environmental conditions, and any immediate actions taken
                  </p>
                </div>
              </div>

              <Separator />

              {/* Location Details Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Location Details</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sector">Sector</Label>
                    <Select value={formData.sector} onValueChange={(value) => handleInputChange('sector', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sector" />
                      </SelectTrigger>
                      <SelectContent>
                        {sectors.map((sector) => (
                          <SelectItem key={sector} value={sector}>
                            {sector}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Specific Location *</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Beach Road, Harbor Pier, Marine Reserve"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="coordinates">GPS Coordinates (Optional)</Label>
                    <Input
                      id="coordinates"
                      placeholder="e.g., 12.3456, -78.9012"
                      value={formData.coordinates}
                      onChange={(e) => handleInputChange('coordinates', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nearestLandmark">Nearest Landmark</Label>
                    <Input
                      id="nearestLandmark"
                      placeholder="e.g., Lighthouse, Hotel, Park"
                      value={formData.nearestLandmark}
                      onChange={(e) => handleInputChange('nearestLandmark', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Incident Details Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Incident Details</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateTime">Date & Time *</Label>
                    <Input
                      id="dateTime"
                      type="datetime-local"
                      value={formData.dateTime}
                      onChange={(e) => handleInputChange('dateTime', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weatherConditions">Weather Conditions</Label>
                    <Input
                      id="weatherConditions"
                      placeholder="e.g., Sunny, Rainy, Stormy"
                      value={formData.weatherConditions}
                      onChange={(e) => handleInputChange('weatherConditions', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tideLevel">Tide Level</Label>
                    <Select value={formData.tideLevel} onValueChange={(value) => handleInputChange('tideLevel', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tide level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low Tide</SelectItem>
                        <SelectItem value="rising">Rising Tide</SelectItem>
                        <SelectItem value="high">High Tide</SelectItem>
                        <SelectItem value="falling">Falling Tide</SelectItem>
                        <SelectItem value="unknown">Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="windSpeed">Wind Speed</Label>
                    <Input
                      id="windSpeed"
                      placeholder="e.g., 15 mph, Calm, Strong"
                      value={formData.windSpeed}
                      onChange={(e) => handleInputChange('windSpeed', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Advanced Fields Toggle */}
              <div className="text-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAdvancedFields(!showAdvancedFields)}
                  className="flex items-center space-x-2 mx-auto"
                >
                  {showAdvancedFields ? (
                    <>
                      <EyeOff className="h-4 w-4" />
                      <span>Hide Advanced Fields</span>
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4" />
                      <span>Show Advanced Fields</span>
                    </>
                  )}
                </Button>
              </div>

              {/* Advanced Fields */}
              {showAdvancedFields && (
                <>
                  <Separator />
                  
                  {/* Environmental Impact Section */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">Environmental Impact Assessment</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="affectedArea">Estimated Affected Area</Label>
                        <Input
                          id="affectedArea"
                          placeholder="e.g., 100 square meters, 0.5 km stretch"
                          value={formData.affectedArea}
                          onChange={(e) => handleInputChange('affectedArea', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="marineLifeImpact">Marine Life Impact</Label>
                        <Textarea
                          id="marineLifeImpact"
                          placeholder="Describe any observed impact on marine life..."
                          className="min-h-[80px]"
                          value={formData.marineLifeImpact}
                          onChange={(e) => handleInputChange('marineLifeImpact', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="waterQualityImpact">Water Quality Impact</Label>
                      <Textarea
                        id="waterQualityImpact"
                        placeholder="Describe any observed changes in water quality..."
                        className="min-h-[80px]"
                        value={formData.waterQualityImpact}
                        onChange={(e) => handleInputChange('waterQualityImpact', e.target.value)}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="publicHealthRisk"
                        checked={formData.publicHealthRisk}
                        onCheckedChange={(checked) => handleInputChange('publicHealthRisk', checked)}
                      />
                      <Label htmlFor="publicHealthRisk">This incident poses a public health risk</Label>
                    </div>
                  </div>

                  <Separator />

                  {/* Response Actions Section */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">Response Actions</h3>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="immediateActions">Immediate Actions Taken</Label>
                      <Textarea
                        id="immediateActions"
                        placeholder="Describe any immediate actions you or others have taken..."
                        className="min-h-[80px]"
                        value={formData.immediateActions}
                        onChange={(e) => handleInputChange('immediateActions', e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="authoritiesNotified"
                          checked={formData.authoritiesNotified}
                          onCheckedChange={(checked) => handleInputChange('authoritiesNotified', checked)}
                        />
                        <Label htmlFor="authoritiesNotified">Authorities have been notified</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="emergencyServicesCalled"
                          checked={formData.emergencyServicesCalled}
                          onCheckedChange={(checked) => handleInputChange('emergencyServicesCalled', checked)}
                        />
                        <Label htmlFor="emergencyServicesCalled">Emergency services called</Label>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <Separator />

              {/* Reporter Information Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Reporter Information</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reporterName">Full Name *</Label>
                    <Input
                      id="reporterName"
                      placeholder="Your full name"
                      value={formData.reporterName}
                      onChange={(e) => handleInputChange('reporterName', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organization">Organization (Optional)</Label>
                    <Input
                      id="organization"
                      placeholder="Company, NGO, Government agency"
                      value={formData.organization}
                      onChange={(e) => handleInputChange('organization', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reporterPhone">Phone Number</Label>
                    <Input
                      id="reporterPhone"
                      placeholder="Your phone number"
                      value={formData.reporterPhone}
                      onChange={(e) => handleInputChange('reporterPhone', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reporterEmail">Email Address</Label>
                    <Input
                      id="reporterEmail"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.reporterEmail}
                      onChange={(e) => handleInputChange('reporterEmail', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="relationshipToIncident">Relationship to Incident</Label>
                  <Select value={formData.relationshipToIncident} onValueChange={(value) => handleInputChange('relationshipToIncident', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="witness">Witness</SelectItem>
                      <SelectItem value="affected">Directly Affected</SelectItem>
                      <SelectItem value="professional">Professional Observer</SelectItem>
                      <SelectItem value="volunteer">Volunteer</SelectItem>
                      <SelectItem value="official">Government Official</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* Evidence & Documentation Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Camera className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Evidence & Documentation</h3>
                </div>
                
                {/* Photo Upload */}
                <div className="space-y-3">
                  <Label>Photos (Optional)</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Upload photos of the incident (JPG, PNG, max 5MB each)
                    </p>
                    <Button 
                      type="button"
                      variant="outline" 
                      size="sm"
                      onClick={() => document.getElementById('photoUpload')?.click()}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Choose Photos
                    </Button>
                    <input
                      id="photoUpload"
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload('photos', e.target.files)}
                    />
                  </div>
                  
                  {/* Photo Preview */}
                  {formData.photos.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {formData.photos.map((file, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Photo ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeFile('photos', index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Video Upload */}
                <div className="space-y-3">
                  <Label>Videos (Optional)</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Upload videos of the incident (MP4, MOV, max 50MB each)
                    </p>
                    <Button 
                      type="button"
                      variant="outline" 
                      size="sm"
                      onClick={() => document.getElementById('videoUpload')?.click()}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Choose Videos
                    </Button>
                    <input
                      id="videoUpload"
                      type="file"
                      multiple
                      accept="video/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload('videos', e.target.files)}
                    />
                  </div>
                  
                  {/* Video Preview */}
                  {formData.videos.length > 0 && (
                    <div className="space-y-2">
                      {formData.videos.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                          <span className="text-sm text-muted-foreground">{file.name}</span>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeFile('videos', index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalNotes">Additional Notes</Label>
                  <Textarea
                    id="additionalNotes"
                    placeholder="Any additional information, observations, or context that might be helpful..."
                    className="min-h-[80px]"
                    value={formData.additionalNotes}
                    onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                  />
                </div>
              </div>

              <Separator />

              {/* Privacy & Consent Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Privacy & Consent</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="consentToContact"
                      checked={formData.consentToContact}
                      onCheckedChange={(checked) => handleInputChange('consentToContact', checked)}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="consentToContact">Consent to Contact</Label>
                      <p className="text-xs text-muted-foreground">
                        I consent to being contacted for follow-up questions or additional information about this report
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="consentToShare"
                      checked={formData.consentToShare}
                      onCheckedChange={(checked) => handleInputChange('consentToShare', checked)}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="consentToShare">Consent to Share Information</Label>
                      <p className="text-xs text-muted-foreground">
                        I consent to my report being shared with relevant authorities and organizations for response purposes
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Submitting Report...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Submit Incident Report
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-muted-foreground text-center mt-2">
                  * Required fields. Your report will be reviewed by environmental authorities.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IncidentReport;
