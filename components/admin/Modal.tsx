/**
 * Modal Component
 * Reusable modal dialog for forms and confirmations
 * Supports dark/light mode
 */

'use client';

import React, { useEffect, useRef } from 'react';
import { Icon } from '@/components/atoms';
import { useTheme } from '@/lib/theme';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  size = 'md' 
}) => {
  const { isDark } = useTheme();
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle click outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
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
      <div 
        ref={modalRef}
        className={`
          w-full ${sizeClasses[size]}
          rounded-2xl
          shadow-2xl
          animate-scale-in
          max-h-[90vh] overflow-hidden
          flex flex-col
          ${isDark 
            ? 'bg-stone-900 shadow-black/40' 
            : 'bg-white shadow-stone-900/20'
          }
        `}
      >
        {/* Header */}
        <div className={`
          flex items-center justify-between
          px-6 py-4
          border-b
          ${isDark ? 'border-stone-700' : 'border-stone-200'}
        `}>
          <h2 className={`font-display font-semibold text-xl ${isDark ? 'text-white' : 'text-stone-900'}`}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className={`
              w-9 h-9 rounded-lg
              flex items-center justify-center
              transition-colors
              ${isDark 
                ? 'text-stone-400 hover:text-white hover:bg-stone-700' 
                : 'text-stone-400 hover:text-stone-600 hover:bg-stone-100'
              }
            `}
            aria-label="Close modal"
          >
            <Icon name="close" size={20} />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
