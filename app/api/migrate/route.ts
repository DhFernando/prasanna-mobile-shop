/**
 * Database Migration API
 * POST - Seed database with initial data
 * This is a one-time migration endpoint
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';

// Default data to seed the database
const defaultSiteSettings = {
  siteName: "Prasanna Mobile Shop",
  tagline: "Your Trusted Mobile Store",
  description: "Quality mobile accessories, chargers, covers, and expert repairs. Visit us today for genuine products at affordable prices.",
  heroImages: [
    {
      id: "hero-1",
      url: "https://images.unsplash.com/photo-1556656793-08538906a9f8?q=80&w=2070&auto=format&fit=crop",
      alt: "Modern smartphone with accessories"
    },
    {
      id: "hero-2",
      url: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2070&auto=format&fit=crop",
      alt: "Mobile phone repair and accessories"
    },
    {
      id: "hero-3",
      url: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?q=80&w=2067&auto=format&fit=crop",
      alt: "Premium mobile accessories collection"
    }
  ],
  contact: {
    phone: "072 290 2299",
    phoneInternational: "+94722902299",
    whatsapp: "+94722902299",
    email: ""
  },
  address: {
    line1: "No 16, Old Negombo Rd",
    line2: "Gampaha, Sri Lanka",
    googleMapsUrl: "https://maps.app.goo.gl/X4Exp5vf855PqcfZ7",
    googleMapsEmbed: "https://maps.google.com/maps?q=No%2016%2C%20Old%20Negombo%20Rd%20Ja-Ela%2C%20Sri%20Lanka&output=embed"
  },
  businessHours: {
    openDays: "Daily",
    openTime: "",
    closeTime: "9:30 PM",
    displayText: "Open Daily till 9:30 PM"
  },
  social: {
    facebook: "https://www.facebook.com/galaxymblstore/",
    instagram: "",
    tiktok: "",
    youtube: ""
  },
  googleRating: {
    rating: "5.0",
    reviewsCount: ""
  },
  updatedAt: new Date().toISOString()
};

const defaultThemeSettings = {
  colorTheme: "teal",
  updatedAt: new Date().toISOString()
};

const defaultAlertSettings = {
  lowStockThreshold: 10,
  enableLowStockAlerts: true,
  enableOutOfStockAlerts: true,
};

const defaultCategories = [
  {
    id: "cat-1",
    name: "Phone Covers",
    slug: "phone-covers",
    description: "Protective cases and covers for all phone models",
    parentId: null,
    level: 0,
    path: ["phone-covers"],
    image: "",
    isActive: true,
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "cat-2",
    name: "Chargers",
    slug: "chargers",
    description: "Fast chargers and cables",
    parentId: null,
    level: 0,
    path: ["chargers"],
    image: "",
    isActive: true,
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "cat-3",
    name: "Earphones",
    slug: "earphones",
    description: "Wired and wireless earphones",
    parentId: null,
    level: 0,
    path: ["earphones"],
    image: "",
    isActive: true,
    order: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "cat-4",
    name: "Screen Protectors",
    slug: "screen-protectors",
    description: "Tempered glass and screen films",
    parentId: null,
    level: 0,
    path: ["screen-protectors"],
    image: "",
    isActive: true,
    order: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, secretKey } = body;

    // Simple protection - you should use a proper auth check in production
    if (secretKey !== 'prasanna-migrate-2024') {
      return NextResponse.json(
        { success: false, error: 'Invalid secret key' },
        { status: 401 }
      );
    }

    const db = await getDatabase();
    const results: Record<string, string> = {};

    if (action === 'seed' || action === 'all') {
      // Seed site settings if not exists
      const existingSiteSettings = await db.collection(COLLECTIONS.SITE_SETTINGS).findOne({});
      if (!existingSiteSettings) {
        await db.collection(COLLECTIONS.SITE_SETTINGS).insertOne(defaultSiteSettings);
        results.siteSettings = 'Created';
      } else {
        results.siteSettings = 'Already exists';
      }

      // Seed theme settings if not exists
      const existingThemeSettings = await db.collection(COLLECTIONS.THEME_SETTINGS).findOne({});
      if (!existingThemeSettings) {
        await db.collection(COLLECTIONS.THEME_SETTINGS).insertOne(defaultThemeSettings);
        results.themeSettings = 'Created';
      } else {
        results.themeSettings = 'Already exists';
      }

      // Seed alert settings if not exists
      const existingAlertSettings = await db.collection(COLLECTIONS.ALERT_SETTINGS).findOne({});
      if (!existingAlertSettings) {
        await db.collection(COLLECTIONS.ALERT_SETTINGS).insertOne(defaultAlertSettings);
        results.alertSettings = 'Created';
      } else {
        results.alertSettings = 'Already exists';
      }

      // Seed categories if empty
      const existingCategories = await db.collection(COLLECTIONS.CATEGORIES).countDocuments();
      if (existingCategories === 0) {
        await db.collection(COLLECTIONS.CATEGORIES).insertMany(defaultCategories);
        results.categories = `Created ${defaultCategories.length} categories`;
      } else {
        results.categories = `Already has ${existingCategories} categories`;
      }
    }

    if (action === 'status' || action === 'all') {
      // Get collection stats
      const collections = [
        COLLECTIONS.PRODUCTS,
        COLLECTIONS.CATEGORIES,
        COLLECTIONS.SALES,
        COLLECTIONS.ANNOUNCEMENTS,
        COLLECTIONS.ALERTS,
        COLLECTIONS.ALERT_SETTINGS,
        COLLECTIONS.SITE_SETTINGS,
        COLLECTIONS.THEME_SETTINGS,
      ];

      for (const collName of collections) {
        const count = await db.collection(collName).countDocuments();
        results[collName] = `${count} documents`;
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Migration completed',
      results,
    });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { success: false, error: 'Migration failed', details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const db = await getDatabase();
    
    const collections = [
      COLLECTIONS.PRODUCTS,
      COLLECTIONS.CATEGORIES,
      COLLECTIONS.SALES,
      COLLECTIONS.ANNOUNCEMENTS,
      COLLECTIONS.ALERTS,
      COLLECTIONS.ALERT_SETTINGS,
      COLLECTIONS.SITE_SETTINGS,
      COLLECTIONS.THEME_SETTINGS,
    ];

    const status: Record<string, number> = {};
    
    for (const collName of collections) {
      status[collName] = await db.collection(collName).countDocuments();
    }

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      collections: status,
    });
  } catch (error) {
    console.error('Database status error:', error);
    return NextResponse.json(
      { success: false, error: 'Database connection failed', details: String(error) },
      { status: 500 }
    );
  }
}

