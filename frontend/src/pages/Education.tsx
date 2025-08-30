import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  GraduationCap, 
  Book, 
  Shield, 
  Waves, 
  Trees,
  Search,
  ExternalLink,
  PlayCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  User,
  Calendar,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Info,
  Download,
  Share2,
  Bookmark,
  X
} from 'lucide-react';

interface EducationResource {
  id: string;
  title: string;
  type: 'guide' | 'article' | 'video' | 'faq';
  category: 'safety' | 'environment' | 'preparation';
  description: string;
  readTime?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  author?: string;
  lastUpdated?: string;
  location?: string;
  detailedContent: {
    overview: string;
    keyPoints: string[];
    steps?: string[];
    tips: string[];
    resources: string[];
    relatedTopics: string[];
  };
}

const educationResources: EducationResource[] = [
  {
    id: '1',
    title: 'Cyclone Preparation Checklist',
    type: 'guide',
    category: 'safety',
    description: 'Complete guide on how to prepare your home and family for approaching cyclones.',
    readTime: '8 min read',
    difficulty: 'beginner',
    author: 'Coastal Safety Institute',
    lastUpdated: '2024-01-15',
    location: 'Coastal Regions',
    detailedContent: {
      overview: 'This comprehensive guide provides step-by-step instructions for preparing your home, family, and community for cyclone season. Learn essential safety measures, evacuation procedures, and emergency planning strategies.',
      keyPoints: [
        'Create a family emergency plan and communication strategy',
        'Prepare an emergency kit with essential supplies',
        'Secure your home and property against strong winds',
        'Know evacuation routes and emergency shelters',
        'Stay informed through official weather updates'
      ],
      steps: [
        'Assess your home\'s vulnerability to wind and water damage',
        'Install storm shutters or board up windows',
        'Trim trees and secure loose objects in your yard',
        'Prepare emergency supplies for at least 72 hours',
        'Practice evacuation drills with your family',
        'Identify safe rooms and evacuation routes',
        'Keep important documents in waterproof containers'
      ],
      tips: [
        'Start preparations at least 24 hours before expected landfall',
        'Have multiple ways to receive weather alerts',
        'Include pet supplies in your emergency kit',
        'Know how to turn off utilities if necessary',
        'Keep cash on hand as ATMs may not work',
        'Charge all electronic devices before the storm'
      ],
      resources: [
        'National Weather Service cyclone tracking',
        'Local emergency management office contacts',
        'Red Cross emergency preparedness guides',
        'FEMA disaster preparedness resources',
        'Community emergency response team training'
      ],
      relatedTopics: [
        'Emergency Evacuation Procedures',
        'Flood Safety Guidelines',
        'Storm Surge Protection',
        'Post-Cyclone Recovery',
        'Insurance and Documentation'
      ]
    }
  },
  {
    id: '2',
    title: 'Understanding Tide Patterns',
    type: 'article',
    category: 'environment',
    description: 'Learn about tidal cycles, their causes, and how they affect coastal communities.',
    readTime: '12 min read',
    difficulty: 'intermediate',
    author: 'Marine Science Institute',
    lastUpdated: '2024-01-10',
    location: 'Global Coastal Areas',
    detailedContent: {
      overview: 'Explore the fascinating world of tidal patterns and their profound impact on coastal ecosystems, navigation, and community planning. Understand the science behind tides and their relationship with lunar cycles.',
      keyPoints: [
        'Tides are caused by gravitational forces from the Moon and Sun',
        'Spring tides occur during full and new moons',
        'Neap tides happen during quarter moons',
        'Tidal ranges vary significantly by location',
        'Tides influence marine life and coastal processes'
      ],
      steps: [
        'Learn to read tide tables and charts',
        'Understand the difference between high and low tides',
        'Identify spring and neap tide periods',
        'Calculate tidal ranges for your location',
        'Recognize tidal currents and their effects'
      ],
      tips: [
        'Always check tide times before coastal activities',
        'Be aware of king tides during extreme weather',
        'Understand how tides affect fishing and boating',
        'Plan beach activities around low tide for safety',
        'Monitor tide predictions for emergency planning'
      ],
      resources: [
        'NOAA tide prediction tools',
        'Marine navigation charts',
        'Coastal tide monitoring stations',
        'Educational tide simulation software',
        'Local tide table publications'
      ],
      relatedTopics: [
        'Mangrove Conservation Guide',
        'Coastal Erosion Patterns',
        'Marine Navigation Safety',
        'Coastal Habitat Protection',
        'Climate Change and Sea Level Rise'
      ]
    }
  },
  {
    id: '3',
    title: 'Mangrove Conservation Guide',
    type: 'guide',
    category: 'environment',
    description: 'Why mangroves are crucial for coastal protection and how to preserve them.',
    readTime: '15 min read',
    difficulty: 'intermediate',
    author: 'Environmental Protection Agency',
    lastUpdated: '2024-01-20',
    location: 'Tropical and Subtropical Coasts',
    detailedContent: {
      overview: 'Mangroves are vital coastal ecosystems that provide natural protection against storms, support marine life, and help combat climate change. This guide explains their importance and conservation strategies.',
      keyPoints: [
        'Mangroves reduce wave energy by up to 66%',
        'They sequester carbon more effectively than terrestrial forests',
        'Mangrove roots provide nursery habitats for marine species',
        'They help prevent coastal erosion and land loss',
        'Mangroves filter pollutants from coastal waters'
      ],
      steps: [
        'Identify mangrove species in your area',
        'Learn about local mangrove ecosystems',
        'Participate in mangrove planting programs',
        'Support mangrove conservation organizations',
        'Practice sustainable fishing in mangrove areas',
        'Report illegal mangrove cutting or development',
        'Educate others about mangrove importance'
      ],
      tips: [
        'Never walk on mangrove roots or seedlings',
        'Use designated boardwalks in mangrove areas',
        'Support sustainable tourism practices',
        'Reduce plastic waste that harms mangroves',
        'Volunteer for mangrove restoration projects',
        'Choose sustainable seafood from healthy ecosystems'
      ],
      resources: [
        'Mangrove Action Project resources',
        'Local conservation organization contacts',
        'Mangrove species identification guides',
        'Restoration project volunteer opportunities',
        'Educational materials for schools'
      ],
      relatedTopics: [
        'Blue Carbon Ecosystems',
        'Coastal Habitat Restoration',
        'Marine Biodiversity Protection',
        'Climate Change Mitigation',
        'Sustainable Coastal Development'
      ]
    }
  },
  {
    id: '4',
    title: 'Emergency Evacuation Procedures',
    type: 'video',
    category: 'safety',
    description: 'Step-by-step video guide on safe evacuation during coastal emergencies.',
    readTime: '6 min watch',
    difficulty: 'beginner',
    author: 'Emergency Management Division',
    lastUpdated: '2024-01-05',
    location: 'All Coastal Communities',
    detailedContent: {
      overview: 'This comprehensive video guide demonstrates proper evacuation procedures for various coastal emergencies including tsunamis, hurricanes, and flooding. Learn essential safety protocols and evacuation strategies.',
      keyPoints: [
        'Always follow official evacuation orders immediately',
        'Know your evacuation route and destination',
        'Have a family communication plan in place',
        'Take essential items only - prioritize safety',
        'Stay informed through multiple information sources'
      ],
      steps: [
        'Receive evacuation order or warning',
        'Gather family members and pets',
        'Collect essential emergency supplies',
        'Secure your home and property',
        'Follow designated evacuation routes',
        'Proceed to designated shelters or safe areas',
        'Check in with emergency officials upon arrival'
      ],
      tips: [
        'Practice evacuation routes regularly with family',
        'Have multiple evacuation destinations planned',
        'Keep emergency supplies easily accessible',
        'Know alternative routes in case of road closures',
        'Stay calm and follow instructions carefully',
        'Help neighbors who may need assistance'
      ],
      resources: [
        'Local evacuation route maps',
        'Emergency shelter locations and information',
        'Emergency management office contacts',
        'Real-time traffic and road condition updates',
        'Community emergency response team contacts'
      ],
      relatedTopics: [
        'Cyclone Preparation Checklist',
        'Flood Safety Guidelines',
        'Emergency Communication Plans',
        'Shelter and Safe Room Preparation',
        'Post-Evacuation Recovery'
      ]
    }
  },
  {
    id: '5',
    title: 'Blue Carbon Ecosystems',
    type: 'article',
    category: 'environment',
    description: 'Understanding seagrass, salt marshes, and their role in carbon storage.',
    readTime: '20 min read',
    difficulty: 'advanced',
    author: 'Marine Biology Research Institute',
    lastUpdated: '2024-01-18',
    location: 'Global Marine Environments',
    detailedContent: {
      overview: 'Blue carbon ecosystems are marine and coastal habitats that capture and store carbon dioxide from the atmosphere. This article explores their critical role in climate change mitigation and ocean health.',
      keyPoints: [
        'Blue carbon ecosystems store carbon 10x faster than terrestrial forests',
        'Seagrass meadows can store carbon for thousands of years',
        'Salt marshes provide coastal protection and carbon sequestration',
        'These ecosystems are threatened by coastal development',
        'Protection and restoration can significantly reduce emissions'
      ],
      steps: [
        'Learn about local blue carbon ecosystems',
        'Understand their carbon sequestration processes',
        'Identify threats to these habitats',
        'Support conservation and restoration efforts',
        'Advocate for blue carbon protection policies',
        'Participate in citizen science monitoring programs'
      ],
      tips: [
        'Support organizations protecting marine habitats',
        'Choose sustainable seafood from healthy ecosystems',
        'Reduce carbon footprint to protect ocean health',
        'Participate in beach and coastal cleanups',
        'Educate others about blue carbon importance',
        'Support marine protected area designations'
      ],
      resources: [
        'Blue Carbon Initiative research papers',
        'Marine habitat monitoring programs',
        'Ocean conservation organization resources',
        'Scientific publications on blue carbon',
        'Citizen science participation opportunities'
      ],
      relatedTopics: [
        'Mangrove Conservation Guide',
        'Climate Change and Oceans',
        'Marine Protected Areas',
        'Ocean Acidification',
        'Sustainable Marine Management'
      ]
    }
  },
  {
    id: '6',
    title: 'Flood Safety Guidelines',
    type: 'guide',
    category: 'safety',
    description: 'Essential safety measures during coastal flooding and storm surges.',
    readTime: '10 min read',
    difficulty: 'beginner',
    author: 'Coastal Safety Commission',
    lastUpdated: '2024-01-12',
    location: 'Flood-Prone Coastal Areas',
    detailedContent: {
      overview: 'Coastal flooding and storm surges pose significant risks to life and property. This guide provides essential safety information for preparing for, surviving, and recovering from flood events.',
      keyPoints: [
        'Never walk or drive through floodwaters',
        'Move to higher ground immediately when flooding begins',
        'Stay informed through official weather and emergency channels',
        'Have emergency supplies ready before flood season',
        'Know your evacuation routes and safe areas'
      ],
      steps: [
        'Monitor weather forecasts and flood warnings',
        'Prepare emergency supplies and evacuation plan',
        'Move vehicles to higher ground if possible',
        'Turn off utilities if flooding threatens your home',
        'Evacuate to designated safe areas when ordered',
        'Wait for official clearance before returning home',
        'Document damage for insurance purposes'
      ],
      tips: [
        'Keep emergency supplies above flood level',
        'Have multiple ways to receive emergency alerts',
        'Know the difference between flood watch and warning',
        'Avoid contact with floodwater due to contamination',
        'Check on neighbors, especially elderly or disabled',
        'Keep important documents in waterproof containers'
      ],
      resources: [
        'FEMA flood safety resources',
        'Local flood plain maps and information',
        'National Weather Service flood warnings',
        'Emergency management office contacts',
        'Flood insurance information and resources'
      ],
      relatedTopics: [
        'Cyclone Preparation Checklist',
        'Emergency Evacuation Procedures',
        'Storm Surge Protection',
        'Flood Insurance and Recovery',
        'Coastal Infrastructure Resilience'
      ]
    }
  }
];

