import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ShoppingCart,
  Search,
  Heart,
  Camera,
  Loader2,
  Sparkles,
} from 'lucide-react';
import api from '../../services/api';

const DOT_KEY_PLATFORM = {
  color: '#22C55E',
  text: '#fff',
};

const isDotAndKeyProduct = (product) => {
  const link = (product?.affiliate_link || '').toLowerCase();
  const brand = (product?.brand || '').toLowerCase();
  const platform = (product?.platform || '').toLowerCase();
  return (
    link.includes('dotandkey') ||
    brand.includes('dot & key') ||
    brand.includes('dot and key') ||
    brand.includes('dot-key') ||
    platform.includes('dot')
  );
};

const matchesSearch = (product, query) => {
  if (!query) return true;
  const q = query.toLowerCase();
  const searchable = `${product?.name || ''} ${product?.brand || ''} ${product?.category || ''}`.toLowerCase();
  return searchable.includes(q);
};

const TONE_KEYWORDS = {
  Fair: ['ivory', 'porcelain', 'fair', 'light', 'vanilla'],
  Medium: ['medium', 'beige', 'sand', 'honey', 'natural'],
  Dark: ['dark', 'caramel', 'toffee', 'warm', 'tan'],
  Deep: ['deep', 'espresso', 'mahogany', 'ebony', 'rich'],
};

const SKIN_TYPE_KEYWORDS = {
  normal: ['daily', 'all skin', 'all-skin', 'hydrating', 'brightening', 'lightweight'],
  oily: ['oil control', 'oil-free', 'matte', 'acne', 'salicylic', 'niacinamide', 'pore', 'sebum', 'gel'],
  dry: ['hydrating', 'moisturizer', 'moisturising', 'ceramide', 'hyaluronic', 'barrier', 'repair', 'cream', 'nourish'],
  combination: ['balance', 'balancing', 'lightweight', 'daily', 'gel cream', 'water cream', 'moisturizer'],
  sensitive: ['sensitive', 'soothing', 'gentle', 'fragrance free', 'cica', 'centella', 'barrier', 'calming'],
};

const matchesTone = (product, tone) => {
  if (!tone) return true;
  const text = `${product?.name || ''} ${product?.short_name || ''}`.toLowerCase();
  const keywords = TONE_KEYWORDS[tone] || [];
  if (keywords.length === 0) return true;
  return keywords.some((keyword) => text.includes(keyword));
};

const matchesSkinType = (product, skinType) => {
  if (!skinType) return true;
  const text = `${product?.name || ''} ${product?.short_name || ''}`.toLowerCase();
  const keywords = SKIN_TYPE_KEYWORDS[skinType] || [];
  if (keywords.length === 0) return true;
  return keywords.some((keyword) => text.includes(keyword));
};

