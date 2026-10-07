'use client';

import { useState, useMemo } from 'react';
import { blogPosts as postsSource } from '@/lib/blog-data';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Mail, Check, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

// =============================================================================
// LOCALE DETECTION & TRANSLATIONS
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

const en = {
  blogTitle: 'The funded trader blog',
  blogSubtitle: 'Rules decoded, firm reviews and methods to pass — and keep — your funded account.',
  searchPlaceholder: 'Search an article…',
  searchLabel: 'Search the blog',
  all: 'All',
  guides: 'Guides',
  rulesDecoded: 'Rules Decoded',
  reviews: 'Reviews',
  psychology: 'Psychology',
  featured: 'Featured',
  latestArticles: 'Latest articles',
  searchResults: 'Search results',
  noArticlesFound: 'No articles found',
  tryDifferentSearch: 'Try a different search term or category.',
  previous: 'Previous',
  next: 'Next',
  pageLabel: 'Page',
  newsletterTitle: 'New promo codes, before everyone else',
  newsletterDesc: 'One email a week: verified codes, rule changes, new firms. Unsubscribe in one click.',
  emailPlaceholder: 'you@email.com',
  emailLabel: 'Your email address',
  subscribe: 'Subscribe',
  subscribing: 'Subscribing…',
  subscribed: 'You are subscribed. See you in your inbox.',
  readyToGetFunded: 'Ready to pick your firm?',
  compareDesc: 'Compare rules, prices and active promo codes side by side.',
  comparePropFirms: 'Compare prop firms',
};

type Dict = typeof en;

const translations: Record<Locale, Partial<Dict>> = {
  en,
  fr: {
    blogTitle: 'Le blog des traders funded',
    blogSubtitle: 'Règles décodées, avis de firmes et méthodes pour passer — et garder — ton compte financé.',
    searchPlaceholder: 'Rechercher un article…',
    searchLabel: 'Rechercher dans le blog',
    all: 'Tout',
    guides: 'Guides',
    rulesDecoded: 'Règles décodées',
    reviews: 'Avis',
    psychology: 'Psychologie',
    featured: 'À la une',
    latestArticles: 'Derniers articles',
    searchResults: 'Résultats de recherche',
    noArticlesFound: 'Aucun article trouvé',
    tryDifferentSearch: 'Essaie un autre mot-clé ou une autre catégorie.',
    previous: 'Précédent',
    next: 'Suivant',
    pageLabel: 'Page',
    newsletterTitle: 'Les nouveaux codes promo, avant tout le monde',
    newsletterDesc: 'Un e-mail par semaine : codes vérifiés, changements de règles, nouvelles firmes. Désinscription en un clic.',
    emailPlaceholder: 'ton@email.com',
    emailLabel: 'Ton adresse e-mail',
    subscribe: "S'abonner",
    subscribing: 'Inscription…',
    subscribed: 'C’est noté. À très vite dans ta boîte mail.',
    readyToGetFunded: 'Prêt à choisir ta firme ?',
    compareDesc: 'Compare les règles, les prix et les codes promo actifs, côte à côte.',
    comparePropFirms: 'Comparer les prop firms',
  },
  // Other locales: only the category / pagination labels whose meaning did
  // not change are kept; everything else falls back to English.
  de: { all: 'Alle', guides: 'Guides', rulesDecoded: 'Regeln erklärt', reviews: 'Bewertungen', psychology: 'Psychologie', previous: 'Zurück', next: 'Weiter', noArticlesFound: 'Keine Artikel gefunden' },
  es: { all: 'Todo', guides: 'Guías', rulesDecoded: 'Reglas decodificadas', reviews: 'Reseñas', psychology: 'Psicología', previous: 'Anterior', next: 'Siguiente', noArticlesFound: 'No se encontraron artículos' },
  pt: { all: 'Todos', guides: 'Guias', rulesDecoded: 'Regras decodificadas', reviews: 'Avaliações', psychology: 'Psicologia', previous: 'Anterior', next: 'Próximo', noArticlesFound: 'Nenhum artigo encontrado' },
  ar: { all: 'الكل', guides: 'الأدلة', rulesDecoded: 'القواعد مفسرة', reviews: 'المراجعات', psychology: 'علم النفس', previous: 'السابق', next: 'التالي', noArticlesFound: 'لم يتم العثور على مقالات' },
  hi: { all: 'सभी', guides: 'गाइड्स', rulesDecoded: 'नियम समझाए गए', reviews: 'रिव्यूज', psychology: 'मनोविज्ञान', previous: 'पिछला', next: 'अगला', noArticlesFound: 'कोई आर्टिकल नहीं मिला' },
};

