/**
 * Shop Page - Browse all products
 * Features: Hierarchical category filtering, Search, Product grid, Breadcrumbs
 * Supports dark/light mode
 */

'use client';

import React, { useState, useEffect, useMemo, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Icon, Button } from '@/components/atoms';
import { useTheme } from '@/lib/theme';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  published: boolean;
  stockQuantity: number | null;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock' | 'coming_soon';
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  parentId: string | null;
  level: number;
  path: string[];
  isActive: boolean;
  order: number;
}

interface CategoryWithChildren extends Category {
  children: CategoryWithChildren[];
}

// Category tree item for sidebar
function CategoryTreeItem({
  category,
  selectedCategory,
  onSelect,
  productCounts,
  expandedIds,
  toggleExpand,
  isDark,
  primaryColor,
}: {
  category: CategoryWithChildren;
  selectedCategory: string;
  onSelect: (id: string) => void;
  productCounts: Record<string, number>;
  expandedIds: Set<string>;
  toggleExpand: (id: string) => void;
  isDark: boolean;
  primaryColor: string;
}) {
  const hasChildren = category.children && category.children.length > 0;
  const isExpanded = expandedIds.has(category.id);
  const isSelected = selectedCategory === category.id;

  // Get total count including children
  const getTotalCount = (cat: CategoryWithChildren): number => {
    let total = productCounts[cat.id] || 0;
    if (cat.children) {
      for (const child of cat.children) {
        total += getTotalCount(child);
      }
    }
    return total;
  };
  const totalCount = getTotalCount(category);

  return (
    <div>
      <div className="flex items-center gap-1">
        {hasChildren ? (
          <button
            onClick={() => toggleExpand(category.id)}
            className={`w-6 h-6 flex items-center justify-center transition-colors ${
              isDark ? 'text-stone-500 hover:text-stone-300' : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            <Icon 
              name={isExpanded ? 'chevron-down' : 'chevron-right'} 
              size={14} 
            />
          </button>
        ) : (
          <span className="w-6" />
        )}
        <button
          onClick={() => onSelect(category.id)}
          className={`
            flex-1 flex items-center justify-between
            px-3 py-2 rounded-lg
            text-left font-medium text-sm
            transition-all duration-200
            ${isSelected 
              ? isDark ? 'bg-stone-700' : 'bg-teal-50' 
              : isDark ? 'text-stone-400 hover:bg-stone-700 hover:text-stone-200' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-800'}
          `}
          style={isSelected ? { color: primaryColor } : {}}
        >
          <span className="truncate">{category.name}</span>
          <span className={`
            px-2 py-0.5 rounded-full text-xs
            ${isSelected 
              ? isDark ? 'bg-stone-600' : 'bg-teal-100' 
              : isDark ? 'bg-stone-600 text-stone-400' : 'bg-stone-100 text-stone-500'}
          `}
          style={isSelected ? { color: primaryColor } : {}}
          >
            {totalCount}
          </span>
        </button>
      </div>
      
      {hasChildren && isExpanded && (
        <div className={`ml-6 mt-1 space-y-1 border-l pl-2 ${isDark ? 'border-stone-700' : 'border-stone-200'}`}>
          {category.children.map((child) => (
            <CategoryTreeItem
              key={child.id}
              category={child}
              selectedCategory={selectedCategory}
              onSelect={onSelect}
              productCounts={productCounts}
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

// Breadcrumb component
function Breadcrumbs({ 
  ancestors, 
  currentCategory,
  onSelect,
  isDark,
  primaryColor,
}: { 
  ancestors: Category[]; 
  currentCategory: Category | null;
  onSelect: (id: string) => void;
  isDark: boolean;
  primaryColor: string;
}) {
  return (
    <nav className={`flex items-center gap-2 text-sm mb-4 flex-wrap ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
      <Link href="/" className="hover:opacity-80 transition-colors" style={{ color: isDark ? 'inherit' : 'inherit' }}>Home</Link>
      <Icon name="chevron-right" size={14} />
      <button 
        onClick={() => onSelect('all')}
        className="hover:opacity-80 transition-colors"
      >
        Shop
      </button>
      {ancestors.map((cat) => (
        <React.Fragment key={cat.id}>
          <Icon name="chevron-right" size={14} />
          <button
            onClick={() => onSelect(cat.id)}
            className="hover:opacity-80 transition-colors"
          >
            {cat.name}
          </button>
        </React.Fragment>
      ))}
      {currentCategory && (
        <>
          <Icon name="chevron-right" size={14} />
          <span className="font-medium" style={{ color: primaryColor }}>{currentCategory.name}</span>
        </>
      )}
    </nav>
  );
}

// Separate component that uses useSearchParams
function ShopContent() {
  const { isDark, currentTheme } = useTheme();
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryTree, setCategoryTree] = useState<CategoryWithChildren[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [ancestors, setAncestors] = useState<Category[]>([]);

  // Fetch products and categories
  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, categoriesRes, treeRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories'),
          fetch('/api/categories?format=tree'),
        ]);
        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();
        const treeData = await treeRes.json();
        
        // Only show published products
        setProducts((productsData.data || []).filter((p: Product) => p.published));
        setCategories((categoriesData.data || []).filter((c: Category) => c.isActive));
        setCategoryTree(treeData.data || []);
        
        // Expand all categories by default
        const allCategoryIds = (categoriesData.data || []).map((c: Category) => c.id);
        setExpandedIds(new Set(allCategoryIds));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Fetch ancestors when category changes
  const fetchAncestors = useCallback(async (categoryId: string) => {
    if (categoryId === 'all') {
      setAncestors([]);
      return;
    }
    try {
      const res = await fetch(`/api/categories/${categoryId}?includeAncestors=true`);
      const data = await res.json();
      if (data.success && data.data.ancestors) {
        setAncestors(data.data.ancestors);
      }
    } catch (error) {
      console.error('Error fetching ancestors:', error);
    }
  }, []);

  useEffect(() => {
    fetchAncestors(selectedCategory);
  }, [selectedCategory, fetchAncestors]);

  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const params = new URLSearchParams();
    if (categoryId !== 'all') params.set('category', categoryId);
    if (searchQuery) params.set('search', searchQuery);
    router.push(`/shop${params.toString() ? '?' + params.toString() : ''}`);
  };

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

  // Get all descendant category IDs
  const getDescendantIds = useCallback((categoryId: string): string[] => {
    const ids: string[] = [];
    const findDescendants = (parentId: string) => {
      categories.forEach(cat => {
        if (cat.parentId === parentId) {
          ids.push(cat.id);
          findDescendants(cat.id);
        }
      });
    };
    findDescendants(categoryId);
    return ids;
  }, [categories]);

  // Filter products based on category and search
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      let matchesCategory = selectedCategory === 'all';
      
      if (!matchesCategory) {
        // Check if product matches selected category or any of its descendants
        const descendantIds = getDescendantIds(selectedCategory);
        matchesCategory = product.category === selectedCategory || descendantIds.includes(product.category);
      }
      
      const matchesSearch = searchQuery === '' || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery, getDescendantIds]);

  // Calculate product counts per category
  const productCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    categories.forEach(cat => {
      counts[cat.id] = products.filter(p => p.category === cat.id).length;
    });
    return counts;
  }, [products, categories]);

  // Get category name by id
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || categoryId;
  };

  // Get current category
  const currentCategory = categories.find(c => c.id === selectedCategory) || null;

  // Format price
  const formatPrice = (price: number) => {
    return `Rs. ${price.toLocaleString()}`;
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-stone-900' : 'bg-stone-50'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-md shadow-sm ${
        isDark ? 'bg-stone-900/95 border-b border-stone-800' : 'bg-white/95'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div 
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-lg"
                style={{ 
                  background: `linear-gradient(135deg, ${currentTheme.primaryHex}, ${currentTheme.primaryDark})`,
                  boxShadow: `0 4px 14px ${currentTheme.primaryHex}30`
                }}
              >
                <Icon name="smartphone" size={22} className="text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className={`font-display font-bold text-lg leading-tight ${isDark ? 'text-white' : 'text-stone-900'}`}>
                  Prasanna
                </h1>
                <p className={`text-xs font-medium -mt-0.5 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                  Mobile Center
                </p>
              </div>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <Icon 
                  name="search" 
                  size={20} 
                  className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-stone-500' : 'text-stone-400'}`}
                />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`
                    w-full pl-12 pr-4 py-3
                    rounded-xl
                    border transition-all duration-200
                    ${isDark 
                      ? 'bg-stone-800 border-stone-700 text-white placeholder:text-stone-500 focus:bg-stone-800 focus:border-stone-600' 
                      : 'bg-stone-100 border-transparent text-stone-700 placeholder:text-stone-400 focus:bg-white focus:border-teal-300 focus:ring-2 focus:ring-teal-100'
                    }
                  `}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-stone-500 hover:text-stone-300' : 'text-stone-400 hover:text-stone-600'}`}
                  >
                    <Icon name="close" size={18} />
                  </button>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button
                href="tel:0722902299"
                variant="primary"
                size="sm"
                icon={<Icon name="phone" size={18} />}
                ariaLabel="Call us"
                className="hidden sm:inline-flex"
              >
                <span className="hidden lg:inline">072 290 2299</span>
                <span className="lg:hidden">Call</span>
              </Button>
              <Link
                href="/"
                className={`
                  w-10 h-10
                  rounded-xl
                  flex items-center justify-center
                  transition-colors
                  ${isDark ? 'bg-stone-800 hover:bg-stone-700' : 'bg-stone-100 hover:bg-stone-200'}
                `}
                aria-label="Back to Home"
              >
                <Icon name="home" size={20} className={isDark ? 'text-stone-400' : 'text-stone-600'} />
              </Link>
            </div>
          </div>

          {/* Search Bar - Mobile */}
          <div className="md:hidden pb-4">
            <div className="relative w-full">
              <Icon 
                name="search" 
                size={18} 
                className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-stone-500' : 'text-stone-400'}`}
              />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`
                  w-full pl-11 pr-4 py-2.5
                  rounded-xl
                  border transition-all duration-200
                  text-sm
                  ${isDark 
                    ? 'bg-stone-800 border-stone-700 text-white placeholder:text-stone-500 focus:bg-stone-800 focus:border-stone-600' 
                    : 'bg-stone-100 border-transparent text-stone-700 placeholder:text-stone-400 focus:bg-white focus:border-teal-300 focus:ring-2 focus:ring-teal-100'
                  }
                `}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs 
          ancestors={ancestors} 
          currentCategory={currentCategory}
          onSelect={handleCategorySelect}
          isDark={isDark}
          primaryColor={currentTheme.primaryHex}
        />

        {/* Page Title */}
        <div className="mb-8">
          <h1 className={`font-display text-3xl sm:text-4xl font-bold ${isDark ? 'text-white' : 'text-stone-900'}`}>
            {selectedCategory === 'all' ? 'All Products' : getCategoryName(selectedCategory)}
          </h1>
          <p className={`mt-2 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} available
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Categories */}
          <aside className="lg:w-72 flex-shrink-0">
            <div className={`sticky top-24 rounded-2xl border p-5 ${
              isDark ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200'
            }`}>
              <h2 className={`font-display font-semibold text-lg mb-4 ${isDark ? 'text-white' : 'text-stone-900'}`}>
                Categories
              </h2>
              <nav className="space-y-1">
                <button
                  onClick={() => handleCategorySelect('all')}
                  className={`
                    w-full flex items-center justify-between
                    px-4 py-3 rounded-xl
                    text-left font-medium text-sm
                    transition-all duration-200
                    ${selectedCategory === 'all' 
                      ? isDark ? 'bg-stone-700 border border-stone-600' : 'bg-teal-50 border border-teal-200' 
                      : isDark ? 'text-stone-400 hover:bg-stone-700 hover:text-stone-200' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-800'}
                  `}
                  style={selectedCategory === 'all' ? { color: currentTheme.primaryHex } : {}}
                >
                  <span>All Products</span>
                  <span className={`
                    px-2 py-0.5 rounded-full text-xs
                    ${selectedCategory === 'all' 
                      ? isDark ? 'bg-stone-600' : 'bg-teal-100' 
                      : isDark ? 'bg-stone-600 text-stone-400' : 'bg-stone-100 text-stone-500'}
                  `}
                  style={selectedCategory === 'all' ? { color: currentTheme.primaryHex } : {}}
                  >
                    {products.length}
                  </span>
                </button>
                
                <div className="pt-2 space-y-1">
                  {categoryTree.map((category) => (
                    <CategoryTreeItem
                      key={category.id}
                      category={category}
                      selectedCategory={selectedCategory}
                      onSelect={handleCategorySelect}
                      productCounts={productCounts}
                      expandedIds={expandedIds}
                      toggleExpand={toggleExpand}
                      isDark={isDark}
                      primaryColor={currentTheme.primaryHex}
                    />
                  ))}
                </div>
              </nav>

              {/* Contact CTA */}
              <div className={`mt-6 pt-6 border-t ${isDark ? 'border-stone-700' : 'border-stone-200'}`}>
                <p className={`text-sm mb-3 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                  Can&apos;t find what you need?
                </p>
                <a
                  href="https://wa.me/94722902299?text=Hi!%20I'm%20looking%20for%20a%20specific%20product.%20Can%20you%20help?"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    flex items-center justify-center gap-2
                    w-full py-3 px-4
                    bg-green-500 hover:bg-green-600
                    text-white font-medium text-sm
                    rounded-xl
                    transition-colors
                  "
                >
                  <Icon name="whatsapp" size={18} />
                  Ask on WhatsApp
                </a>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className={`rounded-2xl border p-4 animate-pulse ${
                    isDark ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200'
                  }`}>
                    <div className={`aspect-square rounded-xl mb-4 ${isDark ? 'bg-stone-700' : 'bg-stone-200'}`} />
                    <div className={`h-4 rounded w-3/4 mb-2 ${isDark ? 'bg-stone-700' : 'bg-stone-200'}`} />
                    <div className={`h-3 rounded w-1/2 ${isDark ? 'bg-stone-600' : 'bg-stone-100'}`} />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
                  isDark ? 'bg-stone-800' : 'bg-stone-100'
                }`}>
                  <Icon name="search" size={32} className={isDark ? 'text-stone-600' : 'text-stone-400'} />
                </div>
                <h3 className={`font-display text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-stone-900'}`}>
                  No products found
                </h3>
                <p className={`mb-6 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                  {searchQuery 
                    ? `No results for "${searchQuery}"`
                    : 'No products available in this category yet.'
                  }
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className={`px-6 py-2.5 rounded-xl font-medium transition-colors ${
                        isDark ? 'bg-stone-800 hover:bg-stone-700 text-stone-300' : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                      }`}
                    >
                      Clear Search
                    </button>
                  )}
                  <a
                    href="https://wa.me/94722902299?text=Hi!%20I'm%20looking%20for%20a%20specific%20product.%20Can%20you%20help?"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2.5 bg-green-500 hover:bg-green-600 rounded-xl font-medium text-white transition-colors flex items-center gap-2"
                  >
                    <Icon name="whatsapp" size={18} />
                    Ask Us on WhatsApp
                  </a>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    categoryName={getCategoryName(product.category)}
                    formatPrice={formatPrice}
                    isDark={isDark}
                    primaryColor={currentTheme.primaryHex}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`border-t mt-16 ${isDark ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${currentTheme.primaryHex}, ${currentTheme.primaryDark})` }}
              >
                <Icon name="smartphone" size={16} className="text-white" />
              </div>
              <span className={`font-display font-bold ${isDark ? 'text-white' : 'text-stone-900'}`}>Prasanna Mobile Center</span>
            </Link>
            <div className={`flex items-center gap-6 text-sm ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
              <a href="tel:0722902299" className="hover:opacity-80 transition-colors flex items-center gap-2" style={{ color: 'inherit' }}>
                <Icon name="phone" size={16} />
                072 290 2299
              </a>
              <a 
                href="https://maps.app.goo.gl/X4Exp5vf855PqcfZ7" 
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-colors flex items-center gap-2"
                style={{ color: 'inherit' }}
              >
                <Icon name="location" size={16} />
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Product Card Component
function ProductCard({ 
  product, 
  categoryName, 
  formatPrice,
  isDark,
  primaryColor,
}: { 
  product: Product; 
  categoryName: string;
  formatPrice: (price: number) => string;
  isDark: boolean;
  primaryColor: string;
}) {
  const whatsappMessage = encodeURIComponent(
    `Hi! I'm interested in "${product.name}" (${formatPrice(product.price)}). Is it available?`
  );

  // Stock status config
  const stockConfigLight: Record<string, { bg: string; text: string; label: string }> = {
    in_stock: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'In Stock' },
    low_stock: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Few Left' },
    out_of_stock: { bg: 'bg-red-100', text: 'text-red-700', label: 'Out of Stock' },
    coming_soon: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Coming Soon' },
  };
  
  const stockConfigDark: Record<string, { bg: string; text: string; label: string }> = {
    in_stock: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: 'In Stock' },
    low_stock: { bg: 'bg-amber-500/20', text: 'text-amber-400', label: 'Few Left' },
    out_of_stock: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Out of Stock' },
    coming_soon: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Coming Soon' },
  };
  
  const stockConfig = isDark ? stockConfigDark : stockConfigLight;

  const stockStatus = product.stockStatus || 'in_stock';
  const isOutOfStock = stockStatus === 'out_of_stock';
  const isComingSoon = stockStatus === 'coming_soon';

  return (
    <div className={`
      group
      rounded-2xl
      border
      overflow-hidden
      transition-all duration-300
      ${isOutOfStock || isComingSoon ? 'opacity-75' : ''}
      ${isDark 
        ? 'bg-stone-800 border-stone-700 hover:border-stone-600 hover:shadow-xl hover:shadow-stone-900/50' 
        : 'bg-white border-stone-200 hover:border-teal-200 hover:shadow-xl hover:shadow-teal-500/10'}
    `}>
      {/* Product Image */}
      <div className={`relative aspect-square overflow-hidden ${isDark ? 'bg-stone-700' : 'bg-stone-100'}`}>
        <div className={`
          absolute inset-0 
          flex items-center justify-center
          ${isDark ? 'bg-gradient-to-br from-stone-700 to-stone-800' : 'bg-gradient-to-br from-stone-100 to-stone-200'}
        `}>
          <Icon name="smartphone" size={48} className={isDark ? 'text-stone-600' : 'text-stone-300'} />
        </div>
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className={`
            px-3 py-1.5
            backdrop-blur-sm
            rounded-full
            text-xs font-medium
            border
            ${isDark 
              ? 'bg-stone-800/90 text-stone-300 border-stone-600/50' 
              : 'bg-white/90 text-stone-600 border-stone-200/50'}
          `}>
            {categoryName}
          </span>
        </div>

        {/* Stock Status Badge */}
        {stockStatus !== 'in_stock' && (
          <div className="absolute top-3 right-3">
            <span className={`
              px-3 py-1.5
              backdrop-blur-sm
              rounded-full
              text-xs font-medium
              ${stockConfig[stockStatus].bg}
              ${stockConfig[stockStatus].text}
            `}>
              {stockConfig[stockStatus].label}
            </span>
          </div>
        )}

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className={`absolute inset-0 flex items-center justify-center ${isDark ? 'bg-stone-900/60' : 'bg-white/60'}`}>
            <span className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg text-sm">
              Out of Stock
            </span>
          </div>
        )}

        {/* Quick Action */}
        {!isOutOfStock && !isComingSoon && (
          <a
            href={`https://wa.me/94722902299?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="
              absolute bottom-3 right-3
              w-10 h-10
              bg-green-500 hover:bg-green-600
              rounded-full
              flex items-center justify-center
              text-white
              opacity-0 group-hover:opacity-100
              transform translate-y-2 group-hover:translate-y-0
              transition-all duration-300
              shadow-lg
            "
            aria-label="Inquire on WhatsApp"
          >
            <Icon name="whatsapp" size={20} />
          </a>
        )}
      </div>

      {/* Product Info */}
      <div className="p-5">
        <h3 className={`font-display font-semibold mb-1 line-clamp-2 transition-colors ${
          isDark ? 'text-white group-hover:text-stone-200' : 'text-stone-900 group-hover:text-teal-700'
        }`}>
          {product.name}
        </h3>
        <p className={`text-sm mb-3 line-clamp-2 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="font-display font-bold text-lg" style={{ color: primaryColor }}>
            {formatPrice(product.price)}
          </span>
          {isOutOfStock ? (
            <span className={`text-sm font-medium ${isDark ? 'text-red-400' : 'text-red-500'}`}>
              Notify Me
            </span>
          ) : isComingSoon ? (
            <span className={`text-sm font-medium ${isDark ? 'text-blue-400' : 'text-blue-500'}`}>
              Coming Soon
            </span>
          ) : (
            <a
              href={`https://wa.me/94722902299?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`
                flex items-center gap-1.5
                text-sm font-medium
                hover:text-green-500
                transition-colors
                ${isDark ? 'text-stone-400' : 'text-stone-500'}
              `}
            >
              <span>Inquire</span>
              <Icon name="arrow-right" size={14} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// Loading fallback component
function ShopLoadingFallback() {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-stone-600 dark:text-stone-400">Loading products...</p>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function ShopPage() {
  return (
    <Suspense fallback={<ShopLoadingFallback />}>
      <ShopContent />
    </Suspense>
  );
}
