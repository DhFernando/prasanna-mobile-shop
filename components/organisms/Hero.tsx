/**
 * Hero Organism
 * Main hero section with tagline and CTAs
 * Premium, distinctive design with mesh gradient background
 * Supports dark/light mode
 */

'use client';

import React from 'react';
import { Button, Icon, HeroHeading, BodyText } from '../atoms';
import { useTheme } from '@/lib/theme';
import { useSiteSettings } from '@/lib/site-settings-context';

const Hero: React.FC = () => {
  const { isDark, currentTheme } = useTheme();
  const { settings } = useSiteSettings();
  
  return (
    <section 
      id="home"
      className={`
        relative
        min-h-[calc(100vh-60px)]
        flex items-center
        py-16 sm:py-20
        overflow-hidden
        ${isDark ? 'bg-stone-900' : ''}
      `}
    >
      {/* Premium Background */}
      <div className="absolute inset-0 -z-10">
        {/* Base gradient */}
        <div className={`absolute inset-0 ${
          isDark 
            ? 'bg-gradient-to-b from-stone-900 via-stone-900 to-stone-800' 
            : 'bg-gradient-to-b from-stone-50 via-white to-stone-50'
        }`} />
        
        {/* Mesh gradient overlay */}
        {!isDark && <div className="absolute inset-0 mesh-gradient opacity-80" />}
        
        {/* Animated gradient orbs */}
        <div 
          className="absolute top-20 right-[10%] w-[500px] h-[500px] rounded-full blur-3xl animate-float"
          style={{ 
            background: isDark 
              ? `radial-gradient(circle, ${currentTheme.primaryHex}15 0%, transparent 70%)`
              : `radial-gradient(circle, ${currentTheme.primaryHex}25 0%, transparent 70%)`
          }}
        />
        <div className={`absolute -bottom-20 left-[5%] w-[400px] h-[400px] rounded-full blur-3xl animate-float animation-delay-500 ${
          isDark ? 'bg-orange-500/10' : 'bg-gradient-to-tr from-orange-200/20 to-amber-100/15'
        }`} />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl"
          style={{ 
            background: isDark 
              ? `radial-gradient(circle, ${currentTheme.primaryHex}08 0%, transparent 70%)`
              : `radial-gradient(circle, ${currentTheme.primaryHex}10 0%, transparent 70%)`
          }}
        />
        
        {/* Subtle grid pattern */}
        <div className={`absolute inset-0 grid-pattern ${isDark ? 'opacity-20' : 'opacity-50'}`} />
        
        {/* Bottom fade */}
        <div className={`absolute bottom-0 left-0 right-0 h-32 ${
          isDark 
            ? 'bg-gradient-to-t from-stone-900 to-transparent' 
            : 'bg-gradient-to-t from-stone-50 to-transparent'
        }`} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          {/* Open Status Badge */}
          <div className="animate-fade-in-up mb-8">
            <div className={`inline-flex items-center gap-3 px-5 py-2.5 backdrop-blur-sm rounded-full border shadow-sm ${
              isDark 
                ? 'bg-stone-800/80 border-emerald-500/30' 
                : 'bg-white/80 border-emerald-200/50'
            }`}>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className={`text-sm font-medium ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                Open Now · Closes at {settings?.businessHours?.closeTime || '9:30 PM'}
              </span>
            </div>
          </div>

          {/* Main Heading */}
          <div className="animate-fade-in-up animation-delay-100">
            <h1 className={`font-display font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight tracking-tight mb-6 ${
              isDark ? 'text-white' : 'text-stone-900'
            }`}>
              Your Trusted{' '}
              <span 
                className="bg-clip-text text-transparent animate-gradient"
                style={{ 
                  backgroundImage: `linear-gradient(135deg, ${currentTheme.primaryHex}, ${currentTheme.primaryLight}, ${currentTheme.primaryHex})`,
                  backgroundSize: '200% auto'
                }}
              >
                Mobile Accessories
              </span>
              <br className="hidden sm:block" />
              {' '}Store{settings?.address?.line2 ? ` in ${settings.address.line2.split(',')[0]}` : ''}
            </h1>
          </div>

          {/* Subtitle */}
          <div className="animate-fade-in-up animation-delay-200">
            <BodyText size="xl" className={`max-w-2xl mx-auto mb-10 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
              {settings?.description || 'Quality mobile accessories, chargers, covers, and expert repairs. Visit us today for genuine products at affordable prices.'}
            </BodyText>
          </div>

          {/* CTA Buttons */}
          <div className="animate-fade-in-up animation-delay-300 flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button
              href={`tel:${settings?.contact?.phone?.replace(/\s/g, '') || '0722902299'}`}
              variant="primary"
              size="lg"
              icon={<Icon name="phone" size={22} />}
              ariaLabel={`Call ${settings?.siteName || 'Prasanna Mobile Center'}`}
              className="btn-shine min-w-[180px]"
            >
              Call Now
            </Button>
            
            <Button
              href={`https://wa.me/${settings?.contact?.whatsapp?.replace(/\+/g, '') || '94722902299'}`}
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
              href={settings?.address?.googleMapsUrl || 'https://maps.app.goo.gl/X4Exp5vf855PqcfZ7'}
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
              href={settings?.address?.googleMapsUrl || 'https://maps.app.goo.gl/X4Exp5vf855PqcfZ7'}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <div className={`
                flex items-center gap-4
                px-6 py-4
                rounded-2xl
                border
                shadow-lg
                group-hover:shadow-xl group-hover:border-amber-200
                transition-all duration-300
                ${isDark 
                  ? 'bg-stone-800 border-stone-700 shadow-stone-900/50' 
                  : 'bg-white border-stone-200/80 shadow-stone-200/50'
                }
              `}>
                {/* Google Logo */}
                <div className={`flex items-center justify-center w-10 h-10 rounded-xl transition-colors ${
                  isDark 
                    ? 'bg-stone-700 group-hover:bg-amber-500/20' 
                    : 'bg-stone-50 group-hover:bg-amber-50'
                }`}>
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
                <div className={`border-l pl-4 ${isDark ? 'border-stone-700' : 'border-stone-200'}`}>
                  <div className={`font-display font-bold text-2xl ${isDark ? 'text-white' : 'text-stone-900'}`}>{settings?.googleRating?.rating || '5.0'}</div>
                  <div className={`text-xs ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>Google Rating</div>
                </div>
              </div>
            </a>
          </div>

          {/* Quick Info Cards */}
          <div className="animate-fade-in-up animation-delay-500">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <div className={`
                flex items-center justify-center gap-3 
                py-4 px-5
                backdrop-blur-sm 
                rounded-xl 
                border
                transition-all duration-300
                ${isDark 
                  ? 'bg-stone-800/70 border-stone-700 hover:bg-stone-800 hover:border-stone-600' 
                  : 'bg-white/70 border-stone-200/50 hover:bg-white hover:border-teal-200'
                }
              `}>
                <div 
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${currentTheme.primaryHex}15` }}
                >
                  <Icon name="location" size={18} style={{ color: currentTheme.primaryHex }} />
                </div>
                <span className={`text-sm font-medium ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>{settings?.address?.line1 || 'Old Negombo Rd, Ja-Ela'}</span>
              </div>
              
              <div className={`
                flex items-center justify-center gap-3 
                py-4 px-5
                backdrop-blur-sm 
                rounded-xl 
                border
                transition-all duration-300
                ${isDark 
                  ? 'bg-stone-800/70 border-stone-700 hover:bg-stone-800 hover:border-stone-600' 
                  : 'bg-white/70 border-stone-200/50 hover:bg-white hover:border-teal-200'
                }
              `}>
                <div 
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${currentTheme.primaryHex}15` }}
                >
                  <Icon name="clock" size={18} style={{ color: currentTheme.primaryHex }} />
                </div>
                <span className={`text-sm font-medium ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>{settings?.businessHours?.displayText || 'Open Daily till 9:30 PM'}</span>
              </div>
              
              <a 
                href={`tel:${settings?.contact?.phone?.replace(/\s/g, '') || '0722902299'}`}
                className={`
                  flex items-center justify-center gap-3 
                  py-4 px-5
                  backdrop-blur-sm 
                  rounded-xl 
                  border
                  transition-all duration-300
                  group
                  ${isDark 
                    ? 'bg-stone-800/70 border-stone-700 hover:bg-stone-800 hover:border-stone-600' 
                    : 'bg-white/70 border-stone-200/50 hover:bg-white hover:border-teal-200'
                  }
                `}
              >
                <div 
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
                  style={{ backgroundColor: `${currentTheme.primaryHex}15` }}
                >
                  <Icon name="phone" size={18} style={{ color: currentTheme.primaryHex }} />
                </div>
                <span className={`text-sm font-medium ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>{settings?.contact?.phone || '072 290 2299'}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:block animate-fade-in animation-delay-700">
        <a 
          href="#products" 
          className={`flex flex-col items-center gap-2 transition-colors ${
            isDark ? 'text-stone-500 hover:text-stone-300' : 'text-stone-400 hover:text-stone-600'
          }`}
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
