/**
 * Header Organism
 * Main navigation header with logo and call button
 * Premium design with teal color scheme
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Button, Icon } from '../atoms';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Products', href: '#products' },
    { label: 'About', href: '#about' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header className={`
      fixed top-0 left-0 right-0 z-50
      transition-all duration-300
      ${isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg shadow-stone-900/5 py-3' 
        : 'bg-transparent py-5'
      }
    `}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a 
            href="#home" 
            className="flex items-center gap-3 group"
            aria-label="Prasanna Mobile Center - Home"
          >
            {/* Logo Icon */}
            <div className="
              w-11 h-11 sm:w-12 sm:h-12
              rounded-xl
              bg-gradient-to-br from-teal-500 to-emerald-600
              flex items-center justify-center
              group-hover:scale-105
              transition-transform duration-300
              shadow-lg shadow-teal-500/30
            ">
              <Icon name="smartphone" size={24} className="text-white" />
            </div>
            
            {/* Logo Text */}
            <div className="hidden sm:block">
              <h1 className="font-display font-bold text-xl text-stone-900 leading-tight tracking-tight">
                Prasanna
              </h1>
              <p className="text-xs text-stone-500 font-medium -mt-0.5">
                Mobile Center
              </p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="
                  text-stone-600 font-medium
                  hover:text-teal-600
                  transition-colors duration-200
                  relative
                  after:absolute after:bottom-[-4px] after:left-0 after:right-0
                  after:h-0.5 after:bg-gradient-to-r after:from-teal-500 after:to-emerald-500
                  after:scale-x-0 after:origin-center
                  after:transition-transform after:duration-300
                  hover:after:scale-x-100
                "
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            {/* Call Button - Desktop */}
            <Button
              href="tel:0722902299"
              variant="primary"
              size="sm"
              icon={<Icon name="phone" size={18} />}
              ariaLabel="Call us at 072 290 2299"
              className="hidden sm:inline-flex"
            >
              <span className="hidden md:inline">072 290 2299</span>
              <span className="md:hidden">Call</span>
            </Button>

            {/* Mobile Call Button */}
            <a
              href="tel:0722902299"
              className="
                sm:hidden
                w-11 h-11
                rounded-xl
                bg-gradient-to-r from-teal-600 to-teal-500
                flex items-center justify-center
                text-white
                shadow-lg shadow-teal-500/30
                hover:scale-105
                active:scale-95
                transition-transform
              "
              aria-label="Call us"
            >
              <Icon name="phone" size={20} />
            </a>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="
                lg:hidden
                w-11 h-11
                rounded-xl
                bg-stone-100
                hover:bg-stone-200
                flex items-center justify-center
                transition-colors
              "
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              <Icon name={isMobileMenuOpen ? 'close' : 'menu'} size={22} className="text-stone-700" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`
          lg:hidden
          overflow-hidden
          transition-all duration-300
          ${isMobileMenuOpen ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0'}
        `}>
          <nav className="
            bg-white rounded-2xl
            border border-stone-200/80
            shadow-xl shadow-stone-900/10
            p-5
          ">
            {navLinks.map((link, index) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="
                  flex items-center gap-3
                  py-3.5 px-4
                  text-stone-700 font-medium
                  hover:text-teal-600 hover:bg-teal-50
                  rounded-xl
                  transition-colors
                "
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                {link.label}
              </a>
            ))}
            
            {/* Mobile CTA */}
            <div className="mt-5 pt-5 border-t border-stone-200 grid grid-cols-2 gap-3">
              <Button
                href="tel:0722902299"
                variant="primary"
                size="md"
                fullWidth
                icon={<Icon name="phone" size={18} />}
              >
                Call Now
              </Button>
              <Button
                href="https://wa.me/94722902299"
                variant="cta"
                size="md"
                fullWidth
                icon={<Icon name="whatsapp" size={18} />}
                external
              >
                WhatsApp
              </Button>
            </div>
            
            {/* Directions Link */}
            <a
              href="https://maps.app.goo.gl/X4Exp5vf855PqcfZ7"
              target="_blank"
              rel="noopener noreferrer"
              className="
                flex items-center justify-center gap-2
                mt-3 py-3
                text-teal-600 font-medium text-sm
                hover:text-teal-700
                transition-colors
              "
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Icon name="location" size={16} />
              Get Directions
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
