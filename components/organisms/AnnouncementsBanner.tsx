/**
 * Announcements Banner Component
 * Displays active announcements on the homepage
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from '@/components/atoms';

interface Announcement {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'promo' | 'warning' | 'success';
  active: boolean;
}

const AnnouncementsBanner: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch active announcements
  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        const res = await fetch('/api/announcements?active=true');
        const data = await res.json();
        setAnnouncements(data.data || []);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAnnouncements();
  }, []);

  // Auto-rotate announcements
  useEffect(() => {
    if (announcements.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % announcements.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [announcements.length]);

  if (isLoading || announcements.length === 0 || !isVisible) {
    return null;
  }

  const currentAnnouncement = announcements[currentIndex];

  // Type-based styles
  const typeStyles = {
    info: {
      bg: 'from-teal-600 to-emerald-600',
      icon: 'sparkles' as const,
    },
    promo: {
      bg: 'from-purple-600 to-pink-600',
      icon: 'tag' as const,
    },
    warning: {
      bg: 'from-amber-500 to-orange-500',
      icon: 'zap' as const,
    },
    success: {
      bg: 'from-emerald-500 to-green-600',
      icon: 'check' as const,
    },
  };

  const style = typeStyles[currentAnnouncement.type];

  return (
    <div 
      id="announcement-banner"
      className={`
        relative z-[60]
        bg-gradient-to-r ${style.bg}
        text-white
      `}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 gap-4">
          {/* Content - Left/Center */}
          <div className="flex-1 flex items-center justify-center gap-3 min-w-0">
            {/* Icon */}
            <Icon name={style.icon} size={18} className="flex-shrink-0 hidden sm:block" />
            
            {/* Text Content */}
            <div className="flex items-center gap-2 flex-wrap justify-center text-center min-w-0">
              <span className="font-semibold truncate">{currentAnnouncement.title}</span>
              <span className="hidden md:inline text-white/80">—</span>
              <span className="hidden md:inline text-sm text-white/90 truncate">
                {currentAnnouncement.message}
              </span>
            </div>

            {/* Pagination dots */}
            {announcements.length > 1 && (
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {announcements.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`
                      w-1.5 h-1.5 rounded-full
                      transition-all duration-300
                      ${i === currentIndex ? 'bg-white w-4' : 'bg-white/40 hover:bg-white/60'}
                    `}
                    aria-label={`Go to announcement ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Close button - Always visible */}
          <button
            onClick={() => setIsVisible(false)}
            className="
              flex-shrink-0
              w-8 h-8 
              rounded-full
              flex items-center justify-center
              text-white/70 hover:text-white
              hover:bg-white/20
              active:bg-white/30
              transition-colors
            "
            aria-label="Close announcement"
          >
            <Icon name="close" size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementsBanner;
