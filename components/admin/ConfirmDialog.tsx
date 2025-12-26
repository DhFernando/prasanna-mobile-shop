/**
 * Confirm Dialog Component
 * Simple confirmation dialog for delete actions
 * Supports dark/light mode
 */

'use client';

import React from 'react';
import { Icon } from '@/components/atoms';
import { useTheme } from '@/lib/theme';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  confirmVariant?: 'danger' | 'primary';
  isLoading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  confirmVariant = 'danger',
  isLoading = false,
}) => {
  const { isDark, currentTheme } = useTheme();

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div 
      className={`
        fixed inset-0 z-50
        flex items-center justify-center
        p-4
        backdrop-blur-sm
        animate-fade-in
        ${isDark ? 'bg-black/70' : 'bg-stone-900/60'}
      `}
      onClick={handleBackdropClick}
    >
      <div className={`
        w-full max-w-sm
        rounded-2xl
        shadow-2xl
        animate-scale-in
        p-6
        ${isDark 
          ? 'bg-stone-900 shadow-black/40' 
          : 'bg-white shadow-stone-900/20'
        }
      `}>
        {/* Icon */}
        <div className={`
          w-14 h-14 mx-auto mb-4
          rounded-full
          flex items-center justify-center
          ${isDark ? 'bg-red-500/20' : 'bg-red-100'}
        `}>
          <Icon name="close" size={28} className={isDark ? 'text-red-400' : 'text-red-600'} />
        </div>
        
        {/* Content */}
        <h3 className={`text-lg font-semibold text-center mb-2 ${isDark ? 'text-white' : 'text-stone-900'}`}>
          {title}
        </h3>
        <p className={`text-center mb-6 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
          {message}
        </p>
        
        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className={`
              flex-1 py-3 px-4
              rounded-xl font-semibold
              transition-colors
              disabled:opacity-50
              ${isDark 
                ? 'bg-stone-700 text-stone-300 hover:bg-stone-600' 
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }
            `}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`
              flex-1 py-3 px-4
              rounded-xl font-semibold
              text-white
              transition-colors
              disabled:opacity-50
              flex items-center justify-center gap-2
              ${confirmVariant === 'danger' 
                ? 'bg-red-600 hover:bg-red-700' 
                : ''
              }
            `}
            style={confirmVariant === 'primary' ? { 
              backgroundColor: currentTheme.primaryHex 
            } : {}}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
