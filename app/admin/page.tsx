/**
 * Admin Dashboard Page
 * Overview with statistics and quick actions
 */

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { StatsCard } from '@/components/admin';
import { Icon } from '@/components/atoms';
import { Product, Category, Announcement, DashboardStats } from '@/lib/types';

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    publishedProducts: 0,
    totalCategories: 0,
    activeAnnouncements: 0,
  });
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, categoriesRes, announcementsRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories'),
          fetch('/api/announcements?active=true'),
        ]);

        const products: Product[] = (await productsRes.json()).data || [];
        const categories: Category[] = (await categoriesRes.json()).data || [];
        const activeAnnouncements: Announcement[] = (await announcementsRes.json()).data || [];

        setStats({
          totalProducts: products.length,
          publishedProducts: products.filter(p => p.published).length,
          totalCategories: categories.length,
          activeAnnouncements: activeAnnouncements.length,
        });

        // Get 5 most recent products
        setRecentProducts(
          [...products]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5)
        );
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-teal-500/30 border-t-teal-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
          Dashboard
        </h1>
        <p className="text-stone-500">
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
          title="Published"
          value={stats.publishedProducts}
          icon="check"
          color="emerald"
        />
        <StatsCard
          title="Categories"
          value={stats.totalCategories}
          icon="tag"
          color="amber"
        />
        <StatsCard
          title="Active Announcements"
          value={stats.activeAnnouncements}
          icon="sparkles"
          color="indigo"
        />
      </div>

      {/* Quick Actions & Recent Products */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="
          bg-white rounded-xl
          border border-stone-200/60
          p-6
        ">
          <h2 className="font-display font-semibold text-lg text-stone-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/admin/products"
              className="
                flex items-center gap-3
                p-4 rounded-xl
                bg-teal-50 hover:bg-teal-100
                text-teal-700 font-medium
                transition-colors
              "
            >
              <Icon name="smartphone" size={20} />
              Manage Products
            </Link>
            <Link
              href="/admin/categories"
              className="
                flex items-center gap-3
                p-4 rounded-xl
                bg-amber-50 hover:bg-amber-100
                text-amber-700 font-medium
                transition-colors
              "
            >
              <Icon name="tag" size={20} />
              Manage Categories
            </Link>
            <Link
              href="/admin/announcements"
              className="
                flex items-center gap-3
                p-4 rounded-xl
                bg-indigo-50 hover:bg-indigo-100
                text-indigo-700 font-medium
                transition-colors
              "
            >
              <Icon name="sparkles" size={20} />
              Announcements
            </Link>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="
                flex items-center gap-3
                p-4 rounded-xl
                bg-stone-100 hover:bg-stone-200
                text-stone-700 font-medium
                transition-colors
              "
            >
              <Icon name="arrow-right" size={20} />
              View Website
            </a>
          </div>
        </div>

        {/* Recent Products */}
        <div className="
          bg-white rounded-xl
          border border-stone-200/60
          p-6
        ">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-lg text-stone-900">
              Recent Products
            </h2>
            <Link
              href="/admin/products"
              className="text-sm text-teal-600 hover:text-teal-700 font-medium"
            >
              View all →
            </Link>
          </div>
          
          {recentProducts.length === 0 ? (
            <p className="text-stone-500 text-center py-8">No products yet</p>
          ) : (
            <div className="space-y-3">
              {recentProducts.map((product) => (
                <div
                  key={product.id}
                  className="
                    flex items-center gap-4
                    p-3 rounded-xl
                    bg-stone-50/50
                    hover:bg-stone-100/50
                    transition-colors
                  "
                >
                  <div className="
                    w-10 h-10 rounded-lg
                    bg-stone-200
                    flex items-center justify-center
                    flex-shrink-0
                  ">
                    <Icon name="smartphone" size={18} className="text-stone-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-stone-900 truncate">
                      {product.name}
                    </p>
                    <p className="text-sm text-stone-500">
                      Rs. {product.price.toLocaleString()}
                    </p>
                  </div>
                  <span className={`
                    px-2 py-1 rounded-full text-xs font-medium
                    ${product.published 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-stone-100 text-stone-500'
                    }
                  `}>
                    {product.published ? 'Published' : 'Draft'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

