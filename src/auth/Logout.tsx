import React from 'react';
import { useAuth } from '@/auth/AuthContext';
import { useNavigate } from 'react-router';
import { Label } from '@/components/ui/label';

export default function Logout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  React.useEffect(() => {
    logout();
    navigate('/auth/signin', { replace: true });
  }, []);
  return <></>;
}
