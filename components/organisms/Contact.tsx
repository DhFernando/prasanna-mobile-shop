/**
 * Contact Organism
 * Location, contact info, and Google Maps section
 * Premium design with enhanced visual hierarchy
 * Supports dark/light mode
 */

'use client';

import React, { useMemo } from 'react';
import { SectionHeading, BodyText, Subtitle, Button, Icon } from '../atoms';
import { ContactBlock } from '../molecules';
import { useTheme } from '@/lib/theme';
import { useSiteSettings, generateMapsEmbedUrl } from '@/lib/site-settings-context';

const Contact: React.FC = () => {
  const { isDark, currentTheme } = useTheme();
  const { settings } = useSiteSettings();
  
  // Generate embed URL from Google Maps link if not provided
  const mapsEmbedUrl = useMemo(() => {
    if (settings?.address?.googleMapsEmbed) {
      return settings.address.googleMapsEmbed;
    }
    if (settings?.address?.googleMapsUrl) {
      return generateMapsEmbedUrl(settings.address.googleMapsUrl);
    }
    // Fallback to address-based search
    const address = settings?.address?.line1 && settings?.address?.line2 
      ? `${settings.address.line1} ${settings.address.line2}` 
      : settings?.siteName || 'Mobile Store';
    return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
  }, [settings?.address?.googleMapsEmbed, settings?.address?.googleMapsUrl]);
  
  return (
    <section 
      id="contact"
      className={`py-24 sm:py-32 relative overflow-hidden ${isDark ? 'bg-stone-900' : ''}`}
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className={`absolute inset-0 ${
          isDark 
            ? 'bg-gradient-to-b from-stone-900 via-stone-900 to-stone-800' 
            : 'bg-gradient-to-b from-stone-50 via-white to-teal-50/30'
        }`} />
        <div className={`absolute inset-0 section-pattern ${isDark ? 'opacity-10' : 'opacity-30'}`} />
        <div 
          className="absolute bottom-0 left-[10%] w-96 h-96 rounded-full blur-3xl"
          style={{ 
            background: isDark 
              ? `radial-gradient(circle, ${currentTheme.primaryHex}10 0%, transparent 70%)`
              : `radial-gradient(circle, ${currentTheme.primaryHex}20 0%, transparent 70%)`
          }}
        />
        <div className={`absolute top-20 right-[5%] w-80 h-80 rounded-full blur-3xl ${
          isDark ? 'bg-orange-500/10' : 'bg-orange-100/20'
        }`} />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="animate-fade-in-up">
              <Subtitle className={`mb-4 ${isDark ? 'text-stone-400' : ''}`}>Visit Us</Subtitle>
            </div>
            <div className="animate-fade-in-up animation-delay-100">
              <h2 className={`font-display font-bold text-3xl sm:text-4xl mb-6 ${isDark ? 'text-white' : 'text-stone-900'}`}>
                Come <span 
                  className="bg-clip-text text-transparent"
                  style={{ 
                    backgroundImage: `linear-gradient(135deg, ${currentTheme.primaryHex}, ${currentTheme.primaryLight})`
                  }}
                >See Us</span> Today
              </h2>
            </div>
            <div className="animate-fade-in-up animation-delay-200">
              <BodyText size="lg" className={isDark ? 'text-stone-400' : 'text-stone-600'}>
                We&apos;re conveniently located at {settings?.address?.line1 || 'our store'}. 
                Stop by anytime during business hours!
              </BodyText>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
            {/* Contact Info Side */}
            <div className="animate-fade-in-up animation-delay-300">
              <div className="space-y-4 mb-8">
                <ContactBlock
                  type="location"
                  label="Our Address"
                  value={settings?.address?.line1 || 'No 16, Old Negombo Rd'}
                  subValue={settings?.address?.line2 || 'Ja-Ela, Sri Lanka'}
                  href={settings?.address?.googleMapsUrl || 'https://maps.app.goo.gl/X4Exp5vf855PqcfZ7'}
                />
                
                <ContactBlock
                  type="phone"
                  label="Call Us"
                  value={settings?.contact?.phone || '072 290 2299'}
                  subValue="Tap to call directly"
                  href={`tel:${settings?.contact?.phone?.replace(/\s/g, '') || '0722902299'}`}
                />
                
                <ContactBlock
                  type="hours"
                  label="Business Hours"
                  value={settings?.businessHours?.openDays || 'Open Daily'}
                  subValue={`Closes at ${settings?.businessHours?.closeTime || '9:30 PM'}`}
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mb-8">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    href={`tel:${settings?.contact?.phone?.replace(/\s/g, '') || '0722902299'}`}
                    variant="primary"
                    size="lg"
                    icon={<Icon name="phone" size={20} />}
                    fullWidth
                    className="btn-shine"
                  >
                    Call Now
                  </Button>
                  
                  <Button
                    href={`https://wa.me/${settings?.contact?.whatsapp?.replace(/\+/g, '') || '94722902299'}`}
                    variant="cta"
                    size="lg"
                    icon={<Icon name="whatsapp" size={20} />}
                    fullWidth
                    external
                    className="btn-shine"
                  >
                    WhatsApp
                  </Button>
                </div>

                {/* Directions Button */}
                <Button
                  href={settings?.address?.googleMapsUrl || 'https://maps.app.goo.gl/X4Exp5vf855PqcfZ7'}
                  variant="outline"
                  size="lg"
                  icon={<Icon name="location" size={20} />}
                  fullWidth
                  external
                >
                  Open in Google Maps
                </Button>
              </div>

              {/* Social Links */}
              <div className={`
                p-6
                backdrop-blur-sm
                rounded-2xl
                border
                shadow-sm
                ${isDark 
                  ? 'bg-stone-800/80 border-stone-700' 
                  : 'bg-white/80 border-stone-200/60'
                }
              `}>
                <div className="flex items-center gap-4">
                  <div className={`
                    w-12 h-12 rounded-xl
                    flex items-center justify-center
                    flex-shrink-0
                    ${isDark ? 'bg-blue-500/20' : 'bg-blue-50'}
                  `}>
                    <Icon name="facebook" size={24} className="text-blue-500" />
                  </div>
                  
                  <div className="flex-1">
                    <p className={`font-semibold mb-0.5 ${isDark ? 'text-white' : 'text-stone-800'}`}>Follow us on Facebook</p>
                    <p className={`text-sm ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>Stay updated with new arrivals</p>
                  </div>
                  
                  <a
                    href={settings?.social?.facebook || 'https://www.facebook.com/galaxymblstore/'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      px-5 py-2.5
                      bg-blue-600 hover:bg-blue-700
                      text-white text-sm font-semibold
                      rounded-xl
                      transition-colors
                      shadow-md shadow-blue-600/25
                    "
                  >
                    Follow
                  </a>
                </div>
              </div>
            </div>

            {/* Google Map Side */}
            <div className="animate-fade-in-up animation-delay-400">
              <div className={`
                relative
                rounded-2xl
                border
                overflow-hidden
                shadow-xl
                h-[400px] lg:h-full lg:min-h-[520px]
                ${isDark 
                  ? 'bg-stone-800 border-stone-700 shadow-stone-900/50' 
                  : 'bg-white border-stone-200/60 shadow-stone-200/50'
                }
              `}>
                {/* Map */}
                <iframe
                  src={mapsEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`${settings?.siteName || 'Prasanna Mobile Center'} Location`}
                  className={`hover:grayscale-0 transition-all duration-500 ${isDark ? 'grayscale-[30%] opacity-90' : 'grayscale-[10%]'}`}
                />
                
                {/* Map Overlay Card */}
                <div className={`
                  absolute bottom-4 left-4 right-4
                  backdrop-blur-md
                  rounded-xl
                  p-4
                  shadow-lg
                  border
                  ${isDark 
                    ? 'bg-stone-800/95 border-stone-700' 
                    : 'bg-white/95 border-stone-100'
                  }
                `}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${currentTheme.primaryHex}15` }}
                      >
                        <Icon name="location" size={20} style={{ color: currentTheme.primaryHex }} />
                      </div>
                      <div>
                        <p className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-stone-800'}`}>{settings?.siteName || 'Prasanna Mobile Center'}</p>
                        <p className={`text-xs ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>{settings?.address?.line1 || 'No 16, Old Negombo Rd'}, {settings?.address?.line2?.split(',')[0] || 'Ja-Ela'}</p>
                      </div>
                    </div>
                    <a
                      href={settings?.address?.googleMapsUrl || 'https://maps.app.goo.gl/X4Exp5vf855PqcfZ7'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        px-4 py-2
                        text-white text-sm font-medium
                        rounded-lg
                        transition-colors
                        flex items-center gap-1.5
                        flex-shrink-0
                      "
                      style={{ 
                        backgroundColor: currentTheme.primaryHex
                      }}
                    >
                      <span>Directions</span>
                      <Icon name="arrow-right" size={14} />
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Map Caption */}
              <div className="mt-4 text-center">
                <p className={`text-sm flex items-center justify-center gap-2 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                  <span className="text-lg">📍</span>
                  {settings?.address?.line1 ? `Located at ${settings.address.line1}` : 'Easy to find!'} - Visit us today!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
