'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Dumbbell, ArrowLeft, Plus, Trash2, Check, Sparkles, ToggleLeft, ToggleRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { AdminMobileNav } from '@/components/admin/AdminMobileNav';

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
    setPackages(packages.map((p) => (p.id === id ? { ...p, active: !p.active } : p)));
  };

  const deletePackage = (id: string) => {
    if (confirm('Delete this gym membership package?')) {
      setPackages(packages.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="admin-layout" style={{ maxWidth: '100vw', overflowX: 'hidden', width: '100%', boxSizing: 'border-box' }}>
      {/* Mobile Top Navigation */}
      <AdminMobileNav
        title="Gym & Fitness"
        subtitle={`${packages.length} Membership Packages`}
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
            <Dumbbell size={20} />
            <span>Gym &amp; Fitness</span>
          </div>
          <Link href="/admin/rooms" className="admin-nav-item">
            <span>Rooms &amp; Inventory</span>
          </Link>
        </nav>
      </aside>

      <main className="admin-main" style={{ minWidth: 0, width: '100%', maxWidth: '100vw', overflowX: 'hidden', boxSizing: 'border-box' }}>
        <div className="admin-header" style={{ marginBottom: '1rem' }}>
          <div>
            <h1 style={{ margin: 0 }}>Gym Membership Packages</h1>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: '#64748B' }}>
              Manage fitness subscriptions, pass rates, and active membership tiers.
            </p>
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              const name = prompt('Enter new gym plan name:');
              if (!name) return;
              const price = Number(prompt('Enter price in Naira (₦):', '15000')) || 15000;
              const duration = prompt('Enter duration (e.g. 14 Days Access):', '14 Days Access') || '14 Days Access';
              setPackages([
                ...packages,
                { id: `gym_${Date.now()}`, name, price, duration, badge: 'New Tier', active: true },
              ]);
            }}
          >
            <Plus size={16} /> Add Package
          </button>
        </div>

        {/* MOBILE GYM CARDS */}
        <div className="admin-mobile-restaurant-list">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                border: '1px solid #E2E8F0',
                padding: '0.85rem',
                marginBottom: '0.65rem',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: '#0F172A' }}>
                    {pkg.name}
                  </h4>
                  <span style={{ fontSize: '0.72rem', color: '#64748B' }}>{pkg.duration}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#06B6D4', display: 'block' }}>
                    {formatPrice(pkg.price)}
                  </span>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      padding: '0.15rem 0.4rem',
                      borderRadius: '4px',
                      backgroundColor: '#ECFEFF',
                      color: '#0891B2',
                    }}
                  >
                    {pkg.badge}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid #F1F5F9' }}>
                <button
                  type="button"
                  onClick={() => toggleStatus(pkg.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '0.3rem 0.6rem',
                    borderRadius: '8px',
                    backgroundColor: pkg.active ? '#DCFCE7' : '#F1F5F9',
                    color: pkg.active ? '#166534' : '#64748B',
                    border: 'none',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {pkg.active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                  <span>{pkg.active ? 'Active Plan' : 'Paused'}</span>
                </button>

                <button
                  onClick={() => deletePackage(pkg.id)}
                  className="btn btn-ghost btn-sm"
                  style={{ color: 'var(--color-destructive)', padding: '0.35rem' }}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* DESKTOP TABLE (Preserved for Desktop >= 1024px) */}
        <div className="admin-desktop-view-only" style={{ overflowX: 'auto', marginTop: '1rem' }}>
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
              {packages.map((pkg) => (
                <tr key={pkg.id}>
                  <td>
                    <strong>{pkg.name}</strong>
                  </td>
                  <td>{pkg.duration}</td>
                  <td style={{ fontWeight: 700, color: '#06B6D4' }}>{formatPrice(pkg.price)}</td>
                  <td>
                    <span className="badge" style={{ background: '#ECFEFF', color: '#0891B2' }}>
                      {pkg.badge}
                    </span>
                  </td>
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
                    <button
                      onClick={() => deletePackage(pkg.id)}
                      className="btn btn-ghost btn-sm"
                      style={{ color: 'var(--color-danger)' }}
                    >
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
