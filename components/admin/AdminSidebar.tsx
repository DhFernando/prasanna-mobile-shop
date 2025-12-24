/**
 * Admin Sidebar Component
 * Navigation sidebar for admin panel
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/components/atoms';
import { useAuth } from '@/contexts/AuthContext';

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

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-stone-900/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 bottom-0
        w-64 bg-white
        border-r border-stone-200
        z-50
        transition-transform duration-300
        lg:translate-x-0 lg:static lg:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-5 border-b border-stone-200">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="
                w-10 h-10 rounded-xl
                bg-gradient-to-br from-teal-500 to-emerald-600
                flex items-center justify-center
                shadow-md shadow-teal-500/25
              ">
                <Icon name="smartphone" size={20} className="text-white" />
              </div>
              <div>
                <h1 className="font-display font-bold text-stone-900">
                  Admin Panel
                </h1>
                <p className="text-xs text-stone-500">Prasanna Mobile</p>
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
                      ? 'bg-teal-50 text-teal-700 shadow-sm' 
                      : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                    }
                  `}
                >
                  <Icon 
                    name={item.icon} 
                    size={20} 
                    className={isActive ? 'text-teal-600' : 'text-stone-400'} 
                  />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-stone-200 space-y-2">
            {/* View Website */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="
                flex items-center gap-3
                px-4 py-3 rounded-xl
                text-stone-600 font-medium
                hover:bg-stone-50 hover:text-stone-900
                transition-colors
              "
            >
              <Icon name="arrow-right" size={20} className="text-stone-400" />
              View Website
            </a>

            {/* Logout */}
            <button
              onClick={logout}
              className="
                w-full flex items-center gap-3
                px-4 py-3 rounded-xl
                text-red-600 font-medium
                hover:bg-red-50
                transition-colors
              "
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

