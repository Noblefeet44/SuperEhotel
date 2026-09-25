'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CalendarCheck, Search, Filter, ChevronRight, Eye,
  MessageCircle, Check, X, ArrowLeft, Phone, Clock,
  CreditCard, CheckCircle2, AlertCircle, FileText, Image as ImageIcon,
  ExternalLink, UserCheck, ShieldCheck
} from 'lucide-react';
import { formatPrice, formatDate, generateWhatsAppURL } from '@/lib/utils';
import { AdminMobileNav } from '@/components/admin/AdminMobileNav';

const allBookings = [
  {
    id: '1',
    ref: 'SE-20260811-4521',
    guest: 'Amina Bello',
    phone: '08023456789',
    whatsapp: '08023456789',
    email: 'amina@email.com',
    room: 'Deluxe Room',
    checkIn: '2026-08-12',
    checkOut: '2026-08-14',
    guests: 2,
    status: 'new',
    payment: 'not_paid',
    amount: 80000,
    specialRequests: 'Late check-in, around 9pm',
    adminNotes: '',
    createdAt: '2026-08-11T14:30:00',
  },
  {
    id: '2',
    ref: 'SE-20260810-7834',
    guest: 'Chidi Okeke',
    phone: '07031234567',
    whatsapp: '07031234567',
    email: '',
    room: 'Executive Room',
    checkIn: '2026-08-11',
    checkOut: '2026-08-13',
    guests: 1,
    status: 'confirmed',
    payment: 'paid',
    amount: 120000,
    specialRequests: '',
    adminNotes: 'Business guest, needs early check-in',
    createdAt: '2026-08-10T10:15:00',
  },
  {
    id: '3',
    ref: 'SE-20260809-2156',
    guest: 'Fatima Abdullahi',
    phone: '08098765432',
    whatsapp: '08098765432',
    email: 'fatima@email.com',
    room: 'VIP Luxury Suite',
    checkIn: '2026-08-10',
    checkOut: '2026-08-12',
    guests: 3,
    status: 'checked_in',
    payment: 'paid',
    amount: 200000,
    specialRequests: 'Extra towels and pillows',
    adminNotes: 'VIP guest, suite 101',
    createdAt: '2026-08-09T08:45:00',
  },
  {
    id: '4',
    ref: 'SE-20260808-9362',
    guest: 'Emmanuel Nwosu',
    phone: '09045678901',
    whatsapp: '09045678901',
    email: 'emma@email.com',
    room: 'Standard Room',
    checkIn: '2026-08-08',
    checkOut: '2026-08-10',
    guests: 1,
    status: 'checked_out',
    payment: 'paid',
    amount: 50000,
    specialRequests: '',
    adminNotes: '',
    createdAt: '2026-08-07T16:20:00',
  },
  {
    id: '5',
    ref: 'SE-20260811-6743',
    guest: 'Grace Obi',
    phone: '08112233445',
    whatsapp: '08112233445',
    email: '',
    room: 'Standard Room',
    checkIn: '2026-08-15',
    checkOut: '2026-08-17',
    guests: 2,
    status: 'awaiting_confirmation',
    payment: 'not_paid',
    amount: 50000,
    specialRequests: 'Ground floor preferred',
    adminNotes: '',
    createdAt: '2026-08-11T09:00:00',
  },
];

const statusFilters = [
  { value: 'all', label: 'All' },
  { value: 'awaiting_confirmation', label: 'Awaiting Action' },
  { value: 'new', label: 'New' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'checked_in', label: 'Checked In' },
  { value: 'checked_out', label: 'Checked Out' },
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
  awaiting_confirmation: 'Awaiting Action',
  confirmed: 'Confirmed',
  checked_in: 'Checked In',
  checked_out: 'Checked Out',
  cancelled: 'Cancelled',
};

const paymentColors: Record<string, string> = {
  not_paid: '#DC2626',
  awaiting_payment: '#D97706',
  partially_paid: '#F59E0B',
  paid: '#16A34A',
  refunded: '#6B7280',
};

const paymentLabels: Record<string, string> = {
  not_paid: 'Not Paid',
  awaiting_payment: 'Awaiting',
  partially_paid: 'Partial',
  paid: 'Paid',
  refunded: 'Refunded',
};