const ProductDiscovery = ({ onProductSelect, onBack }) => {
  const navigate = useNavigate();

  const [activeSkinTone] = useState(() => localStorage.getItem('beauty_skin_tone') || localStorage.getItem('tonewear_skin_tone'));
  const [activeSkinType] = useState(() => localStorage.getItem('beauty_skin_type') || 'normal');
  const [products, setProducts] = useState([]);
  const [savedIds, setSavedIds] = useState(new Set());
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const observer = useRef();
  const isFetchingRef = useRef(false);
  const isFetchingMore = useRef(false);
  const lastRequestKeyRef = useRef('');

  const fetchProducts = useCallback(async (pageNum, isInitial = false) => {
    const requestKey = `${pageNum}-${searchQuery}-${activeSkinTone || 'none'}-${activeSkinType || 'none'}`;

    if (isFetchingRef.current) return;
    if (isInitial && lastRequestKeyRef.current === requestKey) return;

    isFetchingRef.current = true;
    if (isInitial) {
      lastRequestKeyRef.current = requestKey;
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const res = await api.get('/beauty/products', {
        params: {
          brand: 'dot-key',
          limit: 40,
          page: pageNum + 1,
          skin_tone: activeSkinTone || undefined,
          skin_type: activeSkinType || undefined,
          search: searchQuery || undefined,
        },
      });

      const rawData = res.data || [];
      setHasMore(rawData.length >= 40);

      const dotAndKeyData = rawData
        .filter(isDotAndKeyProduct)
        .filter((product) => matchesSearch(product, searchQuery));

      const matchedData = dotAndKeyData.filter(
        (product) => matchesTone(product, activeSkinTone) && matchesSkinType(product, activeSkinType)
      );
      const filteredData = matchedData.length > 0 ? matchedData : dotAndKeyData;

      filteredData.sort((a, b) => {
        const aScore = Number(matchesTone(a, activeSkinTone)) + Number(matchesSkinType(a, activeSkinType));
        const bScore = Number(matchesTone(b, activeSkinTone)) + Number(matchesSkinType(b, activeSkinType));
        return bScore - aScore;
      });

      if (isInitial) {
        setProducts(filteredData);
      } else {
        setProducts((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const newItems = filteredData.filter((p) => !existingIds.has(p.id));
          return newItems.length > 0 ? [...prev, ...newItems] : prev;
        });
      }
    } catch (err) {
      console.error('Fetch failed', err);
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      isFetchingRef.current = false;
    }
  }, [searchQuery, activeSkinTone, activeSkinType]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchQuery(searchInput.trim());
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    setPage(0);
    setHasMore(true);
    fetchProducts(0, true);
  }, [searchQuery, activeSkinTone, activeSkinType, fetchProducts]);

  const lastElementRef = useCallback((node) => {
    if (observer.current) observer.current.disconnect();
    if (loading || loadingMore || !hasMore) return;

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !isFetchingMore.current) {
        isFetchingMore.current = true;
        const nextPage = page + 1;
        setPage(nextPage);
        fetchProducts(nextPage, false).finally(() => {
          isFetchingMore.current = false;
        });
      }
    }, { rootMargin: '300px', threshold: 0 });

    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore, page, fetchProducts]);

  const handleToggleSave = (e, product) => {
    e.stopPropagation();
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(product.id)) next.delete(product.id);
      else next.add(product.id);
      return next;
    });
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col pb-16 selection:bg-rose-100 selection:text-[#1C1917]"
      style={{ background: 'linear-gradient(135deg, #FFF1F2 0%, #FFF5F7 50%, #FFF7F0 100%)' }}
    >
      <div className="fixed -top-20 -right-20 w-72 h-72 rounded-full bg-rose-100/50 blur-[90px] pointer-events-none z-0" />
      <div className="fixed bottom-24 -left-16 w-64 h-64 rounded-full bg-pink-100/40 blur-[80px] pointer-events-none z-0" />

      <header
        className="fixed top-0 left-0 right-0 z-[100] backdrop-blur-xl"
        style={{
          background: 'rgba(255,241,242,0.88)',
          borderBottom: '1px solid rgba(254,205,211,0.35)',
          boxShadow: '0 1px 16px rgba(244,63,94,0.06)',
        }}
      >
        <nav className="px-5 py-3.5 flex items-center justify-between">
          <button
            id="discovery-back"
            onClick={() => (onBack ? onBack() : navigate('/analysis'))}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#6B7280] hover:text-rose-500 hover:bg-rose-50 transition-all"
          >
            <ChevronLeft size={22} />
          </button>

          <div className="flex items-center gap-1.5">
            <Sparkles size={14} className="text-rose-400" />
            <span className="text-sm font-bold luxury-font text-[#1C1917] tracking-tight">
              Dot & Key <span className="italic opacity-50">Beauty</span>
            </span>
          </div>

          <button
            id="discovery-rescan"
            onClick={() => navigate('/upload')}
            className="w-10 h-10 bg-white/80 border border-rose-100 rounded-full flex items-center justify-center text-[#6B7280] hover:text-rose-500 hover:border-rose-200 shadow-sm transition-all backdrop-blur-sm"
          >
            <Camera size={17} />
          </button>
        </nav>

        <div className="px-5 pb-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-300" />
            <input
              id="discovery-search"
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search Dot & Key products"
              className="w-full h-11 rounded-2xl border border-rose-100 bg-white/90 pl-10 pr-4 text-sm text-[#1C1917] placeholder:text-rose-300 focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
            />
          </div>
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            {activeSkinTone && (
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-sm border border-rose-100">
                <div
                  className="w-3.5 h-3.5 rounded-full border border-white shadow-inner"
                  style={{ background: { Fair: '#FDDBB4', Medium: '#D4956A', Dark: '#8D5524', Deep: '#4A2010' }[activeSkinTone] || '#FDDBB4' }}
                />
                <span className="text-[10px] font-black uppercase tracking-widest text-[#1C1917]">{activeSkinTone} Tone</span>
              </div>
            )}
            <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-sm border border-rose-100">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#1C1917]">{activeSkinType} Skin</span>
            </div>
            <button
              onClick={() => navigate('/skin-type')}
              className="px-3 py-1.5 rounded-2xl border border-rose-100 bg-white/90 text-[10px] font-black uppercase tracking-widest text-rose-400 hover:text-rose-500"
            >
              Change
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 px-5 md:px-8 pt-56 pb-16 max-w-7xl mx-auto w-full relative z-10">
        {loading && page === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="skeleton aspect-[3/4] rounded-3xl" />
                <div className="skeleton h-4 rounded-full w-3/4" />
                <div className="skeleton h-3 rounded-full w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            <AnimatePresence mode="popLayout">
              {products.map((p, idx) => (
                <motion.div
                  key={`${p.id}-${idx}`}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.45, ease: 'easeOut', delay: idx < 12 ? idx * 0.03 : 0 }}
                >
                  <ProductCard
                    product={p}
                    isSaved={savedIds.has(p.id)}
                    onSelect={() => onProductSelect(p)}
                    onToggleSave={(e) => handleToggleSave(e, p)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            {products.length === 0 && !loading && (
              <div className="col-span-full py-32 text-center">
                <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-300 mx-auto mb-5">
                  <ShoppingCart size={28} />
                </div>
                <h3 className="text-xl font-bold luxury-font text-[#1C1917]">No Dot & Key Products Found</h3>
                <p className="text-xs text-[#9CA3AF] uppercase tracking-widest mt-2 leading-loose">
                  Try another search keyword.
                </p>
              </div>
            )}
          </div>
        )}

        {(loadingMore || hasMore) && (
          <div ref={lastElementRef} className="py-16 flex flex-col items-center justify-center gap-3">
            {loadingMore ? (
              <>
                <Loader2 className="animate-spin text-rose-400" size={28} />
                <p className="text-[9px] uppercase font-black tracking-[0.2em] text-rose-300">
                  Loading more products...
                </p>
              </>
            ) : (
              <div className="h-8 w-full" />
            )}
          </div>
        )}
      </main>
    </div>
  );
};

