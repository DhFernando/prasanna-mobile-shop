/**
 * Reviews Organism
 * Customer reviews and Google rating section
 * Premium design with prominent Google rating display
 */

import React from 'react';
import { SectionHeading, BodyText, Subtitle, Button, Icon } from '../atoms';
import { ReviewCard } from '../molecules';

const Reviews: React.FC = () => {
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
      className="py-24 sm:py-32 relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-stone-50/50 to-white" />
        <div className="absolute inset-0 section-pattern opacity-30" />
        {/* Decorative elements */}
        <div className="absolute top-1/4 left-[5%] w-64 h-64 bg-amber-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-[5%] w-80 h-80 bg-teal-100/20 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="animate-fade-in-up">
              <Subtitle className="mb-4">Customer Reviews</Subtitle>
            </div>
            <div className="animate-fade-in-up animation-delay-100">
              <SectionHeading className="mb-6">
                What Our <span className="gradient-text">Customers</span> Say
              </SectionHeading>
            </div>
            <div className="animate-fade-in-up animation-delay-200">
              <BodyText size="lg" className="text-stone-600">
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
              className="
                group
                relative
                bg-gradient-to-br from-white to-amber-50/50
                rounded-3xl
                p-8 sm:p-10
                border border-amber-200/60
                shadow-xl shadow-amber-100/50
                hover:shadow-2xl hover:shadow-amber-200/60
                hover:border-amber-300
                transition-all duration-500
                text-center
                max-w-md w-full
              "
            >
              {/* Google badge */}
              <div className="
                absolute -top-4 left-1/2 -translate-x-1/2
                bg-white rounded-full
                px-4 py-2
                shadow-lg
                border border-stone-100
                flex items-center gap-2
              ">
                <Icon name="google" size={20} />
                <span className="text-sm font-semibold text-stone-700">Google Reviews</span>
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
              <div className="font-display font-bold text-6xl sm:text-7xl text-stone-900 mb-2">
                5.0
              </div>
              <div className="text-lg text-stone-600 font-medium mb-1">Perfect Rating</div>
              <div className="text-sm text-stone-400">Based on customer reviews</div>
              
              {/* Hover indicator */}
              <div className="
                mt-6 pt-6 border-t border-amber-200/50
                flex items-center justify-center gap-2
                text-teal-600 font-medium
                group-hover:gap-3
                transition-all duration-300
              ">
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
            <div className="
              inline-flex flex-col sm:flex-row items-center gap-4
              p-6 sm:p-8
              bg-white/80 backdrop-blur-sm
              rounded-2xl
              border border-stone-200
              shadow-lg shadow-stone-100/50
            ">
              <div className="
                w-14 h-14 rounded-2xl
                bg-gradient-to-br from-amber-100 to-amber-50
                flex items-center justify-center
                shadow-sm
              ">
                <Icon name="sparkles" size={28} className="text-amber-600" />
              </div>
              
              <div className="text-center sm:text-left">
                <p className="font-semibold text-stone-800 mb-1">Had a great experience?</p>
                <p className="text-sm text-stone-500">We&apos;d love to hear from you!</p>
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
