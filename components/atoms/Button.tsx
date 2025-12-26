/**
 * Button Atom Component
 * Reusable button with multiple variants for consistent UI
 * Supports dynamic theme colors
 */

'use client';

import React from 'react';
import { useTheme } from '@/lib/theme';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'cta';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  ariaLabel?: string;
  external?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  className = '',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  ariaLabel,
  external = false,
}) => {
  const { isDark, currentTheme } = useTheme();
  
  // Base styles
  const baseStyles = `
    inline-flex items-center justify-center gap-2.5 
    font-semibold rounded-xl
    transition-all duration-300 ease-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    active:scale-[0.98]
  `;

  // Variant styles - Dynamic for primary and outline, static for others
  const variants = {
    primary: `
      text-white 
      shadow-lg
      hover:shadow-xl
      hover:-translate-y-0.5
    `,
    secondary: `
      bg-gradient-to-r from-orange-500 to-amber-500 
      text-white 
      hover:from-orange-400 hover:to-amber-400
      focus:ring-orange-500
      shadow-lg shadow-orange-500/25
      hover:shadow-xl hover:shadow-orange-400/30
      hover:-translate-y-0.5
    `,
    outline: `
      border-2
      backdrop-blur-sm
      ${isDark 
        ? 'bg-stone-800/50 text-stone-200 border-stone-600 hover:bg-stone-700 hover:text-white' 
        : 'bg-white/90 hover:bg-stone-50'
      }
    `,
    ghost: `
      ${isDark 
        ? 'text-stone-300 hover:bg-stone-700 hover:text-white' 
        : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
      }
      focus:ring-stone-400
    `,
    cta: `
      bg-gradient-to-r from-green-500 to-emerald-500 
      text-white 
      hover:from-green-400 hover:to-emerald-400
      focus:ring-green-500
      shadow-lg shadow-green-500/30
      hover:shadow-xl hover:shadow-green-400/35
      hover:-translate-y-0.5
    `,
  };

  // Size styles
  const sizes = {
    sm: 'px-4 py-2.5 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const combinedStyles = `
    ${baseStyles}
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  // Dynamic styles for primary and outline variants
  const dynamicStyles: React.CSSProperties = {};
  if (variant === 'primary') {
    dynamicStyles.background = `linear-gradient(135deg, ${currentTheme.primaryHex}, ${currentTheme.primaryDark})`;
    dynamicStyles.boxShadow = `0 4px 14px ${currentTheme.primaryHex}40`;
  } else if (variant === 'outline' && !isDark) {
    dynamicStyles.borderColor = currentTheme.primaryHex;
    dynamicStyles.color = currentTheme.primaryHex;
  }

  const content = (
    <>
      {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
    </>
  );

  // Render as link or button
  if (href) {
    return (
      <a
        href={href}
        className={combinedStyles}
        style={dynamicStyles}
        aria-label={ariaLabel}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      className={combinedStyles}
      style={dynamicStyles}
      aria-label={ariaLabel}
      type="button"
    >
      {content}
    </button>
  );
};

export default Button;
