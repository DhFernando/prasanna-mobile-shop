/**
 * Shop Page - Browse all products
 * Features: Category filtering, Search, Product grid
 */

'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Icon, Button } from '@/components/atoms';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  published: boolean;
}

interface Category {
  id: string;
  name: string;
  description: string;
}

// Separate component that uses useSearchParams
function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch products and categories
  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories'),
        ]);
        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();
        
        // Only show published products
        setProducts((productsData.data || []).filter((p: Product) => p.published));
        setCategories(categoriesData.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Filter products based on category and search
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch = searchQuery === '' || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Get category name by id
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || categoryId;
  };

  // Format price
  const formatPrice = (price: number) => {
    return `Rs. ${price.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="
                w-10 h-10 sm:w-11 sm:h-11
                rounded-xl
                bg-gradient-to-br from-teal-500 to-emerald-600
                flex items-center justify-center
                group-hover:scale-105
                transition-transform duration-300
                shadow-lg shadow-teal-500/30
              ">
                <Icon name="smartphone" size={22} className="text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-display font-bold text-lg text-stone-900 leading-tight">
                  Prasanna
                </h1>
                <p className="text-xs text-stone-500 font-medium -mt-0.5">
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
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" 
                />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="
                    w-full pl-12 pr-4 py-3
                    bg-stone-100 rounded-xl
                    border border-transparent
                    focus:bg-white focus:border-teal-300 focus:ring-2 focus:ring-teal-100
                    transition-all duration-200
                    text-stone-700 placeholder:text-stone-400
                  "
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
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
                className="
                  w-10 h-10
                  rounded-xl
                  bg-stone-100 hover:bg-stone-200
                  flex items-center justify-center
                  transition-colors
                "
                aria-label="Back to Home"
              >
                <Icon name="arrow-left" size={20} className="text-stone-600" />
              </Link>
            </div>
          </div>

          {/* Search Bar - Mobile */}
          <div className="md:hidden pb-4">
            <div className="relative w-full">
              <Icon 
                name="search" 
                size={18} 
                className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" 
              />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="
                  w-full pl-11 pr-4 py-2.5
                  bg-stone-100 rounded-xl
                  border border-transparent
                  focus:bg-white focus:border-teal-300 focus:ring-2 focus:ring-teal-100
                  transition-all duration-200
                  text-stone-700 placeholder:text-stone-400
                  text-sm
                "
              />
            </div>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-sm text-stone-500 mb-4">
            <Link href="/" className="hover:text-teal-600 transition-colors">Home</Link>
            <Icon name="arrow-right" size={14} />
            <span className="text-stone-700">Shop</span>
            {selectedCategory !== 'all' && (
              <>
                <Icon name="arrow-right" size={14} />
                <span className="text-teal-600">{getCategoryName(selectedCategory)}</span>
              </>
            )}
          </nav>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-stone-900">
            {selectedCategory === 'all' ? 'All Products' : getCategoryName(selectedCategory)}
          </h1>
          <p className="text-stone-600 mt-2">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} available
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Categories */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl border border-stone-200 p-5">
              <h2 className="font-display font-semibold text-lg text-stone-900 mb-4">
                Categories
              </h2>
              <nav className="space-y-1">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`
                    w-full flex items-center justify-between
                    px-4 py-3 rounded-xl
                    text-left font-medium text-sm
                    transition-all duration-200
                    ${selectedCategory === 'all' 
                      ? 'bg-teal-50 text-teal-700 border border-teal-200' 
                      : 'text-stone-600 hover:bg-stone-50 hover:text-stone-800'}
                  `}
                >
                  <span>All Products</span>
                  <span className={`
                    px-2 py-0.5 rounded-full text-xs
                    ${selectedCategory === 'all' ? 'bg-teal-100 text-teal-700' : 'bg-stone-100 text-stone-500'}
                  `}>
                    {products.length}
                  </span>
                </button>
                
                {categories.map((category) => {
                  const count = products.filter(p => p.category === category.id).length;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`
                        w-full flex items-center justify-between
                        px-4 py-3 rounded-xl
                        text-left font-medium text-sm
                        transition-all duration-200
                        ${selectedCategory === category.id 
                          ? 'bg-teal-50 text-teal-700 border border-teal-200' 
                          : 'text-stone-600 hover:bg-stone-50 hover:text-stone-800'}
                      `}
                    >
                      <span>{category.name}</span>
                      <span className={`
                        px-2 py-0.5 rounded-full text-xs
                        ${selectedCategory === category.id ? 'bg-teal-100 text-teal-700' : 'bg-stone-100 text-stone-500'}
                      `}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </nav>

              {/* Contact CTA */}
              <div className="mt-6 pt-6 border-t border-stone-200">
                <p className="text-sm text-stone-600 mb-3">
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
                  <div key={i} className="bg-white rounded-2xl border border-stone-200 p-4 animate-pulse">
                    <div className="aspect-square bg-stone-200 rounded-xl mb-4" />
                    <div className="h-4 bg-stone-200 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-stone-100 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-stone-100 flex items-center justify-center">
                  <Icon name="search" size={32} className="text-stone-400" />
                </div>
                <h3 className="font-display text-xl font-semibold text-stone-900 mb-2">
                  No products found
                </h3>
                <p className="text-stone-600 mb-6">
                  {searchQuery 
                    ? `No results for "${searchQuery}"`
                    : 'No products available in this category yet.'
                  }
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="px-6 py-2.5 bg-stone-100 hover:bg-stone-200 rounded-xl font-medium text-stone-700 transition-colors"
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
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
                <Icon name="smartphone" size={16} className="text-white" />
              </div>
              <span className="font-display font-bold text-stone-900">Prasanna Mobile Center</span>
            </Link>
            <div className="flex items-center gap-6 text-sm text-stone-600">
              <a href="tel:0722902299" className="hover:text-teal-600 transition-colors flex items-center gap-2">
                <Icon name="phone" size={16} />
                072 290 2299
              </a>
              <a 
                href="https://maps.app.goo.gl/X4Exp5vf855PqcfZ7" 
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-teal-600 transition-colors flex items-center gap-2"
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
  formatPrice 
}: { 
  product: Product; 
  categoryName: string;
  formatPrice: (price: number) => string;
}) {
  const whatsappMessage = encodeURIComponent(
    `Hi! I'm interested in "${product.name}" (${formatPrice(product.price)}). Is it available?`
  );

  return (
    <div className="
      group
      bg-white rounded-2xl
      border border-stone-200
      overflow-hidden
      hover:shadow-xl hover:shadow-teal-500/10
      hover:border-teal-200
      transition-all duration-300
    ">
      {/* Product Image */}
      <div className="relative aspect-square bg-stone-100 overflow-hidden">
        <div className="
          absolute inset-0 
          flex items-center justify-center
          bg-gradient-to-br from-stone-100 to-stone-200
        ">
          <Icon name="smartphone" size={48} className="text-stone-300" />
        </div>
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="
            px-3 py-1.5
            bg-white/90 backdrop-blur-sm
            rounded-full
            text-xs font-medium text-stone-600
            border border-stone-200/50
          ">
            {categoryName}
          </span>
        </div>

        {/* Quick Action */}
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
      </div>

      {/* Product Info */}
      <div className="p-5">
        <h3 className="font-display font-semibold text-stone-900 mb-1 line-clamp-2 group-hover:text-teal-700 transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-stone-500 mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="font-display font-bold text-lg text-teal-600">
            {formatPrice(product.price)}
          </span>
          <a
            href={`https://wa.me/94722902299?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex items-center gap-1.5
              text-sm font-medium text-stone-500
              hover:text-green-600
              transition-colors
            "
          >
            <span>Inquire</span>
            <Icon name="arrow-right" size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-stone-600">Loading products...</p>
        </div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}

