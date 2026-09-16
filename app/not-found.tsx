import Link from 'next/link';

export default function NotFound() {
  return (
    <html lang="en">
      <body className="bg-bg-base">
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-accent mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-white mb-4">Page Not Found</h2>
            <p className="text-text-secondary mb-8">
              The page you are looking for does not exist.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent-hover hover:brightness-110 text-white rounded-lg transition-colors"
            >
              Go Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
