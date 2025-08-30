import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface SensorCardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: number;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'stable';
  status?: 'normal' | 'warning' | 'critical';
}

export const SensorCard: React.FC<SensorCardProps> = ({
  title,
  value,
  unit,
  change,
  icon: Icon,
  trend = 'stable',
  status = 'normal'
}) => {
  const trendColor = {
    up: change && change > 0 ? 'text-warning' : 'text-safe',
    down: change && change < 0 ? 'text-safe' : 'text-warning',
    stable: 'text-muted-foreground'
  };

  const statusColor = {
    normal: 'border-green-200 bg-green-50',
    warning: 'border-yellow-200 bg-yellow-50',
    critical: 'border-red-200 bg-red-50'
  };

  const statusTextColor = {
    normal: 'text-green-800',
    warning: 'text-yellow-800',
    critical: 'text-red-800'
  };

  return (
    <Card className={`shadow-card hover:shadow-ocean transition-smooth ${
      status !== 'normal' ? statusColor[status] : 'border-border/50'
    }`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className={`text-sm font-medium ${
          status !== 'normal' ? statusTextColor[status] : 'text-muted-foreground'
        }`}>
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 ${
          status !== 'normal' ? statusTextColor[status] : 'text-primary'
        }`} />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${
          status !== 'normal' ? statusTextColor[status] : 'text-foreground'
        }`}>
          {value}
          {unit && <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>}
        </div>
        {change !== undefined && (
          <p className={`text-xs mt-1 ${trendColor[trend]}`}>
            {change > 0 ? '+' : ''}{change}% from last hour
          </p>
        )}
        {status !== 'normal' && (
          <div className={`mt-2 px-2 py-1 rounded text-xs font-medium ${
            status === 'critical' ? 'bg-red-100 text-red-800' :
            status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {status.toUpperCase()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};