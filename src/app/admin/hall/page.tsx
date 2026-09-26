'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles, ArrowLeft, Plus, Edit2, Trash2, Check,
  Calendar, Clock, Users, Phone, MessageCircle,
  CheckCircle2, XCircle, AlertCircle, Save, X, Search,
  CalendarCheck, Tag, Filter, MapPin
} from 'lucide-react';
import { formatPrice, generateWhatsAppURL } from '@/lib/utils';
import { AdminMobileNav } from '@/components/admin/AdminMobileNav';
import { HALL_PACKAGES, HallPackage } from '@/lib/hall-data';

export interface HallBooking {
  id: string;
  createdAt: string;
  fullName: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  eventType: string;
  eventDate: string;
  timeSlot: string;
  guestCount: string;
  packageId: string;
  packageName: string;
  packagePrice: number;
  addons: string[];
  specialNotes?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  depositPaid?: number;
}

const initialHallBookings: HallBooking[] = [
  {
    id: 'SE-HALL-8421',
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    fullName: 'Dr. Fatima Abdullahi',
    phone: '08034567890',
    whatsapp: '08034567890',
    email: 'dr.fatima@nsuk.edu.ng',
    eventType: 'Conference / Seminar / Workshop',
    eventDate: '2026-10-18',
    timeSlot: 'Full Day (8:00 AM – 8:00 PM)',
    guestCount: '300 – 500 Guests (Auditorium Fit)',
    packageId: 'full-day-wedding',
    packageName: 'Grand Wedding & Banquet Package',
    packagePrice: 280000,
    addons: [
      'High-Output PA Sound System & Wireless Mics',
      'Industrial Air Conditioning Guarantee',
      'Projector & Large Presentation Screen',
    ],
    specialNotes: 'Faculty of Medicine Annual Symposium. Needs podium and wired mic backup.',
    status: 'confirmed',
    depositPaid: 200000,
  },
  {
    id: 'SE-HALL-7193',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    fullName: 'Engr. Kenneth & Blessing Okorie',
    phone: '08123456789',
    whatsapp: '08123456789',
    email: 'k.okorie@apexgroup.ng',
    eventType: 'Wedding Reception',
    eventDate: '2026-11-07',
    timeSlot: 'Full Day (8:00 AM – 8:00 PM)',
    guestCount: '200 – 300 Guests (Banquet Fit)',
    packageId: 'full-day-wedding',
    packageName: 'Grand Wedding & Banquet Package',
    packagePrice: 280000,
    addons: [
      'Stage Mood & Event Lighting Package',
      'VIP Bridal / Speaker Dressing Room',
      'Discounted Overnight Hotel Room Block',
    ],
    specialNotes: 'Bridal party requires early morning access by 7:30 AM for decorators.',
    status: 'confirmed',
    depositPaid: 280000,
  },
  {
    id: 'SE-HALL-6240',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    fullName: 'Alhaji Musa Garba',
    phone: '07031122334',
    whatsapp: '07031122334',
    email: 'musa.garba@kffgov.ng',
    eventType: 'Annual General Meeting (AGM)',
    eventDate: '2026-10-25',
    timeSlot: 'Morning Session (8:00 AM – 1:00 PM)',
    guestCount: '100 – 200 Guests',
    packageId: 'half-day-seminar',
    packageName: 'Corporate Half-Day Session',
    packagePrice: 150000,
    addons: [
      'High-Output PA Sound System & Wireless Mics',
      'Industrial Air Conditioning Guarantee',
    ],
    specialNotes: 'Needs 150 banquet chairs set in classroom style.',
    status: 'pending',
    depositPaid: 0,
  },
];

