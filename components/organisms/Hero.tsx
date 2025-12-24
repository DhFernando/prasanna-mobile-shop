/**
 * Hero Organism
 * Main hero section with tagline and CTAs
 * Premium, distinctive design with mesh gradient background
 */

import React from 'react';
import { Button, Icon, HeroHeading, BodyText, BadgeText } from '../atoms';
import { RatingBadge } from '../molecules';

const Hero: React.FC = () => {
  return (
    <section 
      id="home"
      className="
        relative
        min-h-screen
        flex items-center
        pt-24 pb-20 sm:pt-32 sm:pb-28
        overflow-hidden
      "
    >
      {/* Premium Background */}
      <div className="absolute inset-0 -z-10">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-50 via-white to-stone-50" />
        
        {/* Mesh gradient overlay */}
        <div className="absolute inset-0 mesh-gradient opacity-80" />
        
        {/* Animated gradient orbs */}
        <div className="absolute top-20 right-[10%] w-[500px] h-[500px] bg-gradient-to-br from-teal-300/25 to-emerald-200/20 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-20 left-[5%] w-[400px] h-[400px] bg-gradient-to-tr from-orange-200/20 to-amber-100/15 rounded-full blur-3xl animate-float animation-delay-500" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-teal-100/10 to-cyan-100/10 rounded-full blur-3xl" />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 grid-pattern opacity-50" />
        
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-stone-50 to-transparent" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          {/* Open Status Badge */}
          <div className="animate-fade-in-up mb-8">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/80 backdrop-blur-sm rounded-full border border-emerald-200/50 shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-medium text-stone-700">
                Open Now · Closes at 9:30 PM
              </span>
            </div>
          </div>

          {/* Main Heading */}
          <div className="animate-fade-in-up animation-delay-100">
            <HeroHeading className="mb-6">
              Your Trusted{' '}
              <span className="gradient-text">Mobile Accessories</span>
              <br className="hidden sm:block" />
              {' '}Store in Ja-Ela
            </HeroHeading>
          </div>

          {/* Subtitle */}
          <div className="animate-fade-in-up animation-delay-200">
            <BodyText size="xl" className="max-w-2xl mx-auto mb-10 text-stone-600">
              Quality mobile accessories, chargers, covers, and expert repairs. 
              Visit us today for genuine products at affordable prices.
            </BodyText>
          </div>

          {/* CTA Buttons */}
          <div className="animate-fade-in-up animation-delay-300 flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button
              href="tel:0722902299"
              variant="primary"
              size="lg"
              icon={<Icon name="phone" size={22} />}
              ariaLabel="Call Prasanna Mobile Center"
              className="btn-shine min-w-[180px]"
            >
              Call Now
            </Button>
            
            <Button
              href="https://wa.me/94722902299"
              variant="cta"
              size="lg"
              icon={<Icon name="whatsapp" size={22} />}
              external
              ariaLabel="Chat on WhatsApp"
              className="btn-shine min-w-[180px]"
            >
              WhatsApp Us
            </Button>
            
            <Button
              href="https://maps.app.goo.gl/X4Exp5vf855PqcfZ7"
              variant="outline"
              size="lg"
              icon={<Icon name="location" size={22} />}
              external
              ariaLabel="Get directions to our store"
              className="min-w-[180px]"
            >
              Get Directions
            </Button>
          </div>

          {/* Google Rating - Enhanced */}
          <div className="animate-fade-in-up animation-delay-400 flex justify-center mb-14">
            <a 
              href="https://maps.app.goo.gl/X4Exp5vf855PqcfZ7"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <div className="
                flex items-center gap-4
                px-6 py-4
                bg-white rounded-2xl
                border border-stone-200/80
                shadow-lg shadow-stone-200/50
                group-hover:shadow-xl group-hover:border-amber-200
                transition-all duration-300
              ">
                {/* Google Logo */}
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-stone-50 group-hover:bg-amber-50 transition-colors">
                  <Icon name="google" size={24} />
                </div>
                
                {/* Stars */}
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Icon 
                      key={i}
                      name="star" 
                      size={22} 
                      className="text-amber-400 star-glow" 
                    />
                  ))}
                </div>
                
                {/* Rating */}
                <div className="border-l border-stone-200 pl-4">
                  <div className="font-display font-bold text-2xl text-stone-900">5.0</div>
                  <div className="text-xs text-stone-500">Google Rating</div>
                </div>
              </div>
            </a>
          </div>

          {/* Quick Info Cards */}
          <div className="animate-fade-in-up animation-delay-500">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <div className="
                flex items-center justify-center gap-3 
                py-4 px-5
                bg-white/70 backdrop-blur-sm 
                rounded-xl 
                border border-stone-200/50
                hover:bg-white hover:border-teal-200
                transition-all duration-300
              ">
                <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center">
                  <Icon name="location" size={18} className="text-teal-600" />
                </div>
                <span className="text-sm font-medium text-stone-700">Old Negombo Rd, Ja-Ela</span>
              </div>
              
              <div className="
                flex items-center justify-center gap-3 
                py-4 px-5
                bg-white/70 backdrop-blur-sm 
                rounded-xl 
                border border-stone-200/50
                hover:bg-white hover:border-teal-200
                transition-all duration-300
              ">
                <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center">
                  <Icon name="clock" size={18} className="text-teal-600" />
                </div>
                <span className="text-sm font-medium text-stone-700">Open Daily till 9:30 PM</span>
              </div>
              
              <a 
                href="tel:0722902299"
                className="
                  flex items-center justify-center gap-3 
                  py-4 px-5
                  bg-white/70 backdrop-blur-sm 
                  rounded-xl 
                  border border-stone-200/50
                  hover:bg-white hover:border-teal-200
                  transition-all duration-300
                  group
                "
              >
                <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center group-hover:bg-teal-100 transition-colors">
                  <Icon name="phone" size={18} className="text-teal-600" />
                </div>
                <span className="text-sm font-medium text-stone-700">072 290 2299</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:block animate-fade-in animation-delay-700">
        <a 
          href="#products" 
          className="flex flex-col items-center gap-2 text-stone-400 hover:text-teal-600 transition-colors"
          aria-label="Scroll to products section"
        >
          <span className="text-xs font-medium uppercase tracking-wider">Explore</span>
          <div className="w-6 h-10 rounded-full border-2 border-current flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-current rounded-full animate-bounce-soft" />
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;
