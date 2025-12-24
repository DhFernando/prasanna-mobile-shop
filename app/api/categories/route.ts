/**
 * Categories API Route
 * GET - Fetch all categories
 * POST - Create new category
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCategories, addCategory, generateId } from '@/lib/data';
import { Category, CategoryFormData } from '@/lib/types';

// GET all categories
export async function GET() {
  try {
    const categories = getCategories();
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST new category
export async function POST(request: NextRequest) {
  try {
    const body: CategoryFormData = await request.json();
    
    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { success: false, error: 'Category name is required' },
        { status: 400 }
      );
    }

    // Generate ID from name (slug format)
    const id = body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const newCategory: Category = {
      id: id || generateId('cat'),
      name: body.name,
      description: body.description || '',
      createdAt: new Date().toISOString(),
    };

    addCategory(newCategory);
    
    return NextResponse.json({ success: true, data: newCategory }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    );
  }
}