export default function AdminHallPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'bookings' | 'packages' | 'calendar'>('bookings');
  const [bookings, setBookings] = useState<HallBooking[]>(initialHallBookings);
  const [packages, setPackages] = useState<HallPackage[]>(HALL_PACKAGES);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [editingBooking, setEditingBooking] = useState<HallBooking | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<HallPackage | null>(null);

  // New Booking Form State
  const [newBooking, setNewBooking] = useState({
    fullName: '',
    phone: '',
    whatsapp: '',
    email: '',
    eventType: 'Wedding Reception',
    eventDate: '',
    timeSlot: 'Full Day (8:00 AM – 8:00 PM)',
    guestCount: '200 – 300 Guests',
    packageId: 'full-day-wedding',
    packagePrice: 280000,
    depositPaid: 0,
    specialNotes: '',
    status: 'confirmed' as const,
  });

  // Auth check & load data
  useEffect(() => {
    if (sessionStorage.getItem('admin_authenticated') !== 'true') {
      router.push('/admin/login');
      return;
    }

    try {
      const storedBookings = localStorage.getItem('super_e_hall_bookings');
      if (storedBookings) {
        const parsed = JSON.parse(storedBookings);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBookings(parsed);
        }
      } else {
        localStorage.setItem('super_e_hall_bookings', JSON.stringify(initialHallBookings));
      }

      const storedPackages = localStorage.getItem('super_e_hall_packages');
      if (storedPackages) {
        const parsedPkg = JSON.parse(storedPackages);
        if (Array.isArray(parsedPkg) && parsedPkg.length > 0) {
          setPackages(parsedPkg);
        }
      }
    } catch {
      // Fallback
    }
  }, [router]);

  // Persist bookings
  const saveBookingsList = (newList: HallBooking[]) => {
    setBookings(newList);
    try {
      localStorage.setItem('super_e_hall_bookings', JSON.stringify(newList));
    } catch {}
  };

  // Persist packages
  const savePackagesList = (newList: HallPackage[]) => {
    setPackages(newList);
    try {
      localStorage.setItem('super_e_hall_packages', JSON.stringify(newList));
    } catch {}
  };

  const handleStatusChange = (id: string, newStatus: HallBooking['status']) => {
    const updated = bookings.map((b) => (b.id === id ? { ...b, status: newStatus } : b));
    saveBookingsList(updated);
  };

  const handleDeleteBooking = (id: string) => {
    if (confirm('Are you sure you want to delete this hall booking record?')) {
      const updated = bookings.filter((b) => b.id !== id);
      saveBookingsList(updated);
    }
  };

  const handleAddBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBooking.fullName.trim() || !newBooking.phone.trim() || !newBooking.eventDate) {
      alert('Please fill in client name, phone number, and event date.');
      return;
    }

    const ref = `SE-HALL-${Math.floor(1000 + Math.random() * 9000)}`;
    const pkg = packages.find((p) => p.id === newBooking.packageId) || packages[1];

    const record: HallBooking = {
      id: ref,
      createdAt: new Date().toISOString(),
      fullName: newBooking.fullName.trim(),
      phone: newBooking.phone.trim(),
      whatsapp: newBooking.whatsapp.trim() || newBooking.phone.trim(),
      email: newBooking.email.trim(),
      eventType: newBooking.eventType,
      eventDate: newBooking.eventDate,
      timeSlot: newBooking.timeSlot,
      guestCount: newBooking.guestCount,
      packageId: pkg.id,
      packageName: pkg.name,
      packagePrice: pkg.price,
      addons: ['Standard Hall Facilities'],
      specialNotes: newBooking.specialNotes.trim(),
      status: newBooking.status,
      depositPaid: Number(newBooking.depositPaid) || 0,
    };

    saveBookingsList([record, ...bookings]);
    setIsAddModalOpen(false);
    setNewBooking({
      fullName: '',
      phone: '',
      whatsapp: '',
      email: '',
      eventType: 'Wedding Reception',
      eventDate: '',
      timeSlot: 'Full Day (8:00 AM – 8:00 PM)',
      guestCount: '200 – 300 Guests',
      packageId: 'full-day-wedding',
      packagePrice: 280000,
      depositPaid: 0,
      specialNotes: '',
      status: 'confirmed',
    });
  };

  // Filtered bookings
  const filteredBookings = bookings.filter((b) => {
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchSearch =
      b.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.phone.includes(searchQuery) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.eventType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.eventDate.includes(searchQuery);
    return matchStatus && matchSearch;
  });

  // Stats
  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;
  const pendingCount = bookings.filter((b) => b.status === 'pending').length;
  const totalRevenue = bookings
    .filter((b) => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => sum + b.packagePrice, 0);

  return (
    <div className="admin-layout" style={{ maxWidth: '100vw', overflowX: 'hidden', width: '100%', boxSizing: 'border-box' }}>
      {/* Mobile Top Navigation */}
      <AdminMobileNav
        title="Hall Bookings"
        subtitle={`${bookings.length} reservations & inquiries`}
        backHref="/admin"
        actionButton={
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn btn-primary btn-sm"
            style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
          >
            <Plus size={14} /> Add Booking
          </button>
        }
      />

      {/* Desktop Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Super E Hotel</h2>
          <span>Admin Dashboard</span>
        </div>
        <nav style={{ padding: 'var(--space-sm) 0' }}>
          <Link href="/admin" className="admin-nav-item">
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </Link>
          <div className="admin-nav-item active">
            <Sparkles size={20} />
            <span>Hall Bookings</span>
          </div>
          <Link href="/admin/rooms" className="admin-nav-item">
            <span>Rooms &amp; Inventory</span>
          </Link>
          <Link href="/admin/restaurant" className="admin-nav-item">
            <span>Restaurant &amp; Bar</span>
          </Link>
          <Link href="/admin/bookings" className="admin-nav-item">
            <span>Guest Room Bookings</span>
          </Link>
        </nav>
      </aside>

      <main className="admin-main" style={{ minWidth: 0, width: '100%', maxWidth: '100vw', overflowX: 'hidden', boxSizing: 'border-box' }}>
        {/* Top Header */}
        <div
          className="admin-header"
          style={{
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>Event &amp; Banquet Hall Manager</h1>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: '#64748B' }}>
              Manage event date reservations, client inquiries, calendar availability, and hall package rates.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setIsAddModalOpen(true)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
            >
              <Plus size={16} /> New Hall Reservation
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ backgroundColor: '#FFFFFF', padding: '1rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
              Confirmed Events
            </span>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#16A34A', marginTop: '0.25rem' }}>
              {confirmedCount}
            </div>
            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Locked on calendar</span>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', padding: '1rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
              Pending Inquiries
            </span>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#D97706', marginTop: '0.25rem' }}>
              {pendingCount}
            </div>
            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Awaiting deposit</span>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', padding: '1rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
              Booked Hall Revenue
            </span>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#1E3A8A', marginTop: '0.25rem' }}>
              {formatPrice(totalRevenue)}
            </div>
            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Confirmed &amp; completed</span>
          </div>
        </div>

        {/* Tab Selector */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            borderBottom: '1px solid #E2E8F0',
            marginBottom: '1.25rem',
            paddingBottom: '0.25rem',
          }}
        >
          <button
            onClick={() => setActiveTab('bookings')}
            style={{
              padding: '0.6rem 1.1rem',
              fontWeight: 700,
              fontSize: '0.88rem',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === 'bookings' ? '#1E3A8A' : 'transparent',
              color: activeTab === 'bookings' ? '#FFFFFF' : '#64748B',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <CalendarCheck size={16} /> Reservations &amp; Inquiries ({bookings.length})
          </button>

          <button
            onClick={() => setActiveTab('packages')}
            style={{
              padding: '0.6rem 1.1rem',
              fontWeight: 700,
              fontSize: '0.88rem',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === 'packages' ? '#1E3A8A' : 'transparent',
              color: activeTab === 'packages' ? '#FFFFFF' : '#64748B',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Tag size={16} /> Hall Packages &amp; Rates ({packages.length})
          </button>
        </div>

        {/* TAB 1: RESERVATIONS */}
        {activeTab === 'bookings' && (
          <div>
            {/* Filter and Search Bar */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                padding: '0.85rem 1rem',
                marginBottom: '1rem',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.75rem',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ position: 'relative', flex: '1 1 260px' }}>
                <Search
                  size={16}
                  style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}
                />
                <input
                  type="text"
                  className="input"
                  placeholder="Search by client name, ref code, or date..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: '2.2rem', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Filter size={16} style={{ color: '#64748B' }} />
                <select
                  className="input"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ width: 'auto', fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}
                >
                  <option value="all">All Statuses</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending Inquiry</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Bookings List Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {filteredBookings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <Calendar size={40} style={{ color: '#CBD5E1', margin: '0 auto 0.75rem' }} />
                  <h4 style={{ margin: 0, color: '#1E293B' }}>No reservations found</h4>
                  <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', color: '#64748B' }}>
                    Try changing your search keywords or filter.
                  </p>
                </div>
              ) : (
                filteredBookings.map((b) => (
                  <div
                    key={b.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '14px',
                      border: '1px solid #E2E8F0',
                      padding: '1.25rem',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.85rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.2rem' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#D97706', backgroundColor: '#FEF3C7', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                            {b.id}
                          </span>
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              padding: '0.15rem 0.5rem',
                              borderRadius: '9999px',
                              textTransform: 'uppercase',
                              backgroundColor:
                                b.status === 'confirmed'
                                  ? '#DCFCE7'
                                  : b.status === 'pending'
                                  ? '#FEF3C7'
                                  : b.status === 'completed'
                                  ? '#E0E7FF'
                                  : '#FEE2E2',
                              color:
                                b.status === 'confirmed'
                                  ? '#166534'
                                  : b.status === 'pending'
                                  ? '#92400E'
                                  : b.status === 'completed'
                                  ? '#3730A3'
                                  : '#991B1B',
                            }}
                          >
                            {b.status}
                          </span>
                        </div>
                        <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
                          {b.fullName}
                        </h3>
                        <span style={{ fontSize: '0.85rem', color: '#64748B' }}>{b.eventType}</span>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1E3A8A', display: 'block' }}>
                          {formatPrice(b.packagePrice)}
                        </span>
                        <span style={{ fontSize: '0.78rem', color: '#16A34A', fontWeight: 700 }}>
                          Deposit Paid: {formatPrice(b.depositPaid || 0)}
                        </span>
                      </div>
                    </div>

                    {/* Booking Details Grid */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '0.75rem',
                        backgroundColor: '#F8FAFC',
                        padding: '0.85rem',
                        borderRadius: '10px',
                        marginBottom: '0.85rem',
                        fontSize: '0.84rem',
                      }}
                    >
                      <div>
                        <strong style={{ color: '#475569', display: 'block', fontSize: '0.75rem' }}>EVENT DATE &amp; TIME:</strong>
                        <span style={{ color: '#0F172A', fontWeight: 700 }}>
                          📅 {b.eventDate} ({b.timeSlot})
                        </span>
                      </div>
                      <div>
                        <strong style={{ color: '#475569', display: 'block', fontSize: '0.75rem' }}>GUEST CAPACITY:</strong>
                        <span style={{ color: '#0F172A', fontWeight: 700 }}>👥 {b.guestCount}</span>
                      </div>
                      <div>
                        <strong style={{ color: '#475569', display: 'block', fontSize: '0.75rem' }}>PHONE / WHATSAPP:</strong>
                        <span style={{ color: '#0F172A', fontWeight: 700 }}>📞 {b.phone}</span>
                      </div>
                      <div>
                        <strong style={{ color: '#475569', display: 'block', fontSize: '0.75rem' }}>PACKAGE:</strong>
                        <span style={{ color: '#0F172A', fontWeight: 700 }}>📦 {b.packageName}</span>
                      </div>
                    </div>

                    {b.specialNotes && (
                      <p style={{ margin: '0 0 0.85rem', fontSize: '0.84rem', color: '#64748B', fontStyle: 'italic' }}>
                        Note: &ldquo;{b.specialNotes}&rdquo;
                      </p>
                    )}

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', paddingTop: '0.65rem', borderTop: '1px solid #F1F5F9' }}>
                      {/* Status Selector Dropdown */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Status:</span>
                        <select
                          className="input"
                          value={b.status}
                          onChange={(e: any) => handleStatusChange(b.id, e.target.value)}
                          style={{ fontSize: '0.78rem', padding: '0.25rem 0.5rem', width: 'auto' }}
                        >
                          <option value="pending">Pending Inquiry</option>
                          <option value="confirmed">Confirmed (Date Locked)</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <a
                          href={generateWhatsAppURL(
                            b.whatsapp || b.phone,
                            `Hello ${b.fullName}, regarding your event hall inquiry (${b.id}) for ${b.eventDate} at Super E Luxury Hotel...`
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-whatsapp btn-sm"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          <MessageCircle size={14} /> WhatsApp Client
                        </a>

                        <button
                          onClick={() => handleDeleteBooking(b.id)}
                          className="btn btn-ghost btn-sm"
                          style={{ color: 'var(--color-destructive)', padding: '0.35rem 0.5rem' }}
                          title="Delete booking record"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 2: PACKAGES */}
        {activeTab === 'packages' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
                      {pkg.name}
                    </h3>
                    {pkg.badge && (
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px', backgroundColor: '#FEF3C7', color: '#B45309' }}>
                        {pkg.badge}
                      </span>
                    )}
                  </div>
                  <p style={{ margin: '0 0 1rem', fontSize: '0.82rem', color: '#64748B' }}>{pkg.tagline}</p>

                  <div style={{ marginBottom: '1rem', paddingBottom: '0.85rem', borderBottom: '1px solid #F1F5F9' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1E3A8A' }}>
                      {formatPrice(pkg.price)}
                    </span>
                    <span style={{ display: 'block', fontSize: '0.78rem', color: '#64748B', marginTop: '0.15rem' }}>
                      ⏱ {pkg.duration}
                    </span>
                  </div>

                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {pkg.features.map((f, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '0.82rem', color: '#334155' }}>
                        <Check size={14} style={{ color: '#16A34A', marginTop: '2px', flexShrink: 0 }} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ marginTop: '1.25rem', paddingTop: '0.85rem', borderTop: '1px solid #F1F5F9' }}>
                  <button
                    onClick={() => setEditingPackage({ ...pkg })}
                    className="btn btn-secondary btn-sm"
                    style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Edit2 size={14} /> Edit Package &amp; Rate
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* MODAL: ADD OFFLINE BOOKING */}
      {isAddModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '560px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: '1rem 1.25rem',
                borderBottom: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#F8FAFC',
              }}
            >
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>
                Add In-Person / Offline Hall Reservation
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddBookingSubmit} style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <label className="label" style={{ fontWeight: 700, marginBottom: '0.25rem', display: 'block' }}>
                    Client / Organization Name *
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={newBooking.fullName}
                    onChange={(e) => setNewBooking({ ...newBooking, fullName: e.target.value })}
                    placeholder="e.g. Pastor David John / Nasarawa Youth Forum"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label className="label" style={{ fontWeight: 700, marginBottom: '0.25rem', display: 'block' }}>
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      className="input"
                      value={newBooking.phone}
                      onChange={(e) => setNewBooking({ ...newBooking, phone: e.target.value })}
                      placeholder="080..."
                      required
                    />
                  </div>
                  <div>
                    <label className="label" style={{ fontWeight: 700, marginBottom: '0.25rem', display: 'block' }}>
                      WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      className="input"
                      value={newBooking.whatsapp}
                      onChange={(e) => setNewBooking({ ...newBooking, whatsapp: e.target.value })}
                      placeholder="080..."
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label className="label" style={{ fontWeight: 700, marginBottom: '0.25rem', display: 'block' }}>
                      Event Type
                    </label>
                    <select
                      className="input"
                      value={newBooking.eventType}
                      onChange={(e) => setNewBooking({ ...newBooking, eventType: e.target.value })}
                    >
                      <option value="Wedding Reception">Wedding Reception</option>
                      <option value="Conference / Seminar / Workshop">Conference / Seminar</option>
                      <option value="Annual General Meeting (AGM)">Annual General Meeting</option>
                      <option value="Birthday Banquet / Anniversary">Birthday Banquet</option>
                      <option value="Church Summit / Religious Program">Church Summit</option>
                      <option value="Other Social Gathering">Other Social Gathering</option>
                    </select>
                  </div>

                  <div>
                    <label className="label" style={{ fontWeight: 700, marginBottom: '0.25rem', display: 'block' }}>
                      Event Date *
                    </label>
                    <input
                      type="date"
                      className="input"
                      value={newBooking.eventDate}
                      onChange={(e) => setNewBooking({ ...newBooking, eventDate: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label className="label" style={{ fontWeight: 700, marginBottom: '0.25rem', display: 'block' }}>
                      Package
                    </label>
                    <select
                      className="input"
                      value={newBooking.packageId}
                      onChange={(e) => {
                        const sel = packages.find((p) => p.id === e.target.value);
                        setNewBooking({
                          ...newBooking,
                          packageId: e.target.value,
                          packagePrice: sel ? sel.price : 280000,
                        });
                      }}
                    >
                      {packages.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({formatPrice(p.price)})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="label" style={{ fontWeight: 700, marginBottom: '0.25rem', display: 'block' }}>
                      Deposit Paid (₦)
                    </label>
                    <input
                      type="number"
                      className="input"
                      value={newBooking.depositPaid || ''}
                      onChange={(e) => setNewBooking({ ...newBooking, depositPaid: Number(e.target.value) || 0 })}
                      placeholder="e.g. 100000"
                    />
                  </div>
                </div>

                <div>
                  <label className="label" style={{ fontWeight: 700, marginBottom: '0.25rem', display: 'block' }}>
                    Notes / Layout Requests
                  </label>
                  <textarea
                    className="input"
                    rows={2}
                    value={newBooking.specialNotes}
                    onChange={(e) => setNewBooking({ ...newBooking, specialNotes: e.target.value })}
                    placeholder="e.g. Paid via POS at front desk..."
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid #E2E8F0' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Save size={16} /> Save Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT PACKAGE */}
      {editingPackage && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setEditingPackage(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '480px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: '1rem 1.25rem',
                borderBottom: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#F8FAFC',
              }}
            >
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>
                Edit Hall Package Rate
              </h3>
              <button
                onClick={() => setEditingPackage(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!editingPackage) return;
                const updated = packages.map((p) => (p.id === editingPackage.id ? editingPackage : p));
                savePackagesList(updated);
                setEditingPackage(null);
              }}
              style={{ padding: '1.25rem' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <label className="label" style={{ fontWeight: 700, marginBottom: '0.25rem', display: 'block' }}>
                    Package Name
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={editingPackage.name}
                    onChange={(e) => setEditingPackage({ ...editingPackage, name: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label className="label" style={{ fontWeight: 700, marginBottom: '0.25rem', display: 'block' }}>
                      Price (₦)
                    </label>
                    <input
                      type="number"
                      className="input"
                      value={editingPackage.price}
                      onChange={(e) => setEditingPackage({ ...editingPackage, price: Number(e.target.value) || 0 })}
                      required
                    />
                  </div>

                  <div>
                    <label className="label" style={{ fontWeight: 700, marginBottom: '0.25rem', display: 'block' }}>
                      Duration
                    </label>
                    <input
                      type="text"
                      className="input"
                      value={editingPackage.duration}
                      onChange={(e) => setEditingPackage({ ...editingPackage, duration: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="label" style={{ fontWeight: 700, marginBottom: '0.25rem', display: 'block' }}>
                    Tagline
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={editingPackage.tagline}
                    onChange={(e) => setEditingPackage({ ...editingPackage, tagline: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid #E2E8F0' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setEditingPackage(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Save size={16} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
