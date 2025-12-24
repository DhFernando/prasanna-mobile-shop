/**
 * WhyChooseUs Organism
 * Features and benefits section with distinctive design
 */

import React from 'react';
import { SectionHeading, BodyText, Subtitle, Icon } from '../atoms';

const WhyChooseUs: React.FC = () => {
  const features = [
    {
      title: 'Genuine Products',
      description: 'We only stock authentic, quality accessories from trusted brands you can rely on.',
      icon: 'shield' as const,
      accent: 'from-teal-500 to-emerald-500',
      bgAccent: 'bg-teal-50',
      iconColor: 'text-teal-600',
    },
    {
      title: 'Affordable Prices',
      description: 'Competitive pricing without compromising on quality. Best value for your money.',
      icon: 'tag' as const,
      accent: 'from-orange-500 to-amber-500',
      bgAccent: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
    {
      title: 'Friendly Service',
      description: 'Our knowledgeable staff is always ready to help you find the perfect product.',
      icon: 'users' as const,
      accent: 'from-indigo-500 to-purple-500',
      bgAccent: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
    },
    {
      title: '5-Star Rating',
      description: 'Trusted by our customers with a perfect 5.0 rating on Google Reviews.',
      icon: 'star' as const,
      accent: 'from-amber-500 to-yellow-500',
      bgAccent: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
  ];

  return (
    <section className="py-24 sm:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-white to-orange-50/30" />
        <div className="absolute inset-0 grid-pattern opacity-40" />
        {/* Decorative elements */}
        <div className="absolute top-40 left-[5%] w-80 h-80 bg-teal-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-[10%] w-96 h-96 bg-amber-200/20 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="animate-fade-in-up">
              <Subtitle className="mb-4">Why Choose Us</Subtitle>
            </div>
            <div className="animate-fade-in-up animation-delay-100">
              <SectionHeading className="mb-6">
                The <span className="gradient-text">Prasanna</span> Difference
              </SectionHeading>
            </div>
            <div className="animate-fade-in-up animation-delay-200">
              <BodyText size="lg" className="text-stone-600">
                Here&apos;s why customers in Ja-Ela trust us for all their mobile accessory needs.
              </BodyText>
            </div>
          </div>

          {/* Features Grid - Unique 2x2 layout with numbers */}
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="
                  group
                  relative
                  bg-white/80 backdrop-blur-sm
                  rounded-2xl
                  p-8 sm:p-10
                  border border-stone-200/50
                  hover:bg-white
                  hover:border-stone-200
                  hover:shadow-xl hover:shadow-stone-200/50
                  transition-all duration-500
                  animate-fade-in-up
                  stagger-item
                  overflow-hidden
                "
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'forwards'
                }}
              >
                {/* Large number watermark */}
                <div className="
                  absolute -top-4 -right-2
                  font-display font-bold text-[120px] sm:text-[160px]
                  text-stone-100
                  leading-none
                  select-none
                  group-hover:text-teal-50
                  transition-colors duration-500
                ">
                  {String(index + 1).padStart(2, '0')}
                </div>

                <div className="relative z-10 flex items-start gap-5">
                  {/* Icon */}
                  <div className={`
                    w-14 h-14
                    rounded-xl
                    ${feature.bgAccent}
                    flex items-center justify-center
                    flex-shrink-0
                    group-hover:scale-110
                    transition-transform duration-300
                    shadow-sm
                  `}>
                    <Icon name={feature.icon} size={26} className={feature.iconColor} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <h3 className="
                      font-display font-semibold 
                      text-xl sm:text-2xl 
                      text-stone-800 
                      mb-3
                      group-hover:text-teal-700
                      transition-colors duration-300
                    ">
                      {feature.title}
                    </h3>
                    <BodyText muted className="text-base leading-relaxed">
                      {feature.description}
                    </BodyText>
                  </div>
                </div>

                {/* Bottom gradient line */}
                <div className={`
                  absolute bottom-0 left-0 right-0 h-1
                  bg-gradient-to-r ${feature.accent}
                  transform origin-left scale-x-0
                  group-hover:scale-x-100
                  transition-transform duration-500
                `} />
              </div>
            ))}
          </div>

          {/* Trust Indicator */}
          <div className="mt-16 text-center animate-fade-in-up animation-delay-600">
            <div className="
              inline-flex items-center gap-4
              px-8 py-5
              bg-white rounded-2xl
              border border-stone-200
              shadow-lg shadow-stone-100
            ">
              {/* Stars */}
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Icon key={i} name="star" size={24} className="text-amber-400 star-glow" />
                ))}
              </div>
              
              <div className="w-px h-10 bg-stone-200" />
              
              <div className="text-left">
                <p className="font-display font-bold text-2xl text-stone-900">5.0</p>
                <p className="text-sm text-stone-500">Perfect Google Rating</p>
              </div>
              
              <div className="w-px h-10 bg-stone-200 hidden sm:block" />
              
              <a 
                href="https://maps.app.goo.gl/X4Exp5vf855PqcfZ7"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  hidden sm:flex items-center gap-2
                  text-teal-600 font-medium text-sm
                  hover:text-teal-700
                  transition-colors
                "
              >
                <Icon name="google" size={18} />
                <span>See reviews</span>
                <Icon name="arrow-right" size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
