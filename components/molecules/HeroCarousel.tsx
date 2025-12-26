/**
 * Hero Carousel Component
 * Background image carousel with smooth transitions
 * Supports up to 5 images with auto-rotation
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { HeroImage } from '@/lib/types';

interface HeroCarouselProps {
  images: HeroImage[];
  interval?: number; // Rotation interval in ms (default: 5000)
  overlay?: boolean; // Add dark overlay for text readability
  overlayOpacity?: number; // Overlay opacity (0-1)
}

export function HeroCarousel({
  images,
  interval = 5000,
  overlay = true,
  overlayOpacity = 0.5,
}: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([0]));

  // Preload next image
  const preloadImage = useCallback((index: number) => {
    if (loadedImages.has(index) || !images[index]) return;
    
    const img = new Image();
    img.src = images[index].url;
    img.onload = () => {
      setLoadedImages(prev => new Set([...prev, index]));
    };
  }, [images, loadedImages]);

  // Auto-rotate images
  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentIndex(prev => {
          const next = (prev + 1) % images.length;
          // Preload the image after next
          preloadImage((next + 1) % images.length);
          return next;
        });
        setIsTransitioning(false);
      }, 500); // Half of transition duration
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval, preloadImage]);

  // Preload first two images on mount
  useEffect(() => {
    if (images.length > 1) {
      preloadImage(1);
    }
  }, [images.length, preloadImage]);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Background images */}
      {images.map((image, index) => (
        <div
          key={image.id || index}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{
            opacity: index === currentIndex ? 1 : 0,
            zIndex: index === currentIndex ? 1 : 0,
          }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
            style={{
              backgroundImage: `url(${image.url})`,
              transform: index === currentIndex && !isTransitioning 
                ? 'scale(1.05)' 
                : 'scale(1)',
              transition: 'transform 10s ease-out',
            }}
          />
        </div>
      ))}

      {/* Overlay */}
      {overlay && (
        <div 
          className="absolute inset-0 z-10 bg-gradient-to-b from-black/30 via-black/40 to-black/70"
          style={{
            opacity: overlayOpacity + 0.2, // Slightly more than specified for readability
          }}
        />
      )}

      {/* Dots indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-white w-6' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default HeroCarousel;

