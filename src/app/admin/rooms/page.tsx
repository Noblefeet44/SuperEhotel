'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Bed, ArrowLeft, Plus, Edit2, Trash2, Save, X,
  Users, CheckCircle2, AlertCircle, Search, RefreshCw,
  SlidersHorizontal, Check, PlusCircle, UploadCloud, Camera,
  Image as ImageIcon, ChevronLeft, ChevronRight, Star, Loader2
} from 'lucide-react';
import {
  RoomCategoryData, RoomUnit,
  getStoredRoomsData, saveStoredRoomsData
} from '@/lib/hotel-data';
import { AdminMobileNav } from '@/components/admin/AdminMobileNav';
import { RoomImageCarousel } from '@/components/rooms/RoomImageCarousel';

const STATUS_CONFIG = {
  available: { label: 'Available', bg: '#DCFCE7', text: '#166534', border: '#BBF7D0' },
  occupied: { label: 'Occupied', bg: '#EDE9FE', text: '#5B21B6', border: '#DDD6FE' },
  booked: { label: 'Booked', bg: '#DBEAFE', text: '#1E40AF', border: '#BFDBFE' },
  maintenance: { label: 'Maintenance', bg: '#FEF3C7', text: '#92400E', border: '#FDE68A' },
};

export default function AdminRoomsPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<RoomCategoryData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingRoom, setEditingRoom] = useState<RoomCategoryData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saveToast, setSaveToast] = useState(false);
  const [newUnitNumber, setNewUnitNumber] = useState<{ [roomId: string]: string }>({});
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [newCustomImageUrl, setNewCustomImageUrl] = useState('');

  // Handle uploading multiple photos from phone or computer
  const handleMultipleRoomPhotosUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !editingRoom) return;

    setUploadStatus(`Uploading 1 of ${files.length} photos...`);
    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      setUploadStatus(`Uploading ${i + 1} of ${files.length} photos...`);
      const file = files[i];
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', 'rooms');

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (data.success && data.url) {
          uploadedUrls.push(data.url);
        } else {
          console.warn('Failed upload for file:', file.name, data.error);
        }
      } catch (err) {
        console.error('Photo upload network error:', err);
      }
    }

    if (uploadedUrls.length > 0) {
      const existing = editingRoom.images && editingRoom.images.length > 0
        ? [...editingRoom.images]
        : (editingRoom.image ? [editingRoom.image] : []);
      const combined = [...existing, ...uploadedUrls];
      setEditingRoom({
        ...editingRoom,
        image: combined[0],
        images: combined,
      });
    }

    setUploadStatus(null);
    e.target.value = '';
  };

  // Reorder photo left or right
  const handleMovePhoto = (index: number, direction: 'left' | 'right') => {
    if (!editingRoom) return;
    const currentImgs = editingRoom.images && editingRoom.images.length > 0
      ? [...editingRoom.images]
      : [editingRoom.image];
    const targetIdx = direction === 'left' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= currentImgs.length) return;

    const temp = currentImgs[index];
    currentImgs[index] = currentImgs[targetIdx];
    currentImgs[targetIdx] = temp;

    setEditingRoom({
      ...editingRoom,
      image: currentImgs[0],
      images: currentImgs,
    });
  };

  // Set chosen image as primary cover photo
  const handleSetCoverPhoto = (index: number) => {
    if (!editingRoom) return;
    const currentImgs = editingRoom.images && editingRoom.images.length > 0
      ? [...editingRoom.images]
      : [editingRoom.image];
    if (index <= 0 || index >= currentImgs.length) return;

    const [selected] = currentImgs.splice(index, 1);
    currentImgs.unshift(selected);

    setEditingRoom({
      ...editingRoom,
      image: selected,
      images: currentImgs,
    });
  };

  // Delete an image from gallery
  const handleDeletePhoto = (index: number) => {
    if (!editingRoom) return;
    const currentImgs = editingRoom.images && editingRoom.images.length > 0
      ? [...editingRoom.images]
      : [editingRoom.image];

    if (currentImgs.length <= 1) {
      alert('Each room tier must have at least 1 photo.');
      return;
    }

    const filtered = currentImgs.filter((_, i) => i !== index);
    setEditingRoom({
      ...editingRoom,
      image: filtered[0],
      images: filtered,
    });
  };

  // Add custom URL image
  const handleAddCustomImageUrl = () => {
    const url = newCustomImageUrl.trim();
    if (!url || !editingRoom) return;

    const currentImgs = editingRoom.images && editingRoom.images.length > 0
      ? [...editingRoom.images]
      : (editingRoom.image ? [editingRoom.image] : []);

    const updated = [...currentImgs, url];
    setEditingRoom({
      ...editingRoom,
      image: updated[0],
      images: updated,
    });
    setNewCustomImageUrl('');
  };

  useEffect(() => {
    // Check authentication
    if (typeof window !== 'undefined' && sessionStorage.getItem('admin_authenticated') !== 'true') {
      router.push('/admin/login');
      return;
    }
    setRooms(getStoredRoomsData());
  }, [router]);

  const triggerSaveNotification = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  // Cycle room unit status on click
  const handleCycleUnitStatus = (roomId: string, unitId: string) => {
    const statuses: Array<'available' | 'occupied' | 'booked' | 'maintenance'> = [
      'available', 'occupied', 'booked', 'maintenance'
    ];

    const updated = rooms.map((r) => {
      if (r.id !== roomId) return r;
      const updatedUnits = r.units.map((u) => {
        if (u.id !== unitId) return u;
        const nextIdx = (statuses.indexOf(u.status) + 1) % statuses.length;
        return { ...u, status: statuses[nextIdx] };
      });
      return { ...r, units: updatedUnits };
    });

    setRooms(updated);
    saveStoredRoomsData(updated);
    triggerSaveNotification();
  };

  // Add a new room unit (e.g. Room 105)
  const handleAddUnit = (roomId: string) => {
    const num = (newUnitNumber[roomId] || '').trim();
    if (!num) return;

    const updated = rooms.map((r) => {
      if (r.id !== roomId) return r;
      const newUnit: RoomUnit = {
        id: `${roomId}-${Date.now()}`,
        roomNumber: num,
        floor: 'Hotel Floor',
        status: 'available',
      };
      return { ...r, units: [...r.units, newUnit] };
    });

    setRooms(updated);
    saveStoredRoomsData(updated);
    setNewUnitNumber({ ...newUnitNumber, [roomId]: '' });
    triggerSaveNotification();
  };

  // Remove a room unit
  const handleDeleteUnit = (roomId: string, unitId: string) => {
    if (!confirm('Remove this room unit?')) return;
    const updated = rooms.map((r) => {
      if (r.id !== roomId) return r;
      return { ...r, units: r.units.filter((u) => u.id !== unitId) };
    });
    setRooms(updated);
    saveStoredRoomsData(updated);
    triggerSaveNotification();
  };

  // Save room category details (price, name, etc.)
  const handleSaveRoomDetails = () => {
    if (!editingRoom) return;
    const currentImgs = editingRoom.images && editingRoom.images.length > 0
      ? editingRoom.images
      : (editingRoom.image ? [editingRoom.image] : ['/images/standard-room.jpg']);

    const roomToSave: RoomCategoryData = {
      ...editingRoom,
      image: currentImgs[0],
      images: currentImgs,
    };

    const exists = rooms.some((r) => r.id === roomToSave.id);
    let updated: RoomCategoryData[];

    if (exists) {
      updated = rooms.map((r) => (r.id === roomToSave.id ? roomToSave : r));
    } else {
      updated = [...rooms, roomToSave];
    }

    setRooms(updated);
    saveStoredRoomsData(updated);

    // Sync directly to Supabase database in background
    fetch('/api/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(roomToSave),
    }).catch((err) => console.warn('Supabase room sync notice:', err));

    setIsModalOpen(false);
    setEditingRoom(null);
    triggerSaveNotification();
  };

  // Delete an entire room tier
  const handleDeleteCategory = (roomId: string) => {
    if (!confirm('Are you sure you want to delete this room category and all its inventory?')) return;
    const updated = rooms.filter((r) => r.id !== roomId);
    setRooms(updated);
    saveStoredRoomsData(updated);
    triggerSaveNotification();
  };

  // Filtered rooms
  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.units.some(u => u.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || room.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(rooms.map((r) => r.category.toLowerCase())))];

  // Global counts
  const totalUnitsCount = rooms.reduce((acc, r) => acc + r.units.length, 0);
  const availableUnitsCount = rooms.reduce((acc, r) => acc + r.units.filter(u => u.status === 'available').length, 0);
  const occupiedUnitsCount = rooms.reduce((acc, r) => acc + r.units.filter(u => u.status === 'occupied').length, 0);

  return (
    <div className="admin-layout" style={{ maxWidth: '100vw', overflowX: 'hidden', width: '100%', boxSizing: 'border-box' }}>
      {/* Mobile Top Navigation */}
      <AdminMobileNav
        title="Rooms & Inventory"
        subtitle={`${rooms.length} Tiers • ${totalUnitsCount} Total Units`}
        backHref="/admin"
      />

      {/* Desktop Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Super E Hotel</h2>
          <span>Admin Dashboard</span>
        </div>
        <nav style={{ padding: 'var(--space-sm) 0' }}>
          <Link href="/admin" className="admin-nav-item">
            <ArrowLeft size={18} />
            <span>Back to Dashboard</span>
          </Link>
          <div className="admin-nav-item active">
            <Bed size={18} />
            <span>Rooms &amp; Inventory</span>
          </div>
        </nav>
      </aside>

      <main className="admin-main" style={{ minWidth: 0, width: '100%', maxWidth: '100vw', overflowX: 'hidden', boxSizing: 'border-box' }}>
        {/* Header & Actions */}
        <div className="admin-header" style={{ marginBottom: '0.85rem', width: '100%', boxSizing: 'border-box' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.25rem' }}>Room Categories &amp; Inventory</h1>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#64748B' }}>
              Manage the 8 official room tiers, live pricing, and room units manually.
            </p>
          </div>
          <button
            className="btn btn-primary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', alignSelf: 'flex-start' }}
            onClick={() => {
              setEditingRoom({
                id: `tier-${Date.now()}`,
                slug: `new-tier-${Date.now()}`,
                name: '',
                category: 'Standard',
                price: 40000,
                maxGuests: 2,
                bedType: 'King Bed',
                roomSize: '30 sqm',
                image: '/images/standard-room.jpg',
                images: ['/images/standard-room.jpg'],
                description: '',
                facilities: ['Air Conditioning', 'Flat Screen TV', 'Wi-Fi', 'Hot Water'],
                units: [],
              });
              setIsModalOpen(true);
            }}
          >
            <Plus size={16} /> Add Room Tier
          </button>
        </div>

        {/* Inventory Summary Stats (2x2 grid on mobile, no horizontal blowout) */}
        <div className="admin-mobile-metrics-grid" style={{ marginBottom: '1rem', width: '100%', boxSizing: 'border-box' }}>
          <div className="mobile-metric-card blue">
            <div className="metric-val">{totalUnitsCount}</div>
            <div className="metric-lbl">Total Units</div>
          </div>
          <div className="mobile-metric-card green">
            <div className="metric-val">{availableUnitsCount}</div>
            <div className="metric-lbl">Available Now</div>
          </div>
          <div className="mobile-metric-card purple">
            <div className="metric-val">{occupiedUnitsCount}</div>
            <div className="metric-lbl">Occupied</div>
          </div>
          <div className="mobile-metric-card amber">
            <div className="metric-val">{rooms.length}</div>
            <div className="metric-lbl">Room Tiers</div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <div style={{ position: 'relative' }}>
            <Search
              size={18}
              style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}
            />
            <input
              type="text"
              placeholder="Search category, room number (e.g. 101, Deluxe)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem 0.65rem 2.4rem',
                borderRadius: '10px',
                border: '1px solid #CBD5E1',
                fontSize: '0.875rem',
                backgroundColor: '#FFFFFF',
              }}
            />
          </div>

          {/* Category Pill Filters */}
          <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.25rem', scrollbarWidth: 'none' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  border: selectedCategory === cat ? 'none' : '1px solid #CBD5E1',
                  backgroundColor: selectedCategory === cat ? '#1E3A8A' : '#FFFFFF',
                  color: selectedCategory === cat ? '#FFFFFF' : '#475569',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                }}
              >
                {cat === 'all' ? 'All Tiers' : cat.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Room Cards List (Mobile Priority) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredRooms.map((room) => {
            const availableUnits = room.units.filter((u) => u.status === 'available').length;
            const occupiedUnits = room.units.filter((u) => u.status === 'occupied').length;
            const roomPhotoCount = (room.images && room.images.length > 0) ? room.images.length : 1;

            return (
              <div key={room.id} className="room-admin-card">
                {/* Top Row: Thumbnail + Category details */}
                <div style={{ display: 'flex', gap: '0.85rem', padding: '0.85rem', borderBottom: '1px solid #F1F5F9' }}>
                  <div
                    onClick={() => {
                      const imgs = room.images && room.images.length > 0 ? room.images : [room.image];
                      setEditingRoom({ ...room, images: imgs });
                      setIsModalOpen(true);
                    }}
                    style={{
                      width: '84px',
                      height: '84px',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      position: 'relative',
                      flexShrink: 0,
                      backgroundColor: '#E2E8F0',
                      cursor: 'pointer',
                    }}
                    title="Click to manage room photos"
                  >
                    <Image
                      src={room.image}
                      alt={room.name}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="84px"
                    />
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '4px',
                        right: '4px',
                        backgroundColor: 'rgba(15, 23, 42, 0.85)',
                        color: '#F8FAFC',
                        fontSize: '0.62rem',
                        fontWeight: 700,
                        padding: '0.12rem 0.35rem',
                        borderRadius: '4px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px',
                        backdropFilter: 'blur(2px)',
                      }}
                    >
                      <Camera size={10} />
                      {roomPhotoCount}
                    </span>
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#0F172A' }}>
                          {room.name}
                        </h3>
                        <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 500 }}>
                          {room.bedType} • {room.roomSize} • Max {room.maxGuests} Guests
                        </span>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1E3A8A' }}>
                          ₦{room.price.toLocaleString()}
                        </div>
                        <span style={{ fontSize: '0.65rem', color: '#94A3B8' }}>/ night (incl. VAT)</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <button
                        onClick={() => {
                          const imgs = room.images && room.images.length > 0 ? room.images : [room.image];
                          setEditingRoom({ ...room, images: imgs });
                          setIsModalOpen(true);
                        }}
                        className="btn btn-sm"
                        style={{
                          padding: '0.25rem 0.55rem',
                          fontSize: '0.72rem',
                          border: '1px solid #CBD5E1',
                          backgroundColor: '#F8FAFC',
                          color: '#334155',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}
                      >
                        <Edit2 size={13} /> Edit Tier ({roomPhotoCount} 📷)
                      </button>

                      <button
                        onClick={() => handleDeleteCategory(room.id)}
                        className="btn btn-sm"
                        style={{
                          padding: '0.25rem 0.55rem',
                          fontSize: '0.72rem',
                          border: '1px solid #FECACA',
                          backgroundColor: '#FEF2F2',
                          color: '#DC2626',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </div>
                </div>

                {/* Units Inventory Section */}
                <div style={{ padding: '0.85rem', backgroundColor: '#FAFAFA' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1E293B' }}>
                        Room Units ({room.units.length})
                      </span>
                      <span
                        style={{
                          fontSize: '0.68rem',
                          padding: '0.15rem 0.45rem',
                          borderRadius: '9999px',
                          backgroundColor: availableUnits > 0 ? '#DCFCE7' : '#FEE2E2',
                          color: availableUnits > 0 ? '#166534' : '#991B1B',
                          fontWeight: 700,
                        }}
                      >
                        {availableUnits} Available
                      </span>
                      {occupiedUnits > 0 && (
                        <span
                          style={{
                            fontSize: '0.68rem',
                            padding: '0.15rem 0.45rem',
                            borderRadius: '9999px',
                            backgroundColor: '#EDE9FE',
                            color: '#5B21B6',
                            fontWeight: 700,
                          }}
                        >
                          {occupiedUnits} Occupied
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '0.68rem', color: '#94A3B8' }}>
                      Tap a unit to change status
                    </span>
                  </div>

                  {/* Units Pills list */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.65rem' }}>
                    {room.units.length === 0 ? (
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#94A3B8', fontStyle: 'italic' }}>
                        No room numbers added yet. Add one below!
                      </p>
                    ) : (
                      room.units.map((unit) => {
                        const cfg = STATUS_CONFIG[unit.status] || STATUS_CONFIG.available;
                        return (
                          <div
                            key={unit.id}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              borderRadius: '9999px',
                              backgroundColor: cfg.bg,
                              border: `1px solid ${cfg.border}`,
                              color: cfg.text,
                              overflow: 'hidden',
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => handleCycleUnitStatus(room.id, unit.id)}
                              style={{
                                background: 'none',
                                border: 'none',
                                padding: '0.3rem 0.55rem',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                color: 'inherit',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                              }}
                              title="Click to cycle status: Available -> Occupied -> Booked -> Maintenance"
                            >
                              <span>Room {unit.roomNumber}</span>
                              <span
                                style={{
                                  fontSize: '0.65rem',
                                  textTransform: 'uppercase',
                                  opacity: 0.85,
                                  fontWeight: 600,
                                }}
                              >
                                ({cfg.label})
                              </span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteUnit(room.id, unit.id)}
                              style={{
                                background: 'none',
                                border: 'none',
                                borderLeft: `1px solid ${cfg.border}`,
                                padding: '0.3rem 0.45rem',
                                color: cfg.text,
                                cursor: 'pointer',
                                opacity: 0.6,
                              }}
                              title="Remove unit"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Add Unit Input Form */}
                  <div style={{ display: 'flex', gap: '0.4rem', maxWidth: '320px' }}>
                    <input
                      type="text"
                      placeholder="Add Room Number (e.g. 105)"
                      value={newUnitNumber[room.id] || ''}
                      onChange={(e) => setNewUnitNumber({ ...newUnitNumber, [room.id]: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddUnit(room.id);
                        }
                      }}
                      style={{
                        flex: 1,
                        padding: '0.35rem 0.65rem',
                        fontSize: '0.78rem',
                        borderRadius: '6px',
                        border: '1px solid #CBD5E1',
                        backgroundColor: '#FFFFFF',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleAddUnit(room.id)}
                      className="btn btn-sm btn-primary"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', whiteSpace: 'nowrap' }}
                    >
                      <Plus size={14} /> Add
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal: Edit / Add Room Tier */}
        {isModalOpen && editingRoom && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(4px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'flex-end', // bottom-sheet on mobile
              justifyContent: 'center',
            }}
            onClick={() => setIsModalOpen(false)}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '560px',
                maxHeight: '90vh',
                backgroundColor: '#FFFFFF',
                borderTopLeftRadius: '20px',
                borderTopRightRadius: '20px',
                overflowY: 'auto',
                padding: '1.25rem',
                boxShadow: '0 -10px 40px rgba(0,0,0,0.2)',
                animation: 'slideUp 0.25s ease-out',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>
                  {editingRoom.name ? `Edit ${editingRoom.name}` : 'Create Room Category'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                    Room Name / Tier Title
                  </label>
                  <input
                    type="text"
                    value={editingRoom.name}
                    onChange={(e) => setEditingRoom({ ...editingRoom, name: e.target.value })}
                    placeholder="e.g. Deluxe 1, Executive Room"
                    style={{ width: '100%', padding: '0.6rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.875rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                      Price Per Night (₦)
                    </label>
                    <input
                      type="number"
                      value={editingRoom.price}
                      onChange={(e) => setEditingRoom({ ...editingRoom, price: Number(e.target.value) })}
                      style={{ width: '100%', padding: '0.6rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.875rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                      Max Guests
                    </label>
                    <input
                      type="number"
                      value={editingRoom.maxGuests}
                      onChange={(e) => setEditingRoom({ ...editingRoom, maxGuests: Number(e.target.value) })}
                      style={{ width: '100%', padding: '0.6rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.875rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                      Bed Configuration
                    </label>
                    <input
                      type="text"
                      value={editingRoom.bedType}
                      onChange={(e) => setEditingRoom({ ...editingRoom, bedType: e.target.value })}
                      placeholder="e.g. King Bed, Queen"
                      style={{ width: '100%', padding: '0.6rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.875rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                      Room Size
                    </label>
                    <input
                      type="text"
                      value={editingRoom.roomSize}
                      onChange={(e) => setEditingRoom({ ...editingRoom, roomSize: e.target.value })}
                      placeholder="e.g. 35 sqm"
                      style={{ width: '100%', padding: '0.6rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.875rem' }}
                    />
                  </div>
                </div>

                {/* Multi-Photo & Gallery Management Section */}
                {(() => {
                  const roomImages = (editingRoom.images && editingRoom.images.length > 0)
                    ? editingRoom.images
                    : (editingRoom.image ? [editingRoom.image] : ['/images/standard-room.jpg']);

                  return (
                    <div style={{ backgroundColor: '#F8FAFC', borderRadius: '12px', padding: '0.85rem', border: '1px solid #E2E8F0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                          Room Photos &amp; Carousel Gallery ({roomImages.length})
                        </label>
                        <span style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 600 }}>
                          {roomImages.length > 1 ? `${roomImages.length} Slides active` : '1 photo attached'}
                        </span>
                      </div>

                      {/* Dual Upload from Mobile Phone */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        {/* Multi-Photo Picker (Camera Roll / Gallery) */}
                        <label
                          style={{
                            backgroundColor: '#1E3A8A',
                            color: '#FFFFFF',
                            borderRadius: '8px',
                            fontWeight: 700,
                            fontSize: '0.78rem',
                            padding: '0.6rem 0.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px',
                            cursor: uploadStatus ? 'wait' : 'pointer',
                            textAlign: 'center',
                            boxShadow: '0 2px 4px rgba(30,58,138,0.2)',
                          }}
                        >
                          <UploadCloud size={18} />
                          <span>{uploadStatus ? 'Uploading...' : '📁 Multi-Photo'}</span>
                          <span style={{ fontSize: '0.65rem', opacity: 0.85 }}>Select Multiple from Phone</span>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleMultipleRoomPhotosUpload}
                            disabled={!!uploadStatus}
                            style={{ display: 'none' }}
                          />
                        </label>

                        {/* Direct Camera Capture */}
                        <label
                          style={{
                            backgroundColor: '#059669',
                            color: '#FFFFFF',
                            borderRadius: '8px',
                            fontWeight: 700,
                            fontSize: '0.78rem',
                            padding: '0.6rem 0.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px',
                            cursor: uploadStatus ? 'wait' : 'pointer',
                            textAlign: 'center',
                            boxShadow: '0 2px 4px rgba(5,150,105,0.2)',
                          }}
                        >
                          <Camera size={18} />
                          <span>{uploadStatus ? 'Processing...' : '📷 Live Camera'}</span>
                          <span style={{ fontSize: '0.65rem', opacity: 0.85 }}>Take Photo with Phone</span>
                          <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={handleMultipleRoomPhotosUpload}
                            disabled={!!uploadStatus}
                            style={{ display: 'none' }}
                          />
                        </label>
                      </div>

                      {/* Upload Status Banner */}
                      {uploadStatus && (
                        <div
                          style={{
                            backgroundColor: '#FEF3C7',
                            border: '1px solid #FCD34D',
                            borderRadius: '8px',
                            padding: '0.5rem 0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginBottom: '0.75rem',
                            fontSize: '0.75rem',
                            color: '#92400E',
                            fontWeight: 600,
                          }}
                        >
                          <Loader2 size={16} className="animate-spin" />
                          <span>{uploadStatus}</span>
                        </div>
                      )}

                      {/* Live Carousel Preview inside Modal */}
                      {roomImages.length > 0 && (
                        <div style={{ marginBottom: '0.75rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569' }}>
                              Guest Carousel Preview:
                            </span>
                            <span style={{ fontSize: '0.68rem', color: '#94A3B8' }}>
                              Swipe / tap arrows to test
                            </span>
                          </div>
                          <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid #CBD5E1' }}>
                            <RoomImageCarousel
                              images={roomImages}
                              roomName={editingRoom.name || 'Room Preview'}
                              height="180px"
                            />
                          </div>
                        </div>
                      )}

                      {/* Photo Management Gallery */}
                      <div style={{ marginBottom: '0.6rem' }}>
                        <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#475569', marginBottom: '0.35rem' }}>
                          Manage Gallery Photos ({roomImages.length}):
                        </span>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(95px, 1fr))', gap: '0.5rem' }}>
                          {roomImages.map((imgUrl, idx) => (
                            <div
                              key={`${imgUrl}-${idx}`}
                              style={{
                                borderRadius: '8px',
                                overflow: 'hidden',
                                border: idx === 0 ? '2px solid #D97706' : '1px solid #CBD5E1',
                                backgroundColor: '#FFFFFF',
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                              }}
                            >
                              <div style={{ position: 'relative', width: '100%', height: '65px', backgroundColor: '#0F172A' }}>
                                <Image
                                  src={imgUrl}
                                  alt={`Photo ${idx + 1}`}
                                  fill
                                  style={{ objectFit: 'cover' }}
                                />
                                {idx === 0 && (
                                  <span
                                    style={{
                                      position: 'absolute',
                                      top: '3px',
                                      left: '3px',
                                      backgroundColor: '#D97706',
                                      color: '#FFFFFF',
                                      fontSize: '0.55rem',
                                      fontWeight: 800,
                                      padding: '0.08rem 0.3rem',
                                      borderRadius: '3px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '2px',
                                    }}
                                  >
                                    <Star size={8} fill="#FFFFFF" /> Cover
                                  </span>
                                )}
                              </div>

                              {/* Photo actions row */}
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.2rem 0.25rem', backgroundColor: '#F1F5F9' }}>
                                <div style={{ display: 'flex', gap: '2px' }}>
                                  <button
                                    type="button"
                                    onClick={() => handleMovePhoto(idx, 'left')}
                                    disabled={idx === 0}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      padding: '2px',
                                      cursor: idx === 0 ? 'not-allowed' : 'pointer',
                                      opacity: idx === 0 ? 0.3 : 1,
                                      color: '#334155',
                                    }}
                                    title="Move earlier in carousel"
                                  >
                                    <ChevronLeft size={13} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleMovePhoto(idx, 'right')}
                                    disabled={idx === roomImages.length - 1}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      padding: '2px',
                                      cursor: idx === roomImages.length - 1 ? 'not-allowed' : 'pointer',
                                      opacity: idx === roomImages.length - 1 ? 0.3 : 1,
                                      color: '#334155',
                                    }}
                                    title="Move later in carousel"
                                  >
                                    <ChevronRight size={13} />
                                  </button>
                                </div>

                                {idx !== 0 && (
                                  <button
                                    type="button"
                                    onClick={() => handleSetCoverPhoto(idx)}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      padding: '2px',
                                      cursor: 'pointer',
                                      color: '#D97706',
                                      fontSize: '0.62rem',
                                      fontWeight: 700,
                                    }}
                                    title="Set as first photo"
                                  >
                                    Cover
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={() => handleDeletePhoto(idx)}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    padding: '2px',
                                    cursor: 'pointer',
                                    color: '#DC2626',
                                  }}
                                  title="Remove photo"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Add Image by URL fallback */}
                      <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.4rem' }}>
                        <input
                          type="text"
                          placeholder="Or paste image URL / path..."
                          value={newCustomImageUrl}
                          onChange={(e) => setNewCustomImageUrl(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddCustomImageUrl();
                            }
                          }}
                          style={{
                            flex: 1,
                            padding: '0.35rem 0.55rem',
                            border: '1px solid #CBD5E1',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            backgroundColor: '#FFFFFF',
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleAddCustomImageUrl}
                          className="btn btn-sm btn-secondary"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.72rem', whiteSpace: 'nowrap' }}
                        >
                          <Plus size={12} /> Add URL
                        </button>
                      </div>
                    </div>
                  );
                })()}

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={editingRoom.description}
                    onChange={(e) => setEditingRoom({ ...editingRoom, description: e.target.value })}
                    placeholder="Short description highlighting room elegance and amenities..."
                    style={{ width: '100%', padding: '0.6rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.875rem' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.65rem', marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={handleSaveRoomDetails}
                    className="btn btn-primary"
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    <Save size={16} /> Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="btn btn-secondary"
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Save Toast Notification */}
        {saveToast && (
          <div
            style={{
              position: 'fixed',
              bottom: '75px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#1E293B',
              color: '#FFFFFF',
              padding: '0.6rem 1.2rem',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.85rem',
              fontWeight: 600,
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              zIndex: 1100,
            }}
          >
            <CheckCircle2 size={16} style={{ color: '#4ADE80' }} />
            <span>Inventory changes saved!</span>
          </div>
        )}
      </main>
    </div>
  );
}
