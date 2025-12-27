import type { Metadata } from 'next'
import { 
  DollarSign, Heart, Shield, CheckCircle, 
  XCircle, ExternalLink, HelpCircle, Scale
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'How We Make Money | PropFirm Scanner',
  description: 'Transparency about how PropFirm Scanner earns revenue. Learn about our affiliate relationships and how we maintain editorial independence.',
  alternates: {
    canonical: 'https://www.propfirmscanner.org/how-we-make-money',
  },
}

export default function HowWeMakeMoneyPage() {
  return (
    <div className="min-h-screen bg-gray-900 py-24 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm mb-6">
            <Heart className="w-4 h-4" />
            Full Transparency
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">How We Make Money</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            We believe in complete transparency about how PropFirm Scanner generates revenue. 
            Here&apos;s exactly how we keep the lights on.
          </p>
        </div>

        {/* Main Revenue Source */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-xl p-8">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-3">Affiliate Commissions</h2>
                <p className="text-gray-300 mb-4">
                  When you click on a link to a prop firm from our website and make a purchase, 
                  we may earn a commission from that prop firm. This is our primary source of revenue.
                </p>
                <p className="text-gray-400">
                  <strong className="text-white">Important:</strong> This commission comes from the 
                  prop firm, not from you. You pay the same price whether you use our link or not — 
                  and often you&apos;ll pay <span className="text-emerald-400">less</span> thanks to our 
                  exclusive discount codes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What This Means */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-emerald-400" />
            What This Means for You
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                What We Do
              </h3>
              <ul className="space-y-3">
                {[
                  'Clearly mark affiliate links on our site',
                  'Provide honest reviews regardless of affiliate status',
                  'Include non-affiliate firms in our comparisons',
                  'Offer exclusive discount codes that save you money',
                  'Update our data regularly for accuracy',
                  'Disclose our business model transparently',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-300">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-400" />
                What We Don&apos;t Do
              </h3>
              <ul className="space-y-3">
                {[
                  'Accept payment to improve rankings',
                  'Hide negative information about affiliates',
                  'Recommend firms we don\'t believe in',
                  'Exclude firms because they\'re not affiliates',
                  'Charge you extra through our links',
                  'Let commissions influence our reviews',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-300">
                    <XCircle className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Editorial Independence */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Scale className="w-6 h-6 text-emerald-400" />
            Editorial Independence
          </h2>
          
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 space-y-4">
            <p className="text-gray-300">
              Our reviews, rankings, and comparisons are based on objective criteria including:
            </p>
            
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { label: 'Trustpilot Rating', desc: 'Independent review platform' },
                { label: 'Pricing & Value', desc: 'Challenge fees vs features' },
                { label: 'Rules & Flexibility', desc: 'Trading conditions offered' },
                { label: 'Payout History', desc: 'Track record of payments' },
                { label: 'Platform Quality', desc: 'Trading platforms supported' },
                { label: 'Company Reputation', desc: 'History and transparency' },
              ].map((item, i) => (
                <div key={i} className="bg-gray-900/50 rounded-lg p-4">
                  <div className="text-white font-medium">{item.label}</div>
                  <div className="text-gray-500 text-sm">{item.desc}</div>
                </div>
              ))}
            </div>
            
            <p className="text-gray-400 text-sm">
              A prop firm&apos;s affiliate status does not affect its position in our rankings. 
              We&apos;ve recommended non-affiliate firms and criticized affiliate partners when warranted.
            </p>
          </div>
        </section>

        {/* Affiliate Partners */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Our Affiliate Relationships</h2>
          
          <p className="text-gray-400 mb-6">
            We have affiliate partnerships with many of the prop firms featured on our site. 
            When you see a &quot;Visit Website&quot; or &quot;Buy Challenge&quot; button, it typically contains 
            an affiliate link.
          </p>
          
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">How to Identify Affiliate Links</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1">•</span>
                <span>Links marked with &quot;Affiliate Link&quot; or similar disclosure</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1">•</span>
                <span>&quot;Visit Website&quot; and &quot;Buy Challenge&quot; buttons on firm pages</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1">•</span>
                <span>Discount code links on our Deals page</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1">•</span>
                <span>URLs containing tracking parameters (ref=, aff=, etc.)</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Why We Use Affiliates */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Why This Model?</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6">
              <h3 className="text-emerald-400 font-semibold mb-3">Benefits for You</h3>
              <ul className="space-y-2 text-gray-300">
                <li>✓ Free access to all comparisons and tools</li>
                <li>✓ No subscription or membership fees</li>
                <li>✓ Exclusive discount codes that save you money</li>
                <li>✓ Unbiased information to make better decisions</li>
              </ul>
            </div>
            
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
              <h3 className="text-blue-400 font-semibold mb-3">Benefits for Us</h3>
              <ul className="space-y-2 text-gray-300">
                <li>✓ Sustainable revenue to keep the site running</li>
                <li>✓ Ability to invest in better tools and content</li>
                <li>✓ Independence from any single prop firm</li>
                <li>✓ Motivation to grow and serve more traders</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Your Choice */}
        <section className="mb-12">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-emerald-400" />
              Your Choice Matters
            </h2>
            <p className="text-gray-300 mb-4">
              You&apos;re never obligated to use our affiliate links. If you prefer, you can:
            </p>
            <ul className="space-y-2 text-gray-400">
              <li>• Go directly to the prop firm&apos;s website</li>
              <li>• Search for the prop firm on Google</li>
              <li>• Use our information for research, then buy elsewhere</li>
            </ul>
            <p className="text-gray-300 mt-4">
              However, if you find our site helpful and want to support our work at no extra cost 
              to you, using our links is a great way to do that. Plus, you&apos;ll often get a 
              discount code that saves you money!
            </p>
          </div>
        </section>

        {/* Questions */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-2">Questions?</h2>
            <p className="text-gray-400 mb-6">
              We&apos;re committed to transparency. If you have any questions about our business model 
              or affiliate relationships, please reach out.
            </p>
            <a
              href="mailto:hello@propfirmscanner.org?subject=Question%20About%20Affiliates"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
            >
              Contact Us
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
