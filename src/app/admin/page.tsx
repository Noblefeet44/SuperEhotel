'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, CalendarCheck, Bed, Utensils, Building2,
  Star, Settings, Image as ImageIcon, FileText, Menu, X,
  LogOut, ChevronRight, MessageCircle, UserPlus,
  UserCheck, CreditCard, Clock, AlertCircle, TrendingUp,
  UploadCloud, Phone, CheckCircle2, ArrowRight, Sparkles, ExternalLink
} from 'lucide-react';
import { formatPrice, generateWhatsAppURL } from '@/lib/utils';
import { HOTEL_INFO, getStoredRoomsData } from '@/lib/hotel-data';
import { AdminMobileNav } from '@/components/admin/AdminMobileNav';

const sidebarLinks = [
  { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { href: '/admin/bookings', label: 'Bookings', icon: <CalendarCheck size={20} /> },
  { href: '/admin/rooms', label: 'Rooms', icon: <Bed size={20} /> },
  { href: '/admin/restaurant', label: 'Restaurant', icon: <Utensils size={20} /> },
  { href: '/admin/hall', label: 'Hall Bookings', icon: <Sparkles size={20} /> },
  { href: '/admin/facilities', label: 'Facilities', icon: <Building2 size={20} /> },
  { href: '/admin/reviews', label: 'Reviews', icon: <Star size={20} /> },
  { href: '/admin/media', label: 'Media', icon: <ImageIcon size={20} /> },
  { href: '/admin/content', label: 'Content', icon: <FileText size={20} /> },
  { href: '/admin/settings', label: 'Settings', icon: <Settings size={20} /> },
];

const stats = {
  totalRooms: 4,
  availableRooms: 3,
  occupiedRooms: 1,
  maintenanceRooms: 0,
  todayCheckIns: 1,
  todayCheckOuts: 0,
  upcomingBookings: 3,
  pendingConfirmations: 2,
  pendingPayments: 3,
};

const recentBookings = [
  {
    ref: 'SE-20260811-4521',
    guest: 'Amina Bello',
    phone: '08023456789',
    room: 'Deluxe Room',
    checkIn: '2026-08-12',
    checkOut: '2026-08-14',
    status: 'new',
    payment: 'not_paid',
    amount: 80000,
  },
  {
    ref: 'SE-20260810-7834',
    guest: 'Chidi Okeke',
    phone: '07031234567',
    room: 'Executive Room',
    checkIn: '2026-08-11',
    checkOut: '2026-08-13',
    status: 'confirmed',
    payment: 'paid',
    amount: 120000,
  },
  {
    ref: 'SE-20260809-2156',
    guest: 'Fatima Abdullahi',
    phone: '08098765432',
    room: 'VIP Luxury Suite',
    checkIn: '2026-08-10',
    checkOut: '2026-08-12',
    status: 'checked_in',
    payment: 'paid',
    amount: 200000,
  },
  {
    ref: 'SE-20260808-9362',
    guest: 'Emmanuel Nwosu',
    phone: '09045678901',
    room: 'Standard Room',
    checkIn: '2026-08-08',
    checkOut: '2026-08-10',
    status: 'checked_out',
    payment: 'paid',
    amount: 50000,
  },
];

const statusColors: Record<string, string> = {
  new: '#3B82F6',
  awaiting_confirmation: '#D97706',
  confirmed: '#16A34A',
  checked_in: '#8B5CF6',
  checked_out: '#6B7280',
  cancelled: '#DC2626',
};

const statusLabels: Record<string, string> = {
  new: 'New',
  awaiting_confirmation: 'Awaiting',
  confirmed: 'Confirmed',
  checked_in: 'Checked In',
  checked_out: 'Checked Out',
  cancelled: 'Cancelled',
};

const paymentLabels: Record<string, string> = {
  not_paid: 'Not Paid',
  awaiting_payment: 'Awaiting',
  partially_paid: 'Partial',
  paid: 'Paid',
  refunded: 'Refunded',
};

const paymentColors: Record<string, string> = {
  not_paid: '#DC2626',
  awaiting_payment: '#D97706',
  partially_paid: '#F59E0B',
  paid: '#16A34A',
  refunded: '#6B7280',
};

export default function AdminDashboardPage() {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [roomsData, setRoomsData] = useState(() => getStoredRoomsData());
  const [liveBookingsCount, setLiveBookingsCount] = useState<number>(recentBookings.length);
  const [pendingCount, setPendingCount] = useState<number>(stats.pendingConfirmations);

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_authenticated');
    if (auth !== 'true') {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
      setRoomsData(getStoredRoomsData());

      // Fetch live bookings count
      fetch('/api/bookings')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.bookings)) {
            setLiveBookingsCount(data.bookings.length);
            const pending = data.bookings.filter(
              (b: any) => b.status === 'awaiting_confirmation' || b.status === 'new'
            ).length;
            setPendingCount(pending);
          }
        })
        .catch(() => {});
    }
  }, [router]);

  const totalRooms = roomsData.reduce((acc, r) => acc + r.units.length, 0);
  const availableRooms = roomsData.reduce(
    (acc, r) => acc + r.units.filter((u) => u.status === 'available').length,
    0
  );
  const occupiedRooms = roomsData.reduce(
    (acc, r) => acc + r.units.filter((u) => u.status === 'occupied').length,
    0
  );

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    sessionStorage.removeItem('admin_email');
    localStorage.removeItem('admin_authenticated');
    router.push('/admin/login');
  };

  if (!isAuthenticated) return null;

  return (
    <div className="admin-layout" style={{ maxWidth: '100vw', overflowX: 'hidden', width: '100%', boxSizing: 'border-box' }}>
      {/* Mobile Top Navigation */}
      <AdminMobileNav
        title="Dashboard"
        subtitle={HOTEL_INFO.name}
        actionButton={
          <Link
            href="/admin/bookings?walkin=true"
            style={{
              background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '0.35rem 0.6rem',
              fontSize: '0.72rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              textDecoration: 'none',
              boxShadow: '0 2px 6px rgba(22, 163, 74, 0.35)',
              whiteSpace: 'nowrap',
            }}
          >
            <UserPlus size={13} /> + Walk-In
          </Link>
        }
      />

      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="mobile-menu-overlay"
          onClick={() => setSidebarOpen(false)}
          style={{ zIndex: 39 }}
        />
      )}

      {/* Desktop Sidebar (Preserved exactly for desktop view) */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2>Super E Hotel</h2>
              <span>Admin Dashboard</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.7)',
                cursor: 'pointer',
                display: 'none',
              }}
              className="lg-hidden"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <nav style={{ padding: 'var(--space-sm) 0' }}>
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`admin-nav-item ${pathname === link.href ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        <div
          style={{
            padding: 'var(--space-lg)',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            marginTop: 'auto',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <Link href="/" target="_blank" className="admin-nav-item" style={{ fontSize: '0.875rem' }}>
            <ChevronRight size={16} />
            <span>View Website</span>
          </Link>
          <button
            onClick={handleLogout}
            className="admin-nav-item"
            style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.875rem' }}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main" style={{ minWidth: 0, width: '100%', maxWidth: '100vw', overflowX: 'hidden', boxSizing: 'border-box' }}>
        {/* =========================================================
            MOBILE-ONLY APP HERO & CONTROL CENTER (Fits like an App)
            ========================================================= */}
        <div className="admin-mobile-app-hub">
          {/* Welcome Card */}
          <div className="admin-app-welcome-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="admin-app-badge-pill">
                  <Sparkles size={12} /> Mobile Manager
                </span>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0.35rem 0 0.15rem', color: '#FFFFFF' }}>
                  Super E Operations
                </h1>
                <p style={{ margin: 0, fontSize: '0.78rem', color: 'rgba(255,255,255,0.8)' }}>
                  Tap any button to manage bookings, upload photos &amp; edit listings.
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', display: 'block' }}>
                  {availableRooms}/{totalRooms}
                </span>
                <span style={{ fontSize: '0.65rem', color: '#86EFAC', fontWeight: 700 }}>
                  Units Ready
                </span>
              </div>
            </div>

            {/* Quick Action Buttons Strip */}
            <div className="admin-app-quick-strip">
              <Link
                href="/admin/bookings?walkin=true"
                className="app-quick-pill"
                style={{
                  backgroundColor: 'rgba(34, 197, 94, 0.35)',
                  borderColor: 'rgba(34, 197, 94, 0.6)',
                  color: '#FFFFFF',
                  fontWeight: 800,
                }}
              >
                <UserPlus size={16} />
                <span>+ Walk-In</span>
              </Link>
              <Link href="/admin/bookings" className="app-quick-pill primary">
                <CalendarCheck size={16} />
                <span>Check Bookings</span>
                {pendingCount > 0 && <span className="pill-counter">{pendingCount}</span>}
              </Link>
              <Link href="/admin/rooms" className="app-quick-pill">
                <Bed size={16} />
                <span>Edit Listings</span>
              </Link>
              <Link href="/admin/media" className="app-quick-pill">
                <UploadCloud size={16} />
                <span>Upload Media</span>
              </Link>
            </div>
          </div>

          {/* Quick Key Metrics Carousel / Compact Grid */}
          <div className="admin-mobile-metrics-grid">
            <div className="mobile-metric-card green">
              <div className="metric-val">{availableRooms}</div>
              <div className="metric-lbl">Available Now</div>
            </div>
            <div className="mobile-metric-card purple">
              <div className="metric-val">{occupiedRooms}</div>
              <div className="metric-lbl">Occupied</div>
            </div>
            <div className="mobile-metric-card blue">
              <div className="metric-val">{liveBookingsCount}</div>
              <div className="metric-lbl">Total Bookings</div>
            </div>
            <div className="mobile-metric-card amber">
              <div className="metric-val">{pendingCount}</div>
              <div className="metric-lbl">Action Needed</div>
            </div>
          </div>

          {/* ALL FEATURES APP LAUNCHER GRID (Requested: "button to all features") */}
          <div className="admin-app-launcher-section">
            <div className="section-title-row">
              <h3>All Hotel Features</h3>
              <span className="section-hint">Instant 1-tap access</span>
            </div>

            <div className="admin-app-grid">
              {/* Feature 0: Front Desk Walk-in Booking */}
              <Link href="/admin/bookings?walkin=true" className="app-tile-btn">
                <div className="tile-icon-box" style={{ background: '#DCFCE7', color: '#16A34A' }}>
                  <UserPlus size={24} />
                </div>
                <div className="tile-info">
                  <span className="tile-title">Front Desk Walk-In</span>
                  <span className="tile-sub">Book walk-in guests with POS &amp; cash</span>
                </div>
                <span className="tile-badge-pill" style={{ backgroundColor: '#DCFCE7', color: '#166534', fontWeight: 800 }}>Front Desk</span>
              </Link>

              {/* Feature 1: Check & Manage Bookings */}
              <Link href="/admin/bookings" className="app-tile-btn">
                <div className="tile-icon-box" style={{ background: '#ECFDF5', color: '#10B981' }}>
                  <CalendarCheck size={24} />
                </div>
                <div className="tile-info">
                  <span className="tile-title">Check Bookings</span>
                  <span className="tile-sub">Verify guest stays &amp; receipts</span>
                </div>
                {pendingCount > 0 && (
                  <span className="tile-badge-counter">{pendingCount} New</span>
                )}
              </Link>

              {/* Feature 2: Edit Room Listings & Rates */}
              <Link href="/admin/rooms" className="app-tile-btn">
                <div className="tile-icon-box" style={{ background: '#F5F3FF', color: '#8B5CF6' }}>
                  <Bed size={24} />
                </div>
                <div className="tile-info">
                  <span className="tile-title">Edit Listings</span>
                  <span className="tile-sub">8 Room tiers &amp; live rates</span>
                </div>
                <span className="tile-badge-pill">8 Tiers</span>
              </Link>

              {/* Feature 3: Upload Photos & Media */}
              <Link href="/admin/media" className="app-tile-btn">
                <div className="tile-icon-box" style={{ background: '#FDF2F8', color: '#EC4899' }}>
                  <UploadCloud size={24} />
                </div>
                <div className="tile-info">
                  <span className="tile-title">Upload Media</span>
                  <span className="tile-sub">Phone photos &amp; gallery</span>
                </div>
                <span className="tile-badge-pill upload">Upload</span>
              </Link>

              {/* Feature 4: Restaurant Menu */}
              <Link href="/admin/restaurant" className="app-tile-btn">
                <div className="tile-icon-box" style={{ background: '#FFFBEB', color: '#F59E0B' }}>
                  <Utensils size={24} />
                </div>
                <div className="tile-info">
                  <span className="tile-title">Restaurant Menu</span>
                  <span className="tile-sub">Food prices &amp; availability</span>
                </div>
              </Link>

              {/* Feature 5: Event & Banquet Hall */}
              <Link href="/admin/hall" className="app-tile-btn">
                <div className="tile-icon-box" style={{ background: '#F5F3FF', color: '#8B5CF6' }}>
                  <Sparkles size={24} />
                </div>
                <div className="tile-info">
                  <span className="tile-title">Hall Bookings</span>
                  <span className="tile-sub">Events, dates &amp; rates</span>
                </div>
              </Link>

              {/* Feature 6: Hotel Facilities */}
              <Link href="/admin/facilities" className="app-tile-btn">
                <div className="tile-icon-box" style={{ background: '#EEF2FF', color: '#6366F1' }}>
                  <Building2 size={24} />
                </div>
                <div className="tile-info">
                  <span className="tile-title">Facilities</span>
                  <span className="tile-sub">Pool, event hall &amp; bar</span>
                </div>
              </Link>

              {/* Feature 7: Guest Reviews */}
              <Link href="/admin/reviews" className="app-tile-btn">
                <div className="tile-icon-box" style={{ background: '#FEFCE8', color: '#EAB308' }}>
                  <Star size={24} />
                </div>
                <div className="tile-info">
                  <span className="tile-title">Guest Reviews</span>
                  <span className="tile-sub">Moderate customer ratings</span>
                </div>
              </Link>

              {/* Feature 8: WhatsApp Desk */}
              <a
                href={generateWhatsAppURL(HOTEL_INFO.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="app-tile-btn"
              >
                <div className="tile-icon-box" style={{ background: '#DCFCE7', color: '#16A34A' }}>
                  <MessageCircle size={24} />
                </div>
                <div className="tile-info">
                  <span className="tile-title">WhatsApp Desk</span>
                  <span className="tile-sub">Direct chat with guests</span>
                </div>
              </a>

              {/* Feature 9: Hotel Settings */}
              <Link href="/admin/settings" className="app-tile-btn">
                <div className="tile-icon-box" style={{ background: '#F1F5F9', color: '#475569' }}>
                  <Settings size={24} />
                </div>
                <div className="tile-info">
                  <span className="tile-title">Hotel Settings</span>
                  <span className="tile-sub">Bank accounts &amp; contact</span>
                </div>
              </Link>

              {/* Feature 10: Customer Website */}
              <Link href="/" target="_blank" className="app-tile-btn">
                <div className="tile-icon-box" style={{ background: '#F8FAFC', color: '#1E3A8A' }}>
                  <ExternalLink size={24} />
                </div>
                <div className="tile-info">
                  <span className="tile-title">Live Website</span>
                  <span className="tile-sub">Preview guest booking view</span>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* =========================================================
            DESKTOP HEADER & STATS (Preserved for Desktop >= 1024px)
            ========================================================= */}
        <div className="admin-desktop-view-only">
          <div className="admin-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
              <h1>Dashboard Overview</h1>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
              <Link
                href="/admin/bookings?walkin=true"
                className="btn btn-primary btn-sm"
                style={{ backgroundColor: '#16A34A', borderColor: '#16A34A' }}
              >
                <UserPlus size={16} />
                <span>+ Walk-In Booking</span>
              </Link>
              <Link href="/admin/rooms" className="btn btn-primary btn-sm">
                <Bed size={16} />
                <span>Manage Rooms &amp; Inventory</span>
              </Link>
              <a
                href={generateWhatsAppURL(HOTEL_INFO.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp btn-sm"
              >
                <MessageCircle size={16} />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Desktop Stats Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: 'var(--space-md)',
              marginBottom: 'var(--space-2xl)',
            }}
          >
            <div className="stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div className="stat-card-value">{totalRooms}</div>
                  <div className="stat-card-label">Total Room Units</div>
                </div>
                <Bed size={24} style={{ color: 'var(--color-primary)', opacity: 0.5 }} />
              </div>
            </div>

            <div className="stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div className="stat-card-value" style={{ color: 'var(--color-success)' }}>
                    {availableRooms}
                  </div>
                  <div className="stat-card-label">Available Units</div>
                </div>
                <div
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: 'var(--color-success)',
                    marginTop: '8px',
                  }}
                />
              </div>
            </div>

            <div className="stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div className="stat-card-value" style={{ color: '#8B5CF6' }}>
                    {occupiedRooms}
                  </div>
                  <div className="stat-card-label">Occupied</div>
                </div>
                <UserCheck size={24} style={{ color: '#8B5CF6', opacity: 0.5 }} />
              </div>
            </div>

            <div className="stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div className="stat-card-value">{stats.todayCheckIns}</div>
                  <div className="stat-card-label">Today&apos;s Check-ins</div>
                </div>
                <Clock size={24} style={{ color: 'var(--color-primary)', opacity: 0.5 }} />
              </div>
            </div>

            <div className="stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div className="stat-card-value">{liveBookingsCount}</div>
                  <div className="stat-card-label">Total Bookings</div>
                </div>
                <TrendingUp size={24} style={{ color: 'var(--color-primary)', opacity: 0.5 }} />
              </div>
            </div>

            <div className="stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div className="stat-card-value" style={{ color: 'var(--color-warning)' }}>
                    {pendingCount}
                  </div>
                  <div className="stat-card-label">Pending Confirmations</div>
                </div>
                <AlertCircle size={24} style={{ color: 'var(--color-warning)', opacity: 0.5 }} />
              </div>
            </div>

            <div className="stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div className="stat-card-value" style={{ color: 'var(--color-destructive)' }}>
                    {stats.pendingPayments}
                  </div>
                  <div className="stat-card-label">Pending Payments</div>
                </div>
                <CreditCard size={24} style={{ color: 'var(--color-destructive)', opacity: 0.5 }} />
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            RECENT BOOKINGS SECTION (Dual Mobile Cards & Desktop Table)
            ========================================================= */}
        <div style={{ marginBottom: 'var(--space-2xl)' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 'var(--space-md)',
            }}
          >
            <div>
              <h2 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 800 }}>Recent Bookings</h2>
              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                Latest reservations from website &amp; walk-ins
              </span>
            </div>
            <Link
              href="/admin/bookings"
              className="btn btn-outline btn-sm"
              style={{ fontWeight: 700, fontSize: '0.78rem', padding: '0.4rem 0.8rem' }}
            >
              Check All <ChevronRight size={15} />
            </Link>
          </div>

          {/* MOBILE APP-STYLE RECENT BOOKING CARDS */}
          <div className="admin-mobile-bookings-list">
            {recentBookings.map((booking) => (
              <div key={booking.ref} className="admin-mobile-booking-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: '#0F172A' }}>
                      {booking.guest}
                    </h4>
                    <span style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: '#64748B' }}>
                      {booking.ref}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.96rem', fontWeight: 800, color: '#1E3A8A', display: 'block' }}>
                      {formatPrice(booking.amount)}
                    </span>
                    <span
                      className="badge"
                      style={{
                        background: `${statusColors[booking.status]}15`,
                        color: statusColors[booking.status],
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        padding: '0.15rem 0.45rem',
                      }}
                    >
                      {statusLabels[booking.status]}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: '#F8FAFC',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '8px',
                    fontSize: '0.76rem',
                    color: '#334155',
                    marginBottom: '0.65rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>
                    <strong>Room:</strong> {booking.room}
                  </span>
                  <span>
                    {new Date(booking.checkIn).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })} &rarr;{' '}
                    {new Date(booking.checkOut).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}
                  </span>
                </div>

                {/* Quick Action Touch Buttons */}
                <div style={{ display: 'flex', gap: '0.45rem' }}>
                  <a
                    href={`https://wa.me/234${booking.phone.replace(/^0/, '')}?text=${encodeURIComponent(
                      `Hello ${booking.guest}, this is Super E Luxury Hotel regarding your reservation (${booking.ref}) for ${booking.room}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm"
                    style={{
                      flex: 1,
                      backgroundColor: '#DCFCE7',
                      color: '#166534',
                      border: '1px solid #BBF7D0',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      justifyContent: 'center',
                      padding: '0.4rem',
                    }}
                  >
                    <MessageCircle size={14} /> WhatsApp
                  </a>

                  <a
                    href={`tel:${booking.phone}`}
                    className="btn btn-sm"
                    style={{
                      flex: 1,
                      backgroundColor: '#EFF6FF',
                      color: '#1E3A8A',
                      border: '1px solid #BFDBFE',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      justifyContent: 'center',
                      padding: '0.4rem',
                    }}
                  >
                    <Phone size={14} /> Call Guest
                  </a>

                  <Link
                    href={`/admin/bookings?search=${booking.ref}`}
                    className="btn btn-sm"
                    style={{
                      backgroundColor: '#F1F5F9',
                      color: '#475569',
                      border: '1px solid #E2E8F0',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '0.4rem 0.65rem',
                    }}
                  >
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP RECENT BOOKINGS TABLE (Preserved for Desktop >= 1024px) */}
          <div className="admin-desktop-view-only" style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Guest</th>
                  <th>Room</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Payment</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking.ref}>
                    <td>
                      <span style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '0.8125rem' }}>
                        {booking.ref}
                      </span>
                    </td>
                    <td>{booking.guest}</td>
                    <td>{booking.room}</td>
                    <td style={{ fontSize: '0.875rem' }}>
                      {new Date(booking.checkIn).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}
                    </td>
                    <td style={{ fontSize: '0.875rem' }}>
                      {new Date(booking.checkOut).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}
                    </td>
                    <td style={{ fontWeight: 600 }}>{formatPrice(booking.amount)}</td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          background: `${statusColors[booking.status]}15`,
                          color: statusColors[booking.status],
                        }}
                      >
                        {statusLabels[booking.status]}
                      </span>
                    </td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          background: `${paymentColors[booking.payment]}15`,
                          color: paymentColors[booking.payment],
                        }}
                      >
                        {paymentLabels[booking.payment]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Desktop Quick Actions (Preserved for Desktop >= 1024px) */}
        <div className="admin-desktop-view-only">
          <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-lg)' }}>Quick Actions</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 'var(--space-md)',
            }}
          >
            <Link
              href="/admin/bookings"
              className="card-static"
              style={{ padding: 'var(--space-lg)', textAlign: 'center', textDecoration: 'none', color: 'inherit' }}
            >
              <CalendarCheck size={28} style={{ color: 'var(--color-primary)', marginBottom: 'var(--space-sm)' }} />
              <h4 style={{ fontSize: '0.9375rem' }}>Manage Bookings</h4>
            </Link>
            <Link
              href="/admin/rooms"
              className="card-static"
              style={{ padding: 'var(--space-lg)', textAlign: 'center', textDecoration: 'none', color: 'inherit' }}
            >
              <Bed size={28} style={{ color: 'var(--color-primary)', marginBottom: 'var(--space-sm)' }} />
              <h4 style={{ fontSize: '0.9375rem' }}>Manage Rooms</h4>
            </Link>
            <Link
              href="/admin/restaurant"
              className="card-static"
              style={{ padding: 'var(--space-lg)', textAlign: 'center', textDecoration: 'none', color: 'inherit' }}
            >
              <Utensils size={28} style={{ color: 'var(--color-primary)', marginBottom: 'var(--space-sm)' }} />
              <h4 style={{ fontSize: '0.9375rem' }}>Manage Menu</h4>
            </Link>
            <Link
              href="/admin/settings"
              className="card-static"
              style={{ padding: 'var(--space-lg)', textAlign: 'center', textDecoration: 'none', color: 'inherit' }}
            >
              <Settings size={28} style={{ color: 'var(--color-primary)', marginBottom: 'var(--space-sm)' }} />
              <h4 style={{ fontSize: '0.9375rem' }}>Hotel Settings</h4>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
