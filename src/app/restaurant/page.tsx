import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { Utensils, MessageCircle, Clock, Star } from 'lucide-react';
import { formatPrice, generateWhatsAppURL } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Restaurant & Menu | Super E Luxury Hotel & Suites',
  description: 'Enjoy fine Nigerian cuisine and international dishes at Super E Luxury Hotel restaurant in Keffi. Jollof rice, suya, pepper soup and more.',
};

const menuCategories = [
  {
    slug: 'nigerian-dishes',
    name: 'Nigerian Dishes',
    description: 'Authentic Nigerian cuisine prepared with fresh local ingredients',
    items: [
      { name: 'Jollof Rice & Chicken', price: 3500, description: 'Smoky party-style jollof rice served with perfectly seasoned grilled chicken', featured: true },
      { name: 'Pounded Yam & Egusi Soup', price: 4000, description: 'Smooth pounded yam with rich melon seed soup, assorted meat and fish', featured: true },
      { name: 'Pepper Soup (Goat Meat)', price: 3000, description: 'Spicy and aromatic goat meat pepper soup with traditional herbs' },
      { name: 'Fried Rice & Grilled Fish', price: 4000, description: 'Colourful fried rice with fresh vegetables and grilled catfish' },
      { name: 'Amala & Ewedu with Gbegiri', price: 3500, description: 'Traditional Yoruba delicacy with smooth amala and ewedu soup' },
    ],
  },
  {
    slug: 'grilled-and-roasted',
    name: 'Grilled & Roasted',
    description: 'Perfectly grilled and roasted specialties',
    items: [
      { name: 'Suya (Beef)', price: 2500, description: 'Classic Nigerian spiced grilled beef skewers', featured: true },
      { name: 'Grilled Whole Chicken', price: 6000, description: 'Whole chicken marinated and grilled to perfection' },
      { name: 'Grilled Catfish', price: 4500, description: 'Fresh catfish grilled with aromatic spices' },
      { name: 'Roasted Plantain (Bole)', price: 1500, description: 'Roasted plantain served with fish sauce' },
    ],
  },
  {
    slug: 'chops-and-fries',
    name: 'Chops & Fries',
    description: 'Quick bites, chops, and crispy fries',
    items: [
      { name: 'Chicken & Chips', price: 3000, description: 'Crispy fried chicken with seasoned french fries', featured: true },
      { name: 'Meat Pie', price: 800, description: 'Freshly baked meat pie with seasoned minced filling' },
      { name: 'Sausage Roll', price: 600, description: 'Crispy pastry filled with seasoned sausage' },
      { name: 'Chin Chin', price: 500, description: 'Crunchy fried dough snack' },
      { name: 'Puff Puff', price: 500, description: 'Sweet Nigerian fried dough balls' },
    ],
  },
  {
    slug: 'drinks-and-beverages',
    name: 'Drinks & Beverages',
    description: 'Refreshing drinks, juices, and beverages',
    items: [
      { name: 'Fresh Chapman', price: 1500, description: 'Classic Nigerian cocktail with citrus and grenadine', featured: true },
      { name: 'Zobo Drink', price: 800, description: 'Refreshing hibiscus drink with natural spices' },
      { name: 'Fresh Fruit Juice', price: 1000, description: 'Freshly squeezed seasonal fruit juice' },
      { name: 'Malt Drink', price: 600, description: 'Chilled premium malt beverage' },
      { name: 'Water (Bottled)', price: 300, description: 'Premium bottled water' },
    ],
  },
];

export default function RestaurantPage() {
  return (
    <>
      {/* Page Header */}
      <section style={{
        position: 'relative',
        paddingTop: 'calc(80px + var(--space-3xl))',
        paddingBottom: 'var(--space-3xl)',
        background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)',
        overflow: 'hidden',
      }}>
        <div className="section-container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <p className="section-label" style={{ color: 'var(--color-accent-light)' }}>
            Dining Experience
          </p>
          <h1 style={{ color: '#FFFFFF', marginBottom: 'var(--space-md)' }}>Our Restaurant</h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', maxWidth: '600px', margin: '0 auto var(--space-xl)', fontSize: '1.05rem' }}>
            Savor the finest Nigerian cuisine and international dishes, prepared with fresh, 
            locally-sourced ingredients and authentic spices.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.85)', fontSize: '0.9375rem' }}>
              <Clock size={18} />
              <span>Open Daily: 7:00 AM - 10:00 PM</span>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section className="section-padding" style={{ background: 'var(--color-background)' }}>
        <div className="section-container">
          {menuCategories.map((category, catIndex) => (
            <div key={category.slug} style={{ marginBottom: catIndex < menuCategories.length - 1 ? 'var(--space-4xl)' : 0 }}>
              {/* Category Header */}
              <div style={{ marginBottom: 'var(--space-xl)' }}>
                <h2 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', marginBottom: 'var(--space-xs)' }}>
                  {category.name}
                </h2>
                <div className="divider" style={{ margin: 'var(--space-sm) 0 var(--space-sm)' }} />
                <p style={{ color: 'var(--color-text-secondary)' }}>{category.description}</p>
              </div>

              {/* Menu Items Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: 'var(--space-lg)',
              }}>
                {category.items.map((item) => (
                  <div
                    key={item.name}
                    className="card-static"
                    style={{
                      padding: 'var(--space-lg)',
                      position: 'relative',
                      transition: 'transform var(--transition-base), box-shadow var(--transition-base)',
                    }}
                  >
                    {item.featured && (
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                      }}>
                        <span className="badge" style={{ background: 'rgba(161, 98, 7, 0.1)', color: 'var(--color-accent)' }}>
                          <Star size={12} fill="currentColor" /> Popular
                        </span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-sm)' }}>
                      <h3 style={{ fontSize: '1.0625rem', flex: 1, paddingRight: item.featured ? '5rem' : 0 }}>
                        {item.name}
                      </h3>
                    </div>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem', marginBottom: 'var(--space-md)', lineHeight: 1.6 }}>
                      {item.description}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-accent)', fontFamily: 'var(--font-heading)' }}>
                        {formatPrice(item.price)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Room Service Preview */}
      <section className="section-padding" style={{ background: 'var(--color-surface)' }}>
        <div className="section-container" style={{ textAlign: 'center' }}>
          <p className="section-label">In-Room Dining</p>
          <h2 className="section-title">Room Service</h2>
          <div className="divider" />
          <p className="section-description" style={{ marginBottom: 'var(--space-xl)' }}>
            Enjoy our delicious meals in the comfort of your room. 
            Contact us via WhatsApp to place your order.
          </p>
          <a
            href={generateWhatsAppURL('09131964939', 'Hello! I would like to order room service at Super E Luxury Hotel.')}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp btn-lg"
          >
            <MessageCircle size={20} />
            Order Room Service via WhatsApp
          </a>
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
            Reserve a Table
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: 'var(--space-xl)', maxWidth: '500px', margin: '0 auto var(--space-xl)' }}>
            For reservations, special dietary requirements, or large group bookings, contact us directly.
          </p>
          <a
            href={generateWhatsAppURL('09131964939', 'Hello! I would like to make a restaurant reservation at Super E Luxury Hotel.')}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp btn-lg"
          >
            <MessageCircle size={20} />
            Reserve via WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
