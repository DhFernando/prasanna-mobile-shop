/**
 * Announcements API Route
 * GET - Fetch all announcements (or active only with ?active=true)
 * POST - Create new announcement
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAnnouncements, getActiveAnnouncements, addAnnouncement, generateId } from '@/lib/data';
import { Announcement, AnnouncementFormData } from '@/lib/types';

// GET all announcements or active only
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';
    
    const announcements = activeOnly ? getActiveAnnouncements() : getAnnouncements();
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

    addAnnouncement(newAnnouncement);
    
    return NextResponse.json({ success: true, data: newAnnouncement }, { status: 201 });
  } catch (error) {
    console.error('Error creating announcement:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create announcement' },
      { status: 500 }
    );
  }
}

