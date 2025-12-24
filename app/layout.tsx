/**
 * Root Layout - Prasanna Mobile Center
 * Main layout with SEO optimization for local business
 */

import type { Metadata, Viewport } from "next";
import { DM_Sans, Sora } from "next/font/google";
import "./globals.css";

// Primary font - Body text (DM Sans - clean, modern, highly readable)
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

// Display font - Headings (Sora - geometric, distinctive, premium feel)
const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

// SEO Metadata
export const metadata: Metadata = {
  title: "Prasanna Mobile Center | Mobile Accessories Store in Ja-Ela, Sri Lanka",
  description: "Your trusted mobile accessories store in Ja-Ela. Quality phone covers, chargers, cables, screen protectors & repairs. 5-star rated. Call 072 290 2299.",
  keywords: [
    "mobile accessories Ja-Ela",
    "phone accessories Sri Lanka",
    "phone covers Ja-Ela",
    "mobile chargers",
    "screen protectors",
    "phone repair Ja-Ela",
    "Prasanna Mobile Center",
    "mobile shop Negombo Road",
    "phone accessories near me",
    "mobile store Ja-Ela",
  ],
  authors: [{ name: "Prasanna Mobile Center" }],
  creator: "Prasanna Mobile Center",
  publisher: "Prasanna Mobile Center",
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  metadataBase: new URL("https://prasannamobilecenter.lk"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Prasanna Mobile Center | Mobile Accessories Store in Ja-Ela",
    description: "Quality mobile accessories, chargers, covers & repairs. 5-star Google rating. Located on Old Negombo Rd, Ja-Ela. Open daily till 9:30 PM.",
    url: "https://prasannamobilecenter.lk",
    siteName: "Prasanna Mobile Center",
    locale: "en_LK",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Prasanna Mobile Center - Mobile Accessories Store in Ja-Ela",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Prasanna Mobile Center | Mobile Accessories Store in Ja-Ela",
    description: "Quality mobile accessories, chargers, covers & repairs. 5-star Google rating. Call 072 290 2299.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "shopping",
};

// Viewport configuration
export const viewport: Viewport = {
  themeColor: "#0d9488",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// JSON-LD Structured Data for Local Business
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://prasannamobilecenter.lk",
  name: "Prasanna Mobile Center",
  alternateName: "Galaxy Mobile Store",
  description: "Mobile accessories store offering phone covers, chargers, cables, screen protectors, and repair services in Ja-Ela, Sri Lanka.",
  url: "https://prasannamobilecenter.lk",
  telephone: "+94722902299",
  email: "info@prasannamobilecenter.lk",
  address: {
    "@type": "PostalAddress",
    streetAddress: "No 16, Old Negombo Rd",
    addressLocality: "Ja-Ela",
    addressRegion: "Western Province",
    postalCode: "11350",
    addressCountry: "LK",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 7.072,
    longitude: 79.891,
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    opens: "09:00",
    closes: "21:30",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5.0",
    reviewCount: "2",
    bestRating: "5",
    worstRating: "1",
  },
  priceRange: "$$",
  paymentAccepted: "Cash, Card",
  currenciesAccepted: "LKR",
  sameAs: [
    "https://www.facebook.com/galaxymblstore/",
    "https://maps.app.goo.gl/X4Exp5vf855PqcfZ7",
  ],
  hasMap: "https://maps.app.goo.gl/X4Exp5vf855PqcfZ7",
  image: "https://prasannamobilecenter.lk/og-image.jpg",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Preconnect to external resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${dmSans.variable} ${sora.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
