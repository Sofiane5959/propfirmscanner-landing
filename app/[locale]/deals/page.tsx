import { Metadata } from 'next';
import DealsPageContent from '@/components/DealsPageContent';

export const metadata: Metadata = {
  title: 'Prop Firm Deals & Promo Codes | PropFirmScanner',
  description: 'Exclusive verified promo codes and discounts for prop trading firms. Save up to 50% on your next challenge with our partner deals.',
  keywords: 'prop firm deals, prop firm promo codes, prop firm discounts, trading challenge coupons',
};

export default function DealsPage() {
  return <DealsPageContent />;
}
