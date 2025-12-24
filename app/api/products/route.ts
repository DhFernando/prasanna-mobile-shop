/**
 * Products API Route
 * GET - Fetch all products
 * POST - Create new product
 */

import { NextRequest, NextResponse } from 'next/server';
import { getProducts, addProduct, generateId } from '@/lib/data';
import { Product, ProductFormData } from '@/lib/types';

// GET all products
export async function GET() {
  try {
    const products = getProducts();
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

    addProduct(newProduct);
    
    return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

