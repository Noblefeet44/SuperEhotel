'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Bed, CalendarCheck, UtensilsCrossed,
  Dumbbell, Star, Image as ImageIcon, Settings,
  LogOut, Menu, X, ArrowLeft, Building2, FileText,
  MessageCircle, ExternalLink, Grid, Sparkles, UploadCloud,
  ChevronRight, PhoneCall, ShieldCheck
} from 'lucide-react';
import { HOTEL_INFO } from '@/lib/hotel-data';
import { generateWhatsAppURL } from '@/lib/utils';

interface AdminMobileNavProps {
  title?: string;
  subtitle?: string;
  backHref?: string;
  actionButton?: React.ReactNode;
}

export const ADMIN_FEATURES = [
  {
    href: '/admin',
    title: 'Dashboard',
    subtitle: 'Overview & key stats',
    icon: LayoutDashboard,
    color: '#3B82F6',
    bg: '#EFF6FF',
    badge: 'Live',
  },
  {
    href: '/admin/bookings',
    title: 'Guest Bookings',
    subtitle: 'Check & verify reservations',
    icon: CalendarCheck,
    color: '#10B981',
    bg: '#ECFDF5',
    badge: 'Check Bookings',
  },
  {
    href: '/admin/rooms',
    title: 'Room Listings',
    subtitle: 'Rates, units & descriptions',
    icon: Bed,
    color: '#8B5CF6',
    bg: '#F5F3FF',
    badge: '8 Tiers',
  },
  {
    href: '/admin/media',
    title: 'Upload & Media',
    subtitle: 'Add photos & room pictures',
    icon: UploadCloud,
    color: '#EC4899',
    bg: '#FDF2F8',
    badge: 'Upload',
  },
  {
    href: '/admin/restaurant',
    title: 'Restaurant Menu',
    subtitle: 'Dishes, prices & availability',
    icon: UtensilsCrossed,
    color: '#F59E0B',
    bg: '#FFFBEB',
  },
  {
    href: '/admin/gym',
    title: 'Gym & Fitness',
    subtitle: 'Plans, equipment & passes',
    icon: Dumbbell,
    color: '#06B6D4',
    bg: '#ECFEFF',
  },
  {
    href: '/admin/facilities',
    title: 'Hotel Facilities',
    subtitle: 'Pool, event hall & bar',
    icon: Building2,
    color: '#6366F1',
    bg: '#EEF2FF',
  },
  {
    href: '/admin/reviews',
    title: 'Guest Reviews',
    subtitle: 'Ratings & testimonials',
    icon: Star,
    color: '#EAB308',
    bg: '#FEFCE8',
  },
  {
    href: '/admin/content',
    title: 'Site Content',
    subtitle: 'Banners, notices & copy',
    icon: FileText,
    color: '#64748B',
    bg: '#F8FAFC',
  },
  {
    href: '/admin/settings',
    title: 'Hotel Settings',
    subtitle: 'Bank accounts & contact info',
    icon: Settings,
    color: '#475569',
    bg: '#F1F5F9',
  },
];

