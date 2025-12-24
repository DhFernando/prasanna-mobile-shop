/**
 * About Organism
 * About section with store story and trust elements
 * Premium visual storytelling design
 */

import React from 'react';
import { SectionHeading, BodyText, Subtitle, Icon } from '../atoms';

const About: React.FC = () => {
  const trustPoints = [
    { icon: 'shield' as const, text: 'Genuine Products', color: 'teal' },
    { icon: 'heart' as const, text: 'Customer First', color: 'rose' },
    { icon: 'star' as const, text: '5-Star Rated', color: 'amber' },
  ];

  const stats = [
    { value: '5.0', label: 'Google Rating', icon: 'star' as const },
    { value: '7 Days', label: 'Open Weekly', icon: 'clock' as const },
    { value: '100%', label: 'Genuine Products', icon: 'shield' as const },
  ];

  return (
    <section 
      id="about"
      className="py-24 sm:py-32 bg-white relative overflow-hidden"
    >
      {/* Background Decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-teal-50/60 to-transparent" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-tr from-amber-50/40 to-transparent" />
        <div className="absolute inset-0 section-pattern opacity-30" />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Content Side */}
            <div className="animate-fade-in-up">
              <Subtitle className="mb-4">About Our Store</Subtitle>
              <SectionHeading className="mb-6">
                Serving Ja-Ela with{' '}
                <span className="gradient-text">Quality</span> Mobile Accessories
              </SectionHeading>
              
              <div className="space-y-5 mb-10">
                <BodyText size="lg" className="text-stone-700">
                  Welcome to <strong className="text-teal-700">Prasanna Mobile Center</strong>, your trusted destination 
                  for mobile accessories in Ja-Ela. Located on Old Negombo Road, we&apos;ve been 
                  serving our community with genuine products and exceptional service.
                </BodyText>
                
                <BodyText className="text-stone-600">
                  We understand that your mobile devices are essential to your daily life. 
                  That&apos;s why we stock only quality accessories from trusted brands, ensuring 
                  you get products that last and perform as expected.
                </BodyText>
                
                <BodyText className="text-stone-600">
                  Whether you need a durable charger, a stylish phone cover, a reliable 
                  screen protector, or any other mobile accessory, we have you covered. 
                  Our friendly staff is always ready to help you find exactly what you need.
                </BodyText>
              </div>

              {/* Trust Points */}
              <div className="flex flex-wrap gap-3">
                {trustPoints.map((point, index) => {
                  const colorClasses = {
                    teal: 'bg-teal-50 border-teal-100 text-teal-700',
                    rose: 'bg-rose-50 border-rose-100 text-rose-700',
                    amber: 'bg-amber-50 border-amber-100 text-amber-700',
                  };
                  const iconClasses = {
                    teal: 'text-teal-600',
                    rose: 'text-rose-500',
                    amber: 'text-amber-500',
                  };
                  
                  return (
                    <div 
                      key={index}
                      className={`
                        flex items-center gap-2.5 
                        px-4 py-2.5 
                        rounded-full
                        border
                        ${colorClasses[point.color as keyof typeof colorClasses]}
                        animate-fade-in-up
                      `}
                      style={{ animationDelay: `${300 + index * 100}ms` }}
                    >
                      <Icon 
                        name={point.icon} 
                        size={18} 
                        className={iconClasses[point.color as keyof typeof iconClasses]} 
                      />
                      <span className="text-sm font-semibold">{point.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Visual Side */}
            <div className="animate-fade-in-up animation-delay-200 relative">
              {/* Main Card */}
              <div className="
                relative
                bg-gradient-to-br from-teal-600 via-teal-500 to-emerald-600
                rounded-3xl
                p-8 sm:p-10
                text-white
                shadow-2xl shadow-teal-600/30
                overflow-hidden
              ">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
                <div className="absolute bottom-0 left-0 w-36 h-36 bg-white/10 rounded-full translate-y-1/3 -translate-x-1/4" />
                <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-white/5 rounded-full" />
                
                <div className="relative z-10">
                  {/* Logo Icon */}
                  <div className="
                    w-20 h-20 
                    rounded-2xl 
                    bg-white/20 
                    backdrop-blur-sm
                    flex items-center justify-center 
                    mb-8
                    shadow-lg
                  ">
                    <Icon name="smartphone" size={40} className="text-white" />
                  </div>

                  <h3 className="font-display text-2xl sm:text-3xl font-bold mb-4">
                    Prasanna Mobile Center
                  </h3>
                  
                  <p className="text-teal-100 text-lg mb-8 leading-relaxed">
                    Your one-stop shop for all mobile accessories in Ja-Ela. Quality you can trust.
                  </p>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/20">
                    {stats.map((stat, index) => (
                      <div key={index} className="text-center">
                        <div className="font-display font-bold text-2xl sm:text-3xl mb-1">{stat.value}</div>
                        <div className="text-teal-200 text-xs sm:text-sm font-medium">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Badge - Rating */}
              <div className="
                absolute -bottom-5 -right-4 sm:-bottom-6 sm:-right-6
                bg-gradient-to-br from-amber-500 to-orange-500
                text-white
                rounded-2xl
                p-5 sm:p-6
                shadow-xl shadow-amber-500/40
                animate-float
              ">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center">
                    <Icon name="star" size={28} className="text-white star-glow mb-1" />
                    <div className="font-display font-bold text-2xl">5.0</div>
                    <div className="text-amber-100 text-xs font-medium">Rating</div>
                  </div>
                </div>
              </div>

              {/* Floating Badge - Location */}
              <div className="
                absolute -top-4 -left-4 sm:-top-6 sm:-left-6
                bg-white
                text-stone-800
                rounded-2xl
                px-5 py-4
                shadow-xl shadow-stone-200/50
                border border-stone-100
                animate-float-slow
                hidden sm:block
              ">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
                    <Icon name="location" size={20} className="text-teal-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Ja-Ela</div>
                    <div className="text-stone-500 text-xs">Old Negombo Rd</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
