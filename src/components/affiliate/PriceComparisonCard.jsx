import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Zap, ShieldCheck, ChevronRight, Trophy } from 'lucide-react';
import PlatformLogo from './PlatformLogo';
import PriceTag from './PriceTag';

/**
 * Mobile-optimized horizontal scroll layout for comparing prices.
 * Highlights the best deal automatically.
 */
const PriceComparisonCard = ({ product, platforms = [], onSelectPlatform }) => {
  // Auto-detect best deal
  const sortedPlatforms = useMemo(() => {
    if (!platforms || platforms.length === 0) return [];
    return [...platforms].sort((a, b) => a.currentPrice - b.currentPrice);
  }, [platforms]);

  const bestDeal = sortedPlatforms[0];

  if (!platforms.length) return null;

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-[10px] uppercase font-black tracking-widest text-[#9CA3AF]">
          Compare Prices (<span className="text-[#1C1917]">{platforms.length}</span>)
        </h3>
        <span className="text-[9px] uppercase font-bold tracking-widest text-emerald-500 flex items-center gap-1">
          <ShieldCheck size={12} /> Trusted Sellers
        </span>
      </div>

      {/* Horizontal Swipeable Platform List */}
      <div className="flex overflow-x-auto no-scrollbar pb-4 pt-1 -mx-4 px-4 snap-x snap-mandatory gap-3 touch-pan-x">
        {sortedPlatforms.map((platform, index) => {
          const isBest = index === 0 && platforms.length > 1;
          const difference = isBest ? 0 : platform.currentPrice - bestDeal.currentPrice;

          return (
            <div
              key={platform.id || platform.name}
              className={`snap-center shrink-0 w-[240px] rounded-3xl p-4 flex flex-col justify-between transition-all card-contained relative ${
                isBest
                  ? 'bg-white border-2 border-emerald-400 shadow-premium scale-100 z-10'
                  : 'bg-white/80 border border-rose-100 shadow-sm scale-95 opacity-90'
              }`}
              style={{
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
            >
              {isBest && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest whitespace-nowrap shadow-md flex items-center gap-1 z-20">
                  <Trophy size={10} /> Best Deal
                </div>
              )}

              <div className="space-y-4">
                {/* Header: Logo & Name */}
                <div className="flex items-center gap-3">
                  <PlatformLogo platform={platform.name} size="md" />
                  <div>
                    <h4 className="text-xs font-bold text-[#1C1917] uppercase tracking-wider">{platform.name}</h4>
                    <p className="text-[9px] font-medium text-[#9CA3AF] flex items-center gap-1">
                      <Zap size={10} className={platform.fastDelivery ? "text-amber-500" : "text-transparent"} />
                      {platform.deliveryEstimate || 'Standard Delivery'}
                    </p>
                  </div>
                </div>

                {/* Price Display */}
                <div className="pt-2 border-t border-rose-50 border-dashed">
                  <PriceTag
                    currentPrice={platform.currentPrice}
                    originalPrice={platform.originalPrice}
                    size="md"
                    isBestDeal={isBest}
                  />
                  {!isBest && difference > 0 && (
                    <p className="text-[9px] font-medium text-rose-400 mt-1 uppercase tracking-wider">
                      +₹{difference.toLocaleString('en-IN')} more
                    </p>
                  )}
                </div>
              </div>

              {/* Call to Action */}
              <button
                onClick={() => onSelectPlatform(platform)}
                className={`mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all min-h-[44px] active:scale-95 ${
                  isBest
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/20'
                    : 'bg-rose-50 text-rose-500 hover:bg-rose-100 border border-rose-100'
                }`}
              >
                Buy Now <ChevronRight size={14} />
              </button>
            </div>
          );
        })}
        {/* Spacer for smooth end scrolling */}
        <div className="w-2 shrink-0" />
      </div>
    </div>
  );
};

export default React.memo(PriceComparisonCard);
