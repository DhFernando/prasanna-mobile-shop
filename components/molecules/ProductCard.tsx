/**
 * ProductCard Molecule
 * Displays a product/service category with icon and description
 * Premium card design with smooth hover effects
 * Links to the shop page filtered by category
 */

import React from 'react';
import Link from 'next/link';
import Icon from '../atoms/Icon';
import { CardTitle, BodyText } from '../atoms/Typography';

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
  // Link to shop page with category filter if provided
  const href = categorySlug ? `/shop?category=${categorySlug}` : '/shop';

  return (
    <Link 
      href={href}
      className="
        group
        block
        relative
        bg-white rounded-2xl
        p-7 sm:p-8
        border border-stone-200/60
        shadow-sm shadow-stone-100
        hover:shadow-xl hover:shadow-teal-500/10
        hover:border-teal-200
        transition-all duration-500 ease-out
        animate-fade-in-up
        stagger-item
        overflow-hidden
      "
      style={{ 
        animationDelay: `${delay}ms`,
        animationFillMode: 'forwards'
      }}
    >
      {/* Hover gradient overlay */}
      <div className="
        absolute inset-0 
        bg-gradient-to-br from-teal-50/0 to-teal-50/0
        group-hover:from-teal-50/50 group-hover:to-emerald-50/30
        transition-all duration-500
        -z-10
      " />
      
      {/* Top accent line */}
      <div className="
        absolute top-0 left-0 right-0 h-1
        bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-500
        transform origin-left scale-x-0
        group-hover:scale-x-100
        transition-transform duration-500 ease-out
      " />

      {/* Icon Container */}
      <div className="
        relative
        w-14 h-14 sm:w-16 sm:h-16
        rounded-xl
        bg-gradient-to-br from-stone-50 to-stone-100
        flex items-center justify-center
        mb-6
        group-hover:from-teal-50 group-hover:to-teal-100
        group-hover:scale-110
        transition-all duration-400
        shadow-sm
      ">
        <Icon 
          name={icon} 
          size={28} 
          className="text-stone-500 group-hover:text-teal-600 transition-colors duration-300" 
        />
      </div>

      {/* Content */}
      <CardTitle className="mb-3 group-hover:text-teal-700 transition-colors duration-300">
        {title}
      </CardTitle>
      <BodyText muted className="text-sm sm:text-base leading-relaxed">
        {description}
      </BodyText>

      {/* View Products CTA */}
      <div className="
        mt-5 pt-5 
        border-t border-stone-100 
        group-hover:border-teal-100/50
        flex items-center gap-2
        text-stone-400
        group-hover:text-teal-600
        transition-all duration-300
      ">
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
