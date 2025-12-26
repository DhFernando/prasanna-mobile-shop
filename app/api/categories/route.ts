/**
 * Categories API Route
 * GET - Fetch all categories (flat or tree)
 * POST - Create new category
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  getCategories, 
  getCategoryTree, 
  getRootCategories,
  getCategoryById,
  getCategoryAncestors,
  addCategory, 
  generateId 
} from '@/lib/data';
import { Category, CategoryFormData } from '@/lib/types';

// GET all categories
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get('format') || 'flat'; // 'flat' | 'tree'
    const parentId = searchParams.get('parentId'); // Get children of specific parent
    const includeAncestors = searchParams.get('includeAncestors') === 'true';
    const categoryId = searchParams.get('id');

    // If requesting a specific category with ancestors (for breadcrumbs)
    if (categoryId && includeAncestors) {
      const category = getCategoryById(categoryId);
      if (!category) {
        return NextResponse.json(
          { success: false, error: 'Category not found' },
          { status: 404 }
        );
      }
      const ancestors = getCategoryAncestors(categoryId);
      return NextResponse.json({ 
        success: true, 
        data: { category, ancestors } 
      });
    }

    // Return tree structure
    if (format === 'tree') {
      const tree = getCategoryTree();
      return NextResponse.json({ success: true, data: tree });
    }

    // Return only root categories
    if (parentId === 'root' || parentId === 'null') {
      const roots = getRootCategories();
      return NextResponse.json({ success: true, data: roots });
    }

    // Return children of a specific parent
    if (parentId) {
      const categories = getCategories();
      const children = categories.filter(c => c.parentId === parentId).sort((a, b) => a.order - b.order);
      return NextResponse.json({ success: true, data: children });
    }

    // Default: return all categories flat
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

    // Generate slug from name
    const slug = body.slug || body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    // Build path based on parent
    let path: string[] = [slug];
    let level = 0;
    
    if (body.parentId) {
      const parent = getCategoryById(body.parentId);
      if (parent) {
        path = [...parent.path, slug];
        level = parent.level + 1;
      }
    }

    // Get max order for siblings
    const categories = getCategories();
    const siblings = categories.filter(c => c.parentId === (body.parentId || null));
    const maxOrder = siblings.length > 0 ? Math.max(...siblings.map(s => s.order)) : 0;

    const now = new Date().toISOString();

    const newCategory: Category = {
      id: generateId('cat'),
      name: body.name,
      slug: slug,
      description: body.description || '',
      parentId: body.parentId || null,
      level: level,
      path: path,
      image: body.image || '',
      isActive: body.isActive ?? true,
      order: body.order ?? maxOrder + 1,
      createdAt: now,
      updatedAt: now,
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
