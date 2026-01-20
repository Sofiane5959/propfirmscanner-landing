import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, Calendar, ArrowLeft, ArrowRight, User, Share2, BookOpen, Shield, Brain, TrendingUp, ChevronRight, Home } from 'lucide-react';
import { blogPosts, getPostBySlug, getRelatedPosts, CATEGORY_COLORS } from '@/lib/blog-data';

// =============================================================================
// TYPES
// =============================================================================

interface Props {
  params: { slug: string };
}

// =============================================================================
// CATEGORY ICONS
// =============================================================================

const CATEGORY_ICONS: Record<string, typeof BookOpen> = {
  'Guides': BookOpen,
  'Rules Decoded': Shield,
  'Reviews': TrendingUp,
  'Psychology': Brain,
};

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
    alternates: {
      canonical: `https://www.propfirmscanner.org/blog/${params.slug}`,
    },
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
// BREADCRUMB COMPONENT
// =============================================================================

function Breadcrumb({ title, category }: { title: string; category: string }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex items-center gap-2 text-sm flex-wrap">
        <li>
          <Link 
            href="/" 
            className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </Link>
        </li>
        <li className="text-gray-600">
          <ChevronRight className="w-4 h-4" />
        </li>
        <li>
          <Link 
            href="/blog" 
            className="text-gray-400 hover:text-white transition-colors"
          >
            Blog
          </Link>
        </li>
        <li className="text-gray-600">
          <ChevronRight className="w-4 h-4" />
        </li>
        <li>
          <span className="text-gray-400">{category}</span>
        </li>
        <li className="text-gray-600 hidden md:block">
          <ChevronRight className="w-4 h-4" />
        </li>
        <li className="hidden md:block">
          <span className="text-emerald-400 font-medium line-clamp-1">{title}</span>
        </li>
      </ol>
    </nav>
  );
}

// =============================================================================
// SHARE BUTTONS COMPONENT
// =============================================================================

