import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Building2, 
  Leaf, 
  Fish, 
  Users, 
  Waves, 
  AlertTriangle, 
  BarChart3, 
  Settings, 
  UserCheck,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Globe,
  Activity,
  Bell,
  Database,
  Users as UsersIcon,
  Radio
} from 'lucide-react';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Not Authenticated</h1>
          <p className="text-gray-600 mt-2">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  const roleIcons = {
    disaster_management: Shield,
    coastal_city_government: Building2,
    environmental_ngo: Leaf,
    fisherfolk: Fish,
    civil_defence_team: Users
  };

  const roleColors = {
    disaster_management: 'bg-red-100 text-red-800 border-red-200',
    coastal_city_government: 'bg-blue-100 text-blue-800 border-blue-200',
    environmental_ngo: 'bg-green-100 text-green-800 border-green-200',
    fisherfolk: 'bg-orange-100 text-orange-800 border-orange-200',
    civil_defence_team: 'bg-purple-100 text-purple-800 border-purple-200'
  };

  const Icon = roleIcons[user.role];
  const roleColor = roleColors[user.role];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleSpecificFeatures = () => {
    switch (user.role) {
             case 'disaster_management':
         return [
           { icon: Radio, title: 'Emergency Broadcasts', description: 'Send system-wide emergency alerts' },
          { icon: UsersIcon, title: 'User Management', description: 'Manage all system users and permissions' },
          { icon: Settings, title: 'System Configuration', description: 'Configure system-wide settings' },
          { icon: Database, title: 'Data Management', description: 'Full access to all system data' }
        ];
      case 'coastal_city_government':
        return [
          { icon: Bell, title: 'Alert Management', description: 'Create and manage local alerts' },
          { icon: Users, title: 'Emergency Coordination', description: 'Coordinate with local emergency services' },
          { icon: BarChart3, title: 'Policy Planning', description: 'Access planning and policy tools' },
          { icon: Globe, title: 'Public Communication', description: 'Communicate with local communities' }
        ];
      case 'environmental_ngo':
        return [
          { icon: Leaf, title: 'Environmental Monitoring', description: 'Access environmental data and reports' },
          { icon: AlertTriangle, title: 'Incident Reporting', description: 'Report environmental incidents' },
          { icon: BarChart3, title: 'Research Tools', description: 'Access research and analysis tools' },
          { icon: Users, title: 'Community Alerts', description: 'Send alerts to local communities' }
        ];
      case 'fisherfolk':
        return [
          { icon: Fish, title: 'Safety Alerts', description: 'Receive fishing safety notifications' },
          { icon: Waves, title: 'Weather Predictions', description: 'Access weather and sea condition forecasts' },
          { icon: Bell, title: 'Emergency Notifications', description: 'Receive emergency alerts' },
          { icon: Activity, title: 'Basic Monitoring', description: 'View basic coastal monitoring data' }
        ];
      case 'civil_defence_team':
        return [
          { icon: Shield, title: 'Emergency Response', description: 'Access emergency response tools' },
          { icon: Users, title: 'Coordination Features', description: 'Coordinate with other emergency services' },
          { icon: Bell, title: 'Public Safety Alerts', description: 'Send public safety notifications' },
          { icon: BarChart3, title: 'Resource Management', description: 'Manage emergency response resources' }
        ];
      default:
        return [];
    }
  };

  const getRoleSpecificStats = () => {
    switch (user.role) {
      case 'disaster_management':
        return [
          { label: 'Total Users', value: '1,247', change: '+12%', changeType: 'positive' },
          { label: 'Active Alerts', value: '23', change: '-5%', changeType: 'negative' },
          { label: 'Emergency Broadcasts', value: '7', change: '+2', changeType: 'positive' },
          { label: 'System Uptime', value: '99.9%', change: '+0.1%', changeType: 'positive' }
        ];
      case 'coastal_city_government':
        return [
          { label: 'Local Alerts', value: '15', change: '+3', changeType: 'positive' },
          { label: 'Emergency Calls', value: '42', change: '-8%', changeType: 'negative' },
          { label: 'Community Updates', value: '28', change: '+5', changeType: 'positive' },
          { label: 'Response Time', value: '4.2min', change: '-0.8min', changeType: 'positive' }
        ];
      case 'environmental_ngo':
        return [
          { label: 'Incidents Reported', value: '34', change: '+7', changeType: 'positive' },
          { label: 'Research Reports', value: '12', change: '+2', changeType: 'positive' },
          { label: 'Community Alerts', value: '19', change: '+4', changeType: 'positive' },
          { label: 'Data Access', value: '98%', change: '+2%', changeType: 'positive' }
        ];
      case 'fisherfolk':
        return [
          { label: 'Safety Alerts', value: '8', change: '+2', changeType: 'positive' },
          { label: 'Weather Checks', value: '156', change: '+23', changeType: 'positive' },
          { label: 'Emergency Calls', value: '3', change: '-1', changeType: 'negative' },
          { label: 'App Usage', value: '2.4hrs', change: '+0.3hrs', changeType: 'positive' }
        ];
      case 'civil_defence_team':
        return [
          { label: 'Emergency Responses', value: '18', change: '+3', changeType: 'positive' },
          { label: 'Coordination Events', value: '31', change: '+6', changeType: 'positive' },
          { label: 'Public Alerts', value: '25', change: '+4', changeType: 'positive' },
          { label: 'Response Time', value: '3.8min', change: '-0.5min', changeType: 'positive' }
        ];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
            <p className="text-gray-600 mt-1">Manage your account and view role-specific features</p>
          </div>
          <Button variant="outline" onClick={logout}>
            Sign Out
          </Button>
        </div>

        {/* Profile Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-blue-100">
                <Icon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl">{user.name}</CardTitle>
                <CardDescription className="text-lg">
                  {user.organization}
                </CardDescription>
              </div>
              <Badge className={`text-sm px-4 py-2 border ${roleColor}`}>
                <Icon className="h-4 w-4 mr-2" />
                {user.role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                <Mail className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>
              {user.phone && (
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-gray-600">{user.phone}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                <MapPin className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-gray-600">
                    {user.location?.city}, {user.location?.state}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Member Since</p>
                  <p className="text-sm text-gray-600">
                    {formatDate(user.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="features">Role Features</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Account Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <UserCheck className="h-5 w-5" />
                    <span>Account Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Account Status</span>
                      <Badge variant={user.isActive ? 'default' : 'secondary'}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Last Login</span>
                      <span className="text-sm font-medium">
                        {formatDate(user.lastLogin)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Account Created</span>
                      <span className="text-sm font-medium">
                        {formatDate(user.createdAt)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Role Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Icon className="h-5 w-5" />
                    <span>Role Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                      As a {user.role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}, 
                      you have access to specialized tools and features designed for your specific responsibilities 
                      in coastal monitoring and emergency response.
                    </p>
                    <Separator />
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">Key Responsibilities:</p>
                      <ul className="mt-2 space-y-1 text-gray-600">
                        {getRoleSpecificFeatures().slice(0, 3).map((feature, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <feature.icon className="h-4 w-4 text-blue-500" />
                            <span>{feature.title}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Role Features Tab */}
          <TabsContent value="features" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Features</CardTitle>
                <CardDescription>
                  Tools and capabilities available to your user category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getRoleSpecificFeatures().map((feature, index) => (
                    <div key={index} className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 rounded-lg bg-blue-100">
                          <feature.icon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{feature.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="stats" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Role Statistics</CardTitle>
                <CardDescription>
                  Performance metrics and usage statistics for your role
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {getRoleSpecificStats().map((stat, index) => (
                    <div key={index} className="p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                        <div className={`text-sm font-medium ${
                          stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stat.change}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Permissions Tab */}
          <TabsContent value="permissions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Permissions</CardTitle>
                <CardDescription>
                  Detailed breakdown of your access rights and capabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(user.permissions).map(([permission, hasAccess]) => (
                    <div key={permission} className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${
                          hasAccess ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          {hasAccess ? (
                            <UserCheck className="h-4 w-4 text-green-600" />
                          ) : (
                            <UserCheck className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 capitalize">
                            {permission.replace(/([A-Z])/g, ' $1').toLowerCase()}
                          </p>
                          <p className="text-sm text-gray-600">
                            {hasAccess ? 'Full access granted' : 'Access restricted'}
                          </p>
                        </div>
                      </div>
                      <Badge variant={hasAccess ? 'default' : 'secondary'}>
                        {hasAccess ? 'Allowed' : 'Restricted'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
