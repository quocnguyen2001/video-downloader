import axios from 'axios';
import useUserStore from '../stores/userStore';

// Create axios instance with base configuration
const http = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_API_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-API-KEY': process.env.REACT_APP_BACKEND_API_KEY || '',
  },
});

// Request interceptor to add auth token
http.interceptors.request.use(
  config => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
http.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - clear token and user data from Zustand store
      localStorage.removeItem('auth_token');
      useUserStore.getState().clearUser();

      // Dispatch custom event to notify auth context
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }

    // Return a more user-friendly error object
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred';

    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
      originalError: error,
    });
  }
);

export default http;