const ProductCard = ({ product: p, isSaved, onSelect, onToggleSave }) => (
  <div
    className="group flex flex-col cursor-pointer rounded-3xl overflow-hidden transition-all duration-400 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
    onClick={onSelect}
    style={{
      background: 'rgba(255,255,255,0.92)',
      border: '1px solid rgba(254,205,211,0.3)',
      boxShadow: '0 4px 20px rgba(244,63,94,0.06)',
    }}
  >
    <div className="aspect-[3/4] w-full overflow-hidden relative" style={{ background: 'rgba(255,241,242,0.5)' }}>
      <img
        src={p.image_url}
        alt={p.name}
        className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-600"
        loading="lazy"
      />

      <button
        id={`save-${p.id}`}
        onClick={onToggleSave}
        className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
          isSaved
            ? 'bg-rose-500 border-rose-500 text-white'
            : 'bg-white/80 border-rose-100 text-rose-300 hover:text-rose-500 backdrop-blur-sm'
        }`}
      >
        <Heart size={14} fill={isSaved ? 'currentColor' : 'none'} />
      </button>

      <div
        className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-1 rounded-lg text-[7px] font-black uppercase tracking-wider shadow-sm"
        style={{ background: DOT_KEY_PLATFORM.color, color: DOT_KEY_PLATFORM.text }}
      >
        <ShoppingCart size={8} />
        <ShoppingCart size={8} />
        Dot & Key
      </div>
    </div>

    <div className="p-3 flex flex-col gap-2">
      <p className="text-[7px] font-black uppercase tracking-[0.2em] text-rose-400 leading-none">DOT & KEY</p>

      <h3 className="text-[11px] md:text-xs font-bold text-[#1C1917] line-clamp-2 leading-snug luxury-font" style={{ minHeight: '2.5em' }}>
        {p.name}
      </h3>

      <div className="flex items-center justify-between">
        <span className="text-sm font-black text-[#1C1917]">Rs {Number(p.price).toLocaleString('en-IN')}</span>
        <span className="text-[7px] font-bold uppercase tracking-wide text-[#9CA3AF]">{p.category}</span>
      </div>

      <button
        id={`view-${p.id}`}
        className="w-full flex items-center justify-center gap-1 mt-auto py-2 rounded-lg text-[8px] font-black uppercase tracking-[0.1em] transition-all hover:opacity-90 active:scale-[0.95] shadow-sm"
        style={{ background: DOT_KEY_PLATFORM.color, color: DOT_KEY_PLATFORM.text }}
      >
        VIEW DETAILS
      </button>
    </div>
  </div>
);

export default ProductDiscovery;
