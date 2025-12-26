/**
 * Site Settings Page
 * Manage business information, contact details, and social links
 * Supports dark/light mode
 */

'use client';

import React, { useEffect, useState } from 'react';
import { FormInput } from '@/components/admin';
import { Icon } from '@/components/atoms';
import { useTheme } from '@/lib/theme';
import { SiteSettings } from '@/lib/types';

// Function to generate Google Maps embed URL from a share link
function generateMapsEmbedFromLink(mapsUrl: string): string {
  if (!mapsUrl) return '';
  
  try {
    // If it's already an embed URL, return as is
    if (mapsUrl.includes('google.com/maps/embed')) {
      return mapsUrl;
    }
    
    // For Google Maps short URLs and share links
    // Use the simpler search-based embed which works with any location
    // Extract query from the URL if possible
    
    // Try to extract place name from URL
    const placeMatch = mapsUrl.match(/place\/([^/@]+)/);
    if (placeMatch) {
      const placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
      return `https://maps.google.com/maps?q=${encodeURIComponent(placeName)}&output=embed`;
    }
    
    // For short URLs (goo.gl, maps.app.goo.gl), we can't resolve them
    // So we'll use the address as the query instead
    return '';
  } catch (error) {
    console.error('Error generating maps embed URL:', error);
    return '';
  }
}

