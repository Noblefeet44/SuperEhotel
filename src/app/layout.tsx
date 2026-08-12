import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileCTA } from "@/components/layout/MobileCTA";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";

export const viewport: Viewport = {
  themeColor: "#1E3A8A",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Super E Luxury Hotel & Suites | Luxury at Its Peak | Keffi, Nigeria",
  description:
    "Experience unparalleled luxury and comfort at Super E Luxury Hotel & Suites in Keffi, Nigeria. Premium rooms, fine Nigerian dining, and exceptional hospitality. Book your stay today.",
  keywords: [
    "Super E Luxury Hotel",
    "Keffi Hotel",
    "Nigeria Hotel",
    "Luxury Hotel Keffi",
    "Hotel Suites Keffi",
    "Nigerian Hospitality",
    "Nasarawa Hotel",
    "Best hotel in Keffi",
    "VIP Suites Keffi",
  ],
  authors: [{ name: "Super E Luxury Hotel & Suites" }],
  openGraph: {
    title: "Super E Luxury Hotel & Suites | Keffi, Nigeria",
    description:
      "Luxury at Its Peak. Premium accommodation, fine Nigerian dining, and exceptional hospitality in Keffi, Nigeria.",
    type: "website",
    locale: "en_NG",
    siteName: "Super E Luxury Hotel",
  },
  twitter: {
    card: "summary_large_image",
    title: "Super E Luxury Hotel & Suites | Keffi, Nigeria",
    description: "Luxury at Its Peak. Premium accommodation, fine Nigerian dining, and exceptional hospitality in Keffi, Nigeria.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Hotel",
  "name": "Super E Luxury Hotel & Suites",
  "description": "Experience unparalleled luxury and comfort at Super E Luxury Hotel & Suites in Keffi, Nigeria. Premium rooms, fine Nigerian dining, and exceptional hospitality.",
  "telephone": "+2349131964939",
  "priceRange": "₦25,000 - ₦100,000",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Keffi",
    "addressRegion": "Nasarawa State",
    "addressCountry": "NG"
  },
  "starRating": {
    "@type": "Rating",
    "ratingValue": "5"
  },
  "amenityFeature": [
    { "@type": "LocationFeatureSpecification", "name": "Free High Speed Wi-Fi", "value": true },
    { "@type": "LocationFeatureSpecification", "name": "Air Conditioning", "value": true },
    { "@type": "LocationFeatureSpecification", "name": "24/7 Security & Power", "value": true },
    { "@type": "LocationFeatureSpecification", "name": "Fine Dining Restaurant", "value": true }
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
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppFloat />
        <MobileCTA />
      </body>
    </html>
  );
}

