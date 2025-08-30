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
  Camera,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Phone,
  Mail,
  Info,
  Shield,
  AlertCircle,
  X,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface IncidentReport {
  id: string;
  type: string;
  title: string;
  status: 'pending' | 'verified' | 'investigating' | 'resolved';
  timestamp: string;
  reporter: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface FormData {
  // Basic Information
  incidentType: string;
  incidentTitle: string;
  description: string;
  severity: string;
  
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
  additionalNotes: string;
  
  // Privacy & Consent
  consentToContact: boolean;
  consentToShare: boolean;
}

const mockReports: IncidentReport[] = [
  {
    id: '1',
    type: 'Oil Spill',
    title: 'Oil sheen observed near fishing area',
    status: 'investigating',
    timestamp: '2 hours ago',
    reporter: 'Local Fisher',
    severity: 'high'
  },
  {
    id: '2',
    type: 'Unusual Tide',
    title: 'Abnormally high tide levels reported',
    status: 'verified',
    timestamp: '1 day ago',
    reporter: 'Beach Authority',
    severity: 'medium'
  },
  {
    id: '3',
    type: 'Dead Fish',
    title: 'Multiple fish found dead on shore',
    status: 'pending',
    timestamp: '3 hours ago',
    reporter: 'Tourist',
    severity: 'high'
  }
];

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



const getStatusColor = (status: string) => {
  switch (status) {
    case 'verified': return 'bg-safe text-safe-foreground';
    case 'investigating': return 'bg-advisory text-advisory-foreground';
    case 'pending': return 'bg-warning text-warning-foreground';
    case 'resolved': return 'bg-primary text-primary-foreground';
    default: return 'bg-muted text-muted-foreground';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'verified': return CheckCircle;
    case 'investigating': return AlertTriangle;
    case 'pending': return Clock;
    case 'resolved': return CheckCircle;
    default: return Clock;
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'low': return 'bg-safe text-safe-foreground';
    case 'medium': return 'bg-advisory text-advisory-foreground';
    case 'high': return 'bg-warning text-warning-foreground';
    case 'critical': return 'bg-emergency text-emergency-foreground';
    default: return 'bg-muted text-muted-foreground';
  }
};

const Reports = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    // Basic Information
    incidentType: '',
    incidentTitle: '',
    description: '',
    severity: '',
    
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
    additionalNotes: '',
    
    // Privacy & Consent
    consentToContact: false,
    consentToShare: false
  });

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    
    const newFiles = Array.from(files);
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...newFiles]
    }));
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    const requiredFields = ['incidentType', 'incidentTitle', 'description', 'severity', 'reporterName'];
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Incident Reporting</h1>
          <p className="text-muted-foreground">Report coastal incidents and environmental concerns to help protect our marine ecosystems</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Enhanced Report Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span>Submit New Incident Report</span>
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

                  


                  {/* Environmental Impact Section */}
                  <Separator />
                  
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
                          onChange={(e) => handleFileUpload(e.target.files)}
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
                                onClick={() => removeFile(index)}
                              >
                                <X className="h-3 w-3" />
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

          {/* Recent Reports Sidebar */}
          <div className="space-y-6">
            <Card className="shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span>Recent Reports</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockReports.map((report) => {
                  const StatusIcon = getStatusIcon(report.status);
                  return (
                    <div key={report.id} className="p-3 rounded-lg border border-border/30 bg-muted/20">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-sm font-medium text-foreground">{report.title}</h4>
                        <Badge className={getStatusColor(report.status)}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {report.status}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                        <span>{report.timestamp}</span>
                        <span>{report.reporter}</span>
                      </div>
                      <Badge className={getSeverityColor(report.severity)} variant="outline">
                        {report.severity} severity
                      </Badge>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card className="shadow-card border-border/50">
              <CardHeader>
                <CardTitle>Reporting Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-sm font-medium text-primary">Be specific about incident details for faster response.</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/20">
                  <p className="text-sm font-medium text-secondary">Include photos when safe to do so.</p>
                </div>
                <div className="p-3 rounded-lg bg-safe/10 border border-safe/20">
                  <p className="text-sm font-medium text-safe">Don't put yourself in danger to document incidents.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;