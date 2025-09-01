import http from '../utils/http';
import { handleApiError } from '../utils/errorHandler';
import useUserStore from '../stores/userStore';

// Authentication service functions
export const authService = {
  // Login user
  async login(credentials) {
    try {
      const formData = new FormData();
      formData.append('email', credentials.email);
      formData.append('password', credentials.password);

      const response = await http.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { token, user } = response.data.data;

      // Store token in localStorage and user data in Zustand store
      localStorage.setItem('auth_token', token);
      useUserStore.getState().setUser(user);

      return { token, user };
    } catch (error) {
      throw error;
    }
  },

  // Register new user
  async register(userData) {
    try {
      const formData = new FormData();
      formData.append('name', userData.name);
      formData.append('email', userData.email);
      formData.append('password', userData.password);
      formData.append('password_confirmation', userData.confirmPassword);

      const response = await http.post('/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { token, user } = response.data;

      // Store token in localStorage and user data in Zustand store
      localStorage.setItem('auth_token', token);
      useUserStore.getState().setUser(user);

      return { token, user };
    } catch (error) {
      throw error;
    }
  },

  // Forgot password
  async forgotPassword(email) {
    try {
      const formData = new FormData();
      formData.append('email', email);

      const response = await http.post('/auth/forgot-password', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Logout user
  async logout() {
    try {
      // Call logout endpoint if available
      await http.post('/auth/logout');
    } catch (error) {
      // Continue with local logout even if API call fails
      console.warn('Logout API call failed:', error);
    } finally {
      // Always clear token from localStorage and user data from Zustand store
      localStorage.removeItem('auth_token');
      useUserStore.getState().clearUser();
    }
  },

  // Get current user from Zustand store
  getCurrentUser() {
    return useUserStore.getState().getUser();
  },

  // Get current token
  getToken() {
    return localStorage.getItem('auth_token');
  },

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getToken();
    const isAuthenticated = useUserStore.getState().getIsAuthenticated();
    return !!(token && isAuthenticated);
  },

  // Verify user - get current user data from API
  async verifyUser() {
    try {
      const response = await http.get('/me');

      // Handle both success/error response formats
      const responseData = response.data;
      if (responseData.error === false || responseData.success === true) {
        const userData = responseData.data;

        // Update user data in Zustand store
        useUserStore.getState().setUser(userData);

        return { user: userData, message: responseData.message };
      } else {
        throw new Error(responseData.message || 'Failed to verify user');
      }
    } catch (error) {
      throw error;
    }
  },

  // Update user profile
  async updateProfile(profileData) {
    try {
      const formData = new FormData();
      formData.append('name', profileData.name);
      formData.append('email', profileData.email);

      const response = await http.post('/me', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Handle both success/error response formats
      const responseData = response.data;
      if (responseData.error === false || responseData.success === true) {
        const userData = responseData.data;

        // Update user data in Zustand store
        useUserStore.getState().setUser(userData);

        return { user: userData, message: responseData.message };
      } else {
        throw new Error(responseData.message || 'Failed to update profile');
      }
    } catch (error) {
      throw error;
    }
  },

  // Reset password with OTP
  async resetPassword(resetData) {
    try {
      const formData = new FormData();
      formData.append('email', resetData.email);
      formData.append('otp', resetData.otp);
      formData.append('password', resetData.password);
      formData.append('password_confirmation', resetData.passwordConfirmation);

      const response = await http.post('/auth/new-password', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Handle both success/error response formats
      const responseData = response.data;
      if (responseData.error === false || responseData.success === true) {
        return { message: responseData.message };
      } else {
        throw new Error(responseData.message || 'Failed to reset password');
      }
    } catch (error) {
      throw error;
    }
  },
};
