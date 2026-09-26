'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Image as ImageIcon, ArrowLeft, Upload, Trash2, Copy, Check,
  Camera, UploadCloud, CheckCircle2, Sparkles, Filter, ExternalLink
} from 'lucide-react';
import { AdminMobileNav } from '@/components/admin/AdminMobileNav';

interface MediaItem {
  id: string;
  name: string;
  url: string;
  size: string;
  category: string;
  isNew?: boolean;
}

const initialMediaItems: MediaItem[] = [
  { id: '1', name: 'Hotel Aerial Drone', url: '/images/hotel-aerial-drone.jpg', size: '230 KB', category: 'Exterior' },
  { id: '2', name: 'Hotel Front Drone', url: '/images/hotel-front-drone.jpg', size: '168 KB', category: 'Exterior' },
  { id: '3', name: 'Standard Room', url: '/images/standard-room.jpg', size: '95 KB', category: 'Rooms' },
  { id: '4', name: 'Deluxe Room', url: '/images/deluxe-room.jpg', size: '101 KB', category: 'Rooms' },
  { id: '5', name: 'Executive Room', url: '/images/executive-room.jpg', size: '79 KB', category: 'Rooms' },
  { id: '6', name: 'VIP Suite', url: '/images/vip-suite.jpg', size: '62 KB', category: 'Rooms' },
  { id: '7', name: 'Luxury Room', url: '/images/luxury-room.jpg', size: '85 KB', category: 'Rooms' },
  { id: '8', name: 'Presidential Suite', url: '/images/presidential-suite.jpg', size: '62 KB', category: 'Rooms' },
  { id: '9', name: 'Hotel Lobby', url: '/images/hotel-lobby.jpg', size: '959 KB', category: 'Interior' },
  { id: '10', name: 'Restaurant Interior', url: '/images/restaurant-interior.jpg', size: '960 KB', category: 'Restaurant' },
  { id: '11', name: 'Nigerian Food Jollof', url: '/images/nigerian-food.jpg', size: '863 KB', category: 'Food' },
  { id: '12', name: 'Event Hall Banquet', url: '/images/event-hall-banquet.jpg', size: '1.05 MB', category: 'Event Hall' },
  { id: '13', name: 'VIP Lounge & Bar', url: '/images/vip-lounge-bar.jpg', size: '903 KB', category: 'Lounge' },
  { id: '14', name: 'Club Nightlife', url: '/images/club-nightlife.jpg', size: '928 KB', category: 'Lounge' },
];

const CATEGORIES = ['All', 'Rooms', 'Exterior', 'Interior', 'Restaurant', 'Food', 'Event Hall', 'Lounge'];

