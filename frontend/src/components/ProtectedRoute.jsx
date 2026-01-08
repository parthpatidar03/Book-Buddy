import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }
// If the user IS logged in, renders the children. The children are whatever component we wrapped inside <ProtectedRoute>.
  return children;
};

export default ProtectedRoute;

