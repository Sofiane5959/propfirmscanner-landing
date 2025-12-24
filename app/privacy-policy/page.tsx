import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'PropFirm Scanner privacy policy. Learn how we collect, use, and protect your personal information.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
        
        <div className="prose prose-invert prose-emerald max-w-none">
          <p className="text-gray-400 mb-6">
            Last updated: January 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
            <p className="text-gray-300 mb-4">
              When you use PropFirm Scanner, we may collect the following information:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Email address (when you sign up for our newsletter or create an account)</li>
              <li>Usage data (pages visited, time spent, features used)</li>
              <li>Device information (browser type, operating system)</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-300 mb-4">
              We use your information to:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Provide and improve our services</li>
              <li>Send you our newsletter (if subscribed)</li>
              <li>Analyze usage patterns to improve user experience</li>
              <li>Respond to your inquiries and support requests</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">3. Cookies</h2>
            <p className="text-gray-300 mb-4">
              We use cookies to:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Remember your preferences</li>
              <li>Analyze site traffic (Google Analytics)</li>
              <li>Track affiliate conversions</li>
            </ul>
            <p className="text-gray-300 mt-4">
              You can disable cookies in your browser settings, but some features may not work properly.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">4. Third-Party Services</h2>
            <p className="text-gray-300 mb-4">
              We use the following third-party services:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Google Analytics - for website analytics</li>
              <li>Mailchimp - for email newsletters</li>
              <li>Supabase - for data storage</li>
              <li>Vercel - for hosting</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">5. Affiliate Disclosure</h2>
            <p className="text-gray-300 mb-4">
              PropFirm Scanner participates in affiliate programs. When you click on certain links and make a purchase, 
              we may receive a commission. This does not affect our reviews or recommendations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">6. Data Security</h2>
            <p className="text-gray-300 mb-4">
              We implement appropriate security measures to protect your personal information. 
              However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">7. Your Rights</h2>
            <p className="text-gray-300 mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Access your personal data</li>
              <li>Request deletion of your data</li>
              <li>Unsubscribe from our newsletter at any time</li>
              <li>Opt out of analytics tracking</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">8. Contact Us</h2>
            <p className="text-gray-300 mb-4">
              If you have any questions about this Privacy Policy, please contact us at:
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
