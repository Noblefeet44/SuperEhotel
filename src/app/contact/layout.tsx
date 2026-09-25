import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us & Location — Keffi, Nasarawa State',
  description: 'Contact Super E Luxury Hotel Keffi. Phone: 07066472533, 09072069217. Located at 11 Hassan Chiroma Street, Adjacent Alvari Hotel G.R.A Keffi, Nasarawa State, Nigeria. Near NSUK and Abuja-Keffi Expressway.',
  keywords: ['Super E Hotel address', 'hotel Keffi location', 'contact Super E Hotel', 'Keffi hotel phone number', 'hotel near NSUK', 'hotel Keffi GRA', 'directions to hotel Keffi'],
  alternates: { canonical: 'https://supereluxuryhotel.com/contact' },
  openGraph: {
    title: 'Contact & Location — Super E Luxury Hotel Keffi',
    description: 'Find us at 11 Hassan Chiroma Street, G.R.A Keffi, Nasarawa State. Call 07066472533 or 09072069217.',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
