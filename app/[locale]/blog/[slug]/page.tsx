import { Metadata } from 'next';
import { generateDynamicAlternates } from '@/lib/seo'
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, ChevronRight, Share2, Sparkles, Scale } from 'lucide-react';
import { blogPosts, getPostBySlug, getRelatedPosts } from '@/lib/blog-data';
import type { BlogPost } from '@/lib/blog-data';

// =============================================================================
// TYPES
// =============================================================================

interface Props {
  params: { slug: string; locale: string };
}

// =============================================================================
// UI LABELS (FR / EN — other locales fall back to EN)
// =============================================================================

const LABELS = {
  en: {
    home: 'Home',
    blog: 'Blog',
    toc: 'Table of contents',
    backToBlog: 'Back to blog',
    team: 'The PropFirmScanner team',
    updated: 'Updated',
    published: 'Published',
    share: 'Share',
    shareOn: 'Share on',
    tags: 'Tags',
    ctaTitle: 'Ready to find your firm?',
    ctaDesc: 'Compare rules, prices and active promo codes side by side, then pick the one that fits how you trade.',
    ctaCompare: 'Compare prop firms',
    ctaDeals: 'See the deals',
    quizTitle: 'Find your firm in 60 s',
    quizDesc: 'A few questions about your style, and we suggest firms that fit.',
    quizBtn: 'Take the quiz',
    compareTitle: 'Compare side by side',
    compareDesc: 'Prices, drawdown, profit split and payouts in one table.',
    compareBtn: 'Open the comparator',
    previous: 'Previous article',
    next: 'Next article',
    related: 'Related articles',
    readArticle: 'Read the article',
    categories: { Guides: 'Guides', 'Rules Decoded': 'Rules Decoded', Reviews: 'Reviews', Psychology: 'Psychology' } as Record<string, string>,
  },
  fr: {
    home: 'Accueil',
    blog: 'Blog',
    toc: 'Sommaire',
    backToBlog: 'Retour au blog',
    team: "L'équipe PropFirmScanner",
    updated: 'Mis à jour le',
    published: 'Publié le',
    share: 'Partager',
    shareOn: 'Partager sur',
    tags: 'Tags',
    ctaTitle: 'Prêt à trouver ta firme ?',
    ctaDesc: 'Compare les règles, les prix et les codes promo actifs côte à côte, puis choisis celle qui colle à ta façon de trader.',
    ctaCompare: 'Comparer les prop firms',
    ctaDeals: 'Voir les promos',
    quizTitle: 'Trouve ta firme en 60 s',
    quizDesc: 'Quelques questions sur ton style, et on te propose des firmes adaptées.',
    quizBtn: 'Faire le quiz',
    compareTitle: 'Comparer côte à côte',
    compareDesc: 'Prix, drawdown, partage des gains et paiements dans un seul tableau.',
    compareBtn: 'Ouvrir le comparateur',
    previous: 'Article précédent',
    next: 'Article suivant',
    related: 'Articles liés',
    readArticle: "Lire l'article",
    categories: { Guides: 'Guides', 'Rules Decoded': 'Règles décodées', Reviews: 'Avis', Psychology: 'Psychologie' } as Record<string, string>,
  },
};

type Labels = (typeof LABELS)['en'];

function getLabels(locale: string): Labels {
  return locale === 'fr' ? LABELS.fr : LABELS.en;
}

// =============================================================================
// HELPERS
// =============================================================================

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

function shortReadTime(readTime: string): string {
  const n = readTime.match(/\d+/);
  return n ? `${n[0]} min` : readTime;
}

