import { useState, useEffect, createContext, useContext } from 'react';
import toast from 'react-hot-toast';
import { authService } from '../services/auth';
import { handleApiError } from '../utils/errorHandler';
import useUserStore from '../stores/userStore';

// Create Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const { user, isAuthenticated, isLoading, setUser, clearUser, setLoading } =
    useUserStore();
  const [initLoading, setInitLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = authService.getToken();

        if (token) {
          // Token exists, verify user with API
          setLoading(true);
          try {
            const { user: userData } = await authService.verifyUser();
            // User data is already set in Zustand store by verifyUser
          } catch (error) {
            // Token is invalid, clear everything
            console.error('Token verification failed:', error);
            authService.logout();
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        authService.logout();
      } finally {
        setLoading(false);
        setInitLoading(false);
      }
    };

    initializeAuth();
  }, []); // Only run once on mount

  // Separate useEffect for unauthorized event listener
  useEffect(() => {
    const handleUnauthorized = () => {
      clearUser();
      toast.error('Your session has expired. Please log in again.');
    };

    // Add event listener for unauthorized access
    window.addEventListener('auth:unauthorized', handleUnauthorized);

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []); // Only set up once

  // Login function
  const login = async credentials => {
    try {
      setLoading(true);
      const { token, user: userData } = await authService.login(credentials);
      // User data is already set in Zustand store by authService.login

      toast.success(`Welcome back, ${userData.name}!`);
      return { success: true, user: userData };
    } catch (error) {
      const errorMessage = handleApiError(error, 'Login failed');
      return {
        success: false,
        error: errorMessage,
        validationErrors: error.data?.errors || null,
        status: error.status,
      };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async userData => {
    try {
      setLoading(true);
      const { token, user: newUser } = await authService.register(userData);
      // User data is already set in Zustand store by authService.register

      toast.success(`Welcome to Social Downloader, ${newUser.name}!`);
      return { success: true, user: newUser };
    } catch (error) {
      const errorMessage = handleApiError(error, 'Registration failed');
      return {
        success: false,
        error: errorMessage,
        validationErrors: error.data?.errors || null,
        status: error.status,
      };
    } finally {
      setLoading(false);
    }
  };

  // Forgot password function
  const forgotPassword = async email => {
    try {
      setLoading(true);
      const response = await authService.forgotPassword(email);

      const successMessage = response.message || 'Password reset email sent';
      toast.success(successMessage);
      return {
        success: true,
        message: successMessage,
      };
    } catch (error) {
      const errorMessage = handleApiError(error, 'Failed to send reset email');
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  // Verify user function
  const verify = async () => {
    try {
      setLoading(true);
      const { user: userData } = await authService.verifyUser();
      // User data is already set in Zustand store by authService.verifyUser

      return { success: true, user: userData };
    } catch (error) {
      // Clear all authentication data
      authService.logout();

      const errorMessage = handleApiError(error, 'User verification failed');
      toast.error('Session expired. Please login again.');

      return {
        success: false,
        error: errorMessage,
        shouldRedirect: true,
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      // User data is already cleared from Zustand store by authService.logout

      toast.success('Logged out successfully');
      return { success: true };
    } catch (error) {
      // Still clear local state even if API call fails
      authService.logout(); // This will clear the Zustand store

      toast.success('Logged out successfully');
      return {
        success: true,
        warning: 'Logged out locally, but server logout may have failed',
      };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading: isLoading || initLoading,
    login,
    register,
    forgotPassword,
    verify,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
