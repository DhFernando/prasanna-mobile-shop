/**
 * MobileCTA Organism
 * Sticky mobile call-to-action buttons for mobile users
 * Floating buttons for desktop with premium design
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from '../atoms';

const MobileCTA: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show CTA after scrolling past hero
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Sticky Bottom Bar - Mobile Only */}
      <div className={`
        sm:hidden
        fixed bottom-0 left-0 right-0
        z-50
        transition-all duration-300
        ${isVisible ? 'translate-y-0' : 'translate-y-full'}
      `}>
        <div className="
          bg-white/98 backdrop-blur-md
          border-t border-stone-200
          shadow-2xl shadow-stone-900/15
          px-4 py-4
          safe-area-inset-bottom
        ">
          <div className="flex gap-3">
            {/* Call Button */}
            <a
              href="tel:0722902299"
              className="
                flex-1
                flex items-center justify-center gap-2.5
                py-4
                bg-gradient-to-r from-teal-600 to-teal-500
                text-white font-semibold
                rounded-xl
                shadow-lg shadow-teal-500/30
                active:scale-[0.98]
                transition-transform
              "
              aria-label="Call Prasanna Mobile Center"
            >
              <Icon name="phone" size={20} />
              <span>Call Now</span>
            </a>

            {/* WhatsApp Button */}
            <a
              href="https://wa.me/94722902299"
              target="_blank"
              rel="noopener noreferrer"
              className="
                flex-1
                flex items-center justify-center gap-2.5
                py-4
                bg-gradient-to-r from-green-500 to-emerald-500
                text-white font-semibold
                rounded-xl
                shadow-lg shadow-green-500/30
                active:scale-[0.98]
                transition-transform
              "
              aria-label="Chat on WhatsApp"
            >
              <Icon name="whatsapp" size={20} />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Button - Desktop & Tablet */}
      <a
        href="https://wa.me/94722902299"
        target="_blank"
        rel="noopener noreferrer"
        className={`
          hidden sm:flex
          fixed bottom-6 right-6
          z-50
          w-16 h-16
          items-center justify-center
          bg-gradient-to-r from-green-500 to-emerald-500
          text-white
          rounded-2xl
          shadow-2xl shadow-green-500/40
          hover:scale-110 hover:shadow-green-500/50
          active:scale-95
          transition-all duration-300
          group
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}
        `}
        aria-label="Chat on WhatsApp"
      >
        <Icon name="whatsapp" size={30} className="group-hover:scale-110 transition-transform duration-300" />
        
        {/* Tooltip */}
        <span className="
          absolute right-full mr-3
          px-3 py-2
          bg-stone-900 text-white text-sm font-medium
          rounded-lg
          whitespace-nowrap
          opacity-0 group-hover:opacity-100
          -translate-x-2 group-hover:translate-x-0
          transition-all duration-300
          pointer-events-none
        ">
          Chat on WhatsApp
        </span>
        
        {/* Pulse ring */}
        <span className="
          absolute inset-0 rounded-2xl
          bg-green-500/50
          animate-ping
          opacity-25
        " />
      </a>

      {/* Floating Call Button - Desktop & Tablet */}
      <a
        href="tel:0722902299"
        className={`
          hidden sm:flex
          fixed bottom-[6.5rem] right-6
          z-50
          w-16 h-16
          items-center justify-center
          bg-gradient-to-r from-teal-600 to-teal-500
          text-white
          rounded-2xl
          shadow-2xl shadow-teal-500/40
          hover:scale-110 hover:shadow-teal-500/50
          active:scale-95
          transition-all duration-300
          group
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}
        `}
        aria-label="Call us"
        style={{ transitionDelay: '50ms' }}
      >
        <Icon name="phone" size={26} className="group-hover:scale-110 transition-transform duration-300" />
        
        {/* Tooltip */}
        <span className="
          absolute right-full mr-3
          px-3 py-2
          bg-stone-900 text-white text-sm font-medium
          rounded-lg
          whitespace-nowrap
          opacity-0 group-hover:opacity-100
          -translate-x-2 group-hover:translate-x-0
          transition-all duration-300
          pointer-events-none
        ">
          Call 072 290 2299
        </span>
      </a>

      {/* Floating Directions Button - Desktop & Tablet */}
      <a
        href="https://maps.app.goo.gl/X4Exp5vf855PqcfZ7"
        target="_blank"
        rel="noopener noreferrer"
        className={`
          hidden sm:flex
          fixed bottom-[11.5rem] right-6
          z-50
          w-16 h-16
          items-center justify-center
          bg-gradient-to-r from-amber-500 to-orange-500
          text-white
          rounded-2xl
          shadow-2xl shadow-amber-500/40
          hover:scale-110 hover:shadow-amber-500/50
          active:scale-95
          transition-all duration-300
          group
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}
        `}
        aria-label="Get directions"
        style={{ transitionDelay: '100ms' }}
      >
        <Icon name="location" size={26} className="group-hover:scale-110 transition-transform duration-300" />
        
        {/* Tooltip */}
        <span className="
          absolute right-full mr-3
          px-3 py-2
          bg-stone-900 text-white text-sm font-medium
          rounded-lg
          whitespace-nowrap
          opacity-0 group-hover:opacity-100
          -translate-x-2 group-hover:translate-x-0
          transition-all duration-300
          pointer-events-none
        ">
          Get Directions
        </span>
      </a>
    </>
  );
};

export default MobileCTA;
