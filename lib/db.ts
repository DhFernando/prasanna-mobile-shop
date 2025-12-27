/**
 * Database Operations
 * CRUD operations for all collections using MongoDB
 * Replaces file-based storage in lib/data.ts
 */

import { ObjectId } from 'mongodb';
import { getDatabase, COLLECTIONS } from './mongodb';
import { 
  Product, 
  Category, 
  Sale, 
  Announcement, 
  Alert, 
  AlertSettings,
  SiteSettings 
} from './types';

// ============================================
// PRODUCTS
// ============================================

export async function getProducts(): Promise<Product[]> {
  const db = await getDatabase();
  const products = await db.collection(COLLECTIONS.PRODUCTS).find({}).toArray();
  return products.map(doc => ({
    ...doc,
    id: doc._id.toString(),
    _id: undefined,
  })) as unknown as Product[];
}

export async function getProductById(id: string): Promise<Product | null> {
  const db = await getDatabase();
  
  // Try to find by custom id field first, then by _id
  let product = await db.collection(COLLECTIONS.PRODUCTS).findOne({ id });
  
  if (!product && ObjectId.isValid(id)) {
    product = await db.collection(COLLECTIONS.PRODUCTS).findOne({ _id: new ObjectId(id) });
  }
  
  if (!product) return null;
  
  return {
    ...product,
    id: product.id || product._id.toString(),
    _id: undefined,
  } as unknown as Product;
}

export async function addProduct(product: Product): Promise<Product> {
  const db = await getDatabase();
  const result = await db.collection(COLLECTIONS.PRODUCTS).insertOne({
    ...product,
    id: product.id,
  });
  return { ...product, id: product.id || result.insertedId.toString() };
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  const db = await getDatabase();
  
  // Find the product first
  let filter: Record<string, unknown> = { id };
  let product = await db.collection(COLLECTIONS.PRODUCTS).findOne(filter);
  
  if (!product && ObjectId.isValid(id)) {
    filter = { _id: new ObjectId(id) };
    product = await db.collection(COLLECTIONS.PRODUCTS).findOne(filter);
  }
  
  if (!product) return null;
  
  await db.collection(COLLECTIONS.PRODUCTS).updateOne(filter, { $set: updates });
  
  const updated = await db.collection(COLLECTIONS.PRODUCTS).findOne(filter);
  return updated ? {
    ...updated,
    id: updated.id || updated._id.toString(),
    _id: undefined,
  } as unknown as Product : null;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const db = await getDatabase();
  
  let result = await db.collection(COLLECTIONS.PRODUCTS).deleteOne({ id });
  
  if (result.deletedCount === 0 && ObjectId.isValid(id)) {
    result = await db.collection(COLLECTIONS.PRODUCTS).deleteOne({ _id: new ObjectId(id) });
  }
  
  return result.deletedCount > 0;
}

// ============================================
// CATEGORIES
// ============================================

export async function getCategories(): Promise<Category[]> {
  const db = await getDatabase();
  const categories = await db.collection(COLLECTIONS.CATEGORIES).find({}).toArray();
  return categories.map(doc => ({
    ...doc,
    id: doc.id || doc._id.toString(),
    _id: undefined,
  })) as unknown as Category[];
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const db = await getDatabase();
  
  let category = await db.collection(COLLECTIONS.CATEGORIES).findOne({ id });
  
  if (!category && ObjectId.isValid(id)) {
    category = await db.collection(COLLECTIONS.CATEGORIES).findOne({ _id: new ObjectId(id) });
  }
  
  if (!category) return null;
  
  return {
    ...category,
    id: category.id || category._id.toString(),
    _id: undefined,
  } as unknown as Category;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const db = await getDatabase();
  const category = await db.collection(COLLECTIONS.CATEGORIES).findOne({ slug });
  
  if (!category) return null;
  
  return {
    ...category,
    id: category.id || category._id.toString(),
    _id: undefined,
  } as unknown as Category;
}

