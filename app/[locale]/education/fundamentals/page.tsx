// ============================================================
// FICHIER : app/[locale]/education/fundamentals/page.tsx
// URL finale : propfirmscanner.org/education/fundamentals
// ============================================================

export const metadata = {
  title: 'Prop Firm Fundamentals — PropFirmScanner Academy',
  description: 'Master prop trading from scratch. 10 lessons, interactive quizzes, and audio narration. Learn challenge rules, risk management, psychology and more.',
};

export default function FundamentalsCoursePage() {
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
