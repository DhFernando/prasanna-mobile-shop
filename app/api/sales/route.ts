/**
 * Sales API Routes
 * GET - Fetch all sales with optional filters and pagination
 * POST - Create a new sale (supports multiple items)
 * Uses MongoDB for data persistence
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSales, addSale } from '@/lib/db';
import { Sale, SaleItem } from '@/lib/types';

// Generate unique ID
function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Helper to get total items from a sale (handles both legacy and multi-item)
function getSaleItemCount(sale: Sale): number {
  if (sale.items && sale.items.length > 0) {
    return sale.items.reduce((sum, item) => sum + item.quantity, 0);
  }
  return sale.quantity || 0;
}

// Helper to get searchable text from sale
function getSaleSearchableText(sale: Sale): string {
  const texts: string[] = [];
  
  // Multi-item sale
  if (sale.items && sale.items.length > 0) {
    sale.items.forEach(item => texts.push(item.name.toLowerCase()));
  }
  
  // Legacy single-item
  if (sale.itemName) {
    texts.push(sale.itemName.toLowerCase());
  }
  
  if (sale.customerName) texts.push(sale.customerName.toLowerCase());
  if (sale.notes) texts.push(sale.notes.toLowerCase());
  
  return texts.join(' ');
}

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

    let sales: Sale[] = await getSales();

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      sales = sales.filter(sale => getSaleSearchableText(sale).includes(searchLower));
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
    const totalItems = sales.reduce((sum, sale) => sum + getSaleItemCount(sale), 0);

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

// POST - Create a new sale (supports multiple items)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, discount = 0, customerName, customerPhone, notes, saleDate } = body;

    // Check if it's a multi-item sale or legacy single-item
    if (items && Array.isArray(items) && items.length > 0) {
      // Multi-item sale
      const saleItems: SaleItem[] = items.map((item: { id?: string; name: string; quantity: number; unitPrice: number }) => ({
        id: item.id || generateId('item'),
        name: item.name,
        quantity: parseInt(String(item.quantity)),
        unitPrice: parseFloat(String(item.unitPrice)),
        totalPrice: parseInt(String(item.quantity)) * parseFloat(String(item.unitPrice)),
      }));

      const subtotal = saleItems.reduce((sum, item) => sum + item.totalPrice, 0);
      const totalPrice = subtotal - parseFloat(String(discount));

      const now = new Date().toISOString();

      const newSale: Sale = {
        id: generateId('sale'),
        items: saleItems,
        subtotal,
        discount: parseFloat(String(discount)),
        totalPrice,
        customerName: customerName || '',
        customerPhone: customerPhone || '',
        notes: notes || '',
        saleDate: saleDate || now,
        createdAt: now,
      };

      await addSale(newSale);

      return NextResponse.json({
        success: true,
        data: newSale,
      }, { status: 201 });
    } else {
      // Legacy single-item sale (backward compatibility)
      const { itemName, quantity, unitPrice } = body;

      if (!itemName || !quantity || !unitPrice) {
        return NextResponse.json(
          { success: false, error: 'Item name, quantity, and unit price are required' },
          { status: 400 }
        );
      }

      const now = new Date().toISOString();
      const itemId = generateId('item');
      const saleItem: SaleItem = {
        id: itemId,
        name: itemName,
        quantity: parseInt(String(quantity)),
        unitPrice: parseFloat(String(unitPrice)),
        totalPrice: parseInt(String(quantity)) * parseFloat(String(unitPrice)),
      };

      const newSale: Sale = {
        id: generateId('sale'),
        items: [saleItem],
        subtotal: saleItem.totalPrice,
        discount: 0,
        totalPrice: saleItem.totalPrice,
        // Legacy fields for backward compatibility
        itemName,
        quantity: parseInt(String(quantity)),
        unitPrice: parseFloat(String(unitPrice)),
        customerName: customerName || '',
        customerPhone: customerPhone || '',
        notes: notes || '',
        saleDate: saleDate || now,
        createdAt: now,
      };

      await addSale(newSale);

      return NextResponse.json({
        success: true,
        data: newSale,
      }, { status: 201 });
    }
  } catch (error) {
    console.error('Error creating sale:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create sale' },
      { status: 500 }
    );
  }
}
