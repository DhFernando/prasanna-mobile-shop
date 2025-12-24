/**
 * Products Management Page
 * CRUD operations for products
 */

'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Modal, ConfirmDialog, DataTable, FormInput, FormCheckbox } from '@/components/admin';
import { Icon } from '@/components/atoms';
import { Product, Category, ProductFormData } from '@/lib/types';

const initialFormData: ProductFormData = {
  name: '',
  category: '',
  price: 0,
  description: '',
  image: '/images/products/placeholder.jpg',
  published: false,
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);

  // Fetch products and categories
  const fetchData = useCallback(async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories'),
      ]);
      
      const productsData = await productsRes.json();
      const categoriesData = await categoriesRes.json();
      
      setProducts(productsData.data || []);
      setCategories(categoriesData.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
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
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  // Handle checkbox change
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  // Open add modal
  const openAddModal = () => {
    setEditingProduct(null);
    setFormData(initialFormData);
    setIsModalOpen(true);
  };

  // Open edit modal
  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      description: product.description,
      image: product.image,
      published: product.published,
    });
    setIsModalOpen(true);
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = editingProduct 
        ? `/api/products/${editingProduct.id}` 
        : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

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
        alert(error.error || 'Failed to save product');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deletingProduct) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/products/${deletingProduct.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setIsDeleteDialogOpen(false);
        setDeletingProduct(null);
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle publish status
  const handleTogglePublish = async (product: Product) => {
    try {
      await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !product.published }),
      });
      fetchData();
    } catch (error) {
      console.error('Error toggling publish:', error);
    }
  };

  // Table columns
  const columns = [
    {
      key: 'name',
      header: 'Product',
      render: (product: Product) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-stone-200 flex items-center justify-center flex-shrink-0">
            <Icon name="smartphone" size={18} className="text-stone-500" />
          </div>
          <div>
            <p className="font-medium text-stone-900">{product.name}</p>
            <p className="text-xs text-stone-500">{product.id}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (product: Product) => {
        const cat = categories.find(c => c.id === product.category);
        return (
          <span className="text-stone-600">
            {cat?.name || product.category}
          </span>
        );
      },
    },
    {
      key: 'price',
      header: 'Price',
      render: (product: Product) => (
        <span className="font-medium text-stone-900">
          Rs. {product.price.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'published',
      header: 'Status',
      render: (product: Product) => (
        <span className={`
          inline-flex items-center gap-1.5
          px-2.5 py-1 rounded-full text-xs font-medium
          ${product.published 
            ? 'bg-emerald-100 text-emerald-700' 
            : 'bg-stone-100 text-stone-500'
          }
        `}>
          <span className={`w-1.5 h-1.5 rounded-full ${product.published ? 'bg-emerald-500' : 'bg-stone-400'}`} />
          {product.published ? 'Published' : 'Draft'}
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
            Products
          </h1>
          <p className="text-stone-500">
            Manage your mobile accessories inventory
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="
            inline-flex items-center gap-2
            px-5 py-2.5
            bg-gradient-to-r from-teal-600 to-teal-500
            text-white font-semibold rounded-xl
            shadow-lg shadow-teal-500/25
            hover:from-teal-500 hover:to-teal-400
            transition-all
          "
        >
          <Icon name="zap" size={18} />
          Add Product
        </button>
      </div>

      {/* Products Table */}
      <DataTable
        data={products}
        columns={columns}
        getRowId={(p) => p.id}
        onEdit={openEditModal}
        onDelete={(p) => {
          setDeletingProduct(p);
          setIsDeleteDialogOpen(true);
        }}
        onTogglePublish={handleTogglePublish}
        isLoading={isLoading}
        emptyMessage="No products yet. Add your first product!"
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <FormInput
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g. iPhone 15 Pro Case"
            required
          />

          <FormInput
            label="Category"
            name="category"
            type="select"
            value={formData.category}
            onChange={handleInputChange}
            options={categories.map(c => ({ value: c.id, label: c.name }))}
            required
          />

          <FormInput
            label="Price (Rs.)"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleInputChange}
            min={0}
            step={1}
            required
          />

          <FormInput
            label="Description"
            name="description"
            type="textarea"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Short description of the product"
            rows={3}
          />

          <FormInput
            label="Image URL"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
            placeholder="/images/products/placeholder.jpg"
          />

          <FormCheckbox
            label="Publish immediately"
            name="published"
            checked={formData.published}
            onChange={handleCheckboxChange}
            description="Make this product visible on the website"
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
                bg-gradient-to-r from-teal-600 to-teal-500
                text-white
                hover:from-teal-500 hover:to-teal-400
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
                  {editingProduct ? 'Update Product' : 'Add Product'}
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
          setDeletingProduct(null);
        }}
        onConfirm={handleDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${deletingProduct?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
        isLoading={isSubmitting}
      />
    </div>
  );
}

