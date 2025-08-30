import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertBadge } from '@/components/ui/alert-badge';
import { Switch } from '@/components/ui/switch';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Settings
} from 'lucide-react';

interface AlertItem {
  id: string;
  type: 'safe' | 'advisory' | 'warning' | 'emergency';
  title: string;
  message: string;
  timestamp: string;
  location: string;
  category: string;
}

const mockAlerts: AlertItem[] = [
  {
    id: '1',
    type: 'emergency',
    title: 'Tsunami Warning',
    message: 'Seismic activity detected. Immediate evacuation recommended for coastal areas below 5m elevation.',
    timestamp: '5 minutes ago',
    location: 'All coastal sectors',
    category: 'Tsunami'
  },
  {
    id: '2',
    type: 'warning',
    title: 'High Tide Alert',
    message: 'Exceptional tide levels expected. Risk of coastal flooding in low-lying areas.',
    timestamp: '15 minutes ago',
    location: 'Sectors A-1, A-2, B-3',
    category: 'Tidal'
  },
  {
    id: '3',
    type: 'advisory',
    title: 'Cyclone Watch',
    message: 'Tropical cyclone forming 200km offshore. Monitor weather conditions.',
    timestamp: '1 hour ago',
    location: 'Eastern coastal regions',
    category: 'Weather'
  },
  {
    id: '4',
    type: 'warning',
    title: 'Pollution Alert',
    message: 'Elevated pollution levels detected. Avoid water contact and fishing activities.',
    timestamp: '2 hours ago',
    location: 'Sector C-4',
    category: 'Environmental'
  },
  {
    id: '5',
    type: 'safe',
    title: 'All Clear',
    message: 'Weather conditions have improved. Normal activities can resume.',
    timestamp: '4 hours ago',
    location: 'Sector D-1',
    category: 'Weather'
  }
];

const alertIcons = {
  safe: CheckCircle,
  advisory: AlertCircle,
  warning: AlertTriangle,
  emergency: XCircle
};

const Alerts = () => {
  const [notifications, setNotifications] = useState({
    sms: true,
    email: true,
    push: true,
    tsunami: true,
    cyclone: true,
    pollution: false,
    tidal: true
  });

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Alert Center</h1>
          <p className="text-muted-foreground">Monitor active alerts and manage notification preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Alerts */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-primary" />
                  <span>Active Alerts</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockAlerts.map((alert) => {
                  const Icon = alertIcons[alert.type];
                  return (
                    <div 
                      key={alert.id} 
                      className="p-4 rounded-lg border border-border/50 bg-card hover:shadow-card transition-smooth"
                    >
                      <div className="flex items-start space-x-3">
                        <Icon className={`h-6 w-6 mt-1 ${
                          alert.type === 'emergency' ? 'text-emergency' :
                          alert.type === 'warning' ? 'text-warning' :
                          alert.type === 'advisory' ? 'text-advisory' : 'text-safe'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-foreground">{alert.title}</h3>
                            <AlertBadge variant={alert.type} />
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{alert.message}</p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{alert.timestamp}</span>
                            <span>{alert.location}</span>
                            <span className="px-2 py-1 bg-muted rounded-sm">{alert.category}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Notification Settings */}
          <div className="space-y-6">
            <Card className="shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-primary" />
                  <span>Notification Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Delivery Methods */}
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-3">Delivery Methods</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">SMS Alerts</span>
                      </div>
                      <Switch 
                        checked={notifications.sms}
                        onCheckedChange={(checked) => handleNotificationChange('sms', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">Email Alerts</span>
                      </div>
                      <Switch 
                        checked={notifications.email}
                        onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Bell className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">Push Notifications</span>
                      </div>
                      <Switch 
                        checked={notifications.push}
                        onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                      />
                    </div>
                  </div>
                </div>

                {/* Alert Categories */}
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-3">Alert Categories</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">Tsunami Alerts</span>
                      <Switch 
                        checked={notifications.tsunami}
                        onCheckedChange={(checked) => handleNotificationChange('tsunami', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">Cyclone Alerts</span>
                      <Switch 
                        checked={notifications.cyclone}
                        onCheckedChange={(checked) => handleNotificationChange('cyclone', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">Pollution Alerts</span>
                      <Switch 
                        checked={notifications.pollution}
                        onCheckedChange={(checked) => handleNotificationChange('pollution', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">Tidal Alerts</span>
                      <Switch 
                        checked={notifications.tidal}
                        onCheckedChange={(checked) => handleNotificationChange('tidal', checked)}
                      />
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alerts;