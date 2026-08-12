'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Utensils, MessageCircle, Clock, Star, Plus, Minus,
  ShoppingBag, Check, Send, Phone, User
} from 'lucide-react';
import { formatPrice, generateWhatsAppURL, cn } from '@/lib/utils';

interface MenuItem {
  name: string;
  price: number;
  description: string;
  featured?: boolean;
}

interface MenuCategory {
  slug: string;
  name: string;
  description: string;
  items: MenuItem[];
}

const MENU_CATEGORIES: MenuCategory[] = [
  {
    slug: 'nigerian-dishes',
    name: 'Nigerian Dishes',
    description: 'Authentic Nigerian cuisine prepared with fresh local ingredients and rich traditional spices',
    items: [
      { name: 'Jollof Rice & Chicken', price: 3500, description: 'Smoky party-style jollof rice served with perfectly seasoned grilled chicken', featured: true },
      { name: 'Pounded Yam & Egusi Soup', price: 4000, description: 'Smooth pounded yam with rich melon seed soup, assorted meat and fish', featured: true },
      { name: 'Pepper Soup (Goat Meat)', price: 3000, description: 'Spicy and aromatic goat meat pepper soup with traditional herbs' },
      { name: 'Fried Rice & Grilled Fish', price: 4000, description: 'Colourful fried rice with fresh vegetables and grilled catfish' },
      { name: 'Amala & Ewedu with Gbegiri', price: 3500, description: 'Traditional delicacy with smooth amala, ewedu soup, and abula stew' },
    ],
  },
  {
    slug: 'grilled-and-roasted',
    name: 'Grilled & Roasted',
    description: 'Perfectly seasoned and open-flame grilled specialties',
    items: [
      { name: 'Suya (Beef)', price: 2500, description: 'Classic Nigerian spiced grilled beef skewers with fresh onions & pepper', featured: true },
      { name: 'Grilled Whole Chicken', price: 6000, description: 'Whole chicken marinated in house spices and slow grilled to perfection' },
      { name: 'Grilled Catfish (Point & Kill)', price: 4500, description: 'Fresh catfish grilled with aromatic chili pepper sauce' },
      { name: 'Roasted Plantain (Bole) & Fish', price: 1500, description: 'Roasted ripe plantain served with hot palm oil pepper sauce & fish' },
    ],
  },
  {
    slug: 'chops-and-fries',
    name: 'Chops & Fries',
    description: 'Crispy bites, finger foods, and quick delicacies',
    items: [
      { name: 'Chicken & Chips', price: 3000, description: 'Crispy fried golden chicken with seasoned french fries', featured: true },
      { name: 'Meat Pie (Premium)', price: 800, description: 'Freshly baked buttery pastry filled with savory minced beef filling' },
      { name: 'Sausage Roll', price: 600, description: 'Flaky pastry filled with spiced sausage filling' },
      { name: 'Spring Rolls & Samosa (Platter)', price: 2000, description: 'Crunchy vegetable spring rolls and beef samosa platter' },
    ],
  },
  {
    slug: 'drinks-and-beverages',
    name: 'Drinks & Beverages',
    description: 'Refreshing cocktails, natural juices, and cold beverages',
    items: [
      { name: 'Fresh Chapman (House Special)', price: 1500, description: 'Classic Nigerian cocktail with citrus bitters, grenadine & cucumber', featured: true },
      { name: 'Zobo Drink (Cold Spiced)', price: 800, description: 'Refreshing hibiscus tea infused with pineapple, ginger & cloves' },
      { name: 'Fresh Fruit Juice (Orange/Pineapple)', price: 1000, description: 'Freshly squeezed natural fruit juice without preservatives' },
      { name: 'Chilled Malt / Soda', price: 600, description: 'Chilled premium malt or soft beverage of choice' },
      { name: 'Bottled Mineral Water', price: 300, description: 'Chilled 75cl bottled natural mineral water' },
    ],
  },
];

