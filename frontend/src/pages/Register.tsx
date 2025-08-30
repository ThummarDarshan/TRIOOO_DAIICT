import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { registrationSchema, type RegistrationData, USER_ROLES } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff, Waves, Shield, Building2, Leaf, Fish, Users, CheckCircle } from 'lucide-react';

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register: registerUser, error, clearError } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<RegistrationData>({
    resolver: zodResolver(registrationSchema)
  });

  const onSubmit = async (data: RegistrationData) => {
    setIsSubmitting(true);
    clearError();
    
    try {
      await registerUser(data);
      navigate('/dashboard');
    } catch (error) {
      // Error is handled by the auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleIcons = {
    [USER_ROLES.DISASTER_MANAGEMENT]: Shield,
    [USER_ROLES.COASTAL_CITY_GOVERNMENT]: Building2,
    [USER_ROLES.ENVIRONMENTAL_NGO]: Leaf,
    [USER_ROLES.FISHERFOLK]: Fish,
    [USER_ROLES.CIVIL_DEFENCE_TEAM]: Users
  };

  const roleDescriptions = {
    [USER_ROLES.DISASTER_MANAGEMENT]: 'Full system access for emergency coordination and response',
    [USER_ROLES.COASTAL_CITY_GOVERNMENT]: 'Local government coastal management and policy',
    [USER_ROLES.ENVIRONMENTAL_NGO]: 'Environmental monitoring, research, and advocacy',
    [USER_ROLES.FISHERFOLK]: 'Fishing community safety and weather alerts',
    [USER_ROLES.CIVIL_DEFENCE_TEAM]: 'Emergency response coordination and public safety'
  };

  const roleFeatures = {
    [USER_ROLES.DISASTER_MANAGEMENT]: [
      'Full system access',
      'User management',
      'Emergency broadcasts',
      'Advanced analytics',
      'System configuration'
    ],
    [USER_ROLES.COASTAL_CITY_GOVERNMENT]: [
      'Coastal monitoring data',
      'Alert management',
      'Emergency coordination',
      'Public communication',
      'Policy planning tools'
    ],
    [USER_ROLES.ENVIRONMENTAL_NGO]: [
      'Environmental data access',
      'Incident reporting',
      'Research tools',
      'Community alerts',
      'Data analysis'
    ],
    [USER_ROLES.FISHERFOLK]: [
      'Safety alerts',
      'Weather predictions',
      'Emergency notifications',
      'Basic monitoring data',
      'Community updates'
    ],
    [USER_ROLES.CIVIL_DEFENCE_TEAM]: [
      'Emergency response tools',
      'Coordination features',
      'Public safety alerts',
      'Resource management',
      'Response planning'
    ]
  };

  const selectedRole = watch('role');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2 text-blue-600">
            <Waves className="h-8 w-8" />
            <h1 className="text-2xl font-bold">SeaWatch Guardian</h1>
          </div>
          <p className="text-gray-600">Join the Coastal Threat Alert System</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Registration Form */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Create Account</CardTitle>
              <CardDescription className="text-center">
                Register to access coastal monitoring features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Error Alert */}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Registration Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Personal Information */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    {...register('name')}
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
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
                  <Label htmlFor="organization">Organization</Label>
                  <Input
                    id="organization"
                    placeholder="Enter organization name"
                    {...register('organization')}
                    className={errors.organization ? 'border-red-500' : ''}
                  />
                  {errors.organization && (
                    <p className="text-sm text-red-500">{errors.organization.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">User Category</Label>
                  <Select
                    onValueChange={(value) => setValue('role', value as any)}
                    defaultValue={selectedRole}
                  >
                    <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(USER_ROLES).map(([key, value]) => {
                        const Icon = roleIcons[value];
                        return (
                          <SelectItem key={value} value={value}>
                            <div className="flex items-center space-x-2">
                              <Icon className="h-4 w-4" />
                              <span className="capitalize">{key.replace(/_/g, ' ')}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  {errors.role && (
                    <p className="text-sm text-red-500">{errors.role.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number (Optional)</Label>
                  <Input
                    id="phone"
                    placeholder="Enter phone number"
                    {...register('phone')}
                  />
                </div>

                {/* Location Information */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="City"
                      {...register('city')}
                      className={errors.city ? 'border-red-500' : ''}
                    />
                    {errors.city && (
                      <p className="text-sm text-red-500">{errors.city.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      placeholder="State"
                      {...register('state')}
                      className={errors.state ? 'border-red-500' : ''}
                    />
                    {errors.state && (
                      <p className="text-sm text-red-500">{errors.state.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      placeholder="Country"
                      {...register('country')}
                      className={errors.country ? 'border-red-500' : ''}
                    />
                    {errors.country && (
                      <p className="text-sm text-red-500">{errors.country.message}</p>
                    )}
                  </div>
                </div>

                {/* Password Fields */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a password"
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

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      {...register('confirmPassword')}
                      className={errors.confirmPassword ? 'border-red-500 pr-10' : 'pr-10'}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>

              {/* Login Link */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Role Information */}
          <div className="space-y-6">
            {/* Selected Role Details */}
            {selectedRole && (
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    {React.createElement(roleIcons[selectedRole], { className: 'h-6 w-6 text-blue-600' })}
                    <div>
                      <CardTitle className="text-lg capitalize">
                        {selectedRole.replace(/_/g, ' ')}
                      </CardTitle>
                      <CardDescription>
                        {roleDescriptions[selectedRole]}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-gray-700">Features included:</h4>
                    <div className="space-y-2">
                      {roleFeatures[selectedRole].map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* All Roles Overview */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">All User Categories</CardTitle>
                <CardDescription>
                  Choose the category that best describes your role
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(USER_ROLES).map(([key, value]) => {
                    const Icon = roleIcons[value];
                    return (
                      <div
                        key={value}
                        className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                          selectedRole === value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setValue('role', value)}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="h-5 w-5 text-blue-600" />
                          <div className="flex-1">
                            <p className="font-medium text-sm capitalize">
                              {key.replace(/_/g, ' ')}
                            </p>
                            <p className="text-xs text-gray-500">
                              {roleDescriptions[value]}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