function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const url = `https://www.propfirmscanner.org/blog/${slug}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="flex items-center gap-3">
      <span className="text-gray-500 text-sm flex items-center gap-1">
        <Share2 className="w-4 h-4" />
        Share:
      </span>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors"
        aria-label="Share on Twitter"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors"
        aria-label="Share on LinkedIn"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors"
        aria-label="Share on Facebook"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      </a>
    </div>
  );
}

// =============================================================================
// TABLE OF CONTENTS COMPONENT
// =============================================================================

function TableOfContents({ content }: { content: string }) {
  // Extract h2 headings from content
  const headings = content.match(/<h2>(.*?)<\/h2>/g) || [];
  const tocItems = headings.map(h => h.replace(/<\/?h2>/g, ''));

  if (tocItems.length < 3) return null;

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-8">
      <h2 className="text-lg font-semibold text-white mb-4">Table of Contents</h2>
      <ul className="space-y-2">
        {tocItems.map((item, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="text-emerald-500 font-mono text-sm">{(index + 1).toString().padStart(2, '0')}</span>
            <span className="text-gray-400 text-sm hover:text-white transition-colors cursor-pointer">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// =============================================================================
// RELATED POSTS COMPONENT
// =============================================================================

function RelatedPosts({ currentSlug, category }: { currentSlug: string; category: string }) {
  const relatedPosts = getRelatedPosts(currentSlug, category, 3);

  if (relatedPosts.length === 0) return null;

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-white mb-6">Related Articles</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {relatedPosts.map((related) => {
          const colors = CATEGORY_COLORS[related.category];
          return (
            <Link
              key={related.slug}
              href={`/blog/${related.slug}`}
              className="group bg-gray-800/50 border border-gray-700 rounded-xl p-5 hover:border-emerald-500/30 hover:bg-gray-800 transition-all"
            >
              <span className={`text-xs font-medium ${colors.text}`}>
                {related.category}
              </span>
              <h3 className="text-lg font-semibold text-white mt-2 mb-2 line-clamp-2 group-hover:text-emerald-400 transition-colors">
                {related.title}
              </h3>
              <p className="text-gray-400 text-sm line-clamp-2">{related.description}</p>
              <div className="flex items-center gap-1 mt-3 text-emerald-400 text-sm font-medium">
                Read article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// =============================================================================
// ARTICLE NAVIGATION COMPONENT
// =============================================================================

function ArticleNavigation({ currentSlug }: { currentSlug: string }) {
  const currentIndex = blogPosts.findIndex(p => p.slug === currentSlug);
  const prevPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;

  return (
    <div className="mt-12 pt-8 border-t border-gray-800">
      <div className="grid md:grid-cols-2 gap-4">
        {prevPost ? (
          <Link
            href={`/blog/${prevPost.slug}`}
            className="group flex items-center gap-4 p-4 bg-gray-900/50 border border-gray-800 rounded-xl hover:border-emerald-500/30 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-gray-500 group-hover:text-emerald-400 group-hover:-translate-x-1 transition-all" />
            <div className="flex-1 min-w-0">
              <span className="text-xs text-gray-500">Previous Article</span>
              <h4 className="text-white font-medium line-clamp-1 group-hover:text-emerald-400 transition-colors">
                {prevPost.title}
              </h4>
            </div>
          </Link>
        ) : (
          <div />
        )}
        
        {nextPost ? (
          <Link
            href={`/blog/${nextPost.slug}`}
            className="group flex items-center gap-4 p-4 bg-gray-900/50 border border-gray-800 rounded-xl hover:border-emerald-500/30 transition-all text-right"
          >
            <div className="flex-1 min-w-0">
              <span className="text-xs text-gray-500">Next Article</span>
              <h4 className="text-white font-medium line-clamp-1 group-hover:text-emerald-400 transition-colors">
                {nextPost.title}
              </h4>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}

// =============================================================================
// MAIN PAGE COMPONENT
// =============================================================================

export default function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug);
  
  if (!post) {
    notFound();
  }

  const Icon = CATEGORY_ICONS[post.category] || BookOpen;
  const colors = CATEGORY_COLORS[post.category];

  // Process content to add styling classes to info boxes
  const processedContent = post.content
    .replace(/<div class="info-box warning">/g, '<div class="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 my-8">')
    .replace(/<div class="info-box success">/g, '<div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6 my-8">')
    .replace(/<p class="lead">/g, '<p class="text-xl text-gray-300 leading-relaxed mb-8">')
    .replace(/<table class="comparison-table">/g, '<table class="w-full border-collapse my-6">');

  return (
    <div className="min-h-screen bg-gray-950 pt-20 pb-16">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumb title={post.title} category={post.category} />

        {/* Back Link */}
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Blog
        </Link>

        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className={`flex items-center gap-1.5 px-3 py-1.5 ${colors.bg} ${colors.text} text-sm font-medium rounded-full`}>
              <Icon className="w-4 h-4" />
              {post.category}
            </span>
            {post.featured && (
              <span className="px-3 py-1.5 bg-yellow-500/20 text-yellow-400 text-sm font-medium rounded-full">
                ⭐ Featured
              </span>
            )}
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            {post.title}
          </h1>
          
          <p className="text-xl text-gray-400 mb-6">
            {post.description}
          </p>
          
          <div className="flex flex-wrap items-center gap-6 text-gray-500">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>PropFirm Scanner</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{post.updatedDate ? `Updated ${post.updatedDate}` : post.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.readTime}</span>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <ShareButtons title={post.title} slug={post.slug} />
          </div>
        </header>

        {/* Table of Contents */}
        <TableOfContents content={post.content} />

        {/* Content */}
        <div 
          className="prose prose-invert prose-lg max-w-none
            prose-headings:text-white prose-headings:font-bold
            prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-emerald-400
            prose-p:text-gray-300 prose-p:leading-relaxed
            prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-white
            prose-ul:text-gray-300 prose-ol:text-gray-300
            prose-li:marker:text-emerald-500
            prose-table:border-gray-700
            prose-th:bg-gray-800 prose-th:text-white prose-th:p-3 prose-th:text-left
            prose-td:border-gray-700 prose-td:p-3 prose-td:text-gray-300"
          dangerouslySetInnerHTML={{ __html: processedContent }}
        />

        {/* Tags */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-gray-500 text-sm">Tags:</span>
            {post.tags.map(tag => (
              <span 
                key={tag}
                className="px-3 py-1 bg-gray-800 text-gray-400 text-sm rounded-full capitalize"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to Get Funded?</h2>
          <p className="text-gray-400 mb-6">Compare 70+ prop firms and find the perfect match for your trading style.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              href="/compare" 
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
            >
              Compare Prop Firms
            </Link>
            <Link 
              href="/deals" 
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-colors"
            >
              View Deals
            </Link>
          </div>
        </div>

        {/* Article Navigation */}
        <ArticleNavigation currentSlug={params.slug} />

        {/* Related Posts */}
        <RelatedPosts currentSlug={post.slug} category={post.category} />
      </article>
    </div>
  );
}