function slugify(text: string): string {
  return text
    .replace(/<[^>]+>/g, '')
    .replace(/&[a-z]+;|&#\d+;/gi, ' ')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function stripTags(html: string): string {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

/**
 * Server-side content pass:
 * - gives every <h2> a unique id (for the TOC anchors),
 * - prefixes internal links with the locale,
 * - wraps tables in a horizontal scroller.
 */
function processContent(content: string, locale: string): { html: string; toc: { id: string; text: string }[] } {
  const toc: { id: string; text: string }[] = [];
  const used = new Set<string>();

  let html = content.replace(/<h2(\s[^>]*)?>([\s\S]*?)<\/h2>/g, (_m, attrs: string | undefined, inner: string) => {
    const base = slugify(inner) || 'section';
    let id = base;
    let n = 2;
    while (used.has(id)) id = `${base}-${n++}`;
    used.add(id);
    toc.push({ id, text: stripTags(inner) });
    const rest = (attrs || '').replace(/\sid="[^"]*"/, '');
    return `<h2 id="${id}"${rest}>${inner}</h2>`;
  });

  if (locale !== 'en') {
    html = html.replace(/href="\/(?!\/)/g, `href="/${locale}/`);
  }

  html = html
    .replace(/<table(\s[^>]*)?>/g, (m) => `<div class="overflow-x-auto">${m}`)
    .replace(/<\/table>/g, '</table></div>');

  return { html, toc };
}

const COVER_STYLES: Record<string, string> = {
  Guides: 'from-emerald-800 to-teal-700',
  'Rules Decoded': 'from-amber-800 to-amber-600',
  Reviews: 'from-sky-800 to-blue-900',
  Psychology: 'from-violet-900 to-violet-600',
};

const CATEGORY_PILL: Record<string, string> = {
  Guides: 'bg-accent/15 text-accent',
  'Rules Decoded': 'bg-amber-500/15 text-amber-800 dark:text-amber-300',
  Reviews: 'bg-sky-500/10 text-sky-800 dark:text-sky-300',
  Psychology: 'bg-violet-500/15 text-violet-800 dark:text-violet-300',
};

function coverGlyph(post: BlogPost): string {
  switch (post.category) {
    case 'Guides': {
      const i = blogPosts.findIndex((p) => p.slug === post.slug);
      return String(i + 1).padStart(2, '0');
    }
    case 'Rules Decoded': return '§';
    case 'Reviews': return '★';
    default: return 'ψ';
  }
}

const CARD =
  'rounded-2xl border border-border bg-bg-elevated shadow-[0_1px_2px_rgba(28,25,23,0.05),0_10px_28px_-16px_rgba(28,25,23,0.22)] dark:bg-gradient-to-b dark:from-white/[0.035] dark:to-transparent dark:shadow-none';

const BTN_PRIMARY =
  'flex min-h-12 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl bg-accent-hover px-4 text-sm font-semibold text-on-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_1px_2px_rgba(4,35,26,0.2)] hover:brightness-105';

const BTN_SECONDARY =
  'flex min-h-12 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border border-border-hover bg-bg-elevated px-4 text-sm font-semibold text-text-primary hover:border-text-primary dark:bg-transparent';

// =============================================================================
// METADATA GENERATION
// =============================================================================

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Article Not Found | PropFirm Scanner Blog',
      description: 'The article you are looking for could not be found.'
    };
  }

  return {
    title: `${post.title} | PropFirm Scanner Blog`,
    description: post.description,
    keywords: [post.category, 'prop firm', 'trading', 'forex', ...post.tags],
    authors: [{ name: 'PropFirm Scanner' }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.updatedDate || post.date,
      authors: ['PropFirm Scanner'],
      tags: post.tags,
      siteName: 'PropFirm Scanner',
      url: `https://www.propfirmscanner.org/blog/${params.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
    ...generateDynamicAlternates(params.locale || 'en', `/blog/${params.slug}`),
  };
}

// =============================================================================
// STATIC PARAMS GENERATION
// =============================================================================

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

// =============================================================================
// COMPONENTS
// =============================================================================

function Cover({
  post,
  label,
  small = false,
  className = '',
}: {
  post: BlogPost;
  label?: string;
  small?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`relative flex items-end overflow-hidden rounded-xl bg-gradient-to-br text-white ${COVER_STYLES[post.category] || COVER_STYLES.Guides} ${
        small ? 'p-2' : 'p-4'
      } ${className}`}
    >
      <span
        className={`pointer-events-none absolute select-none font-mono font-extrabold leading-none tracking-[-0.05em] opacity-[0.13] ${
          small ? '-right-2 -top-2.5 text-[60px]' : '-right-2 -top-5 text-[110px]'
        }`}
      >
        {coverGlyph(post)}
      </span>
      {label && (
        <span className="relative rounded-md bg-black/25 px-2 py-1 text-[11px] font-bold uppercase tracking-[0.1em]">{label}</span>
      )}
    </div>
  );
}

function Breadcrumb({ category, href, L }: { category: string; href: (p: string) => string; L: Labels }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-[13px] text-text-muted">
        <li>
          <Link href={href('/')} className="hover:text-text-primary">
            {L.home}
          </Link>
        </li>
        <li aria-hidden>
          <ChevronRight className="h-3.5 w-3.5" />
        </li>
        <li>
          <Link href={href('/blog')} className="hover:text-text-primary">
            {L.blog}
          </Link>
        </li>
        <li aria-hidden>
          <ChevronRight className="h-3.5 w-3.5" />
        </li>
        <li className="text-text-secondary" aria-current="page">
          {L.categories[category] || category}
        </li>
      </ol>
    </nav>
  );
}

function ShareButtons({ title, url, L }: { title: string; url: string; L: Labels }) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const btn =
    'inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border-hover bg-bg-elevated text-text-secondary hover:border-text-primary hover:text-text-primary sm:h-9 sm:w-9 dark:bg-transparent';

  return (
    <div className="flex items-center gap-2">
      <span className="hidden items-center gap-1 text-[13px] text-text-muted sm:flex">
        <Share2 className="h-4 w-4" />
        {L.share}
      </span>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={btn}
        aria-label={`${L.shareOn} X`}
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={btn}
        aria-label={`${L.shareOn} LinkedIn`}
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={btn}
        aria-label={`${L.shareOn} Facebook`}
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      </a>
    </div>
  );
}

