/**
 * Single Alert API Route
 * PUT - Mark alert as read or dismiss
 * DELETE - Delete alert
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  getAlerts, 
  markAlertAsRead, 
  dismissAlert,
  saveAlerts
} from '@/lib/data';

// PUT - Update alert (mark as read or dismiss)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action } = body;

    if (action === 'read') {
      markAlertAsRead(id);
      return NextResponse.json({ success: true, message: 'Alert marked as read' });
    }

    if (action === 'dismiss') {
      dismissAlert(id);
      return NextResponse.json({ success: true, message: 'Alert dismissed' });
    }

    if (action === 'markAllRead') {
      const alerts = getAlerts();
      const updatedAlerts = alerts.map(a => ({ ...a, isRead: true }));
      saveAlerts(updatedAlerts);
      return NextResponse.json({ success: true, message: 'All alerts marked as read' });
    }

    if (action === 'dismissAll') {
      const alerts = getAlerts();
      const updatedAlerts = alerts.map(a => ({ ...a, isDismissed: true }));
      saveAlerts(updatedAlerts);
      return NextResponse.json({ success: true, message: 'All alerts dismissed' });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error updating alert:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update alert' },
      { status: 500 }
    );
  }
}

// DELETE - Remove alert permanently
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const alerts = getAlerts();
    const filtered = alerts.filter(a => a.id !== id);
    
    if (filtered.length === alerts.length) {
      return NextResponse.json(
        { success: false, error: 'Alert not found' },
        { status: 404 }
      );
    }

    saveAlerts(filtered);
    return NextResponse.json({ success: true, message: 'Alert deleted' });
  } catch (error) {
    console.error('Error deleting alert:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete alert' },
      { status: 500 }
    );
  }
}

