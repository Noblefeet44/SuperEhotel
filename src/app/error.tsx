'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
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
      <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)', margin: '0 0 var(--space-md) 0' }}>
        Something Went Wrong
      </h1>
      <p style={{ color: 'var(--color-text-secondary)', maxWidth: '500px', marginBottom: 'var(--space-xl)' }}>
        We apologize for the inconvenience. Please try again or contact our front desk for assistance.
      </p>
      <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={reset} className="btn btn-primary">
          Try Again
        </button>
        <a href="/" className="btn btn-outline">
          Back to Home
        </a>
      </div>
    </div>
  );
}
