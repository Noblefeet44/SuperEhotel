'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Image as ImageIcon, ArrowLeft, Upload, Trash2, Copy, Check } from 'lucide-react';

const mediaItems = [
  { id: '1', name: 'Hotel Exterior', url: '/images/hotel-exterior.jpg', size: '1.2 MB', category: 'Exterior' },
  { id: '2', name: 'Standard Room', url: '/images/standard-room.jpg', size: '850 KB', category: 'Rooms' },
  { id: '3', name: 'Deluxe Room', url: '/images/deluxe-room.jpg', size: '920 KB', category: 'Rooms' },
  { id: '4', name: 'Executive Room', url: '/images/executive-room.jpg', size: '1.1 MB', category: 'Rooms' },
  { id: '5', name: 'VIP Suite', url: '/images/vip-suite.jpg', size: '1.4 MB', category: 'Rooms' },
  { id: '6', name: 'Hotel Lobby', url: '/images/hotel-lobby.jpg', size: '980 KB', category: 'Interior' },
  { id: '7', name: 'Restaurant Interior', url: '/images/restaurant-interior.jpg', size: '1.0 MB', category: 'Restaurant' },
  { id: '8', name: 'Nigerian Food', url: '/images/nigerian-food.jpg', size: '890 KB', category: 'Food' },
];

export default function AdminMediaPage() {
  const router = useRouter();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem('admin_authenticated') !== 'true') router.push('/admin/login');
  }, [router]);

  const copyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header"><h2>Super E Hotel</h2><span>Admin Dashboard</span></div>
        <nav style={{ padding: 'var(--space-sm) 0' }}>
          <Link href="/admin" className="admin-nav-item"><ArrowLeft size={20} /><span>Back to Dashboard</span></Link>
          <div className="admin-nav-item active"><ImageIcon size={20} /><span>Media</span></div>
        </nav>
      </aside>

      <main className="admin-main">
        <div className="admin-header">
          <h1>Media Library</h1>
          <button className="btn btn-primary" onClick={() => alert('Image upload will connect to Supabase Storage')}>
            <Upload size={18} /> Upload Image
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 'var(--space-lg)',
        }}>
          {mediaItems.map(item => (
            <div key={item.id} className="card-static" style={{ overflow: 'hidden' }}>
              <div style={{ position: 'relative', height: '160px' }}>
                <Image src={item.url} alt={item.name} fill style={{ objectFit: 'cover' }} sizes="220px" />
                <span className="badge" style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(0,0,0,0.6)', color: '#FFF' }}>
                  {item.category}
                </span>
              </div>
              <div style={{ padding: 'var(--space-md)' }}>
                <h4 style={{ fontSize: '0.9375rem', marginBottom: '0.125rem' }}>{item.name}</h4>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-md)' }}>{item.size}</p>
                <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                  <button onClick={() => copyUrl(item.id, item.url)} className="btn btn-outline btn-sm" style={{ flex: 1 }}>
                    {copiedId === item.id ? <Check size={14} /> : <Copy size={14} />} {copiedId === item.id ? 'Copied' : 'Copy URL'}
                  </button>
                  <button onClick={() => alert('Delete from storage')} className="btn btn-ghost btn-sm" style={{ color: 'var(--color-destructive)' }}>
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
