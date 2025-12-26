/**
 * Theme Settings API
 * GET - Fetch current theme settings
 * POST - Update theme settings (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const THEME_FILE = path.join(process.cwd(), 'data', 'theme-settings.json');

interface ThemeSettings {
  colorTheme: string;
  updatedAt: string;
}

function readThemeSettings(): ThemeSettings {
  try {
    const data = fs.readFileSync(THEME_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { colorTheme: 'teal', updatedAt: new Date().toISOString() };
  }
}

function writeThemeSettings(settings: ThemeSettings): void {
  fs.writeFileSync(THEME_FILE, JSON.stringify(settings, null, 2), 'utf-8');
}

// GET - Fetch theme settings
export async function GET() {
  try {
    const settings = readThemeSettings();
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

    const settings: ThemeSettings = {
      colorTheme,
      updatedAt: new Date().toISOString(),
    };

    writeThemeSettings(settings);

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error updating theme settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update theme settings' },
      { status: 500 }
    );
  }
}

