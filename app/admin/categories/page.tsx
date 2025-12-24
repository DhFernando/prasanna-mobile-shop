/**
 * Categories Management Page
 * CRUD operations for categories
 */

'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Modal, ConfirmDialog, DataTable, FormInput } from '@/components/admin';
import { Icon } from '@/components/atoms';
import { Category, CategoryFormData } from '@/lib/types';

const initialFormData: CategoryFormData = {
  name: '',
  description: '',
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<CategoryFormData>(initialFormData);

  // Fetch categories
  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Open add modal
  const openAddModal = () => {
    setEditingCategory(null);
    setFormData(initialFormData);
    setIsModalOpen(true);
  };

  // Open edit modal
  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
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

    try {
      const res = await fetch(`/api/categories/${deletingCategory.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setIsDeleteDialogOpen(false);
        setDeletingCategory(null);
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Table columns
  const columns = [
    {
      key: 'name',
      header: 'Category',
      render: (category: Category) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
            <Icon name="tag" size={18} className="text-amber-600" />
          </div>
          <div>
            <p className="font-medium text-stone-900">{category.name}</p>
            <p className="text-xs text-stone-500">{category.id}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (category: Category) => (
        <span className="text-stone-600 line-clamp-2">
          {category.description || '—'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (category: Category) => (
        <span className="text-stone-500 text-sm">
          {new Date(category.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 mb-1">
            Categories
          </h1>
          <p className="text-stone-500">
            Organize your products into categories
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="
            inline-flex items-center gap-2
            px-5 py-2.5
            bg-gradient-to-r from-amber-500 to-orange-500
            text-white font-semibold rounded-xl
            shadow-lg shadow-amber-500/25
            hover:from-amber-400 hover:to-orange-400
            transition-all
          "
        >
          <Icon name="zap" size={18} />
          Add Category
        </button>
      </div>

      {/* Categories Table */}
      <DataTable
        data={categories}
        columns={columns}
        getRowId={(c) => c.id}
        onEdit={openEditModal}
        onDelete={(c) => {
          setDeletingCategory(c);
          setIsDeleteDialogOpen(true);
        }}
        isLoading={isLoading}
        emptyMessage="No categories yet. Add your first category!"
      />

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
            placeholder="e.g. Phone Covers"
            required
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

          <div className="flex gap-3 mt-6 pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="
                flex-1 py-3 px-4
                rounded-xl font-semibold
                bg-stone-100 text-stone-700
                hover:bg-stone-200
                transition-colors
              "
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="
                flex-1 py-3 px-4
                rounded-xl font-semibold
                bg-gradient-to-r from-amber-500 to-orange-500
                text-white
                hover:from-amber-400 hover:to-orange-400
                disabled:opacity-50
                transition-all
                flex items-center justify-center gap-2
              "
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
        }}
        onConfirm={handleDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${deletingCategory?.name}"? Products in this category won't be deleted.`}
        confirmText="Delete"
        confirmVariant="danger"
        isLoading={isSubmitting}
      />
    </div>
  );
}

