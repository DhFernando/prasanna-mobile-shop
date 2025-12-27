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
  },
  {
    id: "cat-5",
    name: "Power Banks",
    slug: "power-banks",
    description: "Portable chargers and power banks",
    parentId: null,
    level: 0,
    path: ["power-banks"],
    image: "",
    isActive: true,
    order: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Sample products
const defaultProducts = [
  {
    id: "prod-1",
    name: "iPhone 15 Pro Max Silicone Case - Black",
    category: "phone-covers",
    price: 2500,
    description: "Premium silicone case with soft-touch finish. Perfect fit for iPhone 15 Pro Max.",
    image: "https://images.unsplash.com/photo-1603313011101-320f26a4f6f6?w=400",
    published: true,
    stockQuantity: 25,
    stockStatus: "in_stock",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "prod-2",
    name: "Samsung Galaxy S24 Ultra Clear Case",
    category: "phone-covers",
    price: 1800,
    description: "Crystal clear transparent case. Shows off your phone's design.",
    image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400",
    published: true,
    stockQuantity: 30,
    stockStatus: "in_stock",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "prod-3",
    name: "20W USB-C Fast Charger",
    category: "chargers",
    price: 3500,
    description: "Original quality 20W fast charger. Compatible with iPhone and Android.",
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400",
    published: true,
    stockQuantity: 50,
    stockStatus: "in_stock",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "prod-4",
    name: "65W GaN Fast Charger - 3 Port",
    category: "chargers",
    price: 5500,
    description: "Compact GaN charger with 2 USB-C and 1 USB-A port. Charges laptop and phones.",
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400",
    published: true,
    stockQuantity: 15,
    stockStatus: "in_stock",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "prod-5",
    name: "Wireless Bluetooth Earbuds Pro",
    category: "earphones",
    price: 4500,
    description: "True wireless earbuds with ANC. 30 hours battery with case.",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400",
    published: true,
    stockQuantity: 20,
    stockStatus: "in_stock",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "prod-6",
    name: "Wired Earphones with Mic - Type-C",
    category: "earphones",
    price: 850,
    description: "High quality wired earphones with built-in mic. Type-C connector.",
    image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400",
    published: true,
    stockQuantity: 100,
    stockStatus: "in_stock",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "prod-7",
    name: "iPhone 15 Pro Tempered Glass 9H",
    category: "screen-protectors",
    price: 800,
    description: "9H hardness tempered glass. Edge-to-edge protection with easy installation kit.",
    image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400",
    published: true,
    stockQuantity: 75,
    stockStatus: "in_stock",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "prod-8",
    name: "Samsung S24 Privacy Screen Protector",
    category: "screen-protectors",
    price: 1200,
    description: "Privacy filter screen protector. Only visible from direct angle.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400",
    published: true,
    stockQuantity: 5,
    stockStatus: "low_stock",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "prod-9",
    name: "10000mAh Power Bank - Fast Charging",
    category: "power-banks",
    price: 3200,
    description: "Slim power bank with 22.5W fast charging. LED display shows battery level.",
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400",
    published: true,
    stockQuantity: 35,
    stockStatus: "in_stock",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "prod-10",
    name: "20000mAh Power Bank with Cables",
    category: "power-banks",
    price: 4800,
    description: "High capacity power bank with built-in Lightning and USB-C cables.",
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400",
    published: true,
    stockQuantity: 0,
    stockStatus: "out_of_stock",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "prod-11",
    name: "USB-C to Lightning Cable 1m",
    category: "chargers",
    price: 1500,
    description: "MFi certified cable. Supports fast charging for iPhone.",
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400",
    published: true,
    stockQuantity: 60,
    stockStatus: "in_stock",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "prod-12",
    name: "Magnetic Phone Holder for Car",
    category: "phone-covers",
    price: 1200,
    description: "Strong magnetic car mount. 360 degree rotation.",
    image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400",
    published: true,
    stockQuantity: 40,
    stockStatus: "in_stock",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Sample sales
const defaultSales = [
  {
    id: "sale-1",
    items: [
      { id: "item-1", name: "iPhone 15 Pro Max Silicone Case", quantity: 2, unitPrice: 2500, totalPrice: 5000 },
      { id: "item-2", name: "iPhone 15 Pro Tempered Glass", quantity: 2, unitPrice: 800, totalPrice: 1600 }
    ],
    subtotal: 6600,
    discount: 100,
    totalPrice: 6500,
    customerName: "Kamal Perera",
    customerPhone: "077 123 4567",
    notes: "Regular customer",
    saleDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "sale-2",
    items: [
      { id: "item-3", name: "65W GaN Fast Charger", quantity: 1, unitPrice: 5500, totalPrice: 5500 }
    ],
    subtotal: 5500,
    discount: 0,
    totalPrice: 5500,
    customerName: "Nimal Silva",
    customerPhone: "071 987 6543",
    notes: "",
    saleDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "sale-3",
    items: [
      { id: "item-4", name: "Wireless Bluetooth Earbuds Pro", quantity: 1, unitPrice: 4500, totalPrice: 4500 },
      { id: "item-5", name: "USB-C to Lightning Cable 1m", quantity: 1, unitPrice: 1500, totalPrice: 1500 }
    ],
    subtotal: 6000,
    discount: 500,
    totalPrice: 5500,
    customerName: "",
    customerPhone: "",
    notes: "Walk-in customer",
    saleDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "sale-4",
    items: [
      { id: "item-6", name: "Samsung Galaxy S24 Ultra Clear Case", quantity: 3, unitPrice: 1800, totalPrice: 5400 },
      { id: "item-7", name: "Samsung S24 Privacy Screen Protector", quantity: 3, unitPrice: 1200, totalPrice: 3600 }
    ],
    subtotal: 9000,
    discount: 1000,
    totalPrice: 8000,
    customerName: "Dialog Showroom",
    customerPhone: "011 234 5678",
    notes: "Bulk order for showroom",
    saleDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "sale-5",
    items: [
      { id: "item-8", name: "10000mAh Power Bank", quantity: 2, unitPrice: 3200, totalPrice: 6400 },
      { id: "item-9", name: "20W USB-C Fast Charger", quantity: 2, unitPrice: 3500, totalPrice: 7000 }
    ],
    subtotal: 13400,
    discount: 400,
    totalPrice: 13000,
    customerName: "Sunil Fernando",
    customerPhone: "076 555 1234",
    notes: "",
    saleDate: new Date().toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    id: "sale-6",
    items: [
      { id: "item-10", name: "Wired Earphones with Mic", quantity: 5, unitPrice: 850, totalPrice: 4250 }
    ],
    subtotal: 4250,
    discount: 250,
    totalPrice: 4000,
    customerName: "",
    customerPhone: "",
    notes: "Wholesale order",
    saleDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Sample announcements
const defaultAnnouncements = [
  {
    id: "ann-1",
    title: "New Year Sale - Up to 30% Off!",
    message: "Celebrate the new year with amazing discounts on all accessories. Valid till January 15th.",
    type: "promo",
    active: true,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "ann-2",
    title: "Free Screen Protector Installation",
    message: "Get free professional installation with every screen protector purchase!",
    type: "info",
    active: true,
    createdAt: new Date().toISOString(),
    expiresAt: null
  },
  {
    id: "ann-3",
    title: "New Stock Arrived - iPhone 15 Accessories",
    message: "Fresh stock of iPhone 15 cases, chargers, and screen protectors now available.",
    type: "success",
    active: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: null
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

      // Seed products if empty
      const existingProducts = await db.collection(COLLECTIONS.PRODUCTS).countDocuments();
      if (existingProducts === 0) {
        await db.collection(COLLECTIONS.PRODUCTS).insertMany(defaultProducts);
        results.products = `Created ${defaultProducts.length} products`;
      } else {
        results.products = `Already has ${existingProducts} products`;
      }

      // Seed sales if empty
      const existingSales = await db.collection(COLLECTIONS.SALES).countDocuments();
      if (existingSales === 0) {
        await db.collection(COLLECTIONS.SALES).insertMany(defaultSales);
        results.sales = `Created ${defaultSales.length} sales`;
      } else {
        results.sales = `Already has ${existingSales} sales`;
      }

      // Seed announcements if empty
      const existingAnnouncements = await db.collection(COLLECTIONS.ANNOUNCEMENTS).countDocuments();
      if (existingAnnouncements === 0) {
        await db.collection(COLLECTIONS.ANNOUNCEMENTS).insertMany(defaultAnnouncements);
        results.announcements = `Created ${defaultAnnouncements.length} announcements`;
      } else {
        results.announcements = `Already has ${existingAnnouncements} announcements`;
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

