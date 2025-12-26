/**
 * Header Organism
 * Main navigation header with logo, navigation, and global search
 * Premium design with theme color scheme
 * Sticky header that appears below announcements banner
 * Supports dark/light mode
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button, Icon } from '../atoms';
import { GlobalSearch, ThemeSwitcher } from '../molecules';
import { useTheme } from '@/lib/theme';
import { useSiteSettings } from '@/lib/site-settings-context';

const Header: React.FC = () => {
  const { isDark, currentTheme } = useTheme();
  const { settings } = useSiteSettings();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // Extract site name parts
  const siteNameParts = settings?.siteName?.split(' ') || ['Prasanna', 'Mobile', 'Center'];
  const firstPart = siteNameParts[0] || 'Prasanna';
  const restPart = siteNameParts.slice(1).join(' ') || 'Mobile Center';

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
          ? isDark
            ? 'bg-stone-900/95 backdrop-blur-md shadow-lg shadow-stone-900/50 py-3'
            : 'bg-white/95 backdrop-blur-md shadow-lg shadow-stone-900/5 py-3' 
          : isDark
            ? 'bg-stone-900/80 backdrop-blur-sm py-4'
            : 'bg-white/80 backdrop-blur-sm py-4'
        }
      `}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center gap-3 group"
              aria-label={`${settings?.siteName || 'Prasanna Mobile Center'} - Home`}
            >
              {/* Logo Icon */}
              <div 
                className="
                  w-11 h-11 sm:w-12 sm:h-12
                  rounded-xl
                  flex items-center justify-center
                  group-hover:scale-105
                  transition-transform duration-300
                  shadow-lg
                "
                style={{ 
                  background: `linear-gradient(135deg, ${currentTheme.primaryHex}, ${currentTheme.primaryDark})`,
                  boxShadow: `0 4px 14px ${currentTheme.primaryHex}40`
                }}
              >
                <Icon name="smartphone" size={24} className="text-white" />
              </div>
              
              {/* Logo Text */}
              <div className="hidden sm:block">
                <h1 className={`font-display font-bold text-xl leading-tight tracking-tight ${isDark ? 'text-white' : 'text-stone-900'}`}>
                  {firstPart}
                </h1>
                <p className={`text-xs font-medium -mt-0.5 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                  {restPart}
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
                    after:absolute after:bottom-[-4px] after:left-0 after:right-0
                    after:h-0.5 after:scale-x-0 after:origin-center
                    after:transition-transform after:duration-300
                    hover:after:scale-x-100
                    ${link.highlight 
                      ? '' 
                      : isDark
                        ? 'text-stone-300 hover:text-white'
                        : 'text-stone-600 hover:text-stone-900'
                    }
                  `}
                  style={link.highlight ? { color: currentTheme.primaryHex } : {}}
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
                className={`
                  hidden sm:flex
                  items-center gap-2
                  px-3 py-2
                  rounded-xl
                  transition-colors
                  group
                  ${isDark 
                    ? 'bg-stone-800 hover:bg-stone-700' 
                    : 'bg-stone-100 hover:bg-stone-200'
                  }
                `}
                aria-label="Search products (Ctrl+K)"
              >
                <Icon name="search" size={18} className={isDark ? 'text-stone-400' : 'text-stone-500'} />
                <span className={`text-sm hidden md:inline ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>Search...</span>
                <kbd className={`hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono rounded ${
                  isDark 
                    ? 'text-stone-500 bg-stone-700 border border-stone-600' 
                    : 'text-stone-400 bg-white border border-stone-200'
                }`}>
                  <span>⌘</span>K
                </kbd>
              </button>

              {/* Theme Switcher - User only (dark/light mode) */}
              <div className="hidden sm:block">
                <ThemeSwitcher compact isAdmin={false} />
              </div>

              {/* Call Button - Desktop */}
              <Button
                href={`tel:${settings?.contact?.phone?.replace(/\s/g, '') || '0722902299'}`}
                variant="primary"
                size="sm"
                icon={<Icon name="phone" size={18} />}
                ariaLabel={`Call us at ${settings?.contact?.phone || '072 290 2299'}`}
                className="hidden sm:inline-flex"
              >
                <span className="hidden md:inline">{settings?.contact?.phone || '072 290 2299'}</span>
                <span className="md:hidden">Call</span>
              </Button>

              {/* Mobile Call Button */}
              <a
                href={`tel:${settings?.contact?.phone?.replace(/\s/g, '') || '0722902299'}`}
                className="
                  sm:hidden
                  w-10 h-10
                  rounded-xl
                  flex items-center justify-center
                  text-white
                  shadow-lg
                  hover:scale-105
                  active:scale-95
                  transition-transform
                "
                style={{ 
                  background: `linear-gradient(135deg, ${currentTheme.primaryHex}, ${currentTheme.primaryDark})`,
                  boxShadow: `0 4px 14px ${currentTheme.primaryHex}40`
                }}
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
                className={`
                  sm:hidden
                  w-10 h-10
                  rounded-xl
                  flex items-center justify-center
                  transition-colors
                  ${isDark 
                    ? 'bg-stone-800 hover:bg-stone-700' 
                    : 'bg-stone-100 hover:bg-stone-200'
                  }
                `}
                aria-label="Search products"
              >
                <Icon name="search" size={18} className={isDark ? 'text-stone-300' : 'text-stone-600'} />
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                  setIsSearchOpen(false);
                }}
                className={`
                  lg:hidden
                  w-10 h-10
                  rounded-xl
                  flex items-center justify-center
                  transition-colors
                  ${isDark 
                    ? 'bg-stone-800 hover:bg-stone-700' 
                    : 'bg-stone-100 hover:bg-stone-200'
                  }
                `}
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMobileMenuOpen}
              >
                <Icon name={isMobileMenuOpen ? 'close' : 'menu'} size={20} className={isDark ? 'text-stone-300' : 'text-stone-700'} />
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
            <nav className={`
              rounded-2xl
              border shadow-xl
              p-5
              ${isDark 
                ? 'bg-stone-800 border-stone-700 shadow-stone-900/50' 
                : 'bg-white border-stone-200/80 shadow-stone-900/10'
              }
            `}>
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
                      ? '' 
                      : isDark
                        ? 'text-stone-300 hover:bg-stone-700 hover:text-white'
                        : 'text-stone-700 hover:bg-stone-50 hover:text-stone-900'
                    }
                  `}
                  style={link.highlight ? { 
                    color: currentTheme.primaryHex,
                    backgroundColor: `${currentTheme.primaryHex}15`
                  } : {}}
                >
                  {link.highlight && (
                    <span 
                      className="w-1.5 h-1.5 rounded-full" 
                      style={{ backgroundColor: currentTheme.primaryHex }}
                    />
                  )}
                  {link.label}
                </Link>
              ))}
              
              {/* Mobile CTA */}
              <div className={`mt-5 pt-5 border-t grid grid-cols-2 gap-3 ${isDark ? 'border-stone-700' : 'border-stone-200'}`}>
                <Button
                  href={`tel:${settings?.contact?.phone?.replace(/\s/g, '') || '0722902299'}`}
                  variant="primary"
                  size="md"
                  fullWidth
                  icon={<Icon name="phone" size={18} />}
                >
                  Call Now
                </Button>
                <Button
                  href={`https://wa.me/${settings?.contact?.whatsapp?.replace(/\+/g, '') || '94722902299'}`}
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
                href={settings?.address?.googleMapsUrl || 'https://maps.app.goo.gl/X4Exp5vf855PqcfZ7'}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  flex items-center justify-center gap-2
                  mt-3 py-3
                  font-medium text-sm
                  transition-colors
                "
                style={{ color: currentTheme.primaryHex }}
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
