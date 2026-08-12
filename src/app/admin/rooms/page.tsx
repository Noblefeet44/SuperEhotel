'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Bed, ArrowLeft, Plus, Edit, Trash2, Save, X,
  Users, DollarSign, Maximize
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

const initialRooms = [
  {
    id: '1', name: 'Standard Room', slug: 'standard-room', category: 'Standard',
    price: 25000, maxGuests: 2, bedType: 'Queen', roomSize: '25 sqm',
    status: 'available', image: '/images/standard-room.jpg',
    facilities: ['Air Conditioning', 'Flat Screen TV', 'Wi-Fi', 'Hot Water', 'Wardrobe', 'Desk'],
    description: 'Our Standard Room offers a comfortable retreat with all essential amenities.',
  },
  {
    id: '2', name: 'Deluxe Room', slug: 'deluxe-room', category: 'Deluxe',
    price: 40000, maxGuests: 2, bedType: 'King', roomSize: '35 sqm',
    status: 'available', image: '/images/deluxe-room.jpg',
    facilities: ['Air Conditioning', 'Flat Screen TV', 'Wi-Fi', 'Hot Water', 'Mini Fridge', 'Wardrobe', 'Sitting Area', 'Desk'],
    description: 'Spacious rooms with premium amenities for an elevated experience.',
  },
  {
    id: '3', name: 'Executive Room', slug: 'executive-room', category: 'Executive',
    price: 60000, maxGuests: 2, bedType: 'King', roomSize: '45 sqm',
    status: 'available', image: '/images/executive-room.jpg',
    facilities: ['Air Conditioning', 'Flat Screen TV', 'Wi-Fi', 'Hot Water', 'Mini Bar', 'Refrigerator', 'Sitting Area', 'Executive Desk', 'Bathrobe', 'Complimentary Toiletries'],
    description: 'Sophisticated rooms designed for the discerning business traveler.',
  },
  {
    id: '4', name: 'VIP Luxury Suite', slug: 'vip-luxury-suite', category: 'VIP Suite',
    price: 100000, maxGuests: 4, bedType: 'King (Premium)', roomSize: '70 sqm',
    status: 'occupied', image: '/images/vip-suite.jpg',
    facilities: ['Air Conditioning', 'Smart TV', 'High-Speed Wi-Fi', 'Hot Water', 'Full Mini Bar', 'Refrigerator', 'Living Room', 'Dining Area'],
    description: 'Our finest accommodation with unparalleled luxury and space.',
  },
];

const statusOptions = [
  { value: 'available', label: 'Available', color: '#16A34A' },
  { value: 'booked', label: 'Booked', color: '#3B82F6' },
  { value: 'occupied', label: 'Occupied', color: '#8B5CF6' },
  { value: 'maintenance', label: 'Maintenance', color: '#F59E0B' },
];

