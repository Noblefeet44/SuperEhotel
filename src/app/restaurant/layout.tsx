import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Restaurant & Nigerian Dining',
  description: 'Enjoy authentic Nigerian cuisine at Super E Luxury Hotel Keffi restaurant. Jollof Rice, Pounded Yam & Egusi, Pepper Soup, Suya, and more. Open daily 7AM-10PM. Room service available for hotel guests.',
  keywords: ['restaurant Keffi', 'Nigerian food Keffi', 'dining Keffi hotel', 'jollof rice Keffi', 'hotel restaurant Nasarawa', 'room service Keffi hotel'],
  alternates: { canonical: 'https://supereluxuryhotel.com/restaurant' },
  openGraph: {
    title: 'Restaurant & Nigerian Dining — Super E Luxury Hotel',
    description: 'Authentic Nigerian cuisine and fine dining at Super E Hotel Keffi. Open daily 7AM-10PM.',
  },
};

export default function RestaurantLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