function TableOfContents({ items, L }: { items: { id: string; text: string }[]; L: Labels }) {
  if (items.length < 2) return null;
  return (
    <nav aria-label={L.toc} className="text-[13px]">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-text-muted">{L.toc}</p>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="block border-l-2 border-border py-1.5 pl-2.5 pr-1 leading-snug text-text-secondary hover:border-accent hover:bg-accent-subtle hover:text-text-primary"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function RelatedPosts({ currentSlug, category, href, L }: { currentSlug: string; category: string; href: (p: string) => string; L: Labels }) {
  const relatedPosts = getRelatedPosts(currentSlug, category, 3);

  if (relatedPosts.length === 0) return null;

  return (
    <section>
      <h2 className="mb-4 mt-10 font-display text-xl font-extrabold tracking-tight text-text-primary">{L.related}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {relatedPosts.map((related) => (
          <Link
            key={related.slug}
            href={href(`/blog/${related.slug}`)}
            className={`group flex flex-col gap-2.5 p-3 hover:border-border-hover ${CARD}`}
          >
            <Cover post={related} className="h-32" label={L.categories[related.category] || related.category} />
            <h3 className="mt-0.5 text-[15.5px] font-semibold leading-snug tracking-[-0.01em] text-text-primary group-hover:text-accent">
              {related.title}
            </h3>
            <p className="line-clamp-2 text-[13px] leading-normal text-text-secondary">{related.description}</p>
            <span className="mt-auto inline-flex items-center gap-1 pt-1 text-[13px] font-semibold text-accent">
              {L.readArticle}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function ArticleNavigation({ currentSlug, href, L }: { currentSlug: string; href: (p: string) => string; L: Labels }) {
  const currentIndex = blogPosts.findIndex(p => p.slug === currentSlug);
  const prevPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;

  if (!prevPost && !nextPost) return null;

  const item = (post: BlogPost, dir: 'prev' | 'next') => (
    <Link
      href={href(`/blog/${post.slug}`)}
      className={`group flex items-center gap-3 p-3 hover:border-border-hover ${CARD} ${dir === 'next' ? 'sm:flex-row-reverse sm:text-right' : ''}`}
    >
      <Cover post={post} small className="h-[68px] w-[84px] flex-none" />
      <div className="min-w-0 flex-1">
        <span className="inline-flex items-center gap-1 text-[12px] text-text-muted">
          {dir === 'prev' ? <ArrowLeft className="h-3.5 w-3.5" /> : null}
          {dir === 'prev' ? L.previous : L.next}
          {dir === 'next' ? <ArrowRight className="h-3.5 w-3.5" /> : null}
        </span>
        <h3 className="mt-0.5 line-clamp-2 text-sm font-semibold leading-snug text-text-primary group-hover:text-accent">
          {post.title}
        </h3>
      </div>
    </Link>
  );

  return (
    <div className="mt-10 grid gap-3 sm:grid-cols-2">
      {prevPost ? item(prevPost, 'prev') : <div className="hidden sm:block" />}
      {nextPost ? item(nextPost, 'next') : <div className="hidden sm:block" />}
    </div>
  );
}

// =============================================================================
// MAIN PAGE COMPONENT
// =============================================================================

const PROSE = [
  'text-[16px] leading-7 text-text-secondary',
  // headings
  '[&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:scroll-mt-24 [&_h2]:font-display [&_h2]:text-[22px] [&_h2]:font-bold [&_h2]:leading-tight [&_h2]:tracking-[-0.015em] [&_h2]:text-text-primary',
  '[&_h3]:mt-7 [&_h3]:mb-2 [&_h3]:font-display [&_h3]:text-[18px] [&_h3]:font-bold [&_h3]:text-text-primary',
  // paragraphs & lead
  '[&_p]:mb-4 [&_p]:text-[16px] [&_p]:leading-7 [&_p]:text-text-secondary',
  '[&_p.lead]:text-[17px] [&_p.lead]:leading-[1.65]',
  // lists
  '[&_ul]:mb-5 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5 [&_ol]:mb-5 [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-5 [&_li]:pl-1 [&_li::marker]:text-accent',
  // inline
  '[&_a]:font-medium [&_a]:text-accent [&_a]:underline [&_a]:decoration-accent/40 [&_a]:underline-offset-2 hover:[&_a]:decoration-accent',
  '[&_strong]:font-semibold [&_strong]:text-text-primary',
  // info boxes
  '[&_.info-box]:my-6 [&_.info-box]:rounded-xl [&_.info-box]:border [&_.info-box]:p-5 [&_.info-box>*:last-child]:mb-0',
  '[&_.info-box.success]:border-accent-border [&_.info-box.success]:bg-accent-subtle',
  '[&_.info-box.warning]:border-deal/50 [&_.info-box.warning]:bg-deal-subtle',
  // tables
  '[&_table]:my-6 [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm',
  '[&_th]:border [&_th]:border-border [&_th]:bg-bg-base [&_th]:px-3 [&_th]:py-2.5 [&_th]:text-left [&_th]:font-semibold [&_th]:text-text-primary',
  '[&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2.5 [&_td]:text-text-secondary',
].join(' ');

export default function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const locale = params.locale || 'en';
  const L = getLabels(locale);
  const href = (p: string) => (locale === 'en' ? p : p === '/' ? `/${locale}` : `/${locale}${p}`);
  const { html, toc } = processContent(post.content, locale);
  const shareUrl = `https://www.propfirmscanner.org${href(`/blog/${post.slug}`)}`;
  const categoryLabel = L.categories[post.category] || post.category;
  const dateLine = post.updatedDate
    ? `${L.updated} ${formatPostDate(post.updatedDate, locale)}`
    : `${L.published} ${formatPostDate(post.date, locale)}`;

  return (
    <div className="min-h-screen bg-bg-base pb-16">
      <div className="mx-auto max-w-7xl px-4 pt-5">
        <Breadcrumb category={post.category} href={href} L={L} />

        <div className="mt-4 grid gap-8 lg:grid-cols-[180px_minmax(0,1fr)_220px] xl:grid-cols-[220px_minmax(0,680px)_260px] xl:justify-between">
          {/* Left: TOC */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <TableOfContents items={toc} L={L} />
              <Link
                href={href('/blog')}
                className="mt-5 inline-flex min-h-9 items-center gap-1.5 text-[13px] text-text-muted hover:text-text-primary"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                {L.backToBlog}
              </Link>
            </div>
          </aside>

          {/* Center: reading column */}
          <article className="min-w-0 max-w-[680px]">
            <header>
              <span className={`inline-flex h-6 items-center rounded-full px-2.5 text-[11.5px] font-bold ${CATEGORY_PILL[post.category] || CATEGORY_PILL.Guides}`}>
                {categoryLabel}
              </span>
              <h1 className="mt-3 font-display text-[28px] font-extrabold leading-[1.15] tracking-[-0.025em] text-text-primary sm:text-[34px]">
                {post.title}
              </h1>
              <p className="mt-3 text-[17px] leading-relaxed text-text-secondary">{post.description}</p>

              <div className="mt-5 flex flex-wrap items-center gap-3 border-b border-border pb-5">
                <span
                  aria-hidden
                  className="grid h-8 w-8 flex-none place-items-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-[13px] font-extrabold text-white"
                >
                  P
                </span>
                <div className="text-[13px] leading-snug text-text-muted">
                  <div className="font-semibold text-text-primary">{L.team}</div>
                  <div>
                    {dateLine} · <span className="font-mono tabular-nums">{shortReadTime(post.readTime)}</span>
                  </div>
                </div>
                <div className="ml-auto">
                  <ShareButtons title={post.title} url={shareUrl} L={L} />
                </div>
              </div>
            </header>

            {/* Body */}
            <div className={`mt-6 ${PROSE}`} dangerouslySetInnerHTML={{ __html: html }} />

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-border pt-6">
                <span className="text-[12px] font-medium uppercase tracking-[0.08em] text-text-muted">{L.tags}</span>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex h-6 items-center rounded-md border border-border bg-bg-elevated px-2 text-[12px] text-text-secondary dark:bg-transparent"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* End CTA */}
            <section className={`relative mt-8 overflow-hidden p-6 ${CARD}`}>
              <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400" />
              <h2 className="font-display text-xl font-extrabold tracking-tight text-text-primary">{L.ctaTitle}</h2>
              <p className="mt-1.5 text-sm text-text-secondary">{L.ctaDesc}</p>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <Link href={href('/compare')} className={BTN_PRIMARY}>
                  {L.ctaCompare}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href={href('/deals')} className={BTN_SECONDARY}>
                  {L.ctaDeals}
                </Link>
              </div>
            </section>

            <ArticleNavigation currentSlug={params.slug} href={href} L={L} />

            <Link
              href={href('/blog')}
              className="mt-6 inline-flex min-h-11 items-center gap-1.5 text-sm text-text-muted hover:text-text-primary lg:hidden"
            >
              <ArrowLeft className="h-4 w-4" />
              {L.backToBlog}
            </Link>
          </article>

          {/* Right rail */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 flex flex-col gap-3">
              <div className={`p-4 ${CARD} !border-accent-border`}>
                <h2 className="flex items-center gap-1.5 text-[13px] font-bold text-text-primary">
                  <Sparkles className="h-3.5 w-3.5 text-accent" />
                  {L.quizTitle}
                </h2>
                <p className="mb-3 mt-1 text-[12.5px] leading-snug text-text-muted">{L.quizDesc}</p>
                <Link href={href('/quiz?start=true')} className={`${BTN_PRIMARY} !min-h-10 w-full`}>
                  {L.quizBtn}
                </Link>
              </div>
              <div className={`p-4 ${CARD}`}>
                <h2 className="flex items-center gap-1.5 text-[13px] font-bold text-text-primary">
                  <Scale className="h-3.5 w-3.5 text-sky-700 dark:text-sky-300" />
                  {L.compareTitle}
                </h2>
                <p className="mb-3 mt-1 text-[12.5px] leading-snug text-text-muted">{L.compareDesc}</p>
                <Link
                  href={href('/compare')}
                  className="flex min-h-10 w-full items-center justify-center gap-1.5 rounded-xl border border-sky-700/40 bg-sky-500/10 px-3 text-sm font-semibold text-sky-800 hover:brightness-110 dark:border-sky-400/50 dark:text-sky-300"
                >
                  {L.compareBtn}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* Related posts: full width under the layout */}
        <RelatedPosts currentSlug={post.slug} category={post.category} href={href} L={L} />
      </div>
    </div>
  );
}
