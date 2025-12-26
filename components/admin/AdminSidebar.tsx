/**
 * Admin Sidebar Component
 * Navigation sidebar for admin panel
 * Supports dark/light mode
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/components/atoms';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/lib/theme';
import { useSiteSettings } from '@/lib/site-settings-context';

interface NavItem {
  label: string;
  href: string;
  icon: 'smartphone' | 'shield' | 'star' | 'check' | 'tag' | 'users' | 'zap' | 'sparkles' | 'heart';
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: 'zap' },
  { label: 'Products', href: '/admin/products', icon: 'smartphone' },
  { label: 'Categories', href: '/admin/categories', icon: 'tag' },
  { label: 'Sales', href: '/admin/sales', icon: 'heart' },
  { label: 'Announcements', href: '/admin/announcements', icon: 'sparkles' },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { isDark, currentTheme } = useTheme();
  const { settings } = useSiteSettings();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className={`
            fixed inset-0 z-40 lg:hidden
            ${isDark ? 'bg-black/60' : 'bg-stone-900/50'}
          `}
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 bottom-0
        w-64
        border-r
        z-50
        transition-all duration-300
        lg:translate-x-0 lg:static lg:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isDark 
          ? 'bg-stone-900 border-stone-700' 
          : 'bg-white border-stone-200'
        }
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={`
            p-5 border-b
            ${isDark ? 'border-stone-700' : 'border-stone-200'}
          `}>
            <Link href="/admin" className="flex items-center gap-3">
              <div 
                className="
                  w-10 h-10 rounded-xl
                  flex items-center justify-center
                  shadow-lg
                "
                style={{ 
                  background: `linear-gradient(135deg, ${currentTheme.primaryHex}, ${currentTheme.primaryDark})`,
                  boxShadow: `0 4px 14px ${currentTheme.primaryHex}40`
                }}
              >
                <Icon name="smartphone" size={20} className="text-white" />
              </div>
              <div>
                <h1 className={`
                  font-display font-bold
                  ${isDark ? 'text-white' : 'text-stone-900'}
                `}>
                  Admin Panel
                </h1>
                <p className={`text-xs ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                  {settings?.siteName || 'Mobile Center'}
                </p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/admin' && pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`
                    flex items-center gap-3
                    px-4 py-3 rounded-xl
                    font-medium transition-all
                    ${isActive 
                      ? 'shadow-sm text-white' 
                      : isDark
                        ? 'text-stone-400 hover:bg-stone-800 hover:text-white'
                        : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                    }
                  `}
                  style={isActive ? { 
                    backgroundColor: `${currentTheme.primaryHex}15`,
                    color: currentTheme.primaryHex 
                  } : {}}
                >
                  <Icon 
                    name={item.icon} 
                    size={20} 
                    className={isActive ? '' : isDark ? 'text-stone-500' : 'text-stone-400'} 
                    style={isActive ? { color: currentTheme.primaryHex } : {}}
                  />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className={`
            p-4 border-t space-y-1
            ${isDark ? 'border-stone-700' : 'border-stone-200'}
          `}>
            {/* View Website */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className={`
                flex items-center gap-3
                px-4 py-3 rounded-xl
                font-medium
                transition-colors
                ${isDark 
                  ? 'text-stone-400 hover:bg-stone-800 hover:text-white' 
                  : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }
              `}
            >
              <Icon name="arrow-right" size={20} className={isDark ? 'text-stone-500' : 'text-stone-400'} />
              View Website
            </a>

            {/* Site Settings */}
            <Link
              href="/admin/site-settings"
              onClick={onClose}
              className={`
                flex items-center gap-3
                px-4 py-3 rounded-xl
                font-medium
                transition-colors
                ${pathname === '/admin/site-settings'
                  ? 'shadow-sm text-white'
                  : isDark
                    ? 'text-stone-400 hover:bg-stone-800 hover:text-white'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }
              `}
              style={pathname === '/admin/site-settings' ? { 
                backgroundColor: `${currentTheme.primaryHex}15`,
                color: currentTheme.primaryHex 
              } : {}}
            >
              <Icon 
                name="smartphone" 
                size={20} 
                className={pathname === '/admin/site-settings' ? '' : isDark ? 'text-stone-500' : 'text-stone-400'} 
                style={pathname === '/admin/site-settings' ? { color: currentTheme.primaryHex } : {}}
              />
              Site Settings
            </Link>

            {/* Theme Settings */}
            <Link
              href="/admin/settings"
              onClick={onClose}
              className={`
                flex items-center gap-3
                px-4 py-3 rounded-xl
                font-medium
                transition-colors
                ${pathname === '/admin/settings'
                  ? 'shadow-sm text-white'
                  : isDark
                    ? 'text-stone-400 hover:bg-stone-800 hover:text-white'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }
              `}
              style={pathname === '/admin/settings' ? { 
                backgroundColor: `${currentTheme.primaryHex}15`,
                color: currentTheme.primaryHex 
              } : {}}
            >
              <Icon 
                name="settings" 
                size={20} 
                className={pathname === '/admin/settings' ? '' : isDark ? 'text-stone-500' : 'text-stone-400'} 
                style={pathname === '/admin/settings' ? { color: currentTheme.primaryHex } : {}}
              />
              Theme Settings
            </Link>

            {/* Logout */}
            <button
              onClick={logout}
              className={`
                w-full flex items-center gap-3
                px-4 py-3 rounded-xl
                text-red-500 font-medium
                transition-colors
                ${isDark ? 'hover:bg-red-500/10' : 'hover:bg-red-50'}
              `}
            >
              <Icon name="close" size={20} />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
