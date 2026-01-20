import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | PropFirm Scanner',
  description: 'Terms of Service for PropFirm Scanner - Read our terms and conditions for using our prop firm comparison platform.',
  alternates: {
    canonical: 'https://www.propfirmscanner.org/terms-of-service',
  },
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-900 py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
        <p className="text-gray-400 mb-8">Last updated: January 1, 2026</p>
        
        <div className="prose prose-invert prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-300 mb-4">
              By accessing or using PropFirm Scanner (www.propfirmscanner.org), you agree to be bound by these Terms of Service. 
              If you disagree with any part of these terms, you do not have permission to access the website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">2. Description of Service</h2>
            <p className="text-gray-300 mb-4">
              PropFirm Scanner is an information and comparison platform for proprietary trading firms. We provide:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Comparison tools for prop trading firms</li>
              <li>Reviews and analysis of prop firms</li>
              <li>Educational content about prop trading</li>
              <li>Discount codes and promotional offers</li>
              <li>Trading tools (risk calculator, rule tracker)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">3. Important Disclaimers</h2>
            
            <h3 className="text-xl font-medium text-white mb-3">Not Financial Advice</h3>
            <p className="text-gray-300 mb-4">
              The information provided on PropFirm Scanner is for general informational purposes only. It should not be 
              considered as financial advice, investment advice, or trading advice. Always conduct your own research 
              and consult with a qualified financial advisor before making any trading or investment decisions.
            </p>

            <h3 className="text-xl font-medium text-white mb-3">No Guarantees</h3>
            <p className="text-gray-300 mb-4">
              We do not guarantee the accuracy, completeness, or timeliness of any information on our website. 
              Prop firm rules, prices, and conditions change frequently. Always verify information directly with 
              the prop firm before making a purchase.
            </p>

            <h3 className="text-xl font-medium text-white mb-3">Trading Risk</h3>
            <p className="text-gray-300">
              Trading in financial markets involves substantial risk of loss. Past performance is not indicative of 
              future results. You should only trade with money you can afford to lose.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">4. Affiliate Relationships</h2>
            <p className="text-gray-300 mb-4">
              PropFirm Scanner participates in affiliate programs with various prop trading firms. When you click on 
              certain links and make a purchase, we may receive a commission at no additional cost to you.
            </p>
            <p className="text-gray-300">
              Our affiliate relationships do not influence our reviews or rankings. We strive to provide honest, 
              unbiased information regardless of affiliate status.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">5. User Accounts</h2>
            <p className="text-gray-300 mb-4">
              When you create an account with us, you must provide accurate and complete information. You are responsible 
              for safeguarding your password and for any activities that occur under your account.
            </p>
            <p className="text-gray-300">
              You agree to notify us immediately of any unauthorized access to your account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">6. Acceptable Use</h2>
            <p className="text-gray-300 mb-4">You agree not to:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Use the website for any illegal purpose</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Scrape or copy our content without permission</li>
              <li>Interfere with the proper functioning of the website</li>
              <li>Submit false or misleading information</li>
              <li>Impersonate any person or entity</li>
              <li>Use automated systems to access the website</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">7. Intellectual Property</h2>
            <p className="text-gray-300 mb-4">
              All content on PropFirm Scanner, including text, graphics, logos, images, and software, is the property 
              of PropFirm Scanner or its content suppliers and is protected by copyright laws.
            </p>
            <p className="text-gray-300">
              You may not reproduce, distribute, modify, or create derivative works from any content without our 
              express written permission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">8. Third-Party Links</h2>
            <p className="text-gray-300">
              Our website contains links to third-party websites (prop firms, tools, resources). We are not responsible 
              for the content, privacy policies, or practices of any third-party websites. You access third-party 
              websites at your own risk.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-300 mb-4">
              To the maximum extent permitted by law, PropFirm Scanner shall not be liable for any indirect, incidental, 
              special, consequential, or punitive damages, including but not limited to:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Loss of profits or revenue</li>
              <li>Loss of data</li>
              <li>Trading losses</li>
              <li>Failed prop firm challenges</li>
              <li>Any other intangible losses</li>
            </ul>
            <p className="text-gray-300 mt-4">
              This limitation applies whether the alleged liability is based on contract, tort, negligence, or any other basis.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">10. Indemnification</h2>
            <p className="text-gray-300">
              You agree to indemnify and hold harmless PropFirm Scanner and its affiliates from any claims, losses, 
              damages, liabilities, and expenses arising from your use of the website or violation of these terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">11. Modifications</h2>
            <p className="text-gray-300">
              We reserve the right to modify these Terms of Service at any time. We will notify users of significant 
              changes by posting a notice on our website. Your continued use of the website after changes constitutes 
              acceptance of the modified terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">12. Termination</h2>
            <p className="text-gray-300">
              We may terminate or suspend your access to the website immediately, without prior notice, for any reason, 
              including breach of these Terms. Upon termination, your right to use the website will cease immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">13. Governing Law</h2>
            <p className="text-gray-300">
              These Terms shall be governed by and construed in accordance with applicable laws, without regard to 
              conflict of law principles.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">14. Contact Us</h2>
            <p className="text-gray-300">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <p className="text-gray-300 mt-4">
              <strong>Email:</strong> legal@propfirmscanner.org<br />
              <strong>Website:</strong> www.propfirmscanner.org
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
