/**
 * TypeScript type definitions for admin panel
 */

// Stock status type
export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock' | 'coming_soon';

// Product type
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  published: boolean;
  // Stock management (optional - null means not tracking)
  stockQuantity: number | null;
  stockStatus: StockStatus;
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

// Sale/Transaction type
export interface Sale {
  id: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  customerName?: string;
  customerPhone?: string;
  notes?: string;
  saleDate: string;
  createdAt: string;
}

// Bill/Invoice type
export interface Bill {
  id: string;
  billNumber: string;
  items: BillItem[];
  subtotal: number;
  discount: number;
  total: number;
  customerName?: string;
  customerPhone?: string;
  notes?: string;
  createdAt: string;
}

export interface BillItem {
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form data types
export interface ProductFormData {
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  published: boolean;
  stockQuantity: number | null;
  stockStatus: StockStatus;
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

export interface SaleFormData {
  itemName: string;
  quantity: number;
  unitPrice: number;
  customerName?: string;
  customerPhone?: string;
  notes?: string;
  saleDate: string;
}

// Dashboard stats
export interface DashboardStats {
  totalProducts: number;
  publishedProducts: number;
  totalCategories: number;
  activeAnnouncements: number;
  totalSales: number;
  todaySales: number;
  todayRevenue: number;
  lowStockProducts: number;
  outOfStockProducts: number;
}
