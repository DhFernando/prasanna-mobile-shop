/**
 * Single Alert API Route
 * PUT - Mark alert as read or dismiss
 * DELETE - Delete alert
 * Uses MongoDB for data persistence
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  getAlerts, 
  updateAlert,
  deleteAlert
} from '@/lib/db';

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
      await updateAlert(id, { isRead: true });
      return NextResponse.json({ success: true, message: 'Alert marked as read' });
    }

    if (action === 'dismiss') {
      await updateAlert(id, { isDismissed: true });
      return NextResponse.json({ success: true, message: 'Alert dismissed' });
    }

    if (action === 'markAllRead') {
      const alerts = await getAlerts();
      for (const alert of alerts) {
        await updateAlert(alert.id, { isRead: true });
      }
      return NextResponse.json({ success: true, message: 'All alerts marked as read' });
    }

    if (action === 'dismissAll') {
      const alerts = await getAlerts();
      for (const alert of alerts) {
        await updateAlert(alert.id, { isDismissed: true });
      }
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
    const deleted = await deleteAlert(id);
    
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Alert not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Alert deleted' });
  } catch (error) {
    console.error('Error deleting alert:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete alert' },
      { status: 500 }
    );
  }
}
