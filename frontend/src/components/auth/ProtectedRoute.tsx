import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredPermissions = [] 
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required permissions
  if (requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every(permission => 
      user.permissions[permission as keyof typeof user.permissions]
    );

    if (!hasAllPermissions) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="p-4 rounded-full bg-red-100 mx-auto w-16 h-16 flex items-center justify-center">
              <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
            <p className="text-gray-600 max-w-md mx-auto">
              You don't have the required permissions to access this page. 
              Please contact your administrator if you believe this is an error.
            </p>
            <div className="text-sm text-gray-500">
              Required permissions: {requiredPermissions.join(', ')}
            </div>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
