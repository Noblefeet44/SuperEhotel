'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Bed, ArrowLeft, Plus, Edit2, Trash2, Save, X,
  Users, CheckCircle2, AlertCircle, Search, RefreshCw,
  SlidersHorizontal, Check, PlusCircle, UploadCloud, Camera,
  Image as ImageIcon, ChevronLeft, ChevronRight, Star, Loader2,
  Wrench, UserCheck, ShieldAlert, Sparkles
} from 'lucide-react';
import {
  RoomCategoryData, RoomUnit,
  getStoredRoomsData, saveStoredRoomsData, mergeRoomsWithServer, markPhotoAsDeleted
} from '@/lib/hotel-data';
import { AdminMobileNav } from '@/components/admin/AdminMobileNav';
import { RoomImageCarousel } from '@/components/rooms/RoomImageCarousel';

type RoomStatus = 'available' | 'occupied' | 'booked' | 'maintenance';

const STATUS_CONFIG: Record<RoomStatus, { label: string; dot: string; bg: string; text: string; border: string }> = {
  available: { label: 'Available', dot: '🟢', bg: '#DCFCE7', text: '#166534', border: '#86EFAC' },
  occupied: { label: 'Occupied', dot: '🟣', bg: '#EDE9FE', text: '#5B21B6', border: '#C4B5FD' },
  maintenance: { label: 'In Maintenance', dot: '🟡', bg: '#FEF3C7', text: '#92400E', border: '#FCD34D' },
  booked: { label: 'Booked', dot: '🔵', bg: '#DBEAFE', text: '#1E40AF', border: '#93C5FD' },
};

// Client-side image compressor for 100% upload reliability
function compressImageFile(file: File, maxWidth = 1600, maxHeight = 1200, quality = 0.82): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new (window as any).Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } else {
          resolve(event.target?.result as string);
        }
      };
      img.onerror = () => resolve(event.target?.result as string);
      img.src = event.target?.result as string;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

