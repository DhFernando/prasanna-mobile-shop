/**
 * Data utilities for reading/writing JSON files
 * Server-side only
 */

import fs from 'fs';
import path from 'path';
import { Product, Category, Announcement } from './types';

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

// Categories
export function getCategories(): Category[] {
  const data = readJsonFile<{ categories: Category[] }>('categories.json');
  return data.categories;
}

export function getCategoryById(id: string): Category | undefined {
  const categories = getCategories();
  return categories.find(c => c.id === id);
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
  
  categories[index] = { ...categories[index], ...updates };
  saveCategories(categories);
  return categories[index];
}

export function deleteCategory(id: string): boolean {
  const categories = getCategories();
  const filtered = categories.filter(c => c.id !== id);
  if (filtered.length === categories.length) return false;
  
  saveCategories(filtered);
  return true;
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

// Generate unique ID
export function generateId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
}

