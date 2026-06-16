import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

// This component protects pages that require login
// If not logged in → redirect to /login
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500 text-lg">Loading...</div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;