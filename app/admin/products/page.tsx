/**
 * Products Management Page
 * CRUD operations for products with stock management and pagination
 * Supports dark/light mode
 */

'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Modal, ConfirmDialog, FormInput, FormCheckbox } from '@/components/admin';
import { Icon } from '@/components/atoms';
import { Product, Category, ProductFormData, StockStatus } from '@/lib/types';
import { useTheme } from '@/lib/theme';

const initialFormData: ProductFormData = {
  name: '',
  category: '',
  price: 0,
  description: '',
  image: '/images/products/placeholder.jpg',
  published: false,
  stockQuantity: null,
  stockStatus: 'in_stock',
};

const ITEMS_PER_PAGE = 10;

export default function ProductsPage() {
  const { isDark, currentTheme } = useTheme();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Pagination & Filters
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStock, setFilterStock] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [stockProduct, setStockProduct] = useState<Product | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [stockFormData, setStockFormData] = useState({ quantity: '', status: 'in_stock' as StockStatus });

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

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !filterCategory || product.category === filterCategory;
    const matchesStock = !filterStock || product.stockStatus === filterStock;
    return matchesSearch && matchesCategory && matchesStock;
  });

  // Paginate
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterCategory, filterStock]);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? null : parseFloat(value)) : value,
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
      stockQuantity: product.stockQuantity,
      stockStatus: product.stockStatus || 'in_stock',
    });
    setIsModalOpen(true);
  };

  // Open stock modal
  const openStockModal = (product: Product) => {
    setStockProduct(product);
    setStockFormData({
      quantity: product.stockQuantity?.toString() || '',
      status: product.stockStatus || 'in_stock',
    });
    setIsStockModalOpen(true);
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

  // Handle stock update
  const handleStockUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockProduct) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/products/${stockProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stockQuantity: stockFormData.quantity === '' ? null : parseInt(stockFormData.quantity),
          stockStatus: stockFormData.status,
        }),
      });

      if (res.ok) {
        setIsStockModalOpen(false);
        setStockProduct(null);
        fetchData();
      }
    } catch (error) {
      console.error('Error updating stock:', error);
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

  // Get stock status badge
  const getStockBadge = (product: Product) => {
    const statusConfig: Record<StockStatus, { light: string; dark: string; label: string }> = {
      in_stock: { light: 'bg-emerald-100 text-emerald-700', dark: 'bg-emerald-500/20 text-emerald-400', label: 'In Stock' },
      low_stock: { light: 'bg-amber-100 text-amber-700', dark: 'bg-amber-500/20 text-amber-400', label: 'Low Stock' },
      out_of_stock: { light: 'bg-red-100 text-red-700', dark: 'bg-red-500/20 text-red-400', label: 'Out of Stock' },
      coming_soon: { light: 'bg-blue-100 text-blue-700', dark: 'bg-blue-500/20 text-blue-400', label: 'Coming Soon' },
    };

    const status = product.stockStatus || 'in_stock';
    const config = statusConfig[status];

    return (
      <div className="flex flex-col items-start gap-1">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${isDark ? config.dark : config.light}`}>
          {config.label}
        </span>
        {product.stockQuantity !== null && (
          <span className={`text-xs ${isDark ? 'text-stone-500' : 'text-stone-500'}`}>
            Qty: {product.stockQuantity}
          </span>
        )}
      </div>
    );
  };

  // Get category name
  const getCategoryName = (categoryId: string) => {
    const cat = categories.find(c => c.id === categoryId);
    return cat?.name || categoryId;
  };

  // Input classes
  const inputClass = `
    w-full px-4 py-2.5 rounded-lg border
    focus:ring-2 focus:ring-offset-0 transition-colors
    ${isDark 
      ? 'bg-stone-800 border-stone-600 text-white placeholder-stone-400 focus:border-stone-500' 
      : 'bg-stone-50 border-stone-200 text-stone-900 placeholder-stone-400 focus:border-teal-500'
    }
  `;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className={`font-display text-2xl sm:text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-stone-900'}`}>
            Products
          </h1>
          <p className={isDark ? 'text-stone-400' : 'text-stone-500'}>
            Manage your mobile accessories inventory ({filteredProducts.length} items)
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-white font-semibold rounded-xl shadow-lg transition-all hover:opacity-90"
          style={{ 
            background: `linear-gradient(135deg, ${currentTheme.primaryHex}, ${currentTheme.primaryDark})`,
            boxShadow: `0 4px 14px ${currentTheme.primaryHex}40`
          }}
        >
          <Icon name="zap" size={18} />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className={`rounded-xl border p-4 mb-6 ${isDark ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-stone-200'}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Icon name="search" size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-stone-500' : 'text-stone-400'}`} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`${inputClass} pl-10`}
            />
          </div>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className={inputClass}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          {/* Stock Filter */}
          <select
            value={filterStock}
            onChange={(e) => setFilterStock(e.target.value)}
            className={inputClass}
          >
            <option value="">All Stock Status</option>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
            <option value="coming_soon">Coming Soon</option>
          </select>

          {/* Clear Filters */}
          {(searchQuery || filterCategory || filterStock) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterCategory('');
                setFilterStock('');
              }}
              className={`px-4 py-2.5 rounded-lg border transition-colors ${
                isDark 
                  ? 'text-stone-300 border-stone-600 hover:bg-stone-700' 
                  : 'text-stone-600 border-stone-200 hover:bg-stone-50'
              }`}
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Products Table */}
      <div className={`rounded-xl border overflow-hidden ${isDark ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-stone-200'}`}>
        {isLoading ? (
          <div className="p-12 text-center">
            <div 
              className="w-8 h-8 border-2 rounded-full animate-spin mx-auto mb-3"
              style={{ borderColor: `${currentTheme.primaryHex}30`, borderTopColor: currentTheme.primaryHex }}
            />
            <p className={isDark ? 'text-stone-400' : 'text-stone-500'}>Loading products...</p>
          </div>
        ) : paginatedProducts.length === 0 ? (
          <div className="p-12 text-center">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${isDark ? 'bg-stone-700' : 'bg-stone-100'}`}>
              <Icon name="smartphone" size={28} className={isDark ? 'text-stone-500' : 'text-stone-400'} />
            </div>
            <p className={`font-medium mb-1 ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>No products found</p>
            <p className={`text-sm ${isDark ? 'text-stone-500' : 'text-stone-500'}`}>
              {searchQuery || filterCategory || filterStock 
                ? 'Try adjusting your filters' 
                : 'Add your first product!'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`border-b ${isDark ? 'bg-stone-800 border-stone-700' : 'bg-stone-50 border-stone-200'}`}>
                  <tr>
                    <th className={`text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>Product</th>
                    <th className={`text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>Category</th>
                    <th className={`text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>Price</th>
                    <th className={`text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>Stock</th>
                    <th className={`text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>Status</th>
                    <th className={`text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-stone-700' : 'divide-stone-100'}`}>
                  {paginatedProducts.map((product) => (
                    <tr key={product.id} className={`transition-colors ${isDark ? 'hover:bg-stone-700/50' : 'hover:bg-stone-50'}`}>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-stone-700' : 'bg-stone-200'}`}>
                            <Icon name="smartphone" size={18} className={isDark ? 'text-stone-400' : 'text-stone-500'} />
                          </div>
                          <div>
                            <p className={`font-medium ${isDark ? 'text-white' : 'text-stone-900'}`}>{product.name}</p>
                            <p className={`text-xs line-clamp-1 ${isDark ? 'text-stone-500' : 'text-stone-500'}`}>{product.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={isDark ? 'text-stone-300' : 'text-stone-600'}>{getCategoryName(product.category)}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-medium ${isDark ? 'text-white' : 'text-stone-900'}`}>Rs. {product.price.toLocaleString()}</span>
                      </td>
                      <td className="py-3 px-4">
                        {getStockBadge(product)}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleTogglePublish(product)}
                          className={`
                            inline-flex items-center gap-1.5
                            px-2.5 py-1 rounded-full text-xs font-medium
                            transition-colors cursor-pointer
                            ${product.published 
                              ? isDark 
                                ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' 
                                : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                              : isDark
                                ? 'bg-stone-700 text-stone-400 hover:bg-stone-600'
                                : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                            }
                          `}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${product.published ? 'bg-emerald-500' : isDark ? 'bg-stone-500' : 'bg-stone-400'}`} />
                          {product.published ? 'Published' : 'Draft'}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openStockModal(product)}
                            className={`p-2 rounded-lg transition-colors ${isDark ? 'text-stone-400 hover:text-amber-400 hover:bg-amber-500/10' : 'text-stone-400 hover:text-amber-600 hover:bg-amber-50'}`}
                            title="Update Stock"
                          >
                            <Icon name="tag" size={16} />
                          </button>
                          <button
                            onClick={() => openEditModal(product)}
                            className={`p-2 rounded-lg transition-colors ${isDark ? 'text-stone-400 hover:text-teal-400 hover:bg-teal-500/10' : 'text-stone-400 hover:text-teal-600 hover:bg-teal-50'}`}
                            title="Edit"
                          >
                            <Icon name="tools" size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setDeletingProduct(product);
                              setIsDeleteDialogOpen(true);
                            }}
                            className={`p-2 rounded-lg transition-colors ${isDark ? 'text-stone-400 hover:text-red-400 hover:bg-red-500/10' : 'text-stone-400 hover:text-red-600 hover:bg-red-50'}`}
                            title="Delete"
                          >
                            <Icon name="close" size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={`flex items-center justify-between px-4 py-3 border-t ${isDark ? 'border-stone-700' : 'border-stone-200'}`}>
                <p className={`text-sm ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                  Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      isDark 
                        ? 'text-stone-300 bg-stone-700 hover:bg-stone-600' 
                        : 'text-stone-600 bg-stone-100 hover:bg-stone-200'
                    }`}
                  >
                    Previous
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let page = i + 1;
                    if (totalPages > 5 && currentPage > 3) {
                      page = currentPage - 2 + i;
                      if (page > totalPages) page = totalPages - 4 + i;
                    }
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 text-sm font-medium rounded-lg transition-colors ${
                          currentPage === page 
                            ? 'text-white' 
                            : isDark
                              ? 'text-stone-400 hover:bg-stone-700'
                              : 'text-stone-600 hover:bg-stone-100'
                        }`}
                        style={currentPage === page ? { backgroundColor: currentTheme.primaryHex } : {}}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      isDark 
                        ? 'text-stone-300 bg-stone-700 hover:bg-stone-600' 
                        : 'text-stone-600 bg-stone-100 hover:bg-stone-200'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

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

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Stock Quantity (optional)"
              name="stockQuantity"
              type="number"
              value={formData.stockQuantity ?? ''}
              onChange={handleInputChange}
              min={0}
              placeholder="Leave empty if not tracking"
            />

            <FormInput
              label="Stock Status"
              name="stockStatus"
              type="select"
              value={formData.stockStatus}
              onChange={handleInputChange}
              options={[
                { value: 'in_stock', label: 'In Stock' },
                { value: 'low_stock', label: 'Low Stock' },
                { value: 'out_of_stock', label: 'Out of Stock' },
                { value: 'coming_soon', label: 'Coming Soon' },
              ]}
            />
          </div>

          <FormCheckbox
            label="Publish immediately"
            name="published"
            checked={formData.published}
            onChange={handleCheckboxChange}
            description="Make this product visible on the website"
          />

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
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Stock Update Modal */}
      <Modal
        isOpen={isStockModalOpen}
        onClose={() => {
          setIsStockModalOpen(false);
          setStockProduct(null);
        }}
        title="Update Stock"
        size="sm"
      >
        <form onSubmit={handleStockUpdate}>
          <div className={`mb-4 p-3 rounded-lg ${isDark ? 'bg-stone-700' : 'bg-stone-50'}`}>
            <p className={`font-medium ${isDark ? 'text-white' : 'text-stone-900'}`}>{stockProduct?.name}</p>
            <p className={`text-sm ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
              Current: {stockProduct?.stockQuantity ?? 'Not tracking'}
            </p>
          </div>

          <FormInput
            label="Stock Quantity"
            name="quantity"
            type="number"
            value={stockFormData.quantity}
            onChange={(e) => setStockFormData(prev => ({ ...prev, quantity: e.target.value }))}
            min={0}
            placeholder="Leave empty to stop tracking"
          />

          <FormInput
            label="Stock Status"
            name="status"
            type="select"
            value={stockFormData.status}
            onChange={(e) => setStockFormData(prev => ({ ...prev, status: e.target.value as StockStatus }))}
            options={[
              { value: 'in_stock', label: 'In Stock' },
              { value: 'low_stock', label: 'Low Stock' },
              { value: 'out_of_stock', label: 'Out of Stock' },
              { value: 'coming_soon', label: 'Coming Soon' },
            ]}
          />

          <div className={`flex gap-3 mt-6 pt-4 border-t ${isDark ? 'border-stone-700' : 'border-stone-200'}`}>
            <button
              type="button"
              onClick={() => {
                setIsStockModalOpen(false);
                setStockProduct(null);
              }}
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
              className="flex-1 py-3 px-4 rounded-xl font-semibold bg-gradient-to-r from-amber-500 to-amber-400 text-white hover:from-amber-400 hover:to-amber-300 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Icon name="check" size={18} />
                  Update Stock
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
