/**
 * Announcements API Route
 * GET - Fetch all announcements (or active only with ?active=true)
 * POST - Create new announcement
 * Uses MongoDB for data persistence
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAnnouncements, addAnnouncement } from '@/lib/db';
import { Announcement, AnnouncementFormData } from '@/lib/types';

// Generate unique ID
function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// GET all announcements or active only
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';
    
    let announcements = await getAnnouncements();
    
    if (activeOnly) {
      const now = new Date();
      announcements = announcements.filter(a => {
        if (!a.active) return false;
        if (a.expiresAt && new Date(a.expiresAt) < now) return false;
        return true;
      });
    }
    
    return NextResponse.json({ success: true, data: announcements });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch announcements' },
      { status: 500 }
    );
  }
}

// POST new announcement
export async function POST(request: NextRequest) {
  try {
    const body: AnnouncementFormData = await request.json();
    
    // Validate required fields
    if (!body.title || !body.message) {
      return NextResponse.json(
        { success: false, error: 'Title and message are required' },
        { status: 400 }
      );
    }

    const newAnnouncement: Announcement = {
      id: generateId('ann'),
      title: body.title,
      message: body.message,
      type: body.type || 'info',
      active: body.active ?? true,
      createdAt: new Date().toISOString(),
      expiresAt: body.expiresAt || null,
    };

    await addAnnouncement(newAnnouncement);
    
    return NextResponse.json({ success: true, data: newAnnouncement }, { status: 201 });
  } catch (error) {
    console.error('Error creating announcement:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create announcement' },
      { status: 500 }
    );
  }
}
