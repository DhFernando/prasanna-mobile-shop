/**
 * Login Page
 * Admin authentication page
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Icon } from '@/components/atoms';
import { useAuth } from '@/contexts/AuthContext';
import { useSiteSettings } from '@/lib/site-settings-context';
import { useTheme } from '@/lib/theme';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, isLoggedIn, isLoading: authLoading } = useAuth();
  const { settings } = useSiteSettings();
  const { isDark, currentTheme } = useTheme();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && isLoggedIn) {
      router.push('/admin');
    }
  }, [isLoggedIn, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(username, password);
      if (success) {
        router.push('/admin');
      } else {
        setError('Invalid username or password');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-stone-900' : 'bg-stone-50'}`}>
        <div 
          className="w-8 h-8 border-2 rounded-full animate-spin" 
          style={{ borderColor: `${currentTheme.primaryHex}30`, borderTopColor: currentTheme.primaryHex }}
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      isDark 
        ? 'bg-gradient-to-br from-stone-900 via-stone-900 to-stone-800' 
        : 'bg-gradient-to-br from-stone-50 via-white to-teal-50/30'
    }`}>
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div 
          className="absolute top-20 left-[10%] w-96 h-96 rounded-full blur-3xl" 
          style={{ background: isDark ? `${currentTheme.primaryHex}15` : `${currentTheme.primaryHex}20` }}
        />
        <div className={`absolute bottom-20 right-[10%] w-80 h-80 rounded-full blur-3xl ${isDark ? 'bg-amber-500/10' : 'bg-amber-100/30'}`} />
      </div>

      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div 
            className="
              w-16 h-16 mx-auto mb-4
              rounded-2xl
              flex items-center justify-center
              shadow-lg
            "
            style={{ 
              background: `linear-gradient(135deg, ${currentTheme.primaryHex}, ${currentTheme.primaryDark})`,
              boxShadow: `0 4px 14px ${currentTheme.primaryHex}40`
            }}
          >
            <Icon name="smartphone" size={32} className="text-white" />
          </div>
          <h1 className={`font-display text-2xl font-bold ${isDark ? 'text-white' : 'text-stone-900'}`}>
            Admin Login
          </h1>
          <p className={`mt-1 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
            {settings?.siteName || 'Mobile Center'}
          </p>
        </div>

        {/* Login Form */}
        <div className={`
          rounded-2xl
          border
          shadow-xl
          p-8
          ${isDark 
            ? 'bg-stone-800 border-stone-700 shadow-stone-900/50' 
            : 'bg-white border-stone-200/60 shadow-stone-200/50'
          }
        `}>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="
                p-4 rounded-xl
                bg-red-50 border border-red-200
                text-red-700 text-sm
                flex items-center gap-3
              ">
                <Icon name="close" size={18} />
                {error}
              </div>
            )}

            {/* Username */}
            <div>
              <label 
                htmlFor="username"
                className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-stone-300' : 'text-stone-700'}`}
              >
                Username
              </label>
              <div className="relative">
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                  className={`
                    w-full px-4 py-3 pl-11
                    border rounded-xl
                    focus:outline-none focus:ring-2 transition-all
                    ${isDark 
                      ? 'bg-stone-700 border-stone-600 text-white placeholder-stone-500 focus:ring-stone-500/30 focus:border-stone-500' 
                      : 'bg-white border-stone-200 text-stone-900 placeholder-stone-400 focus:ring-teal-500/20 focus:border-teal-500'
                    }
                  `}
                />
                <Icon 
                  name="users" 
                  size={18} 
                  className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-stone-500' : 'text-stone-400'}`}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label 
                htmlFor="password"
                className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-stone-300' : 'text-stone-700'}`}
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  className={`
                    w-full px-4 py-3 pl-11 pr-11
                    border rounded-xl
                    focus:outline-none focus:ring-2 transition-all
                    ${isDark 
                      ? 'bg-stone-700 border-stone-600 text-white placeholder-stone-500 focus:ring-stone-500/30 focus:border-stone-500' 
                      : 'bg-white border-stone-200 text-stone-900 placeholder-stone-400 focus:ring-teal-500/20 focus:border-teal-500'
                    }
                  `}
                />
                <Icon 
                  name="shield" 
                  size={18} 
                  className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-stone-500' : 'text-stone-400'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-stone-500 hover:text-stone-300' : 'text-stone-400 hover:text-stone-600'}`}
                >
                  <Icon name={showPassword ? 'close' : 'check'} size={18} />
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="
                w-full py-3.5 px-4
                text-white font-semibold
                rounded-xl
                shadow-lg
                focus:outline-none focus:ring-2 focus:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all
                flex items-center justify-center gap-2
              "
              style={{ 
                background: `linear-gradient(to right, ${currentTheme.primaryHex}, ${currentTheme.primaryLight})`,
                boxShadow: `0 4px 14px ${currentTheme.primaryHex}40`
              }}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <Icon name="arrow-right" size={18} />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Back to site link */}
          <div className={`mt-6 pt-6 border-t text-center ${isDark ? 'border-stone-700' : 'border-stone-200'}`}>
            <Link
              href="/"
              className={`
                inline-flex items-center gap-2
                text-sm transition-colors
                ${isDark ? 'text-stone-400 hover:text-stone-300' : 'text-stone-500 hover:text-teal-600'}
              `}
            >
              <Icon name="arrow-right" size={16} className="rotate-180" />
              Back to website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


