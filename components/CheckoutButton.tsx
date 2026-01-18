'use client';

import { useState } from 'react';
import { Loader2, CreditCard } from 'lucide-react';

interface CheckoutButtonProps {
  priceId: string;
  mode: 'subscription' | 'payment';
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export default function CheckoutButton({ 
  priceId, 
  mode, 
  children, 
  className = '',
  disabled = false 
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (disabled || loading) return;
    
    setLoading(true);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          mode,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Rediriger vers Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 transition-all ${className} ${
        loading ? 'opacity-70 cursor-wait' : ''
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {loading ? (
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
