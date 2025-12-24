/**
 * Products Organism
 * Products and services showcase section
 * Premium card design with hover effects
 * Links to shop page with category filters
 */

import React from 'react';
import Link from 'next/link';
import { SectionHeading, BodyText, Subtitle, Icon, Button } from '../atoms';
import { ProductCard } from '../molecules';

const Products: React.FC = () => {
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
      className="py-24 sm:py-32 relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-stone-50 via-white to-stone-50" />
        <div className="absolute inset-0 section-pattern opacity-40" />
        {/* Decorative gradient orbs */}
        <div className="absolute top-20 left-[10%] w-[400px] h-[400px] bg-gradient-to-br from-teal-100/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-[10%] w-[300px] h-[300px] bg-gradient-to-tl from-orange-100/30 to-transparent rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="animate-fade-in-up">
              <Subtitle className="mb-4">Our Products & Services</Subtitle>
            </div>
            <div className="animate-fade-in-up animation-delay-100">
              <SectionHeading className="mb-6">
                Everything Your{' '}
                <span className="gradient-text">Phone</span> Needs
              </SectionHeading>
            </div>
            <div className="animate-fade-in-up animation-delay-200">
              <BodyText size="lg" className="text-stone-600">
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
            <div className="
              inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-6
              py-6 px-8
              bg-white/80 backdrop-blur-sm
              rounded-2xl
              border border-stone-200/80
              shadow-lg shadow-stone-200/50
            ">
              <div className="text-center sm:text-left">
                <p className="font-medium text-stone-800 mb-1">Browse all our products</p>
                <p className="text-sm text-stone-500">Visit our shop to see everything we offer!</p>
              </div>
              <Link
                href="/shop"
                className="
                  inline-flex items-center gap-2
                  px-6 py-3
                  bg-gradient-to-r from-teal-600 to-emerald-600
                  hover:from-teal-700 hover:to-emerald-700
                  text-white font-semibold
                  rounded-xl
                  shadow-lg shadow-teal-500/30
                  hover:shadow-xl hover:shadow-teal-500/40
                  transition-all duration-300
                "
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
