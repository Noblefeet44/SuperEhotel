'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2, ArrowLeft, Plus, Edit, Trash2, Save, X, ToggleLeft, ToggleRight, Check } from 'lucide-react';
import { AdminMobileNav } from '@/components/admin/AdminMobileNav';

const initialFacilities = [
  { id: '1', name: 'Air Conditioning', description: 'Climate-controlled rooms for your comfort', icon: 'snowflake', enabled: true },
  { id: '2', name: 'Free Wi-Fi', description: 'High-speed internet access throughout the hotel', icon: 'wifi', enabled: true },
  { id: '3', name: 'Flat Screen TV', description: 'Modern flat screen TVs with cable channels', icon: 'tv', enabled: true },
  { id: '4', name: 'Hot Water', description: '24/7 hot water supply in all rooms', icon: 'droplets', enabled: true },
  { id: '5', name: 'Restaurant & Bar', description: 'On-site restaurant serving Nigerian and international cuisine', icon: 'utensils', enabled: true },
  { id: '6', name: '24/7 Room Service', description: 'In-room dining available for your convenience', icon: 'concierge-bell', enabled: true },
  { id: '7', name: 'Secure Parking', description: 'Secure gated parking space for guest vehicles', icon: 'car', enabled: true },
  { id: '8', name: '24/7 Security & CCTV', description: 'Round-the-clock security guards and surveillance', icon: 'shield-check', enabled: true },
  { id: '9', name: 'Laundry Service', description: 'Professional same-day laundry and dry cleaning', icon: 'shirt', enabled: true },
  { id: '10', name: 'Uninterrupted Power', description: 'Constant power supply with industrial backup generator', icon: 'zap', enabled: true },
];

export default function AdminFacilitiesPage() {
  const router = useRouter();
  const [facilities, setFacilities] = useState(initialFacilities);
  const [editingFacility, setEditingFacility] = useState<typeof initialFacilities[0] | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem('admin_authenticated') !== 'true') router.push('/admin/login');
  }, [router]);

  const toggleEnabled = (id: string) => {
    setFacilities(facilities.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f)));
  };

  return (
    <div className="admin-layout" style={{ maxWidth: '100vw', overflowX: 'hidden', width: '100%', boxSizing: 'border-box' }}>
      {/* Mobile Top Navigation */}
      <AdminMobileNav
        title="Facilities"
        subtitle={`${facilities.filter((f) => f.enabled).length} Active Features`}
        backHref="/admin"
      />

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
            <Building2 size={20} />
            <span>Facilities</span>
          </div>
          <Link href="/admin/rooms" className="admin-nav-item">
            <span>Rooms &amp; Inventory</span>
          </Link>
        </nav>
      </aside>

      <main className="admin-main" style={{ minWidth: 0, width: '100%', maxWidth: '100vw', overflowX: 'hidden', boxSizing: 'border-box' }}>
        <div className="admin-header" style={{ marginBottom: '1rem' }}>
          <div>
            <h1 style={{ margin: 0 }}>Facilities Management</h1>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: '#64748B' }}>
              Enable or disable amenities shown to guests on website and booking pages.
            </p>
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={() =>
              setEditingFacility({ id: String(Date.now()), name: '', description: '', icon: 'star', enabled: true })
            }
          >
            <Plus size={16} /> Add Facility
          </button>
        </div>

        {/* MOBILE FACILITIES CARD LIST */}
        <div className="admin-mobile-restaurant-list">
          {facilities.map((f) => (
            <div
              key={f.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                border: '1px solid #E2E8F0',
                padding: '0.85rem',
                marginBottom: '0.65rem',
                opacity: f.enabled ? 1 : 0.65,
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <h4 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 800, color: '#0F172A' }}>
                  {f.name}
                </h4>
                <button
                  type="button"
                  onClick={() => toggleEnabled(f.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: f.enabled ? 'var(--color-success)' : 'var(--color-text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {f.enabled ? <ToggleRight size={26} /> : <ToggleLeft size={26} />}
                </button>
              </div>

              <p style={{ margin: '0 0 0.5rem', fontSize: '0.78rem', color: '#64748B' }}>
                {f.description}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.45rem', borderTop: '1px solid #F1F5F9' }}>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.45rem',
                    borderRadius: '9999px',
                    backgroundColor: f.enabled ? '#DCFCE7' : '#F1F5F9',
                    color: f.enabled ? '#166534' : '#64748B',
                  }}
                >
                  {f.enabled ? '● Active on Website' : 'Hidden'}
                </span>

                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  <button
                    onClick={() => setEditingFacility(f)}
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: '0.74rem', padding: '0.3rem 0.6rem' }}
                  >
                    <Edit size={13} /> Edit
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Delete this facility?')) setFacilities(facilities.filter((x) => x.id !== f.id));
                    }}
                    className="btn btn-ghost btn-sm"
                    style={{ color: 'var(--color-destructive)', padding: '0.3rem' }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* DESKTOP TABLE (Preserved for Desktop >= 1024px) */}
        <div className="admin-desktop-view-only" style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Facility</th>
                <th>Description</th>
                <th>Enabled</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {facilities.map((f) => (
                <tr key={f.id} style={{ opacity: f.enabled ? 1 : 0.5 }}>
                  <td>
                    <strong>{f.name}</strong>
                  </td>
                  <td style={{ maxWidth: '300px', color: 'var(--color-text-secondary)' }}>{f.description}</td>
                  <td>
                    <button
                      onClick={() => toggleEnabled(f.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: f.enabled ? 'var(--color-success)' : 'var(--color-text-muted)',
                      }}
                    >
                      {f.enabled ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                    </button>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button onClick={() => setEditingFacility(f)} className="btn btn-ghost btn-sm">
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Delete?')) setFacilities(facilities.filter((x) => x.id !== f.id));
                        }}
                        className="btn btn-ghost btn-sm"
                        style={{ color: 'var(--color-destructive)' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit Modal */}
        {editingFacility && (
          <>
            <div className="mobile-menu-overlay" onClick={() => setEditingFacility(null)} />
            <div
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 'min(500px, 92vw)',
                background: '#FFFFFF',
                borderRadius: '16px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
                zIndex: 9999,
                padding: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 800 }}>
                  {editingFacility.name ? 'Edit Facility' : 'Add Facility'}
                </h3>
                <button onClick={() => setEditingFacility(null)} className="btn btn-ghost btn-icon">
                  <X size={20} />
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <label className="label" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                    Name *
                  </label>
                  <input
                    className="input"
                    value={editingFacility.name}
                    onChange={(e) => setEditingFacility({ ...editingFacility, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                    Description
                  </label>
                  <textarea
                    className="input"
                    rows={3}
                    value={editingFacility.description}
                    onChange={(e) => setEditingFacility({ ...editingFacility, description: e.target.value })}
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                  <button onClick={() => setEditingFacility(null)} className="btn btn-ghost">
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (editingFacility.name) {
                        setFacilities((prev) => {
                          const exists = prev.find((f) => f.id === editingFacility.id);
                          return exists
                            ? prev.map((f) => (f.id === editingFacility.id ? editingFacility : f))
                            : [...prev, editingFacility];
                        });
                        setEditingFacility(null);
                      }
                    }}
                    className="btn btn-primary"
                  >
                    <Save size={16} /> Save
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
