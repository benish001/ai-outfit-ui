import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'react-router-dom';
import {
  ChevronLeft, Share2, Heart, Award, ShieldCheck,
  Sparkles, ExternalLink, TrendingDown, Tag, Star, Truck, ShieldCheck as ShieldCheckIcon
} from 'lucide-react';
import api from '../../services/api';
import Button from '../../components/ui/Button';
import ComparisonOffers from '../../components/affiliate/ComparisonOffers';

/* ── Platform config ── */
const PLATFORM_STYLES = {
  amazon:   { label: 'Amazon',   btn: { background: '#FB7185', color: '#fff' }, icon: { background: 'rgba(255,255,255,0.2)', color: '#fff' } },
  flipkart: { label: 'Flipkart', btn: { background: '#2874F0', color: '#fff' },    icon: { background: 'rgba(255,255,255,0.2)', color: '#fff' } },
  myntra:   { label: 'Myntra',   btn: { background: '#FF3F6C', color: '#fff' },    icon: { background: 'rgba(255,255,255,0.2)', color: '#fff' } },
  ajio:     { label: 'AJIO',     btn: { background: '#1C1C1C', color: '#fff' },    icon: { background: 'rgba(255,255,255,0.2)', color: '#fff' } },
  nykaa:    { label: 'Nykaa',    btn: { background: '#FC2779', color: '#fff' },    icon: { background: 'rgba(255,255,255,0.2)', color: '#fff' } },
};

const COMPARISON_PLATFORMS = [
  { id: 'amazon',   name: 'Amazon',   color: '#FB7185', textColor: '#fff',    match: 'amazon' },
  { id: 'myntra',   name: 'Myntra',   color: '#FF3F6C', textColor: '#fff',    match: 'myntra' },
  { id: 'flipkart', name: 'Flipkart', color: '#2874F0', textColor: '#fff',    match: 'flipkart' },
  { id: 'ajio',     name: 'AJIO',     color: '#1C1C1C', textColor: '#fff',    match: 'ajio' },
  { id: 'nykaa',    name: 'Nykaa',    color: '#FC2779', textColor: '#fff',    match: 'nykaa' },
];

const detectPlatform = (link = '') => {
  const l = String(link).toLowerCase();
  if (l.includes('flipkart')) return 'flipkart';
  if (l.includes('myntra')) return 'myntra';
  if (l.includes('ajio')) return 'ajio';
  if (l.includes('nykaa')) return 'nykaa';
  return 'amazon';
};

