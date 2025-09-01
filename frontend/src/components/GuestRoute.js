import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const GuestRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    // Redirect to the intended destination or dashboard
    const from = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  // Render guest content
  return children;
};

export default GuestRoute;
