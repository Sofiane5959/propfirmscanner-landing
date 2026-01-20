import { Metadata } from 'next';
import { DealsGrid, PromoCodesBanner } from '@/components/DealsGrid';
import { Tag, Percent, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Prop Firm Deals & Promo Codes | PropFirmScanner',
  description: 'Exclusive verified promo codes and discounts for prop trading firms. Save up to 50% on your next challenge with our partner deals.',
  keywords: 'prop firm deals, prop firm promo codes, prop firm discounts, trading challenge coupons',
};

export default function DealsPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Header */}
      <header className="relative overflow-hidden bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 border-b border-gray-800">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl transform -translate-y-1/2" />
          <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl transform -translate-y-1/2" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-16">
          <div className="flex flex-col items-center text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full mb-6">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-medium">Verified & Trusted</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Deals & <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-yellow-400">Discounts</span>
            </h1>

            {/* Description */}
            <p className="text-gray-400 text-lg max-w-2xl mb-8">
              Save money on your next prop firm challenge with our exclusive partner deals. 
              All codes are verified and regularly updated.
            </p>

            {/* Stats */}
            <div className="flex items-center gap-8">
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-white">4</span>
                <span className="text-gray-500 text-sm">Active Codes</span>
              </div>
              <div className="w-px h-12 bg-gray-800" />
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-emerald-400">50%</span>
                <span className="text-gray-500 text-sm">Max Discount</span>
              </div>
              <div className="w-px h-12 bg-gray-800" />
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-white">15+</span>
                <span className="text-gray-500 text-sm">Partners</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Promo Codes Banner */}
        <PromoCodesBanner />

        {/* Deals Grid */}
        <DealsGrid />
      </main>
    </div>
  );
}
