'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  ArrowUpRight, Star, Copy, Check, Gift, BadgeCheck, Search, Timer, RotateCcw,
} from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { appliquerOffresDesFiches, bonusFiche, prixRemiseFiche } from '@/lib/offres-fiches';
import { suivre } from '@/lib/suivi';
import { buildAffiliateUrl } from '@/lib/affiliate';

// =============================================================================
// LOCALE DETECTION
// =============================================================================

const locales = ['en', 'fr', 'de', 'es', 'pt', 'ar', 'hi'] as const;
type Locale = (typeof locales)[number];

function getLocaleFromPath(pathname: string): Locale {
  const firstSegment = pathname.split('/')[1];
  if (firstSegment && locales.includes(firstSegment as Locale)) {
    return firstSegment as Locale;
  }
  return 'en';
}

// =============================================================================
// TRANSLATIONS — en + fr complete; the other locales fall back to English for
// any key they don't carry ({ ...translations.en, ...translations[locale] }).
// =============================================================================

const translations: Record<Locale, Record<string, string>> = {
  en: {
    dealOfDay: 'Deal of the day',
    endsIn: 'Ends in',
    days: 'days',
    hours: 'hours',
    minutes: 'min',
    grab: 'Get {pct} off',
    getDeal: 'Get {pct}',
    from: 'From',
    sheet: 'Review',
    codeLabel: 'Code',
    discountLabel: 'Discount',
    viaOurLink: 'Applied via our link',
    expiresOn: 'Expires {date}',
    expiresIn: 'Expires in {n} d',
    noEndDate: 'No end date',
    verifiedBadge: 'Verified',
    allFirms: 'All firms',
    allFirmsSubtitle: 'Firms without an active deal right now.',
    colFirm: 'Firm',
    colPrice: 'From',
    colSplit: 'Split',
    colRating: 'Rating',
    seeOffer: 'View offer',
    details: 'Details',
    copied: 'Copied',
    copy: 'Copy',
    noDealsYet: 'New deals coming soon',
    noDealsBody: 'No active codes right now. Browse all firms below.',
    loading: 'Loading deals…',
    errorTitle: 'Couldn’t load deals right now',
    errorBody: 'Refresh the page or try again in a minute.',
    retry: 'Try again',
    affiliateNotice:
      'Affiliate links: we earn a commission at no cost to you. The ranking stays independent.',
    readMore: 'How we make money',
    search: 'Search a firm…',
    sortDiscount: 'Biggest discount',
    sortPrice: 'Lowest price',
    sortRating: 'Best rated',
    sortLabel: 'Sort',
    codeOnly: 'With a code',
    showMore: 'Show more firms',
    nothing: 'No firm matches your search.',
    counted: 'deals',
  },
  fr: {
    dealOfDay: 'Offre du jour',
    endsIn: 'Se termine dans',
    days: 'jours',
    hours: 'heures',
    minutes: 'min',
    grab: 'Profiter de {pct}',
    getDeal: 'Obtenir {pct}',
    from: 'Dès',
    sheet: 'Fiche',
    codeLabel: 'Code',
    discountLabel: 'Remise',
    viaOurLink: 'Appliquée via notre lien',
    expiresOn: 'Expire le {date}',
    expiresIn: 'Expire dans {n} j',
    noEndDate: 'Sans date de fin',
    verifiedBadge: 'Vérifiée',
    allFirms: 'Toutes les firmes',
    allFirmsSubtitle: 'Les firmes sans offre en cours.',
    colFirm: 'Firme',
    colPrice: 'Prix dès',
    colSplit: 'Split',
    colRating: 'Note',
    seeOffer: 'Voir l’offre',
    details: 'Détails',
    search: 'Chercher une firme…',
    sortDiscount: 'Plus grosse remise',
    sortPrice: 'Prix le plus bas',
    sortRating: 'Mieux notées',
    sortLabel: 'Trier',
    codeOnly: 'Avec code',
    showMore: 'Voir plus de firmes',
    nothing: 'Aucune firme ne correspond.',
    counted: 'offres',
    copied: 'Copié',
    copy: 'Copier',
    noDealsYet: 'Nouvelles offres bientôt',
    noDealsBody: 'Aucun code actif pour l’instant. Parcours les firmes ci-dessous.',
    loading: 'Chargement des offres…',
    errorTitle: 'Impossible de charger les offres',
    errorBody: 'Recharge la page ou réessaie dans une minute.',
    retry: 'Réessayer',
    affiliateNotice:
      'Liens affiliés : nous touchons une commission, sans coût pour toi. Le classement reste indépendant.',
    readMore: 'Comment on gagne de l’argent',
  },
  de: {
    search: 'Firma suchen…',
    sortDiscount: 'Höchster Rabatt',
    sortPrice: 'Niedrigster Preis',
    sortRating: 'Beste Bewertung',
    codeOnly: 'Mit Code',
    showMore: 'Mehr Firmen anzeigen',
    nothing: 'Keine Firma entspricht deiner Suche.',
    counted: 'Angebote',
    allFirms: 'Alle Prop Firms',
    details: 'Details',
    copied: 'Kopiert!',
    copy: 'Kopieren',
    noDealsYet: 'Bald neue Angebote',
    noDealsBody: 'Aktuell keine aktiven Codes. Durchsuche alle Firmen unten.',
    loading: 'Angebote werden geladen…',
  },
  es: {
    search: 'Buscar una firma…',
    sortDiscount: 'Mayor descuento',
    sortPrice: 'Precio más bajo',
    sortRating: 'Mejor valoradas',
    codeOnly: 'Con código',
    showMore: 'Ver más firmas',
    nothing: 'Ninguna firma coincide con tu búsqueda.',
    counted: 'ofertas',
    allFirms: 'Todas las Prop Firms',
    details: 'Detalles',
    copied: '¡Copiado!',
    copy: 'Copiar',
    noDealsYet: 'Nuevas ofertas próximamente',
    noDealsBody: 'Sin códigos activos. Navega por todas las firmas abajo.',
    loading: 'Cargando ofertas…',
  },
  pt: {
    search: 'Procurar uma firma…',
    sortDiscount: 'Maior desconto',
    sortPrice: 'Menor preço',
    sortRating: 'Melhor avaliadas',
    codeOnly: 'Com código',
    showMore: 'Ver mais firmas',
    nothing: 'Nenhuma firma corresponde à sua busca.',
    counted: 'ofertas',
    allFirms: 'Todas as Prop Firms',
    details: 'Detalhes',
    copied: 'Copiado!',
    copy: 'Copiar',
    noDealsYet: 'Novas ofertas em breve',
    noDealsBody: 'Sem códigos ativos. Explore todas as firmas abaixo.',
    loading: 'Carregando ofertas…',
  },
  ar: {
    search: 'ابحث عن شركة…',
    sortDiscount: 'أكبر خصم',
    sortPrice: 'أقل سعر',
    sortRating: 'الأعلى تقييماً',
    codeOnly: 'مع كود',
    showMore: 'عرض المزيد من الشركات',
    nothing: 'لا توجد شركة تطابق بحثك.',
    counted: 'عروض',
    allFirms: 'جميع شركات التداول',
    details: 'التفاصيل',
    copied: 'تم النسخ!',
    copy: 'نسخ',
    noDealsYet: 'عروض جديدة قريباً',
    noDealsBody: 'لا توجد رموز نشطة. تصفح الشركات أدناه.',
    loading: 'جاري تحميل العروض…',
  },
  hi: {
    search: 'फ़र्म खोजें…',
    sortDiscount: 'सबसे बड़ी छूट',
    sortPrice: 'सबसे कम कीमत',
    sortRating: 'सबसे अच्छी रेटिंग',
    codeOnly: 'कोड के साथ',
    showMore: 'और फ़र्म देखें',
    nothing: 'आपकी खोज से कोई फ़र्म मेल नहीं खाती।',
    counted: 'ऑफ़र',
    allFirms: 'सभी प्रॉप फर्म्स',
    details: 'विवरण',
    copied: 'कॉपी हो गया!',
    copy: 'कॉपी',
    noDealsYet: 'जल्द ही नई डील्स',
    noDealsBody: 'अभी कोई सक्रिय कोड नहीं। नीचे सभी फर्म्स देखें।',
    loading: 'डील्स लोड हो रहे हैं…',
  },
};

