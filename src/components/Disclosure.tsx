import React from 'react';

export const DisclosureBanner: React.FC = () => {
  return (
    <div className="bg-gray-100 dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 text-xs text-gray-600 dark:text-zinc-400 py-2 px-4 text-center">
      <p>
        <strong>Affiliate Disclosure:</strong> As an affiliate, I may earn from qualifying purchases at no extra cost to you.{' '}
        <a href="/legal/affiliate-disclosure" className="underline hover:text-blue-500">Learn more</a>
      </p>
    </div>
  );
};

export const AffiliateDisclaimer: React.FC = () => {
  return (
    <p className="text-[10px] text-gray-500 mt-4 italic leading-tight">
      * Product prices and availability are accurate as of the date/time indicated and are subject to change. Any price and availability information displayed on [Amazon/Flipkart] at the time of purchase will apply to the purchase of this product.
    </p>
  );
};