export function AdminMobileNav({ title = 'Admin Panel', subtitle, backHref, actionButton }: AdminMobileNavProps) {
  const [launcherOpen, setLauncherOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    sessionStorage.removeItem('admin_email');
    localStorage.removeItem('admin_authenticated');
    router.push('/admin/login');
  };

  return (
    <>
      {/* Mobile Top App Bar */}
      <header className="admin-mobile-topbar" id="admin-mobile-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0, flex: 1, overflow: 'hidden' }}>
          {backHref ? (
            <Link
              href={backHref}
              className="admin-mobile-icon-btn"
              aria-label="Back to dashboard"
              style={{
                background: '#F1F5F9',
                color: '#0F172A',
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <ArrowLeft size={19} />
            </Link>
          ) : (
            <button
              onClick={() => setLauncherOpen(true)}
              className="admin-mobile-icon-btn"
              aria-label="All features launcher"
              type="button"
              style={{
                background: 'linear-gradient(135deg, #1E3A8A 0%, #1E2D5F 100%)',
                color: '#FFFFFF',
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 2px 6px rgba(30, 58, 138, 0.25)',
              }}
            >
              <Grid size={18} />
            </button>
          )}

          <div style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', overflow: 'hidden' }}>
              <h2
                style={{
                  fontSize: '0.9rem',
                  margin: 0,
                  fontWeight: 800,
                  color: '#0F172A',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  lineHeight: 1.2,
                }}
              >
                {title}
              </h2>
              <span
                style={{
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  backgroundColor: '#DCFCE7',
                  color: '#166534',
                  padding: '0.1rem 0.3rem',
                  borderRadius: '9999px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                  flexShrink: 0,
                }}
              >
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#16A34A' }}></span>
                Live
              </span>
            </div>
            {subtitle && (
              <span
                style={{
                  fontSize: '0.68rem',
                  color: '#64748B',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: 'block',
                }}
              >
                {subtitle}
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
          {actionButton}

          <a
            href={generateWhatsAppURL(HOTEL_INFO.whatsappNumber)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp Guests"
            style={{
              background: '#25D366',
              color: '#FFFFFF',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              boxShadow: '0 2px 4px rgba(37, 211, 102, 0.25)',
            }}
          >
            <MessageCircle size={17} />
          </a>

          <button
            onClick={() => setLauncherOpen(true)}
            type="button"
            className="btn btn-sm"
            style={{
              fontSize: '0.72rem',
              padding: '0.32rem 0.65rem',
              backgroundColor: '#EFF6FF',
              color: '#1E3A8A',
              border: '1px solid #BFDBFE',
              borderRadius: '8px',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Grid size={13} />
            <span>Menu</span>
          </button>
        </div>
      </header>

      {/* ALL FEATURES APP LAUNCHER MODAL / SHEET */}
      {launcherOpen && (
        <div
          className="admin-app-sheet-backdrop"
          onClick={() => setLauncherOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          <div
            className="admin-app-sheet-panel"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
              maxHeight: '90vh',
              width: '100%',
              maxWidth: '100vw',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.2)',
              overflow: 'hidden',
            }}
          >
            {/* Sheet Handle & Header */}
            <div
              style={{
                padding: '0.75rem 1.25rem 0.85rem',
                borderBottom: '1px solid #F1F5F9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#FAFAFA',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #1E3A8A 0%, #0F172A 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#C6A75E',
                  }}
                >
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: '#0F172A' }}>
                    Super E App Features
                  </h3>
                  <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
                    Tap any button to manage hotel
                  </span>
                </div>
              </div>

              <button
                onClick={() => setLauncherOpen(false)}
                type="button"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: '#E2E8F0',
                  color: '#475569',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                aria-label="Close launcher"
              >
                <X size={18} />
              </button>
            </div>

            {/* Feature App Grid */}
            <div
              style={{
                padding: '0.75rem',
                overflowY: 'auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: '0.55rem',
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              {ADMIN_FEATURES.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setLauncherOpen(false)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      padding: '0.75rem 0.6rem',
                      borderRadius: '16px',
                      backgroundColor: isActive ? '#EFF6FF' : '#F8FAFC',
                      border: isActive ? '2px solid #3B82F6' : '1px solid #E2E8F0',
                      textDecoration: 'none',
                      position: 'relative',
                      transition: 'all 0.15s ease',
                      minWidth: 0,
                      boxSizing: 'border-box',
                      overflow: 'hidden',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '12px',
                          backgroundColor: item.bg,
                          color: item.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon size={22} />
                      </div>
                      {item.badge && (
                        <span
                          style={{
                            fontSize: '0.62rem',
                            fontWeight: 700,
                            padding: '0.15rem 0.4rem',
                            borderRadius: '9999px',
                            backgroundColor: item.color,
                            color: '#FFFFFF',
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0F172A', marginBottom: '2px' }}>
                      {item.title}
                    </span>
                    <span style={{ fontSize: '0.68rem', color: '#64748B', lineHeight: 1.25 }}>
                      {item.subtitle}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Quick Actions Footer */}
            <div
              style={{
                padding: '0.85rem 1rem calc(0.85rem + env(safe-area-inset-bottom, 10px))',
                backgroundColor: '#F8FAFC',
                borderTop: '1px solid #E2E8F0',
                display: 'flex',
                gap: '0.65rem',
              }}
            >
              <Link
                href="/"
                target="_blank"
                onClick={() => setLauncherOpen(false)}
                className="btn btn-sm"
                style={{
                  flex: 1,
                  backgroundColor: '#FFFFFF',
                  color: '#1E3A8A',
                  border: '1px solid #CBD5E1',
                  borderRadius: '10px',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  padding: '0.55rem',
                }}
              >
                <ExternalLink size={15} /> Customer Site
              </Link>
              <button
                onClick={handleLogout}
                type="button"
                className="btn btn-sm"
                style={{
                  backgroundColor: '#FEE2E2',
                  color: '#DC2626',
                  border: '1px solid #FECACA',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  padding: '0.55rem 1rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                <LogOut size={15} /> Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Mobile Bottom Navigation Dock */}
      <nav className="admin-mobile-bottom-bar" id="admin-mobile-bottom-bar">
        <Link
          href="/admin"
          className={`admin-tab ${pathname === '/admin' ? 'active' : ''}`}
        >
          <div className="tab-icon-wrapper">
            <LayoutDashboard size={20} />
          </div>
          <span>Dashboard</span>
        </Link>

        <Link
          href="/admin/rooms"
          className={`admin-tab ${pathname === '/admin/rooms' ? 'active' : ''}`}
        >
          <div className="tab-icon-wrapper">
            <Bed size={20} />
          </div>
          <span>Rooms</span>
        </Link>

        <Link
          href="/admin/bookings"
          className={`admin-tab ${pathname === '/admin/bookings' ? 'active' : ''}`}
        >
          <div className="tab-icon-wrapper" style={{ position: 'relative' }}>
            <CalendarCheck size={20} />
            <span
              style={{
                position: 'absolute',
                top: '-3px',
                right: '-6px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#10B981',
                boxShadow: '0 0 0 2px #FFFFFF',
              }}
            />
          </div>
          <span>Bookings</span>
        </Link>

        <Link
          href="/admin/media"
          className={`admin-tab ${pathname === '/admin/media' ? 'active' : ''}`}
        >
          <div className="tab-icon-wrapper">
            <UploadCloud size={20} />
          </div>
          <span>Upload</span>
        </Link>

        <button
          onClick={() => setLauncherOpen(true)}
          className={`admin-tab ${launcherOpen ? 'active' : ''}`}
          type="button"
          aria-label="All hotel admin features"
        >
          <div
            className="tab-icon-wrapper"
            style={{
              background: 'linear-gradient(135deg, #1E3A8A 0%, #C6A75E 100%)',
              color: '#FFFFFF',
              borderRadius: '8px',
              padding: '2px',
              width: '26px',
              height: '26px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Grid size={15} />
          </div>
          <span style={{ fontWeight: 800 }}>All Features</span>
        </button>
      </nav>
    </>
  );
}
