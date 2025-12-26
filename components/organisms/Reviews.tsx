/**
 * Reviews Organism
 * Customer reviews and Google rating section
 * Premium design with prominent Google rating display
 * Supports dark/light mode
 */

'use client';

import React from 'react';
import { SectionHeading, BodyText, Subtitle, Button, Icon } from '../atoms';
import { ReviewCard } from '../molecules';
import { useTheme } from '@/lib/theme';

const Reviews: React.FC = () => {
  const { isDark, currentTheme } = useTheme();
  
  const reviews = [
    {
      name: 'Happy Customer',
      rating: 5,
      text: 'Excellent service and genuine products! Found exactly what I needed for my phone. The staff was very helpful and knowledgeable. Will definitely recommend to friends!',
      date: 'Recent',
    },
    {
      name: 'Satisfied Buyer',
      rating: 5,
      text: 'Best mobile shop in Ja-Ela. Great prices and quality accessories. The owner is very friendly and helped me choose the perfect case for my phone. Will come back again!',
      date: 'Recent',
    },
  ];

  return (
    <section 
      id="reviews"
      className={`py-24 sm:py-32 relative overflow-hidden ${isDark ? 'bg-stone-800' : ''}`}
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className={`absolute inset-0 ${
          isDark 
            ? 'bg-gradient-to-b from-stone-800 via-stone-800 to-stone-900' 
            : 'bg-gradient-to-b from-white via-stone-50/50 to-white'
        }`} />
        <div className={`absolute inset-0 section-pattern ${isDark ? 'opacity-10' : 'opacity-30'}`} />
        {/* Decorative elements */}
        <div className={`absolute top-1/4 left-[5%] w-64 h-64 rounded-full blur-3xl ${isDark ? 'bg-amber-500/10' : 'bg-amber-100/30'}`} />
        <div 
          className="absolute bottom-1/4 right-[5%] w-80 h-80 rounded-full blur-3xl"
          style={{ background: `${currentTheme.primaryHex}15` }}
        />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="animate-fade-in-up">
              <Subtitle className={`mb-4 ${isDark ? 'text-stone-400' : ''}`}>Customer Reviews</Subtitle>
            </div>
            <div className="animate-fade-in-up animation-delay-100">
              <h2 className={`font-display font-bold text-3xl sm:text-4xl mb-6 ${isDark ? 'text-white' : 'text-stone-900'}`}>
                What Our <span 
                  className="bg-clip-text text-transparent"
                  style={{ 
                    backgroundImage: `linear-gradient(135deg, ${currentTheme.primaryHex}, ${currentTheme.primaryLight})`
                  }}
                >Customers</span> Say
              </h2>
            </div>
            <div className="animate-fade-in-up animation-delay-200">
              <BodyText size="lg" className={isDark ? 'text-stone-400' : 'text-stone-600'}>
                We&apos;re proud to have earned the trust of our community with 
                consistent quality and service.
              </BodyText>
            </div>
          </div>

          {/* Google Rating Highlight - Premium Design */}
          <div className="flex justify-center mb-14 animate-fade-in-up animation-delay-300">
            <a 
              href="https://maps.app.goo.gl/X4Exp5vf855PqcfZ7"
              target="_blank"
              rel="noopener noreferrer"
              className={`
                group
                relative
                rounded-3xl
                p-8 sm:p-10
                border
                shadow-xl
                hover:shadow-2xl
                transition-all duration-500
                text-center
                max-w-md w-full
                ${isDark 
                  ? 'bg-gradient-to-br from-stone-700 to-stone-800 border-amber-500/30 shadow-stone-900/50 hover:border-amber-500/50' 
                  : 'bg-gradient-to-br from-white to-amber-50/50 border-amber-200/60 shadow-amber-100/50 hover:shadow-amber-200/60 hover:border-amber-300'
                }
              `}
            >
              {/* Google badge */}
              <div className={`
                absolute -top-4 left-1/2 -translate-x-1/2
                rounded-full
                px-4 py-2
                shadow-lg
                border
                flex items-center gap-2
                ${isDark 
                  ? 'bg-stone-800 border-stone-700' 
                  : 'bg-white border-stone-100'
                }
              `}>
                <Icon name="google" size={20} />
                <span className={`text-sm font-semibold ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>Google Reviews</span>
              </div>
              
              {/* Stars */}
              <div className="flex items-center justify-center gap-1.5 mb-5 mt-2">
                {[...Array(5)].map((_, i) => (
                  <span 
                    key={i} 
                    className="text-amber-400 star-glow group-hover:scale-110 transition-transform duration-300" 
                    style={{ transitionDelay: `${i * 50}ms` }}
                  >
                    <Icon name="star" size={36} />
                  </span>
                ))}
              </div>
              
              {/* Rating */}
              <div className={`font-display font-bold text-6xl sm:text-7xl mb-2 ${isDark ? 'text-white' : 'text-stone-900'}`}>
                5.0
              </div>
              <div className={`text-lg font-medium mb-1 ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>Perfect Rating</div>
              <div className={`text-sm ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>Based on customer reviews</div>
              
              {/* Hover indicator */}
              <div 
                className={`
                  mt-6 pt-6 border-t
                  flex items-center justify-center gap-2
                  font-medium
                  group-hover:gap-3
                  transition-all duration-300
                  ${isDark ? 'border-stone-600' : 'border-amber-200/50'}
                `}
                style={{ color: currentTheme.primaryHex }}
              >
                <span>Leave a review</span>
                <Icon 
                  name="arrow-right" 
                  size={18} 
                  className="group-hover:translate-x-1 transition-transform duration-300" 
                />
              </div>
            </a>
          </div>

          {/* Reviews Grid */}
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-12">
            {reviews.map((review, index) => (
              <ReviewCard
                key={index}
                name={review.name}
                rating={review.rating}
                text={review.text}
                date={review.date}
                delay={index * 150}
              />
            ))}
          </div>

          {/* CTA to leave review */}
          <div className="text-center animate-fade-in-up">
            <div className={`
              inline-flex flex-col sm:flex-row items-center gap-4
              p-6 sm:p-8
              backdrop-blur-sm
              rounded-2xl
              border
              shadow-lg
              ${isDark 
                ? 'bg-stone-800/80 border-stone-700 shadow-stone-900/50' 
                : 'bg-white/80 border-stone-200 shadow-stone-100/50'
              }
            `}>
              <div className={`
                w-14 h-14 rounded-2xl
                flex items-center justify-center
                shadow-sm
                ${isDark 
                  ? 'bg-gradient-to-br from-amber-500/20 to-amber-600/10' 
                  : 'bg-gradient-to-br from-amber-100 to-amber-50'
                }
              `}>
                <Icon name="sparkles" size={28} className="text-amber-500" />
              </div>
              
              <div className="text-center sm:text-left">
                <p className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-stone-800'}`}>Had a great experience?</p>
                <p className={`text-sm ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>We&apos;d love to hear from you!</p>
              </div>
              
              <Button
                href="https://maps.app.goo.gl/X4Exp5vf855PqcfZ7"
                variant="secondary"
                size="md"
                icon={<Icon name="star" size={18} />}
                external
              >
                Leave a Review
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
