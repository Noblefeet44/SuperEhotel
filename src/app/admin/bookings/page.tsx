'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CalendarCheck, Search, Filter, ChevronRight, Eye,
  MessageCircle, Check, X, ArrowLeft, Phone, Clock,
  CreditCard, CheckCircle2, AlertCircle, FileText, Image as ImageIcon,
  ExternalLink, UserCheck, ShieldCheck, UserPlus, Receipt,
  Printer, Share2, Wallet, Banknote, Building, Bed
} from 'lucide-react';
import { formatPrice, formatDate, generateWhatsAppURL } from '@/lib/utils';
import { HOTEL_INFO, INITIAL_ROOMS_DATA } from '@/lib/hotel-data';
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
  paymentMethod?: string;
  paymentReference?: string;
  amountPaid?: number;
  balanceDue?: number;
  roomNumber?: string;
  isWalkIn?: boolean;
  cashierName?: string;
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

  // Front Desk Walk-In State
  const [isWalkInModalOpen, setIsWalkInModalOpen] = useState(false);
  const [isSubmittingWalkIn, setIsSubmittingWalkIn] = useState(false);
  const [walkInReceipt, setWalkInReceipt] = useState<AdminBookingItem | null>(null);

  const getTodayStr = () => new Date().toISOString().slice(0, 10);
  const getTomorrowStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  };

  const defaultRoom = INITIAL_ROOMS_DATA[0] || { slug: 'standard', name: 'Standard Room', price: 36000, units: [] };

  const [walkInForm, setWalkInForm] = useState({
    guestName: '',
    phone: '',
    whatsapp: '',
    email: '',
    roomSlug: defaultRoom.slug,
    roomName: defaultRoom.name,
    roomPrice: defaultRoom.price,
    roomNumber: defaultRoom.units?.[0]?.roomNumber || '101',
    checkIn: getTodayStr(),
    checkOut: getTomorrowStr(),
    nights: 1,
    numGuests: 1,
    paymentMethod: 'cash', // 'cash' | 'pos' | 'transfer' | 'split'
    paymentReference: '',
    amountPaid: defaultRoom.price,
    balanceDue: 0,
    cashierName: 'Front Desk Receptionist',
    specialRequests: '',
  });

  const calculateNights = (cin: string, cout: string) => {
    try {
      const d1 = new Date(cin);
      const d2 = new Date(cout);
      const diff = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
      return Math.max(1, isNaN(diff) ? 1 : diff);
    } catch {
      return 1;
    }
  };

  const handleRoomChange = (roomSlug: string) => {
    const found = INITIAL_ROOMS_DATA.find((r) => r.slug === roomSlug) || defaultRoom;
    const total = found.price * walkInForm.nights;
    setWalkInForm((prev) => ({
      ...prev,
      roomSlug: found.slug,
      roomName: found.name,
      roomPrice: found.price,
      roomNumber: found.units?.[0]?.roomNumber || prev.roomNumber || '101',
      amountPaid: total,
      balanceDue: 0,
    }));
  };

  const handleDatesChange = (field: 'checkIn' | 'checkOut', val: string) => {
    const nextIn = field === 'checkIn' ? val : walkInForm.checkIn;
    const nextOut = field === 'checkOut' ? val : walkInForm.checkOut;
    const n = calculateNights(nextIn, nextOut);
    const total = walkInForm.roomPrice * n;
    setWalkInForm((prev) => ({
      ...prev,
      [field]: val,
      nights: n,
      amountPaid: total,
      balanceDue: 0,
    }));
  };

  const handleAmountPaidChange = (paidVal: number) => {
    const total = walkInForm.roomPrice * walkInForm.nights;
    const safePaid = Math.max(0, isNaN(paidVal) ? 0 : paidVal);
    const bal = Math.max(0, total - safePaid);
    setWalkInForm((prev) => ({
      ...prev,
      amountPaid: safePaid,
      balanceDue: bal,
    }));
  };

  const handleWalkInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkInForm.guestName.trim()) {
      alert('Please enter guest full name');
      return;
    }
    if (!walkInForm.phone.trim()) {
      alert('Please enter guest phone number');
      return;
    }

    setIsSubmittingWalkIn(true);
    const totalAmt = walkInForm.roomPrice * walkInForm.nights;
    const balDue = Math.max(0, totalAmt - walkInForm.amountPaid);
    const refCode = `SE-WALK-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const payload = {
      ref: refCode,
      guestName: walkInForm.guestName.trim(),
      phone: walkInForm.phone.trim(),
      whatsapp: walkInForm.whatsapp.trim() || walkInForm.phone.trim(),
      email: walkInForm.email.trim(),
      roomName: walkInForm.roomName,
      roomSlug: walkInForm.roomSlug,
      roomNumber: walkInForm.roomNumber || '',
      checkIn: walkInForm.checkIn,
      checkOut: walkInForm.checkOut,
      nights: walkInForm.nights,
      numGuests: walkInForm.numGuests,
      totalAmount: totalAmt,
      paymentMethod: walkInForm.paymentMethod,
      paymentReference: walkInForm.paymentReference || '',
      amountPaid: walkInForm.amountPaid,
      balanceDue: balDue,
      isWalkIn: true,
      cashierName: walkInForm.cashierName || 'Front Desk Cashier',
      specialRequests: walkInForm.specialRequests || '',
      status: 'confirmed',
      paymentStatus: balDue <= 0 ? 'paid' : (walkInForm.amountPaid > 0 ? 'partially_paid' : 'not_paid'),
    };

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      const newBookingItem: AdminBookingItem = {
        id: (data.booking && data.booking.id) || `walk_${Date.now()}`,
        ref: refCode,
        guest: walkInForm.guestName,
        phone: walkInForm.phone,
        whatsapp: walkInForm.whatsapp || walkInForm.phone,
        email: walkInForm.email,
        room: `${walkInForm.roomName}${walkInForm.roomNumber ? ` (${walkInForm.roomNumber})` : ''}`,
        checkIn: walkInForm.checkIn,
        checkOut: walkInForm.checkOut,
        guests: walkInForm.numGuests,
        status: 'confirmed',
        payment: balDue <= 0 ? 'paid' : (walkInForm.amountPaid > 0 ? 'partially_paid' : 'not_paid'),
        amount: totalAmt,
        paymentMethod: walkInForm.paymentMethod,
        paymentReference: walkInForm.paymentReference,
        amountPaid: walkInForm.amountPaid,
        balanceDue: balDue,
        roomNumber: walkInForm.roomNumber,
        isWalkIn: true,
        cashierName: walkInForm.cashierName,
        specialRequests: walkInForm.specialRequests,
        createdAt: new Date().toISOString(),
      };

      setBookingsList((prev) => [newBookingItem, ...prev]);
      setIsWalkInModalOpen(false);
      setWalkInReceipt(newBookingItem);
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 2500);
    } catch (err) {
      console.error('Walk-in booking error:', err);
      alert('Failed to save walk-in booking. Please try again.');
    } finally {
      setIsSubmittingWalkIn(false);
    }
  };

  const getReceiptWhatsAppMessage = (b: AdminBookingItem) => {
    return (
      `*SUPER E LUXURY HOTEL & SUITES LTD*\n` +
      `*Front Desk Lodging Receipt / Folio*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `*Receipt Ref:* ${b.ref}\n` +
      `*Guest Name:* ${b.guest}\n` +
      `*Phone:* ${b.phone}\n` +
      `*Room Category:* ${b.room}\n` +
      (b.roomNumber ? `*Room Unit:* ${b.roomNumber}\n` : '') +
      `*Check-In:* ${formatDate(b.checkIn)} (from 2:00 PM)\n` +
      `*Check-Out:* ${formatDate(b.checkOut)} (12:00 PM)\n` +
      `*Duration:* ${Math.max(1, Math.round((new Date(b.checkOut).getTime() - new Date(b.checkIn).getTime()) / (1000 * 60 * 60 * 24)))} Night(s)\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `*Total Lodging Bill:* ${formatPrice(b.amount)}\n` +
      `*Amount Paid Now:* ${formatPrice(b.amountPaid ?? b.amount)}\n` +
      `*Payment Method:* ${(b.paymentMethod || 'Cash').toUpperCase()}\n` +
      (b.paymentReference ? `*Payment Ref/POS:* ${b.paymentReference}\n` : '') +
      `*Balance Due:* ${formatPrice(b.balanceDue ?? 0)}\n` +
      (b.cashierName ? `*Attendant/Cashier:* ${b.cashierName}\n` : '') +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `📍 *Location:* 11 Hassan Chiroma Street, Adjacent Alvari Hotel G.R.A, Keffi, Nasarawa State\n` +
      `📞 *Front Desk:* 07066472533 | 09072069217\n` +
      `Thank you for staying at Super E Luxury Hotel & Suites!`
    );
  };

  useEffect(() => {
    if (sessionStorage.getItem('admin_authenticated') !== 'true') {
      router.push('/admin/login');
    }
    // Check if opened with ?walkin=true
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('walkin') === 'true' || params.get('new') === 'walkin') {
        setIsWalkInModalOpen(true);
      }
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
            paymentMethod: b.paymentMethod || 'transfer',
            paymentReference: b.paymentReference || '',
            amountPaid: b.amountPaid !== undefined ? b.amountPaid : (b.totalAmount || b.amount || 0),
            balanceDue: b.balanceDue !== undefined ? b.balanceDue : 0,
            roomNumber: b.roomNumber || '',
            isWalkIn: Boolean(b.isWalkIn),
            cashierName: b.cashierName || '',
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
        actionButton={
          <button
            onClick={() => setIsWalkInModalOpen(true)}
            type="button"
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
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(22, 163, 74, 0.35)',
              whiteSpace: 'nowrap',
            }}
          >
            <UserPlus size={13} /> + Walk-In
          </button>
        }
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
        <div className="admin-header" style={{ marginBottom: '0.75rem', width: '100%', boxSizing: 'border-box', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.25rem' }}>Guest Bookings</h1>
            <p style={{ margin: '0.15rem 0 0', fontSize: '0.8rem', color: '#64748B' }}>
              Check reservations, verify guest payments, and record front desk walk-ins.
            </p>
          </div>
          <button
            onClick={() => setIsWalkInModalOpen(true)}
            type="button"
            className="btn btn-primary"
            style={{
              backgroundColor: '#16A34A',
              borderColor: '#16A34A',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <UserPlus size={16} /> + New Walk-In Booking (Front Desk)
          </button>
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

        {/* Front Desk Walk-in Quick Bar for Mobile */}
        <div
          className="admin-mobile-walkin-banner"
          style={{
            marginBottom: '0.85rem',
            background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
            border: '1px solid #86EFAC',
            borderRadius: '12px',
            padding: '0.75rem 0.85rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
          }}
        >
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#166534' }}>Front Desk Cashier</span>
              <span style={{ fontSize: '0.62rem', backgroundColor: '#16A34A', color: '#FFFFFF', padding: '1px 6px', borderRadius: '999px', fontWeight: 700 }}>
                Cash / POS / Card
              </span>
            </div>
            <p style={{ margin: '0.15rem 0 0', fontSize: '0.72rem', color: '#14532D' }}>
              Book guest walk-ins &amp; record cashier payment immediately
            </p>
          </div>
          <button
            onClick={() => setIsWalkInModalOpen(true)}
            type="button"
            style={{
              backgroundColor: '#16A34A',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '0.45rem 0.75rem',
              fontSize: '0.75rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              flexShrink: 0,
              boxShadow: '0 2px 6px rgba(22, 163, 74, 0.25)',
              whiteSpace: 'nowrap',
            }}
          >
            <UserPlus size={14} /> Book Walk-In
          </button>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {booking.guest}
                      </h3>
                      {booking.isWalkIn && (
                        <span style={{ fontSize: '0.62rem', fontWeight: 800, padding: '1px 5px', borderRadius: '4px', background: '#DCFCE7', color: '#166534' }}>
                          🚶 Walk-In ({booking.paymentMethod?.toUpperCase() || 'CASH'})
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                      <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: '#64748B', fontWeight: 600 }}>
                        {booking.ref}
                      </span>
                      {booking.cashierName && (
                        <span style={{ fontSize: '0.64rem', color: '#64748B' }}>
                          • By {booking.cashierName}
                        </span>
                      )}
                    </div>
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
                    <span style={{ fontWeight: 700, color: '#0F172A' }}>
                      {booking.room} {booking.roomNumber ? `• Unit ${booking.roomNumber}` : ''}
                    </span>
                    <span style={{ color: '#64748B' }}>{booking.guests} Guest{booking.guests > 1 ? 's' : ''}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569', fontSize: '0.72rem', flexWrap: 'wrap', gap: '4px' }}>
                    <span>
                      📅 {new Date(booking.checkIn).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })} &rarr;{' '}
                      {new Date(booking.checkOut).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontWeight: 700, color: paymentColors[booking.payment] || '#64748B' }}>
                        ● {paymentLabels[booking.payment] || booking.payment}
                      </span>
                      {booking.balanceDue !== undefined && booking.balanceDue > 0 && (
                        <span style={{ fontWeight: 700, color: '#B45309', backgroundColor: '#FEF3C7', padding: '1px 5px', borderRadius: '4px' }}>
                          Due: {formatPrice(booking.balanceDue)}
                        </span>
                      )}
                    </div>
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

                <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.45rem', width: '100%', boxSizing: 'border-box', flexWrap: 'wrap' }}>
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
                      minWidth: '70px',
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
                      minWidth: '55px',
                    }}
                  >
                    <Phone size={14} /> Call
                  </a>

                  {booking.isWalkIn && (
                    <button
                      onClick={() => setWalkInReceipt(booking)}
                      type="button"
                      className="btn btn-sm"
                      style={{
                        backgroundColor: '#FEF9C3',
                        color: '#854D0E',
                        border: '1px solid #FEF08A',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        padding: '0.45rem 0.65rem',
                        borderRadius: '8px',
                        boxSizing: 'border-box',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                      }}
                    >
                      <Receipt size={14} /> Slip
                    </button>
                  )}

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
                    {booking.isWalkIn && (
                      <div>
                        <span style={{ fontSize: '0.64rem', backgroundColor: '#DCFCE7', color: '#166534', padding: '1px 5px', borderRadius: '4px', fontWeight: 800 }}>
                          🚶 Walk-In ({booking.paymentMethod?.toUpperCase() || 'CASH'})
                        </span>
                      </div>
                    )}
                  </td>
                  <td>
                    <div>
                      <strong>{booking.guest}</strong>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                        {booking.phone}
                      </div>
                      {booking.cashierName && (
                        <div style={{ fontSize: '0.68rem', color: '#64748B' }}>
                          Cashier: {booking.cashierName}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div>{booking.room}</div>
                    {booking.roomNumber && (
                      <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Unit: {booking.roomNumber}</div>
                    )}
                  </td>
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
                      {booking.balanceDue !== undefined && booking.balanceDue > 0 && (
                        <span style={{ fontSize: '0.68rem', color: '#B45309', backgroundColor: '#FEF3C7', padding: '1px 5px', borderRadius: '4px', fontWeight: 700 }}>
                          Due: {formatPrice(booking.balanceDue)}
                        </span>
                      )}
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
                      {booking.isWalkIn && (
                        <button
                          onClick={() => setWalkInReceipt(booking)}
                          className="btn btn-ghost btn-sm"
                          title="Print / View Digital Receipt Slip"
                          style={{ color: '#16A34A' }}
                        >
                          <Receipt size={16} />
                        </button>
                      )}
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
        {/* =========================================================
            FRONT DESK WALK-IN BOOKING MODAL (Mobile-Optimized)
            ========================================================= */}
        {isWalkInModalOpen && (
          <>
            <div
              className="mobile-menu-overlay"
              onClick={() => !isSubmittingWalkIn && setIsWalkInModalOpen(false)}
              style={{ zIndex: 99998 }}
            />
            <div
              className="admin-edit-modal"
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '94%',
                maxWidth: '620px',
                maxHeight: '92vh',
                overflowY: 'auto',
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '1.25rem',
                boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
                zIndex: 99999,
                boxSizing: 'border-box',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.65rem', backgroundColor: '#DCFCE7', color: '#166534', padding: '2px 8px', borderRadius: '999px', fontWeight: 800 }}>
                      FRONT DESK DESK RECEPTION
                    </span>
                    <span style={{ fontSize: '0.65rem', backgroundColor: '#EFF6FF', color: '#1E3A8A', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>
                      Walk-In Portal
                    </span>
                  </div>
                  <h2 style={{ margin: '0.35rem 0 0', fontSize: '1.2rem', fontWeight: 800, color: '#0F172A' }}>
                    New Walk-In Room Booking
                  </h2>
                  <p style={{ margin: '0.15rem 0 0', fontSize: '0.76rem', color: '#64748B' }}>
                    Assign room, record payment (Cash, POS Card or Transfer) &amp; issue instant receipt.
                  </p>
                </div>
                <button
                  onClick={() => setIsWalkInModalOpen(false)}
                  type="button"
                  style={{
                    background: '#F1F5F9',
                    border: 'none',
                    borderRadius: '8px',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#64748B',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleWalkInSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* 1. Guest Information */}
                <div style={{ backgroundColor: '#F8FAFC', padding: '0.85rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#1E293B', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '0.65rem' }}>
                    <UserCheck size={14} style={{ color: '#3B82F6' }} /> Guest Details
                  </span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.65rem' }}>
                    <div>
                      <label className="label" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                        Guest Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        className="input"
                        placeholder="e.g. Alhaji Musa Ibrahim"
                        value={walkInForm.guestName}
                        onChange={(e) => setWalkInForm({ ...walkInForm, guestName: e.target.value })}
                        style={{ fontSize: '0.82rem', padding: '0.5rem', width: '100%', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label className="label" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        className="input"
                        placeholder="e.g. 08023456789"
                        value={walkInForm.phone}
                        onChange={(e) => {
                          const val = e.target.value;
                          setWalkInForm((prev) => ({
                            ...prev,
                            phone: val,
                            whatsapp: prev.whatsapp === prev.phone || !prev.whatsapp ? val : prev.whatsapp,
                          }));
                        }}
                        style={{ fontSize: '0.82rem', padding: '0.5rem', width: '100%', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label className="label" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                        WhatsApp Number (for Receipt)
                      </label>
                      <input
                        type="tel"
                        className="input"
                        placeholder="e.g. 08023456789"
                        value={walkInForm.whatsapp}
                        onChange={(e) => setWalkInForm({ ...walkInForm, whatsapp: e.target.value })}
                        style={{ fontSize: '0.82rem', padding: '0.5rem', width: '100%', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label className="label" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                        Email (Optional)
                      </label>
                      <input
                        type="email"
                        className="input"
                        placeholder="guest@gmail.com"
                        value={walkInForm.email}
                        onChange={(e) => setWalkInForm({ ...walkInForm, email: e.target.value })}
                        style={{ fontSize: '0.82rem', padding: '0.5rem', width: '100%', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Room & Stay Duration */}
                <div style={{ backgroundColor: '#F8FAFC', padding: '0.85rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#1E293B', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '0.65rem' }}>
                    <Bed size={14} style={{ color: '#8B5CF6' }} /> Room &amp; Stay Duration
                  </span>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.65rem', marginBottom: '0.65rem' }}>
                    <div style={{ gridColumn: 'span 1' }}>
                      <label className="label" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                        Room Category *
                      </label>
                      <select
                        className="input"
                        value={walkInForm.roomSlug}
                        onChange={(e) => handleRoomChange(e.target.value)}
                        style={{ fontSize: '0.82rem', padding: '0.5rem', width: '100%', boxSizing: 'border-box', fontWeight: 600 }}
                      >
                        {INITIAL_ROOMS_DATA.map((room) => (
                          <option key={room.slug} value={room.slug}>
                            {room.name} — {formatPrice(room.price)}/night
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="label" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                        Room Unit / Room No.
                      </label>
                      <input
                        type="text"
                        className="input"
                        placeholder="e.g. 101, 102, 204"
                        value={walkInForm.roomNumber}
                        onChange={(e) => setWalkInForm({ ...walkInForm, roomNumber: e.target.value })}
                        style={{ fontSize: '0.82rem', padding: '0.5rem', width: '100%', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.65rem' }}>
                    <div>
                      <label className="label" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                        Check-In Date *
                      </label>
                      <input
                        type="date"
                        required
                        className="input"
                        value={walkInForm.checkIn}
                        onChange={(e) => handleDatesChange('checkIn', e.target.value)}
                        style={{ fontSize: '0.82rem', padding: '0.45rem', width: '100%', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div>
                      <label className="label" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                        Check-Out Date *
                      </label>
                      <input
                        type="date"
                        required
                        className="input"
                        value={walkInForm.checkOut}
                        onChange={(e) => handleDatesChange('checkOut', e.target.value)}
                        style={{ fontSize: '0.82rem', padding: '0.45rem', width: '100%', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div>
                      <label className="label" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                        Duration
                      </label>
                      <div
                        style={{
                          padding: '0.5rem',
                          backgroundColor: '#EEF2FF',
                          border: '1px solid #C7D2FE',
                          borderRadius: '8px',
                          fontWeight: 800,
                          color: '#3730A3',
                          fontSize: '0.8rem',
                          textAlign: 'center',
                        }}
                      >
                        {walkInForm.nights} Night{walkInForm.nights > 1 ? 's' : ''}
                      </div>
                    </div>

                    <div>
                      <label className="label" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                        No. of Guests
                      </label>
                      <select
                        className="input"
                        value={walkInForm.numGuests}
                        onChange={(e) => setWalkInForm({ ...walkInForm, numGuests: Number(e.target.value) })}
                        style={{ fontSize: '0.82rem', padding: '0.45rem', width: '100%', boxSizing: 'border-box' }}
                      >
                        <option value={1}>1 Guest</option>
                        <option value={2}>2 Guests</option>
                        <option value={3}>3 Guests</option>
                        <option value={4}>4 Guests</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 3. Cashier Payment Reception */}
                <div style={{ backgroundColor: '#F0FDF4', padding: '0.85rem', borderRadius: '12px', border: '1px solid #BBF7D0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <CreditCard size={14} style={{ color: '#16A34A' }} /> Cashier Payment Reception
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#166534' }}>
                      Total Bill: {formatPrice(walkInForm.roomPrice * walkInForm.nights)}
                    </span>
                  </div>

                  {/* Payment Method Pills */}
                  <label className="label" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#14532D', marginBottom: '0.35rem' }}>
                    Payment Method *
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.45rem', marginBottom: '0.75rem' }}>
                    {[
                      { id: 'cash', label: '💵 Cash', desc: 'Cash handed at reception' },
                      { id: 'pos', label: '💳 POS / Debit Card', desc: 'Moniepoint/Bank POS terminal' },
                      { id: 'transfer', label: '🏦 Bank Transfer', desc: 'Direct hotel reception account' },
                      { id: 'split', label: '🔀 Split / Deposit', desc: 'Part cash, part card or deposit' },
                    ].map((pm) => {
                      const isSelected = walkInForm.paymentMethod === pm.id;
                      return (
                        <button
                          key={pm.id}
                          type="button"
                          onClick={() => setWalkInForm({ ...walkInForm, paymentMethod: pm.id })}
                          style={{
                            padding: '0.55rem 0.65rem',
                            textAlign: 'left',
                            backgroundColor: isSelected ? '#166534' : '#FFFFFF',
                            color: isSelected ? '#FFFFFF' : '#1E293B',
                            border: `1.5px solid ${isSelected ? '#166534' : '#CBD5E1'}`,
                            borderRadius: '10px',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            boxSizing: 'border-box',
                            boxShadow: isSelected ? '0 2px 6px rgba(22, 101, 52, 0.25)' : 'none',
                          }}
                        >
                          <span style={{ fontWeight: 800, fontSize: '0.82rem' }}>{pm.label}</span>
                          <span style={{ fontSize: '0.64rem', opacity: isSelected ? 0.9 : 0.6, marginTop: '2px' }}>
                            {pm.desc}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Optional POS / Transfer Reference */}
                  {(walkInForm.paymentMethod === 'pos' || walkInForm.paymentMethod === 'transfer') && (
                    <div style={{ marginBottom: '0.75rem' }}>
                      <label className="label" style={{ fontSize: '0.72rem', fontWeight: 700, color: '#166534' }}>
                        POS Receipt No. / Transfer Session ID (Optional)
                      </label>
                      <input
                        type="text"
                        className="input"
                        placeholder="e.g. POS-98234 or Moniepoint Ref"
                        value={walkInForm.paymentReference}
                        onChange={(e) => setWalkInForm({ ...walkInForm, paymentReference: e.target.value })}
                        style={{ fontSize: '0.8rem', padding: '0.45rem', backgroundColor: '#FFFFFF', width: '100%', boxSizing: 'border-box' }}
                      />
                    </div>
                  )}

                  {/* Amount Paid & Quick Presets */}
                  <div style={{ marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <label className="label" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534', margin: 0 }}>
                        Amount Received Now (₦) *
                      </label>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          type="button"
                          onClick={() => handleAmountPaidChange(walkInForm.roomPrice * walkInForm.nights)}
                          style={{
                            fontSize: '0.66rem',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            border: '1px solid #16A34A',
                            backgroundColor: '#DCFCE7',
                            color: '#166534',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          Full ({formatPrice(walkInForm.roomPrice * walkInForm.nights)})
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAmountPaidChange((walkInForm.roomPrice * walkInForm.nights) / 2)}
                          style={{
                            fontSize: '0.66rem',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            border: '1px solid #CBD5E1',
                            backgroundColor: '#FFFFFF',
                            color: '#334155',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          50% Deposit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAmountPaidChange(0)}
                          style={{
                            fontSize: '0.66rem',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            border: '1px solid #CBD5E1',
                            backgroundColor: '#FFFFFF',
                            color: '#64748B',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          Pay Later
                        </button>
                      </div>
                    </div>
                    <input
                      type="number"
                      required
                      min={0}
                      step={500}
                      className="input"
                      value={walkInForm.amountPaid}
                      onChange={(e) => handleAmountPaidChange(Number(e.target.value))}
                      style={{ fontSize: '1rem', fontWeight: 800, padding: '0.55rem', backgroundColor: '#FFFFFF', width: '100%', boxSizing: 'border-box', color: '#166534' }}
                    />
                  </div>

                  {/* Balance Due Notification Banner */}
                  {walkInForm.balanceDue <= 0 ? (
                    <div style={{ backgroundColor: '#DCFCE7', border: '1px solid #86EFAC', borderRadius: '8px', padding: '0.5rem 0.75rem', display: 'flex', alignItems: 'center', gap: '6px', color: '#14532D', fontSize: '0.78rem', fontWeight: 700 }}>
                      <CheckCircle2 size={16} style={{ color: '#16A34A', flexShrink: 0 }} />
                      Full lodging bill settled (₦0 balance remaining).
                    </div>
                  ) : (
                    <div style={{ backgroundColor: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: '8px', padding: '0.5rem 0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#92400E', fontSize: '0.78rem', fontWeight: 700 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <AlertCircle size={16} style={{ color: '#D97706', flexShrink: 0 }} />
                        <span>Balance Due to be collected on checkout:</span>
                      </div>
                      <span style={{ fontSize: '0.9rem', fontWeight: 800 }}>
                        {formatPrice(walkInForm.balanceDue)}
                      </span>
                    </div>
                  )}
                </div>

                {/* 4. Cashier Name & Notes */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.65rem' }}>
                  <div>
                    <label className="label" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                      Cashier / Attendant Name
                    </label>
                    <input
                      type="text"
                      className="input"
                      value={walkInForm.cashierName}
                      onChange={(e) => setWalkInForm({ ...walkInForm, cashierName: e.target.value })}
                      placeholder="e.g. Blessing (Front Desk)"
                      style={{ fontSize: '0.8rem', padding: '0.45rem', width: '100%', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label className="label" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                      Attendant Notes / Key Card #
                    </label>
                    <input
                      type="text"
                      className="input"
                      value={walkInForm.specialRequests}
                      onChange={(e) => setWalkInForm({ ...walkInForm, specialRequests: e.target.value })}
                      placeholder="e.g. Key Card #12 issued, early breakfast"
                      style={{ fontSize: '0.8rem', padding: '0.45rem', width: '100%', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                {/* Form Buttons */}
                <div style={{ display: 'flex', gap: '0.65rem', paddingTop: '0.5rem', borderTop: '1px solid #E2E8F0', flexWrap: 'wrap' }}>
                  <button
                    type="submit"
                    disabled={isSubmittingWalkIn}
                    className="btn btn-primary"
                    style={{
                      flex: 1,
                      backgroundColor: '#16A34A',
                      borderColor: '#16A34A',
                      fontWeight: 800,
                      justifyContent: 'center',
                      padding: '0.7rem',
                      fontSize: '0.88rem',
                      boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)',
                    }}
                  >
                    <Check size={18} />
                    {isSubmittingWalkIn ? 'Processing & Saving...' : 'Complete Walk-In Booking & Issue Receipt'}
                  </button>

                  <button
                    type="button"
                    disabled={isSubmittingWalkIn}
                    className="btn btn-ghost"
                    onClick={() => setIsWalkInModalOpen(false)}
                    style={{ padding: '0.7rem 1.25rem' }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </>
        )}

        {/* =========================================================
            DIGITAL GUEST RECEIPT / FOLIO SLIP MODAL
            ========================================================= */}
        {walkInReceipt && (
          <>
            <div
              className="mobile-menu-overlay no-print"
              onClick={() => setWalkInReceipt(null)}
              style={{ zIndex: 99998 }}
            />
            <div
              className="admin-edit-modal"
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '94%',
                maxWidth: '480px',
                maxHeight: '94vh',
                overflowY: 'auto',
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '1.25rem',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                zIndex: 99999,
                boxSizing: 'border-box',
              }}
            >
              {/* Printable Receipt Paper Container */}
              <div
                id="printable-receipt"
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                }}
              >
                {/* Hotel Header */}
                <div style={{ textAlign: 'center', borderBottom: '2px dashed #CBD5E1', paddingBottom: '0.85rem', marginBottom: '0.85rem' }}>
                  <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#1E3A8A', letterSpacing: '0.5px' }}>
                    SUPER E LUXURY HOTEL &amp; SUITES LTD
                  </h2>
                  <p style={{ margin: '0.15rem 0', fontSize: '0.72rem', color: '#475569' }}>
                    11 Hassan Chiroma Street, Adjacent Alvari Hotel G.R.A, Keffi, Nasarawa State
                  </p>
                  <p style={{ margin: 0, fontSize: '0.72rem', color: '#475569', fontWeight: 600 }}>
                    Phone: 07066472533 | 09072069217
                  </p>
                  <div style={{ marginTop: '0.45rem', display: 'inline-block', backgroundColor: '#F1F5F9', padding: '2px 10px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: '#0F172A' }}>
                    Official Front Desk Lodging Folio
                  </div>
                </div>

                {/* Folio Metadata */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.75rem', backgroundColor: '#F8FAFC', padding: '0.5rem 0.65rem', borderRadius: '8px' }}>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '0.68rem' }}>RECEIPT / FOLIO NO:</span>
                    <strong style={{ fontFamily: 'monospace', fontSize: '0.82rem', color: '#1E3A8A' }}>{walkInReceipt.ref}</strong>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '0.68rem' }}>DATE ISSUED:</span>
                    <strong>{new Date(walkInReceipt.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
                  </div>
                </div>

                {/* Guest Details */}
                <div style={{ fontSize: '0.78rem', marginBottom: '0.75rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.65rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ color: '#64748B' }}>Guest Name:</span>
                    <strong style={{ color: '#0F172A', fontSize: '0.85rem' }}>{walkInReceipt.guest}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ color: '#64748B' }}>Phone / WhatsApp:</span>
                    <span>{walkInReceipt.phone}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ color: '#64748B' }}>Room Assigned:</span>
                    <strong>{walkInReceipt.room}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ color: '#64748B' }}>Stay Dates:</span>
                    <span>{formatDate(walkInReceipt.checkIn)} &rarr; {formatDate(walkInReceipt.checkOut)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B' }}>Duration:</span>
                    <span>{Math.max(1, Math.round((new Date(walkInReceipt.checkOut).getTime() - new Date(walkInReceipt.checkIn).getTime()) / (1000 * 60 * 60 * 24)))} Night(s)</span>
                  </div>
                </div>

                {/* Payment Breakdown Table */}
                <div style={{ backgroundColor: '#F8FAFC', borderRadius: '8px', padding: '0.65rem', marginBottom: '0.85rem', fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span>Total Lodging Charge:</span>
                    <strong>{formatPrice(walkInReceipt.amount)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', color: '#166534', fontWeight: 800 }}>
                    <span>Amount Paid ({walkInReceipt.paymentMethod?.toUpperCase() || 'CASH'}):</span>
                    <span>{formatPrice(walkInReceipt.amountPaid ?? walkInReceipt.amount)}</span>
                  </div>
                  {walkInReceipt.paymentReference && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.72rem', color: '#64748B' }}>
                      <span>Payment Ref:</span>
                      <span>{walkInReceipt.paymentReference}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #CBD5E1', paddingTop: '0.35rem', color: (walkInReceipt.balanceDue ?? 0) > 0 ? '#B45309' : '#166534', fontWeight: 800 }}>
                    <span>{(walkInReceipt.balanceDue ?? 0) > 0 ? 'Balance Due on Checkout:' : 'Status:'}</span>
                    <span>{(walkInReceipt.balanceDue ?? 0) > 0 ? formatPrice(walkInReceipt.balanceDue!) : 'FULLY SETTLED ✓'}</span>
                  </div>
                </div>

                {/* Footer Notes */}
                <div style={{ textAlign: 'center', fontSize: '0.68rem', color: '#64748B', borderTop: '1px dashed #CBD5E1', paddingTop: '0.65rem' }}>
                  <p style={{ margin: '0 0 0.15rem' }}>
                    Attendant: <strong>{walkInReceipt.cashierName || 'Front Desk Staff'}</strong>
                  </p>
                  <p style={{ margin: 0 }}>
                    Check-in: 2:00 PM • Check-out: 12:00 PM • 24/7 Power Supply &amp; Security
                  </p>
                  <p style={{ margin: '0.25rem 0 0', fontWeight: 700, color: '#1E3A8A' }}>
                    Thank you for choosing Super E Luxury Hotel &amp; Suites!
                  </p>
                </div>
              </div>

              {/* Action Buttons (Excluded from Print) */}
              <div className="no-print" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                <a
                  href={generateWhatsAppURL(
                    walkInReceipt.whatsapp || walkInReceipt.phone,
                    getReceiptWhatsAppMessage(walkInReceipt)
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp"
                  style={{
                    justifyContent: 'center',
                    fontWeight: 800,
                    padding: '0.65rem',
                    fontSize: '0.85rem',
                    boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)',
                  }}
                >
                  <MessageCircle size={18} /> Send Receipt to Guest on WhatsApp
                </a>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window !== 'undefined') window.print();
                    }}
                    className="btn btn-primary"
                    style={{
                      flex: 1,
                      backgroundColor: '#1E3A8A',
                      borderColor: '#1E3A8A',
                      justifyContent: 'center',
                      fontWeight: 700,
                      padding: '0.6rem',
                      fontSize: '0.82rem',
                    }}
                  >
                    <Printer size={16} /> Print Receipt Slip
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setWalkInReceipt(null);
                      setIsWalkInModalOpen(true);
                    }}
                    className="btn btn-sm"
                    style={{
                      backgroundColor: '#F0FDF4',
                      color: '#166534',
                      border: '1px solid #BBF7D0',
                      fontWeight: 700,
                      padding: '0.6rem 0.85rem',
                      fontSize: '0.82rem',
                    }}
                  >
                    + Another
                  </button>

                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => setWalkInReceipt(null)}
                    style={{ padding: '0.6rem 0.85rem' }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Global Print Stylesheet for Receipt */}
        <style jsx global>{`
          @media print {
            body * {
              visibility: hidden !important;
            }
            #printable-receipt,
            #printable-receipt * {
              visibility: visible !important;
            }
            #printable-receipt {
              position: fixed !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              max-width: 80mm !important;
              margin: 0 auto !important;
              padding: 5mm !important;
              background: #ffffff !important;
              color: #000000 !important;
              box-shadow: none !important;
              border: none !important;
            }
            .no-print {
              display: none !important;
            }
          }
        `}</style>
      </main>
    </div>
  );
}
