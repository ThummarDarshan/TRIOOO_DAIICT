import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Waves, 
  BarChart3, 
  AlertTriangle, 
  Brain, 
  FileText, 
  MapPin, 
  GraduationCap,
  User,
  LogOut,
  Shield,
  Building2,
  Leaf,
  Fish,
  Users,
  Satellite
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const getRoleIcon = (role: string) => {
  const roleIcons = {
    disaster_management: Shield,
    coastal_city_government: Building2,
    environmental_ngo: Leaf,
    fisherfolk: Fish,
    civil_defence_team: Users
  };
  return roleIcons[role as keyof typeof roleIcons] || User;
};

const getNavigationItems = (userRole?: string) => {
  const baseNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3, requiredPermission: 'canViewAllData' },
    { name: 'Alerts', href: '/alerts', icon: AlertTriangle, requiredPermission: 'canCreateAlerts' },
    { name: 'AI Predictions', href: '/predictions', icon: Brain, requiredPermission: 'canViewPredictions' },
    { name: 'Report Incident', href: '/reports', icon: FileText, requiredPermission: 'canCreateAlerts' },
    { name: 'Earthdata', href: '/earthdata', icon: Satellite, requiredPermission: 'canViewAllData' },
    { name: 'Resources', href: '/resources', icon: MapPin, requiredPermission: 'canViewAllData' },
    { name: 'Education', href: '/education', icon: GraduationCap, requiredPermission: 'canViewAllData' },
  ];

  if (!userRole) return baseNavigation;

  // Filter navigation based on user permissions
  return baseNavigation.filter(item => {
    // For now, show all items - you can implement permission-based filtering here
    return true;
  });
};

export const Navigation = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const navigation = getNavigationItems(user?.role);

  return (
    <nav className="bg-gradient-ocean shadow-ocean border-b border-border/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center px-2 py-2 text-primary-foreground">
              <Waves className="h-8 w-8 mr-3" />
              <span className="font-bold text-xl">SeaWatch Guardian</span>
            </Link>
          </div>
          
          {isAuthenticated ? (
            <div className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                
                return (
                  <Link key={item.name} to={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      size="sm"
                      className={cn(
                        "flex items-center space-x-2 transition-smooth",
                        isActive 
                          ? "bg-primary-foreground text-primary" 
                          : "text-primary-foreground hover:bg-primary-foreground/20"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Button>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-2">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/20">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="secondary" size="sm" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}

          <div className="flex items-center">
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/20">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-medium">
                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:block">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex items-center space-x-2">
                      {React.createElement(getRoleIcon(user.role), { className: 'h-4 w-4' })}
                      <span className="capitalize">{user.role.replace(/_/g, ' ')}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="md:hidden flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/20">
                    Sign In
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};