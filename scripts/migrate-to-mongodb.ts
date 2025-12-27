/**
 * MongoDB Migration Script
 * Migrates data from JSON files to MongoDB
 * Run with: npx ts-node --project tsconfig.json scripts/migrate-to-mongodb.ts
 * Or: pnpm dlx tsx scripts/migrate-to-mongodb.ts
 */

import { MongoClient } from 'mongodb';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'prasannastore';

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in environment variables');
  console.error('Please create .env.local with your MongoDB connection string');
  process.exit(1);
}

// Data file paths
const DATA_DIR = path.join(process.cwd(), 'data');
const dataFiles = {
  products: path.join(DATA_DIR, 'products.json'),
  categories: path.join(DATA_DIR, 'categories.json'),
  sales: path.join(DATA_DIR, 'sales.json'),
  announcements: path.join(DATA_DIR, 'announcements.json'),
  alerts: path.join(DATA_DIR, 'alerts.json'),
  alertSettings: path.join(DATA_DIR, 'alert-settings.json'),
  siteSettings: path.join(DATA_DIR, 'site-settings.json'),
  themeSettings: path.join(DATA_DIR, 'theme-settings.json'),
};

function readJsonFile(filePath: string): unknown[] | object | null {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${path.basename(filePath)}`);
      return null;
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return null;
  }
}

async function migrate() {
  console.log('🚀 Starting MongoDB migration...\n');

  const client = new MongoClient(MONGODB_URI as string);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    const db = client.db(DB_NAME);

    // Migrate Products
    const products = readJsonFile(dataFiles.products);
    if (Array.isArray(products) && products.length > 0) {
      const collection = db.collection('products');
      await collection.deleteMany({}); // Clear existing
      await collection.insertMany(products);
      console.log(`✅ Migrated ${products.length} products`);
    }

    // Migrate Categories
    const categories = readJsonFile(dataFiles.categories);
    if (Array.isArray(categories) && categories.length > 0) {
      const collection = db.collection('categories');
      await collection.deleteMany({});
      await collection.insertMany(categories);
      console.log(`✅ Migrated ${categories.length} categories`);
    }

    // Migrate Sales
    const sales = readJsonFile(dataFiles.sales);
    if (Array.isArray(sales) && sales.length > 0) {
      const collection = db.collection('sales');
      await collection.deleteMany({});
      await collection.insertMany(sales);
      console.log(`✅ Migrated ${sales.length} sales`);
    }

    // Migrate Announcements
    const announcements = readJsonFile(dataFiles.announcements);
    if (Array.isArray(announcements) && announcements.length > 0) {
      const collection = db.collection('announcements');
      await collection.deleteMany({});
      await collection.insertMany(announcements);
      console.log(`✅ Migrated ${announcements.length} announcements`);
    }

    // Migrate Alerts
    const alerts = readJsonFile(dataFiles.alerts);
    if (Array.isArray(alerts) && alerts.length > 0) {
      const collection = db.collection('alerts');
      await collection.deleteMany({});
      await collection.insertMany(alerts);
      console.log(`✅ Migrated ${alerts.length} alerts`);
    }

    // Migrate Alert Settings
    const alertSettings = readJsonFile(dataFiles.alertSettings);
    if (alertSettings && typeof alertSettings === 'object') {
      const collection = db.collection('alert_settings');
      await collection.deleteMany({});
      await collection.insertOne(alertSettings as object);
      console.log(`✅ Migrated alert settings`);
    }

    // Migrate Site Settings
    const siteSettings = readJsonFile(dataFiles.siteSettings);
    if (siteSettings && typeof siteSettings === 'object') {
      const collection = db.collection('site_settings');
      await collection.deleteMany({});
      await collection.insertOne(siteSettings as object);
      console.log(`✅ Migrated site settings`);
    }

    // Migrate Theme Settings
    const themeSettings = readJsonFile(dataFiles.themeSettings);
    if (themeSettings && typeof themeSettings === 'object') {
      const collection = db.collection('theme_settings');
      await collection.deleteMany({});
      await collection.insertOne(themeSettings as object);
      console.log(`✅ Migrated theme settings`);
    }

    console.log('\n🎉 Migration completed successfully!');
    console.log('\nCollections created:');
    const collections = await db.listCollections().toArray();
    collections.forEach(col => console.log(`  - ${col.name}`));

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

migrate();