export async function addCategory(category: Category): Promise<Category> {
  const db = await getDatabase();
  await db.collection(COLLECTIONS.CATEGORIES).insertOne({
    ...category,
    id: category.id,
  });
  return category;
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
  const db = await getDatabase();
  
  let filter: Record<string, unknown> = { id };
  let category = await db.collection(COLLECTIONS.CATEGORIES).findOne(filter);
  
  if (!category && ObjectId.isValid(id)) {
    filter = { _id: new ObjectId(id) };
    category = await db.collection(COLLECTIONS.CATEGORIES).findOne(filter);
  }
  
  if (!category) return null;
  
  await db.collection(COLLECTIONS.CATEGORIES).updateOne(filter, { $set: updates });
  
  const updated = await db.collection(COLLECTIONS.CATEGORIES).findOne(filter);
  return updated ? {
    ...updated,
    id: updated.id || updated._id.toString(),
    _id: undefined,
  } as unknown as Category : null;
}

export async function deleteCategory(id: string): Promise<boolean> {
  const db = await getDatabase();
  
  let result = await db.collection(COLLECTIONS.CATEGORIES).deleteOne({ id });
  
  if (result.deletedCount === 0 && ObjectId.isValid(id)) {
    result = await db.collection(COLLECTIONS.CATEGORIES).deleteOne({ _id: new ObjectId(id) });
  }
  
  return result.deletedCount > 0;
}

// Helper functions for hierarchical categories
export async function getRootCategories(): Promise<Category[]> {
  const db = await getDatabase();
  const categories = await db.collection(COLLECTIONS.CATEGORIES)
    .find({ parentId: null })
    .sort({ order: 1 })
    .toArray();
  return categories.map(doc => ({
    ...doc,
    id: doc.id || doc._id.toString(),
    _id: undefined,
  })) as unknown as Category[];
}

export async function getCategoryChildren(parentId: string): Promise<Category[]> {
  const db = await getDatabase();
  const categories = await db.collection(COLLECTIONS.CATEGORIES)
    .find({ parentId })
    .sort({ order: 1 })
    .toArray();
  return categories.map(doc => ({
    ...doc,
    id: doc.id || doc._id.toString(),
    _id: undefined,
  })) as unknown as Category[];
}

export async function getCategoryDescendants(parentId: string): Promise<Category[]> {
  const children = await getCategoryChildren(parentId);
  let descendants: Category[] = [...children];
  
  for (const child of children) {
    const childDescendants = await getCategoryDescendants(child.id);
    descendants = [...descendants, ...childDescendants];
  }
  
  return descendants;
}

export async function getCategoryAncestors(categoryId: string): Promise<Category[]> {
  const ancestors: Category[] = [];
  let current = await getCategoryById(categoryId);
  
  while (current && current.parentId) {
    const parent = await getCategoryById(current.parentId);
    if (parent) {
      ancestors.unshift(parent);
      current = parent;
    } else {
      break;
    }
  }
  
  return ancestors;
}

// ============================================
// SALES
// ============================================

export async function getSales(): Promise<Sale[]> {
  const db = await getDatabase();
  const sales = await db.collection(COLLECTIONS.SALES)
    .find({})
    .sort({ saleDate: -1 })
    .toArray();
  return sales.map(doc => ({
    ...doc,
    id: doc.id || doc._id.toString(),
    _id: undefined,
  })) as unknown as Sale[];
}

export async function getSaleById(id: string): Promise<Sale | null> {
  const db = await getDatabase();
  
  let sale = await db.collection(COLLECTIONS.SALES).findOne({ id });
  
  if (!sale && ObjectId.isValid(id)) {
    sale = await db.collection(COLLECTIONS.SALES).findOne({ _id: new ObjectId(id) });
  }
  
  if (!sale) return null;
  
  return {
    ...sale,
    id: sale.id || sale._id.toString(),
    _id: undefined,
  } as unknown as Sale;
}

export async function addSale(sale: Sale): Promise<Sale> {
  const db = await getDatabase();
  await db.collection(COLLECTIONS.SALES).insertOne({
    ...sale,
    id: sale.id,
  });
  return sale;
}

