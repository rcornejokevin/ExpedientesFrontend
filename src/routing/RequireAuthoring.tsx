import { useAuth } from '@/auth/AuthContext';
import { Navigate, Outlet } from 'react-router';

export default function RequireAuthoring() {
  const { user } = useAuth();
  console.log('User in RequireAuthoring:', user);
  if (user !== null) return <Outlet />;
  return <Navigate to="/auth" replace />;
}