type T = Record<string, string>;

// =============================================================================
// TYPES
// =============================================================================

interface PropFirm {
  id: string;
  slug: string;
  name: string;
  logo_url: string | null;
  trustpilot_rating: number | null;
  trustpilot_reviews: number | null;
  min_price: number | null;
  profit_split: number | null;
  max_profit_split: number | null;
  discount_code: string | null;
  discount_percent: number | null;
  discount_expires_at: string | null;
  affiliate_url: string | null;
  website_url: string | null;
  priority_tier: number | null;
  trust_status: string | null;
  listing_status: string | null;
}

const COLONNES =
  'id, slug, name, logo_url, trustpilot_rating, trustpilot_reviews, min_price, profit_split, max_profit_split, discount_code, discount_percent, discount_expires_at, affiliate_url, website_url, priority_tier, trust_status, listing_status';

// =============================================================================
// SMALL HELPERS
// =============================================================================

const JOUR = 86_400_000;

/** Fin de l'offre en ms, ou null si la base / la fiche n'en donne pas. */
function finOffre(f: PropFirm): number | null {
  if (!f.discount_expires_at) return null;
  const fin = new Date(f.discount_expires_at).getTime();
  return Number.isNaN(fin) ? null : fin;
}

/** Une remise datee et depassee ne compte plus : meme regle que /compare. */
function remiseActive(f: PropFirm, maintenant = Date.now()): boolean {
  if ((f.discount_percent ?? 0) <= 0) return false;
  const fin = finOffre(f);
  return fin == null || fin > maintenant;
}

