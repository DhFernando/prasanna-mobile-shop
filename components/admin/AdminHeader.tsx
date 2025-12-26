/**
 * Admin Header Component
 * Top header bar for admin panel with notifications
 * Supports dark/light mode
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Icon } from '@/components/atoms';
import { ThemeSwitcher } from '@/components/molecules';
import NotificationPanel from './NotificationPanel';
import { useTheme } from '@/lib/theme';

interface AdminHeaderProps {
  title: string;
  onMenuClick: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ title, onMenuClick }) => {
  const { isDark, currentTheme } = useTheme();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await fetch('/api/alerts?unread=true');
      const data = await res.json();
      if (data.success) {
        setUnreadCount(data.data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  }, []);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  useEffect(() => {
    if (!isNotificationOpen) {
      fetchUnreadCount();
    }
  }, [isNotificationOpen, fetchUnreadCount]);

  return (
    <header className={`
      sticky top-0 z-30
      backdrop-blur-md
      border-b px-4 sm:px-6 py-4
      transition-colors duration-200
      ${isDark 
        ? 'bg-stone-900/95 border-stone-700' 
        : 'bg-white/95 border-stone-200'
      }
    `}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <button
            onClick={onMenuClick}
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

          {/* Page Title */}
          <h1 className={`
            font-display font-semibold text-xl
            ${isDark ? 'text-white' : 'text-stone-900'}
          `}>
            {title}
          </h1>
        </div>

        {/* Quick Actions */}
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
                  ? isDark 
                    ? 'text-white' 
                    : 'text-white'
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

          {/* Theme Switcher - Admin can change site color theme */}
          <ThemeSwitcher compact isAdmin={true} />

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className={`
              hidden sm:flex items-center gap-2
              px-4 py-2
              text-sm font-medium
              transition-colors
              ${isDark 
                ? 'text-stone-400 hover:text-white' 
                : 'text-stone-600 hover:text-stone-900'
              }
            `}
            style={{ '--hover-color': currentTheme.primaryHex } as React.CSSProperties}
          >
            <Icon name="arrow-right" size={16} />
            View Site
          </a>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
