/**
 * BeautyShop.jsx
 * Premium Skin-tone based beauty discovery engine.
 * Powered by REAL product fetching from Myntra, Nykaa, and Ajio.
 * Earns via vCommission affiliate tracking.
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBeautyOrders } from '../../hooks/useBeautyOrders';
import { Loader2, ExternalLink } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8001/api/v1';

// ─── Constants ────────────────────────────────────────────────────────────────
const SKIN_TONES = [
  { id: 'Fair',   label: 'Fair',   hex: '#FDDBB4', subtext: 'Ivory · Porcelain' },
  { id: 'Medium', label: 'Medium', hex: '#D4956A', subtext: 'Beige · Honey' },
  { id: 'Dark',   label: 'Dark',   hex: '#8D5524', subtext: 'Caramel · Toffee' },
  { id: 'Deep',   label: 'Deep',   hex: '#4A2010', subtext: 'Espresso · Mahogany' },
];

const CATEGORIES = [
  { id: 'all',      label: 'All',      emoji: '✨' },
  { id: 'lips',     label: 'Lips',     emoji: '💄' },
  { id: 'face',     label: 'Face',     emoji: '💅' },
  { id: 'eyes',     label: 'Eyes',     emoji: '👁️' },
  { id: 'skincare', label: 'Skincare', emoji: '🌿' },
  { id: 'kits',     label: 'Kits',     emoji: '🎁' },
];

const BRANDS = [
  { id: 'all',          label: 'All Brands',   color: '#F43F5E' },
  { id: 'swiss-beauty', label: 'Swiss Beauty', color: '#E91E8C' },
  { id: 'dot-key',      label: 'Dot & Key',    color: '#22C55E' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="rounded-3xl overflow-hidden bg-white/70 shadow-sm p-1">
      <div className="skeleton w-full aspect-[4/5] rounded-2xl" />
      <div className="p-3 space-y-2">
        <div className="skeleton h-3 w-1/3 rounded-full" />
        <div className="skeleton h-4 w-3/4 rounded-full" />
        <div className="skeleton h-9 w-full rounded-xl" />
      </div>
    </div>
  );
}

function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-[3000] px-6 py-3.5 rounded-2xl shadow-xl text-white text-sm font-bold flex items-center gap-2.5 backdrop-blur-md ${
        type === 'success' ? 'bg-emerald-500/90' :
        type === 'cancel'  ? 'bg-rose-500/90' :
        'bg-stone-800/90'
      }`}
    >
      {type === 'success' ? '🛍️' : type === 'cancel' ? '❌' : 'ℹ️'}
      {message}
    </motion.div>
  );
}

function ProductCard({ product, skinTone, onOrder, isOrdered }) {
  const [imgErr, setImgErr] = useState(false);
  const [busy, setBusy]     = useState(false);

  const discountLabel = product.discount_pct
    ? `${product.discount_pct}% OFF`
    : null;

  const handleOrder = async (e) => {
    e.stopPropagation();
    setBusy(true);
    await onOrder(product);
    setBusy(false);
  };

  const brandColor = product.brand === 'Swiss Beauty' ? '#E91E8C' : '#22C55E';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileTap={{ scale: 0.98 }}
      className="group relative flex flex-col bg-white rounded-[32px] overflow-hidden shadow-card border border-rose-50 p-1.5 transition-all hover:shadow-xl"
    >
      <div className="relative aspect-[4/5] rounded-[26px] overflow-hidden bg-rose-50/30">
        {!imgErr && product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-contain p-2 transition-transform duration-700 group-hover:scale-110"
            onError={() => setImgErr(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl bg-stone-50">
            {product.category === 'lips' ? '💄' :
             product.category === 'face' ? '💅' :
             product.category === 'eyes' ? '👁️' :
             product.category === 'skincare' ? '🌿' : '🎁'}
          </div>
        )}

        {discountLabel && (
          <div className="absolute top-3 left-3 bg-rose-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm z-10">
            {discountLabel}
          </div>
        )}

        {skinTone && product.skin_tone_match && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[9px] font-black px-2 py-1 rounded-full text-emerald-600 border border-emerald-100 shadow-sm z-10 flex items-center gap-1">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
             MATCH
          </div>
        )}
        
        {isOrdered && (
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center z-20">
            <motion.div 
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              className="bg-white/95 text-emerald-600 text-[10px] font-black px-4 py-2 rounded-full shadow-lg border border-emerald-100"
            >
              ✓ ORDERED
            </motion.div>
          </div>
        )}
      </div>

      <div className="p-3.5 flex flex-col gap-1.5 flex-1">
        <div className="flex items-center justify-between">
           <span className="text-[8px] font-black uppercase tracking-widest text-rose-400 opacity-60">
             {product.platform || 'Partner'}
           </span>
           <span className="text-[10px] font-bold" style={{ color: brandColor }}>
             {product.brand}
           </span>
        </div>

        <h3 className="text-[11px] font-bold text-stone-800 leading-snug line-clamp-2 h-8 luxury-font">
          {product.name}
        </h3>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-black text-stone-900">₹{Math.round(product.price)}</span>
            {product.original_price > product.price && (
              <span className="text-[9px] line-through text-stone-400 font-medium tracking-tight">
                ₹{Math.round(product.original_price)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-0.5 text-[9px] font-bold text-amber-500">
             ★ {product.rating}
          </div>
        </div>

        <button
          onClick={handleOrder}
          disabled={busy || isOrdered}
          className={`mt-2 w-full py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
            isOrdered 
              ? 'bg-stone-50 text-stone-400 cursor-default border border-stone-100'
              : 'bg-[#1C1917] text-white hover:bg-rose-600 active:scale-95 shadow-md'
          }`}
        >
          {busy ? 'Syncing...' : isOrdered ? 'Verified' : 'ORDER NOW (DIRECT)'}
        </button>
      </div>
    </motion.div>
  );
}

function OrdersPanel({ orders, onCancel, onRemove, onClose }) {
  const [confirmId, setConfirmId] = useState(null);
  const placedOrders = orders.filter(o => o.status === 'placed');
  const cancelledOrders = orders.filter(o => o.status === 'cancelled');

  return (
    <motion.div
      initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
      className="fixed inset-y-0 right-0 z-[2500] w-full max-w-sm bg-white shadow-2xl flex flex-col"
    >
      <div className="bg-[#1C1917] px-6 py-5 flex items-center justify-between">
        <div>
          <h2 className="text-white font-bold text-lg luxury-font">Shopping Cart</h2>
          <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">{placedOrders.length} Verified Intents</p>
        </div>
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center">✕</button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
        {orders.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-20">
             <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center text-3xl mb-4">🛒</div>
             <p className="font-bold text-stone-800">Your basket is empty</p>
             <p className="text-xs text-stone-400 mt-1">Discover beauty products matched to you.</p>
          </div>
        )}

        {placedOrders.map(order => (
          <div key={order.local_id} className="bg-white border rounded-[28px] p-4 flex gap-4 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-stone-50 overflow-hidden flex-shrink-0">
               <img src={order.image_url} alt="" className="w-full h-full object-contain" />
            </div>
            <div className="flex-1 min-w-0">
               <p className="text-[9px] font-black text-rose-500 uppercase tracking-wider">{order.brand}</p>
               <p className="text-xs font-bold text-stone-800 line-clamp-1">{order.product_name}</p>
               <p className="text-xs font-black mt-1">₹{order.price}</p>
               <div className="mt-2 flex items-center gap-2">
                  <span className="text-[8px] font-black bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full uppercase">Placed</span>
                  <button onClick={() => onCancel(order.local_id)} className="text-[8px] font-black text-rose-400 uppercase hover:underline">Cancel</button>
               </div>
            </div>
          </div>
        ))}

        {cancelledOrders.length > 0 && (
          <div className="pt-4 opacity-50">
             <p className="text-[10px] font-black text-stone-400 uppercase mb-3">Recently Cancelled</p>
             {cancelledOrders.map(order => (
               <div key={order.local_id} className="flex items-center gap-3 py-2 border-b border-stone-50">
                  <div className="w-10 h-10 bg-stone-100 rounded-lg overflow-hidden grayscale"><img src={order.image_url} /></div>
                  <p className="text-[10px] font-bold flex-1 truncate">{order.product_name}</p>
                  <button onClick={() => onRemove(order.local_id)} className="text-stone-300">✕</button>
               </div>
             ))}
          </div>
        )}
      </div>

      <div className="px-4 mt-8 mb-4">
        <p className="text-center text-[10px] text-stone-300 leading-relaxed">
          Products are sold on official brand stores via vCommission affiliate links.
          Clicking "Order Now" opens the product page on the brand website.
          Prices & availability are subject to change.
        </p>
      </div>
    </motion.div>
  );
}

export default function BeautyShop({ onBack }) {
  const [activeSkinTone,  setActiveSkinTone]  = useState(() => localStorage.getItem('tonewear_skin_tone'));
  const [activeCategory,  setActiveCategory]  = useState('all');
  const [activeBrand,     setActiveBrand]     = useState('all');
  const [products,        setProducts]        = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [loadingMore,     setLoadingMore]     = useState(false);
  const [page,            setPage]            = useState(1);
  const [hasMore,         setHasMore]         = useState(true);
  const [showOrders,      setShowOrders]      = useState(false);
  const [toast,           setToast]           = useState(null);

  const observer = useRef();
  const isFetching = useRef(false);
  const { orders, placedOrders, cancelOrder, removeOrder, placeOrder } = useBeautyOrders();

  const fetchProducts = useCallback(async (pageNum, isInitial = false) => {
    if (isFetching.current) return;
    isFetching.current = true;
    
    if (isInitial) setLoading(true);
    else setLoadingMore(true);

    try {
      const params = new URLSearchParams({
        limit: 20,
        page: pageNum,
      });
      if (activeBrand !== 'all') params.set('brand', activeBrand);
      if (activeCategory !== 'all') params.set('category', activeCategory);
      if (activeSkinTone) params.set('skin_tone', activeSkinTone);

      const res = await fetch(`${API_BASE}/beauty/products?${params}`);
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      
      setProducts(prev => {
        if (isInitial) return data;
        const existingIds = new Set(prev.map(p => p.id));
        const uniqueNew = data.filter(p => !existingIds.has(p.id));
        return [...prev, ...uniqueNew];
      });
      setHasMore(data.length >= 20);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      isFetching.current = false;
    }
  }, [activeBrand, activeCategory, activeSkinTone]);

  useEffect(() => {
    setPage(1);
    fetchProducts(1, true);
  }, [activeBrand, activeCategory, activeSkinTone, fetchProducts]);

  const lastElementRef = useCallback(node => {
    if (loading || loadingMore || !hasMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !isFetching.current) {
        setPage(prev => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore]);

  // Fetch more when page changes
  useEffect(() => {
     if (page > 1) {
        fetchProducts(page);
     }
  }, [page, fetchProducts]);

  const handleOrder = async (p) => {
    // 1. Log intent to backend
    await placeOrder({...p, skin_tone: activeSkinTone});
    setToast({ message: `${p.brand} Direct Checkout Initialized`, type: 'success', key: Date.now() });

    // 2. Generate Direct Shopify Checkout Link
    const brandDomain = p.brand === 'Swiss Beauty' ? 'swissbeauty.in' : 'www.dotandkey.com';
    const vcomId = '128053';
    const campId = p.brand === 'Swiss Beauty' ? '11921' : '12957';
    
    let finalUrl = p.affiliate_link;
    if (p.variant_id) {
       // Direct-to-Checkout Shopify URL
       const checkoutUrl = `https://${brandDomain}/cart/${p.variant_id}:1?checkout=true`;
       finalUrl = `https://track.vcommission.com/click?pub_id=${vcomId}&campaign_id=${campId}&url=${encodeURIComponent(checkoutUrl)}`;
    }

    // 3. Open Direct Checkout
    setTimeout(() => {
       window.open(finalUrl, '_blank');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#FFFBFB] pb-24">
      {/* Dynamic Header */}
      <div className="sticky top-0 z-[100] bg-white/80 backdrop-blur-2xl border-b border-rose-50 px-5 py-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-stone-400">✕</button>
          <div className="text-center">
            <h1 className="text-base font-black luxury-font tracking-tight">Beauty Studio</h1>
            <p className="text-[9px] font-black uppercase text-rose-400 tracking-[0.3em]">Swiss Beauty · Dot & Key</p>
          </div>
          <button onClick={() => setShowOrders(true)} className="relative w-10 h-10 rounded-full bg-[#1C1917] text-white flex items-center justify-center">
             <span className="text-lg">🛍️</span>
             {placedOrders.length > 0 && (
               <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                  {placedOrders.length}
               </span>
             )}
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {BRANDS.map(b => (
            <button
              key={b.id}
              onClick={() => setActiveBrand(b.id)}
              className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                activeBrand === b.id ? 'bg-[#1C1917] text-white border-[#1C1917]' : 'bg-white text-stone-400 border-rose-50'
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Skin Tone */}
      <div className="p-5">
         <div className="bg-white rounded-[32px] p-5 shadow-sm border border-rose-50">
           <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-4">Neural Analysis Matches</p>
           <div className="flex gap-3">
             {SKIN_TONES.map(t => (
               <button
                 key={t.id}
                 onClick={() => {
                   const next = activeSkinTone === t.id ? null : t.id;
                   setActiveSkinTone(next);
                   if (next) localStorage.setItem('tonewear_skin_tone', next);
                   else localStorage.removeItem('tonewear_skin_tone');
                 }}
                 className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${
                   activeSkinTone === t.id ? 'border-rose-400 bg-rose-50/50' : 'border-transparent bg-stone-50/50'
                 }`}
               >
                 <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm" style={{ background: t.hex }} />
                 <span className={`text-[10px] font-black ${activeSkinTone === t.id ? 'text-rose-500' : 'text-stone-400'}`}>{t.label}</span>
               </button>
             ))}
           </div>
         </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2.5 px-5 overflow-x-auto no-scrollbar mb-6">
        {CATEGORIES.map(c => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={`flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-2xl text-[11px] font-bold transition-all border ${
              activeCategory === c.id ? 'bg-white text-rose-500 border-rose-200 shadow-md scale-105' : 'bg-stone-50/50 text-stone-500 border-transparent'
            }`}
          >
            <span>{c.emoji}</span>
            <span>{c.label}</span>
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="px-5">
         {loading ? (
            <div className="grid grid-cols-2 gap-4">
              {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
            </div>
         ) : products.length === 0 ? (
           <div className="py-20 text-center">
              <p className="text-stone-400 font-bold">No products found for this profile.</p>
           </div>
         ) : (
            <div className="grid grid-cols-2 gap-4">
              {products.map((p, idx) => (
                <div key={p.id + idx} ref={idx === products.length - 1 ? lastElementRef : null}>
                   <ProductCard 
                     product={p} 
                     skinTone={activeSkinTone} 
                     onOrder={handleOrder}
                     isOrdered={placedOrders.some(o => o.product_id === p.id)}
                   />
                </div>
              ))}
            </div>
         )}

         {loadingMore && (
           <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 text-rose-400 animate-spin" />
           </div>
         )}
      </div>

      {/* Footnote */}
      <div className="p-8 text-center bg-stone-50 mx-5 rounded-[40px] mt-10">
         <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl mx-auto mb-4 border border-rose-50">🛡️</div>
         <h4 className="text-sm font-bold text-stone-800 luxury-font">Affiliate Transparency</h4>
         <p className="text-[10px] text-stone-400 mt-2 leading-relaxed px-4">
            We use vCommission to track orders and ensure you get the best deals from Swiss Beauty & Dot Key. Commissions help support our AI Research.
         </p>
      </div>

      <AnimatePresence>
        {showOrders && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowOrders(false)} className="fixed inset-0 z-[2400] bg-black/40 backdrop-blur-sm" />
            <OrdersPanel orders={orders} onCancel={cancelOrder} onRemove={removeOrder} onClose={() => setShowOrders(false)} />
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <Toast key={toast.key} message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
