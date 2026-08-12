import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { Bed, Utensils, MessageCircle, Star, Shield, Users } from 'lucide-react';
import { generateWhatsAppURL } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'About Us | Super E Luxury Hotel & Suites',
  description: 'Learn about Super E Luxury Hotel & Suites in Keffi, Nigeria. Our story, mission, and commitment to exceptional Nigerian hospitality.',
};

export default function AboutPage() {
  return (
    <>
      {/* Page Header */}
      <section style={{
        position: 'relative',
        paddingTop: 'calc(80px + var(--space-3xl))',
        paddingBottom: 'var(--space-3xl)',
        background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)',
      }}>
        <div className="section-container" style={{ textAlign: 'center' }}>
          <p className="section-label" style={{ color: 'var(--color-accent-light)' }}>Our Story</p>
          <h1 style={{ color: '#FFFFFF', marginBottom: 'var(--space-md)' }}>About Us</h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', maxWidth: '600px', margin: '0 auto', fontSize: '1.05rem' }}>
            Discover the story behind Keffi&apos;s premier luxury hotel destination.
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="section-padding" style={{ background: 'var(--color-background)' }}>
        <div className="section-container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 'var(--space-3xl)',
            maxWidth: '800px',
            margin: '0 auto',
          }}>
            {/* Welcome */}
            <div>
              <h2 style={{ marginBottom: 'var(--space-lg)' }}>
                Welcome to Super E Luxury Hotel &amp; Suites
              </h2>
              <div className="divider" style={{ margin: '0 0 var(--space-lg)' }} />
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, fontSize: '1.05rem', marginBottom: 'var(--space-lg)' }}>
                Super E Luxury Hotel & Suites is a premier hospitality destination located in Keffi, 
                Nasarawa State, Nigeria. We are committed to providing our guests with an exceptional 
                experience that combines modern luxury with warm Nigerian hospitality.
              </p>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, fontSize: '1.05rem' }}>
                Our well-appointed rooms, exquisite restaurant serving authentic Nigerian cuisine, 
                and attentive staff ensure that every moment of your stay is memorable. Whether you&apos;re 
                visiting for business or leisure, Super E Luxury Hotel is your home away from home.
              </p>
            </div>

            {/* Image */}
            <div style={{
              position: 'relative',
              height: '400px',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
            }}>
              <Image
                src="/images/hotel-lobby.jpg"
                alt="Super E Luxury Hotel lobby"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 800px) 100vw, 800px"
              />
            </div>

            {/* Values */}
            <div>
              <h2 style={{ marginBottom: 'var(--space-xl)', textAlign: 'center' }}>
                Why Choose Us
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: 'var(--space-xl)',
              }}>
                {[
                  { icon: <Star size={28} />, title: 'Premium Quality', desc: 'Every detail is carefully curated for your comfort and satisfaction.' },
                  { icon: <Shield size={28} />, title: 'Safety & Security', desc: '24/7 security and surveillance for complete peace of mind.' },
                  { icon: <Users size={28} />, title: 'Warm Hospitality', desc: 'Our friendly staff go above and beyond to make you feel at home.' },
                  { icon: <Utensils size={28} />, title: 'Fine Dining', desc: 'Authentic Nigerian cuisine prepared by experienced chefs.' },
                  { icon: <Bed size={28} />, title: 'Luxurious Rooms', desc: 'Spacious, well-furnished rooms with modern amenities.' },
                  { icon: <MessageCircle size={28} />, title: 'Easy Booking', desc: 'Book in minutes via our website or WhatsApp.' },
                ].map((value) => (
                  <div key={value.title} style={{ textAlign: 'center' }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '56px',
                      height: '56px',
                      borderRadius: 'var(--radius-full)',
                      background: 'rgba(30, 58, 138, 0.08)',
                      color: 'var(--color-primary)',
                      marginBottom: 'var(--space-md)',
                    }}>
                      {value.icon}
                    </div>
                    <h4 style={{ fontSize: '1rem', marginBottom: 'var(--space-sm)' }}>{value.title}</h4>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem' }}>{value.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)',
        padding: 'var(--space-3xl) 0',
        textAlign: 'center',
      }}>
        <div className="section-container">
          <h2 style={{ color: '#FFFFFF', marginBottom: 'var(--space-md)' }}>
            Experience Luxury at Its Peak
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: 'var(--space-xl)', maxWidth: '500px', margin: '0 auto var(--space-xl)' }}>
            Ready to experience the best hospitality in Keffi? Book your stay today.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/book" className="btn btn-accent btn-lg">
              <Bed size={20} />
              Book a Room
            </Link>
            <a
              href={generateWhatsAppURL('09131964939', 'Hello! I would like to learn more about Super E Luxury Hotel.')}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp btn-lg"
            >
              <MessageCircle size={20} />
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
