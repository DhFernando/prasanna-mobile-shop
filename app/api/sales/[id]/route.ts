/**
 * Single Sale API Routes
 * GET - Fetch a single sale by ID
 * PUT - Update a sale (supports multi-item)
 * DELETE - Delete a sale
 * Uses MongoDB for data persistence
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSaleById, updateSale, deleteSale } from '@/lib/db';

// Generate unique ID for items
function generateItemId(): string {
  return `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// GET - Fetch single sale
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sale = await getSaleById(id);

    if (!sale) {
      return NextResponse.json(
        { success: false, error: 'Sale not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: sale,
    });
  } catch (error) {
    console.error('Error fetching sale:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sale' },
      { status: 500 }
    );
  }
}

// PUT - Update sale (supports multi-item)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existingSale = await getSaleById(id);
    if (!existingSale) {
      return NextResponse.json(
        { success: false, error: 'Sale not found' },
        { status: 404 }
      );
    }

    // Handle multi-item updates
    const updates: Record<string, unknown> = { ...body };
    
    if (body.items && Array.isArray(body.items)) {
      // Multi-item sale update
      const saleItems = body.items.map((item: { id?: string; name: string; quantity: number; unitPrice: number }) => ({
        id: item.id || generateItemId(),
        name: item.name,
        quantity: parseInt(String(item.quantity)),
        unitPrice: parseFloat(String(item.unitPrice)),
        totalPrice: parseInt(String(item.quantity)) * parseFloat(String(item.unitPrice)),
      }));

      const subtotal = saleItems.reduce((sum: number, item: { totalPrice: number }) => sum + item.totalPrice, 0);
      const discount = parseFloat(String(body.discount ?? existingSale.discount ?? 0));
      
      updates.items = saleItems;
      updates.subtotal = subtotal;
      updates.discount = discount;
      updates.totalPrice = subtotal - discount;
    } else if (body.quantity !== undefined || body.unitPrice !== undefined) {
      // Legacy single-item update
      const quantity = body.quantity ?? existingSale.quantity;
      const unitPrice = body.unitPrice ?? existingSale.unitPrice;
      updates.totalPrice = quantity * unitPrice;
    }

    const updatedSale = await updateSale(id, updates);

    if (!updatedSale) {
      return NextResponse.json(
        { success: false, error: 'Sale not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedSale,
    });
  } catch (error) {
    console.error('Error updating sale:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update sale' },
      { status: 500 }
    );
  }
}

// DELETE - Delete sale
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await deleteSale(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Sale not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Sale deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting sale:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete sale' },
      { status: 500 }
    );
  }
}
