'use client';

import { useState } from 'react';
import { ShieldCheck, Clock, CreditCard, AlertCircle, X, ChevronRight, CheckCircle2 } from 'lucide-react';
import { HOTEL_POLICIES, HOTEL_INFO } from '@/lib/hotel-data';

interface HotelPoliciesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HotelPoliciesModal({ isOpen, onClose }: HotelPoliciesModalProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'All Policies' },
    { id: 'timing', label: 'Check-In/Out' },
    { id: 'rates', label: 'Taxes & Rates' },
    { id: 'payments', label: 'Payments' },
    { id: 'cancellation', label: 'Cancellation' },
    { id: 'security', label: 'Valuables' },
  ];

  const filtered = activeCategory === 'all'
    ? HOTEL_POLICIES
    : HOTEL_POLICIES.filter((p) => p.category === activeCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'timing':
        return <Clock size={18} style={{ color: '#D97706' }} />;
      case 'payments':
      case 'rates':
        return <CreditCard size={18} style={{ color: '#16A34A' }} />;
      case 'security':
        return <ShieldCheck size={18} style={{ color: '#2563EB' }} />;
      default:
        return <AlertCircle size={18} style={{ color: '#A16207' }} />;
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'flex-end', // bottom-sheet on mobile
        justifyContent: 'center',
        padding: 0,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          backgroundColor: '#FFFFFF',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          boxShadow: '0 -10px 40px rgba(0,0,0,0.25)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'slideUp 0.25s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #1E2D5F 0%, #1E3A8A 100%)',
            color: '#FFFFFF',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(255,255,255,0.3)',
              }}
            >
              <ShieldCheck size={22} style={{ color: '#FDE047' }} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
                Hotel Terms &amp; Policies
              </h3>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'rgba(255,255,255,0.8)' }}>
                {HOTEL_INFO.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: '#FFFFFF',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              touchAction: 'manipulation',
            }}
            aria-label="Close policies modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Category Filter Pills (Mobile horizontal scroll) */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto',
            padding: '0.75rem 1rem',
            backgroundColor: '#F8FAFC',
            borderBottom: '1px solid #E2E8F0',
            scrollbarWidth: 'none',
          }}
        >
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: 600,
                border: activeCategory === c.id ? 'none' : '1px solid #CBD5E1',
                backgroundColor: activeCategory === c.id ? '#1E3A8A' : '#FFFFFF',
                color: activeCategory === c.id ? '#FFFFFF' : '#475569',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                touchAction: 'manipulation',
              }}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Content list */}
        <div
          style={{
            padding: '1rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
          }}
        >
          {filtered.map((policy) => (
            <div
              key={policy.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                padding: '1rem',
                border: '1px solid #E2E8F0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {getCategoryIcon(policy.category)}
                  <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#0F172A' }}>
                    {policy.title}
                  </h4>
                </div>
                {policy.badge && (
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.5rem',
                      borderRadius: '9999px',
                      backgroundColor: '#FEF3C7',
                      color: '#92400E',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {policy.badge}
                  </span>
                )}
              </div>
              <p style={{ margin: '0 0 0.35rem 0', fontSize: '0.875rem', fontWeight: 500, color: '#334155' }}>
                {policy.summary}
              </p>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B', lineHeight: 1.5 }}>
                {policy.details}
              </p>
            </div>
          ))}
        </div>

        {/* Mobile footer CTA */}
        <div
          style={{
            padding: '0.85rem 1.25rem',
            borderTop: '1px solid #E2E8F0',
            backgroundColor: '#F8FAFC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
            <span>Need clarification? </span>
            <a
              href={`tel:${HOTEL_INFO.hotlines[0]}`}
              style={{ color: '#1E3A8A', fontWeight: 600, textDecoration: 'underline' }}
            >
              Call Front Desk
            </a>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '0.5rem 1.25rem',
              backgroundColor: '#1E3A8A',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              touchAction: 'manipulation',
            }}
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}
