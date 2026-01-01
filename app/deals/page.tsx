import { Metadata } from 'next';
import { DealsGrid, PromoCodesBanner } from '@/components/DealsGrid';
import { Tag } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Prop Firm Deals & Discounts | PropFirmScanner',
  description: 'Exclusive deals and promo codes for the best prop trading firms. Save money on your next challenge with our partner discounts.',
};

export default function DealsPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gradient-to-b from-gray-900 to-gray-950 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-emerald-500/20 rounded-xl">
              <Tag className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Deals & Discounts</h1>
              <p className="text-gray-400">
                Exclusive promo codes and partner discounts
              </p>
            </div>
          </div>
          
          <p className="text-gray-500 max-w-2xl">
            Save money on your next prop firm challenge with our exclusive partner deals. 
            We negotiate the best discounts so you can focus on trading.
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Promo Codes Banner */}
        <PromoCodesBanner />

        {/* Deals Grid */}
        <DealsGrid />
      </main>
    </div>
  );
}
