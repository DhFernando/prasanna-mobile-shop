/**
 * Sales API Routes
 * GET - Fetch all sales with optional filters and pagination
 * POST - Create a new sale
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSales, addSale, generateId } from '@/lib/data';
import { Sale } from '@/lib/types';

// GET - Fetch sales with filters and pagination
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const startDate = searchParams.get('startDate') || '';
    const endDate = searchParams.get('endDate') || '';
    const sortBy = searchParams.get('sortBy') || 'saleDate';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    let sales: Sale[] = getSales();

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      sales = sales.filter(sale => 
        sale.itemName.toLowerCase().includes(searchLower) ||
        (sale.customerName && sale.customerName.toLowerCase().includes(searchLower)) ||
        (sale.notes && sale.notes.toLowerCase().includes(searchLower))
      );
    }

    // Apply date filters
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      sales = sales.filter(sale => new Date(sale.saleDate) >= start);
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      sales = sales.filter(sale => new Date(sale.saleDate) <= end);
    }

    // Sort sales
    sales.sort((a, b) => {
      let aVal: string | number = a[sortBy as keyof Sale] as string | number;
      let bVal: string | number = b[sortBy as keyof Sale] as string | number;
      
      if (sortBy === 'saleDate' || sortBy === 'createdAt') {
        aVal = new Date(aVal as string).getTime();
        bVal = new Date(bVal as string).getTime();
      }

      if (sortOrder === 'desc') {
        return aVal > bVal ? -1 : 1;
      }
      return aVal < bVal ? -1 : 1;
    });

    // Calculate totals before pagination
    const totalSales = sales.length;
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalPrice, 0);
    const totalItems = sales.reduce((sum, sale) => sum + sale.quantity, 0);

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedSales = sales.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedSales,
      pagination: {
        page,
        limit,
        total: totalSales,
        totalPages: Math.ceil(totalSales / limit),
      },
      summary: {
        totalSales,
        totalRevenue,
        totalItems,
      },
    });
  } catch (error) {
    console.error('Error fetching sales:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sales' },
      { status: 500 }
    );
  }
}

// POST - Create a new sale
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { itemName, quantity, unitPrice, customerName, customerPhone, notes, saleDate } = body;

    // Validate required fields
    if (!itemName || !quantity || !unitPrice) {
      return NextResponse.json(
        { success: false, error: 'Item name, quantity, and unit price are required' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    const newSale: Sale = {
      id: generateId('sale'),
      itemName,
      quantity: parseInt(quantity),
      unitPrice: parseFloat(unitPrice),
      totalPrice: parseInt(quantity) * parseFloat(unitPrice),
      customerName: customerName || '',
      customerPhone: customerPhone || '',
      notes: notes || '',
      saleDate: saleDate || now,
      createdAt: now,
    };

    addSale(newSale);

    return NextResponse.json({
      success: true,
      data: newSale,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating sale:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create sale' },
      { status: 500 }
    );
  }
}
