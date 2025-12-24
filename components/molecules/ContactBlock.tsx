/**
 * ContactBlock Molecule
 * Contact information display with icon
 * Premium design with hover effects
 */

import React from 'react';
import Icon from '../atoms/Icon';
import { BodyText, LabelText } from '../atoms/Typography';

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
  const iconMap = {
    phone: 'phone',
    location: 'location',
    hours: 'clock'
  } as const;

  const colorConfig = {
    phone: {
      gradient: 'from-teal-500 to-teal-600',
      bg: 'bg-teal-50',
      shadow: 'shadow-teal-500/20',
      hoverBorder: 'hover:border-teal-200',
    },
    location: {
      gradient: 'from-emerald-500 to-emerald-600',
      bg: 'bg-emerald-50',
      shadow: 'shadow-emerald-500/20',
      hoverBorder: 'hover:border-emerald-200',
    },
    hours: {
      gradient: 'from-amber-500 to-orange-500',
      bg: 'bg-amber-50',
      shadow: 'shadow-amber-500/20',
      hoverBorder: 'hover:border-amber-200',
    }
  };

  const config = colorConfig[type];

  const content = (
    <div className={`
      flex items-start gap-4
      p-5 sm:p-6
      bg-white rounded-xl
      border border-stone-200/60
      ${config.hoverBorder}
      hover:shadow-lg
      transition-all duration-300
      group
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
        <LabelText className="block mb-1.5 text-xs text-stone-400">
          {label}
        </LabelText>
        <p className="font-semibold text-stone-800 break-words text-lg leading-tight">
          {value}
        </p>
        {subValue && (
          <BodyText size="sm" muted className="mt-1">
            {subValue}
          </BodyText>
        )}
      </div>

      {/* Arrow indicator for links */}
      {href && (
        <div className="
          w-8 h-8 rounded-full
          bg-stone-50 
          group-hover:bg-teal-50
          flex items-center justify-center
          transition-colors duration-300
          flex-shrink-0
          mt-1
        ">
          <Icon 
            name="arrow-right" 
            size={16} 
            className="text-stone-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all duration-300" 
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
