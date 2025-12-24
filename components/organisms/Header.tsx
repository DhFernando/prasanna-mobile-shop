/**
 * Header Organism
 * Main navigation header with logo, navigation, and global search
 * Premium design with teal color scheme
 * Sticky header that appears below announcements banner
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button, Icon } from '../atoms';
import { GlobalSearch } from '../molecules';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle keyboard shortcut for search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCloseSearch = useCallback(() => {
    setIsSearchOpen(false);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/#home' },
    { label: 'Shop', href: '/shop', highlight: true },
    { label: 'Products', href: '/#products' },
    { label: 'About', href: '/#about' },
    { label: 'Reviews', href: '/#reviews' },
    { label: 'Contact', href: '/#contact' },
  ];

  return (
    <>
      <header className={`
        sticky top-0 left-0 right-0 z-50
        transition-all duration-300
        ${isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg shadow-stone-900/5 py-3' 
          : 'bg-white/80 backdrop-blur-sm py-4'
        }
      `}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link 
              href="/" 
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
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`
                    font-medium
                    transition-colors duration-200
                    relative
                    ${link.highlight 
                      ? 'text-teal-600 hover:text-teal-700' 
                      : 'text-stone-600 hover:text-teal-600'
                    }
                    after:absolute after:bottom-[-4px] after:left-0 after:right-0
                    after:h-0.5 after:bg-gradient-to-r after:from-teal-500 after:to-emerald-500
                    after:scale-x-0 after:origin-center
                    after:transition-transform after:duration-300
                    hover:after:scale-x-100
                  `}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search Button - Desktop */}
              <button
                onClick={() => {
                  setIsSearchOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="
                  hidden sm:flex
                  items-center gap-2
                  px-3 py-2
                  rounded-xl
                  bg-stone-100 hover:bg-stone-200
                  transition-colors
                  group
                "
                aria-label="Search products (Ctrl+K)"
              >
                <Icon name="search" size={18} className="text-stone-500" />
                <span className="text-sm text-stone-500 hidden md:inline">Search...</span>
                <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-stone-400 bg-white border border-stone-200 rounded">
                  <span>⌘</span>K
                </kbd>
              </button>

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
                  w-10 h-10
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
                <Icon name="phone" size={18} />
              </a>

              {/* Mobile Search Button */}
              <button
                onClick={() => {
                  setIsSearchOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="
                  sm:hidden
                  w-10 h-10
                  rounded-xl
                  bg-stone-100 hover:bg-stone-200
                  flex items-center justify-center
                  transition-colors
                "
                aria-label="Search products"
              >
                <Icon name="search" size={18} className="text-stone-600" />
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                  setIsSearchOpen(false);
                }}
                className="
                  lg:hidden
                  w-10 h-10
                  rounded-xl
                  bg-stone-100
                  hover:bg-stone-200
                  flex items-center justify-center
                  transition-colors
                "
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMobileMenuOpen}
              >
                <Icon name={isMobileMenuOpen ? 'close' : 'menu'} size={20} className="text-stone-700" />
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className={`
            lg:hidden
            overflow-hidden
            transition-all duration-300
            ${isMobileMenuOpen ? 'max-h-[600px] opacity-100 mt-4' : 'max-h-0 opacity-0'}
          `}>
            <nav className="
              bg-white rounded-2xl
              border border-stone-200/80
              shadow-xl shadow-stone-900/10
              p-5
            ">
              {navLinks.map((link, index) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3
                    py-3.5 px-4
                    font-medium
                    rounded-xl
                    transition-colors
                    ${link.highlight 
                      ? 'text-teal-600 bg-teal-50' 
                      : 'text-stone-700 hover:text-teal-600 hover:bg-teal-50'
                    }
                  `}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {link.highlight && (
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                  )}
                  {link.label}
                </Link>
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

      {/* Global Search Modal */}
      <GlobalSearch isOpen={isSearchOpen} onClose={handleCloseSearch} />
    </>
  );
};

export default Header;
