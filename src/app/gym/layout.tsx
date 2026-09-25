import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gym & Fitness Center',
  description: 'Stay fit at Super E Luxury Hotel Keffi gym and fitness center. Modern equipment, personal training, flexible membership packages. Open to hotel guests and public members.',
  keywords: ['gym Keffi', 'fitness center Keffi', 'gym membership Keffi Nasarawa', 'hotel gym Keffi', 'workout Keffi Nigeria'],
  alternates: { canonical: 'https://supereluxuryhotel.com/gym' },
  openGraph: {
    title: 'Gym & Fitness Center — Super E Luxury Hotel Keffi',
    description: 'Modern gym and fitness center at Super E Hotel. Flexible membership packages available.',
  },
};

export default function GymLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
