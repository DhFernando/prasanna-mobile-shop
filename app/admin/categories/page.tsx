/**
 * Categories Management Page
 * Hierarchical CRUD operations for categories with tree view
 * Supports dark/light mode
 */

'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Modal, ConfirmDialog, FormInput } from '@/components/admin';
import { Icon } from '@/components/atoms';
import { Category, CategoryFormData, CategoryWithChildren } from '@/lib/types';
import { useTheme } from '@/lib/theme';

const initialFormData: CategoryFormData = {
  name: '',
  slug: '',
  description: '',
  parentId: null,
  image: '',
  isActive: true,
  order: 1,
};

// Category Tree Item Component
function CategoryTreeItem({
  category,
  level = 0,
  onEdit,
  onDelete,
  onAddChild,
  expandedIds,
  toggleExpand,
  isDark,
  primaryColor,
}: {
  category: CategoryWithChildren;
  level?: number;
  onEdit: (cat: Category) => void;
  onDelete: (cat: Category) => void;
  onAddChild: (parentId: string) => void;
  expandedIds: Set<string>;
  toggleExpand: (id: string) => void;
  isDark: boolean;
  primaryColor: string;
}) {
  const hasChildren = category.children && category.children.length > 0;
  const isExpanded = expandedIds.has(category.id);

  return (
    <div className="select-none">
      <div 
        className={`
          flex items-center gap-2 py-2.5 px-3 rounded-xl
          transition-colors group
          ${level > 0 ? 'ml-6 border-l-2' : ''}
          ${level > 0 ? (isDark ? 'border-stone-700' : 'border-stone-200') : ''}
          ${isDark ? 'hover:bg-stone-700/50' : 'hover:bg-stone-50'}
        `}
        style={{ marginLeft: level > 0 ? `${level * 24}px` : 0 }}
      >
        {/* Expand/Collapse Button */}
        <button
          onClick={() => toggleExpand(category.id)}
          className={`
            w-6 h-6 rounded flex items-center justify-center
            transition-all
            ${!hasChildren ? 'invisible' : ''}
            ${isDark 
              ? 'text-stone-500 hover:text-stone-300 hover:bg-stone-700' 
              : 'text-stone-400 hover:text-stone-600 hover:bg-stone-100'
            }
          `}
        >
          <Icon 
            name="chevron-right" 
            size={16} 
            className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`}
          />
        </button>

        {/* Category Icon */}
        <div 
          className={`
            w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
            ${category.isActive 
              ? '' 
              : isDark ? 'bg-stone-700 text-stone-500' : 'bg-stone-100 text-stone-400'
            }
          `}
          style={category.isActive ? { 
            backgroundColor: `${primaryColor}20`, 
            color: primaryColor 
          } : {}}
        >
          <Icon name="folder" size={16} />
        </div>

        {/* Category Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`font-medium truncate ${isDark ? 'text-white' : 'text-stone-900'}`}>
              {category.name}
            </span>
            {!category.isActive && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                isDark ? 'bg-stone-700 text-stone-400' : 'bg-stone-100 text-stone-500'
              }`}>
                Inactive
              </span>
            )}
            {hasChildren && (
              <span className={`text-xs ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
                ({category.children.length})
              </span>
            )}
          </div>
          <p className={`text-xs truncate ${isDark ? 'text-stone-500' : 'text-stone-500'}`}>{category.slug}</p>
        </div>

        {/* Level Badge */}
        <span className={`text-xs px-2 py-0.5 rounded-full hidden sm:block ${
          isDark ? 'bg-stone-700 text-stone-400' : 'bg-stone-100 text-stone-500'
        }`}>
          Level {category.level}
        </span>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onAddChild(category.id)}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark 
                ? 'text-stone-500 hover:text-teal-400 hover:bg-teal-500/10' 
                : 'text-stone-400 hover:text-teal-600 hover:bg-teal-50'
            }`}
            title="Add subcategory"
          >
            <Icon name="plus" size={16} />
          </button>
          <button
            onClick={() => onEdit(category)}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark 
                ? 'text-stone-500 hover:text-blue-400 hover:bg-blue-500/10' 
                : 'text-stone-400 hover:text-blue-600 hover:bg-blue-50'
            }`}
            title="Edit category"
          >
            <Icon name="edit" size={16} />
          </button>
          <button
            onClick={() => onDelete(category)}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark 
                ? 'text-stone-500 hover:text-red-400 hover:bg-red-500/10' 
                : 'text-stone-400 hover:text-red-600 hover:bg-red-50'
            }`}
            title="Delete category"
          >
            <Icon name="trash" size={16} />
          </button>
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="mt-1">
          {category.children.map((child) => (
            <CategoryTreeItem
              key={child.id}
              category={child}
              level={level + 1}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddChild={onAddChild}
              expandedIds={expandedIds}
              toggleExpand={toggleExpand}
              isDark={isDark}
              primaryColor={primaryColor}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CategoriesPage() {
  const { isDark, currentTheme } = useTheme();
  const [categoryTree, setCategoryTree] = useState<CategoryWithChildren[]>([]);
  const [flatCategories, setFlatCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [deleteError, setDeleteError] = useState<string | null>(null);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<CategoryFormData>(initialFormData);

  // Fetch categories (tree and flat)
  const fetchData = useCallback(async () => {
    try {
      const [treeRes, flatRes] = await Promise.all([
        fetch('/api/categories?format=tree'),
        fetch('/api/categories'),
      ]);
      const treeData = await treeRes.json();
      const flatData = await flatRes.json();
      setCategoryTree(treeData.data || []);
      setFlatCategories(flatData.data || []);
      
      // Expand all by default on first load
      if (expandedIds.size === 0 && flatData.data) {
        const allIds = new Set<string>(flatData.data.map((c: Category) => c.id));
        setExpandedIds(allIds);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setIsLoading(false);
    }
  }, [expandedIds.size]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Toggle expand/collapse
  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Expand all
  const expandAll = () => {
    setExpandedIds(new Set(flatCategories.map(c => c.id)));
  };

  // Collapse all
  const collapseAll = () => {
    setExpandedIds(new Set());
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'name' && !editingCategory) {
      // Auto-generate slug from name when adding new category
      const slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      setFormData(prev => ({ ...prev, [name]: value, slug }));
    } else if (name === 'parentId') {
      setFormData(prev => ({ ...prev, [name]: value === '' ? null : value }));
    } else if (name === 'order') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 1 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Open add modal
  const openAddModal = (parentId: string | null = null) => {
    setEditingCategory(null);
    setFormData({
      ...initialFormData,
      parentId,
    });
    setIsModalOpen(true);
  };

  // Open edit modal
  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description,
      parentId: category.parentId,
      image: category.image || '',
      isActive: category.isActive,
      order: category.order,
    });
    setIsModalOpen(true);
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = editingCategory 
        ? `/api/categories/${editingCategory.id}` 
        : '/api/categories';
      const method = editingCategory ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchData();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to save category');
      }
    } catch (error) {
      console.error('Error saving category:', error);
      alert('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deletingCategory) return;
    setIsSubmitting(true);
    setDeleteError(null);

    try {
      const res = await fetch(`/api/categories/${deletingCategory.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (res.ok) {
        setIsDeleteDialogOpen(false);
        setDeletingCategory(null);
        fetchData();
      } else {
        setDeleteError(data.error || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      setDeleteError('An error occurred while deleting');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get parent categories for select dropdown (exclude current and its children)
  const getParentOptions = () => {
    if (!editingCategory) {
      return flatCategories.filter(c => c.isActive);
    }
    
    // Exclude the category being edited and all its descendants
    const excludeIds = new Set([editingCategory.id]);
    const addDescendants = (parentId: string) => {
      flatCategories.forEach(c => {
        if (c.parentId === parentId) {
          excludeIds.add(c.id);
          addDescendants(c.id);
        }
      });
    };
    addDescendants(editingCategory.id);
    
    return flatCategories.filter(c => !excludeIds.has(c.id) && c.isActive);
  };

  // Count total categories and subcategories
  const totalCategories = flatCategories.length;
  const rootCategories = flatCategories.filter(c => c.parentId === null).length;
  const activeCategories = flatCategories.filter(c => c.isActive).length;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className={`font-display text-2xl sm:text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-stone-900'}`}>
            Categories
          </h1>
          <p className={isDark ? 'text-stone-400' : 'text-stone-500'}>
            Organize products with hierarchical categories
          </p>
        </div>
        <button
          onClick={() => openAddModal()}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-white font-semibold rounded-xl shadow-lg transition-all hover:opacity-90"
          style={{ 
            background: `linear-gradient(135deg, ${currentTheme.primaryHex}, ${currentTheme.primaryDark})`,
            boxShadow: `0 4px 14px ${currentTheme.primaryHex}40`
          }}
        >
          <Icon name="plus" size={18} />
          Add Category
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className={`rounded-xl p-4 border ${isDark ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-stone-200'}`}>
          <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-stone-900'}`}>{totalCategories}</div>
          <div className={`text-sm ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>Total Categories</div>
        </div>
        <div className={`rounded-xl p-4 border ${isDark ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-stone-200'}`}>
          <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-stone-900'}`}>{rootCategories}</div>
          <div className={`text-sm ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>Root Categories</div>
        </div>
        <div className={`rounded-xl p-4 border ${isDark ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-stone-200'}`}>
          <div className="text-2xl font-bold" style={{ color: currentTheme.primaryHex }}>{activeCategories}</div>
          <div className={`text-sm ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>Active</div>
        </div>
      </div>

      {/* Category Tree */}
      <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-stone-200'}`}>
        {/* Tree Header */}
        <div className={`flex items-center justify-between p-4 border-b ${isDark ? 'border-stone-700' : 'border-stone-100'}`}>
          <h2 className={`font-semibold ${isDark ? 'text-white' : 'text-stone-900'}`}>Category Hierarchy</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={expandAll}
              className={`text-sm px-2 py-1 rounded transition-colors ${
                isDark 
                  ? 'text-stone-400 hover:text-white hover:bg-stone-700' 
                  : 'text-stone-500 hover:text-stone-700 hover:bg-stone-50'
              }`}
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className={`text-sm px-2 py-1 rounded transition-colors ${
                isDark 
                  ? 'text-stone-400 hover:text-white hover:bg-stone-700' 
                  : 'text-stone-500 hover:text-stone-700 hover:bg-stone-50'
              }`}
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* Tree Content */}
        <div className="p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div 
                className="w-8 h-8 border-3 rounded-full animate-spin"
                style={{ borderColor: `${currentTheme.primaryHex}30`, borderTopColor: currentTheme.primaryHex }}
              />
            </div>
          ) : categoryTree.length === 0 ? (
            <div className="text-center py-12">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${isDark ? 'bg-stone-700' : 'bg-stone-100'}`}>
                <Icon name="folder" size={32} className={isDark ? 'text-stone-500' : 'text-stone-400'} />
              </div>
              <p className={`mb-4 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>No categories yet</p>
              <button
                onClick={() => openAddModal()}
                className="font-medium hover:opacity-80"
                style={{ color: currentTheme.primaryHex }}
              >
                Add your first category
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              {categoryTree.map((category) => (
                <CategoryTreeItem
                  key={category.id}
                  category={category}
                  onEdit={openEditModal}
                  onDelete={(cat) => {
                    setDeletingCategory(cat);
                    setDeleteError(null);
                    setIsDeleteDialogOpen(true);
                  }}
                  onAddChild={(parentId) => openAddModal(parentId)}
                  expandedIds={expandedIds}
                  toggleExpand={toggleExpand}
                  isDark={isDark}
                  primaryColor={currentTheme.primaryHex}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Add New Category'}
        size="md"
      >
        <form onSubmit={handleSubmit}>
          <FormInput
            label="Category Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g. iPhone Covers"
            required
          />

          <FormInput
            label="Slug (URL-friendly name)"
            name="slug"
            value={formData.slug}
            onChange={handleInputChange}
            placeholder="e.g. iphone-covers"
            required
          />

          <FormInput
            label="Parent Category"
            name="parentId"
            type="select"
            value={formData.parentId || ''}
            onChange={handleInputChange}
            options={[
              { value: '', label: '— None (Root Category) —' },
              ...getParentOptions().map(c => ({
                value: c.id,
                label: `${'— '.repeat(c.level)}${c.name}`,
              })),
            ]}
          />

          <FormInput
            label="Description"
            name="description"
            type="textarea"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Brief description of this category"
            rows={3}
          />

          <FormInput
            label="Display Order"
            name="order"
            type="number"
            value={formData.order}
            onChange={handleInputChange}
            min={1}
          />

          <div className="flex items-center gap-3 mb-4">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className={`w-4 h-4 rounded focus:ring-2 ${isDark ? 'bg-stone-700 border-stone-500' : 'border-stone-300'}`}
              style={{ accentColor: currentTheme.primaryHex }}
            />
            <label htmlFor="isActive" className={`text-sm ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
              Active (visible on shop)
            </label>
          </div>

          <div className={`flex gap-3 mt-6 pt-4 border-t ${isDark ? 'border-stone-700' : 'border-stone-200'}`}>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-colors ${
                isDark 
                  ? 'bg-stone-700 text-stone-300 hover:bg-stone-600' 
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 rounded-xl font-semibold text-white disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              style={{ 
                background: `linear-gradient(135deg, ${currentTheme.primaryHex}, ${currentTheme.primaryDark})`
              }}
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Icon name="check" size={18} />
                  {editingCategory ? 'Update' : 'Add Category'}
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setDeletingCategory(null);
          setDeleteError(null);
        }}
        onConfirm={handleDelete}
        title="Delete Category"
        message={
          deleteError ? (
            <div className="text-red-600">{deleteError}</div>
          ) : (
            `Are you sure you want to delete "${deletingCategory?.name}"? All subcategories will also be deleted.`
          )
        }
        confirmText="Delete"
        confirmVariant="danger"
        isLoading={isSubmitting}
      />
    </div>
  );
}
