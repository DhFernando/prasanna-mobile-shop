/**
 * Data utilities for reading/writing JSON files
 * Server-side only
 */

import fs from 'fs';
import path from 'path';
import { Product, Category, CategoryWithChildren, Announcement, Sale, Alert, AlertSetting, SiteSettings } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');

// Helper to read JSON file
function readJsonFile<T>(filename: string): T {
  const filePath = path.join(DATA_DIR, filename);
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

// Helper to write JSON file
function writeJsonFile<T>(filename: string, data: T): void {
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// Products
export function getProducts(): Product[] {
  const data = readJsonFile<{ products: Product[] }>('products.json');
  return data.products;
}

export function getProductById(id: string): Product | undefined {
  const products = getProducts();
  return products.find(p => p.id === id);
}

export function saveProducts(products: Product[]): void {
  writeJsonFile('products.json', { products });
}

export function addProduct(product: Product): void {
  const products = getProducts();
  products.push(product);
  saveProducts(products);
}

export function updateProduct(id: string, updates: Partial<Product>): Product | null {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return null;
  
  products[index] = { ...products[index], ...updates, updatedAt: new Date().toISOString() };
  saveProducts(products);
  return products[index];
}

export function deleteProduct(id: string): boolean {
  const products = getProducts();
  const filtered = products.filter(p => p.id !== id);
  if (filtered.length === products.length) return false;
  
  saveProducts(filtered);
  return true;
}

// Categories (Hierarchical)
export function getCategories(): Category[] {
  const data = readJsonFile<{ categories: Category[] }>('categories.json');
  return data.categories;
}

export function getCategoryById(id: string): Category | undefined {
  const categories = getCategories();
  return categories.find(c => c.id === id);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  const categories = getCategories();
  return categories.find(c => c.slug === slug);
}

// Get root categories (no parent)
export function getRootCategories(): Category[] {
  const categories = getCategories();
  return categories.filter(c => c.parentId === null).sort((a, b) => a.order - b.order);
}

// Get children of a category
export function getCategoryChildren(parentId: string): Category[] {
  const categories = getCategories();
  return categories.filter(c => c.parentId === parentId).sort((a, b) => a.order - b.order);
}

// Get all descendants of a category (recursive)
export function getCategoryDescendants(parentId: string): Category[] {
  const categories = getCategories();
  const descendants: Category[] = [];
  
  function collectDescendants(pid: string) {
    const children = categories.filter(c => c.parentId === pid);
    for (const child of children) {
      descendants.push(child);
      collectDescendants(child.id);
    }
  }
  
  collectDescendants(parentId);
  return descendants;
}

// Get ancestors of a category (for breadcrumbs)
export function getCategoryAncestors(categoryId: string): Category[] {
  const categories = getCategories();
  const ancestors: Category[] = [];
  
  let current = categories.find(c => c.id === categoryId);
  while (current && current.parentId) {
    const parent = categories.find(c => c.id === current!.parentId);
    if (parent) {
      ancestors.unshift(parent);
      current = parent;
    } else {
      break;
    }
  }
  
  return ancestors;
}

// Build category tree
export function getCategoryTree(): CategoryWithChildren[] {
  const categories = getCategories();
  const categoryMap = new Map<string, CategoryWithChildren>();
  
  // Initialize all categories with empty children array
  for (const cat of categories) {
    categoryMap.set(cat.id, { ...cat, children: [] });
  }
  
  const roots: CategoryWithChildren[] = [];
  
  // Build tree structure
  for (const cat of categories) {
    const node = categoryMap.get(cat.id)!;
    if (cat.parentId === null) {
      roots.push(node);
    } else {
      const parent = categoryMap.get(cat.parentId);
      if (parent) {
        parent.children.push(node);
      }
    }
  }
  
  // Sort children by order
  function sortChildren(nodes: CategoryWithChildren[]) {
    nodes.sort((a, b) => a.order - b.order);
    for (const node of nodes) {
      if (node.children.length > 0) {
        sortChildren(node.children);
      }
    }
  }
  
  sortChildren(roots);
  return roots;
}

export function saveCategories(categories: Category[]): void {
  writeJsonFile('categories.json', { categories });
}

export function addCategory(category: Category): void {
  const categories = getCategories();
  categories.push(category);
  saveCategories(categories);
}

export function updateCategory(id: string, updates: Partial<Category>): Category | null {
  const categories = getCategories();
  const index = categories.findIndex(c => c.id === id);
  if (index === -1) return null;
  
  categories[index] = { ...categories[index], ...updates, updatedAt: new Date().toISOString() };
  saveCategories(categories);
  return categories[index];
}

export function deleteCategory(id: string): boolean {
  const categories = getCategories();
  
  // Get all descendant IDs to delete
  const descendants = getCategoryDescendants(id);
  const idsToDelete = new Set([id, ...descendants.map(d => d.id)]);
  
  const filtered = categories.filter(c => !idsToDelete.has(c.id));
  if (filtered.length === categories.length) return false;
  
  saveCategories(filtered);
  return true;
}

// Update children paths when parent changes
export function updateChildrenPaths(parentId: string, parentPath: string[]): void {
  const categories = getCategories();
  const children = categories.filter(c => c.parentId === parentId);
  
  for (const child of children) {
    const newPath = [...parentPath, child.slug];
    const index = categories.findIndex(c => c.id === child.id);
    if (index !== -1) {
      categories[index] = { 
        ...categories[index], 
        path: newPath,
        level: newPath.length - 1,
        updatedAt: new Date().toISOString() 
      };
      // Recursively update grandchildren
      updateChildrenPaths(child.id, newPath);
    }
  }
  
  saveCategories(categories);
}

// Announcements
export function getAnnouncements(): Announcement[] {
  const data = readJsonFile<{ announcements: Announcement[] }>('announcements.json');
  return data.announcements;
}

export function getActiveAnnouncements(): Announcement[] {
  const announcements = getAnnouncements();
  const now = new Date();
  
  return announcements.filter(a => {
    if (!a.active) return false;
    if (a.expiresAt && new Date(a.expiresAt) < now) return false;
    return true;
  });
}

export function getAnnouncementById(id: string): Announcement | undefined {
  const announcements = getAnnouncements();
  return announcements.find(a => a.id === id);
}

export function saveAnnouncements(announcements: Announcement[]): void {
  writeJsonFile('announcements.json', { announcements });
}

export function addAnnouncement(announcement: Announcement): void {
  const announcements = getAnnouncements();
  announcements.push(announcement);
  saveAnnouncements(announcements);
}

export function updateAnnouncement(id: string, updates: Partial<Announcement>): Announcement | null {
  const announcements = getAnnouncements();
  const index = announcements.findIndex(a => a.id === id);
  if (index === -1) return null;
  
  announcements[index] = { ...announcements[index], ...updates };
  saveAnnouncements(announcements);
  return announcements[index];
}

export function deleteAnnouncement(id: string): boolean {
  const announcements = getAnnouncements();
  const filtered = announcements.filter(a => a.id !== id);
  if (filtered.length === announcements.length) return false;
  
  saveAnnouncements(filtered);
  return true;
}

// Sales
export function getSales(): Sale[] {
  const data = readJsonFile<{ sales: Sale[] }>('sales.json');
  return data.sales;
}

export function getSaleById(id: string): Sale | undefined {
  const sales = getSales();
  return sales.find(s => s.id === id);
}

export function saveSales(sales: Sale[]): void {
  writeJsonFile('sales.json', { sales });
}

export function addSale(sale: Sale): void {
  const sales = getSales();
  sales.push(sale);
  saveSales(sales);
}

export function updateSale(id: string, updates: Partial<Sale>): Sale | null {
  const sales = getSales();
  const index = sales.findIndex(s => s.id === id);
  if (index === -1) return null;
  
  sales[index] = { ...sales[index], ...updates };
  saveSales(sales);
  return sales[index];
}

export function deleteSale(id: string): boolean {
  const sales = getSales();
  const filtered = sales.filter(s => s.id !== id);
  if (filtered.length === sales.length) return false;
  
  saveSales(filtered);
  return true;
}

// Alerts
export function getAlerts(): Alert[] {
  const data = readJsonFile<{ alerts: Alert[] }>('alerts.json');
  return data.alerts;
}

export function getUnreadAlerts(): Alert[] {
  return getAlerts().filter(a => !a.isRead && !a.isDismissed);
}

export function saveAlerts(alerts: Alert[]): void {
  writeJsonFile('alerts.json', { alerts });
}

export function addAlert(alert: Alert): void {
  const alerts = getAlerts();
  // Avoid duplicate alerts for same product
  const existing = alerts.find(a => 
    a.productId === alert.productId && 
    a.type === alert.type && 
    !a.isDismissed
  );
  if (!existing) {
    alerts.push(alert);
    saveAlerts(alerts);
  }
}

export function markAlertAsRead(id: string): void {
  const alerts = getAlerts();
  const index = alerts.findIndex(a => a.id === id);
  if (index !== -1) {
    alerts[index].isRead = true;
    saveAlerts(alerts);
  }
}

export function dismissAlert(id: string): void {
  const alerts = getAlerts();
  const index = alerts.findIndex(a => a.id === id);
  if (index !== -1) {
    alerts[index].isDismissed = true;
    saveAlerts(alerts);
  }
}

export function clearAlertForProduct(productId: string, type: string): void {
  const alerts = getAlerts();
  const filtered = alerts.filter(a => !(a.productId === productId && a.type === type));
  saveAlerts(filtered);
}

// Alert Settings
interface AlertSettingsData {
  settings: {
    globalLowStockThreshold: number;
    enableLowStockAlerts: boolean;
    enableOutOfStockAlerts: boolean;
  };
  productSettings: AlertSetting[];
}

export function getAlertSettings(): AlertSettingsData {
  return readJsonFile<AlertSettingsData>('alert-settings.json');
}

export function getGlobalAlertSettings() {
  return getAlertSettings().settings;
}

export function getProductAlertSetting(productId: string): AlertSetting | undefined {
  const data = getAlertSettings();
  return data.productSettings.find(s => s.productId === productId);
}

export function saveAlertSettings(data: AlertSettingsData): void {
  writeJsonFile('alert-settings.json', data);
}

export function updateGlobalAlertSettings(settings: Partial<AlertSettingsData['settings']>): void {
  const data = getAlertSettings();
  data.settings = { ...data.settings, ...settings };
  saveAlertSettings(data);
}

export function setProductAlertSetting(setting: AlertSetting): void {
  const data = getAlertSettings();
  const index = data.productSettings.findIndex(s => s.productId === setting.productId);
  if (index !== -1) {
    data.productSettings[index] = setting;
  } else {
    data.productSettings.push(setting);
  }
  saveAlertSettings(data);
}

// Check and generate alerts for low stock products
export function checkAndGenerateAlerts(): Alert[] {
  const products = getProducts();
  const settings = getAlertSettings();
  const newAlerts: Alert[] = [];
  
  if (!settings.settings.enableLowStockAlerts && !settings.settings.enableOutOfStockAlerts) {
    return newAlerts;
  }
  
  for (const product of products) {
    if (product.stockQuantity === null) continue; // Not tracking stock
    
    // Check product-specific threshold first, then global
    const productSetting = settings.productSettings.find(s => s.productId === product.id);
    const threshold = productSetting?.isEnabled 
      ? productSetting.lowStockThreshold 
      : settings.settings.globalLowStockThreshold;
    
    if (settings.settings.enableOutOfStockAlerts && product.stockQuantity === 0) {
      const alert: Alert = {
        id: generateId('alert'),
        type: 'out_of_stock',
        title: 'Out of Stock',
        message: `"${product.name}" is out of stock!`,
        productId: product.id,
        threshold: 0,
        isRead: false,
        isDismissed: false,
        priority: 'critical',
        createdAt: new Date().toISOString(),
      };
      addAlert(alert);
      newAlerts.push(alert);
    } else if (settings.settings.enableLowStockAlerts && product.stockQuantity > 0 && product.stockQuantity <= threshold) {
      const alert: Alert = {
        id: generateId('alert'),
        type: 'low_stock',
        title: 'Low Stock Alert',
        message: `"${product.name}" has only ${product.stockQuantity} items left (threshold: ${threshold})`,
        productId: product.id,
        threshold: threshold,
        isRead: false,
        isDismissed: false,
        priority: product.stockQuantity <= threshold / 2 ? 'high' : 'medium',
        createdAt: new Date().toISOString(),
      };
      addAlert(alert);
      newAlerts.push(alert);
    }
  }
  
  return newAlerts;
}

// Site Settings
export function getSiteSettings(): SiteSettings {
  return readJsonFile<SiteSettings>('site-settings.json');
}

export function updateSiteSettings(updates: Partial<SiteSettings>): SiteSettings {
  const settings = getSiteSettings();
  const updated = {
    ...settings,
    ...updates,
    contact: { ...settings.contact, ...(updates.contact || {}) },
    address: { ...settings.address, ...(updates.address || {}) },
    businessHours: { ...settings.businessHours, ...(updates.businessHours || {}) },
    social: { ...settings.social, ...(updates.social || {}) },
    googleRating: { ...settings.googleRating, ...(updates.googleRating || {}) },
    updatedAt: new Date().toISOString(),
  };
  writeJsonFile('site-settings.json', updated);
  return updated;
}

// Generate unique ID
export function generateId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
}

// Generic read/write for backward compatibility
export async function readData(type: string): Promise<Record<string, unknown>> {
  const filename = `${type}.json`;
  return readJsonFile<Record<string, unknown>>(filename);
}

export async function writeData(type: string, data: Record<string, unknown>): Promise<void> {
  const filename = `${type}.json`;
  writeJsonFile(filename, data);
}