// =============================================================================
// TYPES
// =============================================================================

type Category = 'Guides' | 'Rules Decoded' | 'Reviews' | 'Psychology';

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  updatedDate?: string;
  readTime: string;
  category: Category;
  featured: boolean;
  tags: string[];
  index: number;
}

// Une seule source pour la liste ET les pages d'article : lib/blog-data.ts.
// L'ancienne liste recopiee ici avait 6 articles absents de la lib (cartes en
// 404) et en cachait 6 autres (7/10/2026).
const blogPosts: BlogPost[] = postsSource.map((p, i) => ({
  slug: p.slug,
  title: p.title,
  description: p.description,
  date: p.date,
  updatedDate: p.updatedDate,
  readTime: p.readTime,
  category: p.category,
  featured: p.featured,
  tags: p.tags,
  index: i + 1,
}));

// =============================================================================
// HELPERS
// =============================================================================

function getCategoryKey(category: string): keyof Dict {
  const map: Record<string, keyof Dict> = {
    All: 'all',
    Guides: 'guides',
    'Rules Decoded': 'rulesDecoded',
    Reviews: 'reviews',
    Psychology: 'psychology',
  };
  return map[category] || 'all';
}

const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

/** "January 5, 2025" / "January 2025" -> localized date; unparseable strings are returned as-is. */
function formatPostDate(raw: string, locale: string): string {
  const m = raw.trim().match(/^([A-Za-z]+)\s+(?:(\d{1,2}),?\s+)?(\d{4})$/);
  if (m) {
    const month = MONTHS.indexOf(m[1].toLowerCase());
    if (month >= 0) {
      const d = new Date(Date.UTC(Number(m[3]), month, m[2] ? Number(m[2]) : 1));
      return d.toLocaleDateString(locale, m[2]
        ? { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }
        : { month: 'long', year: 'numeric', timeZone: 'UTC' });
    }
  }
  const ts = Date.parse(raw);
  if (!Number.isNaN(ts)) {
    return new Date(ts).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
  }
  return raw;
}

/** "10 min read" -> "10 min" */
function shortReadTime(readTime: string): string {
  const n = readTime.match(/\d+/);
  return n ? `${n[0]} min` : readTime;
}

const COVER_STYLES: Record<Category, string> = {
  Guides: 'from-emerald-800 to-teal-700',
  'Rules Decoded': 'from-amber-800 to-amber-600',
  Reviews: 'from-sky-800 to-blue-900',
  Psychology: 'from-violet-900 to-violet-600',
};

function coverGlyph(post: BlogPost): string {
  switch (post.category) {
    case 'Guides': return String(post.index).padStart(2, '0');
    case 'Rules Decoded': return '§';
    case 'Reviews': return '★';
    default: return 'ψ';
  }
}

const CARD =
  'rounded-2xl border border-border bg-bg-elevated shadow-[0_1px_2px_rgba(28,25,23,0.05),0_10px_28px_-16px_rgba(28,25,23,0.22)] dark:bg-gradient-to-b dark:from-white/[0.035] dark:to-transparent dark:shadow-none hover:border-border-hover transition-colors';

