import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { ChevronLeft, Share2, Heart, Award, ShieldCheck, Sparkles, ExternalLink, TrendingDown } from 'lucide-react';
import api from '../../services/api';
import Button from '../../components/ui/Button';
import PriceComparison from '../recommendations/PriceComparison';

const PLATFORM_STYLES = {
  amazon: {
    label: 'Amazon',
    button: { background: '#FFD814', color: '#1C1917', boxShadow: '0 8px 28px rgba(255,216,20,0.30)' },
    icon: { background: 'rgba(0,0,0,0.1)', color: '#1C1917' },
  },
  flipkart: {
    label: 'Flipkart',
    button: { background: '#2874F0', color: 'white', boxShadow: '0 8px 28px rgba(40,116,240,0.30)' },
    icon: { background: 'rgba(255,255,255,0.2)', color: 'white' },
  },
  myntra: {
    label: 'Myntra',
    button: { background: '#FF3F6C', color: 'white', boxShadow: '0 8px 28px rgba(255,63,108,0.28)' },
    icon: { background: 'rgba(255,255,255,0.2)', color: 'white' },
  },
  ajio: {
    label: 'AJIO',
    button: { background: '#1C1C1C', color: 'white', boxShadow: '0 8px 28px rgba(28,28,28,0.28)' },
    icon: { background: 'rgba(255,255,255,0.2)', color: 'white' },
  },
  nykaa: {
    label: 'Nykaa',
    button: { background: '#FC2779', color: 'white', boxShadow: '0 8px 28px rgba(252,39,121,0.28)' },
    icon: { background: 'rgba(255,255,255,0.2)', color: 'white' },
  },
};

const detectPlatform = (link = '') => {
  const l = String(link).toLowerCase();
  if (l.includes('flipkart')) return 'flipkart';
  if (l.includes('myntra')) return 'myntra';
  if (l.includes('ajio')) return 'ajio';
  if (l.includes('nykaa')) return 'nykaa';
  return 'amazon';
};

/**
 * ProductDetail — Split-layout product page with pink theme.
 * Left: full-bleed image with glass overlays.
 * Right: details, highlights, affiliate CTAs.
 */
