/**
 * Site Settings API
 * GET: Fetch site settings
 * PUT: Update site settings (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSiteSettings, updateSiteSettings } from '@/lib/data';
import { SiteSettings } from '@/lib/types';

export async function GET() {
  try {
    const settings = getSiteSettings();
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch site settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Transform form data to settings structure
    const updates: Partial<SiteSettings> = {
      siteName: body.siteName,
      tagline: body.tagline,
      description: body.description,
      contact: {
        phone: body.phone,
        phoneInternational: body.phoneInternational,
        whatsapp: body.whatsapp,
        email: body.email || '',
      },
      address: {
        line1: body.addressLine1,
        line2: body.addressLine2,
        googleMapsUrl: body.googleMapsUrl,
        googleMapsEmbed: body.googleMapsEmbed,
      },
      businessHours: {
        openDays: body.openDays,
        openTime: body.openTime || '',
        closeTime: body.closeTime,
        displayText: body.hoursDisplayText,
      },
      social: {
        facebook: body.facebook || '',
        instagram: body.instagram || '',
        tiktok: body.tiktok || '',
        youtube: body.youtube || '',
      },
      googleRating: {
        rating: body.googleRating,
        reviewsCount: body.reviewsCount || '',
      },
    };

    const updated = updateSiteSettings(updates);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating site settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update site settings' },
      { status: 500 }
    );
  }
}

