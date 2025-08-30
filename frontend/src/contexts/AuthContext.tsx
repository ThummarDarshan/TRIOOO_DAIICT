import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthState, authService, LoginCredentials, RegistrationData } from '@/lib/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegistrationData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
  });

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const user = authService.getCurrentUser();
        if (user) {
          setState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        } else {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const user = await authService.login(credentials);
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Login failed'
      }));
      throw error;
    }
  };

  const register = async (data: RegistrationData) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const user = await authService.register(data);
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Registration failed'
      }));
      throw error;
    }
  };

  const logout = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      await authService.logout();
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('Error during logout:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
