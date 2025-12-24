/**
 * Home Page - Prasanna Mobile Center
 * Main landing page integrating all sections
 */

import {
  Header,
  Hero,
  About,
  Products,
  WhyChooseUs,
  Reviews,
  Contact,
  Footer,
  MobileCTA,
  AnnouncementsBanner,
} from '@/components';

export default function Home() {
  return (
    <>
      {/* Announcements Banner - Shows active announcements */}
      <AnnouncementsBanner />
      
      {/* Header with navigation */}
      <Header />
      
      {/* Main content */}
      <main>
        {/* Hero Section - Main banner with CTAs */}
        <Hero />
        
        {/* Products & Services */}
        <Products />
        
        {/* About the Store */}
        <About />
        
        {/* Why Choose Us - Features */}
        <WhyChooseUs />
        
        {/* Customer Reviews */}
        <Reviews />
        
        {/* Location & Contact */}
        <Contact />
      </main>
      
      {/* Footer */}
      <Footer />
      
      {/* Mobile Sticky CTA & Floating WhatsApp */}
      <MobileCTA />
    </>
  );
}