// =============================================================================
// COMPONENTS
// =============================================================================

function Cover({
  post,
  label,
  size = 'md',
  className = '',
}: {
  post: BlogPost;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const glyphSize =
    size === 'sm' ? 'text-[60px] -top-2.5 -right-2' : size === 'lg' ? 'text-[140px] -top-6 -right-2.5' : 'text-[110px] -top-5 -right-2';
  return (
    <div
      aria-hidden
      className={`relative flex items-end overflow-hidden rounded-xl bg-gradient-to-br text-white ${COVER_STYLES[post.category]} ${
        size === 'sm' ? 'p-2' : 'p-4'
      } ${className}`}
    >
      <span className={`pointer-events-none absolute select-none font-mono font-extrabold leading-none tracking-[-0.05em] opacity-[0.13] ${glyphSize}`}>
        {coverGlyph(post)}
      </span>
      {label && (
        <span className="relative rounded-md bg-black/25 px-2 py-1 text-[11px] font-bold uppercase tracking-[0.1em]">{label}</span>
      )}
    </div>
  );
}

function Meta({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px] text-text-muted">
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span aria-hidden>·</span>}
          <span className={/\d/.test(it) ? 'font-mono tabular-nums' : ''}>{it}</span>
        </span>
      ))}
    </div>
  );
}

function FeaturedCard({ post, href, t, locale }: { post: BlogPost; href: string; t: Dict; locale: Locale }) {
  return (
    <Link href={href} className={`group flex flex-col gap-3 p-3.5 ${CARD}`}>
      <Cover post={post} size="lg" className="h-56" label={`${t[getCategoryKey(post.category)]} · ${t.featured}`} />
      <h3 className="font-display text-[22px] font-bold leading-tight tracking-[-0.015em] text-text-primary group-hover:text-accent">
        {post.title}
      </h3>
      <p className="text-sm leading-relaxed text-text-secondary">{post.description}</p>
      <Meta items={[shortReadTime(post.readTime), formatPostDate(post.date, locale)]} />
    </Link>
  );
}

function CompactCard({ post, href }: { post: BlogPost; href: string }) {
  return (
    <Link href={href} className={`group flex items-center gap-3 p-3 ${CARD}`}>
      <Cover post={post} size="sm" className="h-[68px] w-[84px] flex-none" />
      <div className="min-w-0">
        <h4 className="line-clamp-2 text-sm font-semibold leading-snug text-text-primary group-hover:text-accent">{post.title}</h4>
        <div className="mt-1">
          <Meta items={[shortReadTime(post.readTime)]} />
        </div>
      </div>
    </Link>
  );
}

function ArticleCard({ post, href, t, locale }: { post: BlogPost; href: string; t: Dict; locale: Locale }) {
  return (
    <Link href={href} className={`group flex flex-col gap-2.5 p-3 ${CARD}`}>
      <Cover post={post} className="h-32" label={t[getCategoryKey(post.category)]} />
      <h3 className="mt-0.5 text-[15.5px] font-semibold leading-snug tracking-[-0.01em] text-text-primary group-hover:text-accent">
        {post.title}
      </h3>
      <p className="line-clamp-2 text-[13px] leading-normal text-text-secondary">{post.description}</p>
      <div className="mt-auto pt-1">
        <Meta items={[shortReadTime(post.readTime), formatPostDate(post.date, locale)]} />
      </div>
    </Link>
  );
}

