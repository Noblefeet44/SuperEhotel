import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist at Super E Luxury Hotel & Suites.',
};

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 'var(--space-2xl)',
      }}
    >
      <h1 style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--color-primary)', margin: 0 }}>
        404
      </h1>
      <h2 style={{ fontSize: '1.5rem', margin: 'var(--space-md) 0' }}>
        Page Not Found
      </h2>
      <p style={{ color: 'var(--color-text-secondary)', maxWidth: '500px', marginBottom: 'var(--space-xl)' }}>
        Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved.
        Let us help you find what you need.
      </p>
      <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/" className="btn btn-primary">
          Back to Home
        </Link>
        <Link href="/rooms" className="btn btn-outline">
          View Rooms &amp; Rates
        </Link>
        <Link href="/contact" className="btn btn-outline">
          Contact Us
        </Link>
      </div>
    </div>
  );
}
