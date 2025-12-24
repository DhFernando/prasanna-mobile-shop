/**
 * Admin Header Component
 * Top header bar for admin panel
 */

'use client';

import React from 'react';
import { Icon } from '@/components/atoms';

interface AdminHeaderProps {
  title: string;
  onMenuClick: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ title, onMenuClick }) => {
  return (
    <header className="
      sticky top-0 z-30
      bg-white/95 backdrop-blur-md
      border-b border-stone-200
      px-4 sm:px-6 py-4
    ">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <button
            onClick={onMenuClick}
            className="
              lg:hidden
              w-10 h-10 rounded-xl
              bg-stone-100 hover:bg-stone-200
              flex items-center justify-center
              transition-colors
            "
            aria-label="Toggle menu"
          >
            <Icon name="menu" size={20} className="text-stone-700" />
          </button>

          {/* Page Title */}
          <h1 className="font-display font-semibold text-xl text-stone-900">
            {title}
          </h1>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="
              hidden sm:flex items-center gap-2
              px-4 py-2
              text-sm font-medium text-stone-600
              hover:text-teal-600
              transition-colors
            "
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

