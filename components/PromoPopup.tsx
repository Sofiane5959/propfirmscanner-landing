'use client';

import { useState, useEffect } from 'react';
import { X, Gift, Copy, Check, ExternalLink } from 'lucide-react';

const PROMOS = [
  {
    id: 1,
    firm: 'FTMO',
    code: 'SCANNER10',
    discount: '10% OFF',
    description: 'Get 10% off your first challenge',
    url: 'https://ftmo.com',
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 2,
    firm: 'Goat Funded Trader',
    code: 'PROPFIRM15',
    discount: '15% OFF',
    description: 'Exclusive 15% discount on all challenges',
    url: 'https://goatfundedtrader.com',
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 3,
    firm: 'FundedNext',
    code: 'SCANNER20',
    discount: '20% OFF',
    description: 'Special 20% off for our community',
    url: 'https://fundednext.com',
    color: 'from-emerald-500 to-green-600',
  },
  {
    id: 4,
    firm: 'FXIFY',
    code: 'FXIFY10',
    discount: '10% OFF',
    description: '10% off all evaluation programs',
    url: 'https://fxify.com',
    color: 'from-purple-500 to-violet-600',
  },
  {
    id: 5,
    firm: 'E8 Funding',
    code: 'E8DEAL',
    discount: '8% OFF',
    description: 'Exclusive 8% discount code',
    url: 'https://e8funding.com',
    color: 'from-cyan-500 to-blue-600',
  },
];

export default function PromoPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [promo, setPromo] = useState(PROMOS[0]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const lastDismissed = localStorage.getItem('promo_popup_dismissed_at');
    if (lastDismissed) {
      const hoursAgo = (Date.now() - parseInt(lastDismissed)) / (1000 * 60 * 60);
      if (hoursAgo < 24) return;
    }

    // Affiche après 15 secondes
    const timeout = setTimeout(() => {
      const randomPromo = PROMOS[Math.floor(Math.random() * PROMOS.length)];
      setPromo(randomPromo);
      setIsVisible(true);
    }, 15000);

    return () => clearTimeout(timeout);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('promo_popup_dismissed_at', Date.now().toString());
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(promo.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVisit = () => {
    window.open(promo.url, '_blank');
    handleClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      <div className="relative w-80 bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden shadow-2xl">
        <div className={`bg-gradient-to-r ${promo.color} p-4`}>
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 p-1 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white/80 text-xs font-medium">Limited Time Offer</p>
              <p className="text-white text-xl font-bold">{promo.discount}</p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center text-lg font-bold text-emerald-400">
              {promo.firm.charAt(0)}
            </div>
            <div>
              <h4 className="text-white font-semibold">{promo.firm}</h4>
              <p className="text-gray-400 text-sm">{promo.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 px-4 py-2.5 bg-gray-800 border border-dashed border-gray-600 rounded-lg">
              <code className="text-emerald-400 font-mono font-semibold tracking-wider">
                {promo.code}
              </code>
            </div>
            <button
              onClick={handleCopy}
              className="p-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors"
            >
              {copied ? (
                <Check className="w-5 h-5 text-emerald-400" />
              ) : (
                <Copy className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>

          <button
            onClick={handleVisit}
            className={`w-full py-3 bg-gradient-to-r ${promo.color} text-white font-semibold 
                       rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2`}
          >
            Claim Offer
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
