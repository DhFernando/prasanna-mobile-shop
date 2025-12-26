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

// Category type (hierarchical)
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  parentId: string | null;  // null = root category
  level: number;            // 0 = root, 1 = child, 2 = grandchild, etc.
  path: string[];           // ['accessories', 'phone-cases', 'iphone-cases'] - array of ancestor slugs
  image?: string;
  isActive: boolean;
  order: number;            // for sorting within same parent
  createdAt: string;
  updatedAt: string;
}

// Category with children (for tree display)
export interface CategoryWithChildren extends Category {
  children: CategoryWithChildren[];
}

// Alert type for admin notifications
export interface Alert {
  id: string;
  type: 'low_stock' | 'out_of_stock' | 'expiring_announcement' | 'custom';
  title: string;
  message: string;
  productId?: string;
  threshold?: number;        // For low stock alerts
  isRead: boolean;
  isDismissed: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
}

// Alert settings for products
export interface AlertSetting {
  id: string;
  productId: string;
  lowStockThreshold: number;  // Alert when quantity falls below this
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
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

// Sale Item type (for multi-item sales)
export interface SaleItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// Sale/Transaction type (supports multiple items)
export interface Sale {
  id: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  totalPrice: number;
  customerName?: string;
  customerPhone?: string;
  notes?: string;
  saleDate: string;
  createdAt: string;
  // Legacy single-item fields (for backward compatibility)
  itemName?: string;
  quantity?: number;
  unitPrice?: number;
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
  slug: string;
  description: string;
  parentId: string | null;
  image?: string;
  isActive: boolean;
  order: number;
}

export interface AlertSettingFormData {
  productId: string;
  lowStockThreshold: number;
  isEnabled: boolean;
}

export interface AnnouncementFormData {
  title: string;
  message: string;
  type: 'info' | 'promo' | 'warning' | 'success';
  active: boolean;
  expiresAt: string | null;
}

// Sale Item Form Data
export interface SaleItemFormData {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

// Sale Form Data (supports multiple items)
export interface SaleFormData {
  items: SaleItemFormData[];
  discount: number;
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

// Site Settings (configurable by admin)
export interface SiteSettings {
  siteName: string;
  tagline: string;
  description: string;
  contact: {
    phone: string;
    phoneInternational: string;
    whatsapp: string;
    email: string;
  };
  address: {
    line1: string;
    line2: string;
    googleMapsUrl: string;
    googleMapsEmbed: string;
  };
  businessHours: {
    openDays: string;
    openTime: string;
    closeTime: string;
    displayText: string;
  };
  social: {
    facebook: string;
    instagram: string;
    tiktok: string;
    youtube: string;
  };
  googleRating: {
    rating: string;
    reviewsCount: string;
  };
  updatedAt: string;
}

export interface SiteSettingsFormData {
  siteName: string;
  tagline: string;
  description: string;
  phone: string;
  phoneInternational: string;
  whatsapp: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  googleMapsUrl: string;
  googleMapsEmbed: string;
  openDays: string;
  openTime: string;
  closeTime: string;
  hoursDisplayText: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  youtube: string;
  googleRating: string;
  reviewsCount: string;
}
