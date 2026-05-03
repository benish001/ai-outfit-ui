import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ShoppingCart,
  Search,
  User as UserIcon,
  Shield,
  LogOut,
  Heart,
  Camera,
  Loader2,
  Sparkles,
  Flower2 as SparkleIcon,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Button from '../../components/ui/Button';

const DOT_KEY_PLATFORM = {
  id: 'dotandkey',
  label: 'DK',
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

/**
 * ProductDiscovery - Dot & Key only catalog with a single global search box.
 */
const ProductDiscovery = ({ onProductSelect, onBack, onAuthClick, onAdminClick }) => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('All');
  const [activeSkinTone] = useState(() => localStorage.getItem('tonewear_skin_tone'));
  const [products, setProducts] = useState([]);
  const [savedIds, setSavedIds] = useState(new Set());
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const observer = useRef();
  const isFetchingRef = useRef(false);
  const isFetchingMore = useRef(false);
  const lastRequestKeyRef = useRef('');

  const fetchProducts = useCallback(async (pageNum, currentTab, isInitial = false) => {
    const requestKey = `${currentTab}-${pageNum}-${searchQuery}`;

    if (isFetchingRef.current) return;
    if (isInitial && lastRequestKeyRef.current === requestKey) return;

    isFetchingRef.current = true;
    if (isInitial) lastRequestKeyRef.current = requestKey;

    if (isInitial) setLoading(true);
    else setLoadingMore(true);

    try {
      let rawData = [];

      if (currentTab === 'Saved') {
        const res = await api.get('/users/saved');
        rawData = res.data || [];
        setHasMore(false);
      } else {
        const res = await api.get('/beauty/products', {
          params: {
            brand: 'dot-key',
            limit: 40,
            page: pageNum + 1,
          },
        });
        rawData = res.data || [];
        setHasMore(rawData.length >= 20);
      }

      const filteredData = rawData
        .filter(isDotAndKeyProduct)
        .filter((product) => matchesSearch(product, searchQuery));

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
    } finally {
      setLoading(false);
      setLoadingMore(false);
      isFetchingRef.current = false;
    }
  }, [searchQuery]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchQuery(searchInput.trim());
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    const initSaved = async () => {
      if (!user) {
        setSavedIds(new Set());
        return;
      }
      try {
        const savedRes = await api.get('/users/saved');
        const dotAndKeySavedIds = (savedRes.data || [])
          .filter(isDotAndKeyProduct)
          .map((p) => p.id);
        setSavedIds(new Set(dotAndKeySavedIds));
      } catch (err) {
        console.error(err);
      }
    };
    initSaved();
  }, [user]);

  useEffect(() => {
    setPage(0);
    setHasMore(true);
    fetchProducts(0, activeTab, true);
  }, [activeTab, searchQuery, fetchProducts]);

  const lastElementRef = useCallback((node) => {
    if (observer.current) observer.current.disconnect();
    if (loading || loadingMore || activeTab === 'Saved' || !hasMore) return;

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !isFetchingMore.current) {
        isFetchingMore.current = true;
        const nextPage = page + 1;
        setPage(nextPage);
        fetchProducts(nextPage, activeTab, false).finally(() => {
          isFetchingMore.current = false;
        });
      }
    }, { rootMargin: '300px', threshold: 0 });

    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore, activeTab, page, fetchProducts]);

  const handleToggleSave = async (e, product) => {
    e.stopPropagation();
    if (!user) {
      onAuthClick();
      return;
    }

    const isSaved = savedIds.has(product.id);
    try {
      if (isSaved) {
        await api.delete(`/users/saved/${product.id}`);
        setSavedIds((prev) => {
          const next = new Set(prev);
          next.delete(product.id);
          return next;
        });
        if (activeTab === 'Saved') {
          setProducts((prev) => prev.filter((p) => p.id !== product.id));
        }
      } else {
        await api.post(`/users/saved/${product.id}`);
        setSavedIds((prev) => new Set(prev).add(product.id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => setShowLogoutModal(true);
  const confirmLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigate('/');
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col pb-24 selection:bg-rose-100 selection:text-[#1C1917]"
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
          <div className="flex items-center gap-3">
            <button
              id="discovery-back"
              onClick={() => (onBack ? onBack() : navigate('/analysis'))}
              className="w-10 h-10 rounded-full flex items-center justify-center text-[#6B7280] hover:text-rose-500 hover:bg-rose-50 transition-all"
            >
              <ChevronLeft size={22} />
            </button>
            {isAdmin && (
              <button
                id="discovery-admin"
                onClick={onAdminClick}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest text-white shadow-sm"
                style={{ background: '#1C1917' }}
              >
                <Shield size={13} />
                Admin
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <Sparkles size={14} className="text-rose-400" />
            <span className="text-sm font-bold luxury-font text-[#1C1917] tracking-tight">
              Tone<span className="italic opacity-40">Wear</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="discovery-rescan"
              onClick={() => navigate('/upload')}
              className="w-10 h-10 bg-white/80 border border-rose-100 rounded-full flex items-center justify-center text-[#6B7280] hover:text-rose-500 hover:border-rose-200 shadow-sm transition-all backdrop-blur-sm"
            >
              <Camera size={17} />
            </button>
            {user ? (
              <button
                id="discovery-logout"
                onClick={handleLogout}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm transition-all"
                style={{ background: '#1C1917' }}
              >
                <LogOut size={15} />
              </button>
            ) : (
              <button
                id="discovery-signin"
                onClick={onAuthClick}
                className="px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest text-white shadow-rose-glow transition-all"
                style={{ background: 'linear-gradient(135deg, #F43F5E, #FB7185)' }}
              >
                Sign In
              </button>
            )}
          </div>
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
        </div>

        {activeSkinTone && (
          <div className="absolute top-4 right-16 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-sm border border-rose-100 z-10">
            <div
              className="w-3.5 h-3.5 rounded-full border border-white shadow-inner"
              style={{ background: { Fair: '#FDDBB4', Medium: '#D4956A', Dark: '#8D5524', Deep: '#4A2010' }[activeSkinTone] || '#FDDBB4' }}
            />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#1C1917]">{activeSkinTone} Match</span>
          </div>
        )}
      </header>

      <main className="flex-1 px-5 md:px-8 pt-52 pb-32 max-w-7xl mx-auto w-full relative z-10">
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
          <TabIcon icon={GridIcon} label="Explore" active={activeTab === 'All'} onClick={() => setActiveTab('All')} />
          <TabIcon icon={Camera} label="Scan" onClick={() => navigate('/upload')} />
          <TabIcon icon={SparkleIcon} label="Beauty" onClick={() => navigate('/beauty')} accent skinTone />
          <TabIcon icon={HeartIcon} label="Saved" active={activeTab === 'Saved'} onClick={() => setActiveTab('Saved')} />
          <TabIcon icon={UserIcon} label="Profile" onClick={user ? handleLogout : onAuthClick} />
        </div>
      </footer>

      <AnimatePresence>
        {showLogoutModal && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-sm rounded-[32px] p-10 space-y-8 text-center"
              style={{
                background: 'rgba(255,255,255,0.92)',
                backdropFilter: 'blur(20px)',
                border: '1.5px solid rgba(254,205,211,0.4)',
                boxShadow: '0 24px 56px rgba(244,63,94,0.12)',
              }}
            >
              <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto border border-rose-100 text-rose-400">
                <LogOut size={28} />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-bold luxury-font text-[#1C1917]">Sign Out?</h3>
                <p className="text-xs text-[#9CA3AF]">Your saved items will remain safe.</p>
              </div>
              <div className="flex flex-col gap-3">
                <Button
                  id="logout-confirm"
                  variant="rose"
                  className="w-full"
                  size="lg"
                  onClick={confirmLogout}
                >
                  Yes, Sign Out
                </Button>
                <button
                  id="logout-cancel"
                  onClick={() => setShowLogoutModal(false)}
                  className="text-[10px] uppercase font-black py-3 text-[#9CA3AF] hover:text-rose-500 transition-colors tracking-widest"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ProductCard = ({ product: p, isSaved, onSelect, onToggleSave }) => {
  const platform = DOT_KEY_PLATFORM;

  return (
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
          style={{ background: platform.color, color: platform.text }}
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
          style={{ background: platform.color, color: platform.text }}
        >
          VIEW DETAILS
        </button>
      </div>
    </div>
  );
};

const TabIcon = ({ icon: Icon, label, active = false, onClick, accent = false, skinTone = false }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-1 min-w-[44px] min-h-[44px] justify-center transition-all ${
      accent
        ? skinTone
          ? 'text-rose-500'
          : 'text-[#FF3F6C]'
        : active
          ? 'text-rose-500'
          : 'text-[#9CA3AF] hover:text-rose-400'
    }`}
  >
    {accent ? (
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center mb-[-2px]"
        style={
          skinTone
            ? { background: 'linear-gradient(135deg, #F43F5E, #EC4899)', boxShadow: '0 3px 10px rgba(244,63,94,0.35)' }
            : { background: 'linear-gradient(135deg, #FF3F6C, #FF7745)', boxShadow: '0 3px 10px rgba(255,63,108,0.35)' }
        }
      >
        <Icon size={16} color="white" />
      </div>
    ) : (
      <Icon size={20} />
    )}
    <span
      className="text-[7px] uppercase font-black tracking-widest"
      style={accent ? { color: skinTone ? '#F43F5E' : '#FF3F6C' } : {}}
    >
      {label}
    </span>
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

export default ProductDiscovery;
