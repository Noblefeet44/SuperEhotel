'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2, ArrowLeft, Plus, Edit, Trash2, Save, X, ToggleLeft, ToggleRight } from 'lucide-react';

const initialFacilities = [
  { id: '1', name: 'Air Conditioning', description: 'Climate-controlled rooms for your comfort', icon: 'snowflake', enabled: true },
  { id: '2', name: 'Free Wi-Fi', description: 'High-speed internet access throughout the hotel', icon: 'wifi', enabled: true },
  { id: '3', name: 'Flat Screen TV', description: 'Modern flat screen TVs with cable channels', icon: 'tv', enabled: true },
  { id: '4', name: 'Hot Water', description: '24/7 hot water supply in all rooms', icon: 'droplets', enabled: true },
  { id: '5', name: 'Restaurant', description: 'On-site restaurant serving Nigerian and international cuisine', icon: 'utensils', enabled: true },
  { id: '6', name: 'Room Service', description: 'In-room dining available for your convenience', icon: 'concierge-bell', enabled: true },
  { id: '7', name: 'Parking', description: 'Secure parking space for guests', icon: 'car', enabled: true },
  { id: '8', name: '24/7 Security', description: 'Round-the-clock security for your safety', icon: 'shield-check', enabled: true },
  { id: '9', name: 'Laundry Service', description: 'Professional laundry and dry cleaning service', icon: 'shirt', enabled: true },
  { id: '10', name: 'Power Supply', description: 'Constant power supply with backup generator', icon: 'zap', enabled: true },
];

export default function AdminFacilitiesPage() {
  const router = useRouter();
  const [facilities, setFacilities] = useState(initialFacilities);
  const [editingFacility, setEditingFacility] = useState<typeof initialFacilities[0] | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem('admin_authenticated') !== 'true') router.push('/admin/login');
  }, [router]);

  const toggleEnabled = (id: string) => {
    setFacilities(facilities.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f));
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header"><h2>Super E Hotel</h2><span>Admin Dashboard</span></div>
        <nav style={{ padding: 'var(--space-sm) 0' }}>
          <Link href="/admin" className="admin-nav-item"><ArrowLeft size={20} /><span>Back to Dashboard</span></Link>
          <div className="admin-nav-item active"><Building2 size={20} /><span>Facilities</span></div>
        </nav>
      </aside>

      <main className="admin-main">
        <div className="admin-header">
          <h1>Facilities Management</h1>
          <button className="btn btn-primary" onClick={() => setEditingFacility({ id: String(Date.now()), name: '', description: '', icon: 'star', enabled: true })}>
            <Plus size={18} /> Add Facility
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead><tr><th>Facility</th><th>Description</th><th>Enabled</th><th>Actions</th></tr></thead>
            <tbody>
              {facilities.map(f => (
                <tr key={f.id} style={{ opacity: f.enabled ? 1 : 0.5 }}>
                  <td><strong>{f.name}</strong></td>
                  <td style={{ maxWidth: '300px', color: 'var(--color-text-secondary)' }}>{f.description}</td>
                  <td>
                    <button onClick={() => toggleEnabled(f.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: f.enabled ? 'var(--color-success)' : 'var(--color-text-muted)' }}>
                      {f.enabled ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                    </button>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button onClick={() => setEditingFacility(f)} className="btn btn-ghost btn-sm"><Edit size={14} /></button>
                      <button onClick={() => { if (confirm('Delete?')) setFacilities(facilities.filter(x => x.id !== f.id)); }} className="btn btn-ghost btn-sm" style={{ color: 'var(--color-destructive)' }}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {editingFacility && (
          <>
            <div className="mobile-menu-overlay" onClick={() => setEditingFacility(null)} />
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 'min(500px, 90vw)', background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-xl)', zIndex: 51, padding: 'var(--space-xl)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-xl)' }}>
                <h2 style={{ fontSize: '1.25rem' }}>{editingFacility.name ? 'Edit Facility' : 'Add Facility'}</h2>
                <button onClick={() => setEditingFacility(null)} className="btn btn-ghost btn-icon"><X size={20} /></button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                <div><label className="label">Name *</label><input className="input" value={editingFacility.name} onChange={e => setEditingFacility({ ...editingFacility, name: e.target.value })} /></div>
                <div><label className="label">Description</label><textarea className="input" rows={3} value={editingFacility.description} onChange={e => setEditingFacility({ ...editingFacility, description: e.target.value })} /></div>
                <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'flex-end' }}>
                  <button onClick={() => setEditingFacility(null)} className="btn btn-ghost">Cancel</button>
                  <button onClick={() => { if (editingFacility.name) { setFacilities(prev => { const exists = prev.find(f => f.id === editingFacility.id); return exists ? prev.map(f => f.id === editingFacility.id ? editingFacility : f) : [...prev, editingFacility]; }); setEditingFacility(null); } }} className="btn btn-primary"><Save size={16} /> Save</button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
