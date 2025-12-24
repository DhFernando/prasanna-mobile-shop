/**
 * Confirm Dialog Component
 * Simple confirmation dialog for delete actions
 */

'use client';

import React from 'react';
import { Icon } from '@/components/atoms';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
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
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div 
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        p-4
        bg-stone-900/60 backdrop-blur-sm
        animate-fade-in
      "
      onClick={handleBackdropClick}
    >
      <div className="
        w-full max-w-sm
        bg-white rounded-2xl
        shadow-2xl shadow-stone-900/20
        animate-scale-in
        p-6
      ">
        {/* Icon */}
        <div className="
          w-14 h-14 mx-auto mb-4
          rounded-full
          bg-red-100
          flex items-center justify-center
        ">
          <Icon name="close" size={28} className="text-red-600" />
        </div>
        
        {/* Content */}
        <h3 className="text-lg font-semibold text-stone-900 text-center mb-2">
          {title}
        </h3>
        <p className="text-stone-600 text-center mb-6">
          {message}
        </p>
        
        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="
              flex-1 py-3 px-4
              rounded-xl font-semibold
              bg-stone-100 text-stone-700
              hover:bg-stone-200
              transition-colors
              disabled:opacity-50
            "
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
                : 'bg-teal-600 hover:bg-teal-700'
              }
            `}
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

