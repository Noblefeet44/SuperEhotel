'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, CalendarCheck, Bed, Utensils, Building2,
  Star, Settings, Image as ImageIcon, FileText, Menu, X,
  LogOut, ChevronRight, MessageCircle, Dumbbell,
  UserCheck, CreditCard, Clock, AlertCircle, TrendingUp
} from 'lucide-react';
import { formatPrice, generateWhatsAppURL } from '@/lib/utils';

const sidebarLinks = [
  { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { href: '/admin/bookings', label: 'Bookings', icon: <CalendarCheck size={20} /> },
  { href: '/admin/rooms', label: 'Rooms', icon: <Bed size={20} /> },
  { href: '/admin/restaurant', label: 'Restaurant', icon: <Utensils size={20} /> },
  { href: '/admin/gym', label: 'Gym & Fitness', icon: <Dumbbell size={20} /> },
  { href: '/admin/facilities', label: 'Facilities', icon: <Building2 size={20} /> },
  { href: '/admin/reviews', label: 'Reviews', icon: <Star size={20} /> },
  { href: '/admin/media', label: 'Media', icon: <ImageIcon size={20} /> },
  { href: '/admin/content', label: 'Content', icon: <FileText size={20} /> },
  { href: '/admin/settings', label: 'Settings', icon: <Settings size={20} /> },
];

// Sample stats for dashboard
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

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_authenticated');
    if (auth !== 'true') {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    sessionStorage.removeItem('admin_email');
    router.push('/admin/login');
  };

  if (!isAuthenticated) return null;

  return (
    <div className="admin-layout">
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="mobile-menu-overlay"
          onClick={() => setSidebarOpen(false)}
          style={{ zIndex: 39 }}
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2>Super E Hotel</h2>
              <span>Admin Dashboard</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', display: 'none' }}
              className="lg-hidden"
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

        <div style={{ padding: 'var(--space-lg)', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 'auto', position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <Link href="/" className="admin-nav-item" style={{ fontSize: '0.875rem' }}>
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
      <main className="admin-main">
        {/* Top Bar */}
        <div className="admin-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <button
              onClick={() => setSidebarOpen(true)}
              className="btn btn-ghost btn-icon"
              style={{ display: 'none' }}
              id="admin-menu-toggle"
            >
              <Menu size={24} />
            </button>
            <h1>Dashboard</h1>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            <a
              href={generateWhatsAppURL('09131964939')}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp btn-sm"
            >
              <MessageCircle size={16} />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 'var(--space-lg)',
          marginBottom: 'var(--space-2xl)',
        }}>
          <div className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className="stat-card-value">{stats.totalRooms}</div>
                <div className="stat-card-label">Total Rooms</div>
              </div>
              <Bed size={24} style={{ color: 'var(--color-primary)', opacity: 0.5 }} />
            </div>
          </div>

          <div className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className="stat-card-value" style={{ color: 'var(--color-success)' }}>{stats.availableRooms}</div>
                <div className="stat-card-label">Available</div>
              </div>
              <div style={{
                width: '10px', height: '10px', borderRadius: '50%',
                background: 'var(--color-success)', marginTop: '8px',
              }} />
            </div>
          </div>

          <div className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className="stat-card-value" style={{ color: '#8B5CF6' }}>{stats.occupiedRooms}</div>
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
                <div className="stat-card-value">{stats.upcomingBookings}</div>
                <div className="stat-card-label">Upcoming Bookings</div>
              </div>
              <TrendingUp size={24} style={{ color: 'var(--color-primary)', opacity: 0.5 }} />
            </div>
          </div>

          <div className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className="stat-card-value" style={{ color: 'var(--color-warning)' }}>{stats.pendingConfirmations}</div>
                <div className="stat-card-label">Pending Confirmations</div>
              </div>
              <AlertCircle size={24} style={{ color: 'var(--color-warning)', opacity: 0.5 }} />
            </div>
          </div>

          <div className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className="stat-card-value" style={{ color: 'var(--color-destructive)' }}>{stats.pendingPayments}</div>
                <div className="stat-card-label">Pending Payments</div>
              </div>
              <CreditCard size={24} style={{ color: 'var(--color-destructive)', opacity: 0.5 }} />
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div style={{ marginBottom: 'var(--space-2xl)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
            <h2 style={{ fontSize: '1.25rem' }}>Recent Bookings</h2>
            <Link href="/admin/bookings" className="btn btn-outline btn-sm">
              View All <ChevronRight size={16} />
            </Link>
          </div>

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
                    <td style={{ fontSize: '0.875rem' }}>{new Date(booking.checkIn).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}</td>
                    <td style={{ fontSize: '0.875rem' }}>{new Date(booking.checkOut).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}</td>
                    <td style={{ fontWeight: 600 }}>{formatPrice(booking.amount)}</td>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-lg)' }}>Quick Actions</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 'var(--space-md)',
          }}>
            <Link href="/admin/bookings" className="card-static" style={{ padding: 'var(--space-lg)', textAlign: 'center', textDecoration: 'none', color: 'inherit' }}>
              <CalendarCheck size={28} style={{ color: 'var(--color-primary)', marginBottom: 'var(--space-sm)' }} />
              <h4 style={{ fontSize: '0.9375rem' }}>Manage Bookings</h4>
            </Link>
            <Link href="/admin/rooms" className="card-static" style={{ padding: 'var(--space-lg)', textAlign: 'center', textDecoration: 'none', color: 'inherit' }}>
              <Bed size={28} style={{ color: 'var(--color-primary)', marginBottom: 'var(--space-sm)' }} />
              <h4 style={{ fontSize: '0.9375rem' }}>Manage Rooms</h4>
            </Link>
            <Link href="/admin/restaurant" className="card-static" style={{ padding: 'var(--space-lg)', textAlign: 'center', textDecoration: 'none', color: 'inherit' }}>
              <Utensils size={28} style={{ color: 'var(--color-primary)', marginBottom: 'var(--space-sm)' }} />
              <h4 style={{ fontSize: '0.9375rem' }}>Manage Menu</h4>
            </Link>
            <Link href="/admin/settings" className="card-static" style={{ padding: 'var(--space-lg)', textAlign: 'center', textDecoration: 'none', color: 'inherit' }}>
              <Settings size={28} style={{ color: 'var(--color-primary)', marginBottom: 'var(--space-sm)' }} />
              <h4 style={{ fontSize: '0.9375rem' }}>Hotel Settings</h4>
            </Link>
          </div>
        </div>
      </main>

      {/* Mobile sidebar toggle CSS */}
      <style>{`
        @media (max-width: 1023px) {
          #admin-menu-toggle { display: flex !important; }
          .lg-hidden { display: block !important; }
        }
      `}</style>
    </div>
  );
}
