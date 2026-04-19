import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, ExternalLink, Loader2, ShoppingBag,
  Percent, TrendingUp, Sparkles, RefreshCw, Tag, Heart, Search, X,
  Camera, User as UserIcon
} from 'lucide-react';
import api from '../../services/api';

/* ─────────────────────────────────────────────
   Myntra Brand Colors
───────────────────────────────────────────── */
const M_PINK   = '#FF3F6C';
const M_ORANGE = '#FF7745';
const M_DARK   = '#1C1C1C';

/* ─────────────────────────────────────────────
   Categories config (matches backend)
───────────────────────────────────────────── */
const CATEGORIES = [
  { id: 'trending',    emoji: '🔥', label: 'Trending'    },
  { id: 'sale',        emoji: '🏷️', label: 'Sale'        },
  { id: 'women',       emoji: '👗', label: 'Women'       },
  { id: 'men',         emoji: '👔', label: 'Men'         },
  { id: 'dress',       emoji: '💃', label: 'Dresses'     },
  { id: 'tops',        emoji: '👚', label: 'Tops'        },
  { id: 'kurta',       emoji: '🪷', label: 'Kurtas'      },
  { id: 'saree',       emoji: '🌸', label: 'Sarees'      },
  { id: 'jeans',       emoji: '👖', label: 'Jeans'       },
  { id: 'footwear',    emoji: '👠', label: 'Footwear'    },
  { id: 'accessories', emoji: '💍', label: 'Accessories' },
  { id: 'beauty',      emoji: '💄', label: 'Beauty'      },
];

