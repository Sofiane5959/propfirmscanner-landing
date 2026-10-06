'use client';

import { usePathname } from 'next/navigation';
import NewsletterPopup from './NewsletterPopup';
import PromoPopup from './PromoPopup';

export default function PopupsWrapper() {
  // Sur /compare, l'offre du jour est dans l'en-tete de la page : le popup
  // recouvrait les cartes sur ordinateur (6/10/2026).
  const pathname = usePathname() || '';
  const surCompare = /\/compare(\/|$)/.test(pathname) && !/\/compare\/[^/]+-vs-/.test(pathname);
  return (
    <>
      <NewsletterPopup />
      {!surCompare && <PromoPopup />}
    </>
  );
}
