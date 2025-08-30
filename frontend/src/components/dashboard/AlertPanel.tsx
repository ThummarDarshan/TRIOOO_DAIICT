import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, AlertCircle, XCircle, Clock, MapPin } from 'lucide-react';
import { useAlerts } from '@/hooks/use-coastal-data';

const alertIcons = {
  storm_surge: AlertTriangle,
  coastal_erosion: XCircle,
  water_pollution: AlertCircle,
  illegal_activity: XCircle,
  algal_bloom: AlertCircle
};

const severityColors = {
  low: 'bg-blue-100 text-blue-800 border-blue-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  critical: 'bg-red-100 text-red-800 border-red-200'
};

export const AlertPanel = () => {
  const { data: alerts, isLoading } = useAlerts();

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - alertTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getAlertTitle = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (isLoading) {
    return (
      <Card className="shadow-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            <span>Active Alerts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-4">
            Loading alerts...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!alerts || alerts.length === 0) {
    return (
      <Card className="shadow-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span>Active Alerts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-green-600 py-4">
            <CheckCircle className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm">No active alerts</p>
            <p className="text-xs text-muted-foreground">All systems operating normally</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-primary" />
          <span>Active Alerts ({alerts.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.slice(0, 3).map((alert) => {
          const Icon = alertIcons[alert.type as keyof typeof alertIcons] || AlertTriangle;
          return (
            <div key={alert.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30 border border-border/30">
              <Icon className="h-5 w-5 mt-0.5 text-primary" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-foreground">
                    {getAlertTitle(alert.type)}
                  </h4>
                  <Badge className={severityColors[alert.severity]}>
                    {alert.severity}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatTimeAgo(alert.timestamp)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>{alert.location.name}</span>
                  </div>
                </div>
                {alert.recommendations.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-border/30">
                    <p className="text-xs font-medium text-foreground mb-1">Recommendations:</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {alert.recommendations.slice(0, 2).map((rec, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-primary">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {alerts.length > 3 && (
          <div className="text-center text-sm text-muted-foreground py-2">
            +{alerts.length - 3} more alerts
          </div>
        )}
      </CardContent>
    </Card>
  );
};