/* category → gradient for placeholder images */
const CATEGORY_GRADIENT = {
  Dress:       ['#FF6B9D', '#FF3F6C'],
  Ethnic:      ['#FF9A56', '#FF6B35'],
  Bottoms:     ['#6B73FF', '#5C6BC0'],
  Tops:        ['#FF8A65', '#FF5722'],
  Footwear:    ['#26C6DA', '#00ACC1'],
  Bags:        ['#AB47BC', '#8E24AA'],
  Accessories: ['#FFD54F', '#FFC107'],
  Saree:       ['#EC407A', '#E91E63'],
  Beauty:      ['#F48FB1', '#F06292'],
  Fashion:     ['#FF3F6C', '#FF7745'],
};

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════════ */
const MyntraDeals = () => {
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState('trending');
  const [products, setProducts]             = useState([]);
  const [loading, setLoading]               = useState(true);
  const [loadingMore, setLoadingMore]       = useState(false);
  const [error, setError]                   = useState(null);
  const [page, setPage]                     = useState(1);
  const [hasMore, setHasMore]               = useState(true);
  const [savedSet, setSavedSet]             = useState(new Set());
  const [searchInput, setSearchInput]       = useState('');
  const [searchQuery, setSearchQuery]       = useState('');
  const [showSearch, setShowSearch]         = useState(false);

  const isFetching  = useRef(false);
  const sentinelRef = useRef(null);

  /* ── Fetch products ─────────────────────────────────────────── */
  const fetchProducts = useCallback(async (cat, kw, pg, isRefresh = false) => {
    if (isFetching.current) return;
    isFetching.current = true;

    if (pg === 1) setLoading(true);
    else          setLoadingMore(true);
    setError(null);

    try {
      const params = { category: cat, limit: 20, page: pg };
      if (kw) params.keyword = kw;
      const res  = await api.get('/affiliate/myntra/products', { params });
      const data = res.data || [];

      setHasMore(data.length >= 20);

      if (isRefresh || pg === 1) {
        setProducts(data);
      } else {
        setProducts(prev => {
          const seen = new Set(prev.map(p => p.affiliate_link));
          return [...prev, ...data.filter(p => !seen.has(p.affiliate_link))];
        });
      }
    } catch (err) {
      console.error('[MyntraDeals]', err);
      setError('Could not load Myntra products. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
      isFetching.current = false;
    }
  }, []);

  /* ── Category / search change ───────────────────────────────── */
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchProducts(activeCategory, searchQuery, 1, true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, searchQuery]);

  /* ── Infinite scroll ────────────────────────────────────────── */
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasMore && !isFetching.current && !loading) {
        const next = page + 1;
        setPage(next);
        fetchProducts(activeCategory, searchQuery, next);
      }
    }, { rootMargin: '400px' });
    obs.observe(node);
    return () => obs.disconnect();
  }, [hasMore, page, activeCategory, searchQuery, fetchProducts, loading]);

  /* ── Toggle saved ───────────────────────────────────────────── */
  const toggleSave = (e, key) => {
    e.stopPropagation();
    setSavedSet(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput.trim());
    setShowSearch(false);
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
  };

  const activeCat = CATEGORIES.find(c => c.id === activeCategory) || CATEGORIES[0];

  /* ════════════════════════════════════════════════════════ RENDER */
  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{ background: 'linear-gradient(160deg, #FFF0F3 0%, #FFFAF8 60%, #FFF5EE 100%)' }}
    >
      {/* Decorative blobs */}
      <div className="fixed -top-28 -right-28 w-96 h-96 rounded-full blur-[120px] z-0 pointer-events-none"
           style={{ background: `${M_PINK}1A` }} />
      <div className="fixed bottom-20 -left-24 w-72 h-72 rounded-full blur-[90px] z-0 pointer-events-none"
           style={{ background: `${M_ORANGE}1A` }} />

      {/* ── STICKY HEADER ──────────────────────────────────────── */}
      <header
        className="fixed top-0 left-0 right-0 z-[120] backdrop-blur-xl"
        style={{
          background: 'rgba(255,240,243,0.95)',
          borderBottom: '1px solid rgba(255,63,108,0.1)',
          boxShadow: '0 4px 20px rgba(255,63,108,0.06)',
        }}
      >
        {/* Navbar */}
        <div className="px-4 py-3 flex items-center gap-3">
          {/* Back */}
          <button
            id="myntra-back"
            onClick={() => navigate('/discovery')}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#6B7280] hover:bg-rose-50 hover:text-[#FF3F6C] transition-all flex-shrink-0"
          >
            <ChevronLeft size={22} />
          </button>

          {/* Brand */}
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div
              className="w-9 h-9 rounded-2xl flex items-center justify-center text-white text-sm font-black shadow flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${M_PINK}, ${M_ORANGE})` }}
            >
              M
            </div>
            <div className="min-w-0">
              <h1 className="text-[15px] font-black leading-none truncate" style={{ color: M_DARK }}>
                Myntra
              </h1>

            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              id="myntra-search-toggle"
              onClick={() => setShowSearch(v => !v)}
              className="w-9 h-9 rounded-full flex items-center justify-center border transition-all hover:text-[#FF3F6C]"
              style={{ borderColor: 'rgba(255,63,108,0.18)', color: '#9CA3AF' }}
            >
              <Search size={15} />
            </button>
            <button
              id="myntra-refresh"
              onClick={() => fetchProducts(activeCategory, searchQuery, 1, true)}
              className="w-9 h-9 rounded-full flex items-center justify-center border transition-all hover:text-[#FF3F6C]"
              style={{ borderColor: 'rgba(255,63,108,0.18)', color: '#9CA3AF' }}
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Collapsible search bar */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <form onSubmit={handleSearch} className="px-4 pb-3 flex items-center gap-2">
                <div className="relative flex-1">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    id="myntra-search-input"
                    autoFocus
                    type="text"
                    placeholder="Search kurta, dress, sneakers…"
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs text-[#1C1C1C] placeholder-[#9CA3AF] bg-white/80 outline-none"
                    style={{ border: '1.5px solid rgba(255,63,108,0.2)' }}
                  />
                  {searchInput && (
                    <button type="button" onClick={() => setSearchInput('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#FF3F6C]">
                      <X size={13} />
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest text-white flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${M_PINK}, ${M_ORANGE})` }}
                >
                  Search
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active search pill */}
        {searchQuery && (
          <div className="px-4 pb-2 flex items-center gap-2">
            <span className="text-[9px] text-[#9CA3AF] uppercase tracking-widest">Results for:</span>
            <button
              onClick={clearSearch}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black text-white"
              style={{ background: `linear-gradient(135deg, ${M_PINK}, ${M_ORANGE})` }}
            >
              "{searchQuery}" <X size={9} />
            </button>
          </div>
        )}

        {/* Category tabs */}
        <div className="flex overflow-x-auto no-scrollbar gap-2 px-4 pb-3.5 touch-pan-x">
          {CATEGORIES.map(cat => {
            const isActive = activeCategory === cat.id && !searchQuery;
            return (
              <button
                key={cat.id}
                id={`myntra-cat-${cat.id}`}
                onClick={() => { setActiveCategory(cat.id); clearSearch(); }}
                className="whitespace-nowrap flex items-center gap-1.5 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border min-h-[36px] transition-all"
                style={isActive ? {
                  background: `linear-gradient(135deg, ${M_PINK}, ${M_ORANGE})`,
                  color: '#fff',
                  borderColor: 'transparent',
                  boxShadow: `0 4px 16px ${M_PINK}40`,
                  transform: 'scale(1.05)',
                } : {
                  backgroundColor: 'rgba(255,255,255,0.8)',
                  color: '#6B7280',
                  borderColor: 'rgba(255,63,108,0.15)',
                }}
              >
                {cat.emoji} {cat.label}
              </button>
            );
          })}
        </div>
      </header>



      {/* ── PRODUCT GRID ─────────────────────────────────────────── */}
      <main className="flex-1 px-4 pb-32 pt-[135px] relative z-10 w-full">



        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 rounded-2xl text-center"
            style={{ background: 'rgba(255,63,108,0.07)', border: '1px solid rgba(255,63,108,0.18)' }}
          >
            <p className="text-xs font-bold mb-2" style={{ color: M_PINK }}>{error}</p>
            <button
              onClick={() => fetchProducts(activeCategory, searchQuery, 1, true)}
              className="text-[9px] uppercase font-black tracking-widest px-5 py-2 rounded-full text-white"
              style={{ background: M_PINK }}
            >
              Retry
            </button>
          </motion.div>
        )}

        {/* Skeleton */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse space-y-2">
                <div className="aspect-[3/4] rounded-3xl" style={{ background: `${M_PINK}18` }} />
                <div className="h-3 rounded-full w-3/4" style={{ background: `${M_PINK}12` }} />
                <div className="h-3 rounded-full w-1/2" style={{ background: `${M_PINK}10` }} />
              </div>
            ))}
          </div>
        )}

        {/* Grid */}
        {!loading && (
          <>
            {products.length > 0 && (
              <p className="text-[8.5px] uppercase font-black tracking-widest text-[#9CA3AF] mb-4">
                {products.length} products · {activeCat.emoji} {activeCat.label}
                {searchQuery && ` · "${searchQuery}"`}
              </p>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              <AnimatePresence mode="popLayout">
                {products.map((product, idx) => (
                  <motion.div
                    key={`${product.affiliate_link}-${idx}`}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.35, delay: idx < 8 ? idx * 0.05 : 0 }}
                  >
                    <ProductCard
                      product={product}
                      isSaved={savedSet.has(product.affiliate_link)}
                      onToggleSave={(e) => toggleSave(e, product.affiliate_link)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Empty state */}
              {products.length === 0 && !loading && (
                <div className="col-span-full py-28 text-center">
                  <div
                    className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 text-white"
                    style={{ background: `linear-gradient(135deg, ${M_PINK}, ${M_ORANGE})` }}
                  >
                    <ShoppingBag size={28} />
                  </div>
                  <h3 className="text-lg font-black" style={{ color: M_DARK }}>No products found</h3>
                  <p className="text-[10px] text-[#9CA3AF] mt-2 uppercase tracking-widest">
                    Try a different category or keyword
                  </p>
                  <button
                    onClick={() => { setActiveCategory('trending'); clearSearch(); }}
                    className="mt-5 px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest text-white"
                    style={{ background: `linear-gradient(135deg, ${M_PINK}, ${M_ORANGE})` }}
                  >
                    Browse Trending
                  </button>
                </div>
              )}
            </div>

            {/* Infinite scroll sentinel */}
            {(hasMore || loadingMore) && products.length > 0 && (
              <div ref={sentinelRef} className="py-14 flex flex-col items-center gap-3">
                {loadingMore ? (
                  <>
                    <Loader2 size={26} className="animate-spin" style={{ color: M_PINK }} />
                    <p className="text-[8.5px] uppercase font-black tracking-widest" style={{ color: M_PINK }}>
                      Loading more…
                    </p>
                  </>
                ) : <div className="h-4" />}
              </div>
            )}
          </>
        )}


      </main>

      {/* ── Sticky Bottom Navigation (Mobile) ── */}
      <footer
        className="md:hidden fixed bottom-0 inset-x-0 z-[300] safe-bottom"
        style={{
          background: 'rgba(255,241,242,0.94)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(254,205,211,0.5)',
          boxShadow: '0 -8px 32px rgba(244,63,94,0.08)',
        }}
      >
        <div className="flex items-center justify-around py-3 max-w-lg mx-auto px-4">
          <TabIcon icon={GridIcon} label="Explore" onClick={() => navigate('/discovery')} />
          <TabIcon icon={Camera} label="Scan" onClick={() => navigate('/upload')} />
          <TabIcon icon={ShoppingBag} label="Myntra" active onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} accent />
          <TabIcon icon={HeartIcon} label="Saved" onClick={() => navigate('/discovery', { state: { tab: 'Saved' } })} />
          <TabIcon icon={UserIcon} label="Profile" onClick={() => navigate('/discovery')} />
        </div>
      </footer>

    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   PRODUCT CARD
═══════════════════════════════════════════════════════════════════════════ */
const ProductCard = ({ product: p, isSaved, onToggleSave }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError]   = useState(false);

  const gradients = CATEGORY_GRADIENT[p.category] || CATEGORY_GRADIENT.Fashion;

  const handleShop = (e) => {
    e.stopPropagation();
    if (p.affiliate_link && p.affiliate_link !== '#') {
      window.open(p.affiliate_link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      className="flex flex-col rounded-3xl overflow-hidden group transition-all duration-300 hover:scale-[1.025] hover:shadow-xl active:scale-[0.97]"
      style={{
        background: 'rgba(255,255,255,0.94)',
        border: '1px solid rgba(255,63,108,0.10)',
        boxShadow: '0 4px 18px rgba(255,63,108,0.06)',
      }}
    >
      {/* Image area */}
      <div
        className="aspect-[3/4] relative overflow-hidden"
        style={{ background: imgError || !imgLoaded
          ? `linear-gradient(160deg, ${gradients[0]}22, ${gradients[1]}18)`
          : 'rgba(255,240,243,0.5)'
        }}
      >
        {/* Gradient placeholder (always rendered, hidden once image loads) */}
        {(!imgLoaded || imgError) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2"
               style={{ background: `linear-gradient(160deg, ${gradients[0]}22, ${gradients[1]}18)` }}>
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl"
              style={{ background: `linear-gradient(135deg, ${gradients[0]}, ${gradients[1]})`, boxShadow: `0 4px 16px ${gradients[0]}40` }}
            >
              {CATEGORIES.find(c => p.category?.toLowerCase().includes(c.label?.toLowerCase().slice(0,4)))?.emoji || '🛍️'}
            </div>
            <p className="text-[8px] font-bold uppercase tracking-widest" style={{ color: gradients[0] }}>
              {p.category}
            </p>
          </div>
        )}

        {!imgError && (
          <img
            src={p.image_url}
            alt={p.name}
            className={`absolute inset-0 w-full h-full object-contain p-3 group-hover:scale-105 transition-all duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
          />
        )}

        {/* Discount badge */}
        {p.discount_percent && (
          <div
            className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg text-[8px] font-black text-white z-10"
            style={{ background: `linear-gradient(135deg, ${M_PINK}, ${M_ORANGE})` }}
          >
            {p.discount_percent}% OFF
          </div>
        )}

        {/* Save button */}
        <button
          onClick={onToggleSave}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center border transition-all z-10"
          style={isSaved ? {
            background: M_PINK, borderColor: M_PINK, color: '#fff',
          } : {
            background: 'rgba(255,255,255,0.88)', borderColor: 'rgba(255,63,108,0.2)', color: M_PINK,
          }}
        >
          <Heart size={14} fill={isSaved ? 'currentColor' : 'none'} />
        </button>

        {/* Myntra badge */}
        <div
          className="absolute bottom-2.5 left-2.5 flex items-center gap-1 px-2 py-1 rounded-lg text-white text-[7px] font-black uppercase tracking-wider z-10"
          style={{ background: M_PINK }}
        >
          <ShoppingBag size={7} /> Myntra
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1.5">
        <p className="text-[7px] font-black uppercase tracking-[0.2em]" style={{ color: M_PINK }}>
          {p.brand}
        </p>
        <h3
          className="text-[11px] font-bold leading-snug line-clamp-2"
          style={{ color: M_DARK, minHeight: '2.4em' }}
        >
          {p.name}
        </h3>
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-black" style={{ color: M_DARK }}>
            ₹{Number(p.price).toLocaleString('en-IN')}
          </span>
          {p.original_price && (
            <span className="text-[10px] line-through text-[#B0B0B0]">
              ₹{Number(p.original_price).toLocaleString('en-IN')}
            </span>
          )}
        </div>



        {/* CTA */}
        <button
          id={`myntra-shop-${encodeURIComponent(p.name || '').slice(0, 16)}`}
          onClick={handleShop}
          className="w-full mt-0.5 py-2.5 rounded-xl text-[8.5px] font-black uppercase tracking-[0.12em] text-white flex items-center justify-center gap-1.5 transition-all hover:opacity-90 active:scale-95"
          style={{ background: `linear-gradient(135deg, ${M_PINK}, ${M_ORANGE})` }}
        >
          <ExternalLink size={9} />
          Shop on Myntra
        </button>
      </div>
    </div>
  );
};

export default MyntraDeals;

/* ── Tab Icons ── */
const TabIcon = ({ icon: Icon, label, active = false, onClick, accent = false }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-1 min-w-[44px] min-h-[44px] justify-center transition-all ${accent
        ? 'text-[#FF3F6C]'
        : active
          ? 'text-rose-500'
          : 'text-[#9CA3AF] hover:text-rose-400'
      }`}
  >
    {accent ? (
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center mb-[-2px]"
        style={{ background: 'linear-gradient(135deg, #FF3F6C, #FF7745)', boxShadow: '0 3px 10px rgba(255,63,108,0.35)' }}
      >
        <Icon size={16} color="white" />
      </div>
    ) : (
      <Icon size={20} />
    )}
    <span
      className="text-[7px] uppercase font-black tracking-widest"
      style={accent ? { color: '#FF3F6C' } : {}}
    >{label}</span>
  </button>
);

const GridIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
  </svg>
);

const HeartIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
