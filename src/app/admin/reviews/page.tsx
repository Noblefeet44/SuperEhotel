'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Star as StarIcon, ArrowLeft, Plus, Edit, Trash2, Save, X, ToggleLeft, ToggleRight, Eye, EyeOff } from 'lucide-react';
import { AdminMobileNav } from '@/components/admin/AdminMobileNav';

const initialReviews = [
  { id: '1', guest: 'Adamu Ibrahim', rating: 5, text: 'Excellent service and very clean rooms. The staff were incredibly welcoming.', published: true, date: '2026-07-15' },
  { id: '2', guest: 'Grace Okonkwo', rating: 4, text: 'Beautiful hotel with great facilities. The Nigerian dishes were delicious.', published: true, date: '2026-07-20' },
  { id: '3', guest: 'David Nwachukwu', rating: 5, text: 'Best hotel in Keffi! The VIP suite was outstanding.', published: true, date: '2026-08-01' },
];

export default function AdminReviewsPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState(initialReviews);
  const [editingReview, setEditingReview] = useState<typeof initialReviews[0] | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem('admin_authenticated') !== 'true') router.push('/admin/login');
  }, [router]);

  return (
    <div className="admin-layout" style={{ maxWidth: '100vw', overflowX: 'hidden', width: '100%', boxSizing: 'border-box' }}>
      {/* Mobile Top Navigation */}
      <AdminMobileNav
        title="Guest Reviews"
        subtitle={`${reviews.length} Customer Reviews`}
        backHref="/admin"
      />

      <aside className="admin-sidebar">
        <div className="admin-sidebar-header"><h2>Super E Hotel</h2><span>Admin Dashboard</span></div>
        <nav style={{ padding: 'var(--space-sm) 0' }}>
          <Link href="/admin" className="admin-nav-item"><ArrowLeft size={20} /><span>Back to Dashboard</span></Link>
          <div className="admin-nav-item active"><StarIcon size={20} /><span>Reviews</span></div>
          <Link href="/admin/bookings" className="admin-nav-item"><span>Bookings</span></Link>
        </nav>
      </aside>

      <main className="admin-main" style={{ minWidth: 0, width: '100%', maxWidth: '100vw', overflowX: 'hidden', boxSizing: 'border-box' }}>
        <div className="admin-header" style={{ marginBottom: '1rem' }}>
          <div>
            <h1 style={{ margin: 0 }}>Reviews Management</h1>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: '#64748B' }}>
              Moderate and publish customer reviews shown on the hotel website.
            </p>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setEditingReview({ id: String(Date.now()), guest: '', rating: 5, text: '', published: true, date: new Date().toISOString().split('T')[0] })}>
            <Plus size={16} /> Add Review
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {reviews.map(review => (
            <div key={review.id} className="card-static" style={{ padding: '1rem', borderRadius: '14px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', opacity: review.published ? 1 : 0.65 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div>
                  <strong style={{ fontSize: '0.95rem', color: '#0F172A' }}>{review.guest}</strong>
                  <div style={{ display: 'flex', gap: '2px', marginTop: '3px' }}>
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} size={15} fill={i < review.rating ? '#CA8A04' : 'none'} color={i < review.rating ? '#CA8A04' : '#CBD5E1'} />
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <button onClick={() => setReviews(reviews.map(r => r.id === review.id ? { ...r, published: !r.published } : r))} className="btn btn-ghost btn-sm" title={review.published ? 'Unpublish' : 'Publish'}>
                    {review.published ? <Eye size={17} style={{ color: 'var(--color-success)' }} /> : <EyeOff size={17} />}
                  </button>
                  <button onClick={() => setEditingReview(review)} className="btn btn-ghost btn-sm"><Edit size={14} /></button>
                  <button onClick={() => { if (confirm('Delete review?')) setReviews(reviews.filter(r => r.id !== review.id)); }} className="btn btn-ghost btn-sm" style={{ color: 'var(--color-destructive)' }}><Trash2 size={14} /></button>
                </div>
              </div>
              <p style={{ color: '#334155', fontStyle: 'italic', margin: '0 0 0.5rem', fontSize: '0.85rem' }}>&ldquo;{review.text}&rdquo;</p>
              <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.75rem', color: '#64748B' }}>
                <span>{review.date}</span>
                <span className="badge" style={{ background: review.published ? '#DCFCE7' : '#F1F5F9', color: review.published ? '#166534' : '#64748B' }}>
                  {review.published ? 'Published' : 'Draft'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {editingReview && (
          <>
            <div className="mobile-menu-overlay" onClick={() => setEditingReview(null)} />
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 'min(500px, 92vw)', background: '#FFFFFF', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.25)', zIndex: 9999, padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 800 }}>{editingReview.guest ? 'Edit Review' : 'Add Review'}</h3>
                <button onClick={() => setEditingReview(null)} className="btn btn-ghost btn-icon"><X size={20} /></button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div><label className="label" style={{ fontSize: '0.75rem', fontWeight: 700 }}>Guest Name *</label><input className="input" value={editingReview.guest} onChange={e => setEditingReview({ ...editingReview, guest: e.target.value })} /></div>
                <div>
                  <label className="label" style={{ fontSize: '0.75rem', fontWeight: 700 }}>Rating *</label>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[1,2,3,4,5].map(n => (
                      <button key={n} type="button" onClick={() => setEditingReview({ ...editingReview, rating: n })} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <StarIcon size={24} fill={n <= editingReview.rating ? '#CA8A04' : 'none'} color={n <= editingReview.rating ? '#CA8A04' : '#CBD5E1'} />
                      </button>
                    ))}
                  </div>
                </div>
                <div><label className="label" style={{ fontSize: '0.75rem', fontWeight: 700 }}>Review Text *</label><textarea className="input" rows={3} value={editingReview.text} onChange={e => setEditingReview({ ...editingReview, text: e.target.value })} /></div>
                <div><label className="label" style={{ fontSize: '0.75rem', fontWeight: 700 }}>Date</label><input className="input" type="date" value={editingReview.date} onChange={e => setEditingReview({ ...editingReview, date: e.target.value })} /></div>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                  <button onClick={() => setEditingReview(null)} className="btn btn-ghost">Cancel</button>
                  <button onClick={() => { if (editingReview.guest && editingReview.text) { setReviews(prev => { const exists = prev.find(r => r.id === editingReview.id); return exists ? prev.map(r => r.id === editingReview.id ? editingReview : r) : [...prev, editingReview]; }); setEditingReview(null); } }} className="btn btn-primary"><Save size={16} /> Save</button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
