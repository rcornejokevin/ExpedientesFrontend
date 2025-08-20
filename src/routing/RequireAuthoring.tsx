import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/auth/AuthContext';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router';
import { ScreenLoader } from '@/components/common/screen-loader';

export default function RequireAuthoring() {
  const { user } = useAuth();
  console.log('User in RequireAuthoring:', user);
  if (user !== null) return <Outlet />;
  return <Navigate to="/auth" replace />;
  /*
  const { auth, verify, loading: globalLoading } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const verificationStarted = useRef(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (!auth?.access_token || !verificationStarted.current) {
        verificationStarted.current = true;
        try {
          await verify();
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, [auth, verify]);

  // Show screen loader while checking authentication
  if (loading || globalLoading) {
    return <ScreenLoader />;
  }

  // If not authenticated, redirect to login
  if (!auth?.access_token) {
    return (
      <Navigate
        to={`/auth/signin?next=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }
*/
  // If authenticated, render child routes
  //return <Outlet />;
}