export default function RestaurantPage() {
  // Meal Cart State: record item name -> quantity
  const [cart, setCart] = useState<Record<string, number>>({});
  
  // Order Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    orderType: 'room-service', // 'room-service' | 'table-reservation'
    locationDetails: '', // e.g. "Room 204" or "Table for 4 at 8 PM"
    servingTime: 'ASAP',
    specialNotes: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Cart operations
  const updateQuantity = (itemName: string, delta: number) => {
    const currentQty = cart[itemName] || 0;
    const newQty = Math.max(0, currentQty + delta);
    if (newQty === 0) {
      const nextCart = { ...cart };
      delete nextCart[itemName];
      setCart(nextCart);
    } else {
      setCart({ ...cart, [itemName]: newQty });
    }
  };

  // Find price of an item
  const getItemPrice = (itemName: string): number => {
    for (const cat of MENU_CATEGORIES) {
      const item = cat.items.find((i) => i.name === itemName);
      if (item) return item.price;
    }
    return 0;
  };

  // Total cart calculation
  const totalAmount = Object.entries(cart).reduce((sum, [name, qty]) => {
    return sum + getItemPrice(name) * qty;
  }, 0);

  const cartItemCount = Object.values(cart).reduce((a, b) => a + b, 0);

  // Form submission & WhatsApp redirect
  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    if (cartItemCount === 0 && formData.orderType === 'room-service') {
      errors.cart = 'Please select at least 1 dish from the menu above';
    }

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    // Construct detailed WhatsApp message
    let itemsText = '';
    Object.entries(cart).forEach(([name, qty]) => {
      const price = getItemPrice(name) * qty;
      itemsText += `• ${qty}x ${name} (₦${price.toLocaleString()})\n`;
    });

    const orderTypeLabel = formData.orderType === 'room-service' ? 'In-Room Dining' : 'Table Reservation';

    const message = 
`🍽️ *SUPER E HOTEL — MEAL ORDER*
----------------------------------------
👤 *Guest Name*: ${formData.fullName}
📞 *Phone / WhatsApp*: ${formData.phone}
📌 *Type*: ${orderTypeLabel}
📍 *Room / Table Details*: ${formData.locationDetails || 'N/A'}
⏰ *Preferred Serving Time*: ${formData.servingTime}

🥘 *ITEMS ORDERED*:
${itemsText || '• Table Reservation Inquiry\n'}
💰 *TOTAL AMOUNT ESTIMATE*: ₦${totalAmount.toLocaleString()}
${formData.specialNotes ? `📝 *Special Instructions*: ${formData.specialNotes}\n` : ''}----------------------------------------
Please confirm my meal order and preparation time. Thank you!`;

    const whatsappUrl = generateWhatsAppURL('09131964939', message);
    setIsSubmitted(true);

    if (typeof window !== 'undefined') {
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <>
      {/* Page Header */}
      <section style={{
        position: 'relative',
        paddingTop: 'calc(80px + var(--space-3xl))',
        paddingBottom: 'var(--space-3xl)',
        background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)',
        textAlign: 'center',
      }}>
        <div className="section-container" style={{ position: 'relative', zIndex: 2 }}>
          <p className="section-label" style={{ color: 'var(--color-accent-light)' }}>
            Super E Fine Dining & Room Service
          </p>
          <h1 style={{ color: '#FFFFFF', marginBottom: 'var(--space-md)' }}>Restaurant Menu & Meal Order</h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.85)', maxWidth: '640px', margin: '0 auto var(--space-xl)', fontSize: '1.05rem' }}>
            Select your favorite Nigerian dishes, grilled specialties, snacks, or beverages below. Fill in your details to submit your meal order directly to our kitchen via WhatsApp!
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', color: 'rgba(255,255,255,0.9)', fontSize: '0.925rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={18} style={{ color: 'var(--color-accent-light)' }} />
              <span>Kitchen Hours: 7:00 AM - 10:00 PM Daily</span>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Order Cart Bar for Mobile */}
      {cartItemCount > 0 && (
        <div style={{
          position: 'fixed',
          bottom: '70px',
          left: '1rem',
          right: '1rem',
          zIndex: 45,
          background: 'var(--color-primary-dark)',
          color: '#FFFFFF',
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-xl)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'var(--color-accent)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.875rem' }}>
              {cartItemCount}
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Selected Meals Total</div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-accent-light)' }}>
                {formatPrice(totalAmount)}
              </div>
            </div>
          </div>
          <a
            href="#order-meal"
            className="btn btn-accent btn-sm"
            style={{ borderRadius: '9999px', padding: '0.5rem 1rem' }}
          >
            Complete Order <Send size={16} />
          </a>
        </div>
      )}

      {/* Menu Categories Section */}
      <section className="section-padding" style={{ background: 'var(--color-background)' }}>
        <div className="section-container">
          {MENU_CATEGORIES.map((category, catIndex) => (
            <div key={category.slug} style={{ marginBottom: catIndex < MENU_CATEGORIES.length - 1 ? 'var(--space-4xl)' : 'var(--space-2xl)' }}>
              {/* Category Header */}
              <div style={{ marginBottom: 'var(--space-xl)' }}>
                <h2 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', marginBottom: 'var(--space-xs)' }}>
                  {category.name}
                </h2>
                <div className="divider" style={{ margin: 'var(--space-sm) 0 var(--space-sm)' }} />
                <p style={{ color: 'var(--color-text-secondary)' }}>{category.description}</p>
              </div>

              {/* Items Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: 'var(--space-lg)',
              }}>
                {category.items.map((item) => {
                  const qty = cart[item.name] || 0;

                  return (
                    <div
                      key={item.name}
                      className="card-static"
                      style={{
                        padding: 'var(--space-lg)',
                        position: 'relative',
                        border: qty > 0 ? '2px solid var(--color-primary)' : '1px solid var(--color-border-light)',
                        transition: 'all var(--transition-fast)',
                        background: 'var(--color-surface)',
                      }}
                    >
                      {item.featured && (
                        <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                          <span className="badge" style={{ background: 'rgba(161, 98, 7, 0.1)', color: 'var(--color-accent)' }}>
                            <Star size={12} fill="currentColor" /> Chef Special
                          </span>
                        </div>
                      )}

                      <h3 style={{ fontSize: '1.0625rem', marginBottom: '0.375rem', paddingRight: item.featured ? '5rem' : 0 }}>
                        {item.name}
                      </h3>
                      <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: 'var(--space-md)', lineHeight: 1.5 }}>
                        {item.description}
                      </p>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                        <span style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-accent)', fontFamily: 'var(--font-heading)' }}>
                          {formatPrice(item.price)}
                        </span>

                        {/* Quantity Counter */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--color-muted)', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-full)' }}>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.name, -1)}
                            disabled={qty === 0}
                            style={{ border: 'none', background: 'none', cursor: qty > 0 ? 'pointer' : 'default', opacity: qty > 0 ? 1 : 0.4 }}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={16} />
                          </button>
                          <span style={{ fontWeight: 700, fontSize: '0.95rem', minWidth: '20px', textAlign: 'center' }}>
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.name, 1)}
                            style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--color-primary)' }}
                            aria-label="Increase quantity"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MEAL ORDERING & TABLE RESERVATION FORM */}
      <section id="order-meal" className="section-padding" style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-border-light)' }}>
        <div className="section-container" style={{ maxWidth: '750px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
            <p className="section-label">Place Your Order</p>
            <h2 className="section-title">Meal Order &amp; Table Reservation</h2>
            <div className="divider" />
            <p className="section-description">
              Fill in your details below to complete your order. Your meal request will be sent directly to our restaurant team on WhatsApp for instant preparation!
            </p>
          </div>

          <form onSubmit={handleOrderSubmit} className="card-static" style={{ padding: 'var(--space-xl)', background: 'var(--color-background)' }}>
            {/* Selected Items Summary Box */}
            <div style={{ marginBottom: '1.5rem', background: 'var(--color-surface)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
              <h4 style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShoppingBag size={18} style={{ color: 'var(--color-primary)' }} />
                <span>Selected Dishes ({cartItemCount})</span>
              </h4>

              {cartItemCount === 0 ? (
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                  No dishes selected yet. Tap the (+) button on any menu item above to add it to your meal order!
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {Object.entries(cart).map(([name, qty]) => (
                    <div key={name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.925rem' }}>
                      <span>{qty}x {name}</span>
                      <span style={{ fontWeight: 600 }}>{formatPrice(getItemPrice(name) * qty)}</span>
                    </div>
                  ))}
                  <div style={{ borderTop: '1px solid var(--color-border-light)', paddingTop: '0.5rem', marginTop: '0.25rem', display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                    <span>Estimated Total:</span>
                    <span style={{ color: 'var(--color-accent)', fontSize: '1.1rem' }}>{formatPrice(totalAmount)}</span>
                  </div>
                </div>
              )}
              {formErrors.cart && <p className="error-text" style={{ marginTop: '0.5rem' }}>{formErrors.cart}</p>}
            </div>

            {/* Form Inputs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label htmlFor="meal-name" className="label">Full Name *</label>
                <input
                  id="meal-name"
                  type="text"
                  className={cn('input', formErrors.fullName && 'input-error')}
                  placeholder="Enter your name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
                {formErrors.fullName && <p className="error-text">{formErrors.fullName}</p>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                <div>
                  <label htmlFor="meal-phone" className="label">Phone / WhatsApp Number *</label>
                  <input
                    id="meal-phone"
                    type="tel"
                    className={cn('input', formErrors.phone && 'input-error')}
                    placeholder="e.g. 08012345678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                  {formErrors.phone && <p className="error-text">{formErrors.phone}</p>}
                </div>

                <div>
                  <label htmlFor="meal-type" className="label">Order / Dining Type *</label>
                  <select
                    id="meal-type"
                    className="input"
                    value={formData.orderType}
                    onChange={(e) => setFormData({ ...formData, orderType: e.target.value })}
                  >
                    <option value="room-service">In-Room Dining (Room Service)</option>
                    <option value="table-reservation">Table Reservation (Dine-In)</option>
                    <option value="takeaway">Takeaway Pick-up</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                <div>
                  <label htmlFor="meal-location" className="label">
                    {formData.orderType === 'room-service' ? 'Room Number' : 'Table / Guest Details'}
                  </label>
                  <input
                    id="meal-location"
                    type="text"
                    className="input"
                    placeholder={formData.orderType === 'room-service' ? 'e.g. Room 204' : 'e.g. Table for 4 guests'}
                    value={formData.locationDetails}
                    onChange={(e) => setFormData({ ...formData, locationDetails: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="meal-time" className="label">Preferred Serving Time</label>
                  <select
                    id="meal-time"
                    className="input"
                    value={formData.servingTime}
                    onChange={(e) => setFormData({ ...formData, servingTime: e.target.value })}
                  >
                    <option value="ASAP">As Soon As Possible (ASAP)</option>
                    <option value="Within 30 mins">Within 30 Minutes</option>
                    <option value="Specific Time">Specific Time (Specify in notes)</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="meal-notes" className="label">Special Instructions / Cooking Notes (Optional)</label>
                <textarea
                  id="meal-notes"
                  className="input"
                  placeholder="e.g. Less pepper, extra sauce, chilled drinks only, or dietary requirements..."
                  rows={3}
                  value={formData.specialNotes}
                  onChange={(e) => setFormData({ ...formData, specialNotes: e.target.value })}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-whatsapp btn-lg"
                style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
              >
                <MessageCircle size={22} />
                Send Food Order to WhatsApp
              </button>

              {isSubmitted && (
                <div style={{ background: '#F0FDF4', color: '#166534', padding: '0.85rem', borderRadius: 'var(--radius-md)', textAlign: 'center', fontSize: '0.9rem', fontWeight: 500 }}>
                  ✓ Order generated! If WhatsApp did not open automatically, please click the button above.
                </div>
              )}
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
