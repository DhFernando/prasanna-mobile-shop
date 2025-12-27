/**
 * Theme Settings API
 * GET - Fetch current theme settings
 * POST - Update theme settings (admin only)
 * Uses MongoDB for data persistence
 */

import { NextRequest, NextResponse } from 'next/server';
import { getThemeSettings, updateThemeSettings } from '@/lib/db';

// GET - Fetch theme settings
export async function GET() {
  try {
    const settings = await getThemeSettings();
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error fetching theme settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch theme settings' },
      { status: 500 }
    );
  }
}

// POST - Update theme settings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { colorTheme } = body;

    // Validate color theme
    const validThemes = ['teal', 'purple', 'blue', 'orange', 'rose', 'emerald', 'amber', 'indigo'];
    if (!colorTheme || !validThemes.includes(colorTheme)) {
      return NextResponse.json(
        { success: false, error: 'Invalid color theme' },
        { status: 400 }
      );
    }

    const settings = await updateThemeSettings(colorTheme);

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error updating theme settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update theme settings' },
      { status: 500 }
    );
  }
}
