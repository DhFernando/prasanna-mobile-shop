/**
 * Products API Route
 * GET - Fetch all products
 * POST - Create new product
 * Uses MongoDB for data persistence
 */

import { NextRequest, NextResponse } from 'next/server';
import { getProducts, addProduct } from '@/lib/db';
import { Product, ProductFormData } from '@/lib/types';

// Generate unique ID
function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// GET all products
export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST new product
export async function POST(request: NextRequest) {
  try {
    const body: ProductFormData = await request.json();
    
    // Validate required fields
    if (!body.name || !body.category || !body.price) {
      return NextResponse.json(
        { success: false, error: 'Name, category, and price are required' },
        { status: 400 }
      );
    }

    const newProduct: Product = {
      id: generateId('prod'),
      name: body.name,
      category: body.category,
      price: body.price,
      description: body.description || '',
      image: body.image || '/images/products/placeholder.jpg',
      published: body.published ?? false,
      stockQuantity: body.stockQuantity ?? null,
      stockStatus: body.stockStatus ?? 'in_stock',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await addProduct(newProduct);
    
    return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