interface AdminBookingItem {
  id: string;
  ref: string;
  guest: string;
  phone: string;
  whatsapp: string;
  email?: string;
  room: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: string;
  payment: string;
  amount: number;
  specialRequests?: string;
  adminNotes?: string;
  receiptImage?: string;
  receiptFileName?: string;
  createdAt: string;
}

export default function AdminBookingsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [bookingsList, setBookingsList] = useState<AdminBookingItem[]>(allBookings);
  const [selectedBooking, setSelectedBooking] = useState<AdminBookingItem | null>(null);
  const [receiptModalImage, setReceiptModalImage] = useState<string | null>(null);
  const [modalStatus, setModalStatus] = useState<string>('confirmed');
  const [modalPayment, setModalPayment] = useState<string>('paid');
  const [modalNotes, setModalNotes] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('admin_authenticated') !== 'true') {
      router.push('/admin/login');
    }
  }, [router]);

  useEffect(() => {
    async function fetchLiveBookings() {
      try {
        const res = await fetch('/api/bookings');
        const data = await res.json();
        if (data.success && Array.isArray(data.bookings) && data.bookings.length > 0) {
          const mapped: AdminBookingItem[] = data.bookings.map((b: any) => ({
            id: b.id,
            ref: b.ref,
            guest: b.guestName || b.guest,
            phone: b.phone,
            whatsapp: b.whatsapp || b.phone,
            email: b.email || '',
            room: b.roomName || b.room,
            checkIn: b.checkIn,
            checkOut: b.checkOut,
            guests: b.numGuests || b.guests || 1,
            status: b.status || 'awaiting_confirmation',
            payment: b.paymentStatus || 'paid',
            amount: b.totalAmount || b.amount || 0,
            specialRequests: b.specialRequests || '',
            adminNotes: b.adminNotes || '',
            receiptImage: b.receiptImage || '',
            receiptFileName: b.receiptFileName || '',
            createdAt: b.createdAt || new Date().toISOString(),
          }));

          const liveRefs = new Set(mapped.map((m) => m.ref));
          const remainingMock = allBookings.filter((mb) => !liveRefs.has(mb.ref));
          setBookingsList([...mapped, ...remainingMock]);
        }
      } catch (err) {
        console.warn('Live bookings fallback:', err);
      }
    }
    fetchLiveBookings();
  }, []);

  useEffect(() => {
    if (selectedBooking) {
      setModalStatus(selectedBooking.status);
      setModalPayment(selectedBooking.payment);
      setModalNotes(selectedBooking.adminNotes || '');
    }
  }, [selectedBooking]);

  const updateBookingStatusDirect = async (booking: AdminBookingItem, newStatus: string) => {
    setIsSaving(true);
    try {
      await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: booking.id, ref: booking.ref, status: newStatus }),
      });

      setBookingsList((prev) =>
        prev.map((b) => (b.id === booking.id ? { ...b, status: newStatus } : b))
      );

      if (selectedBooking?.id === booking.id) {
        setSelectedBooking((prev) => (prev ? { ...prev, status: newStatus } : null));
      }

      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 2200);
    } catch (err) {
      console.error('Update status error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!selectedBooking) return;
    setIsSaving(true);
    try {
      await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedBooking.id,
          ref: selectedBooking.ref,
          status: modalStatus,
          paymentStatus: modalPayment,
          adminNotes: modalNotes,
        }),
      });

      setBookingsList((prev) =>
        prev.map((b) =>
          b.id === selectedBooking.id
            ? { ...b, status: modalStatus, payment: modalPayment, adminNotes: modalNotes }
            : b
        )
      );

      setSelectedBooking(null);
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 2500);
    } catch (err) {
      console.error('Error saving changes:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredBookings = bookingsList.filter((b) => {
    const matchesFilter = filter === 'all' || b.status === filter;
    const matchesSearch =
      search === '' ||
      b.guest.toLowerCase().includes(search.toLowerCase()) ||
      b.ref.toLowerCase().includes(search.toLowerCase()) ||
      b.phone.includes(search);
    return matchesFilter && matchesSearch;
  });

  const countByStatus = (statusValue: string) => {
    if (statusValue === 'all') return bookingsList.length;
    return bookingsList.filter((b) => b.status === statusValue).length;
  };

  return (
    <div className="admin-layout" style={{ maxWidth: '100vw', overflowX: 'hidden', width: '100%', boxSizing: 'border-box' }}>
      <AdminMobileNav
        title="Bookings"
        subtitle={`${filteredBookings.length} reservations`}
        backHref="/admin"
      />

      {saveToast && (
        <div
          style={{
            position: 'fixed',
            top: '65px',
            right: '12px',
            zIndex: 99999,
            backgroundColor: '#16A34A',
            color: '#FFFFFF',
            padding: '0.5rem 0.85rem',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontWeight: 700,
            fontSize: '0.8rem',
          }}
        >
          <CheckCircle2 size={16} /> Saved successfully
        </div>
      )}

      {/* Desktop Sidebar (Only on desktop screens) */}
      <aside className="admin-sidebar" style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="admin-sidebar-header">
          <h2>Super E Hotel</h2>
          <span>Admin Dashboard</span>
        </div>
        <nav style={{ padding: 'var(--space-sm) 0', flex: 1 }}>
          <Link href="/admin" className="admin-nav-item">
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </Link>
          <div className="admin-nav-item active">
            <CalendarCheck size={20} />
            <span>Bookings</span>
          </div>
          <Link href="/admin/rooms" className="admin-nav-item">
            <span>Rooms &amp; Inventory</span>
          </Link>
          <Link href="/admin/media" className="admin-nav-item">
            <span>Media Library</span>
          </Link>
        </nav>
      </aside>

      <main className="admin-main" style={{ minWidth: 0, width: '100%', maxWidth: '100vw', overflowX: 'hidden', boxSizing: 'border-box' }}>
        {/* Header */}
        <div className="admin-header" style={{ marginBottom: '0.75rem', width: '100%', boxSizing: 'border-box' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.25rem' }}>Guest Bookings</h1>
            <p style={{ margin: '0.15rem 0 0', fontSize: '0.8rem', color: '#64748B' }}>
              Check reservations, verify guest payments, and update check-in status.
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="admin-mobile-filter-strip" style={{ width: '100%', boxSizing: 'border-box' }}>
          {statusFilters.map((f) => {
            const count = countByStatus(f.value);
            const isSelected = filter === f.value;
            return (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                type="button"
                className={`filter-pill-btn ${isSelected ? 'active' : ''}`}
              >
                <span>{f.label}</span>
                <span className={`pill-badge ${isSelected ? 'active' : ''}`}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', marginBottom: '0.85rem', width: '100%', boxSizing: 'border-box' }}>
          <Search
            size={17}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94A3B8',
            }}
          />
          <input
            type="text"
            className="input"
            placeholder="Search name, phone, or ref..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              paddingLeft: '38px',
              borderRadius: '10px',
              backgroundColor: '#FFFFFF',
              width: '100%',
              boxSizing: 'border-box',
              fontSize: '0.85rem',
            }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              type="button"
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* =========================================================
            MOBILE BOOKING CARDS (App View)
            ========================================================= */}
        <div className="admin-mobile-bookings-list" style={{ width: '100%', boxSizing: 'border-box' }}>
          {filteredBookings.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '2rem 1rem',
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                border: '1px solid #E2E8F0',
                color: '#64748B',
              }}
            >
              <CalendarCheck size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.4 }} />
              <h4 style={{ margin: '0 0 0.25rem', color: '#0F172A' }}>No Bookings Found</h4>
              <p style={{ margin: 0, fontSize: '0.78rem' }}>
                Try changing your search query or status filter.
              </p>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="admin-mobile-booking-card"
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  overflow: 'hidden',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '14px',
                  border: '1px solid #E2E8F0',
                  padding: '0.85rem',
                  marginBottom: '0.65rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.45rem' }}>
                  <div style={{ minWidth: 0, flex: 1, paddingRight: '0.5rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {booking.guest}
                    </h3>
                    <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: '#64748B', fontWeight: 600 }}>
                      {booking.ref}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <span style={{ fontSize: '1rem', fontWeight: 800, color: '#1E3A8A', display: 'block' }}>
                      {formatPrice(booking.amount)}
                    </span>
                    <span
                      style={{
                        fontSize: '0.64rem',
                        fontWeight: 700,
                        padding: '0.12rem 0.4rem',
                        borderRadius: '9999px',
                        display: 'inline-block',
                        background: `${statusColors[booking.status] || '#64748B'}18`,
                        color: statusColors[booking.status] || '#64748B',
                        marginTop: '2px',
                      }}
                    >
                      {statusLabels[booking.status] || booking.status}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '0.5rem 0.65rem',
                    marginBottom: '0.55rem',
                    fontSize: '0.76rem',
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                    <span style={{ fontWeight: 700, color: '#0F172A' }}>{booking.room}</span>
                    <span style={{ color: '#64748B' }}>{booking.guests} Guest{booking.guests > 1 ? 's' : ''}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569', fontSize: '0.72rem' }}>
                    <span>
                      📅 {new Date(booking.checkIn).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })} &rarr;{' '}
                      {new Date(booking.checkOut).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}
                    </span>
                    <span style={{ fontWeight: 700, color: paymentColors[booking.payment] || '#64748B' }}>
                      ● {paymentLabels[booking.payment] || booking.payment}
                    </span>
                  </div>
                </div>

                {booking.receiptImage && (
                  <button
                    onClick={() => setReceiptModalImage(booking.receiptImage!)}
                    type="button"
                    style={{
                      width: '100%',
                      padding: '0.45rem',
                      marginBottom: '0.55rem',
                      backgroundColor: '#F0FDF4',
                      border: '1px solid #BBF7D0',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px',
                      color: '#166534',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxSizing: 'border-box',
                    }}
                  >
                    <ImageIcon size={14} /> View Moniepoint Payment Receipt
                  </button>
                )}

                <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.45rem', width: '100%', boxSizing: 'border-box' }}>
                  <a
                    href={`https://wa.me/234${booking.phone.replace(/^0/, '')}?text=${encodeURIComponent(
                      `Hello ${booking.guest}! This is Super E Luxury Hotel regarding your reservation (${booking.ref}) for ${booking.room}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm"
                    style={{
                      flex: 1,
                      backgroundColor: '#DCFCE7',
                      color: '#166534',
                      border: '1px solid #BBF7D0',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      justifyContent: 'center',
                      padding: '0.45rem',
                      borderRadius: '8px',
                      boxSizing: 'border-box',
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
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      justifyContent: 'center',
                      padding: '0.45rem',
                      borderRadius: '8px',
                      boxSizing: 'border-box',
                    }}
                  >
                    <Phone size={14} /> Call
                  </a>

                  <button
                    onClick={() => setSelectedBooking(booking)}
                    type="button"
                    className="btn btn-sm"
                    style={{
                      backgroundColor: '#F1F5F9',
                      color: '#334155',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      padding: '0.45rem 0.65rem',
                      borderRadius: '8px',
                      boxSizing: 'border-box',
                    }}
                  >
                    Manage
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '0.35rem', paddingTop: '0.35rem', borderTop: '1px solid #F1F5F9', width: '100%', boxSizing: 'border-box' }}>
                  {booking.status !== 'confirmed' && (
                    <button
                      onClick={() => updateBookingStatusDirect(booking, 'confirmed')}
                      type="button"
                      disabled={isSaving}
                      style={{
                        flex: 1,
                        padding: '0.35rem',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        backgroundColor: '#F0FDF4',
                        color: '#16A34A',
                        border: '1px solid #BBF7D0',
                        borderRadius: '6px',
                        cursor: 'pointer',
                      }}
                    >
                      ✓ Confirm
                    </button>
                  )}
                  {booking.status === 'confirmed' && (
                    <button
                      onClick={() => updateBookingStatusDirect(booking, 'checked_in')}
                      type="button"
                      disabled={isSaving}
                      style={{
                        flex: 1,
                        padding: '0.35rem',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        backgroundColor: '#FAF5FF',
                        color: '#7C3AED',
                        border: '1px solid #DDD6FE',
                        borderRadius: '6px',
                        cursor: 'pointer',
                      }}
                    >
                      🏨 Check In
                    </button>
                  )}
                  {booking.status === 'checked_in' && (
                    <button
                      onClick={() => updateBookingStatusDirect(booking, 'checked_out')}
                      type="button"
                      disabled={isSaving}
                      style={{
                        flex: 1,
                        padding: '0.35rem',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        backgroundColor: '#F1F5F9',
                        color: '#475569',
                        border: '1px solid #E2E8F0',
                        borderRadius: '6px',
                        cursor: 'pointer',
                      }}
                    >
                      👋 Check Out
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* =========================================================
            DESKTOP BOOKINGS TABLE (Desktop >= 1024px ONLY)
            ========================================================= */}
        <div className="admin-desktop-view-only" style={{ overflowX: 'auto', width: '100%' }}>
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id}>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.8125rem', fontWeight: 600 }}>
                      {booking.ref}
                    </span>
                  </td>
                  <td>
                    <div>
                      <strong>{booking.guest}</strong>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                        {booking.phone}
                      </div>
                    </div>
                  </td>
                  <td>{booking.room}</td>
                  <td style={{ fontSize: '0.875rem', whiteSpace: 'nowrap' }}>{formatDate(booking.checkIn)}</td>
                  <td style={{ fontSize: '0.875rem', whiteSpace: 'nowrap' }}>{formatDate(booking.checkOut)}</td>
                  <td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{formatPrice(booking.amount)}</td>
                  <td>
                    <span
                      className="badge"
                      style={{
                        background: `${statusColors[booking.status]}15`,
                        color: statusColors[booking.status],
                      }}
                    >
                      {statusLabels[booking.status] || booking.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span
                        className="badge"
                        style={{
                          background: `${paymentColors[booking.payment]}15`,
                          color: paymentColors[booking.payment],
                        }}
                      >
                        {paymentLabels[booking.payment] || booking.payment}
                      </span>
                      {booking.receiptImage && (
                        <button
                          onClick={() => setReceiptModalImage(booking.receiptImage!)}
                          type="button"
                          style={{
                            fontSize: '0.7rem',
                            color: 'var(--color-success)',
                            fontWeight: 600,
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            textAlign: 'left',
                            padding: 0,
                          }}
                        >
                          ✓ View Receipt
                        </button>
                      )}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="btn btn-ghost btn-sm"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <a
                        href={generateWhatsAppURL(
                          booking.whatsapp,
                          `Hello ${booking.guest}! Regarding your booking ${booking.ref} at Super E Luxury Hotel...`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-ghost btn-sm"
                        title="WhatsApp guest"
                      >
                        <MessageCircle size={16} style={{ color: 'var(--color-whatsapp-dark)' }} />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal: Receipt Image Viewer */}
        {receiptModalImage && (
          <div
            className="mobile-menu-overlay"
            onClick={() => setReceiptModalImage(null)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.85)',
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
              boxSizing: 'border-box',
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                maxWidth: '480px',
                width: '100%',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                boxSizing: 'border-box',
              }}
            >
              <div
                style={{
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid #E2E8F0',
                  background: '#F8FAFC',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={18} style={{ color: '#16A34A' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>
                    Payment Proof Receipt
                  </span>
                </div>
                <button
                  onClick={() => setReceiptModalImage(null)}
                  type="button"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ padding: '0.75rem', maxHeight: '65vh', overflowY: 'auto', textAlign: 'center', background: '#0F172A' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={receiptModalImage}
                  alt="Payment Receipt"
                  style={{ maxHeight: '60vh', maxWidth: '100%', objectFit: 'contain', borderRadius: '6px' }}
                />
              </div>

              <div style={{ padding: '0.75rem 1rem', display: 'flex', gap: '0.5rem', background: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>
                <a
                  href={receiptModalImage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <ExternalLink size={14} /> Open Full Size
                </a>
                <button
                  onClick={() => setReceiptModalImage(null)}
                  type="button"
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1 }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Booking Details & Status Edit */}
        {selectedBooking && (
          <>
            <div className="mobile-menu-overlay" onClick={() => setSelectedBooking(null)} />
            <div
              className="admin-edit-modal-sheet"
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 'min(560px, 94vw)',
                maxHeight: '88vh',
                overflowY: 'auto',
                background: '#FFFFFF',
                borderRadius: '18px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
                zIndex: 9999,
                padding: '1.15rem',
                boxSizing: 'border-box',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.65rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.15rem', margin: 0, fontWeight: 800, color: '#0F172A' }}>
                    Manage Reservation
                  </h2>
                  <p style={{ fontFamily: 'monospace', margin: '2px 0 0', color: '#64748B', fontSize: '0.76rem' }}>
                    {selectedBooking.ref}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="btn btn-ghost btn-icon"
                  type="button"
                >
                  <X size={20} />
                </button>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                  gap: '0.65rem',
                  marginBottom: '0.85rem',
                  backgroundColor: '#F8FAFC',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: '1px solid #E2E8F0',
                  boxSizing: 'border-box',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.68rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                    Guest Name
                  </span>
                  <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0F172A' }}>{selectedBooking.guest}</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.68rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                    Phone
                  </span>
                  <a href={`tel:${selectedBooking.phone}`} style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1E3A8A' }}>
                    {selectedBooking.phone}
                  </a>
                </div>
                <div>
                  <span style={{ fontSize: '0.68rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                    Room
                  </span>
                  <span style={{ fontWeight: 700, fontSize: '0.84rem' }}>{selectedBooking.room}</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.68rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                    Amount
                  </span>
                  <span style={{ fontWeight: 800, color: '#16A34A', fontSize: '1rem' }}>
                    {formatPrice(selectedBooking.amount)}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '0.68rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                    Check-in
                  </span>
                  <span style={{ fontWeight: 600, fontSize: '0.78rem' }}>{formatDate(selectedBooking.checkIn)}</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.68rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                    Check-out
                  </span>
                  <span style={{ fontWeight: 600, fontSize: '0.78rem' }}>{formatDate(selectedBooking.checkOut)}</span>
                </div>
              </div>

              {selectedBooking.specialRequests && (
                <div style={{ marginBottom: '0.85rem', padding: '0.55rem', backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.68rem', color: '#92400E', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>
                    Guest Special Requests:
                  </span>
                  <p style={{ margin: '0.15rem 0 0', fontSize: '0.78rem', color: '#78350F' }}>
                    {selectedBooking.specialRequests}
                  </p>
                </div>
              )}

              {/* Status Controls */}
              <div
                style={{
                  borderTop: '1px solid #F1F5F9',
                  paddingTop: '0.75rem',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                  gap: '0.55rem',
                  marginBottom: '0.75rem',
                  boxSizing: 'border-box',
                }}
              >
                <div>
                  <label className="label" style={{ fontSize: '0.74rem', fontWeight: 700 }}>
                    Booking Status
                  </label>
                  <select
                    className="input"
                    value={modalStatus}
                    onChange={(e) => setModalStatus(e.target.value)}
                    style={{ fontSize: '0.78rem', padding: '0.45rem', width: '100%', boxSizing: 'border-box' }}
                  >
                    <option value="new">New</option>
                    <option value="awaiting_confirmation">Awaiting Confirmation</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="checked_in">Checked In</option>
                    <option value="checked_out">Checked Out</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="label" style={{ fontSize: '0.74rem', fontWeight: 700 }}>
                    Payment Status
                  </label>
                  <select
                    className="input"
                    value={modalPayment}
                    onChange={(e) => setModalPayment(e.target.value)}
                    style={{ fontSize: '0.78rem', padding: '0.45rem', width: '100%', boxSizing: 'border-box' }}
                  >
                    <option value="not_paid">Not Paid</option>
                    <option value="awaiting_payment">Awaiting Payment</option>
                    <option value="partially_paid">Partially Paid</option>
                    <option value="paid">Paid</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '0.85rem' }}>
                <label className="label" style={{ fontSize: '0.74rem', fontWeight: 700 }}>
                  Admin Notes
                </label>
                <textarea
                  className="input"
                  rows={2}
                  value={modalNotes}
                  onChange={(e) => setModalNotes(e.target.value)}
                  placeholder="Notes about guest stay..."
                  style={{ fontSize: '0.78rem', borderRadius: '8px', width: '100%', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', width: '100%', boxSizing: 'border-box' }}>
                <button
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                  type="button"
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <Check size={15} /> {isSaving ? 'Saving...' : 'Save Changes'}
                </button>

                <a
                  href={generateWhatsAppURL(
                    selectedBooking.whatsapp,
                    `Hello ${selectedBooking.guest}! Regarding your booking ${selectedBooking.ref} at Super E Luxury Hotel...`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp btn-sm"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <MessageCircle size={15} /> WhatsApp
                </a>

                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setSelectedBooking(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
