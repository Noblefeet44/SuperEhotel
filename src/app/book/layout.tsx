import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book a Room — Online Reservation',
  description: 'Reserve your room at Super E Luxury Hotel Keffi online. Choose from 8 room types, select dates, and pay via bank transfer. Instant booking confirmation. Rooms from ₦36,000/night.',
  keywords: ['book hotel Keffi', 'hotel reservation Keffi', 'book room Keffi Nigeria', 'online booking Keffi hotel', 'reserve room Nasarawa'],
  alternates: { canonical: 'https://supereluxuryhotel.com/book' },
  openGraph: {
    title: 'Book a Room — Super E Luxury Hotel Keffi',
    description: 'Reserve online from 8 room types. From ₦36,000/night. Instant confirmation.',
  },
};

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
