'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FileText, ArrowLeft, Save, Globe, Loader2, Check } from 'lucide-react';
import { AdminMobileNav } from '@/components/admin/AdminMobileNav';

export default function AdminContentPage() {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [content, setContent] = useState({
    heroTitle: 'Super E Luxury Hotel & Suites',
    heroSubtitle: 'Welcome to Super E Luxury Hotel & Suites in Keffi, Nigeria. Experience luxury at its peak.',
    heroTagline: 'Luxury at Its Peak',
    aboutHeadline: 'Welcome to Super E Luxury Hotel & Suites',
    aboutParagraph1: 'Super E Luxury Hotel & Suites is a premier hospitality destination located in Keffi, Nasarawa State, Nigeria.',
    aboutParagraph2: 'Our well-appointed rooms, exquisite restaurant serving authentic Nigerian cuisine, and attentive staff ensure that every moment of your stay is memorable.',
    restaurantHeadline: 'Our Restaurant & Dining',
    restaurantDescription: 'Savor the finest Nigerian cuisine and international dishes at our elegant restaurant.',
  });

  useEffect(() => {
    if (sessionStorage.getItem('admin_authenticated') !== 'true') router.push('/admin/login');
    try {
      const stored = localStorage.getItem('super_e_site_content');
      if (stored) {
        setContent(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load site content:', e);
    }
  }, [router]);

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    try {
      localStorage.setItem('super_e_site_content', JSON.stringify(content));
    } catch (e) {
      console.error('Failed to save site content:', e);
    }
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3500);
  };

  return (
    <div className="admin-layout" style={{ maxWidth: '100vw', overflowX: 'hidden', width: '100%', boxSizing: 'border-box' }}>
      {/* Mobile Top Navigation */}
      <AdminMobileNav
        title="Site Content"
        subtitle="Homepage Headlines & Copy"
        backHref="/admin"
      />

      <aside className="admin-sidebar">
        <div className="admin-sidebar-header"><h2>Super E Hotel</h2><span>Admin Dashboard</span></div>
        <nav style={{ padding: 'var(--space-sm) 0' }}>
          <Link href="/admin" className="admin-nav-item"><ArrowLeft size={20} /><span>Back to Dashboard</span></Link>
          <div className="admin-nav-item active"><FileText size={20} /><span>Content</span></div>
        </nav>
      </aside>

      <main className="admin-main" style={{ minWidth: 0, width: '100%', maxWidth: '100vw', overflowX: 'hidden', boxSizing: 'border-box' }}>

        <div className="admin-header">
          <h1>Website Content CMS</h1>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={isSaving}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              opacity: isSaving ? 0.7 : 1,
              cursor: isSaving ? 'not-allowed' : 'pointer'
            }}
          >
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {isSaving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Content'}
          </button>
        </div>

        <div style={{ maxWidth: '700px', display: 'flex', flexDirection: 'column', gap: 'var(--space-2xl)' }}>
          {/* Hero Section */}
          <section>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
              <Globe size={20} /> Homepage Hero Section
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
              <div><label className="label">Hero Title</label><input className="input" disabled={isSaving} value={content.heroTitle} onChange={e => setContent({ ...content, heroTitle: e.target.value })} /></div>
              <div><label className="label">Hero Tagline</label><input className="input" disabled={isSaving} value={content.heroTagline} onChange={e => setContent({ ...content, heroTagline: e.target.value })} /></div>
              <div><label className="label">Hero Subtitle</label><textarea className="input" disabled={isSaving} rows={2} value={content.heroSubtitle} onChange={e => setContent({ ...content, heroSubtitle: e.target.value })} /></div>
            </div>
          </section>

          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-light)' }} />

          {/* About Section */}
          <section>
            <h3 style={{ marginBottom: 'var(--space-lg)' }}>About Us Section</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
              <div><label className="label">Headline</label><input className="input" disabled={isSaving} value={content.aboutHeadline} onChange={e => setContent({ ...content, aboutHeadline: e.target.value })} /></div>
              <div><label className="label">Paragraph 1</label><textarea className="input" disabled={isSaving} rows={3} value={content.aboutParagraph1} onChange={e => setContent({ ...content, aboutParagraph1: e.target.value })} /></div>
              <div><label className="label">Paragraph 2</label><textarea className="input" disabled={isSaving} rows={3} value={content.aboutParagraph2} onChange={e => setContent({ ...content, aboutParagraph2: e.target.value })} /></div>
            </div>
          </section>

          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-light)' }} />

          {/* Restaurant Section */}
          <section>
            <h3 style={{ marginBottom: 'var(--space-lg)' }}>Restaurant Page Text</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
              <div><label className="label">Restaurant Headline</label><input className="input" disabled={isSaving} value={content.restaurantHeadline} onChange={e => setContent({ ...content, restaurantHeadline: e.target.value })} /></div>
              <div><label className="label">Restaurant Description</label><textarea className="input" disabled={isSaving} rows={3} value={content.restaurantDescription} onChange={e => setContent({ ...content, restaurantDescription: e.target.value })} /></div>
            </div>
          </section>

          <div style={{ paddingBottom: 'var(--space-2xl)' }}>
            <button
              className="btn btn-primary btn-lg"
              onClick={handleSave}
              disabled={isSaving}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                opacity: isSaving ? 0.7 : 1,
                cursor: isSaving ? 'not-allowed' : 'pointer'
              }}
            >
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {isSaving ? 'Saving All Content...' : saved ? '✓ Content Saved!' : 'Save All Content'}
            </button>
          </div>
        </div>

        {/* Save Toast Notification */}
        {saved && (
          <div
            style={{
              position: 'fixed',
              bottom: '1.5rem',
              right: '1.5rem',
              backgroundColor: '#10B981',
              color: '#FFFFFF',
              padding: '0.75rem 1.25rem',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.88rem',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              animation: 'fadeIn 0.2s ease-in-out',
            }}
          >
            <Check size={18} />
            Website content saved successfully!
          </div>
        )}
      </main>
    </div>
  );
}
