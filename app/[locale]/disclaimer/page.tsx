import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: 'PropFirm Scanner disclaimer. Important information about trading risks and affiliate relationships.',
}

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-white mb-8">Disclaimer</h1>
        
        <div className="prose prose-invert prose-emerald max-w-none">
          <p className="text-gray-400 mb-6">
            Last updated: January 2025
          </p>

          {/* Risk Warning Box */}
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-red-400 mb-3">⚠️ Risk Warning</h2>
            <p className="text-gray-300">
              Trading forex, futures, and other financial instruments carries a high level of risk and 
              may not be suitable for all investors. You could lose some or all of your investment. 
              Never trade with money you cannot afford to lose.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">General Disclaimer</h2>
            <p className="text-gray-300 mb-4">
              The information provided on PropFirm Scanner is for general informational and educational 
              purposes only. It is not intended as, and should not be understood or construed as:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Financial advice</li>
              <li>Investment advice</li>
              <li>Trading advice</li>
              <li>A recommendation to buy or sell any financial product</li>
              <li>An offer to provide any financial service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">No Guarantees</h2>
            <p className="text-gray-300 mb-4">
              While we strive to provide accurate and up-to-date information, we make no guarantees about:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>The accuracy, completeness, or reliability of any information</li>
              <li>The performance or results of any prop trading firm</li>
              <li>Your ability to pass any trading challenge or evaluation</li>
              <li>Your potential profits or losses from trading</li>
              <li>The validity or availability of any discount codes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Affiliate Disclosure</h2>
            <p className="text-gray-300 mb-4">
              PropFirm Scanner is a participant in various affiliate programs. This means:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>We may earn commissions from qualifying purchases made through our links</li>
              <li>Some of the links on this website are affiliate links</li>
              <li>When you click these links and make a purchase, we may receive compensation</li>
              <li>This compensation helps us maintain and improve our website</li>
            </ul>
            <p className="text-gray-300 mt-4">
              Our affiliate relationships do not influence our reviews or rankings. We strive to provide 
              honest and objective information regardless of affiliate status.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Prop Firm Relationships</h2>
            <p className="text-gray-300 mb-4">
              Please note:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>PropFirm Scanner is not affiliated with, endorsed by, or sponsored by any prop firm</li>
              <li>We are an independent comparison and review platform</li>
              <li>Prop firms may change their rules, pricing, or terms at any time</li>
              <li>Always verify current information directly with the prop firm</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">User Responsibility</h2>
            <p className="text-gray-300 mb-4">
              Before engaging with any prop trading firm, you are responsible for:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Conducting your own due diligence</li>
              <li>Reading and understanding all terms and conditions</li>
              <li>Verifying the legitimacy of the prop firm</li>
              <li>Assessing whether prop trading is suitable for your situation</li>
              <li>Consulting with a qualified financial advisor if needed</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Past Performance</h2>
            <p className="text-gray-300 mb-4">
              Past performance is not indicative of future results. Any statistics, success rates, or 
              testimonials mentioned on this website are for illustrative purposes only and do not 
              guarantee similar results.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Limitation of Liability</h2>
            <p className="text-gray-300 mb-4">
              PropFirm Scanner, its owners, employees, and affiliates shall not be held liable for any 
              losses, damages, or expenses arising from:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Your use of information on this website</li>
              <li>Trading decisions based on our content</li>
              <li>Interactions with any prop trading firm</li>
              <li>Technical errors or website downtime</li>
              <li>Third-party actions or services</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
            <p className="text-gray-300 mb-4">
              If you have any questions about this Disclaimer, please contact us at:
            </p>
            <p className="text-emerald-400">
              contact@propfirmscanner.org
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700">
          <Link href="/" className="text-emerald-400 hover:text-emerald-300">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