export async function updateSale(id: string, updates: Partial<Sale>): Promise<Sale | null> {
  const db = await getDatabase();
  
  let filter: Record<string, unknown> = { id };
  let sale = await db.collection(COLLECTIONS.SALES).findOne(filter);
  
  if (!sale && ObjectId.isValid(id)) {
    filter = { _id: new ObjectId(id) };
    sale = await db.collection(COLLECTIONS.SALES).findOne(filter);
  }
  
  if (!sale) return null;
  
  await db.collection(COLLECTIONS.SALES).updateOne(filter, { $set: updates });
  
  const updated = await db.collection(COLLECTIONS.SALES).findOne(filter);
  return updated ? {
    ...updated,
    id: updated.id || updated._id.toString(),
    _id: undefined,
  } as unknown as Sale : null;
}

export async function deleteSale(id: string): Promise<boolean> {
  const db = await getDatabase();
  
  let result = await db.collection(COLLECTIONS.SALES).deleteOne({ id });
  
  if (result.deletedCount === 0 && ObjectId.isValid(id)) {
    result = await db.collection(COLLECTIONS.SALES).deleteOne({ _id: new ObjectId(id) });
  }
  
  return result.deletedCount > 0;
}

// ============================================
// ANNOUNCEMENTS
// ============================================

export async function getAnnouncements(): Promise<Announcement[]> {
  const db = await getDatabase();
  const announcements = await db.collection(COLLECTIONS.ANNOUNCEMENTS)
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
  return announcements.map(doc => ({
    ...doc,
    id: doc.id || doc._id.toString(),
    _id: undefined,
  })) as unknown as Announcement[];
}

export async function getAnnouncementById(id: string): Promise<Announcement | null> {
  const db = await getDatabase();
  
  let announcement = await db.collection(COLLECTIONS.ANNOUNCEMENTS).findOne({ id });
  
  if (!announcement && ObjectId.isValid(id)) {
    announcement = await db.collection(COLLECTIONS.ANNOUNCEMENTS).findOne({ _id: new ObjectId(id) });
  }
  
  if (!announcement) return null;
  
  return {
    ...announcement,
    id: announcement.id || announcement._id.toString(),
    _id: undefined,
  } as unknown as Announcement;
}

export async function addAnnouncement(announcement: Announcement): Promise<Announcement> {
  const db = await getDatabase();
  await db.collection(COLLECTIONS.ANNOUNCEMENTS).insertOne({
    ...announcement,
    id: announcement.id,
  });
  return announcement;
}

export async function updateAnnouncement(id: string, updates: Partial<Announcement>): Promise<Announcement | null> {
  const db = await getDatabase();
  
  let filter: Record<string, unknown> = { id };
  let announcement = await db.collection(COLLECTIONS.ANNOUNCEMENTS).findOne(filter);
  
  if (!announcement && ObjectId.isValid(id)) {
    filter = { _id: new ObjectId(id) };
    announcement = await db.collection(COLLECTIONS.ANNOUNCEMENTS).findOne(filter);
  }
  
  if (!announcement) return null;
  
  await db.collection(COLLECTIONS.ANNOUNCEMENTS).updateOne(filter, { $set: updates });
  
  const updated = await db.collection(COLLECTIONS.ANNOUNCEMENTS).findOne(filter);
  return updated ? {
    ...updated,
    id: updated.id || updated._id.toString(),
    _id: undefined,
  } as unknown as Announcement : null;
}

export async function deleteAnnouncement(id: string): Promise<boolean> {
  const db = await getDatabase();
  
  let result = await db.collection(COLLECTIONS.ANNOUNCEMENTS).deleteOne({ id });
  
  if (result.deletedCount === 0 && ObjectId.isValid(id)) {
    result = await db.collection(COLLECTIONS.ANNOUNCEMENTS).deleteOne({ _id: new ObjectId(id) });
  }
  
  return result.deletedCount > 0;
}

// ============================================
// ALERTS
// ============================================

export async function getAlerts(): Promise<Alert[]> {
  const db = await getDatabase();
  const alerts = await db.collection(COLLECTIONS.ALERTS)
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
  return alerts.map(doc => ({
    ...doc,
    id: doc.id || doc._id.toString(),
    _id: undefined,
  })) as unknown as Alert[];
}

