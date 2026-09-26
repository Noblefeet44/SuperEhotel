'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Wine, Beer, Sparkles, Music, Search, Plus, Minus,
  ShoppingBag, Phone, MessageCircle, Check, CheckCircle2,
  Clock, Flame, ShieldCheck, Award, X, GlassWater, ArrowRight
} from 'lucide-react';
import {
  DRINK_CATEGORIES, DrinkCategoryKey, DrinkItem,
  getStoredDrinksMenu, OFFICIAL_DRINKS_MENU
} from '@/lib/drinks-data';
import { formatPrice, generateWhatsAppURL } from '@/lib/utils';

export default function BarLoungePage() {
  const [drinks, setDrinks] = useState<DrinkItem[]>(OFFICIAL_DRINKS_MENU);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'name'>('recommended');
  
  // Drinks Cart / Bar Tab State: id -> quantity
  const [cart, setCart] = useState<Record<string, number>>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderType, setOrderType] = useState<'lounge-table' | 'room-service' | 'club-vip'>('lounge-table');
  const [tableOrRoom, setTableOrRoom] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');

  // Load custom stored drinks if updated from admin
  useEffect(() => {
    setDrinks(getStoredDrinksMenu());
    const handleUpdate = () => setDrinks(getStoredDrinksMenu());
    window.addEventListener('super_e_drinks_updated', handleUpdate);
    return () => window.removeEventListener('super_e_drinks_updated', handleUpdate);
  }, []);

  // Filter and sort drinks
  const filteredDrinks = useMemo(() => {
    return drinks.filter((item) => {
      const matchCat = activeCategory === 'all' || item.category === activeCategory;
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.volumeOrServing && item.volumeOrServing.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      // recommended: featured / popular first
      const scoreA = (a.featured ? 2 : 0) + (a.popular ? 1 : 0);
      const scoreB = (b.featured ? 2 : 0) + (b.popular ? 1 : 0);
      return scoreB - scoreA;
    });
  }, [drinks, activeCategory, searchQuery, sortBy]);

  // Cart operations
  const updateQuantity = (drinkId: string, delta: number) => {
    const current = cart[drinkId] || 0;
    const next = Math.max(0, current + delta);
    if (next === 0) {
      const clone = { ...cart };
      delete clone[drinkId];
      setCart(clone);
    } else {
      setCart({ ...cart, [drinkId]: next });
    }
  };

  const cartItems = useMemo(() => {
    return Object.entries(cart)
      .map(([id, qty]) => {
        const item = drinks.find((d) => d.id === id);
        return item ? { ...item, quantity: qty } : null;
      })
      .filter(Boolean) as (DrinkItem & { quantity: number })[];
  }, [cart, drinks]);

  const totalCartCount = useMemo(() => {
    return Object.values(cart).reduce((sum, q) => sum + q, 0);
  }, [cart]);

  const totalCartPrice = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  const handleCheckoutWhatsApp = () => {
    if (cartItems.length === 0) return;

    const orderLocation =
      orderType === 'room-service'
        ? `Room Delivery (${tableOrRoom.trim() || 'Room specified on call'})`
        : orderType === 'club-vip'
        ? `Nightclub VIP Bottle Service (${tableOrRoom.trim() || 'VIP Section'})`
        : `Lounge Table Order (${tableOrRoom.trim() || 'Lounge Bar Table'})`;

    const itemsSummary = cartItems
      .map((item) => ` • ${item.quantity}x ${item.name} (${formatPrice(item.price * item.quantity)})`)
      .join('\n');

    const message = `🍷 *NEW DRINKS ORDER / BAR TAB*
🏨 *Super E Luxury Hotel & Suites — Lounge & Bar*
━━━━━━━━━━━━━━━━━━━━
👤 *Customer:* ${guestName.trim() || 'Valued Guest'}
📞 *Phone:* ${guestPhone.trim() || 'Provided on pickup/delivery'}
📍 *Service:* ${orderLocation}

📋 *ORDER ITEMS:*
${itemsSummary}

💰 *TOTAL AMOUNT:* ${formatPrice(totalCartPrice)}
━━━━━━━━━━━━━━━━━━━━
*Sent via supereluxuryhotel.com/bar-lounge*`;

    const url = generateWhatsAppURL('07066472533', message);
    window.open(url, '_blank');
  };

  return (
    <div style={{ backgroundColor: 'var(--color-background)', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* ═══════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════ */}
      <section
        style={{
          position: 'relative',
          paddingTop: 'calc(80px + 3.5rem)',
          paddingBottom: '4.5rem',
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.94) 0%, rgba(30, 27, 75, 0.92) 100%), url(/images/vip-lounge-bar.jpg) center/cover no-repeat',
          color: '#FFFFFF',
        }}
      >
        <div className="section-container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '850px', margin: '0 auto', textAlign: 'center' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0.45rem 1.1rem',
                borderRadius: '9999px',
                backgroundColor: 'rgba(217, 119, 6, 0.25)',
                border: '1px solid rgba(245, 158, 11, 0.45)',
                color: '#FDE68A',
                fontSize: '0.85rem',
                fontWeight: 700,
                marginBottom: '1.25rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              <Wine size={16} /> VIP Lounge • Stocked Bar • Weekend Nightclub
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.1rem, 4.5vw, 3.4rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                color: '#FFFFFF',
                marginBottom: '1.2rem',
                textShadow: '0 2px 10px rgba(0,0,0,0.5)',
              }}
            >
              VIP Lounge, Stocked Bar &amp; Nightclub
            </h1>

            <p
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                color: 'rgba(255, 255, 255, 0.9)',
                lineHeight: 1.6,
                marginBottom: '2rem',
                maxWidth: '720px',
                marginInline: 'auto',
              }}
            >
              Keffi’s most prestigious evening retreat. Relax in ambient executive lounge seating, explore over <strong>80+ cold beers, aged whiskies, vintage wines &amp; chilled sodas</strong>, or turn up the energy at our weekend nightclub with resident DJ sound.
            </p>

            {/* Quick Experience Highlights */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '0.75rem',
                marginBottom: '2.25rem',
              }}
            >
              {[
                { icon: <Wine size={16} />, text: '80+ Stocked Drinks' },
                { icon: <Beer size={16} />, text: 'Frosty Cold Beers from ₦1,300' },
                { icon: <Flame size={16} />, text: 'Top-Shelf Cognac & Scotch' },
                { icon: <Music size={16} />, text: 'Weekend DJ & VIP Bottle Service' },
                { icon: <Clock size={16} />, text: 'Open Daily till Late' },
              ].map((pill, i) => (
                <span
                  key={i}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '0.4rem 0.85rem',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.12)',
                    backdropFilter: 'blur(6px)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                  }}
                >
                  {pill.icon} {pill.text}
                </span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <a
                href="#drinks-catalog"
                className="btn btn-accent btn-lg"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: 800,
                  boxShadow: '0 8px 25px rgba(217, 119, 6, 0.4)',
                }}
              >
                <Wine size={20} />
                Explore Drinks Menu &amp; Prices
              </a>

              <a
                href={generateWhatsAppURL('07066472533', 'Hello Super E Hotel! I want to reserve a VIP table / bottle service at the Lounge & Bar.')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp btn-lg"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <MessageCircle size={20} />
                Reserve VIP Booth
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          THE 3 NIGHTLIFE PILLARS SHOWCASE
          ═══════════════════════════════════════════ */}
      <section className="section-padding" style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid var(--color-border-light)' }}>
        <div className="section-container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p className="section-label">Three Unique Vibes</p>
            <h2 className="section-title">Lounge, Bar &amp; Club Experiences</h2>
            <div className="divider" />
            <p className="section-description" style={{ maxWidth: '680px', margin: '0 auto' }}>
              Whether you are closing a high-stakes business deal, unwinding after work with cold beers, or celebrating with friends on a Saturday night.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem',
            }}
          >
            {/* Pillar 1: VIP Lounge */}
            <div
              className="card-static"
              style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ position: 'relative', height: '220px', width: '100%' }}>
                <Image
                  src="/images/vip-lounge-bar.jpg"
                  alt="Super E VIP Lounge Keffi"
                  fill
                  style={{ objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    backgroundColor: '#1E3A8A',
                    color: '#FFFFFF',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                  }}
                >
                  Executive Relaxation
                </div>
              </div>
              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>
                    Executive VIP Lounge
                  </h3>
                  <p style={{ margin: '0 0 1rem', fontSize: '0.88rem', color: '#64748B', lineHeight: 1.6 }}>
                    Designed with velvet booths, low ambient lighting, and personalized attendant service. Ideal for confidential executive discussions, quiet evening drinks, and discreet meetings.
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#0891B2', fontWeight: 700 }}>
                  <Sparkles size={16} /> Ambient Music &amp; Soft Seating
                </div>
              </div>
            </div>

            {/* Pillar 2: Stocked Bar */}
            <div
              className="card-static"
              style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ position: 'relative', height: '220px', width: '100%' }}>
                <Image
                  src="/images/restaurant-interior.jpg"
                  alt="Super E Stocked Bar Keffi"
                  fill
                  style={{ objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    backgroundColor: '#D97706',
                    color: '#FFFFFF',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                  }}
                >
                  Fully Stocked Inventory
                </div>
              </div>
              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>
                    Full Bar &amp; Wine Cellar
                  </h3>
                  <p style={{ margin: '0 0 1rem', fontSize: '0.88rem', color: '#64748B', lineHeight: 1.6 }}>
                    Directly digitized from our official drinks boards. Enjoy frosty Nigerian &amp; international beers, top-shelf single malt Scotches, Irish whiskeys, VSOP cognacs, and fine celebration wines.
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#D97706', fontWeight: 700 }}>
                  <Wine size={16} /> 80+ Beverages at Official Board Rates
                </div>
              </div>
            </div>

            {/* Pillar 3: Nightclub */}
            <div
              className="card-static"
              style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ position: 'relative', height: '220px', width: '100%' }}>
                <Image
                  src="/images/club-nightlife.jpg"
                  alt="Super E Nightclub Keffi"
                  fill
                  style={{ objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    backgroundColor: '#7C3AED',
                    color: '#FFFFFF',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                  }}
                >
                  Weekend Nightlife
                </div>
              </div>
              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>
                    High-Energy Nightclub
                  </h3>
                  <p style={{ margin: '0 0 1rem', fontSize: '0.88rem', color: '#64748B', lineHeight: 1.6 }}>
                    Every Friday, Saturday, and festive night, experience electrifying DJ mixes, hype performances, neon lighting, and high-status VIP bottle service right here in Keffi.
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#7C3AED', fontWeight: 700 }}>
                  <Music size={16} /> Resident DJ • VIP Bottle Service
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          OFFICIAL DRINKS CATALOG & INTERACTIVE MENU
          ═══════════════════════════════════════════ */}
      <section id="drinks-catalog" className="section-padding" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="section-container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p className="section-label">Official Bar Catalog</p>
            <h2 className="section-title">The Complete Super E Drinks Menu</h2>
            <div className="divider" />
            <p className="section-description" style={{ maxWidth: '680px', margin: '0 auto' }}>
              Digitized directly from our official hotel price boards with exact Naira (₦) rates. Browse, search, or build a bar tab for lounge service or room delivery.
            </p>
          </div>

          {/* Search & Sort Toolbar */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
              backgroundColor: '#FFFFFF',
              padding: '1rem 1.25rem',
              borderRadius: '14px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
            }}
          >
            {/* Search Input */}
            <div style={{ position: 'relative', flex: '1 1 280px' }}>
              <Search
                size={18}
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}
              />
              <input
                type="text"
                className="input"
                placeholder="Search drinks (e.g. Hennessy, Heineken, Agor, Red Bull)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#64748B',
                  }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748B', whiteSpace: 'nowrap' }}>
                Sort By:
              </span>
              <select
                className="input"
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                style={{ width: 'auto', padding: '0.45rem 1rem' }}
              >
                <option value="recommended">Featured / Popular</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Drink Name (A–Z)</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div
            style={{
              display: 'flex',
              overflowX: 'auto',
              gap: '0.5rem',
              paddingBottom: '0.75rem',
              marginBottom: '2rem',
              scrollbarWidth: 'thin',
            }}
          >
            <button
              onClick={() => setActiveCategory('all')}
              style={{
                padding: '0.55rem 1.15rem',
                borderRadius: '9999px',
                border: activeCategory === 'all' ? '2px solid #1E3A8A' : '1px solid #CBD5E1',
                backgroundColor: activeCategory === 'all' ? '#1E3A8A' : '#FFFFFF',
                color: activeCategory === 'all' ? '#FFFFFF' : '#334155',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              All Categories ({drinks.length})
            </button>

            {DRINK_CATEGORIES.map((cat) => {
              const count = drinks.filter((d) => d.category === cat.key).length;
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  style={{
                    padding: '0.55rem 1.15rem',
                    borderRadius: '9999px',
                    border: isActive ? '2px solid #1E3A8A' : '1px solid #CBD5E1',
                    backgroundColor: isActive ? '#1E3A8A' : '#FFFFFF',
                    color: isActive ? '#FFFFFF' : '#334155',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>

          {/* DRINKS GRID */}
          {filteredDrinks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', backgroundColor: '#FFFFFF', borderRadius: '16px' }}>
              <Wine size={48} style={{ color: '#CBD5E1', margin: '0 auto 1rem' }} />
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#1E293B' }}>No drinks matched your query</h3>
              <p style={{ margin: '0.5rem 0 1rem', fontSize: '0.9rem', color: '#64748B' }}>
                Try searching for another brand or reset the category filter.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="btn btn-secondary btn-sm"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1.25rem',
              }}
            >
              {filteredDrinks.map((item) => {
                const qtyInCart = cart[item.id] || 0;
                return (
                  <div
                    key={item.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '14px',
                      border: qtyInCart > 0 ? '2px solid #D97706' : '1px solid #E2E8F0',
                      padding: '1.15rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div>
                      {/* Top Badges */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '0.2rem 0.55rem',
                            borderRadius: '4px',
                            backgroundColor: '#F1F5F9',
                            color: '#475569',
                            textTransform: 'uppercase',
                          }}
                        >
                          {item.volumeOrServing || 'Bottle / Can'}
                        </span>

                        {item.popular && (
                          <span
                            style={{
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              padding: '0.2rem 0.55rem',
                              borderRadius: '4px',
                              backgroundColor: '#FEF3C7',
                              color: '#B45309',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px',
                            }}
                          >
                            <Flame size={12} /> Popular
                          </span>
                        )}

                        {item.featured && !item.popular && (
                          <span
                            style={{
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              padding: '0.2rem 0.55rem',
                              borderRadius: '4px',
                              backgroundColor: '#EFF6FF',
                              color: '#1D4ED8',
                            }}
                          >
                            Top Shelf
                          </span>
                        )}
                      </div>

                      {/* Drink Name */}
                      <h4
                        style={{
                          margin: '0 0 0.35rem',
                          fontSize: '1.05rem',
                          fontWeight: 800,
                          color: '#0F172A',
                          lineHeight: 1.3,
                        }}
                      >
                        {item.name}
                      </h4>

                      {/* Description */}
                      <p
                        style={{
                          margin: '0 0 0.85rem',
                          fontSize: '0.84rem',
                          color: '#64748B',
                          lineHeight: 1.4,
                        }}
                      >
                        {item.description}
                      </p>
                    </div>

                    {/* Price and Cart Action */}
                    <div
                      style={{
                        paddingTop: '0.85rem',
                        borderTop: '1px solid #F1F5F9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1E3A8A' }}>
                          {formatPrice(item.price)}
                        </span>
                      </div>

                      {qtyInCart > 0 ? (
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            backgroundColor: '#FEF3C7',
                            borderRadius: '8px',
                            border: '1px solid #FDE68A',
                            padding: '2px',
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, -1)}
                            style={{
                              width: '28px',
                              height: '28px',
                              border: 'none',
                              backgroundColor: 'transparent',
                              color: '#92400E',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span
                            style={{
                              padding: '0 0.45rem',
                              fontSize: '0.85rem',
                              fontWeight: 800,
                              color: '#92400E',
                            }}
                          >
                            {qtyInCart}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, 1)}
                            style={{
                              width: '28px',
                              height: '28px',
                              border: 'none',
                              backgroundColor: 'transparent',
                              color: '#92400E',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            updateQuantity(item.id, 1);
                            setIsCartOpen(true);
                          }}
                          className="btn btn-secondary btn-sm"
                          style={{
                            padding: '0.4rem 0.75rem',
                            fontSize: '0.78rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontWeight: 700,
                          }}
                        >
                          <Plus size={14} /> Add to Tab
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FLOATING BAR TAB / ORDER DRAWER
          ═══════════════════════════════════════════ */}
      {totalCartCount > 0 && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 9999,
          }}
        >
          {!isCartOpen ? (
            <button
              onClick={() => setIsCartOpen(true)}
              className="btn btn-accent btn-lg"
              style={{
                borderRadius: '9999px',
                padding: '0.85rem 1.4rem',
                boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontWeight: 800,
              }}
            >
              <ShoppingBag size={20} />
              <span>Bar Tab ({totalCartCount})</span>
              <span style={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: '0.2rem 0.5rem', borderRadius: '9999px', fontSize: '0.85rem' }}>
                {formatPrice(totalCartPrice)}
              </span>
            </button>
          ) : (
            <div
              style={{
                width: 'min(92vw, 380px)',
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                border: '1px solid #E2E8F0',
                overflow: 'hidden',
                animation: 'fadeIn 0.2s ease-out',
              }}
            >
              {/* Drawer Header */}
              <div
                style={{
                  backgroundColor: '#1E3A8A',
                  color: '#FFFFFF',
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Wine size={20} />
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#FFFFFF' }}>
                      Your Bar Tab
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: '#BFDBFE' }}>
                      {totalCartCount} drink{totalCartCount > 1 ? 's' : ''} selected
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    border: 'none',
                    color: '#FFFFFF',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Items List */}
              <div
                style={{
                  maxHeight: '220px',
                  overflowY: 'auto',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                  borderBottom: '1px solid #E2E8F0',
                }}
              >
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.85rem',
                    }}
                  >
                    <div style={{ flex: 1, paddingRight: '0.5rem' }}>
                      <strong style={{ display: 'block', color: '#0F172A', fontSize: '0.88rem' }}>
                        {item.name}
                      </strong>
                      <span style={{ color: '#64748B', fontSize: '0.78rem' }}>
                        {formatPrice(item.price)} each
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          backgroundColor: '#F1F5F9',
                          borderRadius: '6px',
                        }}
                      >
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          style={{ width: '24px', height: '24px', border: 'none', background: 'transparent', cursor: 'pointer' }}
                        >
                          -
                        </button>
                        <span style={{ padding: '0 6px', fontWeight: 700, fontSize: '0.82rem' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          style={{ width: '24px', height: '24px', border: 'none', background: 'transparent', cursor: 'pointer' }}
                        >
                          +
                        </button>
                      </div>
                      <span style={{ fontWeight: 800, color: '#1E3A8A', minWidth: '60px', textAlign: 'right' }}>
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Options */}
              <div style={{ padding: '1rem' }}>
                <div style={{ marginBottom: '0.75rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '0.25rem' }}>
                    Where should we serve this?
                  </label>
                  <select
                    className="input"
                    value={orderType}
                    onChange={(e: any) => setOrderType(e.target.value)}
                    style={{ fontSize: '0.82rem', padding: '0.4rem 0.6rem' }}
                  >
                    <option value="lounge-table">Lounge Table Service</option>
                    <option value="room-service">Room Delivery (In-Hotel)</option>
                    <option value="club-vip">Nightclub VIP Table</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <input
                    type="text"
                    className="input"
                    placeholder={orderType === 'room-service' ? 'Room Number' : 'Table / Booth #'}
                    value={tableOrRoom}
                    onChange={(e) => setTableOrRoom(e.target.value)}
                    style={{ fontSize: '0.82rem', padding: '0.4rem 0.6rem' }}
                  />
                  <input
                    type="text"
                    className="input"
                    placeholder="Your Name"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    style={{ fontSize: '0.82rem', padding: '0.4rem 0.6rem' }}
                  />
                </div>

                {/* Subtotal & WhatsApp Submit */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                  <span style={{ fontSize: '0.9rem', color: '#475569' }}>Total Bill:</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#D97706' }}>
                    {formatPrice(totalCartPrice)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleCheckoutWhatsApp}
                  className="btn btn-whatsapp"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '0.65rem',
                  }}
                >
                  <MessageCircle size={18} /> Dispatch Order via WhatsApp
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
