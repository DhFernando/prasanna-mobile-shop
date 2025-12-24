/**
 * Authentication utilities
 * Simple hardcoded credentials for admin authentication
 */

// Hardcoded admin credentials (in production, use environment variables and proper auth)
export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'prasanna2024'
};

// Session token key for localStorage
export const AUTH_TOKEN_KEY = 'prasanna_admin_token';

// Generate a simple session token
export function generateToken(): string {
  return `token_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

// Validate credentials
export function validateCredentials(username: string, password: string): boolean {
  return username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password;
}

// Check if user is authenticated (client-side)
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  return !!token;
}

// Set auth token
export function setAuthToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
}

// Remove auth token (logout)
export function removeAuthToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
}

// Get auth token
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

