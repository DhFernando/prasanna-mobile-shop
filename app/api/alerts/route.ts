/**
 * Alerts API Route
 * GET - Fetch all alerts with filters
 * POST - Check and generate new alerts
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  getAlerts, 
  getUnreadAlerts, 
  checkAndGenerateAlerts,
  getGlobalAlertSettings,
  updateGlobalAlertSettings
} from '@/lib/data';

// GET alerts
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const unreadOnly = searchParams.get('unread') === 'true';
    const includeSettings = searchParams.get('includeSettings') === 'true';
    
    let alerts = unreadOnly ? getUnreadAlerts() : getAlerts();
    
    // Filter out dismissed alerts by default
    const showDismissed = searchParams.get('showDismissed') === 'true';
    if (!showDismissed) {
      alerts = alerts.filter(a => !a.isDismissed);
    }

    // Sort by priority and date
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    alerts.sort((a, b) => {
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const response: {
      alerts: typeof alerts;
      unreadCount: number;
      settings?: ReturnType<typeof getGlobalAlertSettings>;
    } = {
      alerts,
      unreadCount: alerts.filter(a => !a.isRead).length,
    };

    if (includeSettings) {
      response.settings = getGlobalAlertSettings();
    }

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch alerts' },
      { status: 500 }
    );
  }
}

// POST - Check stock levels and generate alerts
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = body.action;

    if (action === 'check') {
      // Check and generate alerts for low stock
      const newAlerts = checkAndGenerateAlerts();
      return NextResponse.json({ 
        success: true, 
        data: { 
          newAlerts,
          count: newAlerts.length 
        } 
      });
    }

    if (action === 'updateSettings') {
      // Update global alert settings
      const { settings } = body;
      updateGlobalAlertSettings(settings);
      return NextResponse.json({ 
        success: true, 
        data: getGlobalAlertSettings() 
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error processing alert action:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process alert action' },
      { status: 500 }
    );
  }
}

