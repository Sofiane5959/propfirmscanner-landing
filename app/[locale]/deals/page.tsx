import { Metadata } from 'next';
import DealsPageContent from '@/components/DealsPageContent';

export const metadata: Metadata = {
  title: 'Prop Firm Promo Codes | PropFirmScanner',
  description: 'Promo codes for prop trading firms, each one tested on the firm’s checkout page before it is published.',
  keywords: 'prop firm deals, prop firm promo codes, prop firm discounts, trading challenge coupons',
};

export default function DealsPage() {
  return <DealsPageContent />;
}