/* ── Main Component ── */
const ProductDetail = ({ product: initialProduct, onBack }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(initialProduct);
  const [loading, setLoading] = useState(!initialProduct);
  const [isSaved, setIsSaved] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const loadRef = useRef(null);
  useEffect(() => {
    if (loadRef.current === id) return;
    if (!product && id) {
      api.get(`/outfits/${id}`)
        .then(r => setProduct(r.data))
        .catch(e => console.error(e))
        .finally(() => setLoading(false));
      loadRef.current = id;
    }
  }, [id, product]);


  const handleToggleSave = async () => {
    try {
      if (isSaved) {
        await api.delete(`/users/saved/${product.id}`);
        setIsSaved(false);
      } else {
        await api.post(`/users/saved/${product.id}`);
        setIsSaved(true);
      }
    } catch (err) { console.error(err); }
  };

  /* Loading skeleton */
  if (loading) return (
    <div className="min-h-screen w-full flex flex-col md:flex-row" style={{ background: 'linear-gradient(135deg, #FFF1F2 0%, #FFF5F7 50%, #FFF7F0 100%)' }}>
      <div className="w-full md:w-[48%] h-[60vh] md:h-screen bg-rose-50 animate-pulse rounded-b-[40px] md:rounded-b-none md:rounded-r-[48px]" />
      <div className="flex-1 p-8 md:p-16 space-y-6 flex flex-col justify-center">
        {[80, 60, 40, 100, 70].map((w, i) => (
          <div key={i} className={`h-5 rounded-full bg-rose-50 animate-pulse`} style={{ width: `${w}%` }} />
        ))}
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: 'linear-gradient(135deg, #FFF1F2 0%, #FFF7F0 100%)' }}>
      <p className="text-sm font-bold uppercase tracking-widest text-rose-300">Product Not Found</p>
      <Button variant="outline" onClick={onBack}>Go Back</Button>
    </div>
  );

  const platformKey = detectPlatform(product.affiliate_link);
  const ps = PLATFORM_STYLES[platformKey];
  // Truncate very long product names
  const displayName = product.name?.length > 60 ? product.name.slice(0, 60) + '…' : product.name;

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row overflow-x-hidden" style={{ background: '#FFF7F8' }}>

      {/* ── LEFT: Image Panel ── */}
      <div className="relative w-full md:w-[46%] h-[62vh] md:h-screen md:sticky md:top-0 overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(145deg, #FFF1F2, #FFE8EC)' }} />

        {/* Blurred decoration blobs */}
        <div className="absolute top-1/4 right-0 w-48 h-48 rounded-full blur-[80px] opacity-30" style={{ background: '#FF9DAC' }} />
        <div className="absolute bottom-10 left-0 w-40 h-40 rounded-full blur-[70px] opacity-20" style={{ background: '#FFA0B6' }} />

        {/* Product Image */}
        <motion.img
          src={product.image_url}
          alt={displayName}
          className="absolute inset-0 w-full h-full object-contain p-8 md:p-12 z-10"
          style={{ opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.6s ease' }}
          onLoad={() => setImgLoaded(true)}
        />

        {/* Top Controls */}
        <div className="absolute top-5 left-5 z-20">
          <button
            id="product-back"
            onClick={onBack}
            className="w-11 h-11 rounded-full flex items-center justify-center text-[#1C1917] transition-all hover:scale-110 active:scale-95 shadow-lg"
            style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)' }}
          >
            <ChevronLeft size={20} />
          </button>
        </div>

        <div className="absolute top-5 right-5 z-20 flex flex-col gap-2.5">
          <button
            className="w-11 h-11 rounded-full flex items-center justify-center text-[#6B7280] transition-all hover:scale-110 shadow-lg"
            style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)' }}
          >
            <Share2 size={17} />
          </button>
          <button
            id="product-save"
            onClick={handleToggleSave}
            className="w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-lg"
            style={isSaved
              ? { background: '#F43F5E' }
              : { background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)' }
            }
          >
            <Heart size={17} fill={isSaved ? 'white' : 'none'} stroke={isSaved ? 'white' : '#6B7280'} />
          </button>
        </div>

        {/* AI Badge */}
        <div className="absolute bottom-6 left-5 z-20">
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl" style={{ background: 'rgba(28,25,23,0.82)', backdropFilter: 'blur(16px)' }}>
            <Sparkles size={13} className="text-rose-400" />
            <div>
              <p className="text-[8px] font-black uppercase tracking-[0.25em] text-white/40">Neural Match</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-white leading-tight">9.8</span>
                <span className="text-[9px] text-white/40 font-bold">/10</span>
              </div>
            </div>
          </div>
        </div>

        {/* Platform pill */}
        <div className="absolute bottom-6 right-5 z-20">
          <div className="px-3 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest shadow-md" style={{ background: ps.btn.background, color: ps.btn.color }}>
            {ps.label}
          </div>
        </div>
      </div>

      {/* ── RIGHT: Info Panel ── */}
      <div className="flex-1 md:h-screen md:overflow-y-auto no-scrollbar">
        <div className="px-6 md:px-12 py-8 md:py-12 space-y-8 max-w-2xl">

          {/* Breadcrumb tags */}
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border" style={{ background: '#FFF0F2', borderColor: '#FECDD3', color: '#F43F5E' }}>
              Perfect Match
            </span>
            <span className="px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-rose-100 text-[#9CA3AF] bg-white">
              {product.category || 'Fashion'}
            </span>
            {product.color && (
              <span className="px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-rose-100 text-[#9CA3AF] bg-white">
                {product.color}
              </span>
            )}
          </div>

          {/* Brand + Name */}
          <div className="space-y-2">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-rose-400">{product.brand}</p>
            <h1 className="text-2xl md:text-3xl font-black text-[#1C1917] leading-snug luxury-font" title={product.name}>
              {displayName}
            </h1>
          </div>

          {/* Price + Rating row */}
          <div className="flex items-center gap-5">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#1C1917]">₹{Number(product.price).toLocaleString('en-IN')}</span>
                <button 
                  onClick={async () => {
                    try {
                      const res = await api.post(`/outfits/${product.id}/refresh`);
                      setProduct(res.data);
                    } catch (e) {
                      alert("Price refresh failed. API might be limited.");
                    }
                  }}
                  className="text-[8px] font-black uppercase tracking-widest text-rose-400 hover:text-rose-600 flex items-center gap-1 transition-colors"
                >
                  <Sparkles size={10} /> Sync Price
                </button>
              </div>
              <p className="text-[8px] uppercase tracking-widest font-bold text-[#9CA3AF] mt-0.5">Direct Price</p>
            </div>
            <div className="h-10 w-px bg-rose-100" />
            <div>
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i => <StarSVG key={i} />)}
              </div>
              <p className="text-[8px] uppercase tracking-widest font-bold text-[#9CA3AF] mt-1">1.2k Reviews</p>
            </div>
          </div>

          {/* Quick info pills */}
          <div className="flex flex-wrap gap-2">
            <InfoPill icon={Truck} text="Free Delivery" />
            <InfoPill icon={ShieldCheckIcon} text="Secure Checkout" />
            <InfoPill icon={Tag} text="Best Price" />
          </div>

          {/* Editorial */}
          <div className="rounded-2xl p-5" style={{ background: 'rgba(255,241,242,0.7)', border: '1px solid rgba(255,205,213,0.4)' }}>
            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-rose-400 mb-2">Editorial Note</p>
            <p className="text-sm text-[#6B6560] leading-relaxed">
              This <strong className="text-[#1C1917]">{product.brand}</strong> piece was selected by our Neural Engine to complement your{' '}
              <strong className="text-[#1C1917]">{product.color || 'unique'}</strong> undertone and enhance your natural radiance.
            </p>
          </div>

          {/* Primary CTA */}
          <button
            id="product-buy"
            onClick={() => {
              let finalLink = product.affiliate_link;
              if (finalLink && finalLink.includes('amazon.in') && !finalLink.includes('tag=')) {
                const connector = finalLink.includes('?') ? '&' : '?';
                finalLink = `${finalLink}${connector}linkCode=ll2&tag=skintoneai-21&ref_=as_li_ss_tl`;
              }
              window.open(finalLink, '_blank');
            }}
            className="w-full py-5 rounded-3xl text-sm font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all hover:opacity-90 active:scale-[0.98] shadow-lg"
            style={ps.btn}
          >
            <span className="w-9 h-9 rounded-2xl flex items-center justify-center" style={ps.icon}>
              <ExternalLink size={15} />
            </span>
            Buy on {ps.label}
          </button>

          {/* ── PRICE COMPARISON WIDGET ── */}
          <div className="space-y-4 pt-4 border-t border-rose-50">
            <div className="flex items-center gap-2">
              <TrendingDown size={14} className="text-emerald-500" />
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1C1917]">Price Comparison</h4>
            </div>
            <InlinePriceWidget outfit={product} platformStyles={PLATFORM_STYLES} />
          </div>

          {/* ── Live Affiliate Offers / Coupons ── */}
          <ComparisonOffers category={product.category} />

          <p className="text-center text-[8px] uppercase tracking-widest font-semibold text-rose-200 pb-8">
            Affiliate commissions fund the ToneWear AI engine
          </p>
        </div>
      </div>
    </div>
  );
};

