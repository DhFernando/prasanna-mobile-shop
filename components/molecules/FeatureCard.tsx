/**
 * FeatureCard Molecule
 * Displays a feature/benefit with icon
 * Premium design with color accents
 */

import React from 'react';
import Icon from '../atoms/Icon';
import { CardTitle, BodyText } from '../atoms/Typography';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: 'shield' | 'star' | 'heart' | 'check' | 'tag' | 'users' | 'zap';
  delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  title, 
  description, 
  icon,
  delay = 0 
}) => {
  return (
    <div 
      className="
        group
        flex items-start gap-5
        p-6 sm:p-7
        bg-white/70 backdrop-blur-sm
        rounded-xl
        border border-stone-200/50
        hover:bg-white
        hover:border-teal-200
        hover:shadow-xl hover:shadow-teal-500/8
        transition-all duration-400
        animate-fade-in-up
        stagger-item
      "
      style={{ 
        animationDelay: `${delay}ms`,
        animationFillMode: 'forwards'
      }}
    >
      {/* Icon */}
      <div className="
        w-13 h-13
        rounded-xl
        bg-gradient-to-br from-teal-500 to-emerald-600
        flex items-center justify-center
        flex-shrink-0
        group-hover:scale-110
        transition-transform duration-300
        shadow-md shadow-teal-500/25
      ">
        <Icon name={icon} size={24} className="text-white" />
      </div>

      {/* Content */}
      <div className="flex-1 pt-0.5">
        <CardTitle as="h3" className="text-lg mb-2 group-hover:text-teal-700 transition-colors">
          {title}
        </CardTitle>
        <BodyText size="sm" muted className="leading-relaxed">
          {description}
        </BodyText>
      </div>
    </div>
  );
};

export default FeatureCard;
