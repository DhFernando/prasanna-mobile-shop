/**
 * ProductCard Molecule
 * Displays a product/service category with icon and description
 * Premium card design with smooth hover effects
 * Links to the shop page filtered by category
 * Supports dark/light mode
 */

'use client';

import React from 'react';
import Link from 'next/link';
import Icon from '../atoms/Icon';
import { CardTitle, BodyText } from '../atoms/Typography';
import { useTheme } from '@/lib/theme';

interface ProductCardProps {
  title: string;
  description: string;
  icon: 'smartphone' | 'battery' | 'headphones' | 'cable' | 'tools' | 'shield';
  categorySlug?: string; // Category ID for filtering on shop page
  delay?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  title, 
  description, 
  icon,
  categorySlug,
  delay = 0 
}) => {
  const { isDark, currentTheme } = useTheme();
  // Link to shop page with category filter if provided
  const href = categorySlug ? `/shop?category=${categorySlug}` : '/shop';

  return (
    <Link 
      href={href}
      className={`
        group
        block
        relative
        rounded-2xl
        p-7 sm:p-8
        border
        shadow-sm
        transition-all duration-500 ease-out
        animate-fade-in-up
        stagger-item
        overflow-hidden
        ${isDark 
          ? 'bg-stone-800 border-stone-700 hover:border-stone-600 hover:shadow-xl hover:shadow-stone-900/50' 
          : 'bg-white border-stone-200/60 shadow-stone-100 hover:shadow-xl hover:shadow-teal-500/10 hover:border-teal-200'
        }
      `}
      style={{ 
        animationDelay: `${delay}ms`,
        animationFillMode: 'forwards'
      }}
    >
      {/* Hover gradient overlay */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 -z-10"
        style={{ 
          background: isDark 
            ? `linear-gradient(135deg, ${currentTheme.primaryHex}08 0%, transparent 100%)`
            : `linear-gradient(135deg, ${currentTheme.primaryHex}10 0%, ${currentTheme.primaryHex}05 100%)`
        }}
      />
      
      {/* Top accent line */}
      <div 
        className="
          absolute top-0 left-0 right-0 h-1
          transform origin-left scale-x-0
          group-hover:scale-x-100
          transition-transform duration-500 ease-out
        "
        style={{ 
          background: `linear-gradient(90deg, ${currentTheme.primaryHex}, ${currentTheme.primaryLight}, ${currentTheme.primaryHex})`
        }}
      />

      {/* Icon Container */}
      <div 
        className={`
          relative
          w-14 h-14 sm:w-16 sm:h-16
          rounded-xl
          flex items-center justify-center
          mb-6
          group-hover:scale-110
          transition-all duration-400
          shadow-sm
          ${isDark 
            ? 'bg-stone-700' 
            : 'bg-gradient-to-br from-stone-50 to-stone-100'
          }
        `}
        style={{ 
          backgroundColor: isDark ? undefined : undefined
        }}
      >
        <Icon 
          name={icon} 
          size={28} 
          className={`transition-colors duration-300 ${isDark ? 'text-stone-400 group-hover:text-stone-200' : 'text-stone-500'}`}
          style={{ color: undefined }}
        />
      </div>

      {/* Content */}
      <h3 className={`font-display font-semibold text-lg mb-3 transition-colors duration-300 ${
        isDark ? 'text-white group-hover:text-stone-100' : 'text-stone-900 group-hover:text-stone-800'
      }`}>
        {title}
      </h3>
      <BodyText muted className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-stone-400' : ''}`}>
        {description}
      </BodyText>

      {/* View Products CTA */}
      <div className={`
        mt-5 pt-5 
        border-t
        flex items-center gap-2
        transition-all duration-300
        ${isDark 
          ? 'border-stone-700 text-stone-500 group-hover:text-stone-300' 
          : 'border-stone-100 text-stone-400 group-hover:text-stone-600'
        }
      `}>
        <span className="text-sm font-medium">View Products</span>
        <Icon 
          name="arrow-right" 
          size={16} 
          className="transform group-hover:translate-x-1 transition-transform duration-300 ml-auto" 
        />
      </div>
    </Link>
  );
};

export default ProductCard;
