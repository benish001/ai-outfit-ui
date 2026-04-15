import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, Star, ShoppingCart, ExternalLink,
  User as UserIcon, Shield, LogOut, Heart, Camera, Loader2, Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Button from '../../components/ui/Button';

/**
 * ProductDiscovery — Mobile-first product grid with pink-gradient theme.
 * Fixed header + horizontal tab scroll + infinite load + sticky bottom nav.
 */
const ProductDiscovery = ({ gender: onboardingGender, onProductSelect, onBack, onAuthClick, onAdminClick }) => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('All');
  const [products, setProducts] = useState([]);
  const [dynamicTabs, setDynamicTabs] = useState([]);
  const [savedIds, setSavedIds] = useState(new Set());

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const observer = useRef();

  const profileData = React.useMemo(() => {
    const onboarding = JSON.parse(localStorage.getItem('analysisResult') || '{}');
    const gender = onboardingGender || localStorage.getItem('tonewear_gender') || onboarding.gender || 'Female';
    const colors = onboarding.recommendations?.colors_to_wear || [];
    return {
      gender: gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase(),
      colors,
    };
  }, [onboardingGender]);

  const isFetchingRef = useRef(false);
  const fetchProducts = useCallback(async (pageNum, currentTab, isInitial = false) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    
    if (isInitial) setLoading(true);
    else setLoadingMore(true);
    try {
      let res;
      if (currentTab === 'Saved') {
        res = await api.get('/users/saved');
        setHasMore(false);
      } else {
        const params = { gender: profileData.gender, skip: pageNum * 40, limit: 40 };
        if (currentTab !== 'All') params.category = currentTab;
        if (profileData.colors.length > 0) params.colors = profileData.colors.join(',');
        res = await api.get('/outfits/trending', { params });
        setHasMore(res.data.length >= 10);
      }
      if (isInitial) setProducts(res.data);
      else {
        setProducts(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const newItems = res.data.filter(p => !existingIds.has(p.id));
          return [...prev, ...newItems];
        });
      }
    } catch (err) {
      console.error('Fetch failed', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      isFetchingRef.current = false;
    }
  }, [profileData]);

  const globalInitRef = useRef(false);
  useEffect(() => {
    if (globalInitRef.current) return;
    const init = async () => {
      try {
        const [catRes, savedRes] = await Promise.all([
          api.get('/admin/categories'),
          user ? api.get('/users/saved') : Promise.resolve({ data: [] }),
        ]);
        const priority = ['Casual Wear', 'Formal Wear', 'Party Wear', 'Footwear', 'Accessories', 'Beauty Product'];
        const dbCategories = catRes.data || [];
        const combined = Array.from(new Set([...priority, ...dbCategories]));
        const sorted = combined
          .filter(c => priority.includes(c))
          .sort((a, b) => priority.indexOf(a) - priority.indexOf(b));

        setDynamicTabs(['All', ...sorted, 'Saved']);
        if (user) setSavedIds(new Set(savedRes.data.map(p => p.id)));
        globalInitRef.current = true;
      } catch (e) { console.error(e); }
    };
    init();
  }, [user]);

  const lastTabRef = useRef(null);
  useEffect(() => {
    if (lastTabRef.current === activeTab) {
      setLoading(false); // Fix: Turn off loading if we already have the data
      return;
    }
    setPage(0);
    setHasMore(true);
    fetchProducts(0, activeTab, true);
    lastTabRef.current = activeTab;
  }, [activeTab, fetchProducts]);

  const isFetchingMore = useRef(false);
  const lastElementRef = useCallback(node => {
    if (observer.current) observer.current.disconnect();
    if (loading || loadingMore || activeTab === 'Saved' || !hasMore) return;

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !isFetchingMore.current) {
        isFetchingMore.current = true;
        setPage(prev => {
          const next = prev + 1;
          fetchProducts(next, activeTab).finally(() => {
            isFetchingMore.current = false;
          });
          return next;
        });
      }
    }, { rootMargin: '600px', threshold: 0.1 });
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore, fetchProducts, activeTab]);

  const handleToggleSave = async (e, product) => {
    e.stopPropagation();
    if (!user) { onAuthClick(); return; }
    const isSaved = savedIds.has(product.id);
    try {
      if (isSaved) {
        await api.delete(`/users/saved/${product.id}`);
        setSavedIds(prev => { const n = new Set(prev); n.delete(product.id); return n; });
        if (activeTab === 'Saved') setProducts(prev => prev.filter(p => p.id !== product.id));
      } else {
        await api.post(`/users/saved/${product.id}`);
        setSavedIds(prev => new Set(prev).add(product.id));
      }
    } catch (err) { console.error(err); }
  };

  const handleLogout = () => setShowLogoutModal(true);
  const confirmLogout = () => { logout(); setShowLogoutModal(false); navigate('/'); };

  const isFlipkart = (link) => link?.includes('flipkart.com');

  return (
    <div
      className="min-h-screen w-full flex flex-col pb-24 selection:bg-rose-100 selection:text-[#1C1917]"
      style={{ background: 'linear-gradient(135deg, #FFF1F2 0%, #FFF5F7 50%, #FFF7F0 100%)' }}
    >
      {/* Background depth blobs */}
      <div className="fixed -top-20 -right-20 w-72 h-72 rounded-full bg-rose-100/50 blur-[90px] pointer-events-none z-0" />
      <div className="fixed bottom-24 -left-16 w-64 h-64 rounded-full bg-pink-100/40 blur-[80px] pointer-events-none z-0" />

      {/* ── Fixed Header ── */}
      <header
        className="fixed top-0 left-0 right-0 z-[100] backdrop-blur-xl"
        style={{
          background: 'rgba(255,241,242,0.88)',
          borderBottom: '1px solid rgba(254,205,211,0.35)',
          boxShadow: '0 1px 16px rgba(244,63,94,0.06)',
        }}
      >
        {/* Top Navbar */}
        <nav className="px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              id="discovery-back"
              onClick={() => navigate('/analysis')}
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

          {/* Logo mark */}
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

        {/* Category Tabs */}
        <div className="flex overflow-x-auto no-scrollbar pb-3.5 pt-0.5 px-5 gap-2 touch-pan-x">
          {dynamicTabs.map(tab => (
            <button
              key={tab}
              id={`tab-${tab.toLowerCase().replace(' ', '-')}`}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border min-h-[38px] ${
                activeTab === tab
                  ? 'text-white border-transparent shadow-md scale-105'
                  : 'bg-white/70 text-[#6B7280] border-rose-100 hover:border-rose-200 hover:text-rose-500'
              }`}
              style={activeTab === tab
                ? { background: 'linear-gradient(135deg, #F43F5E, #FB7185)', boxShadow: '0 4px 16px rgba(244,63,94,0.30)' }
                : {}
              }
            >
              {tab}
            </button>
          ))}
          <div className="min-w-[20px] shrink-0" />
        </div>
      </header>

      {/* ── Main Product Grid ── */}
      <main className="flex-1 px-5 md:px-8 pt-40 pb-20 max-w-7xl mx-auto w-full relative z-10">
        <header className="mb-8 md:mb-12">
          <p className="text-[9px] uppercase font-black tracking-[0.4em] text-rose-400 mb-1.5">
            Neural Curations
          </p>
          <h2 className="text-3xl md:text-5xl font-black luxury-font leading-tight text-[#1C1917]">
            {activeTab === 'Saved' ? 'Your Saved' : 'Personalised'}&nbsp;
            <span className="italic text-rose-400">
              {activeTab === 'Saved' ? 'Vault.' : 'Looks.'}
            </span>
          </h2>
        </header>

        {/* Skeleton Loader */}
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

            {/* Empty State */}
            {products.length === 0 && !loading && (
              <div className="col-span-full py-32 text-center">
                <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-300 mx-auto mb-5">
                  <ShoppingCart size={28} />
                </div>
                <h3 className="text-xl font-bold luxury-font text-[#1C1917]">Collection Empty</h3>
                <p className="text-xs text-[#9CA3AF] uppercase tracking-widest mt-2 leading-loose">
                  Items matching your profile will appear here.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Infinite scroll trigger */}
        {(loadingMore || hasMore) && (
          <div ref={lastElementRef} className="py-16 flex flex-col items-center justify-center gap-3">
            {loadingMore ? (
              <>
                <Loader2 className="animate-spin text-rose-400" size={28} />
                <p className="text-[9px] uppercase font-black tracking-[0.2em] text-rose-300">
                  Loading more looks…
                </p>
              </>
            ) : (
              <div className="h-8 w-full" />
            )}
          </div>
        )}
      </main>

      {/* ── Sticky Bottom Navigation (Mobile) ── */}
      <div
        className="md:hidden fixed bottom-0 inset-x-0 z-[300] safe-bottom"
        style={{
          background: 'rgba(255,241,242,0.90)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(254,205,211,0.4)',
          boxShadow: '0 -4px 20px rgba(244,63,94,0.07)',
        }}
      >
        <div className="flex items-center justify-around h-[68px] max-w-lg mx-auto px-4">
          <TabIcon icon={GridIcon} label="Explore" active={activeTab === 'All'} onClick={() => setActiveTab('All')} />
          <TabIcon icon={Camera} label="Scan" onClick={() => navigate('/upload')} />
          <TabIcon icon={HeartIcon} label="Saved" active={activeTab === 'Saved'} onClick={() => setActiveTab('Saved')} />
          <TabIcon icon={UserIcon} label="Profile" onClick={user ? handleLogout : onAuthClick} />
        </div>
      </div>

      {/* ── Logout Modal ── */}
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

/* ── Platform Profiles ── */
const PLATFORMS = [
  { id: 'amazon',   label: 'A', color: '#FB7185', text: '#fff',    match: 'amazon.in' },
  { id: 'flipkart', label: 'F', color: '#2874F0', text: '#fff',    match: 'flipkart.com' },
  { id: 'myntra',   label: 'M', color: '#FF3F6C', text: '#fff',    match: 'myntra.com' },
  { id: 'ajio',     label: 'A', color: '#1C1C1C', text: '#fff',    match: 'ajio.com' },
  { id: 'nykaa',    label: 'N', color: '#FC2779', text: '#fff',    match: 'nykaa.com' },
];

const detectPlatform = (link) => {
  if (!link) return PLATFORMS[0]; // Default to Amazon
  const l = link.toLowerCase();
  return PLATFORMS.find(p => l.includes(p.match)) || PLATFORMS[0];
};

/* ── Product Card ── */
const ProductCard = ({ product: p, isSaved, onSelect, onToggleSave }) => {
  const platform = detectPlatform(p.affiliate_link);

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

        {/* Heart */}
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

        {/* Platform tag */}
        <div
          className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-1 rounded-lg text-[7px] font-black uppercase tracking-wider shadow-sm"
          style={{ background: platform.color, color: platform.text }}
        >
          <ShoppingCart size={8} />
          {platform.id === 'amazon' ? 'Amazon' :
           platform.id === 'flipkart' ? 'Flipkart' :
           platform.id === 'myntra' ? 'Myntra' :
           platform.id === 'ajio' ? 'AJIO' : 'Nykaa'}
        </div>
      </div>

      {/* ── Info ── */}
      <div className="p-3 flex flex-col gap-2">

        {/* Brand */}
        <p className="text-[7px] font-black uppercase tracking-[0.2em] text-rose-400 leading-none">{p.brand}</p>

        {/* Name — clamp to exactly 2 lines for alignment */}
        <h3 className="text-[11px] md:text-xs font-bold text-[#1C1917] line-clamp-2 leading-snug luxury-font" style={{ minHeight: '2.5em' }}>
          {p.name}
        </h3>

        {/* Price + Category */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-black text-[#1C1917]">₹{Number(p.price).toLocaleString('en-IN')}</span>
          <span className="text-[7px] font-bold uppercase tracking-wide text-[#9CA3AF]">{p.category}</span>
        </div>

        {/* Also on strip - Dynamic */}
        {p.other_platforms && p.other_platforms.length > 0 && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[6px] font-bold uppercase tracking-wider text-[#9CA3AF]">Also on</span>
            {PLATFORMS.filter(pl => p.other_platforms.includes(pl.id)).map(pl => (
              <div
                key={pl.id}
                className="w-3.5 h-3.5 rounded-[3px] flex items-center justify-center text-[5px] font-black"
                style={{ background: pl.color, color: pl.text }}
              >
                {pl.label}
              </div>
            ))}
          </div>
        )}

        {/* VIEW CTA */}
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


/* ── Tab Icons ── */
const TabIcon = ({ icon: Icon, label, active = false, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-1 min-w-[48px] min-h-[44px] justify-center transition-all ${
      active ? 'text-rose-500' : 'text-[#9CA3AF] hover:text-rose-400'
    }`}
  >
    <Icon size={20} />
    <span className="text-[8px] uppercase font-black tracking-widest">{label}</span>
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