function NewsletterSignup({ t }: { t: Dict }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');

    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'blog' }),
      });
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('idle');
    }
  };

  return (
    <section className="mt-10 grid items-center gap-5 rounded-2xl border border-accent-border bg-bg-elevated bg-gradient-to-r from-accent-subtle to-transparent p-5 sm:p-6 md:grid-cols-[1.4fr_1fr]">
      <div className="flex gap-3">
        <span className="hidden h-10 w-10 flex-none items-center justify-center rounded-xl bg-accent/15 text-accent sm:flex">
          <Mail className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-display text-[19px] font-bold tracking-tight text-text-primary">{t.newsletterTitle}</h2>
          <p className="mt-1 text-[13.5px] text-text-secondary">{t.newsletterDesc}</p>
        </div>
      </div>

      {status === 'success' ? (
        <p role="status" className="flex items-center gap-2 text-sm font-semibold text-accent">
          <Check className="h-4 w-4" />
          {t.subscribed}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.emailPlaceholder}
            aria-label={t.emailLabel}
            className="h-11 min-w-0 flex-1 rounded-xl border border-border-hover bg-bg-elevated px-3 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="flex min-h-11 items-center justify-center whitespace-nowrap rounded-xl bg-accent-hover px-4 text-sm font-semibold text-on-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_1px_2px_rgba(4,35,26,0.2)] hover:brightness-105 disabled:opacity-60"
          >
            {status === 'loading' ? t.subscribing : t.subscribe}
          </button>
        </form>
      )}
    </section>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function BlogPage() {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const t: Dict = { ...en, ...translations[locale] };
  const href = (p: string) => (locale === 'en' ? p : `/${locale}${p}`);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;

  const categories = ['All', 'Guides', 'Rules Decoded', 'Reviews', 'Psychology'];

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: blogPosts.length };
    blogPosts.forEach((post) => {
      counts[post.category] = (counts[post.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Filter posts
  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const matchesSearch =
        searchQuery === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = activeCategory === 'All' || post.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  // Featured posts (only on first page, no search, all category)
  const featuredPosts = useMemo(() => blogPosts.filter((p) => p.featured), []);

  // Regular posts (non-featured for pagination)
  const regularPosts = useMemo(() => blogPosts.filter((p) => !p.featured), []);

  // Paginated posts
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * postsPerPage;
    return regularPosts.slice(start, start + postsPerPage);
  }, [regularPosts, currentPage]);

  const totalPages = Math.ceil(regularPosts.length / postsPerPage);

  const showFeatured = featuredPosts.length > 0 && activeCategory === 'All' && !searchQuery && currentPage === 1;
  const [mainFeatured, ...sideFeatured] = featuredPosts;
  const listed = searchQuery || activeCategory !== 'All' ? filteredPosts : paginatedPosts;

  const sectionTitle = searchQuery
    ? t.searchResults
    : activeCategory === 'All'
      ? t.latestArticles
      : t[getCategoryKey(activeCategory)];
  const sectionCount = searchQuery || activeCategory !== 'All' ? filteredPosts.length : regularPosts.length;

  const chipBase = 'inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3.5 text-[13px] transition-colors';
  const chipOn =
    'border-text-primary bg-text-primary font-semibold text-bg-elevated dark:border-accent dark:bg-accent/15 dark:text-accent';
  const chipOff =
    'border-border-hover bg-bg-elevated text-text-secondary hover:border-text-primary hover:text-text-primary dark:bg-transparent';
  const pageBtn =
    'inline-flex min-h-11 items-center justify-center gap-1 rounded-xl border border-border-hover bg-bg-elevated px-3.5 text-sm font-semibold text-text-primary hover:border-text-primary disabled:cursor-not-allowed disabled:opacity-40 dark:bg-transparent';

  return (
    <div className="min-h-screen bg-bg-base pb-16">
      {/* Header */}
      <section className="px-4 pb-3 pt-5">
        <div className="mx-auto max-w-7xl">
          <h1 className="font-display text-[28px] font-extrabold leading-9 tracking-tight text-text-primary sm:text-h2">
            {t.blogTitle}
          </h1>
          <p className="mt-1 text-small text-text-secondary">{t.blogSubtitle}</p>

          {/* Chips + search */}
          <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center">
            <div className="flex flex-wrap gap-2" role="group">
              {categories.map((cat) => {
                const active = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      setActiveCategory(cat);
                      setCurrentPage(1);
                    }}
                    className={`${chipBase} ${active ? chipOn : chipOff}`}
                  >
                    {t[getCategoryKey(cat)]}
                    <span className="font-mono text-[11px] tabular-nums opacity-75">{categoryCounts[cat] || 0}</span>
                  </button>
                );
              })}
            </div>
            <div className="relative w-full md:ml-auto md:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={t.searchPlaceholder}
                aria-label={t.searchLabel}
                className="h-11 w-full rounded-full border border-border-hover bg-bg-elevated pl-9 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none md:h-9 dark:bg-transparent"
              />
            </div>
          </div>
        </div>
      </section>

      <main className="px-4">
        <div className="mx-auto max-w-7xl">
          {/* Featured */}
          {showFeatured && mainFeatured && (
            <section className="mt-4 grid gap-4 lg:grid-cols-[1.6fr_1fr]" aria-label={t.featured}>
              <FeaturedCard post={mainFeatured} href={href(`/blog/${mainFeatured.slug}`)} t={t} locale={locale} />
              {sideFeatured.length > 0 && (
                <div className="flex flex-col gap-3">
                  {sideFeatured.slice(0, 3).map((post) => (
                    <CompactCard key={post.slug} post={post} href={href(`/blog/${post.slug}`)} />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Latest / filtered */}
          <section>
            <h2 className="mb-4 mt-10 flex items-baseline gap-2 font-display text-xl font-extrabold tracking-tight text-text-primary">
              {sectionTitle}
              <span className="font-mono text-sm font-semibold tabular-nums text-text-muted">{sectionCount}</span>
            </h2>

            {filteredPosts.length > 0 ? (
              <>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {listed.map((post) => (
                    <ArticleCard key={post.slug} post={post} href={href(`/blog/${post.slug}`)} t={t} locale={locale} />
                  ))}
                </div>

                {/* Pagination */}
                {!searchQuery && activeCategory === 'All' && totalPages > 1 && (
                  <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Pagination">
                    <button
                      type="button"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className={pageBtn}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="hidden sm:inline">{t.previous}</span>
                    </button>
                    <div className="flex gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          type="button"
                          onClick={() => setCurrentPage(page)}
                          aria-current={currentPage === page ? 'page' : undefined}
                          aria-label={`${t.pageLabel} ${page}`}
                          className={`h-11 w-11 rounded-xl font-mono text-sm tabular-nums transition-colors ${
                            currentPage === page
                              ? 'bg-text-primary font-semibold text-bg-elevated dark:bg-accent/15 dark:text-accent'
                              : 'text-text-secondary hover:text-text-primary'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className={pageBtn}
                    >
                      <span className="hidden sm:inline">{t.next}</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </nav>
                )}
              </>
            ) : (
              <div className={`px-5 py-14 text-center ${CARD}`}>
                <Search className="mx-auto mb-3 h-8 w-8 text-text-muted" />
                <h3 className="font-semibold text-text-primary">{t.noArticlesFound}</h3>
                <p className="mt-1 text-sm text-text-muted">{t.tryDifferentSearch}</p>
              </div>
            )}
          </section>

          {/* Newsletter band */}
          <NewsletterSignup t={t} />

          {/* Slim compare CTA */}
          <Link
            href={href('/compare')}
            className={`group mt-4 flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between ${CARD}`}
          >
            <div>
              <h2 className="font-display text-base font-bold text-text-primary">{t.readyToGetFunded}</h2>
              <p className="mt-0.5 text-[13.5px] text-text-secondary">{t.compareDesc}</p>
            </div>
            <span className="inline-flex min-h-11 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl bg-sky-700 px-4 text-sm font-semibold text-white group-hover:brightness-110 dark:bg-sky-400 dark:text-slate-950">
              {t.comparePropFirms}
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </div>
      </main>
    </div>
  );
}
