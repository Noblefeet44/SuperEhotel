import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileCTA } from "@/components/layout/MobileCTA";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";

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
  ],
  openGraph: {
    title: "Super E Luxury Hotel & Suites | Keffi, Nigeria",
    description:
      "Luxury at Its Peak. Premium accommodation, fine Nigerian dining, and exceptional hospitality in Keffi, Nigeria.",
    type: "website",
    locale: "en_NG",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
