import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Sparkles, TrendingDown, ExternalLink, ShieldCheck } from 'lucide-react';
import api from '../../services/api';

/**
 * PriceComparison — Bottom-sheet price comparison for 5 platforms.
 * Pink gradient header, platform-coloured badges, Best Deal pulse.
 */

const PLATFORM_CONFIG = {
  amazon:   { label: 'Amazon',   color: '#FF9900', bg: '#FFF3DC', text: '#92400E', abbr: 'Az' },
  flipkart: { label: 'Flipkart', color: '#2874F0', bg: '#DBEAFE', text: '#1E40AF', abbr: 'Fk' },
  myntra:   { label: 'Myntra',   color: '#FF3F6C', bg: '#FFE4E6', text: '#BE123C', abbr: 'My' },
  ajio:     { label: 'Ajio',     color: '#1C1C1C', bg: '#F3F4F6', text: '#111827', abbr: 'Aj' },
  nykaa:    { label: 'Nykaa',    color: '#FC2779', bg: '#FCE7F3', text: '#9D174D', abbr: 'Ny' },
};

const getConfig = (platform = '') => {
  const key = platform.toLowerCase();
  return PLATFORM_CONFIG[key] || { label: platform, color: '#9CA3AF', bg: '#F9FAFB', text: '#374151', abbr: platform?.[0]?.toUpperCase() ?? '?' };
};

const PriceComparison = ({ outfit, onClose }) => {
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComparison = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/outfits/comparison/${outfit.id}`);
        setComparison(res.data);
      } catch (err) {
        console.error('Comparison fetch failed', err);
        setError('Could not load comparison data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    if (outfit) fetchComparison();
  }, [outfit]);

  if (!outfit) return null;

  const allItems = comparison
    ? [comparison.base_product, ...(comparison.competitors || [])].sort((a, b) => a.price - b.price)
    : [];

  const savings = comparison?.base_product && comparison?.best_deal
    ? Math.max(0, comparison.base_product.price - comparison.best_deal.price)
    : 0;

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 26, stiffness: 220 }}
      className="fixed inset-x-0 bottom-0 z-[600] overflow-y-auto no-scrollbar rounded-t-[36px] max-h-[88vh]"
      style={{
        background: 'rgba(255,255,255,0.96)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        boxShadow: '0 -16px 56px rgba(244,63,94,0.12), 0 -4px 16px rgba(0,0,0,0.06)',
        border: '1.5px solid rgba(254,205,211,0.35)',
        borderBottom: 'none',
      }}
    >
      {/* Drag Handle */}
      <div className="flex justify-center pt-4 pb-1">
        <div className="w-10 h-1 rounded-full bg-rose-200" />
      </div>

      <div className="px-6 pb-32 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-7 pt-2">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles size={13} className="text-rose-400" />
              <span className="text-[9px] uppercase font-black tracking-widest text-rose-400">
                Cross-Platform Comparison
              </span>
            </div>
            <h2 className="text-2xl font-bold luxury-font text-[#1C1917]">Best Deal Finder</h2>
            {savings > 0 && !loading && (
              <p className="text-xs text-emerald-600 font-bold mt-1 flex items-center gap-1">
                <TrendingDown size={12} />
                Save up to ₹{savings.toLocaleString('en-IN')} vs. highest price
              </p>
            )}
          </div>
          <button
            id="comparison-close"
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#6B7280] hover:text-rose-500 hover:bg-rose-50 transition-all mt-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Loading skeleton */}
        {loading ? (
          <div className="space-y-4 py-6">
            <div className="text-center mb-6">
              <Loader2 className="animate-spin text-rose-400 mx-auto mb-3" size={36} />
              <p className="text-xs font-medium text-[#9CA3AF]">Scanning Amazon, Flipkart, Myntra, Ajio & Nykaa…</p>
            </div>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton h-20 rounded-3xl" />
            ))}
          </div>
        ) : error ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-400 mx-auto">
              <X size={24} />
            </div>
            <p className="text-sm text-[#9CA3AF]">{error}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* "Best Deal" callout banner */}
            {comparison?.best_deal && (
              <div
                className="rounded-2xl px-4 py-3 flex items-center gap-3 mb-5"
                style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(5,150,105,0.06))', border: '1px solid rgba(16,185,129,0.2)' }}
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <ShieldCheck size={16} className="text-emerald-500" />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-emerald-600">Best Price Found</p>
                  <p className="text-sm font-bold text-[#1C1917]">
                    ₹{comparison.best_deal.price?.toLocaleString('en-IN')} on{' '}
                    <span style={{ color: getConfig(comparison.best_deal.platform).color }}>
                      {getConfig(comparison.best_deal.platform).label}
                    </span>
                  </p>
                </div>
              </div>
            )}

            {/* Comparison Items */}
            {allItems.map((item, idx) => {
              const cfg = getConfig(item.platform);
              const isBest = item.id === comparison?.best_deal?.id;
              const discountPct = item.original_price
                ? Math.round(((item.original_price - item.price) / item.original_price) * 100)
                : 0;

              return (
                <motion.div
                  key={`${item.platform}-${idx}`}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08, duration: 0.35 }}
                  className={`p-4 rounded-3xl relative transition-all ${isBest ? 'shadow-md' : ''}`}
                  style={isBest
                    ? {
                        background: 'linear-gradient(135deg, rgba(209,250,229,0.5), rgba(255,255,255,0.9))',
                        border: '1.5px solid rgba(16,185,129,0.25)',
                      }
                    : {
                        background: 'rgba(255,241,242,0.4)',
                        border: '1.5px solid rgba(254,205,211,0.3)',
                      }
                  }
                >
                  {/* Best Deal floating badge */}
                  {isBest && (
                    <div
                      className="best-deal-badge absolute -top-3 right-5 px-3 py-1 text-[8px] font-black uppercase tracking-widest text-white rounded-full flex items-center gap-1"
                      style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}
                    >
                      <Sparkles size={8} />
                      Best Price
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    {/* Product Image */}
                    <div
                      className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 border"
                      style={{ background: cfg.bg, borderColor: `${cfg.color}20` }}
                    >
                      <img src={item.image_url} alt={item.platform} className="w-full h-full object-contain p-1" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span
                          className="text-[9px] font-black uppercase tracking-widest"
                          style={{ color: cfg.color }}
                        >
                          {cfg.label}
                        </span>
                        {discountPct > 0 && (
                          <span
                            className="text-[7px] font-black px-2 py-0.5 rounded-full text-white"
                            style={{ background: '#F43F5E' }}
                          >
                            {discountPct}% OFF
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-bold text-[#4B5563] line-clamp-1">{item.brand || item.name}</p>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className={`text-xl font-black ${isBest ? 'text-emerald-600' : 'text-[#1C1917]'}`}>
                          ₹{item.price?.toLocaleString('en-IN')}
                        </span>
                        {item.original_price && (
                          <span className="text-xs text-[#9CA3AF] line-through">
                            ₹{item.original_price?.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* CTA */}
                    <button
                      id={`compare-buy-${item.platform}`}
                      onClick={() => window.open(item.affiliate_link, '_blank')}
                      className={`px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all min-h-[40px] flex items-center gap-1 shrink-0 ${
                        isBest
                          ? 'text-white shadow-sm'
                          : 'bg-white border border-rose-100 text-[#6B7280] hover:border-rose-300 hover:text-rose-500'
                      }`}
                      style={isBest ? { background: '#1C1917' } : {}}
                    >
                      Buy
                      <ExternalLink size={10} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PriceComparison;
