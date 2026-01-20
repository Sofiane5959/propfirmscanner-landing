import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | PropFirm Scanner',
  description: 'Privacy Policy for PropFirm Scanner - Learn how we collect, use, and protect your personal information.',
  alternates: {
    canonical: 'https://www.propfirmscanner.org/privacy-policy',
  },
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-900 py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
        <p className="text-gray-400 mb-8">Last updated: January 1, 2026</p>
        
        <div className="prose prose-invert prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
            <p className="text-gray-300 mb-4">
              Welcome to PropFirm Scanner (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your privacy 
              and personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard 
              your information when you visit our website www.propfirmscanner.org.
            </p>
            <p className="text-gray-300">
              Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, 
              please do not access the site.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-medium text-white mb-3">Personal Information</h3>
            <p className="text-gray-300 mb-4">
              We may collect personal information that you voluntarily provide to us when you:
            </p>
            <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
              <li>Subscribe to our newsletter</li>
              <li>Download our free guide</li>
              <li>Create an account</li>
              <li>Contact us through our website</li>
            </ul>
            <p className="text-gray-300 mb-4">
              This information may include: email address, name, and any other information you choose to provide.
            </p>

            <h3 className="text-xl font-medium text-white mb-3">Automatically Collected Information</h3>
            <p className="text-gray-300 mb-4">
              When you visit our website, we automatically collect certain information about your device, including:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Pages visited and time spent</li>
              <li>Referring website</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-300 mb-4">We use the information we collect to:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Provide, operate, and maintain our website</li>
              <li>Send you our newsletter and promotional materials (with your consent)</li>
              <li>Respond to your comments and questions</li>
              <li>Analyze usage patterns to improve our website</li>
              <li>Protect against fraudulent or illegal activity</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">4. Cookies and Tracking Technologies</h2>
            <p className="text-gray-300 mb-4">
              We use cookies and similar tracking technologies to track activity on our website and hold certain information. 
              Cookies are files with a small amount of data that are sent to your browser from a website and stored on your device.
            </p>
            <p className="text-gray-300 mb-4">We use the following types of cookies:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li><strong>Essential cookies:</strong> Required for the website to function properly</li>
              <li><strong>Analytics cookies:</strong> Help us understand how visitors interact with our website (Google Analytics)</li>
              <li><strong>Marketing cookies:</strong> Used to track visitors across websites for advertising purposes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">5. Third-Party Services</h2>
            <p className="text-gray-300 mb-4">We may use third-party services that collect information, including:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li><strong>Google Analytics:</strong> For website analytics and usage tracking</li>
              <li><strong>Mailchimp:</strong> For email newsletter management</li>
              <li><strong>Vercel:</strong> For website hosting</li>
              <li><strong>Supabase:</strong> For database services</li>
            </ul>
            <p className="text-gray-300 mt-4">
              These third parties have their own privacy policies addressing how they use such information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">6. Affiliate Disclosure</h2>
            <p className="text-gray-300 mb-4">
              PropFirm Scanner participates in affiliate programs with various prop trading firms. This means we may earn 
              a commission when you click on links to prop firms and make a purchase. This comes at no additional cost to you.
            </p>
            <p className="text-gray-300">
              Our reviews and comparisons are based on objective criteria and are not influenced by affiliate relationships. 
              We clearly mark affiliate links on our website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">7. Data Retention</h2>
            <p className="text-gray-300">
              We retain your personal information only for as long as necessary to fulfill the purposes outlined in this 
              privacy policy, unless a longer retention period is required by law. When you unsubscribe from our newsletter, 
              we will remove your email from our mailing list within 30 days.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">8. Your Rights</h2>
            <p className="text-gray-300 mb-4">You have the right to:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your personal information</li>
              <li>Opt-out of marketing communications</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p className="text-gray-300 mt-4">
              To exercise any of these rights, please contact us at privacy@propfirmscanner.org.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">9. Children&apos;s Privacy</h2>
            <p className="text-gray-300">
              Our website is not intended for children under 18 years of age. We do not knowingly collect personal 
              information from children under 18. If you are a parent or guardian and believe your child has provided 
              us with personal information, please contact us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">10. Changes to This Policy</h2>
            <p className="text-gray-300">
              We may update this privacy policy from time to time. We will notify you of any changes by posting the 
              new privacy policy on this page and updating the &quot;Last updated&quot; date. You are advised to review this 
              privacy policy periodically for any changes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">11. Contact Us</h2>
            <p className="text-gray-300">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="text-gray-300 mt-4">
              <strong>Email:</strong> privacy@propfirmscanner.org<br />
              <strong>Website:</strong> www.propfirmscanner.org
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
