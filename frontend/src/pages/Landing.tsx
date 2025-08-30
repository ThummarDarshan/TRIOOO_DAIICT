import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Waves, 
  Shield, 
  Building2, 
  Leaf, 
  Fish, 
  Users, 
  AlertTriangle, 
  BarChart3, 
  Brain, 
  Globe,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const Landing: React.FC = () => {
  const features = [
    {
      icon: AlertTriangle,
      title: 'Real-time Alerts',
      description: 'Instant notifications for coastal threats and emergencies'
    },
    {
      icon: BarChart3,
      title: 'Advanced Monitoring',
      description: 'Comprehensive coastal data from multiple sensors and sources'
    },
    {
      icon: Brain,
      title: 'AI Predictions',
      description: 'Machine learning-powered forecasts for coastal conditions'
    },
    {
      icon: Globe,
      title: 'Global Coverage',
      description: 'Monitor coastal areas worldwide with real-time data'
    }
  ];

  const userCategories = [
    {
      icon: Shield,
      title: 'Disaster Management Departments',
      description: 'Full system access for emergency coordination and response',
      features: ['Emergency broadcasts', 'User management', 'System configuration', 'Advanced analytics']
    },
    {
      icon: Building2,
      title: 'Coastal City Governments',
      description: 'Local government coastal management and policy tools',
      features: ['Alert management', 'Emergency coordination', 'Policy planning', 'Public communication']
    },
    {
      icon: Leaf,
      title: 'Environmental NGOs',
      description: 'Environmental monitoring, research, and advocacy tools',
      features: ['Environmental data', 'Incident reporting', 'Research tools', 'Community alerts']
    },
    {
      icon: Fish,
      title: 'Fisherfolk',
      description: 'Fishing community safety and weather alerts',
      features: ['Safety alerts', 'Weather predictions', 'Emergency notifications', 'Basic monitoring']
    },
    {
      icon: Users,
      title: 'Civil Defence Teams',
      description: 'Emergency response coordination and public safety',
      features: ['Emergency response', 'Coordination tools', 'Public safety alerts', 'Resource management']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-8">
              <Waves className="h-16 w-16 text-blue-600" />
              <h1 className="text-5xl font-bold text-gray-900">SeaWatch Guardian</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Advanced coastal threat alert system providing real-time monitoring, AI-powered predictions, 
              and emergency coordination for coastal communities worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 to-cyan-100/20" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comprehensive Coastal Protection
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our system provides cutting-edge technology to monitor, predict, and respond to coastal threats
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="mx-auto p-3 rounded-full bg-blue-100 w-16 h-16 flex items-center justify-center mb-4">
                    <feature.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* User Categories Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Designed for Coastal Stakeholders
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Different access levels tailored to your specific role and responsibilities
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {userCategories.map((category, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-full bg-blue-100">
                      <category.icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{category.title}</CardTitle>
                      <CardDescription className="text-base">{category.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {category.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Protect Your Coastal Community?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of coastal stakeholders already using SeaWatch Guardian to monitor and protect their communities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                Create Free Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-blue-600">
                Sign In to Existing Account
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Waves className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">SeaWatch Guardian</span>
            </div>
            <p className="text-gray-400 mb-4">
              Advanced coastal threat alert system for global coastal protection
            </p>
            <div className="text-sm text-gray-500">
              © 2024 SeaWatch Guardian. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
