import React, { useMemo } from 'react';
import { ShoppingCart, TrendingDown, ExternalLink, Zap } from 'lucide-react';

/**
 * ComparisonCard — Premium product card with cross-platform price comparison.
 * Pink-tinted glass elevation. "Best Deal" badge pulses with emerald glow.
 */

const PLATFORM_STYLES = {
  Amazon:   { bg: 'badge-amazon',   label: 'Amazon',   abbr: 'Az' },
  Flipkart: { bg: 'badge-flipkart', label: 'Flipkart', abbr: 'Fk' },
  Myntra:   { bg: 'badge-myntra',   label: 'Myntra',   abbr: 'My' },
  Ajio:     { bg: 'badge-ajio',     label: 'Ajio',     abbr: 'Aj' },
  Nykaa:    { bg: 'badge-nykaa',    label: 'Nykaa',    abbr: 'Ny' },
};

const PlatformDot = ({ platform }) => {
  const style = PLATFORM_STYLES[platform] || { bg: 'bg-gray-100 text-gray-600', abbr: platform?.[0] ?? '?' };
  return (
    <div
      className={`w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-black ${style.bg}`}
    >
      {style.abbr}
    </div>
  );
};

const ComparisonCard = ({ product }) => {
  const { name, brand, image, deals = [] } = product;

  const bestDeal = useMemo(() => {
    if (!deals.length) return null;
    return [...deals].sort((a, b) => a.price - b.price)[0];
  }, [deals]);

  const discountPct = useMemo(() => {
    if (!bestDeal?.originalPrice) return 0;
    return Math.round(((bestDeal.originalPrice - bestDeal.price) / bestDeal.originalPrice) * 100);
  }, [bestDeal]);

  return (
    <div
      className="relative group flex flex-col overflow-hidden transition-all duration-500 hover:scale-[1.025] hover:shadow-float rounded-3xl"
      style={{
        background: 'rgba(255,255,255,0.84)',
        backdropFilter: 'blur(12px)',
        border: '1.5px solid rgba(254,205,211,0.40)',
        boxShadow: '0 8px 28px rgba(244,63,94,0.08), 0 2px 6px rgba(0,0,0,0.04)',
      }}
    >
      {/* Discount Badge */}
      {discountPct > 0 && (
        <div className="absolute top-3.5 left-3.5 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black text-white"
          style={{ background: 'linear-gradient(135deg, #F43F5E, #FB7185)', boxShadow: '0 4px 12px rgba(244,63,94,0.35)' }}
        >
          <TrendingDown size={11} />
          {discountPct}% OFF
        </div>
      )}

      {/* Product Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-rose-50/40 group-hover:bg-rose-50/70 transition-colors duration-500">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        {/* Subtle gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Product Info */}
      <div className="p-5 space-y-4 flex-1 flex flex-col">
        <div className="space-y-0.5">
          <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest">{brand}</p>
          <h3 className="text-[15px] font-bold text-[#1C1917] line-clamp-2 leading-snug luxury-font">{name}</h3>
        </div>

        {/* Best Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-[#1C1917]">
            ₹{bestDeal?.price.toLocaleString('en-IN') ?? '—'}
          </span>
          {bestDeal?.originalPrice && (
            <span className="text-sm text-[#9CA3AF] line-through">
              ₹{bestDeal.originalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Platform List */}
        <div className="space-y-2 flex-1">
          <p className="text-[9px] font-black text-[#9CA3AF] uppercase tracking-widest">Available at:</p>
          <div className="space-y-1.5">
            {deals.slice(0, 3).map((deal) => {
              const isBest = deal === bestDeal;
              return (
                <div
                  key={deal.platform}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                    isBest
                      ? 'border border-emerald-100'
                      : 'hover:bg-rose-50/40'
                  }`}
                  style={isBest ? { background: 'rgba(209,250,229,0.35)' } : { background: 'rgba(255,241,242,0.4)' }}
                >
                  <div className="flex items-center gap-2.5">
                    <PlatformDot platform={deal.platform} />
                    <span className="text-xs font-bold text-[#374151]">{deal.platform}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs font-black ${isBest ? 'text-emerald-600' : 'text-[#1C1917]'}`}>
                      ₹{deal.price.toLocaleString('en-IN')}
                    </span>
                    {isBest && (
                      <span
                        className="best-deal-badge text-[7px] font-black text-white px-2 py-0.5 rounded-full flex items-center gap-0.5"
                        style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}
                      >
                        <Zap size={7} fill="white" />
                        BEST
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => bestDeal?.affiliateLink && window.open(bestDeal.affiliateLink, '_blank')}
          className="w-full py-4 rounded-2xl text-white text-sm font-black tracking-tight flex items-center justify-center gap-3 transition-all active:scale-[0.98] relative overflow-hidden group/btn"
          style={{
            background: 'linear-gradient(135deg, #1C1917, #2D2420)',
            boxShadow: '0 8px 24px rgba(28,25,23,0.25)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
          <ShoppingCart size={16} />
          Shop Best Deal
          <ExternalLink size={13} className="opacity-40 group-hover/btn:opacity-100 transition-opacity" />
        </button>
      </div>
    </div>
  );
};

export default ComparisonCard;
