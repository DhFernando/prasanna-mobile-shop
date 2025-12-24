/**
 * RatingBadge Molecule
 * Displays Google rating prominently
 * Premium design with star glow effect
 */

import React from 'react';
import Icon from '../atoms/Icon';

interface RatingBadgeProps {
  rating: number;
  reviewCount: number;
  size?: 'sm' | 'md' | 'lg';
}

const RatingBadge: React.FC<RatingBadgeProps> = ({ 
  rating, 
  reviewCount,
  size = 'md' 
}) => {
  const sizes = {
    sm: {
      container: 'px-4 py-2.5',
      star: 16,
      rating: 'text-xl',
      text: 'text-xs'
    },
    md: {
      container: 'px-5 py-3.5',
      star: 20,
      rating: 'text-2xl',
      text: 'text-sm'
    },
    lg: {
      container: 'px-7 py-5',
      star: 28,
      rating: 'text-4xl',
      text: 'text-base'
    }
  };

  const s = sizes[size];

  return (
    <div className={`
      inline-flex items-center gap-4
      ${s.container}
      bg-white rounded-xl
      border border-stone-200/80
      shadow-lg shadow-stone-100
      hover:shadow-xl hover:border-amber-200
      transition-all duration-300
    `}>
      {/* Google Logo */}
      <div className="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center">
        <Icon name="google" size={20} />
      </div>
      
      {/* Stars */}
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Icon 
            key={i}
            name="star" 
            size={s.star} 
            className={`${i < Math.floor(rating) ? 'text-amber-400 star-glow' : 'text-stone-200'}`}
          />
        ))}
      </div>

      {/* Rating Text */}
      <div className="flex flex-col border-l border-stone-200 pl-4">
        <span className={`font-display font-bold text-stone-900 ${s.rating}`}>
          {rating.toFixed(1)}
        </span>
        <span className={`text-stone-500 ${s.text}`}>
          Google ({reviewCount} reviews)
        </span>
      </div>
    </div>
  );
};

export default RatingBadge;
