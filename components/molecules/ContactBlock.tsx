/**
 * ContactBlock Molecule
 * Contact information display with icon
 * Premium design with hover effects
 * Supports dark/light mode
 */

'use client';

import React from 'react';
import Icon from '../atoms/Icon';
import { BodyText, LabelText } from '../atoms/Typography';
import { useTheme } from '@/lib/theme';

interface ContactBlockProps {
  type: 'phone' | 'location' | 'hours';
  label: string;
  value: string;
  subValue?: string;
  href?: string;
}

const ContactBlock: React.FC<ContactBlockProps> = ({ 
  type, 
  label, 
  value, 
  subValue,
  href 
}) => {
  const { isDark, currentTheme } = useTheme();
  
  const iconMap = {
    phone: 'phone',
    location: 'location',
    hours: 'clock'
  } as const;

  const colorConfig = {
    phone: {
      gradient: 'from-teal-500 to-teal-600',
      shadow: 'shadow-teal-500/20',
    },
    location: {
      gradient: 'from-emerald-500 to-emerald-600',
      shadow: 'shadow-emerald-500/20',
    },
    hours: {
      gradient: 'from-amber-500 to-orange-500',
      shadow: 'shadow-amber-500/20',
    }
  };

  const config = colorConfig[type];

  const content = (
    <div className={`
      flex items-start gap-4
      p-5 sm:p-6
      rounded-xl
      border
      hover:shadow-lg
      transition-all duration-300
      group
      ${isDark 
        ? 'bg-stone-800 border-stone-700 hover:border-stone-600' 
        : 'bg-white border-stone-200/60 hover:border-stone-300'
      }
    `}>
      {/* Icon */}
      <div className={`
        w-12 h-12
        rounded-xl
        bg-gradient-to-br ${config.gradient}
        flex items-center justify-center
        flex-shrink-0
        group-hover:scale-110
        transition-transform duration-300
        shadow-md ${config.shadow}
      `}>
        <Icon name={iconMap[type]} size={22} className="text-white" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pt-0.5">
        <LabelText className={`block mb-1.5 text-xs ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
          {label}
        </LabelText>
        <p className={`font-semibold break-words text-lg leading-tight ${isDark ? 'text-white' : 'text-stone-800'}`}>
          {value}
        </p>
        {subValue && (
          <BodyText size="sm" muted className={`mt-1 ${isDark ? 'text-stone-400' : ''}`}>
            {subValue}
          </BodyText>
        )}
      </div>

      {/* Arrow indicator for links */}
      {href && (
        <div className={`
          w-8 h-8 rounded-full
          flex items-center justify-center
          transition-colors duration-300
          flex-shrink-0
          mt-1
          ${isDark 
            ? 'bg-stone-700 group-hover:bg-stone-600' 
            : 'bg-stone-50 group-hover:bg-stone-100'
          }
        `}>
          <Icon 
            name="arrow-right" 
            size={16} 
            className={`group-hover:translate-x-0.5 transition-all duration-300 ${
              isDark ? 'text-stone-400 group-hover:text-stone-200' : 'text-stone-400 group-hover:text-stone-600'
            }`}
          />
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <a 
        href={href} 
        className="block hover:no-underline"
        aria-label={`${label}: ${value}`}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {content}
      </a>
    );
  }

  return content;
};

export default ContactBlock;
