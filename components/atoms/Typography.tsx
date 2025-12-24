/**
 * Typography Atom Components
 * Consistent heading and text styles with Sora and DM Sans fonts
 */

import React from 'react';

interface HeadingProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

interface TextProps {
  children: React.ReactNode;
  className?: string;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  muted?: boolean;
}

// Section Heading - Large display heading for sections
export const SectionHeading: React.FC<HeadingProps> = ({ 
  children, 
  className = '',
  as: Tag = 'h2'
}) => {
  return (
    <Tag className={`
      font-display font-bold 
      text-3xl sm:text-4xl lg:text-5xl 
      text-stone-900 
      tracking-tight
      leading-[1.15]
      ${className}
    `}>
      {children}
    </Tag>
  );
};

// Hero Heading - Extra large for hero section
export const HeroHeading: React.FC<HeadingProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <h1 className={`
      font-display font-extrabold 
      text-4xl sm:text-5xl lg:text-6xl xl:text-7xl
      text-stone-900 
      tracking-tight
      leading-[1.08]
      ${className}
    `}>
      {children}
    </h1>
  );
};

// Card Title - Medium heading for cards
export const CardTitle: React.FC<HeadingProps> = ({ 
  children, 
  className = '',
  as: Tag = 'h3'
}) => {
  return (
    <Tag className={`
      font-display font-semibold 
      text-xl sm:text-2xl 
      text-stone-800 
      tracking-tight
      ${className}
    `}>
      {children}
    </Tag>
  );
};

// Subtitle - Secondary heading text
export const Subtitle: React.FC<TextProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <p className={`
      font-semibold 
      text-base sm:text-lg 
      text-teal-600
      tracking-wide
      uppercase
      ${className}
    `}>
      {children}
    </p>
  );
};

// Body Text - Regular paragraph text
export const BodyText: React.FC<TextProps> = ({ 
  children, 
  className = '',
  size = 'base',
  muted = false
}) => {
  const sizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  return (
    <p className={`
      ${sizes[size]}
      ${muted ? 'text-stone-500' : 'text-stone-600'}
      leading-relaxed
      ${className}
    `}>
      {children}
    </p>
  );
};

// Label Text - Small labels and captions
export const LabelText: React.FC<TextProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <span className={`
      text-sm font-medium 
      text-stone-500
      uppercase tracking-wider
      ${className}
    `}>
      {children}
    </span>
  );
};

// Accent Text - Highlighted text
export const AccentText: React.FC<TextProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <span className={`
      font-semibold 
      text-teal-600
      ${className}
    `}>
      {children}
    </span>
  );
};

// Badge Text - For badges and tags
export const BadgeText: React.FC<{ children: React.ReactNode; variant?: 'primary' | 'success' | 'warning'; className?: string }> = ({ 
  children, 
  variant = 'primary',
  className = '' 
}) => {
  const variants = {
    primary: 'bg-teal-100 text-teal-700 border-teal-200',
    success: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-100 text-amber-700 border-amber-200'
  };

  return (
    <span className={`
      inline-flex items-center
      px-4 py-1.5 
      rounded-full
      text-sm font-semibold
      border
      ${variants[variant]}
      ${className}
    `}>
      {children}
    </span>
  );
};

export default {
  SectionHeading,
  HeroHeading,
  CardTitle,
  Subtitle,
  BodyText,
  LabelText,
  AccentText,
  BadgeText
};
