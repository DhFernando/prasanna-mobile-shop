/**
 * Alerts API Route
 * GET - Fetch all alerts with filters
 * POST - Check and generate new alerts
 * Uses MongoDB for data persistence
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  getAlerts, 
  addAlert,
  getAlertSettings,
  updateAlertSettings,
  getProducts
} from '@/lib/db';
import { Alert, AlertSettings } from '@/lib/types';

// Generate unique ID
function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Check products and generate alerts for low/out of stock
async function checkAndGenerateAlerts(): Promise<Alert[]> {
  const products = await getProducts();
  const settings = await getAlertSettings();
  const existingAlerts = await getAlerts();
  const newAlerts: Alert[] = [];
  const now = new Date().toISOString();

  for (const product of products) {
    // Skip products without stock tracking
    if (product.stockQuantity === null || product.stockQuantity === undefined) continue;

    // Check if alert already exists for this product
    const existingAlert = existingAlerts.find(
      a => a.productId === product.id && !a.isDismissed
    );
    if (existingAlert) continue;

    // Check for out of stock
    if (settings.enableOutOfStockAlerts && product.stockQuantity === 0) {
      const alert: Alert = {
        id: generateId('alert'),
        type: 'out_of_stock',
        productId: product.id,
        productName: product.name,
        message: `${product.name} is out of stock`,
        priority: 'critical',
        isRead: false,
        isDismissed: false,
        createdAt: now,
      };
      await addAlert(alert);
      newAlerts.push(alert);
    }
    // Check for low stock
    else if (settings.enableLowStockAlerts && product.stockQuantity <= settings.lowStockThreshold) {
      const alert: Alert = {
        id: generateId('alert'),
        type: 'low_stock',
        productId: product.id,
        productName: product.name,
        currentStock: product.stockQuantity,
        threshold: settings.lowStockThreshold,
        message: `${product.name} is low on stock (${product.stockQuantity} remaining)`,
        priority: 'high',
        isRead: false,
        isDismissed: false,
        createdAt: now,
      };
      await addAlert(alert);
      newAlerts.push(alert);
    }
  }

  return newAlerts;
}

// GET alerts
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const unreadOnly = searchParams.get('unread') === 'true';
    const includeSettings = searchParams.get('includeSettings') === 'true';
    
    let alerts = await getAlerts();
    
    // Filter unread only
    if (unreadOnly) {
      alerts = alerts.filter(a => !a.isRead);
    }
    
    // Filter out dismissed alerts by default
    const showDismissed = searchParams.get('showDismissed') === 'true';
    if (!showDismissed) {
      alerts = alerts.filter(a => !a.isDismissed);
    }

    // Sort by priority and date
    const priorityOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
    alerts.sort((a, b) => {
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const response: {
      alerts: Alert[];
      unreadCount: number;
      settings?: AlertSettings;
    } = {
      alerts,
      unreadCount: alerts.filter(a => !a.isRead).length,
    };

    if (includeSettings) {
      response.settings = await getAlertSettings();
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
      const newAlerts = await checkAndGenerateAlerts();
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
      const updated = await updateAlertSettings(settings);
      return NextResponse.json({ 
        success: true, 
        data: updated 
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
