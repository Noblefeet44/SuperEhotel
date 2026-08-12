'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CalendarCheck, Search, Filter, ChevronRight, Eye,
  MessageCircle, Check, X, ArrowLeft
} from 'lucide-react';
import { formatPrice, formatDate, generateWhatsAppURL } from '@/lib/utils';

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
    createdAt: '2026-08-11T11:00:00',
  },
];

const statusFilters = [
  { value: 'all', label: 'All Bookings' },
  { value: 'new', label: 'New' },
  { value: 'awaiting_confirmation', label: 'Awaiting' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'checked_in', label: 'Checked In' },
  { value: 'checked_out', label: 'Checked Out' },
  { value: 'cancelled', label: 'Cancelled' },
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
  awaiting_confirmation: 'Awaiting Confirmation',
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
  awaiting_payment: 'Awaiting Payment',
  partially_paid: 'Partially Paid',
  paid: 'Paid',
  refunded: 'Refunded',
};

export default function AdminBookingsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<typeof allBookings[0] | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem('admin_authenticated') !== 'true') {
      router.push('/admin/login');
    }
  }, [router]);

  const filteredBookings = allBookings.filter((b) => {
    const matchesFilter = filter === 'all' || b.status === filter;
    const matchesSearch = search === '' ||
      b.guest.toLowerCase().includes(search.toLowerCase()) ||
      b.ref.toLowerCase().includes(search.toLowerCase()) ||
      b.phone.includes(search);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="admin-layout">
      {/* Simplified sidebar for sub-pages - just a back link */}
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
        </nav>
      </aside>

      <main className="admin-main">
        {/* Header */}
        <div className="admin-header">
          <h1>Booking Management</h1>
          <span style={{ color: 'var(--color-text-secondary)' }}>
            {filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1 1 300px' }}>
            <Search size={18} style={{
              position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
              color: 'var(--color-text-muted)',
            }} />
            <input
              type="text"
              className="input"
              placeholder="Search by guest name, reference, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '40px' }}
            />
          </div>
          <select
            className="input"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ width: 'auto', minWidth: '160px' }}
          >
            {statusFilters.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>

        {/* Bookings Table */}
        <div style={{ overflowX: 'auto' }}>
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
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: 'var(--space-2xl)', color: 'var(--color-text-muted)' }}>
                    No bookings found
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
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
                      <span className="badge" style={{
                        background: `${statusColors[booking.status]}15`,
                        color: statusColors[booking.status],
                      }}>
                        {statusLabels[booking.status]}
                      </span>
                    </td>
                    <td>
                      <span className="badge" style={{
                        background: `${paymentColors[booking.payment]}15`,
                        color: paymentColors[booking.payment],
                      }}>
                        {paymentLabels[booking.payment]}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="btn btn-ghost btn-sm"
                          title="View details"
                        >
                          <Eye size={16} />
                        </button>
                        <a
                          href={generateWhatsAppURL(booking.whatsapp, `Hello ${booking.guest}! Regarding your booking ${booking.ref} at Super E Luxury Hotel...`)}
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
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Booking Detail Modal */}
        {selectedBooking && (
          <>
            <div className="mobile-menu-overlay" onClick={() => setSelectedBooking(null)} />
            <div style={{
              position: 'fixed',
              top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              width: 'min(600px, 90vw)',
              maxHeight: '85vh',
              overflowY: 'auto',
              background: 'var(--color-surface)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-xl)',
              zIndex: 51,
              padding: 'var(--space-xl)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-xl)' }}>
                <div>
                  <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Booking Details</h2>
                  <p style={{ fontFamily: 'monospace', color: 'var(--color-text-secondary)' }}>{selectedBooking.ref}</p>
                </div>
                <button onClick={() => setSelectedBooking(null)} className="btn btn-ghost btn-icon">
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.125rem' }}>Guest Name</p>
                  <p style={{ fontWeight: 500 }}>{selectedBooking.guest}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.125rem' }}>Phone</p>
                  <p style={{ fontWeight: 500 }}>{selectedBooking.phone}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.125rem' }}>Room</p>
                  <p style={{ fontWeight: 500 }}>{selectedBooking.room}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.125rem' }}>Guests</p>
                  <p style={{ fontWeight: 500 }}>{selectedBooking.guests}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.125rem' }}>Check-in</p>
                  <p style={{ fontWeight: 500 }}>{formatDate(selectedBooking.checkIn)}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.125rem' }}>Check-out</p>
                  <p style={{ fontWeight: 500 }}>{formatDate(selectedBooking.checkOut)}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.125rem' }}>Amount</p>
                  <p style={{ fontWeight: 600, color: 'var(--color-primary)', fontSize: '1.125rem' }}>{formatPrice(selectedBooking.amount)}</p>
                </div>
              </div>

              {selectedBooking.specialRequests && (
                <div style={{ marginBottom: 'var(--space-lg)' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.125rem' }}>Special Requests</p>
                  <p>{selectedBooking.specialRequests}</p>
                </div>
              )}

              {/* Status Controls */}
              <div style={{ borderTop: '1px solid var(--color-border-light)', paddingTop: 'var(--space-lg)', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
                <div>
                  <label className="label">Booking Status</label>
                  <select className="input" defaultValue={selectedBooking.status}>
                    <option value="new">New</option>
                    <option value="awaiting_confirmation">Awaiting Confirmation</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="checked_in">Checked In</option>
                    <option value="checked_out">Checked Out</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="label">Payment Status</label>
                  <select className="input" defaultValue={selectedBooking.payment}>
                    <option value="not_paid">Not Paid</option>
                    <option value="awaiting_payment">Awaiting Payment</option>
                    <option value="partially_paid">Partially Paid</option>
                    <option value="paid">Paid</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 'var(--space-lg)' }}>
                <label className="label">Admin Notes</label>
                <textarea className="input" rows={3} defaultValue={selectedBooking.adminNotes} placeholder="Add notes about this booking..." />
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
                <button className="btn btn-primary">
                  <Check size={16} /> Save Changes
                </button>
                <a
                  href={generateWhatsAppURL(selectedBooking.whatsapp, `Hello ${selectedBooking.guest}! Regarding your booking ${selectedBooking.ref} at Super E Luxury Hotel...`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp"
                >
                  <MessageCircle size={16} /> WhatsApp Guest
                </a>
                <button className="btn btn-ghost" onClick={() => setSelectedBooking(null)}>
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
