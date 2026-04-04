import React, { useMemo } from 'react';
import { ShoppingCart, TrendingDown, ExternalLink, Zap } from 'lucide-react';

/**
 * ComparisonCard - A premium product card optimized for cross-platform affiliate comparisons.
 */
const ComparisonCard = ({ product }) => {
  const { name, brand, image, deals } = product;

  // Identify the absolute "Best Deal"
  const bestDeal = useMemo(() => {
    if (!deals || deals.length === 0) return null;
    return [...deals].sort((a, b) => a.price - b.price)[0];
  }, [deals]);

  const discountPercentage = useMemo(() => {
    if (!bestDeal || !bestDeal.originalPrice) return 0;
    return Math.round(((bestDeal.originalPrice - bestDeal.price) / bestDeal.originalPrice) * 100);
  }, [bestDeal]);

  return (
    <div className="relative group bg-white/80 backdrop-blur-md rounded-3xl overflow-hidden border border-white/50 shadow-xl shadow-slate-200/40 transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl hover:shadow-[#D4A373]/10">
      
      {/* Discount Badge - Top Left */}
      {discountPercentage > 0 && (
        <div className="absolute top-4 left-4 z-20 bg-[#BC4749] text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg shadow-[#BC4749]/30 flex items-center gap-1.5 animate-in fade-in zoom-in duration-500">
          <TrendingDown size={12} strokeWidth={2.5} />
          <span>{discountPercentage}% OFF</span>
        </div>
      )}

      {/* Main image container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-slate-50 group-hover:bg-slate-100 transition-colors duration-500">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        {/* Soft Contrast Gradient Mask */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Product Info & Comparison Section */}
      <div className="p-5 space-y-4">
        <div className="space-y-0.5">
          <p className="text-[10px] md:text-xs font-bold text-[#8E7B73] uppercase tracking-widest">{brand}</p>
          <h3 className="text-lg font-bold text-[#1A1A1A] line-clamp-2 leading-snug h-12">{name}</h3>
        </div>

        {/* Current Best Price Display */}
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-[#1A1A1A]">₹{bestDeal?.price.toLocaleString('en-IN')}</span>
          {bestDeal?.originalPrice && (
            <span className="text-sm font-medium text-slate-400 line-through decoration-slate-300">
              ₹{bestDeal.originalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Platform Price List (Mini Scrollable Table) */}
        <div className="space-y-2.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            Available at:
          </p>
          
          <div className="space-y-1.5">
            {deals.slice(0, 3).map((deal, index) => (
              <div 
                key={deal.platform}
                className={`flex items-center justify-between p-2 rounded-xl transition-all ${
                  deal === bestDeal 
                    ? 'bg-[#D4A373]/5 border border-[#D4A373]/20' 
                    : 'bg-slate-50/50 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Platform Branding Snippet (Use generic icons for now) */}
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold ${
                    deal.platform === 'Amazon' ? 'bg-orange-100 text-orange-600' :
                    deal.platform === 'Flipkart' ? 'bg-blue-100 text-blue-600' :
                    deal.platform === 'Myntra' ? 'bg-pink-100 text-pink-600' :
                    deal.platform === 'Nykaa' ? 'bg-rose-100 text-rose-600' : 'bg-slate-100'
                  }`}>
                    {deal.platform[0]}
                  </div>
                  <span className="text-xs font-bold text-slate-700">{deal.platform}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-black ${deal === bestDeal ? 'text-[#D4A373]' : 'text-[#1A1A1A]'}`}>
                    ₹{deal.price.toLocaleString('en-IN')}
                  </span>
                  {deal === bestDeal && (
                     <div className="bg-[#2D6A4F] text-[8px] text-white px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                        <Zap size={8} className="fill-white" />
                        BEST
                     </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button 
          className="w-full bg-[#1A1A1A] hover:bg-[#2D2D2D] text-white py-4 rounded-2xl font-bold text-sm tracking-tight flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-xl shadow-slate-300/40 relative overflow-hidden group/btn"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
          <ShoppingCart size={18} />
          Shop Now
          <ExternalLink size={14} className="opacity-40 group-hover/btn:opacity-100 transition-opacity" />
        </button>
      </div>
    </div>
  );
};

export default ComparisonCard;
