import React from 'react';

/**
 * PriceTag - Handles accessible, highly scannable price displays
 * Includes discount calculations and price difference insights.
 */
const PriceTag = ({ currentPrice, originalPrice, size = 'md', isBestDeal = false, difference = null }) => {
  const discount = originalPrice && currentPrice < originalPrice
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  const sizeClasses = {
    sm: { current: 'text-base', original: 'text-[10px]', badge: 'text-[8px] px-1.5 py-0.5' },
    md: { current: 'text-xl', original: 'text-xs', badge: 'text-[9px] px-2 py-0.5' },
    lg: { current: 'text-3xl', original: 'text-sm', badge: 'text-[10px] px-2.5 py-1' },
  };

  const s = sizeClasses[size];

  return (
    <div className="flex flex-col">
      <div className="flex items-end gap-2 flex-wrap">
        <span className={`font-black luxury-font tracking-tight ${isBestDeal ? 'text-rose-500' : 'text-[#1C1917]'} ${s.current}`}>
          ₹{currentPrice.toLocaleString('en-IN')}
        </span>
        
        {discount > 0 && (
          <div className="flex items-center gap-1.5 mb-1">
            <span className={`line-through text-[#9CA3AF] font-medium ${s.original}`}>
              ₹{originalPrice.toLocaleString('en-IN')}
            </span>
            <span className={`font-black uppercase tracking-wider rounded-lg border bg-rose-50 border-rose-100 text-rose-500 ${s.badge}`}>
              {discount}% OFF
            </span>
          </div>
        )}
      </div>
      
      {/* Price insight micro-copy */}
      {difference > 0 && (
        <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-500 mt-1 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Save ₹{difference.toLocaleString('en-IN')}
        </p>
      )}
    </div>
  );
};

export default React.memo(PriceTag);
