/**
 * GlobalSearch Component
 * Google-style search with instant autocomplete suggestions
 * Shows products, categories, and quick actions as you type
 * Supports dark/light mode
 */

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Icon } from '@/components/atoms';
import { useTheme } from '@/lib/theme';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  published: boolean;
}

interface Category {
  id: string;
  name: string;
  description: string;
}

interface SearchResult {
  type: 'product' | 'category' | 'suggestion';
  id: string;
  title: string;
  subtitle?: string;
  category?: string;
  categoryName?: string;
  price?: number;
  url: string;
  icon?: 'smartphone' | 'tag' | 'search';
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose }) => {
  const { isDark, currentTheme } = useTheme();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Popular search suggestions
  const popularSearches = [
    'iPhone case',
    'Samsung charger',
    'Wireless earbuds',
    'Screen protector',
    'Power bank',
    'USB-C cable',
  ];

  // Load data on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories'),
        ]);
        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();
        
        setProducts((productsData.data || []).filter((p: Product) => p.published));
        setCategories(categoriesData.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();

    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved).slice(0, 5));
    }
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    if (!isOpen) {
      setQuery('');
      setResults([]);
      setSelectedIndex(-1);
    }
  }, [isOpen]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Get category name by ID
  const getCategoryName = useCallback((categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || categoryId;
  }, [categories]);

  // Format price
  const formatPrice = (price: number) => `Rs. ${price.toLocaleString()}`;

  // Search and filter results
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    const searchTerm = query.toLowerCase();

    // Simulate slight delay for UX
    const timer = setTimeout(() => {
      const searchResults: SearchResult[] = [];

      // Search products
      const matchingProducts = products
        .filter(p => 
          p.name.toLowerCase().includes(searchTerm) ||
          p.description.toLowerCase().includes(searchTerm) ||
          getCategoryName(p.category).toLowerCase().includes(searchTerm)
        )
        .slice(0, 5);

      matchingProducts.forEach(product => {
        searchResults.push({
          type: 'product',
          id: product.id,
          title: product.name,
          subtitle: product.description,
          category: product.category,
          categoryName: getCategoryName(product.category),
          price: product.price,
          url: `/shop?search=${encodeURIComponent(product.name)}`,
          icon: 'smartphone',
        });
      });

      // Search categories
      const matchingCategories = categories
        .filter(c => 
          c.name.toLowerCase().includes(searchTerm) ||
          c.description.toLowerCase().includes(searchTerm)
        )
        .slice(0, 3);

      matchingCategories.forEach(category => {
        searchResults.push({
          type: 'category',
          id: category.id,
          title: category.name,
          subtitle: category.description,
          url: `/shop?category=${category.id}`,
          icon: 'tag',
        });
      });

      // Add search suggestion if we have results
      if (searchResults.length > 0 || query.length >= 2) {
        searchResults.push({
          type: 'suggestion',
          id: 'search-all',
          title: `Search for "${query}"`,
          subtitle: 'View all matching results',
          url: `/shop?search=${encodeURIComponent(query)}`,
          icon: 'search',
        });
      }

      setResults(searchResults);
      setSelectedIndex(-1);
      setIsLoading(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [query, products, categories, getCategoryName]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const totalResults = results.length || (query ? 0 : (recentSearches.length + popularSearches.length));

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < totalResults - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : totalResults - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && results[selectedIndex]) {
        handleResultClick(results[selectedIndex]);
      } else if (query.trim()) {
        handleSearch(query);
      }
    }
  };

  // Handle search submission
  const handleSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) return;

    // Save to recent searches
    const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));

    router.push(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
    onClose();
  };

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'suggestion' || result.type === 'category') {
      router.push(result.url);
    } else {
      // Save product search to recent
      const updated = [result.title, ...recentSearches.filter(s => s !== result.title)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      router.push(result.url);
    }
    onClose();
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 sm:pt-24 px-4">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 backdrop-blur-sm ${isDark ? 'bg-black/60' : 'bg-stone-900/40'}`}
        onClick={onClose}
      />

      {/* Search Container */}
      <div 
        ref={containerRef}
        className={`
          relative w-full max-w-2xl
          rounded-2xl
          shadow-2xl
          overflow-hidden
          animate-fade-in-up
          ${isDark 
            ? 'bg-stone-800 shadow-stone-900/50' 
            : 'bg-white shadow-stone-900/20'
          }
        `}
      >
        {/* Search Input */}
        <div className={`relative border-b ${isDark ? 'border-stone-700' : 'border-stone-200'}`}>
          <Icon 
            name="search" 
            size={22} 
            className={`absolute left-5 top-1/2 -translate-y-1/2 ${isDark ? 'text-stone-500' : 'text-stone-400'}`}
          />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search products, categories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`
              w-full pl-14 pr-12 py-5
              text-lg
              focus:outline-none
              ${isDark 
                ? 'bg-stone-800 text-white placeholder:text-stone-500' 
                : 'text-stone-800 placeholder:text-stone-400'
              }
            `}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className={`absolute right-5 top-1/2 -translate-y-1/2 transition-colors ${
                isDark ? 'text-stone-500 hover:text-stone-300' : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              <Icon name="close" size={20} />
            </button>
          )}
        </div>

        {/* Results / Suggestions */}
        <div className="max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="p-6 text-center">
              <div 
                className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin mx-auto"
                style={{ borderColor: currentTheme.primaryHex, borderTopColor: 'transparent' }}
              />
            </div>
          ) : query && results.length > 0 ? (
            // Search Results
            <div className="py-2">
              {results.map((result, index) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleResultClick(result)}
                  className={`
                    w-full flex items-start gap-4 px-5 py-3.5
                    text-left
                    transition-colors
                    ${selectedIndex === index 
                      ? isDark ? 'bg-stone-700' : 'bg-teal-50' 
                      : isDark ? 'hover:bg-stone-700' : 'hover:bg-stone-50'
                    }
                  `}
                >
                  {/* Icon */}
                  <div className={`
                    flex-shrink-0 w-10 h-10 rounded-xl
                    flex items-center justify-center
                    ${result.type === 'product' 
                      ? isDark ? 'bg-teal-500/20 text-teal-400' : 'bg-teal-100 text-teal-600'
                      : result.type === 'category'
                        ? isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600'
                        : isDark ? 'bg-stone-700 text-stone-400' : 'bg-stone-100 text-stone-500'
                    }
                  `}>
                    <Icon 
                      name={result.icon || 'search'} 
                      size={20} 
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium truncate ${isDark ? 'text-white' : 'text-stone-800'}`}>
                        {result.title}
                      </span>
                      {result.type === 'product' && result.price && (
                        <span 
                          className="flex-shrink-0 text-sm font-semibold"
                          style={{ color: currentTheme.primaryHex }}
                        >
                          {formatPrice(result.price)}
                        </span>
                      )}
                    </div>
                    {result.subtitle && (
                      <p className={`text-sm truncate mt-0.5 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                        {result.subtitle}
                      </p>
                    )}
                    {result.type === 'product' && result.categoryName && (
                      <span className={`
                        inline-block mt-1.5 px-2 py-0.5
                        text-xs font-medium
                        rounded-full
                        ${isDark ? 'bg-stone-700 text-stone-300' : 'bg-stone-100 text-stone-600'}
                      `}>
                        {result.categoryName}
                      </span>
                    )}
                  </div>

                  {/* Arrow */}
                  <Icon 
                    name="arrow-right" 
                    size={16} 
                    className={`flex-shrink-0 mt-3 ${isDark ? 'text-stone-500' : 'text-stone-400'}`}
                  />
                </button>
              ))}
            </div>
          ) : query && results.length === 0 ? (
            // No results
            <div className="p-8 text-center">
              <div className={`w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center ${isDark ? 'bg-stone-700' : 'bg-stone-100'}`}>
                <Icon name="search" size={24} className={isDark ? 'text-stone-500' : 'text-stone-400'} />
              </div>
              <p className={`font-medium mb-1 ${isDark ? 'text-white' : 'text-stone-600'}`}>No results found</p>
              <p className={`text-sm mb-4 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>Try different keywords or browse categories</p>
              <Link
                href="/shop"
                onClick={onClose}
                className="
                  inline-flex items-center gap-2
                  px-4 py-2
                  text-white text-sm font-medium
                  rounded-lg
                  transition-colors
                "
                style={{ backgroundColor: currentTheme.primaryHex }}
              >
                Browse All Products
                <Icon name="arrow-right" size={16} />
              </Link>
            </div>
          ) : (
            // Default: Recent & Popular Searches
            <div className="py-3">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between px-5 py-2">
                    <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
                      Recent Searches
                    </span>
                    <button
                      onClick={clearRecentSearches}
                      className={`text-xs transition-colors ${isDark ? 'text-stone-500 hover:text-stone-300' : 'text-stone-400 hover:text-stone-600'}`}
                    >
                      Clear
                    </button>
                  </div>
                  {recentSearches.map((search, index) => (
                    <button
                      key={`recent-${index}`}
                      onClick={() => handleSuggestionClick(search)}
                      className={`
                        w-full flex items-center gap-3 px-5 py-2.5
                        text-left
                        transition-colors
                        ${selectedIndex === index 
                          ? isDark ? 'bg-stone-700' : 'bg-teal-50' 
                          : isDark ? 'hover:bg-stone-700' : 'hover:bg-stone-50'
                        }
                      `}
                    >
                      <Icon name="clock" size={16} className={isDark ? 'text-stone-500' : 'text-stone-400'} />
                      <span className={isDark ? 'text-stone-300' : 'text-stone-700'}>{search}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Popular Searches */}
              <div>
                <div className="px-5 py-2">
                  <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
                    Popular Searches
                  </span>
                </div>
                <div className="px-5 py-2 flex flex-wrap gap-2">
                  {popularSearches.map((search, index) => (
                    <button
                      key={`popular-${index}`}
                      onClick={() => handleSuggestionClick(search)}
                      className={`
                        px-3 py-1.5
                        text-sm
                        rounded-full
                        transition-colors
                        ${isDark 
                          ? 'text-stone-300 bg-stone-700 hover:bg-stone-600' 
                          : 'text-stone-600 bg-stone-100 hover:bg-teal-100 hover:text-teal-700'
                        }
                      `}
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>

              {/* Browse Categories */}
              <div className={`mt-4 border-t ${isDark ? 'border-stone-700' : 'border-stone-100'}`}>
                <div className="px-5 py-3">
                  <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
                    Browse Categories
                  </span>
                </div>
                <div className="px-3 pb-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {categories.slice(0, 6).map((category) => (
                    <Link
                      key={category.id}
                      href={`/shop?category=${category.id}`}
                      onClick={onClose}
                      className={`
                        flex items-center gap-2 px-3 py-2.5
                        text-sm
                        rounded-xl
                        transition-colors
                        ${isDark 
                          ? 'text-stone-300 bg-stone-700 hover:bg-stone-600' 
                          : 'text-stone-600 bg-stone-50 hover:bg-teal-50 hover:text-teal-700'
                        }
                      `}
                    >
                      <Icon name="tag" size={14} className={isDark ? 'text-stone-500' : 'text-stone-400'} />
                      <span className="truncate">{category.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`border-t px-5 py-3 flex items-center justify-between text-xs ${
          isDark 
            ? 'border-stone-700 bg-stone-900 text-stone-500' 
            : 'border-stone-200 bg-stone-50 text-stone-500'
        }`}>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <kbd className={`px-1.5 py-0.5 border rounded text-[10px] font-mono ${
                isDark ? 'bg-stone-700 border-stone-600' : 'bg-white border-stone-300'
              }`}>↑</kbd>
              <kbd className={`px-1.5 py-0.5 border rounded text-[10px] font-mono ${
                isDark ? 'bg-stone-700 border-stone-600' : 'bg-white border-stone-300'
              }`}>↓</kbd>
              <span className="ml-1">Navigate</span>
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className={`px-1.5 py-0.5 border rounded text-[10px] font-mono ${
                isDark ? 'bg-stone-700 border-stone-600' : 'bg-white border-stone-300'
              }`}>Enter</kbd>
              <span className="ml-1">Select</span>
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className={`px-1.5 py-0.5 border rounded text-[10px] font-mono ${
                isDark ? 'bg-stone-700 border-stone-600' : 'bg-white border-stone-300'
              }`}>Esc</kbd>
              <span className="ml-1">Close</span>
            </span>
          </div>
          <Link
            href="/shop"
            onClick={onClose}
            className="font-medium transition-colors"
            style={{ color: currentTheme.primaryHex }}
          >
            View All Products →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearch;


