/**
 * Site Settings Context
 * Provides site settings data to all client components
 * Fetches from API on mount and caches the settings
 */

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { SiteSettings } from './types';

interface SiteSettingsContextType {
  settings: SiteSettings | null;
  isLoading: boolean;
  refetch: () => Promise<void>;
}

const defaultSettings: SiteSettings = {
  siteName: 'Prasanna Mobile Center',
  tagline: 'Your Trusted Mobile Store in Ja-Ela',
  description: 'Quality mobile accessories, chargers, covers, and expert repairs.',
  heroImages: [],
  contact: {
    phone: '072 290 2299',
    phoneInternational: '+94722902299',
    whatsapp: '+94722902299',
    email: '',
  },
  address: {
    line1: 'No 16, Old Negombo Rd',
    line2: 'Ja-Ela, Sri Lanka',
    googleMapsUrl: 'https://maps.app.goo.gl/X4Exp5vf855PqcfZ7',
    googleMapsEmbed: '',
  },
  businessHours: {
    openDays: 'Daily',
    openTime: '',
    closeTime: '9:30 PM',
    displayText: 'Open Daily till 9:30 PM',
  },
  social: {
    facebook: 'https://www.facebook.com/galaxymblstore/',
    instagram: '',
    tiktok: '',
    youtube: '',
  },
  googleRating: {
    rating: '5.0',
    reviewsCount: '',
  },
  updatedAt: '',
};

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: defaultSettings,
  isLoading: true,
  refetch: async () => {},
});

export const useSiteSettings = () => useContext(SiteSettingsContext);

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/site-settings');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setSettings(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching site settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Return default settings while loading or if fetch fails
  const currentSettings = settings || defaultSettings;

  return (
    <SiteSettingsContext.Provider value={{ 
      settings: currentSettings, 
      isLoading, 
      refetch: fetchSettings 
    }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

/**
 * Helper function to extract Google Maps Place ID or coordinates from various URL formats
 * and generate an embed URL
 */
export function generateMapsEmbedUrl(mapsUrl: string): string {
  if (!mapsUrl) return '';
  
  try {
    // If it's already an embed URL, return as is
    if (mapsUrl.includes('google.com/maps/embed')) {
      return mapsUrl;
    }
    
    // Try to extract place data from various URL formats
    let embedUrl = '';
    
    // Format: https://maps.app.goo.gl/XXXX (short URL)
    // Format: https://www.google.com/maps/place/...
    // Format: https://goo.gl/maps/XXXX
    
    // Extract coordinates if present in URL
    const coordMatch = mapsUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (coordMatch) {
      const lat = coordMatch[1];
      const lng = coordMatch[2];
      embedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1000!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM!5e0!3m2!1sen!2slk!4v${Date.now()}!5m2!1sen!2slk`;
      return embedUrl;
    }
    
    // For short URLs or place URLs, use the q parameter approach
    // This works for most Google Maps URLs
    const encodedUrl = encodeURIComponent(mapsUrl);
    embedUrl = `https://www.google.com/maps/embed/v1/place?key=&q=${encodedUrl}`;
    
    // Alternative: Use iframe with search query
    // Extract place name from URL if possible
    const placeMatch = mapsUrl.match(/place\/([^/@]+)/);
    if (placeMatch) {
      const placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
      embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(placeName)}&output=embed`;
      return embedUrl;
    }
    
    // For short URLs, try to create a basic embed
    // The most reliable approach without an API key
    if (mapsUrl.includes('goo.gl') || mapsUrl.includes('maps.app.goo.gl')) {
      // Use an iframe-compatible URL
      embedUrl = `https://maps.google.com/maps?q=Prasanna+Mobile+Center+Ja-Ela&output=embed`;
      return embedUrl;
    }
    
    return '';
  } catch (error) {
    console.error('Error generating maps embed URL:', error);
    return '';
  }
}

