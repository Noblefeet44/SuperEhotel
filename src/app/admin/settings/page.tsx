'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Settings, ArrowLeft, Save, Phone, MapPin, Globe, Clock, Palette } from 'lucide-react';

export default function AdminSettingsPage() {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    hotelName: 'Super E Luxury Hotel & Suites',
    tagline: 'Luxury at Its Peak',
    phone: '09131964939',
    whatsapp: '09131964939',
    email: 'info@superehotel.com',
    address: 'Keffi, Nasarawa State, Nigeria',
    googleMapsEmbed: '',
    primaryColor: '#1E3A8A',
    accentColor: '#CA8A04',
    restaurantHoursOpen: '7:00 AM',
    restaurantHoursClose: '10:00 PM',
    checkInTime: '2:00 PM',
    checkOutTime: '12:00 PM',
    currency: 'NGN',
    currencySymbol: '₦',
    aboutText: 'Super E Luxury Hotel & Suites is a premier hospitality destination located in Keffi, Nasarawa State, Nigeria.',
    metaDescription: 'Experience unparalleled luxury and comfort at Super E Luxury Hotel & Suites in Keffi, Nigeria.',
    socialFacebook: '',
    socialInstagram: '',
    socialTwitter: '',
  });

  useEffect(() => {
    if (sessionStorage.getItem('admin_authenticated') !== 'true') router.push('/admin/login');
  }, [router]);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header"><h2>Super E Hotel</h2><span>Admin Dashboard</span></div>
        <nav style={{ padding: 'var(--space-sm) 0' }}>
          <Link href="/admin" className="admin-nav-item"><ArrowLeft size={20} /><span>Back to Dashboard</span></Link>
          <div className="admin-nav-item active"><Settings size={20} /><span>Settings</span></div>
        </nav>
      </aside>

      <main className="admin-main">
        <div className="admin-header">
          <h1>Hotel Settings</h1>
          <button className="btn btn-primary" onClick={handleSave}>
            <Save size={18} /> {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>

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

          {/* Social */}
          <section>
            <h3 style={{ marginBottom: 'var(--space-lg)' }}>Social Media Links</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
              <div><label className="label">Facebook URL</label><input className="input" value={settings.socialFacebook} onChange={e => setSettings({ ...settings, socialFacebook: e.target.value })} placeholder="https://facebook.com/..." /></div>
              <div><label className="label">Instagram URL</label><input className="input" value={settings.socialInstagram} onChange={e => setSettings({ ...settings, socialInstagram: e.target.value })} placeholder="https://instagram.com/..." /></div>
              <div><label className="label">Twitter/X URL</label><input className="input" value={settings.socialTwitter} onChange={e => setSettings({ ...settings, socialTwitter: e.target.value })} placeholder="https://twitter.com/..." /></div>
            </div>
          </section>

          <div style={{ paddingBottom: 'var(--space-2xl)' }}>
            <button className="btn btn-primary btn-lg" onClick={handleSave} style={{ width: '100%' }}>
              <Save size={18} /> {saved ? '✓ Settings Saved!' : 'Save All Settings'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