export default function SiteSettingsPage() {
  const { isDark, currentTheme } = useTheme();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Common country codes
  const countryCodes = [
    { code: '+94', country: 'Sri Lanka', flag: '🇱🇰' },
    { code: '+1', country: 'USA/Canada', flag: '🇺🇸' },
    { code: '+44', country: 'UK', flag: '🇬🇧' },
    { code: '+91', country: 'India', flag: '🇮🇳' },
    { code: '+61', country: 'Australia', flag: '🇦🇺' },
    { code: '+49', country: 'Germany', flag: '🇩🇪' },
    { code: '+33', country: 'France', flag: '🇫🇷' },
    { code: '+971', country: 'UAE', flag: '🇦🇪' },
    { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' },
    { code: '+65', country: 'Singapore', flag: '🇸🇬' },
    { code: '+60', country: 'Malaysia', flag: '🇲🇾' },
    { code: '+81', country: 'Japan', flag: '🇯🇵' },
    { code: '+82', country: 'South Korea', flag: '🇰🇷' },
    { code: '+86', country: 'China', flag: '🇨🇳' },
    { code: '+39', country: 'Italy', flag: '🇮🇹' },
    { code: '+34', country: 'Spain', flag: '🇪🇸' },
    { code: '+55', country: 'Brazil', flag: '🇧🇷' },
    { code: '+27', country: 'South Africa', flag: '🇿🇦' },
    { code: '+234', country: 'Nigeria', flag: '🇳🇬' },
    { code: '+254', country: 'Kenya', flag: '🇰🇪' },
  ];

  // Helper to extract country code and local number from international format
  const parsePhoneNumber = (internationalNumber: string): { countryCode: string; localNumber: string } => {
    if (!internationalNumber) return { countryCode: '+94', localNumber: '' };
    
    // Try to match a country code from our list
    for (const { code } of countryCodes) {
      if (internationalNumber.startsWith(code)) {
        return { countryCode: code, localNumber: internationalNumber.slice(code.length) };
      }
    }
    
    // Default to Sri Lanka if no match
    return { countryCode: '+94', localNumber: internationalNumber.replace(/^\+/, '') };
  };

  // Form state
  const [formData, setFormData] = useState({
    siteName: '',
    tagline: '',
    description: '',
    phone: '',
    phoneCountryCode: '+94',
    phoneLocal: '',
    whatsappCountryCode: '+94',
    whatsappLocal: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    googleMapsUrl: '',
    googleMapsEmbed: '',
    openDays: '',
    openTime: '',
    closeTime: '',
    hoursDisplayText: '',
    facebook: '',
    instagram: '',
    tiktok: '',
    youtube: '',
    googleRating: '',
    reviewsCount: '',
  });

  // Fetch settings
  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/site-settings');
        const data = await res.json();
        if (data.success && data.data) {
          const s = data.data as SiteSettings;
          setSettings(s);
          // Parse phone numbers
          const phoneInfo = parsePhoneNumber(s.contact?.phoneInternational || '');
          const whatsappInfo = parsePhoneNumber(s.contact?.whatsapp || '');
          
          setFormData({
            siteName: s.siteName || '',
            tagline: s.tagline || '',
            description: s.description || '',
            phone: s.contact?.phone || '',
            phoneCountryCode: phoneInfo.countryCode,
            phoneLocal: phoneInfo.localNumber,
            whatsappCountryCode: whatsappInfo.countryCode,
            whatsappLocal: whatsappInfo.localNumber,
            email: s.contact?.email || '',
            addressLine1: s.address?.line1 || '',
            addressLine2: s.address?.line2 || '',
            googleMapsUrl: s.address?.googleMapsUrl || '',
            googleMapsEmbed: s.address?.googleMapsEmbed || '',
            openDays: s.businessHours?.openDays || '',
            openTime: s.businessHours?.openTime || '',
            closeTime: s.businessHours?.closeTime || '',
            hoursDisplayText: s.businessHours?.displayText || '',
            facebook: s.social?.facebook || '',
            instagram: s.social?.instagram || '',
            tiktok: s.social?.tiktok || '',
            youtube: s.social?.youtube || '',
            googleRating: s.googleRating?.rating || '',
            reviewsCount: s.googleRating?.reviewsCount || '',
          });
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    
    // Combine country codes with local numbers
    const dataToSave = {
      ...formData,
      phoneInternational: `${formData.phoneCountryCode}${formData.phoneLocal.replace(/^0+/, '')}`,
      whatsapp: `${formData.whatsappCountryCode}${formData.whatsappLocal.replace(/^0+/, '')}`,
    };
    
    try {
      const res = await fetch('/api/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave),
      });
      
      if (res.ok) {
        setSaveMessage({ type: 'success', text: 'Settings saved successfully!' });
        setTimeout(() => setSaveMessage(null), 3000);
      } else {
        setSaveMessage({ type: 'error', text: 'Failed to save settings' });
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveMessage({ type: 'error', text: 'An error occurred while saving' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div 
          className="w-8 h-8 border-3 rounded-full animate-spin"
          style={{ borderColor: `${currentTheme.primaryHex}30`, borderTopColor: currentTheme.primaryHex }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className={`font-display text-2xl sm:text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-stone-900'}`}>
            Site Settings
          </h1>
          <p className={isDark ? 'text-stone-400' : 'text-stone-500'}>
            Manage your business information and contact details
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-white font-semibold rounded-xl shadow-lg transition-all hover:opacity-90 disabled:opacity-50"
          style={{ 
            background: `linear-gradient(135deg, ${currentTheme.primaryHex}, ${currentTheme.primaryDark})`,
            boxShadow: `0 4px 14px ${currentTheme.primaryHex}40`
          }}
        >
          {isSaving ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Icon name="check" size={18} />
          )}
          Save Changes
        </button>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
          saveMessage.type === 'success' 
            ? isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
            : isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700'
        }`}>
          <Icon name={saveMessage.type === 'success' ? 'check' : 'close'} size={20} />
          {saveMessage.text}
        </div>
      )}

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Basic Info */}
        <div className={`rounded-2xl border p-6 ${isDark ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-stone-200'}`}>
          <h2 className={`font-semibold text-lg mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-stone-900'}`}>
            <Icon name="smartphone" size={20} style={{ color: currentTheme.primaryHex }} />
            Basic Information
          </h2>
          <div className="space-y-4">
            <FormInput
              label="Site Name"
              name="siteName"
              value={formData.siteName}
              onChange={handleInputChange}
              placeholder="e.g. Prasanna Mobile Center"
            />
            <FormInput
              label="Tagline"
              name="tagline"
              value={formData.tagline}
              onChange={handleInputChange}
              placeholder="e.g. Your Trusted Mobile Store in Ja-Ela"
            />
            <FormInput
              label="Description"
              name="description"
              type="textarea"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Brief description of your business"
              rows={3}
            />
          </div>
        </div>

        {/* Contact Info */}
        <div className={`rounded-2xl border p-6 ${isDark ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-stone-200'}`}>
          <h2 className={`font-semibold text-lg mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-stone-900'}`}>
            <Icon name="phone" size={20} style={{ color: currentTheme.primaryHex }} />
            Contact Information
          </h2>
          <div className="space-y-4">
            {/* Display Phone Number */}
            <FormInput
              label="Display Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="e.g. 072 290 2299"
            />
            
            {/* Phone Number with Country Code */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                Phone Number (for links)
              </label>
              <div className="flex gap-2">
                <select
                  name="phoneCountryCode"
                  value={formData.phoneCountryCode}
                  onChange={handleInputChange}
                  className={`w-40 px-3 py-2.5 rounded-xl border focus:outline-none focus:ring-2 transition-colors ${
                    isDark 
                      ? 'bg-stone-700 border-stone-600 text-white focus:ring-stone-500' 
                      : 'bg-white border-stone-300 text-stone-900 focus:ring-teal-500'
                  }`}
                >
                  {countryCodes.map(({ code, country, flag }) => (
                    <option key={code} value={code}>
                      {flag} {code} {country}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  name="phoneLocal"
                  value={formData.phoneLocal}
                  onChange={handleInputChange}
                  placeholder="722902299"
                  className={`flex-1 px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 transition-colors ${
                    isDark 
                      ? 'bg-stone-700 border-stone-600 text-white placeholder:text-stone-500 focus:ring-stone-500' 
                      : 'bg-white border-stone-300 text-stone-900 placeholder:text-stone-400 focus:ring-teal-500'
                  }`}
                />
              </div>
              <p className={`text-xs mt-1 ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
                Combined: {formData.phoneCountryCode}{formData.phoneLocal.replace(/^0+/, '') || '...'}
              </p>
            </div>
            
            {/* WhatsApp Number with Country Code */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                WhatsApp Number
              </label>
              <div className="flex gap-2">
                <select
                  name="whatsappCountryCode"
                  value={formData.whatsappCountryCode}
                  onChange={handleInputChange}
                  className={`w-40 px-3 py-2.5 rounded-xl border focus:outline-none focus:ring-2 transition-colors ${
                    isDark 
                      ? 'bg-stone-700 border-stone-600 text-white focus:ring-stone-500' 
                      : 'bg-white border-stone-300 text-stone-900 focus:ring-teal-500'
                  }`}
                >
                  {countryCodes.map(({ code, country, flag }) => (
                    <option key={code} value={code}>
                      {flag} {code} {country}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  name="whatsappLocal"
                  value={formData.whatsappLocal}
                  onChange={handleInputChange}
                  placeholder="722902299"
                  className={`flex-1 px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 transition-colors ${
                    isDark 
                      ? 'bg-stone-700 border-stone-600 text-white placeholder:text-stone-500 focus:ring-stone-500' 
                      : 'bg-white border-stone-300 text-stone-900 placeholder:text-stone-400 focus:ring-teal-500'
                  }`}
                />
              </div>
              <p className={`text-xs mt-1 ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
                Combined: {formData.whatsappCountryCode}{formData.whatsappLocal.replace(/^0+/, '') || '...'}
              </p>
            </div>
            
            {/* Email */}
            <FormInput
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="e.g. info@example.com"
            />
          </div>
        </div>

        {/* Address */}
        <div className={`rounded-2xl border p-6 ${isDark ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-stone-200'}`}>
          <h2 className={`font-semibold text-lg mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-stone-900'}`}>
            <Icon name="location" size={20} style={{ color: currentTheme.primaryHex }} />
            Address & Location
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Address Line 1"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleInputChange}
                placeholder="e.g. No 16, Old Negombo Rd"
              />
              <FormInput
                label="Address Line 2"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleInputChange}
                placeholder="e.g. Ja-Ela, Sri Lanka"
              />
            </div>
            <FormInput
              label="Google Maps Link"
              name="googleMapsUrl"
              value={formData.googleMapsUrl}
              onChange={handleInputChange}
              placeholder="https://maps.app.goo.gl/..."
            />
            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className={`text-sm font-medium ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                  Google Maps Embed URL
                </label>
                <button
                  type="button"
                  onClick={() => {
                    // Generate embed URL from address if Maps Link doesn't work
                    const address = `${formData.addressLine1} ${formData.addressLine2}`.trim();
                    if (address) {
                      const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
                      setFormData(prev => ({ ...prev, googleMapsEmbed: embedUrl }));
                    } else {
                      // Try from Maps URL
                      const generated = generateMapsEmbedFromLink(formData.googleMapsUrl);
                      if (generated) {
                        setFormData(prev => ({ ...prev, googleMapsEmbed: generated }));
                      }
                    }
                  }}
                  className={`text-xs px-2 py-1 rounded-lg transition-colors ${
                    isDark 
                      ? 'bg-stone-700 text-stone-300 hover:bg-stone-600' 
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                  title="Generate embed URL from address"
                >
                  <span className="flex items-center gap-1">
                    <Icon name="refresh" size={12} />
                    Auto-generate from address
                  </span>
                </button>
              </div>
              <input
                type="text"
                name="googleMapsEmbed"
                value={formData.googleMapsEmbed}
                onChange={handleInputChange}
                placeholder="Leave empty to auto-generate, or paste embed URL"
                className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 transition-colors ${
                  isDark 
                    ? 'bg-stone-700 border-stone-600 text-white placeholder:text-stone-500 focus:ring-stone-500' 
                    : 'bg-white border-stone-300 text-stone-900 placeholder:text-stone-400 focus:ring-teal-500'
                }`}
              />
              <p className={`text-xs mt-1 ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
                Leave empty to auto-generate from address. Click the button above to generate, or paste an embed URL manually.
              </p>
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <div className={`rounded-2xl border p-6 ${isDark ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-stone-200'}`}>
          <h2 className={`font-semibold text-lg mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-stone-900'}`}>
            <Icon name="clock" size={20} style={{ color: currentTheme.primaryHex }} />
            Business Hours
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Open Days"
              name="openDays"
              value={formData.openDays}
              onChange={handleInputChange}
              placeholder="e.g. Daily, Mon-Sat"
            />
            <FormInput
              label="Display Text"
              name="hoursDisplayText"
              value={formData.hoursDisplayText}
              onChange={handleInputChange}
              placeholder="e.g. Open Daily till 9:30 PM"
            />
            <FormInput
              label="Opening Time"
              name="openTime"
              value={formData.openTime}
              onChange={handleInputChange}
              placeholder="e.g. 9:00 AM"
            />
            <FormInput
              label="Closing Time"
              name="closeTime"
              value={formData.closeTime}
              onChange={handleInputChange}
              placeholder="e.g. 9:30 PM"
            />
          </div>
        </div>

        {/* Social Links */}
        <div className={`rounded-2xl border p-6 ${isDark ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-stone-200'}`}>
          <h2 className={`font-semibold text-lg mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-stone-900'}`}>
            <Icon name="facebook" size={20} style={{ color: currentTheme.primaryHex }} />
            Social Media Links
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Facebook"
              name="facebook"
              value={formData.facebook}
              onChange={handleInputChange}
              placeholder="https://facebook.com/..."
            />
            <FormInput
              label="Instagram"
              name="instagram"
              value={formData.instagram}
              onChange={handleInputChange}
              placeholder="https://instagram.com/..."
            />
            <FormInput
              label="TikTok"
              name="tiktok"
              value={formData.tiktok}
              onChange={handleInputChange}
              placeholder="https://tiktok.com/..."
            />
            <FormInput
              label="YouTube"
              name="youtube"
              value={formData.youtube}
              onChange={handleInputChange}
              placeholder="https://youtube.com/..."
            />
          </div>
        </div>

        {/* Google Rating */}
        <div className={`rounded-2xl border p-6 ${isDark ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-stone-200'}`}>
          <h2 className={`font-semibold text-lg mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-stone-900'}`}>
            <Icon name="star" size={20} style={{ color: currentTheme.primaryHex }} />
            Google Rating
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Rating"
              name="googleRating"
              value={formData.googleRating}
              onChange={handleInputChange}
              placeholder="e.g. 5.0"
            />
            <FormInput
              label="Number of Reviews"
              name="reviewsCount"
              value={formData.reviewsCount}
              onChange={handleInputChange}
              placeholder="e.g. 150"
            />
          </div>
        </div>

        {/* Last Updated */}
        {settings?.updatedAt && (
          <p className={`text-sm text-center ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
            Last updated: {new Date(settings.updatedAt).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}

