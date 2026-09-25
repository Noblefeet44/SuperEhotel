import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rooms & Rates — 8 Room Types from ₦36,000',
  description: 'Browse all 8 room categories at Super E Luxury Hotel Keffi: Standard, Deluxe, Deluxe 1, Deluxe 2, Luxury, Executive, Executive 1, and Presidential Suite. From ₦36,000 to ₦153,000 per night. All rates include 10% Service Charge & 7% VAT.',
  keywords: ['hotel rooms Keffi', 'room rates Keffi Nigeria', 'luxury suite Keffi', 'presidential suite Keffi', 'cheap hotel room Keffi', 'executive room Keffi', 'deluxe room Nasarawa'],
  alternates: { canonical: 'https://supereluxuryhotel.com/rooms' },
  openGraph: {
    title: 'Rooms & Rates — Super E Luxury Hotel Keffi',
    description: '8 room types from ₦36,000/night. Standard to Presidential Suite. Book now at the best hotel in Keffi, Nasarawa State.',
    images: [{ url: '/images/hotel-lobby.jpg', width: 1200, height: 630, alt: 'Super E Hotel rooms and suites' }],
  },
};

export default function RoomsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
