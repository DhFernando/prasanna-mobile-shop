/**
 * Admin Layout
 * Wrapper layout for all admin pages with authentication protection
 * Supports dark/light mode
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/lib/theme';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { ThemeSwitcher } from '@/components/molecules';
import { Icon } from '@/components/atoms';
import NotificationPanel from '@/components/admin/NotificationPanel';

// Protected layout wrapper
function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { isLoggedIn, isLoading } = useAuth();
  const { isDark, currentTheme } = useTheme();
  const router = useRouter();

  // Fetch unread notifications count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await fetch('/api/alerts?unread=true');
        const data = await res.json();
        if (data.success) {
          setUnreadCount(data.data.unreadCount);
        }
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    };

    if (isLoggedIn) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, isLoading, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className={`
        min-h-screen flex items-center justify-center
        ${isDark ? 'bg-stone-950' : 'bg-stone-50'}
      `}>
        <div className="text-center">
          <div 
            className="w-10 h-10 border-3 rounded-full animate-spin mx-auto mb-4"
            style={{ 
              borderColor: `${currentTheme.primaryHex}30`,
              borderTopColor: currentTheme.primaryHex 
            }}
          />
          <p className={isDark ? 'text-stone-400' : 'text-stone-500'}>Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not logged in
  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className={`
      min-h-screen flex
      ${isDark ? 'bg-stone-950' : 'bg-stone-50'}
    `}>
      {/* Sidebar */}
      <AdminSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header - shows on all screen sizes */}
        <header className={`
          sticky top-0 z-30
          backdrop-blur-md
          border-b
          px-4 sm:px-6 py-4
          ${isDark 
            ? 'bg-stone-900/95 border-stone-700' 
            : 'bg-white/95 border-stone-200'
          }
        `}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setSidebarOpen(true)}
                className={`
                  lg:hidden
                  w-10 h-10 rounded-xl
                  flex items-center justify-center
                  transition-colors
                  ${isDark 
                    ? 'bg-stone-800 hover:bg-stone-700 text-stone-300' 
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }
                `}
                aria-label="Toggle menu"
              >
                <Icon name="menu" size={20} />
              </button>
              
              <span className={`
                font-display font-semibold text-lg
                ${isDark ? 'text-white' : 'text-stone-900'}
              `}>
                Admin Panel
              </span>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className={`
                    relative w-10 h-10 rounded-xl
                    flex items-center justify-center
                    transition-colors
                    ${isNotificationOpen 
                      ? 'text-white' 
                      : isDark
                        ? 'bg-stone-800 hover:bg-stone-700 text-stone-300'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                    }
                  `}
                  style={isNotificationOpen ? { backgroundColor: currentTheme.primaryHex } : {}}
                  aria-label="Notifications"
                >
                  <Icon name="bell" size={20} />
                  {unreadCount > 0 && (
                    <span className="
                      absolute -top-1 -right-1
                      min-w-[18px] h-[18px]
                      px-1
                      flex items-center justify-center
                      text-xs font-bold text-white
                      bg-red-500 rounded-full
                      animate-pulse
                    ">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
                
                <NotificationPanel
                  isOpen={isNotificationOpen}
                  onClose={() => setIsNotificationOpen(false)}
                />
              </div>

              {/* Theme Switcher */}
              <ThemeSwitcher compact isAdmin={true} />

              {/* View Site Link */}
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  hidden sm:flex items-center gap-2
                  px-4 py-2 rounded-xl
                  text-sm font-medium
                  transition-colors
                  ${isDark 
                    ? 'text-stone-400 hover:text-white hover:bg-stone-800' 
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }
                `}
              >
                <Icon name="arrow-right" size={16} />
                View Site
              </a>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

// Layout with AuthProvider
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <ProtectedLayout>{children}</ProtectedLayout>
    </AuthProvider>
  );
}
