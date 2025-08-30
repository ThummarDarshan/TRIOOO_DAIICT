import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Users, 
  Anchor,
  Hospital,
  Home,
  Shield
} from 'lucide-react';

interface Resource {
  id: string;
  name: string;
  type: 'shelter' | 'hospital' | 'rescue' | 'coordination';
  location: string;
  contact: string;
  capacity?: number;
  availability: 'available' | 'busy' | 'full';
  hours?: string;
  coordinates: { lat: number; lng: number };
}

const mockResources: Resource[] = [
  {
    id: '1',
    name: 'Central Emergency Shelter',
    type: 'shelter',
    location: 'Main Street Community Center',
    contact: '+1-555-0101',
    capacity: 250,
    availability: 'available',
    hours: '24/7',
    coordinates: { lat: 12.9716, lng: 77.5946 }
  },
  {
    id: '2',
    name: 'Coastal General Hospital',
    type: 'hospital',
    location: '123 Harbor Drive',
    contact: '+1-555-0202',
    availability: 'busy',
    hours: '24/7',
    coordinates: { lat: 12.9716, lng: 77.5946 }
  },
  {
    id: '3',
    name: 'Marine Rescue Station Alpha',
    type: 'rescue',
    location: 'Port Authority Building',
    contact: '+1-555-0303',
    availability: 'available',
    hours: '24/7',
    coordinates: { lat: 12.9716, lng: 77.5946 }
  },
  {
    id: '4',
    name: 'Emergency Coordination Center',
    type: 'coordination',
    location: 'City Hall, 5th Floor',
    contact: '+1-555-0404',
    availability: 'available',
    hours: '24/7',
    coordinates: { lat: 12.9716, lng: 77.5946 }
  },
  {
    id: '5',
    name: 'Beachside Community Shelter',
    type: 'shelter',
    location: 'Oceanview Elementary School',
    contact: '+1-555-0505',
    capacity: 150,
    availability: 'full',
    hours: '24/7',
    coordinates: { lat: 12.9716, lng: 77.5946 }
  },
  {
    id: '6',
    name: 'Harbor Medical Center',
    type: 'hospital',
    location: '456 Coastal Highway',
    contact: '+1-555-0606',
    availability: 'available',
    hours: '24/7',
    coordinates: { lat: 12.9716, lng: 77.5946 }
  }
];

const getResourceIcon = (type: string) => {
  switch (type) {
    case 'shelter': return Home;
    case 'hospital': return Hospital;
    case 'rescue': return Anchor;
    case 'coordination': return Shield;
    default: return MapPin;
  }
};

const getAvailabilityColor = (availability: string) => {
  switch (availability) {
    case 'available': return 'bg-safe text-safe-foreground';
    case 'busy': return 'bg-advisory text-advisory-foreground';
    case 'full': return 'bg-warning text-warning-foreground';
    default: return 'bg-muted text-muted-foreground';
  }
};

const getResourceTypeLabel = (type: string) => {
  switch (type) {
    case 'shelter': return 'Emergency Shelter';
    case 'hospital': return 'Medical Facility';
    case 'rescue': return 'Rescue Station';
    case 'coordination': return 'Coordination Center';
    default: return type;
  }
};

const Resources = () => {
  const groupedResources = mockResources.reduce((acc, resource) => {
    if (!acc[resource.type]) {
      acc[resource.type] = [];
    }
    acc[resource.type].push(resource);
    return acc;
  }, {} as Record<string, Resource[]>);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Emergency Resources</h1>
          <p className="text-muted-foreground">Locate shelters, medical facilities, and emergency services</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Resources Map */}
          <Card className="lg:col-span-2 shadow-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span>Resource Locations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MapPin className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Interactive resource map will be displayed here</p>
                  <p className="text-sm">Real-time availability and navigation to emergency resources</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Contact */}
          <Card className="shadow-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-primary" />
                <span>Emergency Contacts</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 rounded-lg bg-emergency/10 border border-emergency/20">
                <h4 className="font-semibold text-emergency mb-1">Emergency Services</h4>
                <p className="text-2xl font-bold text-emergency">911</p>
              </div>
              <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                <h4 className="font-semibold text-warning mb-1">Coastal Guard</h4>
                <p className="text-lg font-bold text-warning">+1-555-COAST</p>
              </div>
              <div className="p-3 rounded-lg bg-advisory/10 border border-advisory/20">
                <h4 className="font-semibold text-advisory mb-1">Disaster Hotline</h4>
                <p className="text-lg font-bold text-advisory">+1-555-HELP</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resource Listings */}
        <div className="mt-6 space-y-6">
          {Object.entries(groupedResources).map(([type, resources]) => {
            const Icon = getResourceIcon(type);
            return (
              <Card key={type} className="shadow-card border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <span>{getResourceTypeLabel(type)}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {resources.map((resource) => (
                      <div key={resource.id} className="p-4 rounded-lg border border-border/30 bg-muted/20">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-foreground">{resource.name}</h4>
                          <Badge className={getAvailabilityColor(resource.availability)}>
                            {resource.availability}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span>{resource.location}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4" />
                            <span>{resource.contact}</span>
                          </div>

                          {resource.hours && (
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4" />
                              <span>{resource.hours}</span>
                            </div>
                          )}

                          {resource.capacity && (
                            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4" />
                              <span>Capacity: {resource.capacity} people</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Resources;