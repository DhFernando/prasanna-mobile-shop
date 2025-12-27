/**
 * Categories API Route
 * GET - Fetch all categories (flat or tree)
 * POST - Create new category
 * Uses MongoDB for data persistence
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  getCategories, 
  getRootCategories,
  getCategoryById,
  getCategoryAncestors,
  getCategoryChildren,
  addCategory, 
} from '@/lib/db';
import { Category, CategoryFormData } from '@/lib/types';

// Generate unique ID
function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Build category tree recursively
interface CategoryWithChildren extends Category {
  children?: CategoryWithChildren[];
}

async function buildCategoryTree(parentId: string | null = null): Promise<CategoryWithChildren[]> {
  const children = parentId === null 
    ? await getRootCategories() 
    : await getCategoryChildren(parentId);
  
  const result: CategoryWithChildren[] = [];
  
  for (const category of children) {
    const categoryWithChildren: CategoryWithChildren = {
      ...category,
      children: await buildCategoryTree(category.id),
    };
    result.push(categoryWithChildren);
  }
  
  return result;
}

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
      const category = await getCategoryById(categoryId);
      if (!category) {
        return NextResponse.json(
          { success: false, error: 'Category not found' },
          { status: 404 }
        );
      }
      const ancestors = await getCategoryAncestors(categoryId);
      return NextResponse.json({ 
        success: true, 
        data: { category, ancestors } 
      });
    }

    // Return tree structure
    if (format === 'tree') {
      const tree = await buildCategoryTree(null);
      return NextResponse.json({ success: true, data: tree });
    }

    // Return only root categories
    if (parentId === 'root' || parentId === 'null') {
      const roots = await getRootCategories();
      return NextResponse.json({ success: true, data: roots });
    }

    // Return children of a specific parent
    if (parentId) {
      const children = await getCategoryChildren(parentId);
      return NextResponse.json({ success: true, data: children });
    }

    // Default: return all categories flat
    const categories = await getCategories();
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
      const parent = await getCategoryById(body.parentId);
      if (parent) {
        path = [...parent.path, slug];
        level = parent.level + 1;
      }
    }

    // Get max order for siblings
    const siblings = body.parentId 
      ? await getCategoryChildren(body.parentId)
      : await getRootCategories();
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

    await addCategory(newCategory);
    
    return NextResponse.json({ success: true, data: newCategory }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
