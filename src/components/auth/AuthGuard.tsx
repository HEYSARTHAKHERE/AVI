import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AuthLoadingState } from './AuthLoadingState';

interface AuthGuardProps {
  children: React.ReactNode;
  onNavigate: (path: string) => void;
  currentPath: string;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  onNavigate,
  currentPath,
}) => {
  const { status } = useAuth();

  useEffect(() => {
    if (status === 'unauthenticated') {
      // Encode current protected path so user can be redirected back after login
      const returnUrl = encodeURIComponent(currentPath);
      onNavigate(`/login?redirect=${returnUrl}`);
    }
  }, [status, currentPath, onNavigate]);

  if (status === 'loading') {
    return <AuthLoadingState message="Verifying protected route credentials..." />;
  }

  if (status === 'unauthenticated') {
    return null; // Will redirect via useEffect
  }

  return <>{children}</>;
};