const faqs = [
  {
    question: 'What should I do when I receive a tsunami warning?',
    answer: 'Immediately move to higher ground or at least 2 miles inland. Follow evacuation routes and avoid returning to coastal areas until authorities declare it safe.'
  },
  {
    question: 'How do I know if the water quality is safe?',
    answer: 'Check our real-time water quality monitoring on the dashboard. Avoid contact with water during red or yellow alerts, especially after heavy rains or reported pollution incidents.'
  },
  {
    question: 'What items should be in my emergency kit?',
    answer: 'Include water (1 gallon per person per day), non-perishable food, flashlight, batteries, first aid kit, medications, important documents in waterproof container, and emergency radio.'
  },
  {
    question: 'How can I help protect mangroves?',
    answer: 'Avoid damaging mangrove roots, participate in planting programs, reduce plastic waste, report illegal cutting, and support sustainable fishing practices in mangrove areas.'
  }
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'guide': return Shield;
    case 'article': return Book;
    case 'video': return PlayCircle;
    case 'faq': return GraduationCap;
    default: return Book;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'safety': return 'bg-emergency/10 text-emergency border-emergency/20';
    case 'environment': return 'bg-safe/10 text-safe border-safe/20';
    case 'preparation': return 'bg-advisory/10 text-advisory border-advisory/20';
    default: return 'bg-muted text-muted-foreground border-muted';
  }
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner': return 'bg-safe text-safe-foreground';
    case 'intermediate': return 'bg-advisory text-advisory-foreground';
    case 'advanced': return 'bg-warning text-warning-foreground';
    default: return 'bg-muted text-muted-foreground';
  }
};

