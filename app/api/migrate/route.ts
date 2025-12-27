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
  // Root Categories
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
  },
  
  // Phone Covers Subcategories
  {
    id: "cat-1-1",
    name: "iPhone Cases",
    slug: "iphone-cases",
    description: "Cases for all iPhone models",
    parentId: "cat-1",
    level: 1,
    path: ["phone-covers", "iphone-cases"],
    image: "",
    isActive: true,
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "cat-1-2",
    name: "Samsung Cases",
    slug: "samsung-cases",
    description: "Cases for Samsung Galaxy phones",
    parentId: "cat-1",
    level: 1,
    path: ["phone-covers", "samsung-cases"],
    image: "",
    isActive: true,
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "cat-1-3",
    name: "Other Brands",
    slug: "other-brands",
    description: "Cases for Xiaomi, Oppo, Vivo, Realme etc.",
    parentId: "cat-1",
    level: 1,
    path: ["phone-covers", "other-brands"],
    image: "",
    isActive: true,
    order: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  
  // iPhone Cases Sub-subcategories
  {
    id: "cat-1-1-1",
    name: "iPhone 15 Series",
    slug: "iphone-15-series",
    description: "Cases for iPhone 15, 15 Plus, 15 Pro, 15 Pro Max",
    parentId: "cat-1-1",
    level: 2,
    path: ["phone-covers", "iphone-cases", "iphone-15-series"],
    image: "",
    isActive: true,
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "cat-1-1-2",
    name: "iPhone 14 Series",
    slug: "iphone-14-series",
    description: "Cases for iPhone 14, 14 Plus, 14 Pro, 14 Pro Max",
    parentId: "cat-1-1",
    level: 2,
    path: ["phone-covers", "iphone-cases", "iphone-14-series"],
    image: "",
    isActive: true,
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  
  // Chargers Subcategories
  {
    id: "cat-2-1",
    name: "Wall Chargers",
    slug: "wall-chargers",
    description: "USB and fast wall chargers",
    parentId: "cat-2",
    level: 1,
    path: ["chargers", "wall-chargers"],
    image: "",
    isActive: true,
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "cat-2-2",
    name: "Car Chargers",
    slug: "car-chargers",
    description: "USB car chargers and adapters",
    parentId: "cat-2",
    level: 1,
    path: ["chargers", "car-chargers"],
    image: "",
    isActive: true,
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "cat-2-3",
    name: "Cables",
    slug: "cables",
    description: "Lightning, USB-C, and Micro USB cables",
    parentId: "cat-2",
    level: 1,
    path: ["chargers", "cables"],
    image: "",
    isActive: true,
    order: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "cat-2-4",
    name: "Wireless Chargers",
    slug: "wireless-chargers",
    description: "Qi wireless charging pads and stands",
    parentId: "cat-2",
    level: 1,
    path: ["chargers", "wireless-chargers"],
    image: "",
    isActive: true,
    order: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  
  // Earphones Subcategories
  {
    id: "cat-3-1",
    name: "Wireless Earbuds",
    slug: "wireless-earbuds",
    description: "True wireless Bluetooth earbuds",
    parentId: "cat-3",
    level: 1,
    path: ["earphones", "wireless-earbuds"],
    image: "",
    isActive: true,
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "cat-3-2",
    name: "Wired Earphones",
    slug: "wired-earphones",
    description: "3.5mm, Type-C, and Lightning wired earphones",
    parentId: "cat-3",
    level: 1,
    path: ["earphones", "wired-earphones"],
    image: "",
    isActive: true,
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "cat-3-3",
    name: "Headphones",
    slug: "headphones",
    description: "Over-ear and on-ear headphones",
    parentId: "cat-3",
    level: 1,
    path: ["earphones", "headphones"],
    image: "",
    isActive: true,
    order: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  
  // Screen Protectors Subcategories
  {
    id: "cat-4-1",
    name: "iPhone Screen Protectors",
    slug: "iphone-screen-protectors",
    description: "Tempered glass for all iPhone models",
    parentId: "cat-4",
    level: 1,
    path: ["screen-protectors", "iphone-screen-protectors"],
    image: "",
    isActive: true,
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "cat-4-2",
    name: "Samsung Screen Protectors",
    slug: "samsung-screen-protectors",
    description: "Tempered glass for Samsung phones",
    parentId: "cat-4",
    level: 1,
    path: ["screen-protectors", "samsung-screen-protectors"],
    image: "",
    isActive: true,
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  
  // Power Banks Subcategories
  {
    id: "cat-5-1",
    name: "10000mAh",
    slug: "10000mah",
    description: "Compact 10000mAh power banks",
    parentId: "cat-5",
    level: 1,
    path: ["power-banks", "10000mah"],
    image: "",
    isActive: true,
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "cat-5-2",
    name: "20000mAh+",
    slug: "20000mah-plus",
    description: "High capacity power banks",
    parentId: "cat-5",
    level: 1,
    path: ["power-banks", "20000mah-plus"],
    image: "",
    isActive: true,
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Sample products - organized by subcategories (2+ items each)
const defaultProducts = [
  // iPhone 15 Series Cases (cat-1-1-1)
  {
    id: "prod-1",
    name: "iPhone 15 Pro Max Silicone Case - Black",
    category: "iphone-15-series",
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
    name: "iPhone 15 Pro Clear MagSafe Case",
    category: "iphone-15-series",
    price: 3200,
    description: "Crystal clear case with MagSafe compatibility. Shows off your phone's design.",
    image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400",
    published: true,
    stockQuantity: 20,
    stockStatus: "in_stock",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "prod-3",
    name: "iPhone 15 Leather Wallet Case - Brown",
    category: "iphone-15-series",
    price: 4500,
    description: "Premium leather wallet case with card slots. Elegant and functional.",
    image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400",
    published: true,
    stockQuantity: 15,
    stockStatus: "in_stock",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  
  // iPhone 14 Series Cases (cat-1-1-2)
  {
    id: "prod-4",
    name: "iPhone 14 Pro Silicone Case - Navy",
    category: "iphone-14-series",
    price: 2200,
    description: "Soft silicone case with microfiber lining. Navy blue color.",
    image: "https://images.unsplash.com/photo-1603313011101-320f26a4f6f6?w=400",
    published: true,
    stockQuantity: 30,
    stockStatus: "in_stock",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "prod-5",
    name: "iPhone 14 Plus Armor Case",
    category: "iphone-14-series",
    price: 2800,
    description: "Heavy duty protection with built-in kickstand. Military grade drop tested.",
    image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400",
    published: true,
    stockQuantity: 18,
    stockStatus: "in_stock",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  
  // Samsung Cases (cat-1-2)
  {
    id: "prod-6",
    name: "Samsung Galaxy S24 Ultra Clear Case",
    category: "samsung-cases",
    price: 1800,
    description: "Crystal clear transparent case. Anti-yellowing technology.",
    image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400",
    published: true,
    stockQuantity: 30,
    stockStatus: "in_stock",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "prod-7",
    name: "Samsung Galaxy S23 Flip Cover",
    category: "samsung-cases",
    price: 2500,
    description: "Official style flip cover with card pocket. Auto sleep/wake function.",
    image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400",
    published: true,
    stockQuantity: 22,
    stockStatus: "in_stock",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "prod-8",
    name: "Samsung Galaxy A54 Shockproof Case",
    category: "samsung-cases",
    price: 1200,
    description: "Budget-friendly protection. Raised edges for camera and screen.",
    image: "https://images.unsplash.com/photo-1603313011101-320f26a4f6f6?w=400",
    published: true,
    stockQuantity: 50,
    stockStatus: "in_stock",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  
  // Other Brands Cases (cat-1-3)
  {
    id: "prod-9",
    name: "Xiaomi 14 Pro Frosted Case",
    category: "other-brands",
    price: 1500,
    description: "Matte frosted finish. Anti-fingerprint coating.",
    image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400",
    published: true,
    stockQuantity: 25,
    stockStatus: "in_stock",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "prod-10",
    name: "Oppo Reno 10 Pro+ Clear Case",
    category: "other-brands",
    price: 1300,
    description: "Ultra-thin clear case. Perfect for showing off phone color.",
    image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400",
    published: true,
    stockQuantity: 35,
    stockStatus: "in_stock",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  
  // Wall Chargers (cat-2-1)
  {
    id: "prod-11",
    name: "20W USB-C Fast Charger",
    category: "wall-chargers",
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
    id: "prod-12",
    name: "65W GaN Fast Charger - 3 Port",
    category: "wall-chargers",
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
    id: "prod-13",
    name: "10W Basic USB Charger",
    category: "wall-chargers",
    price: 800,
    description: "Affordable basic charger. USB-A output.",
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400",
    published: true,
    stockQuantity: 100,
    stockStatus: "in_stock",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  
  // Car Chargers (cat-2-2)
  {
    id: "prod-14",
    name: "Dual USB Car Charger 24W",
    category: "car-chargers",
    price: 1500,
    description: "Dual port car charger. 12W per port.",
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400",
    published: true,
    stockQuantity: 40,
    stockStatus: "in_stock",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "prod-15",
    name: "USB-C PD Car Charger 45W",
    category: "car-chargers",
    price: 2800,
    description: "Fast charging car adapter. USB-C PD + USB-A QC3.0.",
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400",
    published: true,
    stockQuantity: 25,
    stockStatus: "in_stock",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  
  // Cables (cat-2-3)
  {
    id: "prod-16",
    name: "USB-C to Lightning Cable 1m",
    category: "cables",
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
    id: "prod-17",
    name: "USB-C to USB-C Cable 2m - 100W",
    category: "cables",
    price: 2200,
    description: "Fast charging cable for laptops and phones. 100W power delivery.",
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400",
    published: true,
    stockQuantity: 45,
    stockStatus: "in_stock",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "prod-18",
    name: "Micro USB Cable 1m - Braided",
    category: "cables",
    price: 600,
    description: "Durable braided cable for older Android phones.",
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400",
    published: true,
    stockQuantity: 80,
    stockStatus: "in_stock",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  
  // Wireless Chargers (cat-2-4)
  {
    id: "prod-19",
    name: "15W Wireless Charging Pad",
    category: "wireless-chargers",
    price: 2500,
    description: "Qi certified wireless charger. LED indicator.",
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400",
    published: true,
    stockQuantity: 20,
    stockStatus: "in_stock",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "prod-20",
    name: "3-in-1 Wireless Charging Station",
    category: "wireless-chargers",
    price: 5500,
    description: "Charges phone, watch, and earbuds simultaneously.",
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400",
    published: true,
    stockQuantity: 10,
    stockStatus: "in_stock",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  
  // Wireless Earbuds (cat-3-1)
  {
    id: "prod-21",
    name: "Wireless Bluetooth Earbuds Pro",
    category: "wireless-earbuds",
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
    id: "prod-22",
    name: "Budget TWS Earbuds",
    category: "wireless-earbuds",
    price: 1800,
    description: "Affordable wireless earbuds. Touch controls, 20hr battery.",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400",
    published: true,
    stockQuantity: 50,
    stockStatus: "in_stock",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "prod-23",
    name: "Sports TWS Earbuds - Waterproof",
    category: "wireless-earbuds",
    price: 3200,
    description: "IPX7 waterproof earbuds. Secure fit for sports.",
    image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400",
    published: true,
    stockQuantity: 25,
    stockStatus: "in_stock",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  
  // Wired Earphones (cat-3-2)
  {
    id: "prod-24",
    name: "Wired Earphones with Mic - Type-C",
    category: "wired-earphones",
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
    id: "prod-25",
    name: "Lightning Earphones for iPhone",
    category: "wired-earphones",
    price: 1500,
    description: "MFi certified Lightning earphones. In-line remote.",
    image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400",
    published: true,
    stockQuantity: 40,
    stockStatus: "in_stock",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  
  // Headphones (cat-3-3)
  {
    id: "prod-26",
    name: "Over-Ear Bluetooth Headphones",
    category: "headphones",
    price: 6500,
    description: "Premium over-ear headphones with ANC. 40hr battery.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    published: true,
    stockQuantity: 12,
    stockStatus: "in_stock",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "prod-27",
    name: "Gaming Headset with Mic",
    category: "headphones",
    price: 3800,
    description: "Wired gaming headset with surround sound. RGB lighting.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    published: true,
    stockQuantity: 18,
    stockStatus: "in_stock",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  
  // iPhone Screen Protectors (cat-4-1)
  {
    id: "prod-28",
    name: "iPhone 15 Pro Max Tempered Glass 9H",
    category: "iphone-screen-protectors",
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
    id: "prod-29",
    name: "iPhone 14/15 Privacy Glass",
    category: "iphone-screen-protectors",
    price: 1200,
    description: "Privacy filter screen protector. Only visible from direct angle.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400",
    published: true,
    stockQuantity: 35,
    stockStatus: "in_stock",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  
  // Samsung Screen Protectors (cat-4-2)
  {
    id: "prod-30",
    name: "Samsung S24 Ultra Tempered Glass",
    category: "samsung-screen-protectors",
    price: 900,
    description: "Full coverage tempered glass for curved display.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400",
    published: true,
    stockQuantity: 40,
    stockStatus: "in_stock",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "prod-31",
    name: "Samsung S24 Privacy Screen Protector",
    category: "samsung-screen-protectors",
    price: 1200,
    description: "Privacy filter screen protector. Fingerprint compatible.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400",
    published: true,
    stockQuantity: 5,
    stockStatus: "low_stock",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  
  // 10000mAh Power Banks (cat-5-1)
  {
    id: "prod-32",
    name: "10000mAh Slim Power Bank",
    category: "10000mah",
    price: 2800,
    description: "Ultra-slim design fits in pocket. 18W fast charging.",
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400",
    published: true,
    stockQuantity: 35,
    stockStatus: "in_stock",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "prod-33",
    name: "10000mAh Power Bank - LED Display",
    category: "10000mah",
    price: 3200,
    description: "Power bank with LED display. 22.5W super fast charging.",
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400",
    published: true,
    stockQuantity: 28,
    stockStatus: "in_stock",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  
  // 20000mAh+ Power Banks (cat-5-2)
  {
    id: "prod-34",
    name: "20000mAh Power Bank with Cables",
    category: "20000mah-plus",
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
    id: "prod-35",
    name: "30000mAh Laptop Power Bank",
    category: "20000mah-plus",
    price: 8500,
    description: "65W PD output for laptops. Multiple ports.",
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400",
    published: true,
    stockQuantity: 8,
    stockStatus: "low_stock",
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

    // Reseed action - clear and repopulate
    if (action === 'reseed') {
      // Clear all collections
      await db.collection(COLLECTIONS.CATEGORIES).deleteMany({});
      await db.collection(COLLECTIONS.PRODUCTS).deleteMany({});
      await db.collection(COLLECTIONS.SALES).deleteMany({});
      await db.collection(COLLECTIONS.ANNOUNCEMENTS).deleteMany({});
      results.cleared = 'All data cleared';
      
      // Now seed fresh data
      await db.collection(COLLECTIONS.CATEGORIES).insertMany(defaultCategories);
      results.categories = `Created ${defaultCategories.length} categories`;
      
      await db.collection(COLLECTIONS.PRODUCTS).insertMany(defaultProducts);
      results.products = `Created ${defaultProducts.length} products`;
      
      await db.collection(COLLECTIONS.SALES).insertMany(defaultSales);
      results.sales = `Created ${defaultSales.length} sales`;
      
      await db.collection(COLLECTIONS.ANNOUNCEMENTS).insertMany(defaultAnnouncements);
      results.announcements = `Created ${defaultAnnouncements.length} announcements`;
      
      return NextResponse.json({
        success: true,
        message: 'Database reseeded successfully',
        results,
      });
    }

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