const ProductDetail = ({ product: initialProduct, onBack }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(initialProduct);
  const [loading, setLoading] = useState(!initialProduct);
  const [showComparison, setShowComparison] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!product && id) {
      const fetchProduct = async () => {
        try {
          const response = await api.get(`/outfits/${id}`);
          setProduct(response.data);
        } catch (err) {
          console.error('Failed to fetch product', err);
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, product]);

  if (loading) return (
    <div
      className="min-h-screen w-full flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #FFF1F2 0%, #FFF5F7 50%, #FFF7F0 100%)' }}
    >
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full bg-rose-100 animate-ping opacity-50" />
        <div className="relative w-14 h-14 rounded-full bg-white border border-rose-100 shadow-card flex items-center justify-center">
          <div className="w-6 h-6 border-3 border-rose-400 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center gap-4"
      style={{ background: 'linear-gradient(135deg, #FFF1F2 0%, #FFF5F7 50%, #FFF7F0 100%)' }}
    >
      <p className="text-sm font-bold uppercase tracking-widest text-[#9CA3AF]">Product Not Found</p>
      <Button variant="outline" onClick={onBack}>Go Back</Button>
    </div>
  );

  const platformKey = detectPlatform(product.affiliate_link);
  const platformStyle = PLATFORM_STYLES[platformKey] || PLATFORM_STYLES.amazon;

  return (
    <div
      className="min-h-screen w-full flex flex-col md:flex-row"
      style={{ background: 'linear-gradient(135deg, #FFF1F2 0%, #FFF5F7 50%, #FFF7F0 100%)' }}
    >
      <AnimatePresence>
        {showComparison && (
          <PriceComparison outfit={product} onClose={() => setShowComparison(false)} />
        )}
      </AnimatePresence>

      {/* ── Image Side ── */}
      <div className="w-full md:w-[48%] h-[65vh] md:h-screen sticky top-0 overflow-hidden rounded-b-[40px] md:rounded-none md:rounded-r-[48px] shadow-xl">
        <motion.img
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.0, ease: 'easeOut' }}
          src={product.image_url}
          className="w-full h-full object-cover"
          alt={product.name}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* Floating controls */}
        <div className="absolute top-6 left-6 flex items-center gap-3">
          <button
            id="product-back"
            onClick={onBack}
            className="w-12 h-12 rounded-full flex items-center justify-center text-white transition-all"
            style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.3)' }}
          >
            <ChevronLeft size={22} />
          </button>
        </div>

        <div className="absolute top-6 right-6 flex flex-col gap-3 text-white">
          <button
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all"
            style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.3)' }}
          >
            <Share2 size={18} />
          </button>
          <button
            id="product-save"
            onClick={() => setIsSaved(!isSaved)}
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all"
            style={isSaved
              ? { background: '#F43F5E', border: '1px solid rgba(244,63,94,0.5)' }
              : { background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.3)' }
            }
          >
            <Heart size={18} fill={isSaved ? 'white' : 'none'} />
          </button>
        </div>

        {/* Analysis Badge */}
        <div className="absolute bottom-8 left-6 md:bottom-12 md:left-8">
          <div
            className="rounded-2xl px-5 py-4 space-y-1.5 shadow-xl"
            style={{ background: 'rgba(28,25,23,0.75)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <div className="flex items-center gap-2">
              <Sparkles size={12} className="text-rose-400" />
              <span className="text-[8px] uppercase tracking-[0.3em] font-black text-white/40">Neural Match Score</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl text-white font-black">9.8</span>
              <span className="text-white/40 text-[9px] uppercase font-black">/ 10</span>
            </div>
            <p className="text-[8px] text-white/50 font-medium uppercase tracking-widest">
              Optimised for {product.color || 'your tone'}
            </p>
          </div>
        </div>
      </div>

      {/* ── Content Side ── */}
      <div className="w-full md:w-[52%] md:h-screen md:overflow-y-auto no-scrollbar px-6 md:px-14 py-8 md:py-20 md:pt-28 space-y-8 md:space-y-10 flex flex-col">

        {/* Labels */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1.5 bg-rose-50 border border-rose-100 rounded-full text-[8px] uppercase font-black tracking-widest text-rose-400">
            Perfect Match
          </span>
          <span className="px-3 py-1.5 bg-white/80 border border-rose-100 rounded-full text-[8px] uppercase font-black tracking-widest text-[#6B7280]">
            {product.category || 'Fashion'}
          </span>
        </div>

        {/* Name & Price */}
        <div className="space-y-4">
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-rose-400 mb-1">{product.brand}</p>
            <h1 className="text-4xl md:text-5xl font-bold luxury-font tracking-tight text-[#1C1917] leading-tight">
              {product.name}
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <div>
              <span className="text-3xl font-black text-[#1C1917]">₹{Number(product.price).toLocaleString('en-IN')}</span>
              <p className="text-[9px] uppercase tracking-widest font-bold text-[#9CA3AF] mt-1">Direct Price</p>
            </div>
            <div className="h-10 w-px bg-rose-100" />
            <div>
              <div className="flex gap-0.5 text-amber-400">
                {[1,2,3,4,5].map(i => <StarIcon key={i} size={13} strokeWidth={2.5} />)}
              </div>
              <p className="text-[9px] uppercase tracking-widest font-bold text-[#9CA3AF] mt-1.5">1.2k Reviews</p>
            </div>
          </div>
        </div>

        {/* Highlights */}
        <div className="grid grid-cols-2 gap-4">
          <HighlightCard icon={Award} title="Premium Quality" desc="Curated luxury materials" />
          <HighlightCard icon={ShieldCheck} title="Authentified" desc="Secure global sourcing" />
        </div>

        {/* Editorial Note */}
        <div
          className="rounded-2xl p-5 space-y-2"
          style={{ background: 'rgba(255,241,242,0.6)', border: '1px solid rgba(254,205,211,0.4)' }}
        >
          <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-rose-400">Editorial Note</h3>
          <p className="text-sm text-[#6B6560] leading-relaxed">
            This <strong className="text-[#1C1917]">{product.name}</strong> has been selected to harmonise with your{' '}
            <strong className="text-[#1C1917]">{product.color || 'unique'}</strong> undertone, enhancing your natural radiance.
          </p>
        </div>

        {/* CTA Section */}
        <div className="space-y-4 pb-8 md:pb-4">
          {/* Primary affiliate CTA */}
          <button
            id="product-buy"
            onClick={() => window.open(product.affiliate_link, '_blank')}
            className="w-full py-5 rounded-3xl text-sm font-black uppercase tracking-[0.25em] flex items-center justify-center gap-4 group transition-all active:scale-[0.98] min-h-[64px]"
            style={platformStyle.button}
          >
            <span
              className="w-10 h-10 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
              style={platformStyle.icon}
            >
              <ExternalLink size={16} />
            </span>
            Buy on {platformStyle.label}
          </button>

          {/* Compare CTA */}
          <button
            id="product-compare"
            onClick={() => setShowComparison(true)}
            className="w-full py-5 rounded-3xl flex flex-col items-center justify-center gap-2.5 transition-all hover:scale-[1.02] active:scale-[0.98] min-h-[82px]"
            style={{
              background: 'rgba(255,255,255,0.85)',
              border: '1.5px solid rgba(254,205,211,0.5)',
              color: '#1C1917',
              boxShadow: '0 4px 16px rgba(244,63,94,0.08)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div className="flex items-center gap-2">
               <TrendingDown size={14} className="text-rose-400" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em]">Compare Best Deals</span>
            </div>
            
            <div className="flex items-center gap-2 opacity-80 scale-110">
               <PlatformBadge label="A" color="#FFD814" text="#1C1917" />
               <PlatformBadge label="F" color="#2874F0" text="#fff" />
               <PlatformBadge label="M" color="#FF3F6C" text="#fff" />
               <PlatformBadge label="A" color="#1C1C1C" text="#fff" />
               <PlatformBadge label="N" color="#FC2779" text="#fff" />
            </div>
          </button>

          <p className="text-center text-[8px] uppercase tracking-widest font-bold text-rose-200 pt-1">
            Affiliate commissions support our AI engine
          </p>
        </div>
      </div>
    </div>
  );
};

/* ── Helper components ── */
const PlatformBadge = ({ label, color, text }) => (
  <div
    className="w-5 h-5 rounded-md flex items-center justify-center text-[7.5px] font-black shadow-sm"
    style={{ background: color, color: text }}
  >
    {label}
  </div>
);

const HighlightCard = ({ icon: Icon, title, desc }) => (
  <div
    className="flex gap-3 p-4 rounded-2xl"
    style={{ background: 'rgba(255,255,255,0.75)', border: '1px solid rgba(254,205,211,0.35)' }}
  >
    <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-400 shrink-0">
      <Icon size={18} />
    </div>
    <div className="space-y-0.5">
      <h4 className="text-[9px] uppercase tracking-wider font-black text-[#1C1917]">{title}</h4>
      <p className="text-[9px] text-[#9CA3AF] font-medium">{desc}</p>
    </div>
  </div>
);

const StarIcon = ({ size, strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export default ProductDetail;
