import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { loginSchema, type LoginCredentials } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Shield, Waves, Fish, Leaf, Building2, Users } from 'lucide-react';

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginCredentials) => {
    setIsSubmitting(true);
    clearError();
    
    try {
      await login(data);
      navigate('/dashboard');
    } catch (error) {
      // Error is handled by the auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleIcons = {
    disaster_management: Shield,
    coastal_city_government: Building2,
    environmental_ngo: Leaf,
    fisherfolk: Fish,
    civil_defence_team: Users
  };

  const roleDescriptions = {
    disaster_management: 'Full system access for emergency coordination',
    coastal_city_government: 'Local government coastal management',
    environmental_ngo: 'Environmental monitoring and reporting',
    fisherfolk: 'Fishing safety and weather alerts',
    civil_defence_team: 'Emergency response coordination'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2 text-blue-600">
            <Waves className="h-8 w-8" />
            <h1 className="text-2xl font-bold">SeaWatch Guardian</h1>
          </div>
          <p className="text-gray-600">Coastal Threat Alert System</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Sign in to access your coastal monitoring dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register('email')}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    {...register('password')}
                    className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-500">Demo Credentials:</p>
              <div className="text-xs text-gray-400 space-y-1">
                <p>Admin: admin@disaster.gov / password123</p>
                <p>Mayor: mayor@mumbai.gov / password123</p>
              </div>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or</span>
              </div>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
                >
                  Register here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Role Information */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg text-center">User Categories</CardTitle>
            <CardDescription className="text-center">
              Different access levels for coastal stakeholders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              {Object.entries(roleIcons).map(([role, Icon]) => {
                const IconComponent = Icon;
                return (
                  <div
                    key={role}
                    className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <IconComponent className="h-5 w-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="font-medium text-sm capitalize">
                        {role.replace(/_/g, ' ')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {roleDescriptions[role as keyof typeof roleDescriptions]}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
