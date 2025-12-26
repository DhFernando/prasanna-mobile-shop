/**
 * Products Organism
 * Products and services showcase section
 * Premium card design with hover effects
 * Links to shop page with category filters
 * Supports dark/light mode
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { SectionHeading, BodyText, Subtitle, Icon } from '../atoms';
import { ProductCard } from '../molecules';
import { useTheme } from '@/lib/theme';

const Products: React.FC = () => {
  const { isDark, currentTheme } = useTheme();
  const products = [
    {
      title: 'Mobile Accessories',
      description: 'Wide range of accessories including earphones, power banks, holders, and more for all phone brands.',
      icon: 'smartphone' as const,
      categorySlug: 'accessories',
    },
    {
      title: 'Chargers & Cables',
      description: 'Original and high-quality charging cables and adapters for fast and safe charging.',
      icon: 'battery' as const,
      categorySlug: 'chargers-cables',
    },
    {
      title: 'Phone Covers',
      description: 'Stylish and protective cases for iPhone, Samsung, and all popular smartphone models.',
      icon: 'shield' as const,
      categorySlug: 'phone-covers',
    },
    {
      title: 'Screen Protectors',
      description: 'Tempered glass and film protectors to keep your screen scratch-free and protected.',
      icon: 'smartphone' as const,
      categorySlug: 'screen-protectors',
    },
    {
      title: 'Audio Accessories',
      description: 'Earphones, earbuds, Bluetooth speakers, and audio adapters for superior sound.',
      icon: 'headphones' as const,
      categorySlug: 'audio',
    },
    {
      title: 'Power Banks',
      description: 'Portable chargers and power banks to keep your devices powered on the go.',
      icon: 'battery' as const,
      categorySlug: 'power-banks',
    },
  ];

  return (
    <section 
      id="products"
      className={`py-24 sm:py-32 relative overflow-hidden ${isDark ? 'bg-stone-900' : ''}`}
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className={`absolute inset-0 ${
          isDark 
            ? 'bg-gradient-to-b from-stone-900 via-stone-900 to-stone-800' 
            : 'bg-gradient-to-b from-stone-50 via-white to-stone-50'
        }`} />
        <div className={`absolute inset-0 section-pattern ${isDark ? 'opacity-20' : 'opacity-40'}`} />
        {/* Decorative gradient orbs */}
        <div 
          className="absolute top-20 left-[10%] w-[400px] h-[400px] rounded-full blur-3xl"
          style={{ 
            background: isDark 
              ? `radial-gradient(circle, ${currentTheme.primaryHex}15 0%, transparent 70%)`
              : `radial-gradient(circle, ${currentTheme.primaryHex}30 0%, transparent 70%)`
          }}
        />
        <div className={`absolute bottom-20 right-[10%] w-[300px] h-[300px] rounded-full blur-3xl ${
          isDark ? 'bg-orange-500/10' : 'bg-gradient-to-tl from-orange-100/30 to-transparent'
        }`} />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="animate-fade-in-up">
              <Subtitle className={`mb-4 ${isDark ? 'text-stone-400' : ''}`}>Our Products & Services</Subtitle>
            </div>
            <div className="animate-fade-in-up animation-delay-100">
              <h2 className={`font-display font-bold text-3xl sm:text-4xl mb-6 ${isDark ? 'text-white' : 'text-stone-900'}`}>
                Everything Your{' '}
                <span 
                  className="bg-clip-text text-transparent"
                  style={{ 
                    backgroundImage: `linear-gradient(135deg, ${currentTheme.primaryHex}, ${currentTheme.primaryLight})`
                  }}
                >
                  Phone
                </span> Needs
              </h2>
            </div>
            <div className="animate-fade-in-up animation-delay-200">
              <BodyText size="lg" className={isDark ? 'text-stone-400' : 'text-stone-600'}>
                From essential accessories to professional repairs, we&apos;ve got all your 
                mobile needs covered under one roof.
              </BodyText>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {products.map((product, index) => (
              <ProductCard
                key={product.title}
                title={product.title}
                description={product.description}
                icon={product.icon}
                categorySlug={product.categorySlug}
                delay={index * 80}
              />
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center animate-fade-in-up">
            <div className={`
              inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-6
              py-6 px-8
              backdrop-blur-sm
              rounded-2xl
              border
              shadow-lg
              ${isDark 
                ? 'bg-stone-800/80 border-stone-700 shadow-stone-900/50' 
                : 'bg-white/80 border-stone-200/80 shadow-stone-200/50'
              }
            `}>
              <div className="text-center sm:text-left">
                <p className={`font-medium mb-1 ${isDark ? 'text-white' : 'text-stone-800'}`}>Browse all our products</p>
                <p className={`text-sm ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>Visit our shop to see everything we offer!</p>
              </div>
              <Link
                href="/shop"
                className="
                  inline-flex items-center gap-2
                  px-6 py-3
                  text-white font-semibold
                  rounded-xl
                  shadow-lg
                  hover:shadow-xl
                  transition-all duration-300
                "
                style={{ 
                  background: `linear-gradient(135deg, ${currentTheme.primaryHex}, ${currentTheme.primaryDark})`,
                  boxShadow: `0 4px 14px ${currentTheme.primaryHex}40`
                }}
              >
                <Icon name="search" size={18} />
                Browse Shop
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Products;
