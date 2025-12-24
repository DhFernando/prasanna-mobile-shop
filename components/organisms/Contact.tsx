/**
 * Contact Organism
 * Location, contact info, and Google Maps section
 * Premium design with enhanced visual hierarchy
 */

import React from 'react';
import { SectionHeading, BodyText, Subtitle, Button, Icon } from '../atoms';
import { ContactBlock } from '../molecules';

const Contact: React.FC = () => {
  return (
    <section 
      id="contact"
      className="py-24 sm:py-32 relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-stone-50 via-white to-teal-50/30" />
        <div className="absolute inset-0 section-pattern opacity-30" />
        <div className="absolute bottom-0 left-[10%] w-96 h-96 bg-teal-100/20 rounded-full blur-3xl" />
        <div className="absolute top-20 right-[5%] w-80 h-80 bg-orange-100/20 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="animate-fade-in-up">
              <Subtitle className="mb-4">Visit Us</Subtitle>
            </div>
            <div className="animate-fade-in-up animation-delay-100">
              <SectionHeading className="mb-6">
                Come <span className="gradient-text">See Us</span> Today
              </SectionHeading>
            </div>
            <div className="animate-fade-in-up animation-delay-200">
              <BodyText size="lg" className="text-stone-600">
                We&apos;re conveniently located on Old Negombo Road in Ja-Ela. 
                Stop by anytime during business hours!
              </BodyText>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
            {/* Contact Info Side */}
            <div className="animate-fade-in-up animation-delay-300">
              <div className="space-y-4 mb-8">
                <ContactBlock
                  type="location"
                  label="Our Address"
                  value="No 16, Old Negombo Rd"
                  subValue="Ja-Ela, Sri Lanka"
                  href="https://maps.app.goo.gl/X4Exp5vf855PqcfZ7"
                />
                
                <ContactBlock
                  type="phone"
                  label="Call Us"
                  value="072 290 2299"
                  subValue="Tap to call directly"
                  href="tel:0722902299"
                />
                
                <ContactBlock
                  type="hours"
                  label="Business Hours"
                  value="Open Daily"
                  subValue="Closes at 9:30 PM"
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mb-8">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    href="tel:0722902299"
                    variant="primary"
                    size="lg"
                    icon={<Icon name="phone" size={20} />}
                    fullWidth
                    className="btn-shine"
                  >
                    Call Now
                  </Button>
                  
                  <Button
                    href="https://wa.me/94722902299"
                    variant="cta"
                    size="lg"
                    icon={<Icon name="whatsapp" size={20} />}
                    fullWidth
                    external
                    className="btn-shine"
                  >
                    WhatsApp
                  </Button>
                </div>

                {/* Directions Button */}
                <Button
                  href="https://maps.app.goo.gl/X4Exp5vf855PqcfZ7"
                  variant="outline"
                  size="lg"
                  icon={<Icon name="location" size={20} />}
                  fullWidth
                  external
                >
                  Open in Google Maps
                </Button>
              </div>

              {/* Social Links */}
              <div className="
                p-6
                bg-white/80 backdrop-blur-sm
                rounded-2xl
                border border-stone-200/60
                shadow-sm
              ">
                <div className="flex items-center gap-4">
                  <div className="
                    w-12 h-12 rounded-xl
                    bg-blue-50
                    flex items-center justify-center
                    flex-shrink-0
                  ">
                    <Icon name="facebook" size={24} className="text-blue-600" />
                  </div>
                  
                  <div className="flex-1">
                    <p className="font-semibold text-stone-800 mb-0.5">Follow us on Facebook</p>
                    <p className="text-sm text-stone-500">Stay updated with new arrivals</p>
                  </div>
                  
                  <a
                    href="https://www.facebook.com/galaxymblstore/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      px-5 py-2.5
                      bg-blue-600 hover:bg-blue-700
                      text-white text-sm font-semibold
                      rounded-xl
                      transition-colors
                      shadow-md shadow-blue-600/25
                    "
                  >
                    Follow
                  </a>
                </div>
              </div>
            </div>

            {/* Google Map Side */}
            <div className="animate-fade-in-up animation-delay-400">
              <div className="
                relative
                bg-white rounded-2xl
                border border-stone-200/60
                overflow-hidden
                shadow-xl shadow-stone-200/50
                h-[400px] lg:h-full lg:min-h-[520px]
              ">
                {/* Map */}
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3958.4660912040856!2d79.88908!3d7.0719!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2f9dacd5fc8e1%3A0x9a6e8c7f5c8b8e0!2sOld%20Negombo%20Rd%2C%20Ja-Ela%2C%20Sri%20Lanka!5e0!3m2!1sen!2slk!4v1703433600000!5m2!1sen!2slk"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Prasanna Mobile Center Location - Ja-Ela, Sri Lanka"
                  className="grayscale-[10%] hover:grayscale-0 transition-all duration-500"
                />
                
                {/* Map Overlay Card */}
                <div className="
                  absolute bottom-4 left-4 right-4
                  bg-white/95 backdrop-blur-md
                  rounded-xl
                  p-4
                  shadow-lg
                  border border-stone-100
                ">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
                        <Icon name="location" size={20} className="text-teal-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-stone-800 text-sm">Prasanna Mobile Center</p>
                        <p className="text-xs text-stone-500">No 16, Old Negombo Rd, Ja-Ela</p>
                      </div>
                    </div>
                    <a
                      href="https://maps.app.goo.gl/X4Exp5vf855PqcfZ7"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        px-4 py-2
                        bg-teal-600 hover:bg-teal-700
                        text-white text-sm font-medium
                        rounded-lg
                        transition-colors
                        flex items-center gap-1.5
                        flex-shrink-0
                      "
                    >
                      <span>Directions</span>
                      <Icon name="arrow-right" size={14} />
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Map Caption */}
              <div className="mt-4 text-center">
                <p className="text-sm text-stone-500 flex items-center justify-center gap-2">
                  <span className="text-lg">📍</span>
                  Located on Old Negombo Road, Ja-Ela - Easy to find!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