export default function AdminRoomsPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<RoomCategoryData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [editingRoom, setEditingRoom] = useState<RoomCategoryData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [newUnitNumber, setNewUnitNumber] = useState<{ [roomId: string]: string }>({});
  const [newUnitFloor, setNewUnitFloor] = useState<{ [roomId: string]: string }>({});
  const [newUnitStatus, setNewUnitStatus] = useState<{ [roomId: string]: RoomStatus }>({});
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [newCustomImageUrl, setNewCustomImageUrl] = useState('');
  const [isSavingRoomDetails, setIsSavingRoomDetails] = useState(false);
  const [isUpdatingGallery, setIsUpdatingGallery] = useState(false);

  const triggerSaveNotification = (msg: string = 'Changes saved successfully!') => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 2800);
  };

  // Helper to persist room updates immediately to React state, localStorage and server API
  const persistRoomChange = async (updatedRoom: RoomCategoryData) => {
    setIsUpdatingGallery(true);
    setEditingRoom(updatedRoom);
    const exists = rooms.some((r) => r.id === updatedRoom.id || r.slug === updatedRoom.slug);
    const updatedRooms = exists
      ? rooms.map((r) => (r.id === updatedRoom.id || r.slug === updatedRoom.slug ? updatedRoom : r))
      : [...rooms, updatedRoom];
    setRooms(updatedRooms);
    saveStoredRoomsData(updatedRooms);

    try {
      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRoom),
      });
      const data = await res.json();
      if (data.success && data.rooms) {
        const merged = mergeRoomsWithServer(data.rooms);
        setRooms(merged);
        const refreshed = merged.find((r) => r.id === updatedRoom.id || r.slug === updatedRoom.slug);
        if (refreshed) {
          setEditingRoom(refreshed);
        }
      }
    } catch (err) {
      console.warn('Server room sync warning:', err);
    } finally {
      setIsUpdatingGallery(false);
    }
  };

  // Directly update a specific room unit's status (Available, Occupied, Maintenance, Booked)
  const handleUpdateUnitStatus = async (roomId: string, unitId: string, status: RoomStatus) => {
    let unitRoomNum = '';
    const updated = rooms.map((r) => {
      if (r.id !== roomId && r.slug !== roomId) return r;
      const updatedUnits = r.units.map((u) => {
        if (u.id !== unitId) return u;
        unitRoomNum = u.roomNumber;
        return { ...u, status };
      });
      return { ...r, units: updatedUnits };
    });

    setRooms(updated);
    saveStoredRoomsData(updated);
    triggerSaveNotification(`Room ${unitRoomNum || unitId} marked as ${STATUS_CONFIG[status].label}`);

    try {
      await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_unit_status',
          roomId,
          unitId,
          status,
        }),
      });
    } catch (err) {
      console.warn('Server update unit status warning:', err);
    }
  };

  // Cycle room unit status on click
  const handleCycleUnitStatus = (roomId: string, unitId: string) => {
    const statuses: RoomStatus[] = ['available', 'occupied', 'maintenance', 'booked'];
    const currentRoom = rooms.find((r) => r.id === roomId || r.slug === roomId);
    const currentUnit = currentRoom?.units.find((u) => u.id === unitId);
    if (!currentUnit) return;

    const nextIdx = (statuses.indexOf(currentUnit.status as RoomStatus) + 1) % statuses.length;
    handleUpdateUnitStatus(roomId, unitId, statuses[nextIdx]);
  };

  // Batch mark all units in a room tier (e.g. Mark All Available, Mark All In Maintenance)
  const handleBatchMarkAll = async (roomId: string, status: RoomStatus) => {
    const targetRoom = rooms.find((r) => r.id === roomId || r.slug === roomId);
    if (!targetRoom) return;

    const updated = rooms.map((r) => {
      if (r.id !== roomId && r.slug !== roomId) return r;
      const updatedUnits = r.units.map((u) => ({ ...u, status }));
      return { ...r, status, units: updatedUnits };
    });

    setRooms(updated);
    saveStoredRoomsData(updated);
    triggerSaveNotification(`All ${targetRoom.name} units marked as ${STATUS_CONFIG[status].label}`);

    try {
      await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'mark_all_units',
          roomId,
          status,
        }),
      });
    } catch (err) {
      console.warn('Server batch mark warning:', err);
    }
  };

  // Change tier overall status
  const handleCategoryStatusChange = async (roomId: string, status: RoomStatus) => {
    const targetRoom = rooms.find((r) => r.id === roomId || r.slug === roomId);
    if (!targetRoom) return;

    const updated = rooms.map((r) => {
      if (r.id !== roomId && r.slug !== roomId) return r;
      return { ...r, status };
    });

    setRooms(updated);
    saveStoredRoomsData(updated);
    triggerSaveNotification(`${targetRoom.name} tier status set to ${STATUS_CONFIG[status].label}`);

    try {
      await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_tier_status',
          roomId,
          status,
        }),
      });
    } catch (err) {
      console.warn('Server tier status warning:', err);
    }
  };

  // Add a new room unit
  const handleAddUnit = async (roomId: string) => {
    const num = (newUnitNumber[roomId] || '').trim();
    if (!num) return;

    const floor = (newUnitFloor[roomId] || '1st Floor').trim();
    const status: RoomStatus = newUnitStatus[roomId] || 'available';

    let addedUnit: RoomUnit | null = null;
    let targetRoomPayload: RoomCategoryData | null = null;

    const updated = rooms.map((r) => {
      if (r.id !== roomId && r.slug !== roomId) return r;
      const newUnit: RoomUnit = {
        id: `${r.id}-${num.replace(/\s+/g, '')}-${Date.now()}`,
        roomNumber: num,
        floor: floor,
        status: status,
      };
      addedUnit = newUnit;
      targetRoomPayload = { ...r, units: [...r.units, newUnit] };
      return targetRoomPayload;
    });

    setRooms(updated);
    saveStoredRoomsData(updated);
    setNewUnitNumber({ ...newUnitNumber, [roomId]: '' });
    triggerSaveNotification(`Room ${num} added (${STATUS_CONFIG[status].label})`);

    if (targetRoomPayload) {
      try {
        await fetch('/api/rooms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(targetRoomPayload),
        });
      } catch (err) {
        console.warn('Server add unit sync warning:', err);
      }
    }
  };

  // Remove a room unit
  const handleDeleteUnit = async (roomId: string, unitId: string) => {
    if (!confirm('Remove this room unit from inventory?')) return;
    let targetRoomPayload: RoomCategoryData | null = null;

    const updated = rooms.map((r) => {
      if (r.id !== roomId && r.slug !== roomId) return r;
      const filteredUnits = r.units.filter((u) => u.id !== unitId);
      targetRoomPayload = { ...r, units: filteredUnits };
      return targetRoomPayload;
    });

    setRooms(updated);
    saveStoredRoomsData(updated);
    triggerSaveNotification('Room unit removed from inventory');

    if (targetRoomPayload) {
      try {
        await fetch('/api/rooms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(targetRoomPayload),
        });
      } catch (err) {
        console.warn('Server delete unit sync warning:', err);
      }
    }
  };

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
          headers: {
            'X-Admin-Auth': 'true',
          },
          credentials: 'include',
          body: formData,
        });

        const data = await res.json();
        if (data.success && data.url) {
          uploadedUrls.push(data.url);
        } else {
          console.warn('API upload response notice:', data.error);
          alert(data.error || 'Failed to upload photo');
        }
      } catch (err) {
        console.warn('API upload network error:', err);
        alert('Network error while uploading photo. Please check your connection.');
      }
    }

    if (uploadedUrls.length > 0) {
      const rawImgs = editingRoom.images && editingRoom.images.length > 0
        ? [...editingRoom.images]
        : (editingRoom.image ? [editingRoom.image] : []);
      // If only standard placeholder was present, replace it with the actual user photos
      const filteredExisting = rawImgs.filter((img) => img !== '/images/standard-room.jpg');
      const combined = filteredExisting.length > 0 ? [...filteredExisting, ...uploadedUrls] : [...uploadedUrls];
      const updatedRoom: RoomCategoryData = {
        ...editingRoom,
        image: combined[0],
        images: combined,
      };
      await persistRoomChange(updatedRoom);
      triggerSaveNotification(`${uploadedUrls.length} photo${uploadedUrls.length > 1 ? 's' : ''} uploaded and live on website!`);
    }

    setUploadStatus(null);
    e.target.value = '';
  };

  // Reorder photo left or right
  const handleMovePhoto = async (index: number, direction: 'left' | 'right') => {
    if (!editingRoom) return;
    const currentImgs = editingRoom.images && editingRoom.images.length > 0
      ? [...editingRoom.images]
      : [editingRoom.image];
    const targetIdx = direction === 'left' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= currentImgs.length) return;

    const temp = currentImgs[index];
    currentImgs[index] = currentImgs[targetIdx];
    currentImgs[targetIdx] = temp;

    const updatedRoom: RoomCategoryData = {
      ...editingRoom,
      image: currentImgs[0],
      images: currentImgs,
    };
    await persistRoomChange(updatedRoom);
    triggerSaveNotification('Photo order updated');
  };

  // Set chosen image as primary cover photo
  const handleSetCoverPhoto = async (index: number) => {
    if (!editingRoom) return;
    const currentImgs = editingRoom.images && editingRoom.images.length > 0
      ? [...editingRoom.images]
      : [editingRoom.image];
    if (index <= 0 || index >= currentImgs.length) return;

    const [selected] = currentImgs.splice(index, 1);
    currentImgs.unshift(selected);

    const updatedRoom: RoomCategoryData = {
      ...editingRoom,
      image: selected,
      images: currentImgs,
    };
    await persistRoomChange(updatedRoom);
    triggerSaveNotification('Cover photo updated');
  };

  // Delete an image from gallery
  const handleDeletePhoto = async (index: number) => {
    if (!editingRoom) return;
    const currentImgs = editingRoom.images && editingRoom.images.length > 0
      ? [...editingRoom.images]
      : [editingRoom.image];

    if (currentImgs.length <= 1) {
      alert('Each room tier must have at least 1 photo. Please upload a new photo before deleting this one.');
      return;
    }

    const filtered = currentImgs.filter((_, i) => i !== index);
    const updatedRoom: RoomCategoryData = {
      ...editingRoom,
      image: filtered[0] || '/images/standard-room.jpg',
      images: filtered,
    };

    await persistRoomChange(updatedRoom);
    triggerSaveNotification('Photo permanently deleted and removed from carousels');
  };

  // Add custom URL image
  const handleAddCustomImageUrl = async () => {
    const url = newCustomImageUrl.trim();
    if (!url || !editingRoom) return;

    const rawImgs = editingRoom.images && editingRoom.images.length > 0
      ? [...editingRoom.images]
      : (editingRoom.image ? [editingRoom.image] : []);

    const filteredExisting = rawImgs.filter((img) => img !== '/images/standard-room.jpg');
    const combined = filteredExisting.length > 0 ? [...filteredExisting, url] : [url];

    const updatedRoom: RoomCategoryData = {
      ...editingRoom,
      image: combined[0],
      images: combined,
    };
    await persistRoomChange(updatedRoom);
    setNewCustomImageUrl('');
    triggerSaveNotification('Photo added to gallery');
  };

  // Save room category details (price, name, etc.)
  const handleSaveRoomDetails = async () => {
    if (!editingRoom || isSavingRoomDetails) return;

    const trimmedName = (editingRoom.name || '').trim();
    if (!trimmedName) {
      alert('Please enter a room name / tier title.');
      return;
    }

    setIsSavingRoomDetails(true);

    const cleanSlug = editingRoom.slug && !editingRoom.slug.startsWith('new-tier-')
      ? editingRoom.slug
      : trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const cleanId = editingRoom.id && !editingRoom.id.startsWith('tier-')
      ? editingRoom.id
      : cleanSlug;

    const currentImgs = editingRoom.images && editingRoom.images.length > 0
      ? editingRoom.images.filter(Boolean)
      : (editingRoom.image ? [editingRoom.image] : ['/images/standard-room.jpg']);

    const defaultUnits = (editingRoom.units && editingRoom.units.length > 0)
      ? editingRoom.units
      : [
          {
            id: `${cleanSlug}-101`,
            roomNumber: '101',
            floor: '1st Floor',
            status: (editingRoom.status as any) || 'available',
          },
        ];

    const roomToSave: RoomCategoryData = {
      ...editingRoom,
      id: cleanId,
      slug: cleanSlug,
      name: trimmedName,
      image: currentImgs[0] || '/images/standard-room.jpg',
      images: currentImgs.length > 0 ? currentImgs : ['/images/standard-room.jpg'],
      status: editingRoom.status || 'available',
      units: defaultUnits,
    };

    const exists = rooms.some((r) => r.id === roomToSave.id || r.slug === roomToSave.slug || r.id === editingRoom.id);
    let updated: RoomCategoryData[];

    if (exists) {
      updated = rooms.map((r) => (r.id === roomToSave.id || r.slug === roomToSave.slug || r.id === editingRoom.id ? roomToSave : r));
    } else {
      updated = [...rooms, roomToSave];
    }

    setRooms(updated);
    saveStoredRoomsData(updated);

    try {
      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roomToSave),
      });
      const data = await res.json();
      if (data.success && data.rooms) {
        const merged = mergeRoomsWithServer(data.rooms);
        setRooms(merged);
      }
    } catch (err) {
      console.warn('Server room save notice:', err);
    } finally {
      setIsSavingRoomDetails(false);
    }

    setIsModalOpen(false);
    setEditingRoom(null);
    triggerSaveNotification(`${roomToSave.name} saved successfully!`);
  };

  // Delete an entire room tier
  const handleDeleteCategory = async (roomId: string) => {
    if (!confirm('Are you sure you want to delete this room category and all its inventory?')) return;
    const updated = rooms.filter((r) => r.id !== roomId && r.slug !== roomId);
    setRooms(updated);
    saveStoredRoomsData(updated);

    try {
      await fetch(`/api/rooms?roomId=${encodeURIComponent(roomId)}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.warn('API DELETE room category notice:', err);
    }

    triggerSaveNotification('Room category removed');
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('admin_authenticated') !== 'true') {
      router.push('/admin/login');
      return;
    }

    // Load validated local storage first
    const initial = getStoredRoomsData();
    setRooms(initial);

    // Fetch live from server API and reconcile safely
    fetch('/api/rooms')
      .then((res) => res.json())
      .then((data) => {
        const live = Array.isArray(data) ? data : (data.rooms || []);
        if (live.length > 0) {
          const merged = mergeRoomsWithServer(live);
          setRooms(merged);
        }
      })
      .catch((err) => console.warn('Could not fetch server rooms:', err));
  }, [router]);

  // Global counts
  const totalUnitsCount = rooms.reduce((acc, r) => acc + r.units.length, 0);
  const availableUnitsCount = rooms.reduce((acc, r) => acc + r.units.filter(u => u.status === 'available').length, 0);
  const occupiedUnitsCount = rooms.reduce((acc, r) => acc + r.units.filter(u => u.status === 'occupied').length, 0);
  const maintenanceUnitsCount = rooms.reduce((acc, r) => acc + r.units.filter(u => u.status === 'maintenance').length, 0);
  const bookedUnitsCount = rooms.reduce((acc, r) => acc + r.units.filter(u => u.status === 'booked').length, 0);

  // Filtered rooms
  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.units.some(u => u.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || room.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesStatus = selectedStatusFilter === 'all' || 
      (room.status === selectedStatusFilter) ||
      room.units.some(u => u.status === selectedStatusFilter);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = ['all', ...Array.from(new Set(rooms.map((r) => r.category.toLowerCase())))];

  return (
    <div className="admin-layout" style={{ maxWidth: '100vw', overflowX: 'hidden', width: '100%', boxSizing: 'border-box' }}>
      {/* Mobile Top Navigation */}
      <AdminMobileNav
        title="Rooms & Inventory"
        subtitle={`${rooms.length} Official Tiers • ${totalUnitsCount} Units`}
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
        <div className="admin-header" style={{ marginBottom: '1rem', width: '100%', boxSizing: 'border-box' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: '#0F172A' }}>
              Room Categories &amp; Room Units Management
            </h1>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#64748B' }}>
              Easily mark room units as <strong>Available</strong>, <strong>Occupied</strong>, <strong>In Maintenance</strong>, or <strong>Booked</strong> with real-time sync.
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
                price: 45000,
                status: 'available',
                maxGuests: 2,
                bedType: 'King Bed',
                roomSize: '30 sqm',
                image: '/images/standard-room.jpg',
                images: ['/images/standard-room.jpg'],
                description: 'Luxury accommodation designed for supreme comfort, peace, and relaxation with modern amenities.',
                facilities: ['Air Conditioning', 'Flat Screen TV', 'High-Speed Wi-Fi', 'Hot Water', 'Ensuite Bathroom', 'Room Service'],
                units: [
                  {
                    id: `unit-${Date.now()}-101`,
                    roomNumber: '101',
                    floor: '1st Floor',
                    status: 'available',
                  },
                ],
              });
              setIsModalOpen(true);
            }}
          >
            <Plus size={16} /> Add Room Tier
          </button>
        </div>

        {/* Global Inventory Status Metrics Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '0.65rem',
            marginBottom: '1.25rem',
            width: '100%',
          }}
        >
          {/* Total Units */}
          <div
            onClick={() => setSelectedStatusFilter('all')}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              backgroundColor: '#FFFFFF',
              border: selectedStatusFilter === 'all' ? '2px solid #1E3A8A' : '1px solid #E2E8F0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A' }}>{totalUnitsCount}</div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>Total Units</div>
          </div>

          {/* Available Units */}
          <div
            onClick={() => setSelectedStatusFilter('available')}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              backgroundColor: '#F0FDF4',
              border: selectedStatusFilter === 'available' ? '2px solid #16A34A' : '1px solid #BBF7D0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#166534', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>🟢</span> {availableUnitsCount}
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#15803D' }}>Available</div>
          </div>

          {/* Occupied Units */}
          <div
            onClick={() => setSelectedStatusFilter('occupied')}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              backgroundColor: '#FAF5FF',
              border: selectedStatusFilter === 'occupied' ? '2px solid #9333EA' : '1px solid #DDD6FE',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#5B21B6', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>🟣</span> {occupiedUnitsCount}
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6B21A8' }}>Occupied</div>
          </div>

          {/* In Maintenance Units */}
          <div
            onClick={() => setSelectedStatusFilter('maintenance')}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              backgroundColor: '#FFFBEB',
              border: selectedStatusFilter === 'maintenance' ? '2px solid #D97706' : '1px solid #FDE68A',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#92400E', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>🟡</span> {maintenanceUnitsCount}
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#B45309' }}>In Maintenance</div>
          </div>

          {/* Booked Units */}
          <div
            onClick={() => setSelectedStatusFilter('booked')}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              backgroundColor: '#EFF6FF',
              border: selectedStatusFilter === 'booked' ? '2px solid #2563EB' : '1px solid #BFDBFE',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1E40AF', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>🔵</span> {bookedUnitsCount}
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1D4ED8' }}>Booked</div>
          </div>
        </div>

        {/* Quick Filter Tabs & Search */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem' }}>
          <div style={{ position: 'relative' }}>
            <Search
              size={18}
              style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}
            />
            <input
              type="text"
              placeholder="Search category, room number (e.g. 101, 204, Deluxe)..."
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

          {/* Status Filter Buttons */}
          <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.2rem', scrollbarWidth: 'none' }}>
            <button
              type="button"
              onClick={() => setSelectedStatusFilter('all')}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 700,
                border: selectedStatusFilter === 'all' ? '2px solid #0F172A' : '1px solid #CBD5E1',
                backgroundColor: selectedStatusFilter === 'all' ? '#0F172A' : '#FFFFFF',
                color: selectedStatusFilter === 'all' ? '#FFFFFF' : '#334155',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              All Statuses ({totalUnitsCount})
            </button>
            <button
              type="button"
              onClick={() => setSelectedStatusFilter('available')}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 700,
                border: selectedStatusFilter === 'available' ? '2px solid #16A34A' : '1px solid #BBF7D0',
                backgroundColor: selectedStatusFilter === 'available' ? '#16A34A' : '#F0FDF4',
                color: selectedStatusFilter === 'available' ? '#FFFFFF' : '#166534',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              🟢 Available ({availableUnitsCount})
            </button>
            <button
              type="button"
              onClick={() => setSelectedStatusFilter('occupied')}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 700,
                border: selectedStatusFilter === 'occupied' ? '2px solid #9333EA' : '1px solid #DDD6FE',
                backgroundColor: selectedStatusFilter === 'occupied' ? '#9333EA' : '#FAF5FF',
                color: selectedStatusFilter === 'occupied' ? '#FFFFFF' : '#5B21B6',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              🟣 Occupied ({occupiedUnitsCount})
            </button>
            <button
              type="button"
              onClick={() => setSelectedStatusFilter('maintenance')}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 700,
                border: selectedStatusFilter === 'maintenance' ? '2px solid #D97706' : '1px solid #FDE68A',
                backgroundColor: selectedStatusFilter === 'maintenance' ? '#D97706' : '#FFFBEB',
                color: selectedStatusFilter === 'maintenance' ? '#FFFFFF' : '#92400E',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              🟡 In Maintenance ({maintenanceUnitsCount})
            </button>
            <button
              type="button"
              onClick={() => setSelectedStatusFilter('booked')}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 700,
                border: selectedStatusFilter === 'booked' ? '2px solid #2563EB' : '1px solid #BFDBFE',
                backgroundColor: selectedStatusFilter === 'booked' ? '#2563EB' : '#EFF6FF',
                color: selectedStatusFilter === 'booked' ? '#FFFFFF' : '#1E40AF',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              🔵 Booked ({bookedUnitsCount})
            </button>
          </div>
        </div>

        {/* Room Categories Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredRooms.map((room) => {
            const availableUnits = room.units.filter((u) => u.status === 'available').length;
            const occupiedUnits = room.units.filter((u) => u.status === 'occupied').length;
            const maintenanceUnits = room.units.filter((u) => u.status === 'maintenance').length;
            const bookedUnits = room.units.filter((u) => u.status === 'booked').length;
            const roomPhotoCount = (room.images && room.images.length > 0) ? room.images.length : 1;
            const tierStatus: RoomStatus = (room.status as RoomStatus) || 'available';
            const tierStatusCfg = STATUS_CONFIG[tierStatus] || STATUS_CONFIG.available;

            return (
              <div
                key={room.id}
                className="room-admin-card"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '14px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  overflow: 'hidden',
                }}
              >
                {/* Top Row: Thumbnail + Category details + Tier Status Selector */}
                <div style={{ display: 'flex', gap: '1rem', padding: '1rem', borderBottom: '1px solid #F1F5F9', flexWrap: 'wrap' }}>
                  <div
                    onClick={() => {
                      const imgs = room.images && room.images.length > 0 ? room.images : [room.image];
                      setEditingRoom({ ...room, images: imgs });
                      setIsModalOpen(true);
                    }}
                    style={{
                      width: '90px',
                      height: '90px',
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
                      sizes="90px"
                      unoptimized={Boolean(room.image?.startsWith('data:'))}
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

                  <div style={{ flex: 1, minWidth: '240px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
                            {room.name}
                          </h3>
                          {/* Tier Status Dropdown */}
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                            <label style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748B' }}>Tier Status:</label>
                            <select
                              value={tierStatus}
                              onChange={(e) => handleCategoryStatusChange(room.id, e.target.value as RoomStatus)}
                              style={{
                                padding: '0.2rem 0.5rem',
                                borderRadius: '9999px',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                backgroundColor: tierStatusCfg.bg,
                                color: tierStatusCfg.text,
                                border: `1.5px solid ${tierStatusCfg.border}`,
                                cursor: 'pointer',
                              }}
                            >
                              <option value="available">🟢 Available</option>
                              <option value="occupied">🟣 Occupied</option>
                              <option value="maintenance">🟡 In Maintenance</option>
                              <option value="booked">🔵 Booked</option>
                            </select>
                          </div>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500, display: 'block', marginTop: '0.2rem' }}>
                          {room.bedType} • {room.roomSize} • Max {room.maxGuests} Guests
                        </span>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1E3A8A' }}>
                          ₦{room.price.toLocaleString()}
                        </div>
                        <span style={{ fontSize: '0.65rem', color: '#94A3B8' }}>/ night (incl. 10% SC &amp; 7% VAT)</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.6rem', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => {
                          const imgs = room.images && room.images.length > 0 ? room.images : [room.image];
                          setEditingRoom({ ...room, images: imgs });
                          setIsModalOpen(true);
                        }}
                        className="btn btn-sm"
                        style={{
                          padding: '0.28rem 0.65rem',
                          fontSize: '0.75rem',
                          border: '1px solid #CBD5E1',
                          backgroundColor: '#F8FAFC',
                          color: '#334155',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          fontWeight: 600,
                        }}
                      >
                        <Edit2 size={13} /> Edit Tier &amp; Photos ({roomPhotoCount} 📷)
                      </button>

                      <button
                        onClick={() => handleDeleteCategory(room.id)}
                        className="btn btn-sm"
                        style={{
                          padding: '0.28rem 0.6rem',
                          fontSize: '0.75rem',
                          border: '1px solid #FECACA',
                          backgroundColor: '#FEF2F2',
                          color: '#DC2626',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}
                      >
                        <Trash2 size={13} /> Delete Tier
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick Batch Actions Toolbar */}
                <div
                  style={{
                    backgroundColor: '#F8FAFC',
                    padding: '0.5rem 1rem',
                    borderBottom: '1px solid #F1F5F9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', fontWeight: 700, color: '#475569' }}>
                    <Sparkles size={13} color="#D97706" />
                    <span>Quick Mark All {room.units.length} Units in {room.name}:</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => handleBatchMarkAll(room.id, 'available')}
                      style={{
                        padding: '0.22rem 0.55rem',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        borderRadius: '6px',
                        border: '1px solid #86EFAC',
                        backgroundColor: '#DCFCE7',
                        color: '#166534',
                        cursor: 'pointer',
                      }}
                      title="Set all units in this room tier to Available"
                    >
                      🟢 Mark All Available
                    </button>
                    <button
                      type="button"
                      onClick={() => handleBatchMarkAll(room.id, 'occupied')}
                      style={{
                        padding: '0.22rem 0.55rem',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        borderRadius: '6px',
                        border: '1px solid #C4B5FD',
                        backgroundColor: '#EDE9FE',
                        color: '#5B21B6',
                        cursor: 'pointer',
                      }}
                      title="Set all units in this room tier to Occupied"
                    >
                      🟣 Mark All Occupied
                    </button>
                    <button
                      type="button"
                      onClick={() => handleBatchMarkAll(room.id, 'maintenance')}
                      style={{
                        padding: '0.22rem 0.55rem',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        borderRadius: '6px',
                        border: '1px solid #FCD34D',
                        backgroundColor: '#FEF3C7',
                        color: '#92400E',
                        cursor: 'pointer',
                      }}
                      title="Set all units in this room tier to Maintenance"
                    >
                      🟡 Mark In Maintenance
                    </button>
                  </div>
                </div>

                {/* Units Inventory Section */}
                <div style={{ padding: '1rem', backgroundColor: '#FAFAFA' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.75rem',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1E293B' }}>
                        Room Units ({room.units.length})
                      </span>
                      <span
                        style={{
                          fontSize: '0.68rem',
                          padding: '0.15rem 0.45rem',
                          borderRadius: '9999px',
                          backgroundColor: '#DCFCE7',
                          color: '#166534',
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
                      {maintenanceUnits > 0 && (
                        <span
                          style={{
                            fontSize: '0.68rem',
                            padding: '0.15rem 0.45rem',
                            borderRadius: '9999px',
                            backgroundColor: '#FEF3C7',
                            color: '#92400E',
                            fontWeight: 700,
                          }}
                        >
                          {maintenanceUnits} In Maintenance
                        </span>
                      )}
                      {bookedUnits > 0 && (
                        <span
                          style={{
                            fontSize: '0.68rem',
                            padding: '0.15rem 0.45rem',
                            borderRadius: '9999px',
                            backgroundColor: '#DBEAFE',
                            color: '#1E40AF',
                            fontWeight: 700,
                          }}
                        >
                          {bookedUnits} Booked
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 500 }}>
                      Change status below or click unit to cycle
                    </span>
                  </div>

                  {/* Units Interactive Cards Grid */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(185px, 1fr))',
                      gap: '0.6rem',
                      marginBottom: '1rem',
                    }}
                  >
                    {room.units.length === 0 ? (
                      <div style={{ padding: '0.75rem', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px dashed #CBD5E1', gridColumn: '1 / -1' }}>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#94A3B8', fontStyle: 'italic' }}>
                          No room unit numbers added yet for this tier. Add one using the form below!
                        </p>
                      </div>
                    ) : (
                      room.units.map((unit) => {
                        const unitStatus: RoomStatus = (unit.status as RoomStatus) || 'available';
                        const cfg = STATUS_CONFIG[unitStatus] || STATUS_CONFIG.available;

                        return (
                          <div
                            key={unit.id}
                            style={{
                              backgroundColor: cfg.bg,
                              border: `1.5px solid ${cfg.border}`,
                              borderRadius: '10px',
                              padding: '0.55rem 0.65rem',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.35rem',
                              boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <button
                                type="button"
                                onClick={() => handleCycleUnitStatus(room.id, unit.id)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  padding: 0,
                                  fontSize: '0.88rem',
                                  fontWeight: 800,
                                  color: '#0F172A',
                                  cursor: 'pointer',
                                  textAlign: 'left',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                }}
                                title="Click to cycle status"
                              >
                                <span>Room {unit.roomNumber}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteUnit(room.id, unit.id)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  padding: '2px',
                                  color: '#94A3B8',
                                  cursor: 'pointer',
                                  borderRadius: '4px',
                                }}
                                title="Remove room unit"
                              >
                                <X size={14} />
                              </button>
                            </div>

                            {/* Direct Status Selector Dropdown */}
                            <select
                              value={unitStatus}
                              onChange={(e) => handleUpdateUnitStatus(room.id, unit.id, e.target.value as RoomStatus)}
                              style={{
                                width: '100%',
                                padding: '0.32rem 0.45rem',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                border: `1px solid ${cfg.border}`,
                                backgroundColor: '#FFFFFF',
                                color: cfg.text,
                                cursor: 'pointer',
                              }}
                            >
                              <option value="available">🟢 Available</option>
                              <option value="occupied">🟣 Occupied</option>
                              <option value="maintenance">🟡 In Maintenance</option>
                              <option value="booked">🔵 Booked</option>
                            </select>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.65rem', color: '#64748B' }}>
                              <span>{unit.floor || 'Hotel Floor'}</span>
                              <span style={{ fontWeight: 700, color: cfg.text, textTransform: 'uppercase' }}>
                                {cfg.label}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Add Unit Form Row */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '0.45rem',
                      maxWidth: '560px',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      backgroundColor: '#FFFFFF',
                      padding: '0.6rem',
                      borderRadius: '8px',
                      border: '1px solid #E2E8F0',
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Room No. (e.g. 105)"
                      value={newUnitNumber[room.id] || ''}
                      onChange={(e) => setNewUnitNumber({ ...newUnitNumber, [room.id]: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddUnit(room.id);
                        }
                      }}
                      style={{
                        flex: '1 1 120px',
                        padding: '0.4rem 0.6rem',
                        fontSize: '0.78rem',
                        borderRadius: '6px',
                        border: '1px solid #CBD5E1',
                        backgroundColor: '#FFFFFF',
                      }}
                    />

                    <select
                      value={newUnitFloor[room.id] || '1st Floor'}
                      onChange={(e) => setNewUnitFloor({ ...newUnitFloor, [room.id]: e.target.value })}
                      style={{
                        padding: '0.4rem 0.5rem',
                        fontSize: '0.78rem',
                        borderRadius: '6px',
                        border: '1px solid #CBD5E1',
                        backgroundColor: '#FFFFFF',
                        color: '#334155',
                      }}
                    >
                      <option value="1st Floor">1st Floor</option>
                      <option value="2nd Floor">2nd Floor</option>
                      <option value="3rd Floor">3rd Floor</option>
                      <option value="4th Floor">4th Floor</option>
                      <option value="Penthouse">Penthouse</option>
                    </select>

                    <select
                      value={newUnitStatus[room.id] || 'available'}
                      onChange={(e) => setNewUnitStatus({ ...newUnitStatus, [room.id]: e.target.value as RoomStatus })}
                      style={{
                        padding: '0.4rem 0.5rem',
                        fontSize: '0.78rem',
                        borderRadius: '6px',
                        border: '1px solid #CBD5E1',
                        backgroundColor: '#FFFFFF',
                        color: '#334155',
                      }}
                    >
                      <option value="available">🟢 Available</option>
                      <option value="occupied">🟣 Occupied</option>
                      <option value="maintenance">🟡 Maintenance</option>
                      <option value="booked">🔵 Booked</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => handleAddUnit(room.id)}
                      className="btn btn-sm btn-primary"
                      style={{ padding: '0.4rem 0.85rem', fontSize: '0.78rem', whiteSpace: 'nowrap' }}
                    >
                      <Plus size={14} /> Add Unit
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
              alignItems: 'flex-end',
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
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>
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
                      Tier Status
                    </label>
                    <select
                      value={editingRoom.status || 'available'}
                      onChange={(e) => setEditingRoom({ ...editingRoom, status: e.target.value as RoomStatus })}
                      style={{ width: '100%', padding: '0.6rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.875rem' }}
                    >
                      <option value="available">🟢 Available (Open for bookings)</option>
                      <option value="occupied">🟣 Occupied (Fully occupied)</option>
                      <option value="maintenance">🟡 In Maintenance (Offline)</option>
                      <option value="booked">🔵 Booked (Reserved)</option>
                    </select>
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                      Category
                    </label>
                    <input
                      type="text"
                      value={editingRoom.category}
                      onChange={(e) => setEditingRoom({ ...editingRoom, category: e.target.value })}
                      placeholder="e.g. Standard, Deluxe, Executive, Suite"
                      style={{ width: '100%', padding: '0.6rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.875rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                      Max Guests
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={editingRoom.maxGuests || 2}
                      onChange={(e) => setEditingRoom({ ...editingRoom, maxGuests: Number(e.target.value) || 2 })}
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
                        {/* Multi-Photo Picker */}
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
                          <span style={{ fontSize: '0.65rem', opacity: 0.85 }}>Select from Gallery</span>
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
                              roomSlug={editingRoom.slug}
                              height="180px"
                            />
                          </div>
                        </div>
                      )}

                      {/* Photo Management Gallery */}
                      <div style={{ marginBottom: '0.6rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569' }}>
                            Manage Gallery Photos ({roomImages.length}):
                          </span>
                          {isUpdatingGallery && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: '#D97706', fontWeight: 700 }}>
                              <Loader2 size={12} className="animate-spin" /> Saving photo change...
                            </span>
                          )}
                        </div>

                        {isUpdatingGallery && (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '0.35rem 0.6rem',
                            borderRadius: '6px',
                            backgroundColor: '#FEF3C7',
                            border: '1px solid #FCD34D',
                            color: '#92400E',
                            fontSize: '0.73rem',
                            fontWeight: 600,
                            marginBottom: '0.45rem',
                          }}>
                            <Loader2 size={13} className="animate-spin" /> Saving photo updates live to server &amp; carousels...
                          </div>
                        )}

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
                                opacity: isUpdatingGallery ? 0.75 : 1,
                              }}
                            >
                              <div style={{ position: 'relative', width: '100%', height: '65px', backgroundColor: '#0F172A' }}>
                                <Image
                                  src={imgUrl}
                                  alt={`Photo ${idx + 1}`}
                                  fill
                                  style={{ objectFit: 'cover' }}
                                  unoptimized={Boolean(imgUrl?.startsWith('data:'))}
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
                                    disabled={idx === 0 || isUpdatingGallery}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      padding: '2px',
                                      cursor: (idx === 0 || isUpdatingGallery) ? 'not-allowed' : 'pointer',
                                      opacity: (idx === 0 || isUpdatingGallery) ? 0.3 : 1,
                                      color: '#334155',
                                    }}
                                    title="Move earlier in carousel"
                                  >
                                    <ChevronLeft size={13} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleMovePhoto(idx, 'right')}
                                    disabled={idx === roomImages.length - 1 || isUpdatingGallery}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      padding: '2px',
                                      cursor: (idx === roomImages.length - 1 || isUpdatingGallery) ? 'not-allowed' : 'pointer',
                                      opacity: (idx === roomImages.length - 1 || isUpdatingGallery) ? 0.3 : 1,
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
                                    disabled={isUpdatingGallery}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      padding: '2px',
                                      cursor: isUpdatingGallery ? 'not-allowed' : 'pointer',
                                      opacity: isUpdatingGallery ? 0.4 : 1,
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
                                  disabled={isUpdatingGallery}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    padding: '2px',
                                    cursor: isUpdatingGallery ? 'not-allowed' : 'pointer',
                                    opacity: isUpdatingGallery ? 0.4 : 1,
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
                          disabled={isUpdatingGallery}
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
                            opacity: isUpdatingGallery ? 0.6 : 1,
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleAddCustomImageUrl}
                          disabled={isUpdatingGallery || !newCustomImageUrl.trim()}
                          className="btn btn-sm btn-secondary"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.72rem', whiteSpace: 'nowrap' }}
                        >
                          {isUpdatingGallery ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />} Add URL
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
                    disabled={isSavingRoomDetails || isUpdatingGallery}
                    className="btn btn-primary"
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      opacity: (isSavingRoomDetails || isUpdatingGallery) ? 0.7 : 1,
                      cursor: (isSavingRoomDetails || isUpdatingGallery) ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {isSavingRoomDetails ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Saving Room &amp; Photos...
                      </>
                    ) : (
                      <>
                        <Save size={16} /> Save Changes
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    disabled={isSavingRoomDetails}
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
              padding: '0.65rem 1.4rem',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
              zIndex: 1100,
            }}
          >
            <CheckCircle2 size={16} style={{ color: '#4ADE80' }} />
            <span>{saveToast}</span>
          </div>
        )}
      </main>
    </div>
  );
}