export default function AdminRoomsPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState(initialRooms);
  const [editingRoom, setEditingRoom] = useState<typeof initialRooms[0] | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('admin_authenticated') !== 'true') {
      router.push('/admin/login');
    }
  }, [router]);

  const handleStatusChange = (roomId: string, newStatus: string) => {
    setRooms(rooms.map(r => r.id === roomId ? { ...r, status: newStatus } : r));
  };

  const handleEditRoom = (room: typeof initialRooms[0]) => {
    setEditingRoom({ ...room });
    setIsEditing(true);
  };

  const handleSaveRoom = () => {
    if (editingRoom) {
      setRooms(rooms.map(r => r.id === editingRoom.id ? editingRoom : r));
      setIsEditing(false);
      setEditingRoom(null);
    }
  };

  const handleDeleteRoom = (roomId: string) => {
    if (confirm('Are you sure you want to delete this room?')) {
      setRooms(rooms.filter(r => r.id !== roomId));
    }
  };

  return (
    <div className="admin-layout">
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
            <Bed size={20} />
            <span>Rooms</span>
          </div>
        </nav>
      </aside>

      <main className="admin-main">
        <div className="admin-header">
          <h1>Room Management</h1>
          <button className="btn btn-primary" onClick={() => {
            setEditingRoom({
              id: String(Date.now()),
              name: '', slug: '', category: 'Standard',
              price: 0, maxGuests: 2, bedType: 'Queen', roomSize: '',
              status: 'available', image: '/images/standard-room.jpg',
              facilities: [], description: '',
            });
            setIsEditing(true);
          }}>
            <Plus size={18} /> Add Room
          </button>
        </div>

        {/* Room Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 'var(--space-lg)',
        }}>
          {rooms.map((room) => (
            <div key={room.id} className="card-static" style={{ overflow: 'hidden' }}>
              <div style={{ position: 'relative', height: '180px' }}>
                <Image src={room.image} alt={room.name} fill style={{ objectFit: 'cover' }} sizes="300px" />
                <div style={{ position: 'absolute', top: '8px', right: '8px' }}>
                  <select
                    value={room.status}
                    onChange={(e) => handleStatusChange(room.id, e.target.value)}
                    style={{
                      padding: '4px 8px',
                      borderRadius: 'var(--radius-full)',
                      border: 'none',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background: statusOptions.find(s => s.value === room.status)?.color + '20',
                      color: statusOptions.find(s => s.value === room.status)?.color,
                      cursor: 'pointer',
                    }}
                  >
                    {statusOptions.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{ padding: 'var(--space-lg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-sm)' }}>
                  <div>
                    <h3 style={{ fontSize: '1.0625rem' }}>{room.name}</h3>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>{room.category}</p>
                  </div>
                  <span style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>
                    {formatPrice(room.price)}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-md)', color: 'var(--color-text-secondary)', fontSize: '0.8125rem', marginBottom: 'var(--space-md)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Users size={14} /> {room.maxGuests}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Bed size={14} /> {room.bedType}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Maximize size={14} /> {room.roomSize}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                  <button onClick={() => handleEditRoom(room)} className="btn btn-outline btn-sm" style={{ flex: 1 }}>
                    <Edit size={14} /> Edit
                  </button>
                  <button onClick={() => handleDeleteRoom(room.id)} className="btn btn-ghost btn-sm" style={{ color: 'var(--color-destructive)' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Modal */}
        {isEditing && editingRoom && (
          <>
            <div className="mobile-menu-overlay" onClick={() => { setIsEditing(false); setEditingRoom(null); }} />
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
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-xl)' }}>
                <h2 style={{ fontSize: '1.25rem' }}>{editingRoom.name ? 'Edit Room' : 'Add New Room'}</h2>
                <button onClick={() => { setIsEditing(false); setEditingRoom(null); }} className="btn btn-ghost btn-icon">
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                <div>
                  <label className="label">Room Name *</label>
                  <input
                    className="input"
                    value={editingRoom.name}
                    onChange={(e) => setEditingRoom({ ...editingRoom, name: e.target.value })}
                    placeholder="e.g. Deluxe Room"
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-lg)' }}>
                  <div>
                    <label className="label">Price per Night (₦) *</label>
                    <input
                      className="input"
                      type="number"
                      value={editingRoom.price}
                      onChange={(e) => setEditingRoom({ ...editingRoom, price: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <label className="label">Category</label>
                    <select className="input" value={editingRoom.category} onChange={(e) => setEditingRoom({ ...editingRoom, category: e.target.value })}>
                      <option>Standard</option>
                      <option>Deluxe</option>
                      <option>Executive</option>
                      <option>VIP Suite</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-lg)' }}>
                  <div>
                    <label className="label">Max Guests</label>
                    <input
                      className="input"
                      type="number"
                      value={editingRoom.maxGuests}
                      onChange={(e) => setEditingRoom({ ...editingRoom, maxGuests: parseInt(e.target.value) || 1 })}
                      min={1}
                      max={10}
                    />
                  </div>
                  <div>
                    <label className="label">Bed Type</label>
                    <select className="input" value={editingRoom.bedType} onChange={(e) => setEditingRoom({ ...editingRoom, bedType: e.target.value })}>
                      <option>Single</option>
                      <option>Double</option>
                      <option>Queen</option>
                      <option>King</option>
                      <option>King (Premium)</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Room Size</label>
                    <input
                      className="input"
                      value={editingRoom.roomSize}
                      onChange={(e) => setEditingRoom({ ...editingRoom, roomSize: e.target.value })}
                      placeholder="e.g. 35 sqm"
                    />
                  </div>
                </div>
                <div>
                  <label className="label">Description</label>
                  <textarea
                    className="input"
                    rows={3}
                    value={editingRoom.description}
                    onChange={(e) => setEditingRoom({ ...editingRoom, description: e.target.value })}
                    placeholder="Room description..."
                  />
                </div>
                <div>
                  <label className="label">Status</label>
                  <select className="input" value={editingRoom.status} onChange={(e) => setEditingRoom({ ...editingRoom, status: e.target.value })}>
                    {statusOptions.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'flex-end' }}>
                  <button onClick={() => { setIsEditing(false); setEditingRoom(null); }} className="btn btn-ghost">Cancel</button>
                  <button onClick={handleSaveRoom} className="btn btn-primary">
                    <Save size={16} /> Save Room
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
