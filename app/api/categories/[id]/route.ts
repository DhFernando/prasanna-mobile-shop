/**
 * Single Category API Route
 * GET - Fetch category by ID with children and ancestors
 * PUT - Update category
 * DELETE - Delete category (and all descendants)
 * Uses MongoDB for data persistence
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  getCategoryById, 
  getCategoryChildren,
  getCategoryAncestors,
  getCategoryDescendants,
  updateCategory, 
  deleteCategory,
  getProducts
} from '@/lib/db';
import { Category } from '@/lib/types';

// Helper to update children paths recursively
async function updateChildrenPaths(parentId: string, parentPath: string[]): Promise<void> {
  const children = await getCategoryChildren(parentId);
  
  for (const child of children) {
    const newPath = [...parentPath, child.slug];
    await updateCategory(child.id, { 
      path: newPath, 
      level: parentPath.length 
    });
    await updateChildrenPaths(child.id, newPath);
  }
}

// GET category by ID with optional children and ancestors
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const includeChildren = searchParams.get('includeChildren') === 'true';
    const includeAncestors = searchParams.get('includeAncestors') === 'true';
    
    const category = await getCategoryById(id);
    
    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    const response: {
      category: Category;
      children?: Category[];
      ancestors?: Category[];
    } = { category };

    if (includeChildren) {
      response.children = await getCategoryChildren(id);
    }

    if (includeAncestors) {
      response.ancestors = await getCategoryAncestors(id);
    }
    
    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

// PUT update category
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const currentCategory = await getCategoryById(id);
    if (!currentCategory) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    // If parent changed, recalculate path and level
    const updates: Record<string, unknown> = { 
      ...body,
      updatedAt: new Date().toISOString()
    };
    
    if (body.parentId !== undefined && body.parentId !== currentCategory.parentId) {
      if (body.parentId === null) {
        updates.level = 0;
        updates.path = [body.slug || currentCategory.slug];
      } else {
        const newParent = await getCategoryById(body.parentId);
        if (newParent) {
          updates.level = newParent.level + 1;
          updates.path = [...newParent.path, body.slug || currentCategory.slug];
        }
      }
    }

    // If slug changed, update path
    if (body.slug && body.slug !== currentCategory.slug) {
      const newPath = [...currentCategory.path.slice(0, -1), body.slug];
      updates.path = newPath;
    }
    
    const updated = await updateCategory(id, updates);
    
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    // Update children paths if slug or parent changed
    if (body.slug !== currentCategory.slug || body.parentId !== currentCategory.parentId) {
      await updateChildrenPaths(id, updated.path);
    }
    
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

// DELETE category (and all descendants)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Check if category exists
    const category = await getCategoryById(id);
    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    // Get all descendants
    const descendants = await getCategoryDescendants(id);
    const allCategoryIds = [id, ...descendants.map(d => d.id)];

    // Check if any products are using these categories
    const products = await getProducts();
    const affectedProducts = products.filter(p => allCategoryIds.includes(p.category));
    
    if (affectedProducts.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Cannot delete category. ${affectedProducts.length} product(s) are using this category or its subcategories.`,
          affectedProducts: affectedProducts.map(p => ({ id: p.id, name: p.name }))
        },
        { status: 400 }
      );
    }

    // Delete all descendants first
    for (const descendant of descendants.reverse()) {
      await deleteCategory(descendant.id);
    }

    // Delete the category itself
    const deleted = await deleteCategory(id);
    
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete category' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `Category and ${descendants.length} subcategories deleted` 
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}
