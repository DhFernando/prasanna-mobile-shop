/**
 * ReviewCard Molecule
 * Displays customer review with rating
 * Premium design with subtle animations
 */

import React from 'react';
import Icon from '../atoms/Icon';
import { BodyText, CardTitle } from '../atoms/Typography';

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
  // Generate initials for avatar
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  
  return (
    <div 
      className="
        group
        relative
        bg-white rounded-2xl
        p-7 sm:p-8
        border border-stone-200/60
        shadow-sm shadow-stone-100
        hover:shadow-xl hover:shadow-teal-500/8
        hover:border-teal-200/50
        transition-all duration-500
        animate-fade-in-up
        stagger-item
        overflow-hidden
      "
      style={{ 
        animationDelay: `${delay}ms`,
        animationFillMode: 'forwards'
      }}
    >
      {/* Quote decoration */}
      <div className="
        absolute top-6 right-6
        text-7xl font-serif text-stone-100
        leading-none
        group-hover:text-teal-100
        transition-colors duration-500
        select-none
      ">
        &ldquo;
      </div>

      {/* Stars */}
      <div className="flex items-center gap-1 mb-5 relative z-10">
        {[...Array(5)].map((_, i) => (
          <span 
            key={i}
            className={`
              ${i < rating ? 'text-amber-400' : 'text-stone-200'}
              group-hover:scale-110
              transition-transform duration-300
            `}
            style={{ transitionDelay: `${i * 30}ms` }}
          >
            <Icon name="star" size={20} />
          </span>
        ))}
        <span className="ml-2 text-sm font-semibold text-amber-600">{rating}.0</span>
      </div>

      {/* Review Text */}
      <BodyText className="mb-6 text-stone-700 relative z-10 leading-relaxed">
        &ldquo;{text}&rdquo;
      </BodyText>

      {/* Reviewer Info */}
      <div className="flex items-center justify-between border-t border-stone-100 pt-5 relative z-10">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="
            w-11 h-11 rounded-full
            bg-gradient-to-br from-teal-500 to-emerald-600
            flex items-center justify-center
            text-white font-semibold text-sm
            shadow-md shadow-teal-500/30
            group-hover:scale-110
            transition-transform duration-300
          ">
            {initials}
          </div>
          <div>
            <CardTitle as="h4" className="text-base font-semibold text-stone-800">
              {name}
            </CardTitle>
            <p className="text-xs text-stone-400 flex items-center gap-1">
              <Icon name="check" size={12} className="text-teal-500" />
              Verified Customer
            </p>
          </div>
        </div>
        {date && (
          <BodyText size="sm" muted>
            {date}
          </BodyText>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
