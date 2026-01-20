'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

type ProductType = 'pro_monthly' | 'rules_guide';

interface CheckoutButtonProps {
  productType: ProductType;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function CheckoutButton({ 
  productType, 
  children, 
  className = '',
  disabled = false 
}: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    if (disabled || isLoading) return;
    
    setIsLoading(true);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productType }),
      });

      const data = await response.json();

      if (data.error) {
        console.error('Checkout error:', data.error);
        alert('An error occurred. Please try again.');
        return;
      }

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={disabled || isLoading}
      className={`flex items-center justify-center gap-2 ${className} ${
        (disabled || isLoading) ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Processing...
        </>
      ) : (
        children
      )}
    </button>
  );
}

export default CheckoutButton;
