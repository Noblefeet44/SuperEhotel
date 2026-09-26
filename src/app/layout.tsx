import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PublicLayoutWrapper } from "@/components/layout/PublicLayoutWrapper";

export const viewport: Viewport = {
  themeColor: "#1E3A8A",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://supereluxuryhotel.com'),
  title: {
    default: "Super E Luxury Hotel & Suites | Best Hotel in Keffi, Nasarawa State Nigeria",
    template: "%s | Super E Luxury Hotel & Suites Keffi",
  },
  description:
    "Best luxury hotel in Keffi, Nasarawa State, Nigeria. 8 luxury room categories from ₦36,000/night with 24/7 power, free Wi-Fi, fine Nigerian dining, 500-capacity Grand Event & Banquet Hall, and VIP Lounge & Bar. Near NSUK.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/images/logo.jpg", sizes: "32x32", type: "image/jpeg" },
    ],
    shortcut: "/icon.svg",
    apple: "/images/logo.jpg",
  },
  keywords: [
    // Brand keywords
    "Super E Luxury Hotel",
    "Super E Hotel Keffi",
    "Super E Luxury Hotel and Suites",
    // Primary local SEO
    "best hotel in Keffi",
    "hotels in Keffi",
    "hotels in Keffi Nasarawa State",
    "luxury hotel Keffi Nigeria",
    "hotel in Keffi Nasarawa",
    // Event Hall & Banquets SEO
    "event hall in keffi",
    "wedding reception hall in keffi",
    "conference hall keffi nasarawa",
    "hall for rent keffi",
    "banquet hall booking keffi",
    "event center near nasarawa state university nsuk",
    "meeting room keffi",
    "party hall rental keffi",
    // Proximity & context keywords
    "hotel near Nasarawa State University Keffi",
    "hotel near NSUK Keffi",
    "hotel near Abuja-Keffi Expressway",
    "Keffi GRA hotel",
    // Lounge & Bar
    "vip lounge keffi",
    "bar and lounge in keffi",
    "nightlife in keffi",
    // Intent-based keywords
    "book hotel in Keffi",
    "accommodation in Keffi",
    "places to stay in Keffi",
    "affordable hotel Keffi",
    "business hotel Keffi Nigeria",
    // Amenity keywords
    "hotel with restaurant Keffi",
    "hotel with event hall Keffi",
    "hotel with 24/7 power supply Keffi",
    "hotel with free WiFi Keffi",
    // Room type keywords
    "VIP suite Keffi hotel",
    "presidential suite Keffi",
    "executive room Keffi hotel",
    // Regional keywords
    "Nasarawa State hotel",
    "North Central Nigeria hotel",
    "hotel between Abuja and Lafia",
  ],
  authors: [{ name: "Super E Luxury Hotel & Suites" }],
  alternates: {
    canonical: 'https://supereluxuryhotel.com',
  },
  openGraph: {
    title: "Super E Luxury Hotel & Suites | Best Hotel & Event Hall in Keffi",
    description:
      "Premium luxury accommodation in Keffi, Nasarawa State. 8 room categories from ₦36,000/night, 500-capacity Grand Event Hall, VIP Lounge & Bar, 24/7 power & security. Near NSUK.",
    type: "website",
    locale: "en_NG",
    siteName: "Super E Luxury Hotel & Suites",
    url: 'https://supereluxuryhotel.com',
    images: [
      {
        url: '/images/hotel-exterior.jpg',
        width: 1200,
        height: 630,
        alt: 'Super E Luxury Hotel & Suites exterior view in Keffi, Nasarawa State Nigeria',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Super E Luxury Hotel & Suites | Best Hotel & Event Hall in Keffi",
    description: "Premium luxury accommodation in Keffi, Nasarawa State. 8 room categories from ₦36,000/night, 500-capacity Event Hall, VIP Lounge & Bar, 24/7 power & security.",
    images: ['/images/hotel-exterior.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["Hotel", "EventVenue"],
  "name": "Super E Luxury Hotel & Suites",
  "alternateName": "Super E Hotel & Event Center Keffi",
  "description": "Best luxury hotel and event center in Keffi, Nasarawa State, Nigeria. 8 luxury room categories from ₦36,000/night, 500-capacity Grand Event Hall with 24/7 power supply, free Wi-Fi, fine Nigerian dining, and VIP Lounge & Bar. Near Nasarawa State University (NSUK).",
  "url": "https://supereluxuryhotel.com",
  "telephone": ["+2347066472533", "+2349072069217"],
  "email": "supereluxuryhotelandsuites@gmail.com",
  "image": "https://supereluxuryhotel.com/images/hotel-exterior.jpg",
  "priceRange": "₦36,000 - ₦153,000",
  "currenciesAccepted": "NGN",
  "paymentAccepted": "Cash, Bank Transfer",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "11 Hassan Chiroma Street, Adjacent Alvari Hotel G.R.A",
    "addressLocality": "Keffi",
    "addressRegion": "Nasarawa State",
    "addressCountry": "NG",
    "postalCode": ""
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 8.8463,
    "longitude": 7.8736
  },
  "hasMap": "https://www.google.com/maps/search/Super+E+Luxury+Hotel+Keffi+Nasarawa",
  "starRating": {
    "@type": "Rating",
    "ratingValue": "5"
  },
  "numberOfRooms": 8,
  "maximumAttendeeCapacity": 500,
  "checkinTime": "14:00",
  "checkoutTime": "12:00",
  "amenityFeature": [
    { "@type": "LocationFeatureSpecification", "name": "Free High Speed Wi-Fi", "value": true },
    { "@type": "LocationFeatureSpecification", "name": "Air Conditioning", "value": true },
    { "@type": "LocationFeatureSpecification", "name": "24/7 Security & Power Supply", "value": true },
    { "@type": "LocationFeatureSpecification", "name": "Fine Dining Restaurant", "value": true },
    { "@type": "LocationFeatureSpecification", "name": "Grand Event & Banquet Hall (500 capacity)", "value": true },
    { "@type": "LocationFeatureSpecification", "name": "VIP Lounge & Stocked Bar", "value": true },
    { "@type": "LocationFeatureSpecification", "name": "Room Service", "value": true },
    { "@type": "LocationFeatureSpecification", "name": "Secure Parking", "value": true },
    { "@type": "LocationFeatureSpecification", "name": "Laundry Service", "value": true }
  ],
  "sameAs": []
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What are the room rates at Super E Luxury Hotel Keffi?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Room rates range from ₦36,000/night for Standard Rooms to ₦153,000/night for the Presidential Suite. All rates include 10% Service Charge and 7% VAT."
      }
    },
    {
      "@type": "Question",
      "name": "What is the check-in and check-out time?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Check-in time is from 2:00 PM. Check-out is strictly at 12:00 Noon. Late check-out before 3:00 PM incurs a 50% surcharge; after 3:00 PM incurs 100% full rate."
      }
    },
    {
      "@type": "Question",
      "name": "Is Super E Hotel near Nasarawa State University (NSUK)?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, Super E Luxury Hotel is located in Keffi G.R.A., conveniently close to Nasarawa State University (NSUK) and accessible from the Abuja-Keffi Expressway."
      }
    },
    {
      "@type": "Question",
      "name": "Does Super E Hotel have an event hall for weddings and conferences?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, Super E Luxury Hotel features a 500-guest capacity Grand Event & Banquet Hall equipped with industrial AC, 24/7 backup power, acoustic stage, pro sound system, and secure parking in Keffi."
      }
    },
    {
      "@type": "Question",
      "name": "Does the hotel have 24/7 power supply?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, Super E Luxury Hotel provides constant power supply with industrial backup generators ensuring 24/7 electricity."
      }
    },
    {
      "@type": "Question",
      "name": "How can I make a reservation?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can book online through our website at supereluxuryhotel.com/book, call us at 07066472533 or 09072069217, or message us on WhatsApp."
      }
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </head>
      <body>
        <PublicLayoutWrapper>{children}</PublicLayoutWrapper>
      </body>
    </html>
  );
}
