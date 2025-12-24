/**
 * TypeScript type definitions for admin panel
 */

// Product type
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

// Category type
export interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

// Announcement type
export interface Announcement {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'promo' | 'warning' | 'success';
  active: boolean;
  createdAt: string;
  expiresAt: string | null;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Form data types
export interface ProductFormData {
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  published: boolean;
}

export interface CategoryFormData {
  name: string;
  description: string;
}

export interface AnnouncementFormData {
  title: string;
  message: string;
  type: 'info' | 'promo' | 'warning' | 'success';
  active: boolean;
  expiresAt: string | null;
}

// Dashboard stats
export interface DashboardStats {
  totalProducts: number;
  publishedProducts: number;
  totalCategories: number;
  activeAnnouncements: number;
}

