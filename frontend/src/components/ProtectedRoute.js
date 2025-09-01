import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/auth';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, verify } = useAuth();
  const location = useLocation();

  // Show loading state during authentication check
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if we have a token but no user data (page refresh scenario)
  const token = authService.getToken();
  if (token && !isAuthenticated) {
    // This case should be handled by the useAuth initialization
    // But if we get here, redirect to login as fallback
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render protected content
  return children;
};

export default ProtectedRoute;
