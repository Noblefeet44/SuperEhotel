import { Metadata } from 'next';
import {
  Wifi, Snowflake, Tv, Droplets, Utensils, Car,
  Shield, Zap, ConciergeBell, Shirt, Star
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Facilities & Amenities | Super E Luxury Hotel & Suites',
  description: 'Explore the premium facilities and amenities at Super E Luxury Hotel, Keffi. Air conditioning, Wi-Fi, restaurant, room service, and more.',
};

const facilityIcons: Record<string, React.ReactNode> = {
  snowflake: <Snowflake size={32} />,
  wifi: <Wifi size={32} />,
  tv: <Tv size={32} />,
  droplets: <Droplets size={32} />,
  utensils: <Utensils size={32} />,
  'concierge-bell': <ConciergeBell size={32} />,
  car: <Car size={32} />,
  'shield-check': <Shield size={32} />,
  shirt: <Shirt size={32} />,
  zap: <Zap size={32} />,
};

const facilities = [
  { name: 'Air Conditioning', description: 'All rooms are fully air-conditioned with individual climate controls for your comfort throughout your stay.', icon: 'snowflake' },
  { name: 'Free Wi-Fi', description: 'Complimentary high-speed internet access available throughout the hotel, keeping you connected at all times.', icon: 'wifi' },
  { name: 'Flat Screen TV', description: 'Modern flat screen televisions in every room with access to cable channels and entertainment.', icon: 'tv' },
  { name: 'Hot Water', description: '24/7 hot water supply in all bathrooms ensuring a refreshing shower or bath any time of day.', icon: 'droplets' },
  { name: 'Restaurant', description: 'Our on-site restaurant serves the finest Nigerian cuisine and international dishes, prepared with fresh local ingredients.', icon: 'utensils' },
  { name: 'Room Service', description: 'Enjoy in-room dining with our convenient room service. Order from our full menu delivered to your door.', icon: 'concierge-bell' },
  { name: 'Secure Parking', description: 'Spacious and secure parking area for all guests with 24/7 surveillance for your peace of mind.', icon: 'car' },
  { name: '24/7 Security', description: 'Round-the-clock professional security service ensuring the safety and well-being of all our guests.', icon: 'shield-check' },
  { name: 'Laundry Service', description: 'Professional laundry and dry cleaning service available for guests who need their garments cared for.', icon: 'shirt' },
  { name: 'Constant Power Supply', description: 'Uninterrupted power supply with industrial backup generators, ensuring you never experience any disruption.', icon: 'zap' },
];

export default function FacilitiesPage() {
  return (
    <>
      {/* Page Header */}
      <section style={{
        background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)',
        paddingTop: 'calc(80px + var(--space-3xl))',
        paddingBottom: 'var(--space-3xl)',
      }}>
        <div className="section-container" style={{ textAlign: 'center' }}>
          <p className="section-label" style={{ color: 'var(--color-accent-light)' }}>What We Offer</p>
          <h1 style={{ color: '#FFFFFF', marginBottom: 'var(--space-md)' }}>Our Facilities</h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', maxWidth: '600px', margin: '0 auto', fontSize: '1.05rem' }}>
            Everything you need for a comfortable, enjoyable, and productive stay at Super E Luxury Hotel.
          </p>
        </div>
      </section>

      {/* Facilities Grid */}
      <section className="section-padding" style={{ background: 'var(--color-background)' }}>
        <div className="section-container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 'var(--space-xl)',
          }}>
            {facilities.map((facility, index) => (
              <div
                key={facility.name}
                className="card-static animate-fade-in-up"
                style={{
                  padding: 'var(--space-xl)',
                  display: 'flex',
                  gap: 'var(--space-lg)',
                  alignItems: 'flex-start',
                  animationDelay: `${Math.min(index * 100, 500)}ms`,
                  animationFillMode: 'both',
                  opacity: 0,
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '64px',
                  height: '64px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'rgba(30, 58, 138, 0.08)',
                  color: 'var(--color-primary)',
                  flexShrink: 0,
                }}>
                  {facilityIcons[facility.icon] || <Star size={32} />}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.125rem', marginBottom: 'var(--space-sm)' }}>
                    {facility.name}
                  </h3>
                  <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, fontSize: '0.9375rem' }}>
                    {facility.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