export async function getAlertById(id: string): Promise<Alert | null> {
  const db = await getDatabase();
  
  let alert = await db.collection(COLLECTIONS.ALERTS).findOne({ id });
  
  if (!alert && ObjectId.isValid(id)) {
    alert = await db.collection(COLLECTIONS.ALERTS).findOne({ _id: new ObjectId(id) });
  }
  
  if (!alert) return null;
  
  return {
    ...alert,
    id: alert.id || alert._id.toString(),
    _id: undefined,
  } as unknown as Alert;
}

export async function addAlert(alert: Alert): Promise<Alert> {
  const db = await getDatabase();
  await db.collection(COLLECTIONS.ALERTS).insertOne({
    ...alert,
    id: alert.id,
  });
  return alert;
}

export async function updateAlert(id: string, updates: Partial<Alert>): Promise<Alert | null> {
  const db = await getDatabase();
  
  let filter: Record<string, unknown> = { id };
  let alert = await db.collection(COLLECTIONS.ALERTS).findOne(filter);
  
  if (!alert && ObjectId.isValid(id)) {
    filter = { _id: new ObjectId(id) };
    alert = await db.collection(COLLECTIONS.ALERTS).findOne(filter);
  }
  
  if (!alert) return null;
  
  await db.collection(COLLECTIONS.ALERTS).updateOne(filter, { $set: updates });
  
  const updated = await db.collection(COLLECTIONS.ALERTS).findOne(filter);
  return updated ? {
    ...updated,
    id: updated.id || updated._id.toString(),
    _id: undefined,
  } as unknown as Alert : null;
}

export async function deleteAlert(id: string): Promise<boolean> {
  const db = await getDatabase();
  
  let result = await db.collection(COLLECTIONS.ALERTS).deleteOne({ id });
  
  if (result.deletedCount === 0 && ObjectId.isValid(id)) {
    result = await db.collection(COLLECTIONS.ALERTS).deleteOne({ _id: new ObjectId(id) });
  }
  
  return result.deletedCount > 0;
}

// ============================================
// ALERT SETTINGS
// ============================================

export async function getAlertSettings(): Promise<AlertSettings> {
  const db = await getDatabase();
  const settings = await db.collection(COLLECTIONS.ALERT_SETTINGS).findOne({});
  
  if (!settings) {
    // Return default settings
    return {
      lowStockThreshold: 10,
      enableLowStockAlerts: true,
      enableOutOfStockAlerts: true,
    };
  }
  
  return settings as unknown as AlertSettings;
}

export async function updateAlertSettings(updates: Partial<AlertSettings>): Promise<AlertSettings> {
  const db = await getDatabase();
  
  await db.collection(COLLECTIONS.ALERT_SETTINGS).updateOne(
    {},
    { $set: updates },
    { upsert: true }
  );
  
  return getAlertSettings();
}

// ============================================
// SITE SETTINGS
// ============================================

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const db = await getDatabase();
  const settings = await db.collection(COLLECTIONS.SITE_SETTINGS).findOne({});
  
  if (!settings) return null;
  
  // Remove MongoDB _id
  const { _id, ...siteSettings } = settings;
  return siteSettings as unknown as SiteSettings;
}

export async function updateSiteSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
  const db = await getDatabase();
  
  await db.collection(COLLECTIONS.SITE_SETTINGS).updateOne(
    {},
    { $set: { ...updates, updatedAt: new Date().toISOString() } },
    { upsert: true }
  );
  
  const settings = await getSiteSettings();
  return settings!;
}

// ============================================
// THEME SETTINGS
// ============================================

export interface ThemeSettings {
  colorTheme: string;
  updatedAt: string;
}

export async function getThemeSettings(): Promise<ThemeSettings> {
  const db = await getDatabase();
  const settings = await db.collection(COLLECTIONS.THEME_SETTINGS).findOne({});
  
  if (!settings) {
    return { colorTheme: 'teal', updatedAt: new Date().toISOString() };
  }
  
  return {
    colorTheme: settings.colorTheme || 'teal',
    updatedAt: settings.updatedAt || new Date().toISOString(),
  };
}

export async function updateThemeSettings(colorTheme: string): Promise<ThemeSettings> {
  const db = await getDatabase();
  
  await db.collection(COLLECTIONS.THEME_SETTINGS).updateOne(
    {},
    { $set: { colorTheme, updatedAt: new Date().toISOString() } },
    { upsert: true }
  );
  
  return getThemeSettings();
}

