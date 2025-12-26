/**
 * Admin Dashboard Page
 * Overview with statistics, sales info, and quick actions
 * Supports dark/light mode
 */

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { StatsCard } from '@/components/admin';
import { Icon } from '@/components/atoms';
import { Product, Category, Announcement, Sale, DashboardStats } from '@/lib/types';
import { useTheme } from '@/lib/theme';

export default function AdminDashboard() {
  const { isDark, currentTheme } = useTheme();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    publishedProducts: 0,
    totalCategories: 0,
    activeAnnouncements: 0,
    totalSales: 0,
    todaySales: 0,
    todayRevenue: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
  });
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [recentSales, setRecentSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, categoriesRes, announcementsRes, salesRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories'),
          fetch('/api/announcements?active=true'),
          fetch('/api/sales?limit=5'),
        ]);

        const products: Product[] = (await productsRes.json()).data || [];
        const categories: Category[] = (await categoriesRes.json()).data || [];
        const activeAnnouncements: Announcement[] = (await announcementsRes.json()).data || [];
        const salesData = await salesRes.json();
        const sales: Sale[] = salesData.data || [];

        // Calculate today's sales
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todaysSales = sales.filter(s => new Date(s.saleDate) >= today);

        setStats({
          totalProducts: products.length,
          publishedProducts: products.filter(p => p.published).length,
          totalCategories: categories.length,
          activeAnnouncements: activeAnnouncements.length,
          totalSales: salesData.summary?.totalSales || 0,
          todaySales: todaysSales.length,
          todayRevenue: todaysSales.reduce((sum, s) => sum + s.totalPrice, 0),
          lowStockProducts: products.filter(p => p.stockStatus === 'low_stock').length,
          outOfStockProducts: products.filter(p => p.stockStatus === 'out_of_stock').length,
        });

        // Get 5 most recent products
        setRecentProducts(
          [...products]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5)
        );

        setRecentSales(sales);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Format date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-LK', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get stock badge
  const getStockBadge = (product: Product) => {
    if (product.stockStatus === 'out_of_stock') {
      return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
          isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700'
        }`}>
          Out of Stock
        </span>
      );
    }
    if (product.stockStatus === 'low_stock') {
      return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
          isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'
        }`}>
          Low Stock ({product.stockQuantity})
        </span>
      );
    }
    if (product.stockStatus === 'coming_soon') {
      return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
          isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'
        }`}>
          Coming Soon
        </span>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div 
          className="w-8 h-8 border-2 rounded-full animate-spin"
          style={{ 
            borderColor: `${currentTheme.primaryHex}30`,
            borderTopColor: currentTheme.primaryHex 
          }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className={`
          font-display text-2xl sm:text-3xl font-bold mb-2
          ${isDark ? 'text-white' : 'text-stone-900'}
        `}>
          Dashboard
        </h1>
        <p className={isDark ? 'text-stone-400' : 'text-stone-500'}>
          Welcome to your admin panel. Here&apos;s an overview of your store.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Total Products"
          value={stats.totalProducts}
          icon="smartphone"
          color="teal"
          subtitle={`${stats.publishedProducts} published`}
        />
        <StatsCard
          title="Today's Sales"
          value={stats.todaySales}
          icon="heart"
          color="emerald"
          subtitle={`Rs. ${stats.todayRevenue.toLocaleString()}`}
        />
        <StatsCard
          title="Low Stock"
          value={stats.lowStockProducts}
          icon="tag"
          color="amber"
          subtitle={`${stats.outOfStockProducts} out of stock`}
        />
        <StatsCard
          title="Announcements"
          value={stats.activeAnnouncements}
          icon="sparkles"
          color="indigo"
          subtitle="Active now"
        />
      </div>

      {/* Alerts Section */}
      {(stats.lowStockProducts > 0 || stats.outOfStockProducts > 0) && (
        <div className={`
          mb-6 p-4 rounded-xl border
          ${isDark 
            ? 'bg-amber-500/10 border-amber-500/30' 
            : 'bg-amber-50 border-amber-200'
          }
        `}>
          <div className="flex items-start gap-3">
            <div className={`
              w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
              ${isDark ? 'bg-amber-500/20' : 'bg-amber-100'}
            `}>
              <Icon name="zap" size={16} className={isDark ? 'text-amber-400' : 'text-amber-600'} />
            </div>
            <div className="flex-1">
              <h3 className={`font-semibold mb-1 ${isDark ? 'text-amber-400' : 'text-amber-800'}`}>
                Stock Alert
              </h3>
              <p className={`text-sm ${isDark ? 'text-amber-300/80' : 'text-amber-700'}`}>
                You have {stats.lowStockProducts} product(s) with low stock and {stats.outOfStockProducts} product(s) out of stock.
                <Link 
                  href="/admin/products?filterStock=low_stock" 
                  className="ml-2 underline font-medium"
                  style={{ color: currentTheme.primaryHex }}
                >
                  View products →
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions & Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Quick Actions */}
        <div className={`
          rounded-xl border p-6
          ${isDark 
            ? 'bg-stone-800/50 border-stone-700' 
            : 'bg-white border-stone-200/60'
          }
        `}>
          <h2 className={`
            font-display font-semibold text-lg mb-4
            ${isDark ? 'text-white' : 'text-stone-900'}
          `}>
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/admin/products"
              className={`
                flex items-center gap-3 p-4 rounded-xl font-medium transition-colors
                ${isDark 
                  ? 'bg-teal-500/10 hover:bg-teal-500/20 text-teal-400' 
                  : 'bg-teal-50 hover:bg-teal-100 text-teal-700'
                }
              `}
            >
              <Icon name="smartphone" size={20} />
              Manage Products
            </Link>
            <Link
              href="/admin/sales"
              className={`
                flex items-center gap-3 p-4 rounded-xl font-medium transition-colors
                ${isDark 
                  ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400' 
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                }
              `}
            >
              <Icon name="heart" size={20} />
              Record Sale
            </Link>
            <Link
              href="/admin/categories"
              className={`
                flex items-center gap-3 p-4 rounded-xl font-medium transition-colors
                ${isDark 
                  ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400' 
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-700'
                }
              `}
            >
              <Icon name="tag" size={20} />
              Categories
            </Link>
            <Link
              href="/admin/announcements"
              className={`
                flex items-center gap-3 p-4 rounded-xl font-medium transition-colors
                ${isDark 
                  ? 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400' 
                  : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700'
                }
              `}
            >
              <Icon name="sparkles" size={20} />
              Announcements
            </Link>
          </div>
        </div>

        {/* Recent Sales */}
        <div className={`
          rounded-xl border p-6
          ${isDark 
            ? 'bg-stone-800/50 border-stone-700' 
            : 'bg-white border-stone-200/60'
          }
        `}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`
              font-display font-semibold text-lg
              ${isDark ? 'text-white' : 'text-stone-900'}
            `}>
              Recent Sales
            </h2>
            <Link
              href="/admin/sales"
              className="text-sm font-medium hover:opacity-80 transition-opacity"
              style={{ color: currentTheme.primaryHex }}
            >
              View all →
            </Link>
          </div>
          
          {recentSales.length === 0 ? (
            <p className={`text-center py-8 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
              No sales yet
            </p>
          ) : (
            <div className="space-y-3">
              {recentSales.map((sale) => (
                <div
                  key={sale.id}
                  className={`
                    flex items-center justify-between p-3 rounded-xl transition-colors
                    ${isDark 
                      ? 'bg-stone-700/50 hover:bg-stone-700' 
                      : 'bg-stone-50/50 hover:bg-stone-100/50'
                    }
                  `}
                >
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium truncate ${isDark ? 'text-white' : 'text-stone-900'}`}>
                      {sale.itemName}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                      {formatDate(sale.saleDate)} • Qty: {sale.quantity}
                    </p>
                  </div>
                  <span 
                    className="font-semibold"
                    style={{ color: currentTheme.primaryHex }}
                  >
                    Rs. {sale.totalPrice.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Products with Stock Status */}
      <div className={`
        rounded-xl border p-6
        ${isDark 
          ? 'bg-stone-800/50 border-stone-700' 
          : 'bg-white border-stone-200/60'
        }
      `}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`
            font-display font-semibold text-lg
            ${isDark ? 'text-white' : 'text-stone-900'}
          `}>
            Products Overview
          </h2>
          <Link
            href="/admin/products"
            className="text-sm font-medium hover:opacity-80 transition-opacity"
            style={{ color: currentTheme.primaryHex }}
          >
            View all →
          </Link>
        </div>
        
        {recentProducts.length === 0 ? (
          <p className={`text-center py-8 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
            No products yet
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`
                  text-left text-xs uppercase tracking-wider border-b
                  ${isDark 
                    ? 'text-stone-400 border-stone-700' 
                    : 'text-stone-500 border-stone-100'
                  }
                `}>
                  <th className="pb-3 font-semibold">Product</th>
                  <th className="pb-3 font-semibold">Price</th>
                  <th className="pb-3 font-semibold">Stock</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-stone-700' : 'divide-stone-100'}`}>
                {recentProducts.map((product) => (
                  <tr 
                    key={product.id} 
                    className={`transition-colors ${isDark ? 'hover:bg-stone-700/50' : 'hover:bg-stone-50'}`}
                  >
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className={`
                          w-8 h-8 rounded-lg flex items-center justify-center
                          ${isDark ? 'bg-stone-700' : 'bg-stone-200'}
                        `}>
                          <Icon name="smartphone" size={14} className={isDark ? 'text-stone-400' : 'text-stone-500'} />
                        </div>
                        <span className={`font-medium truncate max-w-[200px] ${isDark ? 'text-white' : 'text-stone-900'}`}>
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className={`py-3 ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                      Rs. {product.price.toLocaleString()}
                    </td>
                    <td className="py-3">
                      {product.stockQuantity !== null ? (
                        <span className={`font-medium ${
                          product.stockQuantity === 0 
                            ? isDark ? 'text-red-400' : 'text-red-600'
                            : product.stockQuantity <= 5 
                              ? isDark ? 'text-amber-400' : 'text-amber-600'
                              : isDark ? 'text-stone-300' : 'text-stone-700'
                        }`}>
                          {product.stockQuantity}
                        </span>
                      ) : (
                        <span className={isDark ? 'text-stone-500' : 'text-stone-400'}>—</span>
                      )}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        {getStockBadge(product)}
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          product.published 
                            ? isDark 
                              ? 'bg-emerald-500/20 text-emerald-400' 
                              : 'bg-emerald-100 text-emerald-700'
                            : isDark 
                              ? 'bg-stone-700 text-stone-400' 
                              : 'bg-stone-100 text-stone-500'
                        }`}>
                          {product.published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
