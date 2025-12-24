/**
 * Login Layout
 * Wrapper layout for login page with AuthProvider
 */

import { AuthProvider } from '@/contexts/AuthContext';

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}

