/**
 * Single Sale API Routes
 * GET - Fetch a single sale
 * PUT - Update a sale
 * DELETE - Delete a sale
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSaleById, updateSale, deleteSale } from '@/lib/data';

// GET - Fetch single sale
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sale = getSaleById(id);

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

// PUT - Update sale
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Recalculate total price if quantity or unitPrice changed
    const updates = { ...body };
    if (body.quantity !== undefined || body.unitPrice !== undefined) {
      const existingSale = getSaleById(id);
      if (existingSale) {
        const quantity = body.quantity ?? existingSale.quantity;
        const unitPrice = body.unitPrice ?? existingSale.unitPrice;
        updates.totalPrice = quantity * unitPrice;
      }
    }

    const updatedSale = updateSale(id, updates);

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
    const deleted = deleteSale(id);

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
