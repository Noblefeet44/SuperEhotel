import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'VIP Lounge, Stocked Bar & Nightclub in Keffi | Super E Luxury Hotel',
  description: 'Experience Keffi’s premier nightlife, executive VIP lounge, and fully stocked bar at Super E Luxury Hotel. Over 80+ cold beers, premium whiskies, cognac, wines, cocktails, and weekend resident DJ bottle service.',
  keywords: [
    'vip lounge keffi',
    'bar in keffi',
    'nightclub in keffi',
    'nightlife keffi nasarawa',
    'hotel bar keffi',
    'best lounge in keffi',
    'drinks menu super e hotel',
    'cold beer keffi',
    'wine bar keffi',
    'cocktails keffi',
    'hennessy keffi',
    'jameson keffi',
  ],
  alternates: { canonical: 'https://supereluxuryhotel.com/bar-lounge' },
  openGraph: {
    title: 'VIP Lounge, Stocked Bar & Nightclub — Super E Luxury Hotel Keffi',
    description: 'Premier nightlife destination in Keffi, Nasarawa State. 80+ stocked beverages, top-shelf whiskies, cold beers, and executive lounge booths.',
    url: 'https://supereluxuryhotel.com/bar-lounge',
    siteName: 'Super E Luxury Hotel & Suites',
    images: [
      {
        url: 'https://supereluxuryhotel.com/images/vip-lounge-bar.jpg',
        width: 1200,
        height: 675,
        alt: 'Super E VIP Lounge and Stocked Bar Keffi',
      },
      {
        url: 'https://supereluxuryhotel.com/images/club-nightlife.jpg',
        width: 1200,
        height: 675,
        alt: 'Super E Hotel Nightclub & DJ Lounge',
      },
    ],
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VIP Lounge, Stocked Bar & Nightclub in Keffi | Super E Luxury Hotel',
    description: 'Executive VIP lounge, fully stocked bar with 80+ drinks, and weekend nightclub experiences in Keffi, Nasarawa State.',
    images: ['https://supereluxuryhotel.com/images/vip-lounge-bar.jpg'],
  },
};

export default function BarLoungeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
