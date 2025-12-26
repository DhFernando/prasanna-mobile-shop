/**
 * Admin Theme Settings Page
 * Allows admin to configure site-wide color theme
 */

'use client';

import React from 'react';
import { useTheme } from '@/lib/theme';
import { ThemeSwitcher } from '@/components/molecules';

export default function AdminSettingsPage() {
  const { isDark } = useTheme();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className={`
          font-display text-2xl sm:text-3xl font-bold mb-2
          ${isDark ? 'text-white' : 'text-stone-900'}
        `}>
          Theme Settings
        </h1>
        <p className={isDark ? 'text-stone-400' : 'text-stone-500'}>
          Customize the appearance of your website. Color theme changes apply to all users.
        </p>
      </div>

      {/* Theme Switcher Panel */}
      <div className="space-y-6">
        <ThemeSwitcher isAdmin={true} />

        {/* Info Card */}
        <div className={`
          p-6 rounded-xl border
          ${isDark 
            ? 'bg-stone-800/50 border-stone-700' 
            : 'bg-white border-stone-200'
          }
        `}>
          <h3 className={`
            font-semibold text-lg mb-3
            ${isDark ? 'text-white' : 'text-stone-900'}
          `}>
            About Theme Settings
          </h3>
          <div className={`space-y-3 text-sm ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
            <div className="flex items-start gap-3">
              <div className={`
                w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5
                ${isDark ? 'bg-stone-700' : 'bg-stone-100'}
              `}>
                <span className="text-xs font-bold">1</span>
              </div>
              <p>
                <strong className={isDark ? 'text-stone-300' : 'text-stone-700'}>Dark / Light Mode:</strong>{' '}
                This is your personal preference and only affects your view. Each user can set their own preference.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className={`
                w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5
                ${isDark ? 'bg-stone-700' : 'bg-stone-100'}
              `}>
                <span className="text-xs font-bold">2</span>
              </div>
              <p>
                <strong className={isDark ? 'text-stone-300' : 'text-stone-700'}>Site Color Theme:</strong>{' '}
                When you select a color theme (Teal, Purple, Blue, etc.), it applies to the entire website for all visitors and admin users.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