const Education = () => {
  const { toast } = useToast();
  const [selectedResource, setSelectedResource] = useState<EducationResource | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [savedResources, setSavedResources] = useState<Set<string>>(new Set());

  const handleResourceClick = (resource: EducationResource) => {
    setSelectedResource(resource);
    setIsDialogOpen(true);
  };

  const handleSaveResource = (resourceId: string) => {
    setSavedResources(prev => {
      const newSet = new Set(prev);
      if (newSet.has(resourceId)) {
        newSet.delete(resourceId);
        toast({
          title: "Resource Removed",
          description: "Resource has been removed from your saved items.",
        });
      } else {
        newSet.add(resourceId);
        toast({
          title: "Resource Saved",
          description: "Resource has been added to your saved items.",
        });
      }
      return newSet;
    });
  };

  const handleShareResource = async (resource: EducationResource) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: resource.title,
          text: resource.description,
          url: window.location.href,
        });
        toast({
          title: "Shared Successfully",
          description: "Resource has been shared.",
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(
          `${resource.title}\n\n${resource.description}\n\nView more details at: ${window.location.href}`
        );
        toast({
          title: "Link Copied",
          description: "Resource link has been copied to clipboard.",
        });
      }
    } catch (error) {
      toast({
        title: "Share Failed",
        description: "Failed to share the resource. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDownloadResource = async (resource: EducationResource) => {
    try {
      // Create a formatted text content for download
      const content = `
${resource.title}
${'='.repeat(resource.title.length)}

Author: ${resource.author || 'Unknown'}
Last Updated: ${resource.lastUpdated || 'Unknown'}
Location: ${resource.location || 'Global'}
Read Time: ${resource.readTime || 'Unknown'}

OVERVIEW
${resource.detailedContent.overview}

KEY POINTS
${resource.detailedContent.keyPoints.map((point, index) => `${index + 1}. ${point}`).join('\n')}

${resource.detailedContent.steps ? `
STEP-BY-STEP GUIDE
${resource.detailedContent.steps.map((step, index) => `${index + 1}. ${step}`).join('\n')}
` : ''}

PRO TIPS
${resource.detailedContent.tips.map((tip, index) => `• ${tip}`).join('\n')}

ADDITIONAL RESOURCES
${resource.detailedContent.resources.map((resource, index) => `${index + 1}. ${resource}`).join('\n')}

RELATED TOPICS
${resource.detailedContent.relatedTopics.join(', ')}

---
Generated from SeaWatch Guardian Education Hub
${new Date().toLocaleDateString()}
      `.trim();

      // Create and download the file
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resource.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Download Started",
        description: `${resource.title} has been downloaded successfully.`,
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download the resource. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Filter resources based on search and filters
  const filteredResources = educationResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.author?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || resource.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Education Hub</h1>
          <p className="text-muted-foreground">Learn about coastal safety, environmental protection, and emergency preparedness</p>
        </div>

        {/* Search and Filters */}
        <Card className="shadow-card border-border/50 mb-6">
          <CardContent className="p-4">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search guides, articles, and resources..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {/* Filters */}
              <div className="flex flex-wrap gap-3">
                {/* Category Filter */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-muted-foreground">Category:</span>
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-1 text-sm border border-border rounded-md bg-background"
                  >
                    <option value="all">All Categories</option>
                    <option value="safety">Safety</option>
                    <option value="environment">Environment</option>
                    <option value="preparation">Preparation</option>
                  </select>
                </div>
                
                {/* Difficulty Filter */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-muted-foreground">Difficulty:</span>
                  <select 
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="px-3 py-1 text-sm border border-border rounded-md bg-background"
                  >
                    <option value="all">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                
                {/* Clear Filters */}
                {(selectedCategory !== 'all' || selectedDifficulty !== 'all' || searchQuery) && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setSelectedDifficulty('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Education Resources */}
          <div className="lg:col-span-2 space-y-6">
                        {/* Featured Resources */}
            <Card className="shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Book className="h-5 w-5 text-primary" />
                  <span>Learning Resources</span>
                  <Badge variant="secondary" className="ml-2">
                    {filteredResources.length} of {educationResources.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredResources.length === 0 ? (
                  <div className="text-center py-8">
                    <Book className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground mb-2">No resources found</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Try adjusting your search terms or filters
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('all');
                        setSelectedDifficulty('all');
                      }}
                    >
                      Clear all filters
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredResources.map((resource) => {
                      const TypeIcon = getTypeIcon(resource.type);
                      return (
                        <div key={resource.id} className="p-4 rounded-lg border border-border/30 bg-muted/20 hover:shadow-card transition-smooth">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <TypeIcon className="h-5 w-5 text-primary" />
                              <Badge className={getCategoryColor(resource.category)} variant="outline">
                                {resource.category}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge className={getDifficultyColor(resource.difficulty)} variant="secondary">
                                {resource.difficulty}
                              </Badge>
                            </div>
                          </div>
                          
                          <h3 className="font-semibold text-foreground mb-2">{resource.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{resource.description}</p>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">{resource.readTime}</span>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleResourceClick(resource)}
                              className="flex items-center space-x-2"
                            >
                              <Info className="h-4 w-4" />
                              <span>More Details</span>
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card className="shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <span>Frequently Asked Questions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="p-4 rounded-lg border border-border/30 bg-muted/20">
                    <h4 className="font-semibold text-foreground mb-2">{faq.question}</h4>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Quick Links & Categories */}
          <div className="space-y-6">
            {/* Categories */}
            <Card className="shadow-card border-border/50">
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div 
                  className="flex items-center justify-between p-3 rounded-lg bg-emergency/10 border border-emergency/20 cursor-pointer hover:bg-emergency/20 transition-smooth"
                  onClick={() => setSelectedCategory(selectedCategory === 'safety' ? 'all' : 'safety')}
                >
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-emergency" />
                    <span className="font-medium text-emergency">Safety Guides</span>
                  </div>
                  <Badge variant="secondary">12</Badge>
                </div>
                
                <div 
                  className="flex items-center justify-between p-3 rounded-lg bg-safe/10 border border-safe/20 cursor-pointer hover:bg-safe/20 transition-smooth"
                  onClick={() => setSelectedCategory(selectedCategory === 'environment' ? 'all' : 'environment')}
                >
                  <div className="flex items-center space-x-3">
                    <Trees className="h-5 w-5 text-safe" />
                    <span className="font-medium text-safe">Environment</span>
                  </div>
                  <Badge variant="secondary">8</Badge>
                </div>
                
                <div 
                  className="flex items-center justify-between p-3 rounded-lg bg-advisory/10 border border-advisory/20 cursor-pointer hover:bg-advisory/20 transition-smooth"
                  onClick={() => setSelectedCategory(selectedCategory === 'preparation' ? 'all' : 'preparation')}
                >
                  <div className="flex items-center space-x-3">
                    <Waves className="h-5 w-5 text-advisory" />
                    <span className="font-medium text-advisory">Preparation</span>
                  </div>
                  <Badge variant="secondary">15</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card className="shadow-card border-border/50">
              <CardHeader>
                <CardTitle>Quick Safety Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-sm font-medium text-primary">Always have an evacuation plan and practice it regularly with your family.</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/20">
                  <p className="text-sm font-medium text-secondary">Keep emergency supplies in waterproof containers above flood level.</p>
                </div>
                <div className="p-3 rounded-lg bg-safe/10 border border-safe/20">
                  <p className="text-sm font-medium text-safe">Follow official evacuation orders immediately - don't wait for conditions to worsen.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Resource Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              {selectedResource && (
                <>
                  {(() => {
                    const TypeIcon = getTypeIcon(selectedResource.type);
                    return <TypeIcon className="h-5 w-5 text-primary" />;
                  })()}
                  <span>{selectedResource?.title}</span>
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {selectedResource && (
            <div className="space-y-6">
              {/* Resource Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                {selectedResource.author && (
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{selectedResource.author}</span>
                  </div>
                )}
                {selectedResource.lastUpdated && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Updated: {selectedResource.lastUpdated}</span>
                  </div>
                )}
                {selectedResource.location && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{selectedResource.location}</span>
                  </div>
                )}
              </div>

              {/* Overview */}
              <div>
                <h4 className="font-semibold text-foreground mb-2 flex items-center space-x-2">
                  <Info className="h-4 w-4 text-primary" />
                  <span>Overview</span>
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selectedResource.detailedContent.overview}
                </p>
              </div>

              {/* Key Points */}
              <div>
                <h4 className="font-semibold text-foreground mb-3 flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Key Points</span>
                </h4>
                <ul className="space-y-2">
                  {selectedResource.detailedContent.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Steps (if available) */}
              {selectedResource.detailedContent.steps && (
                <div>
                  <h4 className="font-semibold text-foreground mb-3 flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-primary" />
                    <span>Step-by-Step Guide</span>
                  </h4>
                  <ol className="space-y-2">
                    {selectedResource.detailedContent.steps.map((step, index) => (
                      <li key={index} className="flex items-start space-x-3 text-sm text-muted-foreground">
                        <span className="bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                          {index + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Tips */}
              <div>
                <h4 className="font-semibold text-foreground mb-3 flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>Pro Tips</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedResource.detailedContent.tips.map((tip, index) => (
                    <div key={index} className="flex items-start space-x-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resources */}
              <div>
                <h4 className="font-semibold text-foreground mb-3 flex items-center space-x-2">
                  <Book className="h-4 w-4 text-primary" />
                  <span>Additional Resources</span>
                </h4>
                <div className="space-y-2">
                  {selectedResource.detailedContent.resources.map((resourceItem, index) => (
                    <div 
                      key={index} 
                      className="flex items-center space-x-2 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => {
                        toast({
                          title: "External Resource",
                          description: `Opening ${resourceItem} in a new tab...`,
                        });
                        // In a real app, you would open the actual URL
                        // For now, we'll just show a toast notification
                      }}
                    >
                      <ExternalLink className="h-4 w-4 text-primary" />
                      <span className="text-sm text-muted-foreground">{resourceItem}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related Topics */}
              <div>
                <h4 className="font-semibold text-foreground mb-3 flex items-center space-x-2">
                  <Waves className="h-4 w-4 text-primary" />
                  <span>Related Topics</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedResource.detailedContent.relatedTopics.map((topic, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="cursor-pointer hover:bg-primary/10"
                      onClick={() => {
                        setSearchQuery(topic);
                        setIsDialogOpen(false);
                      }}
                    >
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-border/30">
                <div className="flex items-center space-x-3">
                  <Button 
                    variant={savedResources.has(selectedResource.id) ? "default" : "outline"} 
                    size="sm" 
                    className="flex items-center space-x-2"
                    onClick={() => handleSaveResource(selectedResource.id)}
                  >
                    <Bookmark className="h-4 w-4" />
                    <span>{savedResources.has(selectedResource.id) ? 'Saved' : 'Save'}</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center space-x-2"
                    onClick={() => handleShareResource(selectedResource)}
                  >
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </Button>
                </div>
                <Button 
                  size="sm" 
                  className="flex items-center space-x-2"
                  onClick={() => handleDownloadResource(selectedResource)}
                >
                  <Download className="h-4 w-4" />
                  <span>Download Guide</span>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Education;