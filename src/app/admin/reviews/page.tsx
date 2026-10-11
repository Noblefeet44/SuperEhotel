'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Star as StarIcon, ArrowLeft, Plus, Edit, Trash2, Save, X, ToggleLeft, ToggleRight, Eye, EyeOff } from 'lucide-react';
import { AdminMobileNav } from '@/components/admin/AdminMobileNav';

interface ReviewItem {
  id: string;
  guest: string;
  rating: number;
  text: string;
  published: boolean;
  date: string;
}

export default function AdminReviewsPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [editingReview, setEditingReview] = useState<ReviewItem | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem('admin_authenticated') !== 'true') {
      router.push('/admin/login');
      return;
    }
    try {
      const stored = localStorage.getItem('super_e_admin_reviews');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Filter out legacy mock data if present
          const cleaned = parsed.filter(
            (r: any) => !['1', '2', '3'].includes(r.id) || (r.guest !== 'Adamu Ibrahim' && r.guest !== 'Grace Okonkwo')
          );
          setReviews(cleaned);
        }
      }
    } catch {}
  }, [router]);

  const persistReviews = (updated: ReviewItem[]) => {
    setReviews(updated);
    try {
      localStorage.setItem('super_e_admin_reviews', JSON.stringify(updated));
    } catch {}
  };

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

        {reviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1rem', backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
            <StarIcon size={44} style={{ color: '#CBD5E1', margin: '0 auto 0.75rem' }} />
            <h4 style={{ margin: 0, color: '#1E293B', fontSize: '1.1rem', fontWeight: 700 }}>No guest reviews recorded yet</h4>
            <p style={{ margin: '0.35rem 0 1.25rem', fontSize: '0.85rem', color: '#64748B', maxWidth: '420px', marginLeft: 'auto', marginRight: 'auto' }}>
              Your hotel database is fresh and ready for production. Add verified guest testimonials whenever received.
            </p>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setEditingReview({ id: String(Date.now()), guest: '', rating: 5, text: '', published: true, date: new Date().toISOString().split('T')[0] })}
            >
              <Plus size={16} /> Add First Testimonial
            </button>
          </div>
        ) : (
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
                    <button onClick={() => persistReviews(reviews.map(r => r.id === review.id ? { ...r, published: !r.published } : r))} className="btn btn-ghost btn-sm" title={review.published ? 'Unpublish' : 'Publish'}>
                      {review.published ? <Eye size={17} style={{ color: 'var(--color-success)' }} /> : <EyeOff size={17} />}
                    </button>
                    <button onClick={() => setEditingReview(review)} className="btn btn-ghost btn-sm"><Edit size={14} /></button>
                    <button onClick={() => { if (confirm('Delete review?')) persistReviews(reviews.filter(r => r.id !== review.id)); }} className="btn btn-ghost btn-sm" style={{ color: 'var(--color-destructive)' }}><Trash2 size={14} /></button>
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
        )}

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
                  <button onClick={() => { if (editingReview.guest && editingReview.text) { const updated = reviews.some(r => r.id === editingReview.id) ? reviews.map(r => r.id === editingReview.id ? editingReview : r) : [...reviews, editingReview]; persistReviews(updated); setEditingReview(null); } }} className="btn btn-primary"><Save size={16} /> Save</button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
