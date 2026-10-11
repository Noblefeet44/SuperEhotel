import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Restaurant & Nigerian Dining',
  description: 'Enjoy authentic Nigerian cuisine at Super E Luxury Hotel Keffi restaurant. Jollof Rice, Pounded Yam & Egusi, Pepper Soup, Suya, and more. Open daily 7AM-10PM. Room service available for hotel guests.',
  keywords: ['restaurant Keffi', 'Nigerian food Keffi', 'dining Keffi hotel', 'jollof rice Keffi', 'hotel restaurant Nasarawa', 'room service Keffi hotel'],
  alternates: { canonical: 'https://www.supereluxuryhotel.com/restaurant' },
  openGraph: {
    title: 'Restaurant & Nigerian Dining — Super E Luxury Hotel Keffi',
    description: 'Authentic Nigerian cuisine and fine dining at Super E Hotel Keffi. Open daily 7AM-10PM.',
    url: 'https://www.supereluxuryhotel.com/restaurant',
    images: [{ url: '/images/restaurant-interior.jpg', width: 1200, height: 630, alt: 'Super E Luxury Hotel Restaurant Dining' }],
  },
};

export default function RestaurantLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
