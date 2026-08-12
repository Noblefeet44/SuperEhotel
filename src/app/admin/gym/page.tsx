'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Dumbbell, ArrowLeft, Plus, Trash2, Check, Sparkles } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

const initialPackages = [
  { id: 'day-pass', name: 'Day Pass', price: 2000, duration: 'Single Day Access', badge: 'Flexible', active: true },
  { id: 'weekly-flex', name: 'Weekly Flex', price: 8000, duration: '7 Days Access', badge: 'Standard', active: true },
  { id: 'monthly-standard', name: 'Monthly Standard', price: 25000, duration: '30 Days Access', badge: 'Most Popular', active: true },
  { id: 'vip-quarterly', name: 'VIP Quarterly', price: 65000, duration: '90 Days Access', badge: 'Best Value', active: true },
  { id: 'annual-elite', name: 'Annual Elite', price: 220000, duration: '365 Days Access', badge: 'VIP Membership', active: true },
];

export default function AdminGymPage() {
  const router = useRouter();
  const [packages, setPackages] = useState(initialPackages);

  useEffect(() => {
    if (sessionStorage.getItem('admin_authenticated') !== 'true') router.push('/admin/login');
  }, [router]);

  const toggleStatus = (id: string) => {
    setPackages(packages.map(p => p.id === id ? { ...p, active: !p.active } : p));
  };

  const deletePackage = (id: string) => {
    if (confirm('Delete this gym membership package?')) {
      setPackages(packages.filter(p => p.id !== id));
    }
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header"><h2>Super E Hotel</h2><span>Admin Dashboard</span></div>
        <nav style={{ padding: 'var(--space-sm) 0' }}>
          <Link href="/admin" className="admin-nav-item"><ArrowLeft size={20} /><span>Back to Dashboard</span></Link>
          <div className="admin-nav-item active"><Dumbbell size={20} /><span>Gym & Fitness</span></div>
        </nav>
      </aside>

      <main className="admin-main">
        <div className="admin-header">
          <div>
            <h1>Gym Membership Packages</h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Manage fitness subscriptions and active membership tiers</p>
          </div>
          <button className="btn btn-primary" onClick={() => alert('Feature to add custom gym package tier enabled.')}>
            <Plus size={18} /> Add Package
          </button>
        </div>

        <div style={{ overflowX: 'auto', marginTop: '1.5rem' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Package Name</th>
                <th>Duration</th>
                <th>Price</th>
                <th>Badge</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {packages.map(pkg => (
                <tr key={pkg.id}>
                  <td><strong>{pkg.name}</strong></td>
                  <td>{pkg.duration}</td>
                  <td style={{ fontWeight: 700, color: 'var(--color-accent)' }}>{formatPrice(pkg.price)}</td>
                  <td><span className="badge" style={{ background: 'rgba(234, 179, 8, 0.15)', color: 'var(--color-accent)' }}>{pkg.badge}</span></td>
                  <td>
                    <button
                      onClick={() => toggleStatus(pkg.id)}
                      className={`badge ${pkg.active ? 'badge-success' : 'badge-danger'}`}
                      style={{ border: 'none', cursor: 'pointer' }}
                    >
                      {pkg.active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td>
                    <button onClick={() => deletePackage(pkg.id)} className="btn btn-ghost btn-sm" style={{ color: 'var(--color-danger)' }}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
