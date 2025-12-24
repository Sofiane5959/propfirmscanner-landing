import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'PropFirm Scanner terms of service. Read our terms and conditions for using our website.',
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
        
        <div className="prose prose-invert prose-emerald max-w-none">
          <p className="text-gray-400 mb-6">
            Last updated: January 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-300 mb-4">
              By accessing and using PropFirm Scanner (propfirmscanner.org), you agree to be bound by these 
              Terms of Service. If you do not agree to these terms, please do not use our website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
            <p className="text-gray-300 mb-4">
              PropFirm Scanner is a comparison and information platform for proprietary trading firms. 
              We provide:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Comparison tools for prop trading firms</li>
              <li>Reviews and analysis</li>
              <li>Educational content</li>
              <li>Discount codes and deals</li>
              <li>Trading tools and calculators</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">3. Not Financial Advice</h2>
            <p className="text-gray-300 mb-4">
              The information provided on PropFirm Scanner is for informational purposes only and should 
              not be considered financial advice. We do not recommend any specific prop firm or trading 
              strategy. Always do your own research and consider your financial situation before making 
              any decisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">4. Affiliate Relationships</h2>
            <p className="text-gray-300 mb-4">
              PropFirm Scanner participates in affiliate programs with various prop trading firms. 
              This means:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>We may receive compensation when you click on certain links</li>
              <li>We may earn a commission if you purchase through our links</li>
              <li>This does not affect the price you pay</li>
              <li>Our reviews and rankings are based on objective criteria</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">5. User Responsibilities</h2>
            <p className="text-gray-300 mb-4">
              By using our website, you agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Provide accurate information when creating an account</li>
              <li>Not use the website for any illegal purposes</li>
              <li>Not attempt to access restricted areas of the website</li>
              <li>Not scrape or copy our content without permission</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">6. Intellectual Property</h2>
            <p className="text-gray-300 mb-4">
              All content on PropFirm Scanner, including text, graphics, logos, and software, is the 
              property of PropFirm Scanner and is protected by copyright laws. You may not reproduce, 
              distribute, or create derivative works without our written permission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">7. Third-Party Links</h2>
            <p className="text-gray-300 mb-4">
              Our website contains links to third-party websites. We are not responsible for the content 
              or practices of these websites. We encourage you to review the terms and privacy policies 
              of any third-party sites you visit.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">8. Limitation of Liability</h2>
            <p className="text-gray-300 mb-4">
              PropFirm Scanner shall not be liable for any direct, indirect, incidental, or consequential 
              damages resulting from:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Use or inability to use our website</li>
              <li>Any errors or inaccuracies in our content</li>
              <li>Trading losses incurred based on information from our website</li>
              <li>Actions taken by prop firms you engage with through our links</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">9. Changes to Terms</h2>
            <p className="text-gray-300 mb-4">
              We reserve the right to modify these terms at any time. Changes will be effective 
              immediately upon posting. Your continued use of the website constitutes acceptance 
              of the modified terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">10. Contact Us</h2>
            <p className="text-gray-300 mb-4">
              If you have any questions about these Terms of Service, please contact us at:
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
