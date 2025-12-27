/**
 * MongoDB Connection Utility
 * Singleton connection for Next.js API routes
 * Handles connection pooling and reuse
 */

import { MongoClient, Db } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// In development mode, use a global variable so that the value
// is preserved across module reloads caused by HMR (Hot Module Replacement).
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Database name
const DB_NAME = 'prasannastore';

/**
 * Get database instance
 */
export async function getDatabase(): Promise<Db> {
  const client = await clientPromise;
  return client.db(DB_NAME);
}

/**
 * Collection names
 */
export const COLLECTIONS = {
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  SALES: 'sales',
  ANNOUNCEMENTS: 'announcements',
  ALERTS: 'alerts',
  ALERT_SETTINGS: 'alert_settings',
  SITE_SETTINGS: 'site_settings',
  THEME_SETTINGS: 'theme_settings',
} as const;

// Export a module-scoped MongoClient promise.
// By doing this in a separate module, the client can be shared across functions.
export default clientPromise;

