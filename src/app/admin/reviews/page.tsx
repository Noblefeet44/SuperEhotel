'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Star as StarIcon, ArrowLeft, Plus, Edit, Trash2, Save, X, ToggleLeft, ToggleRight, Eye, EyeOff } from 'lucide-react';

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
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header"><h2>Super E Hotel</h2><span>Admin Dashboard</span></div>
        <nav style={{ padding: 'var(--space-sm) 0' }}>
          <Link href="/admin" className="admin-nav-item"><ArrowLeft size={20} /><span>Back to Dashboard</span></Link>
          <div className="admin-nav-item active"><StarIcon size={20} /><span>Reviews</span></div>
        </nav>
      </aside>

      <main className="admin-main">
        <div className="admin-header">
          <h1>Reviews Management</h1>
          <button className="btn btn-primary" onClick={() => setEditingReview({ id: String(Date.now()), guest: '', rating: 5, text: '', published: false, date: new Date().toISOString().split('T')[0] })}>
            <Plus size={18} /> Add Review
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          {reviews.map(review => (
            <div key={review.id} className="card-static" style={{ padding: 'var(--space-xl)', opacity: review.published ? 1 : 0.6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-md)' }}>
                <div>
                  <strong>{review.guest}</strong>
                  <div style={{ display: 'flex', gap: '2px', marginTop: '4px' }}>
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} size={16} fill={i < review.rating ? '#CA8A04' : 'none'} color={i < review.rating ? '#CA8A04' : '#CBD5E1'} />
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <button onClick={() => setReviews(reviews.map(r => r.id === review.id ? { ...r, published: !r.published } : r))} className="btn btn-ghost btn-sm" title={review.published ? 'Unpublish' : 'Publish'}>
                    {review.published ? <Eye size={16} style={{ color: 'var(--color-success)' }} /> : <EyeOff size={16} />}
                  </button>
                  <button onClick={() => setEditingReview(review)} className="btn btn-ghost btn-sm"><Edit size={14} /></button>
                  <button onClick={() => { if (confirm('Delete?')) setReviews(reviews.filter(r => r.id !== review.id)); }} className="btn btn-ghost btn-sm" style={{ color: 'var(--color-destructive)' }}><Trash2 size={14} /></button>
                </div>
              </div>
              <p style={{ color: 'var(--color-text-secondary)', fontStyle: 'italic', marginBottom: 'var(--space-sm)' }}>&ldquo;{review.text}&rdquo;</p>
              <div style={{ display: 'flex', gap: 'var(--space-md)', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                <span>{review.date}</span>
                <span className="badge" style={{ background: review.published ? 'rgba(22,163,74,0.1)' : 'var(--color-muted)', color: review.published ? 'var(--color-success)' : 'var(--color-text-muted)' }}>
                  {review.published ? 'Published' : 'Draft'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {editingReview && (
          <>
            <div className="mobile-menu-overlay" onClick={() => setEditingReview(null)} />
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 'min(500px, 90vw)', background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-xl)', zIndex: 51, padding: 'var(--space-xl)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-xl)' }}>
                <h2 style={{ fontSize: '1.25rem' }}>{editingReview.guest ? 'Edit Review' : 'Add Review'}</h2>
                <button onClick={() => setEditingReview(null)} className="btn btn-ghost btn-icon"><X size={20} /></button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                <div><label className="label">Guest Name *</label><input className="input" value={editingReview.guest} onChange={e => setEditingReview({ ...editingReview, guest: e.target.value })} /></div>
                <div>
                  <label className="label">Rating *</label>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[1,2,3,4,5].map(n => (
                      <button key={n} type="button" onClick={() => setEditingReview({ ...editingReview, rating: n })} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <StarIcon size={24} fill={n <= editingReview.rating ? '#CA8A04' : 'none'} color={n <= editingReview.rating ? '#CA8A04' : '#CBD5E1'} />
                      </button>
                    ))}
                  </div>
                </div>
                <div><label className="label">Review Text *</label><textarea className="input" rows={4} value={editingReview.text} onChange={e => setEditingReview({ ...editingReview, text: e.target.value })} /></div>
                <div><label className="label">Date</label><input className="input" type="date" value={editingReview.date} onChange={e => setEditingReview({ ...editingReview, date: e.target.value })} /></div>
                <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'flex-end' }}>
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
