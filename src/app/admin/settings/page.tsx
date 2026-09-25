'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Settings, ArrowLeft, Save, Phone, MapPin, Globe, Clock, Palette, CreditCard, CheckCircle2, Loader2, Share2 } from 'lucide-react';
import { FacebookIcon, InstagramIcon, TwitterIcon } from '@/components/common/SocialIcons';
import { AdminMobileNav } from '@/components/admin/AdminMobileNav';

export default function AdminSettingsPage() {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [settings, setSettings] = useState({
    hotelName: 'Super E Luxury Hotel & Suites',
    tagline: 'Luxury at Its Peak',
    phone: '07066472533',
    whatsapp: '07066472533',
    email: 'supereluxuryhotelandsuites@gmail.com',
    address: '11 Hassan Chiroma Street, Adjacent Alvari Hotel G.R.A Keffi, Nasarawa State.',
    googleMapsEmbed: '',
    bankName: 'Moniepoint Microfinance Bank',
    accountNumber: '5326187865',
    accountName: 'SUPER E LUXURY HOTEL AND SUITES LTD - RECEPTION',
    primaryColor: '#1E3A8A',
    accentColor: '#CA8A04',
    restaurantHoursOpen: '7:00 AM',
    restaurantHoursClose: '10:00 PM',
    checkInTime: '2:00 PM',
    checkOutTime: '12:00 PM',
    currency: 'NGN',
    currencySymbol: '₦',
    aboutText: 'Super E Luxury Hotel & Suites is a premier hospitality destination located in Keffi, Nasarawa State, Nigeria.',
    metaDescription: 'Best luxury hotel in Keffi, Nasarawa State, Nigeria. Premium rooms with 24/7 power, free Wi-Fi, fine Nigerian dining.',
    socialFacebook: '',
    socialInstagram: '',
    socialTwitter: '',
  });

  // Load settings from Supabase on mount
  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/admin/settings');
        const data = await res.json();
        if (data.success && data.settings) {
          const s = data.settings;
          setSettings(prev => ({
            ...prev,
            hotelName: s.hotel_name || prev.hotelName,
            tagline: s.tagline || prev.tagline,
            phone: s.phone || prev.phone,
            whatsapp: s.whatsapp || prev.whatsapp,
            email: s.email || prev.email,
            address: s.address || prev.address,
            googleMapsEmbed: s.map_embed_url || '',
            currencySymbol: s.currency_symbol || prev.currencySymbol,
            socialFacebook: s.facebook_url || '',
            socialInstagram: s.instagram_url || '',
            socialTwitter: s.twitter_url || '',
            metaDescription: s.description || prev.metaDescription,
          }));
        }
      } catch (err) {
        console.warn('Could not load settings from server:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to save settings');
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-layout" style={{ maxWidth: '100vw', overflowX: 'hidden', width: '100%', boxSizing: 'border-box' }}>
      {/* Mobile Top Navigation */}
      <AdminMobileNav
        title="Hotel Settings"
        subtitle="Operations & Bank Accounts"
        backHref="/admin"
      />

      <aside className="admin-sidebar">
        <div className="admin-sidebar-header"><h2>Super E Hotel</h2><span>Admin Dashboard</span></div>
        <nav style={{ padding: 'var(--space-sm) 0' }}>
          <Link href="/admin" className="admin-nav-item"><ArrowLeft size={20} /><span>Back to Dashboard</span></Link>
          <div className="admin-nav-item active"><Settings size={20} /><span>Settings</span></div>
        </nav>
      </aside>

      <main className="admin-main" style={{ minWidth: 0, width: '100%', maxWidth: '100vw', overflowX: 'hidden', boxSizing: 'border-box' }}>
        <div className="admin-header">
          <h1>Hotel Settings</h1>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {saved ? '✓ Saved!' : saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {error && (
          <div style={{
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(220, 38, 38, 0.08)',
            border: '1px solid rgba(220, 38, 38, 0.25)',
            color: 'var(--color-destructive)',
            fontSize: '0.875rem',
            marginBottom: 'var(--space-lg)',
          }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', padding: 'var(--space-xl)', color: 'var(--color-text-secondary)' }}>
            <Loader2 size={20} className="animate-spin" /> Loading settings...
          </div>
        ) : (

        <div style={{ maxWidth: '700px', display: 'flex', flexDirection: 'column', gap: 'var(--space-2xl)' }}>
          {/* General */}
          <section>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
              <Globe size={20} /> General Information
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
              <div><label className="label">Hotel Name</label><input className="input" value={settings.hotelName} onChange={e => setSettings({ ...settings, hotelName: e.target.value })} /></div>
              <div><label className="label">Tagline</label><input className="input" value={settings.tagline} onChange={e => setSettings({ ...settings, tagline: e.target.value })} /></div>
              <div><label className="label">About Text</label><textarea className="input" rows={4} value={settings.aboutText} onChange={e => setSettings({ ...settings, aboutText: e.target.value })} /></div>
              <div><label className="label">SEO Meta Description</label><textarea className="input" rows={2} value={settings.metaDescription} onChange={e => setSettings({ ...settings, metaDescription: e.target.value })} /></div>
            </div>
          </section>

          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-light)' }} />

          {/* Contact */}
          <section>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
              <Phone size={20} /> Contact Information
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-lg)' }}>
                <div><label className="label">Phone Number</label><input className="input" value={settings.phone} onChange={e => setSettings({ ...settings, phone: e.target.value })} /></div>
                <div><label className="label">WhatsApp Number</label><input className="input" value={settings.whatsapp} onChange={e => setSettings({ ...settings, whatsapp: e.target.value })} /></div>
              </div>
              <div><label className="label">Email Address</label><input className="input" type="email" value={settings.email} onChange={e => setSettings({ ...settings, email: e.target.value })} /></div>
            </div>
          </section>

          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-light)' }} />

          {/* Payment Bank Details */}
          <section>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
              <CreditCard size={20} /> Bank Account for Guest Transfers
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <div>
                <label className="label">Bank Name</label>
                <input className="input" value={settings.bankName} onChange={e => setSettings({ ...settings, bankName: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-md)' }}>
                <div>
                  <label className="label">Account Number</label>
                  <input className="input" value={settings.accountNumber} onChange={e => setSettings({ ...settings, accountNumber: e.target.value })} />
                </div>
                <div>
                  <label className="label">Account Name</label>
                  <input className="input" value={settings.accountName} onChange={e => setSettings({ ...settings, accountName: e.target.value })} />
                </div>
              </div>
            </div>
          </section>

          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-light)' }} />

          {/* Location */}
          <section>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
              <MapPin size={20} /> Location
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
              <div><label className="label">Address</label><input className="input" value={settings.address} onChange={e => setSettings({ ...settings, address: e.target.value })} /></div>
              <div><label className="label">Google Maps Embed URL</label><input className="input" value={settings.googleMapsEmbed} onChange={e => setSettings({ ...settings, googleMapsEmbed: e.target.value })} placeholder="Paste your Google Maps embed URL here" /></div>
            </div>
          </section>

          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-light)' }} />

          {/* Hours */}
          <section>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
              <Clock size={20} /> Operating Hours
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-lg)' }}>
              <div><label className="label">Check-in Time</label><input className="input" value={settings.checkInTime} onChange={e => setSettings({ ...settings, checkInTime: e.target.value })} /></div>
              <div><label className="label">Check-out Time</label><input className="input" value={settings.checkOutTime} onChange={e => setSettings({ ...settings, checkOutTime: e.target.value })} /></div>
              <div><label className="label">Restaurant Opens</label><input className="input" value={settings.restaurantHoursOpen} onChange={e => setSettings({ ...settings, restaurantHoursOpen: e.target.value })} /></div>
              <div><label className="label">Restaurant Closes</label><input className="input" value={settings.restaurantHoursClose} onChange={e => setSettings({ ...settings, restaurantHoursClose: e.target.value })} /></div>
            </div>
          </section>

          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-light)' }} />

          {/* Branding */}
          <section>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
              <Palette size={20} /> Branding & Currency
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-lg)' }}>
              <div>
                <label className="label">Primary Color</label>
                <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
                  <input type="color" value={settings.primaryColor} onChange={e => setSettings({ ...settings, primaryColor: e.target.value })} style={{ width: '48px', height: '40px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }} />
                  <input className="input" value={settings.primaryColor} onChange={e => setSettings({ ...settings, primaryColor: e.target.value })} style={{ flex: 1 }} />
                </div>
              </div>
              <div>
                <label className="label">Accent Color</label>
                <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
                  <input type="color" value={settings.accentColor} onChange={e => setSettings({ ...settings, accentColor: e.target.value })} style={{ width: '48px', height: '40px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }} />
                  <input className="input" value={settings.accentColor} onChange={e => setSettings({ ...settings, accentColor: e.target.value })} style={{ flex: 1 }} />
                </div>
              </div>
              <div><label className="label">Currency Symbol</label><input className="input" value={settings.currencySymbol} onChange={e => setSettings({ ...settings, currencySymbol: e.target.value })} /></div>
            </div>
          </section>

          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-light)' }} />

          {/* Social Media */}
          <section>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
              <Share2 size={20} /> Social Media Pages
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-lg)' }}>
              Add your social media page URLs below. These will appear as clickable icons in the website footer.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
              <div>
                <label className="label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <FacebookIcon size={16} style={{ color: '#1877F2' }} /> Facebook Page URL
                </label>
                <input className="input" value={settings.socialFacebook} onChange={e => setSettings({ ...settings, socialFacebook: e.target.value })} placeholder="https://facebook.com/superehotel" />
              </div>
              <div>
                <label className="label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <InstagramIcon size={16} style={{ color: '#E4405F' }} /> Instagram Page URL
                </label>
                <input className="input" value={settings.socialInstagram} onChange={e => setSettings({ ...settings, socialInstagram: e.target.value })} placeholder="https://instagram.com/superehotel" />
              </div>
              <div>
                <label className="label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <TwitterIcon size={16} style={{ color: '#1DA1F2' }} /> Twitter / X Page URL
                </label>
                <input className="input" value={settings.socialTwitter} onChange={e => setSettings({ ...settings, socialTwitter: e.target.value })} placeholder="https://twitter.com/superehotel" />
              </div>
            </div>
          </section>

          <div style={{ paddingBottom: 'var(--space-2xl)' }}>
            <button className="btn btn-primary btn-lg" onClick={handleSave} disabled={saving} style={{ width: '100%' }}>
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {saved ? '✓ Settings Saved!' : saving ? 'Saving...' : 'Save All Settings'}
            </button>
          </div>
        </div>
        )}
      </main>
    </div>
  );
}
