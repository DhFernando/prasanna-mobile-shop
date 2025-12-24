/**
 * Footer Organism
 * Main footer with navigation, contact info, and social links
 * Premium dark design with teal accents
 */

import React from 'react';
import { Icon, BodyText } from '../atoms';

const Footer: React.FC = () => {
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
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-emerald-400 to-teal-500" />
      
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-[20%] w-80 h-80 bg-teal-900/20 rounded-full blur-3xl" />
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
                <div className="
                  w-14 h-14
                  rounded-xl
                  bg-gradient-to-br from-teal-500 to-emerald-600
                  flex items-center justify-center
                  shadow-lg shadow-teal-500/30
                ">
                  <Icon name="smartphone" size={28} className="text-white" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-2xl">Prasanna Mobile Center</h3>
                  <p className="text-stone-400 text-sm">Your Trusted Mobile Store in Ja-Ela</p>
                </div>
              </div>
              
              <BodyText className="text-stone-400 mb-8 max-w-md leading-relaxed">
                Quality mobile accessories, chargers, covers, and professional repair 
                services. Visit us for genuine products at affordable prices. Open daily until 9:30 PM.
              </BodyText>

              {/* Social Links */}
              <div className="flex items-center gap-3">
                <a
                  href="https://www.facebook.com/galaxymblstore/"
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
                  href="https://wa.me/94722902299"
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
                  href="https://maps.app.goo.gl/X4Exp5vf855PqcfZ7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    w-12 h-12
                    rounded-xl
                    bg-stone-800 hover:bg-teal-600
                    flex items-center justify-center
                    transition-all duration-300
                    hover:scale-105
                    border border-stone-700 hover:border-teal-500
                  "
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
                      hover:text-teal-400
                      transition-colors duration-200
                      group
                    "
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
                  href="tel:0722902299"
                  className="flex items-start gap-3 text-stone-400 hover:text-teal-400 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-stone-800 group-hover:bg-teal-900/50 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors">
                    <Icon name="phone" size={16} />
                  </div>
                  <div>
                    <span className="block font-medium text-white group-hover:text-teal-400 transition-colors">072 290 2299</span>
                    <span className="text-sm">Tap to call</span>
                  </div>
                </a>
                
                <a 
                  href="https://maps.app.goo.gl/X4Exp5vf855PqcfZ7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-stone-400 hover:text-teal-400 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-stone-800 group-hover:bg-teal-900/50 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors">
                    <Icon name="location" size={16} />
                  </div>
                  <div>
                    <span className="block font-medium text-white group-hover:text-teal-400 transition-colors">No 16, Old Negombo Rd</span>
                    <span className="text-sm">Ja-Ela, Sri Lanka</span>
                  </div>
                </a>
                
                <div className="flex items-start gap-3 text-stone-400">
                  <div className="w-8 h-8 rounded-lg bg-stone-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon name="clock" size={16} />
                  </div>
                  <div>
                    <span className="block font-medium text-white">Open Daily</span>
                    <span className="text-sm">Closes at 9:30 PM</span>
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
              © {currentYear} Prasanna Mobile Center. All rights reserved.
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