const aCode = (f: PropFirm) => !!(f.discount_code && f.discount_code.trim().length > 0);
const aSortie = (f: PropFirm) =>
  !!((f.affiliate_url && f.affiliate_url !== '#') || (f.website_url && f.website_url !== '#'));

/** « −50 % » en français (espace fine insécable), « −50% » ailleurs. */
function pct(n: number, locale: string) {
  return locale === 'fr' ? `−${n} %` : `−${n}%`;
}

function prix(n: number) {
  return `$${n.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
}

/** Partage : « 50→80% » quand la firme commence plus bas que son plafond. */
function partage(f: PropFirm): string | null {
  const debut = f.profit_split;
  const max = f.max_profit_split;
  if (debut != null && max != null && debut !== max) return `${debut}→${max}%`;
  const v = debut ?? max;
  return v != null ? `${v}%` : null;
}

/**
 * Le prix barre n'apparait que si la firme a un code (CLAUDE.md) et que la
 * fiche garantit la remise sur tous les plans (prixRemiseFiche).
 */
function prixRemise(f: PropFirm): number | null {
  if (!aCode(f) || !remiseActive(f)) return null;
  return prixRemiseFiche(f.slug, f.min_price);
}

const estVerifiee = (f: PropFirm) =>
  ['scanned', 'verified', 'trusted'].includes((f.trust_status ?? '').toLowerCase());

const fill = (s: string, vars: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));

// =============================================================================
// SORT — best deals first, every firm visible
// =============================================================================

/**
 * Sort priority for the deals page:
 *   Tier 1: affiliate URL + discount   (real partners — FTMO, Funding Pips, …)
 *   Tier 2: discount only              (still useful info)
 *   Tier 3: no deal                    (still browseable below)
 *
 * Within each tier we sort by priority_tier (Top 10 first), then discount %,
 * then trustpilot rating. FTMO 19% naturally lands at the very top.
 */
function dealsSort(a: PropFirm, b: PropFirm): number {
  const score = (f: PropFirm) => {
    const hasAff = f.affiliate_url && f.affiliate_url !== '#' ? 1 : 0;
    const hasDiscount = (f.discount_percent ?? 0) > 0 ? 1 : 0;
    if (hasAff && hasDiscount) return 0;
    if (hasDiscount) return 1;
    return 2;
  };

  const sa = score(a);
  const sb = score(b);
  if (sa !== sb) return sa - sb;

  const ta = a.priority_tier ?? 99;
  const tb = b.priority_tier ?? 99;
  if (ta !== tb) return ta - tb;

  const da = a.discount_percent ?? 0;
  const db = b.discount_percent ?? 0;
  if (da !== db) return db - da;

  const ra = a.trustpilot_rating ?? 0;
  const rb = b.trustpilot_rating ?? 0;
  return rb - ra;
}

// =============================================================================
// BUILDING BLOCKS
// =============================================================================

const CARTE =
  'relative overflow-hidden rounded-2xl border border-border bg-bg-elevated shadow-[0_1px_2px_rgba(28,25,23,0.05),0_10px_28px_-16px_rgba(28,25,23,0.22)] dark:bg-gradient-to-b dark:from-white/[0.035] dark:to-transparent dark:shadow-none';
const BTN_ACHAT =
  'flex min-h-12 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl bg-accent-hover px-4 text-sm font-semibold text-on-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_1px_2px_rgba(4,35,26,0.2)] transition hover:brightness-105';
const BTN_SECONDAIRE_BASE =
  'flex items-center justify-center whitespace-nowrap rounded-xl border border-border-hover bg-bg-elevated px-4 text-sm font-semibold text-text-primary transition-colors hover:border-text-primary dark:bg-transparent';
const BTN_SECONDAIRE = `${BTN_SECONDAIRE_BASE} min-h-12`;

function CopyCodeButton({ code, label, firmSlug, placement }: {
  code: string;
  label: { copy: string; copied: string };
  firmSlug?: string;
  placement?: string;
}) {
  const [copied, setCopied] = useState(false);
  const handle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(code);
      if (firmSlug) suivre({ evenement: 'code_copie', firmSlug, code, placement: placement || 'deals' });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — silent fail */
    }
  };
  return (
    <button
      type="button"
      onClick={handle}
      className={`ml-auto inline-flex min-h-11 flex-none items-center gap-1.5 rounded-lg border px-2.5 text-xs font-semibold transition-colors sm:min-h-8 ${
        copied
          ? 'border-accent-border bg-accent/15 text-accent'
          : 'border-amber-500/40 bg-bg-elevated text-text-primary hover:border-amber-500 dark:border-amber-300/30 dark:bg-transparent dark:hover:border-amber-300/60'
      }`}
      aria-label={`${copied ? label.copied : label.copy} ${code}`}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? label.copied : label.copy}
    </button>
  );
}

function LogoTile({ firm, size = 44 }: { firm: PropFirm; size?: number }) {
  return (
    <span
      className="flex flex-none items-center justify-center overflow-hidden rounded-xl border border-border bg-white p-1"
      style={{ width: size, height: size }}
    >
      {firm.logo_url ? (
        <Image
          src={firm.logo_url}
          alt=""
          width={size}
          height={size}
          className="h-full w-full object-contain"
        />
      ) : (
        <span className="font-display text-base font-extrabold text-slate-900">{firm.name.charAt(0)}</span>
      )}
    </span>
  );
}

function Rating({ value }: { value: number | null }) {
  if (value == null) return <span className="text-text-muted">—</span>;
  return (
    <span className="inline-flex items-center gap-1">
      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden />
      <span className="font-mono font-semibold tabular-nums text-text-primary">{value.toFixed(1)}</span>
    </span>
  );
}

/** Le bloc coupon : pastille ambre, puis le code (ou « appliquée via notre lien »). */
function CouponBlock({ firm, t, locale, placement, className = '' }: {
  firm: PropFirm; t: T; locale: string; placement: string; className?: string;
}) {
  const code = aCode(firm) ? (firm.discount_code as string).trim() : null;
  return (
    <div
      className={`flex items-center gap-3 rounded-xl border border-dashed border-amber-400/70 bg-gradient-to-r from-amber-50 via-amber-50/60 to-transparent p-2 dark:border-amber-300/30 dark:from-amber-400/[0.12] dark:via-amber-400/[0.05] ${className}`}
    >
      <span className="inline-flex h-9 flex-none items-center rounded-lg bg-amber-400 px-2.5 font-mono text-[15px] font-extrabold tabular-nums text-amber-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_1px_2px_rgba(120,53,15,0.25)]">
        {pct(firm.discount_percent ?? 0, locale)}
      </span>
      <span className="min-w-0 flex-1 leading-tight">
        <span className="block text-[10px] uppercase tracking-[0.08em] text-text-muted">
          {code ? t.codeLabel : t.discountLabel}
        </span>
        {code ? (
          <span className="block truncate font-mono text-[13px] font-bold text-text-primary">{code}</span>
        ) : (
          <span className="block truncate text-[13px] font-semibold text-text-primary">{t.viaOurLink}</span>
        )}
      </span>
      {code && (
        <CopyCodeButton code={code} label={{ copy: t.copy, copied: t.copied }} firmSlug={firm.slug} placement={placement} />
      )}
    </div>
  );
}

function BonusPill({ text }: { text: string }) {
  return (
    <span className="inline-flex h-5 items-center rounded-md bg-accent/15 px-1.5 text-[11px] font-semibold text-accent">
      {text}
    </span>
  );
}

/** « Dès $76 $95 » : prix remise en ambre, prix plein barre. */
function PrixDes({ firm, t, grand = false }: { firm: PropFirm; t: T; grand?: boolean }) {
  const remise = prixRemise(firm);
  const taille = grand ? 'text-[15px]' : 'text-[13px]';
  if (firm.min_price == null || firm.min_price <= 0) return null;
  return (
    <span className={`text-text-muted ${grand ? 'text-[13px]' : 'text-[12.5px]'}`}>
      {t.from}{' '}
      {remise != null ? (
        <>
          <b className={`font-mono font-bold tabular-nums text-deal ${taille}`}>{prix(remise)}</b>{' '}
          <s className="font-mono tabular-nums">{prix(firm.min_price)}</s>
        </>
      ) : (
        <b className={`font-mono font-bold tabular-nums text-text-primary ${taille}`}>{prix(firm.min_price)}</b>
      )}
    </span>
  );
}

function Expiry({ firm, t, locale }: { firm: PropFirm; t: T; locale: string }) {
  const fin = finOffre(firm);
  if (fin == null) return <span className="text-[12.5px] text-text-muted">{t.noEndDate}</span>;
  const jours = Math.max(0, Math.ceil((fin - Date.now()) / JOUR));
  if (jours <= 3) {
    return (
      <span className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-deal">
        <Timer className="h-3.5 w-3.5" aria-hidden />
        {fill(t.expiresIn, { n: jours })}
      </span>
    );
  }
  const date = new Date(fin).toLocaleDateString(locale, { day: 'numeric', month: 'short' });
  return (
    <span className="text-[12.5px] text-text-muted">
      {fill(t.expiresOn, { date: '' })}
      <b className="font-semibold text-text-primary">{date}</b>
    </span>
  );
}

/** Compte a rebours — rendu seulement quand l'offre porte une vraie date de fin. */
function Countdown({ fin, t }: { fin: number; t: T }) {
  const [maintenant, setMaintenant] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setMaintenant(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);
  const reste = Math.max(0, fin - maintenant);
  const cases: [number, string][] = [
    [Math.floor(reste / JOUR), t.days],
    [Math.floor((reste % JOUR) / 3_600_000), t.hours],
    [Math.floor((reste % 3_600_000) / 60_000), t.minutes],
  ];
  return (
    <div>
      <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted">{t.endsIn}</span>
      <div className="mt-1.5 grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-border bg-border" role="timer">
        {cases.map(([v, lab]) => (
          <div key={lab} className="bg-bg-base px-2 py-2 text-center">
            <b className="block font-mono text-[20px] font-bold tabular-nums tracking-tight text-text-primary">
              {String(v).padStart(2, '0')}
            </b>
            <small className="text-[10px] uppercase tracking-[0.08em] text-text-muted">{lab}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// OFFRE DU JOUR — la plus grosse remise du moment
// =============================================================================

function DealOfDay({ firm, t, locale }: { firm: PropFirm; t: T; locale: string }) {
  const p = firm.discount_percent ?? 0;
  const bonus = bonusFiche(firm.slug);
  const fin = finOffre(firm);
  return (
    <section className={`${CARTE} mb-6 grid gap-5 p-5 sm:p-6 md:grid-cols-[minmax(0,1fr)_17.5rem] md:items-center md:gap-8`}>
      <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400" />
      <div className="min-w-0">
        <div className="flex items-center gap-2.5">
          <LogoTile firm={firm} size={32} />
          <span className="truncate text-[12px] font-bold uppercase tracking-[0.08em] text-deal">
            {t.dealOfDay} · {firm.name}
          </span>
        </div>
        <p className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="font-mono text-[44px] font-extrabold leading-none tabular-nums tracking-tight text-text-primary sm:text-[56px]">
            {pct(p, locale)}
          </span>
          {bonus && <span className="font-display text-lg font-bold text-deal">+ {bonus}</span>}
        </p>
        <CouponBlock firm={firm} t={t} locale={locale} placement="deals_hero" className="mt-4 max-w-[420px]" />
      </div>
      <div className="flex flex-col gap-3">
        {fin != null && <Countdown fin={fin} t={t} />}
        <a
          href={buildAffiliateUrl(firm.slug, { placement: 'deals-hero', locale })}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className={`${BTN_ACHAT} w-full text-[15px]`}
        >
          {fill(t.grab, { pct: pct(p, locale) })}
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </a>
        <div className="text-center">
          <PrixDes firm={firm} t={t} grand />
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// DEAL CARD
// =============================================================================

function DealCard({ firm, t, locale }: { firm: PropFirm; t: T; locale: string }) {
  const internalUrl = `${locale === 'en' ? '' : `/${locale}`}/prop-firm/${firm.slug}`;
  const p = firm.discount_percent ?? 0;
  // Ce que l'offre donne en plus du pourcentage, quand la firme a une fiche.
  const bonus = bonusFiche(firm.slug);

  return (
    <article className={`${CARTE} flex flex-col gap-4 p-5 transition-colors hover:border-border-hover`}>
      <div className="flex items-center gap-3">
        <LogoTile firm={firm} />
        <div className="min-w-0 flex-1">
          <Link href={internalUrl} className="block truncate font-display text-[15px] font-bold text-text-primary hover:underline">
            {firm.name}
          </Link>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px] text-text-muted">
            <Rating value={firm.trustpilot_rating} />
            {estVerifiee(firm) && (
              <span className="inline-flex h-5 items-center gap-1 rounded-md bg-accent/15 px-1.5 text-[11px] font-semibold text-accent">
                <BadgeCheck className="h-3 w-3" aria-hidden />
                {t.verifiedBadge}
              </span>
            )}
          </div>
        </div>
      </div>

      <div>
        <CouponBlock firm={firm} t={t} locale={locale} placement="deals_carte" />
        {/* Le bonus accompagne le code : le pourcentage seul taisait la
            moitie de l'offre chez Earn2Trade. */}
        {bonus && <div className="mt-2"><BonusPill text={`+ ${bonus}`} /></div>}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <PrixDes firm={firm} t={t} />
        <Expiry firm={firm} t={t} locale={locale} />
      </div>

      <div className="mt-auto grid grid-cols-[minmax(0,1fr)_auto] gap-2">
        {aSortie(firm) ? (
          <>
            <a
              href={buildAffiliateUrl(firm.slug, { placement: 'deals-grid', locale })}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className={BTN_ACHAT}
            >
              {fill(t.getDeal, { pct: pct(p, locale) })}
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </a>
            <Link href={internalUrl} className={BTN_SECONDAIRE}>{t.sheet}</Link>
          </>
        ) : (
          <Link href={internalUrl} className={`${BTN_SECONDAIRE} col-span-2`}>{t.details}</Link>
        )}
      </div>
    </article>
  );
}

// =============================================================================
// TOUTES LES FIRMES — liste compacte des firmes sans offre en cours
// =============================================================================

function FirmRow({ firm, t, locale }: { firm: PropFirm; t: T; locale: string }) {
  const internalUrl = `${locale === 'en' ? '' : `/${locale}`}/prop-firm/${firm.slug}`;
  const split = partage(firm);
  return (
    <li className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 bg-bg-elevated px-4 py-3 sm:grid-cols-[minmax(0,2.2fr)_1fr_1fr_1fr_8.5rem] dark:bg-bg-base">
      <Link href={internalUrl} className="flex min-w-0 items-center gap-3">
        <LogoTile firm={firm} size={36} />
        <span className="truncate text-sm font-semibold text-text-primary hover:underline">{firm.name}</span>
      </Link>

      {/* Mobile : les trois valeurs sur une ligne sous le nom */}
      <div className="col-span-2 row-start-2 flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] text-text-muted sm:hidden">
        <span>{t.colPrice} <b className="font-mono font-semibold tabular-nums text-text-primary">{firm.min_price ? prix(firm.min_price) : '—'}</b></span>
        <span>{t.colSplit} <b className="font-mono font-semibold tabular-nums text-accent">{split ?? '—'}</b></span>
        <Rating value={firm.trustpilot_rating} />
      </div>

      <span className="hidden font-mono text-sm tabular-nums text-text-primary sm:block">
        {firm.min_price ? prix(firm.min_price) : '—'}
      </span>
      <span className="hidden font-mono text-sm font-semibold tabular-nums text-accent sm:block">{split ?? '—'}</span>
      <span className="hidden text-sm sm:block"><Rating value={firm.trustpilot_rating} /></span>

      <div className="col-start-2 row-start-1 sm:col-start-auto sm:row-start-auto">
        {aSortie(firm) ? (
          <a
            href={buildAffiliateUrl(firm.slug, { placement: 'deals-all', locale })}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className={`${BTN_SECONDAIRE_BASE} min-h-11 px-3 text-[13px] sm:min-h-9 sm:w-full`}
          >
            {t.seeOffer}
          </a>
        ) : (
          <Link href={internalUrl} className={`${BTN_SECONDAIRE_BASE} min-h-11 px-3 text-[13px] sm:min-h-9 sm:w-full`}>
            {t.details}
          </Link>
        )}
      </div>
    </li>
  );
}

// =============================================================================
// DEALS GRID — every listed firm, deals first, no firm hidden
// =============================================================================

type Tri = 'remise' | 'prix' | 'note';

export function DealsGrid() {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  // Repli sur l'anglais : plusieurs cles n'existent qu'en en/fr, elles
  // s'affichaient vides en de/es/pt/ar/hi (7/10/2026).
  const t = { ...translations.en, ...translations[locale] };
  const href = (p: string) => (locale === 'en' ? p : `/${locale}${p}`);

  const [firms, setFirms] = useState<PropFirm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // La page listait quatre-vingt-onze firmes sans aucune commande. Trois
  // reglages suffisent a la rendre utilisable, et ce sont ceux de /compare,
  // pour que le visiteur ne reapprenne rien.
  const [recherche, setRecherche] = useState('');
  const [tri, setTri] = useState<Tri>('remise');
  const [avecCodeSeulement, setAvecCodeSeulement] = useState(false);
  // Le reste du catalogue arrive par paquets : sinon la page defile sans fin.
  const [montrees, setMontrees] = useState(12);

  const fetchFirms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClientComponentClient();
      const { data, error: err } = await supabase
        .from('prop_firms')
        .select(COLONNES)
        .eq('listing_status', 'listed');

      if (err) {
        setError(err.message);
        return;
      }
      // L'offre d'une firme qui a une fiche vient de son tableur, pas de la
      // base : c'est elle qui porte la campagne datee, et elle expire toute
      // seule. Les autres firmes ressortent inchangees.
      setFirms(appliquerOffresDesFiches((data || []) as PropFirm[]).sort(dealsSort));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load deals');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFirms();
  }, [fetchFirms]);

  const q = recherche.trim().toLowerCase();
  const correspond = (f: PropFirm) => !q || f.name.toLowerCase().includes(q);

  const trier = (liste: PropFirm[]) => {
    if (tri === 'prix') {
      return [...liste].sort((a, b) => (a.min_price ?? 1e9) - (b.min_price ?? 1e9));
    }
    if (tri === 'note') {
      return [...liste].sort((a, b) => (b.trustpilot_rating ?? 0) - (a.trustpilot_rating ?? 0));
    }
    return liste;   // deja trie par dealsSort : remise et partenaires d'abord
  };

  const avecOffre = firms.filter(f => remiseActive(f));

  // Offre du jour : la plus forte remise parmi les firmes qu'on peut ouvrir.
  // A egalite, l'ordre de dealsSort (partenaires, top 10) departage.
  const offreDuJour = avecOffre
    .filter(aSortie)
    .reduce<PropFirm | null>(
      (best, f) => (!best || (f.discount_percent ?? 0) > (best.discount_percent ?? 0) ? f : best),
      null
    );

  const dealFirms = trier(
    avecOffre
      .filter(f => !avecCodeSeulement || aCode(f))
      .filter(correspond)
  );
  const remainingFirms = trier(
    firms.filter(f => !remiseActive(f))
      .filter(() => !avecCodeSeulement)
      .filter(correspond)
  );

  const ongletsTri: { value: Tri; label: string }[] = [
    { value: 'remise', label: t.sortDiscount },
    { value: 'prix', label: t.sortPrice },
    { value: 'note', label: t.sortRating },
  ];

  if (loading) {
    return (
      <div aria-busy="true" aria-live="polite">
        <span className="sr-only">{t.loading}</span>
        <div className={`${CARTE} mb-6 h-56 animate-pulse`} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map(i => <div key={i} className={`${CARTE} h-72 animate-pulse`} />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${CARTE} mx-auto max-w-lg p-8 text-center`} role="alert">
        <p className="font-display text-lg font-extrabold text-text-primary">{t.errorTitle}</p>
        <p className="mt-1 text-small text-text-secondary">{t.errorBody}</p>
        <button
          type="button"
          onClick={fetchFirms}
          className={`${BTN_SECONDAIRE} mx-auto mt-5 inline-flex gap-1.5`}
        >
          <RotateCcw className="h-4 w-4" aria-hidden />
          {t.retry}
        </button>
      </div>
    );
  }

  return (
    <>
      {offreDuJour && <DealOfDay firm={offreDuJour} t={t} locale={locale} />}

      {/* Barre de commandes : chercher, trier, filtrer. Les memes gestes que
          sur /compare, pour que le visiteur ne reapprenne rien. */}
      <div className="mb-5 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[12rem] flex-1 sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" aria-hidden />
            <input
              type="search"
              value={recherche}
              onChange={e => { setRecherche(e.target.value); setMontrees(12); }}
              placeholder={t.search}
              aria-label={t.search}
              className="min-h-11 w-full rounded-xl border border-border-hover bg-bg-elevated py-2 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:border-text-primary focus:outline-none dark:bg-transparent"
            />
          </div>
          <button
            type="button"
            onClick={() => { setAvecCodeSeulement(v => !v); setMontrees(12); }}
            aria-pressed={avecCodeSeulement}
            className={`min-h-11 rounded-full border px-4 text-[13px] transition-colors ${
              avecCodeSeulement
                ? 'border-text-primary bg-text-primary font-semibold text-bg-elevated dark:border-accent dark:bg-accent/15 dark:text-accent'
                : 'border-border-hover bg-bg-elevated text-text-secondary hover:border-text-primary hover:text-text-primary dark:bg-transparent'
            }`}
          >
            {t.codeOnly}
          </button>
        </div>

        <div className="flex items-center gap-1">
          <div
            role="group"
            aria-label={t.sortLabel}
            className="-mx-4 flex flex-1 items-center gap-1 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0"
          >
            {ongletsTri.map(o => (
              <button
                key={o.value}
                type="button"
                onClick={() => setTri(o.value)}
                aria-pressed={tri === o.value}
                className={`min-h-9 flex-none whitespace-nowrap rounded-lg px-3 text-[13px] transition-colors ${
                  tri === o.value
                    ? 'bg-text-primary font-semibold text-bg-elevated dark:bg-accent/15 dark:text-accent'
                    : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
          <span className="ml-auto flex-none whitespace-nowrap pl-2 text-[13px] text-text-muted">
            <span className="font-mono font-semibold tabular-nums text-text-primary">{dealFirms.length}</span> {t.counted}
          </span>
        </div>
      </div>

      {dealFirms.length > 0 ? (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dealFirms.map(f => (
            <DealCard key={f.id} firm={f} t={t} locale={locale} />
          ))}
        </section>
      ) : (q === '' && (
        <section className={`${CARTE} p-8 text-center`}>
          <Gift className="mx-auto mb-3 h-8 w-8 text-text-muted" aria-hidden />
          <h2 className="font-display text-lg font-extrabold text-text-primary">{t.noDealsYet}</h2>
          <p className="mt-1 text-small text-text-secondary">{t.noDealsBody}</p>
        </section>
      ))}

      {remainingFirms.length > 0 && (
        <section>
          <h2 className="mb-1 mt-10 font-display text-xl font-extrabold tracking-tight text-text-primary">{t.allFirms}</h2>
          <p className="mb-4 text-small text-text-secondary">{t.allFirmsSubtitle}</p>
          <div className="overflow-hidden rounded-2xl border border-border">
            <div className="hidden grid-cols-[minmax(0,2.2fr)_1fr_1fr_1fr_8.5rem] gap-x-3 border-b border-border bg-bg-base px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.1em] text-text-muted sm:grid dark:bg-bg-elevated">
              <span>{t.colFirm}</span>
              <span>{t.colPrice}</span>
              <span>{t.colSplit}</span>
              <span>{t.colRating}</span>
              <span aria-hidden />
            </div>
            <ul className="divide-y divide-border">
              {remainingFirms.slice(0, montrees).map(f => (
                <FirmRow key={f.id} firm={f} t={t} locale={locale} />
              ))}
            </ul>
          </div>
          {remainingFirms.length > montrees && (
            <div className="mt-5 text-center">
              <button
                type="button"
                onClick={() => setMontrees(n => n + 12)}
                className={`${BTN_SECONDAIRE_BASE} mx-auto inline-flex min-h-11`}
              >
                {t.showMore}{' '}
                <span className="ml-1 font-mono tabular-nums text-text-muted">({remainingFirms.length - montrees})</span>
              </button>
            </div>
          )}
        </section>
      )}

      {dealFirms.length === 0 && remainingFirms.length === 0 && (
        <p className="py-12 text-center text-small text-text-secondary">{t.nothing}</p>
      )}

      <p className="mt-12 text-xs text-text-muted">
        {t.affiliateNotice}{' '}
        <Link href={href('/how-we-make-money')} className="underline underline-offset-2 hover:text-text-primary">
          {t.readMore}
        </Link>
      </p>
    </>
  );
}

// Backwards-compatible export. The old hardcoded sidebar list is gone —
// keeping the symbol prevents broken imports anywhere else in the codebase.
export function FeaturedFirmsSidebar() {
  return null;
}
