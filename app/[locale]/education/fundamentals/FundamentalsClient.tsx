'use client';

// ============================================================
// FICHIER : app/[locale]/education/fundamentals/FundamentalsClient.tsx
// ============================================================

export default function FundamentalsClient() {
  return (
    <iframe
      src="/course/index.html"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        border: 'none',
        zIndex: 9999,
      }}
      allow="autoplay"
      title="Prop Firm Fundamentals Course"
    />
  );
}
