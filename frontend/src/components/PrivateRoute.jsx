import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function PrivateRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth();

  console.log('PrivateRoute - user:', user, 'loading:', loading);

  if (loading) {
    console.log('PrivateRoute - Still loading, showing spinner');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rwanda-blue"></div>
      </div>
    );
  }

  if (!user) {
    console.log('PrivateRoute: No user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    console.log('PrivateRoute: User role not allowed, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  console.log('PrivateRoute: User authenticated, rendering children');
  return children;
}

