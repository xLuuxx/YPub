import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function PrivateRoute({ children, roles, redirectTo = '/login' }) {
  const { user } = useAuth();

  if (!user) return <Navigate to={redirectTo} replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;

  return children;
}

export default PrivateRoute;
