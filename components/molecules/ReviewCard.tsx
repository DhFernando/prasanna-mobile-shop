/**
 * ReviewCard Molecule
 * Displays customer review with rating
 * Premium design with subtle animations
 * Supports dark/light mode
 */

'use client';

import React from 'react';
import Icon from '../atoms/Icon';
import { BodyText, CardTitle } from '../atoms/Typography';
import { useTheme } from '@/lib/theme';

interface ReviewCardProps {
  name: string;
  rating: number;
  text: string;
  date?: string;
  delay?: number;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ 
  name, 
  rating, 
  text, 
  date,
  delay = 0 
}) => {
  const { isDark, currentTheme } = useTheme();
  
  // Generate initials for avatar
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  
  return (
    <div 
      className={`
        group
        relative
        rounded-2xl
        p-7 sm:p-8
        border
        shadow-sm
        hover:shadow-xl
        transition-all duration-500
        animate-fade-in-up
        stagger-item
        overflow-hidden
        ${isDark 
          ? 'bg-stone-800 border-stone-700 hover:border-stone-600' 
          : 'bg-white border-stone-200/60 shadow-stone-100 hover:shadow-teal-500/8 hover:border-teal-200/50'
        }
      `}
      style={{ 
        animationDelay: `${delay}ms`,
        animationFillMode: 'forwards'
      }}
    >
      {/* Quote decoration */}
      <div className={`
        absolute top-6 right-6
        text-7xl font-serif
        leading-none
        transition-colors duration-500
        select-none
        ${isDark ? 'text-stone-700' : 'text-stone-100 group-hover:text-teal-100'}
      `}>
        &ldquo;
      </div>

      {/* Stars */}
      <div className="flex items-center gap-1 mb-5 relative z-10">
        {[...Array(5)].map((_, i) => (
          <span 
            key={i}
            className={`
              ${i < rating ? 'text-amber-400' : isDark ? 'text-stone-600' : 'text-stone-200'}
              group-hover:scale-110
              transition-transform duration-300
            `}
            style={{ transitionDelay: `${i * 30}ms` }}
          >
            <Icon name="star" size={20} />
          </span>
        ))}
        <span className="ml-2 text-sm font-semibold text-amber-500">{rating}.0</span>
      </div>

      {/* Review Text */}
      <BodyText className={`mb-6 relative z-10 leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
        &ldquo;{text}&rdquo;
      </BodyText>

      {/* Reviewer Info */}
      <div className={`flex items-center justify-between border-t pt-5 relative z-10 ${isDark ? 'border-stone-700' : 'border-stone-100'}`}>
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div 
            className="
              w-11 h-11 rounded-full
              flex items-center justify-center
              text-white font-semibold text-sm
              shadow-md
              group-hover:scale-110
              transition-transform duration-300
            "
            style={{ 
              background: `linear-gradient(135deg, ${currentTheme.primaryHex}, ${currentTheme.primaryDark})`,
              boxShadow: `0 4px 14px ${currentTheme.primaryHex}40`
            }}
          >
            {initials}
          </div>
          <div>
            <h4 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-stone-800'}`}>
              {name}
            </h4>
            <p className={`text-xs flex items-center gap-1 ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
              <Icon name="check" size={12} style={{ color: currentTheme.primaryHex }} />
              Verified Customer
            </p>
          </div>
        </div>
        {date && (
          <BodyText size="sm" muted className={isDark ? 'text-stone-500' : ''}>
            {date}
          </BodyText>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
