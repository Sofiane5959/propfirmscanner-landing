'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

/**
 * Bascule jour (Papier) / nuit (Graphite).
 * L'etat initial est pose par le script de app/[locale]/layout.tsx ; ce
 * composant ne fait que le lire, puis enregistre le choix du visiteur.
 */
export function ThemeToggle({ withLabel = false }: { withLabel?: boolean }) {
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggle = () => {
    const next = !document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', next);
    try { localStorage.setItem('pfs-theme', next ? 'dark' : 'light'); } catch {}
    setDark(next);
  };

  const label = dark ? 'Day mode' : 'Night mode';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="flex items-center justify-center gap-2 min-w-[40px] min-h-[40px] px-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-dark-700 transition-colors"
    >
      {dark === null ? (
        <span className="w-4 h-4" />
      ) : dark ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
      {withLabel && <span className="text-sm font-medium">{label}</span>}
    </button>
  );
}