export default function AdminMediaPage() {
  const router = useRouter();
  const [mediaList, setMediaList] = useState<MediaItem[]>(initialMediaItems);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [uploadCategory, setUploadCategory] = useState('Rooms');
  const [isUploading, setIsUploading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem('admin_authenticated') !== 'true') {
      router.push('/admin/login');
    }
  }, [router]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const copyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    showToast('Image URL copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', uploadCategory.toLowerCase());

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        const newItem: MediaItem = {
          id: `media_${Date.now()}`,
          name: file.name.replace(/\.[^/.]+$/, ''),
          url: data.url,
          size: data.size || `${(file.size / 1024).toFixed(1)} KB`,
          category: uploadCategory,
          isNew: true,
        };

        setMediaList([newItem, ...mediaList]);
        showToast('Photo uploaded successfully!');
      } else {
        alert(data.error || 'Failed to upload photo');
      }
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Network error while uploading photo');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const deleteItem = (id: string) => {
    if (confirm('Remove this photo from media list?')) {
      setMediaList(mediaList.filter((m) => m.id !== id));
      showToast('Photo removed from view');
    }
  };

  const filteredMedia =
    selectedCategory === 'All'
      ? mediaList
      : mediaList.filter((m) => m.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="admin-layout" style={{ maxWidth: '100vw', overflowX: 'hidden', width: '100%', boxSizing: 'border-box' }}>
      {/* Mobile Top Navigation */}
      <AdminMobileNav
        title="Upload & Media"
        subtitle={`${filteredMedia.length} Photos & Assets`}
        backHref="/admin"
      />

      {/* Floating Save/Copy Toast */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '70px',
            right: '16px',
            zIndex: 99999,
            backgroundColor: '#1E293B',
            color: '#FFFFFF',
            padding: '0.65rem 1rem',
            borderRadius: '10px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 700,
            fontSize: '0.85rem',
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          <CheckCircle2 size={18} style={{ color: '#4ADE80' }} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Desktop Sidebar (Preserved for desktop view) */}
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
          <Link href="/admin/bookings" className="admin-nav-item">
            <span>Bookings</span>
          </Link>
          <Link href="/admin/rooms" className="admin-nav-item">
            <span>Rooms &amp; Inventory</span>
          </Link>
          <div className="admin-nav-item active">
            <ImageIcon size={20} />
            <span>Media Library</span>
          </div>
        </nav>
      </aside>

      <main className="admin-main" style={{ minWidth: 0, width: '100%', maxWidth: '100vw', overflowX: 'hidden', boxSizing: 'border-box' }}>
        {/* Header */}
        <div className="admin-header" style={{ marginBottom: '1rem' }}>
          <div>
            <h1 style={{ margin: 0 }}>Media Library &amp; Uploads</h1>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: '#64748B' }}>
              Upload room photos, reception gallery, and guest receipts directly from your phone.
            </p>
          </div>
        </div>

        {/* MOBILE & DESKTOP UPLOAD DROPZONE CARD */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '2px dashed #93C5FD',
            padding: '1.25rem',
            marginBottom: '1.25rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                backgroundColor: '#EFF6FF',
                color: '#1E3A8A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <UploadCloud size={28} />
            </div>

            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>
                Upload Hotel Photo from Mobile
              </h3>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.78rem', color: '#64748B' }}>
                Take a new picture with your camera or select from phone photo library (PNG, JPG, WEBP)
              </p>
            </div>

            {/* Target Category Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Category:</span>
              {['Rooms', 'Exterior', 'Restaurant', 'Interior', 'Event Hall', 'Lounge'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setUploadCategory(cat)}
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.55rem',
                    borderRadius: '9999px',
                    border: uploadCategory === cat ? '1px solid #1E3A8A' : '1px solid #E2E8F0',
                    backgroundColor: uploadCategory === cat ? '#1E3A8A' : '#F8FAFC',
                    color: uploadCategory === cat ? '#FFFFFF' : '#475569',
                    cursor: 'pointer',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Big Touch Upload Button */}
            <label
              className="btn btn-primary"
              style={{
                cursor: isUploading ? 'wait' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0.65rem 1.5rem',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: 700,
                boxShadow: '0 4px 12px rgba(30, 58, 138, 0.25)',
              }}
            >
              <Camera size={18} />
              <span>{isUploading ? 'Uploading to Super E...' : '📷 Pick Photo / Open Camera'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isUploading}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="admin-mobile-filter-strip" style={{ marginBottom: '1rem' }}>
          {CATEGORIES.map((cat) => {
            const count =
              cat === 'All'
                ? mediaList.length
                : mediaList.filter((m) => m.category.toLowerCase() === cat.toLowerCase()).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`filter-pill-btn ${isSelected ? 'active' : ''}`}
              >
                <span>{cat}</span>
                <span className={`pill-badge ${isSelected ? 'active' : ''}`}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Media Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '0.85rem',
          }}
        >
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              className="card-static"
              style={{
                overflow: 'hidden',
                borderRadius: '14px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ position: 'relative', height: '140px', backgroundColor: '#0F172A' }}>
                <Image
                  src={item.url}
                  alt={item.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 50vw, 250px"
                />
                <span
                  className="badge"
                  style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    background: 'rgba(0,0,0,0.65)',
                    color: '#FFF',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                  }}
                >
                  {item.category}
                </span>

                {item.isNew && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      backgroundColor: '#10B981',
                      color: '#FFFFFF',
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      padding: '0.15rem 0.4rem',
                      borderRadius: '4px',
                    }}
                  >
                    NEW
                  </span>
                )}
              </div>

              <div style={{ padding: '0.75rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h4
                    style={{
                      fontSize: '0.86rem',
                      margin: '0 0 2px',
                      fontWeight: 700,
                      color: '#0F172A',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {item.name}
                  </h4>
                  <p style={{ fontSize: '0.7rem', color: '#64748B', margin: '0 0 0.65rem' }}>{item.size}</p>
                </div>

                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    onClick={() => copyUrl(item.id, item.url)}
                    className="btn btn-outline btn-sm"
                    style={{
                      flex: 1,
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      padding: '0.35rem 0.5rem',
                      justifyContent: 'center',
                    }}
                  >
                    {copiedId === item.id ? <Check size={13} /> : <Copy size={13} />}
                    {copiedId === item.id ? 'Copied' : 'Copy'}
                  </button>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost btn-sm"
                    style={{ padding: '0.35rem', color: '#64748B' }}
                    title="View full picture"
                  >
                    <ExternalLink size={14} />
                  </a>

                  <button
                    onClick={() => deleteItem(item.id)}
                    className="btn btn-ghost btn-sm"
                    style={{ padding: '0.35rem', color: 'var(--color-destructive)' }}
                    title="Remove"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