/* ── Inline Price Comparison Widget ── */
const InlinePriceWidget = ({ outfit, platformStyles }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const compRef = useRef(null);
  useEffect(() => {
    if (compRef.current === outfit.id) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    // Pass the product name so the backend knows what to compare
    const params = { name: outfit.name };
    api.get(`/outfits/comparison/${outfit.id}`, { params })
      .then(r => { if (!cancelled) setData(r.data); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    compRef.current = outfit.id;
    return () => { cancelled = true; };
  }, [outfit.id, outfit.name]);

  if (loading) return (
    <div className="space-y-2.5">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="h-[72px] rounded-2xl animate-pulse" style={{ background: 'rgba(255,241,242,0.6)' }} />
      ))}
    </div>
  );

  const matches = data?.matches || [];
  const basePlatformId = (() => {
    const l = (outfit.affiliate_link || '').toLowerCase();
    for (const p of COMPARISON_PLATFORMS) { if (l.includes(p.match)) return p.id; }
    return 'amazon';
  })();

  // Build a direct search URL on each platform using the product name
  const getPlatformSearchUrl = (platId, productName) => {
    const q = encodeURIComponent(productName || '');
    switch (platId) {
      case 'myntra':   return `https://www.myntra.com/${q.replace(/%20/g, '-')}`;
      case 'flipkart': return `https://www.flipkart.com/search?q=${q}`;
      case 'ajio':     return `https://www.ajio.com/search/?text=${q}`;
      case 'amazon':   return `https://www.amazon.in/s?k=${q}`;
      default:         return `https://www.google.com/search?q=${q}+${platId}`;
    }
  };

  const allPrices = [
    outfit.price,
    ...matches.map(m => m.price).filter(Boolean)
  ].filter(Boolean);
  const lowestPrice = Math.min(...allPrices);

  return (
    <div className="space-y-2.5">
      {COMPARISON_PLATFORMS.map(plat => {
        const isBase = plat.id === basePlatformId;
        const match = matches.find(m => m.platform === plat.id);
        const price = isBase ? outfit.price : match?.price;
        const url = isBase ? outfit.affiliate_link : match?.link;
        const isLowest = price != null && price <= lowestPrice;

        return (
          <motion.div
            key={plat.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: COMPARISON_PLATFORMS.indexOf(plat) * 0.06 }}
            className="flex items-center gap-4 p-4 rounded-2xl transition-all"
            style={isLowest && price
              ? { background: '#F0FDF4', border: '1.5px solid #86EFAC', boxShadow: '0 4px 20px rgba(16,185,129,0.08)' }
              : price
              ? { background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(254,205,211,0.25)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }
              : { background: 'rgba(249,250,251,0.6)', border: '1px dashed #E5E7EB' }
            }
          >
            {/* Platform logo bubble */}
            <div className="w-11 h-11 rounded-xl flex items-center justify-center font-black text-xs shrink-0 shadow-sm" style={{ background: plat.color, color: plat.textColor }}>
              {plat.name[0]}
            </div>

            {/* Name + badge */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-xs font-black text-[#1C1917] uppercase tracking-wide">{plat.name}</p>
                {match?.is_deal && (
                  <span className="text-[7px] font-black uppercase tracking-widest text-white bg-[#FF3F6C] px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Tag size={8} /> Offer Active
                  </span>
                )}
                {isLowest && price && !match?.is_deal && (
                  <span className="text-[7px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Best Price
                  </span>
                )}
                {isBase && (
                  <span className="text-[7px] font-black uppercase tracking-widest text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">
                    Listed Here
                  </span>
                )}
              </div>
              {price
                ? <p className={`text-base font-black mt-0.5 ${isLowest ? 'text-emerald-700' : 'text-[#1C1917]'}`}>₹{Number(price).toLocaleString('en-IN')}</p>
                : match?.is_deal
                ? <p className="text-[10px] font-bold text-rose-500 mt-0.5">{match.coupon ? `Use Code: ${match.coupon}` : 'Live Offer Available'}</p>
                : <p className="text-xs text-[#9CA3AF] mt-0.5">Not available</p>
              }
            </div>

            {/* Action */}
            {price ? (
              <button
                onClick={() => window.open(url, '_blank')}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95 shrink-0 shadow-md"
                style={{ background: isLowest ? '#10B981' : '#1C1917' }}
              >
                <ExternalLink size={13} />
              </button>
            ) : (
              <button
                onClick={() => window.open(getPlatformSearchUrl(plat.id, outfit.name), '_blank')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[8px] font-black uppercase tracking-wider text-white transition-all hover:opacity-90 active:scale-95 shrink-0 shadow-sm"
                style={{ background: plat.color, color: plat.textColor }}
              >
                <ExternalLink size={11} />
                Buy
              </button>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

/* ── Helper components ── */
const InfoPill = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-rose-100 bg-white shadow-sm">
    <Icon size={11} className="text-rose-400" />
    <span className="text-[8px] font-black uppercase tracking-wider text-[#6B7280]">{text}</span>
  </div>
);

const HighlightCard = ({ icon: Icon, title, desc }) => (
  <div className="flex gap-3 p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.75)', border: '1px solid rgba(254,205,211,0.35)' }}>
    <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-400 shrink-0">
      <Icon size={18} />
    </div>
    <div className="space-y-0.5">
      <h4 className="text-[9px] uppercase tracking-wider font-black text-[#1C1917]">{title}</h4>
      <p className="text-[9px] text-[#9CA3AF] font-medium">{desc}</p>
    </div>
  </div>
);

const StarSVG = () => (
  <svg width={13} height={13} viewBox="0 0 24 24" fill="#FBBF24" stroke="#FBBF24" strokeWidth={1.5} strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export default ProductDetail;
