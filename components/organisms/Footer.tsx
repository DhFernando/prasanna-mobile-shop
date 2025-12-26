/**
 * Footer Organism
 * Main footer with navigation, contact info, and social links
 * Premium dark design with theme accents
 * Supports dark/light mode
 */

'use client';

import React from 'react';
import { Icon, BodyText } from '../atoms';
import { useTheme } from '@/lib/theme';
import { useSiteSettings } from '@/lib/site-settings-context';

const Footer: React.FC = () => {
  const { currentTheme } = useTheme();
  const { settings } = useSiteSettings();
  const quickLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Products', href: '#products' },
    { label: 'About Us', href: '#about' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'Contact', href: '#contact' },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-stone-900 text-white relative overflow-hidden">
      {/* Decorative Top Border */}
      <div 
        className="absolute top-0 left-0 right-0 h-1"
        style={{ 
          background: `linear-gradient(90deg, ${currentTheme.primaryHex}, ${currentTheme.primaryLight}, ${currentTheme.primaryHex})`
        }}
      />
      
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div 
          className="absolute top-0 left-[20%] w-80 h-80 rounded-full blur-3xl"
          style={{ background: `${currentTheme.primaryHex}15` }}
        />
        <div className="absolute bottom-0 right-[10%] w-96 h-96 bg-stone-800/50 rounded-full blur-3xl" />
      </div>
      
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-10">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              {/* Logo */}
              <div className="flex items-center gap-4 mb-6">
                <div 
                  className="
                    w-14 h-14
                    rounded-xl
                    flex items-center justify-center
                    shadow-lg
                  "
                  style={{ 
                    background: `linear-gradient(135deg, ${currentTheme.primaryHex}, ${currentTheme.primaryDark})`,
                    boxShadow: `0 4px 14px ${currentTheme.primaryHex}40`
                  }}
                >
                  <Icon name="smartphone" size={28} className="text-white" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-2xl">{settings?.siteName || 'Prasanna Mobile Center'}</h3>
                  <p className="text-stone-400 text-sm">{settings?.tagline || 'Your Trusted Mobile Store in Ja-Ela'}</p>
                </div>
              </div>
              
              <BodyText className="text-stone-400 mb-8 max-w-md leading-relaxed">
                {settings?.description || 'Quality mobile accessories, chargers, covers, and professional repair services. Visit us for genuine products at affordable prices.'}
              </BodyText>

              {/* Social Links */}
              <div className="flex items-center gap-3">
                <a
                  href={settings?.social?.facebook || 'https://www.facebook.com/galaxymblstore/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    w-12 h-12
                    rounded-xl
                    bg-stone-800 hover:bg-blue-600
                    flex items-center justify-center
                    transition-all duration-300
                    hover:scale-105
                    border border-stone-700 hover:border-blue-500
                  "
                  aria-label="Follow us on Facebook"
                >
                  <Icon name="facebook" size={22} />
                </a>
                <a
                  href={`https://wa.me/${settings?.contact?.whatsapp?.replace(/\+/g, '') || '94722902299'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    w-12 h-12
                    rounded-xl
                    bg-stone-800 hover:bg-green-600
                    flex items-center justify-center
                    transition-all duration-300
                    hover:scale-105
                    border border-stone-700 hover:border-green-500
                  "
                  aria-label="Chat on WhatsApp"
                >
                  <Icon name="whatsapp" size={22} />
                </a>
                <a
                  href={settings?.address?.googleMapsUrl || 'https://maps.app.goo.gl/X4Exp5vf855PqcfZ7'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    w-12 h-12
                    rounded-xl
                    bg-stone-800 
                    flex items-center justify-center
                    transition-all duration-300
                    hover:scale-105
                    border border-stone-700
                  "
                  style={{ 
                    '--hover-bg': currentTheme.primaryHex
                  } as React.CSSProperties}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = currentTheme.primaryHex;
                    e.currentTarget.style.borderColor = currentTheme.primaryHex;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '';
                    e.currentTarget.style.borderColor = '';
                  }}
                  aria-label="Find us on Google Maps"
                >
                  <Icon name="location" size={22} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-display font-semibold text-lg mb-6 text-white">Quick Links</h4>
              <nav className="space-y-3">
                {quickLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="
                      flex items-center gap-2
                      text-stone-400
                      transition-colors duration-200
                      group
                    "
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = currentTheme.primaryLight;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '';
                    }}
                  >
                    <Icon 
                      name="arrow-right" 
                      size={14} 
                      className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" 
                    />
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-display font-semibold text-lg mb-6 text-white">Contact Us</h4>
              <div className="space-y-5">
                <a 
                  href={`tel:${settings?.contact?.phone?.replace(/\s/g, '') || '0722902299'}`}
                  className="flex items-start gap-3 text-stone-400 transition-colors group"
                >
                  <div 
                    className="w-8 h-8 rounded-lg bg-stone-800 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors"
                    style={{ backgroundColor: `${currentTheme.primaryHex}15` }}
                  >
                    <Icon name="phone" size={16} style={{ color: currentTheme.primaryLight }} />
                  </div>
                  <div>
                    <span className="block font-medium text-white group-hover:opacity-80 transition-opacity">{settings?.contact?.phone || '072 290 2299'}</span>
                    <span className="text-sm">Tap to call</span>
                  </div>
                </a>
                
                <a 
                  href={settings?.address?.googleMapsUrl || 'https://maps.app.goo.gl/X4Exp5vf855PqcfZ7'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-stone-400 transition-colors group"
                >
                  <div 
                    className="w-8 h-8 rounded-lg bg-stone-800 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors"
                    style={{ backgroundColor: `${currentTheme.primaryHex}15` }}
                  >
                    <Icon name="location" size={16} style={{ color: currentTheme.primaryLight }} />
                  </div>
                  <div>
                    <span className="block font-medium text-white group-hover:opacity-80 transition-opacity">{settings?.address?.line1 || 'No 16, Old Negombo Rd'}</span>
                    <span className="text-sm">{settings?.address?.line2 || 'Ja-Ela, Sri Lanka'}</span>
                  </div>
                </a>
                
                <div className="flex items-start gap-3 text-stone-400">
                  <div 
                    className="w-8 h-8 rounded-lg bg-stone-800 flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: `${currentTheme.primaryHex}15` }}
                  >
                    <Icon name="clock" size={16} style={{ color: currentTheme.primaryLight }} />
                  </div>
                  <div>
                    <span className="block font-medium text-white">{settings?.businessHours?.openDays || 'Open Daily'}</span>
                    <span className="text-sm">Closes at {settings?.businessHours?.closeTime || '9:30 PM'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-stone-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-stone-500 text-sm text-center sm:text-left">
              © {currentYear} {settings?.siteName || 'Prasanna Mobile Center'}. All rights reserved.
            </p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <Icon key={i} name="star" size={14} className="text-amber-400" />
                ))}
              </div>
              <span className="text-stone-400 text-sm font-medium">5.0 on Google</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
