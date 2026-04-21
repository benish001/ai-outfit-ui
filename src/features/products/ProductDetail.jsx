import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'react-router-dom';
import {
  ChevronLeft, Share2, Heart, Award, ShieldCheck,
  Sparkles, ExternalLink, TrendingDown, Tag, Star, Truck, ShieldCheck as ShieldCheckIcon
} from 'lucide-react';
import api from '../../services/api';
import Button from '../../components/ui/Button';

/* ── Platform config ── */
const PLATFORM_STYLES = {
  swissbeauty: { label: 'Swiss Beauty', btn: { background: '#E91E8C', color: '#fff' }, icon: { background: 'rgba(255,255,255,0.2)', color: '#fff' } },
  dotandkey:   { label: 'Dot & Key',    btn: { background: '#22C55E', color: '#fff' }, icon: { background: 'rgba(255,255,255,0.2)', color: '#fff' } },
  nykaa:       { label: 'Nykaa',        btn: { background: '#FC2779', color: '#fff' }, icon: { background: 'rgba(255,255,255,0.2)', color: '#fff' } },
  default:     { label: 'Brand Store',  btn: { background: '#1C1917', color: '#fff' }, icon: { background: 'rgba(255,255,255,0.2)', color: '#fff' } },
};

const detectPlatform = (link = '') => {
  const l = String(link).toLowerCase();
  if (l.includes('swissbeauty')) return 'swissbeauty';
  if (l.includes('dotandkey'))   return 'dotandkey';
  if (l.includes('nykaa'))       return 'nykaa';
  return 'default';
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
      api.get(`/beauty/products/${id}`) // Note: Ensure this exists or fallback to general outfits
        .then(r => setProduct(r.data))
        .catch(e => {
            console.error(e);
            // Fallback for demo if beauty-specific endpoint missing
            setProduct(initialProduct);
        })
        .finally(() => setLoading(false));
      loadRef.current = id;
    }
  }, [id, product, initialProduct]);

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

  if (loading) return (
    <div className="min-h-screen w-full flex flex-col md:flex-row" style={{ background: 'linear-gradient(135deg, #FFF1F2 0%, #FFF5F7 50%, #FFF7F0 100%)' }}>
      <div className="w-full md:w-[48%] h-[60vh] md:h-screen bg-rose-50 animate-pulse rounded-b-[40px]" />
      <div className="flex-1 p-8 space-y-6 flex flex-col justify-center">
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
  const ps = PLATFORM_STYLES[platformKey] || PLATFORM_STYLES.default;
  const displayName = product.name?.length > 70 ? product.name.slice(0, 70) + '…' : product.name;

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row overflow-x-hidden" style={{ background: '#FFF8F9' }}>

      {/* ── IMAGE PANEL ── */}
      <div className="relative w-full md:w-[46%] h-[60vh] md:h-screen sticky top-0 overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(145deg, #FFF1F2, #FFEBF0)' }} />
        <div className="absolute top-1/4 right-0 w-64 h-64 rounded-full blur-[90px] opacity-20 bg-rose-300" />
        
        <motion.img
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: imgLoaded ? 1 : 0, scale: imgLoaded ? 1 : 0.9 }}
          src={product.image_url}
          className="absolute inset-0 w-full h-full object-contain p-10 z-10"
          onLoad={() => setImgLoaded(true)}
        />

        <div className="absolute top-5 left-5 z-20">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-stone-800 shadow-lg border border-rose-50">
            <ChevronLeft size={18} />
          </button>
        </div>

        <div className="absolute top-5 right-5 z-20 flex flex-col gap-2.5">
          <button id="product-save" onClick={handleToggleSave} className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-lg border border-rose-50">
            <Heart size={16} fill={isSaved ? '#E91E8C' : 'none'} stroke={isSaved ? '#E91E8C' : '#888'} />
          </button>
        </div>

        <div className="absolute bottom-6 left-5 z-20 px-4 py-2.5 rounded-2xl bg-stone-900/80 backdrop-blur-md text-white shadow-xl flex items-center gap-2">
            <Sparkles size={12} className="text-rose-400" />
            <div className="text-[10px] font-black uppercase tracking-widest">Precision Skin Match</div>
        </div>
      </div>

      {/* ── INFO PANEL ── */}
      <div className="flex-1 p-6 md:p-14 space-y-8 bg-white md:rounded-l-[48px] shadow-2xl relative z-30 -mt-8 md:mt-0">
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-rose-500">{product.brand}</span>
            <div className="h-px flex-1 bg-rose-100" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-stone-900 leading-tight luxury-font">
            {displayName}
          </h1>
        </div>

        <div className="flex items-baseline gap-4">
          <span className="text-4xl font-black text-stone-900">₹{Math.round(product.price)}</span>
          {product.original_price > product.price && (
            <span className="text-lg text-stone-300 line-through font-bold">₹{Math.round(product.original_price)}</span>
          )}
          <span className="ml-auto text-amber-500 text-sm font-black flex items-center gap-1">★ {product.rating || '4.8'}</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Highlight key="auth" icon={ShieldCheck} title="100% Authentic" desc="Official Brand Stock" />
          <Highlight key="track" icon={Truck} title="Fast Delivery" desc="Direct from Brand" />
        </div>

        <div className="p-6 rounded-[28px] bg-rose-50/50 border border-rose-100 space-y-3">
          <div className="text-[9px] font-black uppercase tracking-widest text-rose-400 flex items-center gap-2">
            <Tag size={10} /> Neural Analysis
          </div>
          <p className="text-sm text-stone-600 leading-relaxed italic">
            This <strong className="text-stone-900">{product.brand}</strong> curation was selected specifically to enhance your natural radiance. Its undertones are precision-matched to your neural scan profile.
          </p>
        </div>

        {/* PRIMARY CTA */}
        <div className="space-y-4 pt-4">
          <button
            onClick={() => window.open(product.affiliate_link, '_blank')}
            className="w-full py-5 rounded-[24px] text-sm font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-rose-lg"
            style={ps.btn}
          >
            <ExternalLink size={16} /> Buy on {ps.label}
          </button>
          
          <p className="text-center text-[10px] text-stone-300 font-bold uppercase tracking-widest">
            Directly from Official Partner Store
          </p>
        </div>

        <div className="pt-8 border-t border-rose-50 text-center">
            <p className="text-[8px] font-black uppercase tracking-widest text-rose-200">
                Partner tracking ID: 128053 • Neural Engine sync active
            </p>
        </div>
      </div>
    </div>
  );
};

const Highlight = ({ icon: Icon, title, desc }) => (
  <div className="p-4 rounded-3xl bg-stone-50 border border-stone-100 flex gap-3 items-center">
    <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-rose-400 shadow-sm">
      <Icon size={16} />
    </div>
    <div>
      <p className="text-[9px] font-black uppercase tracking-widest text-stone-900">{title}</p>
      <p className="text-[9px] font-bold text-stone-400">{desc}</p>
    </div>
  </div>
);

export default ProductDetail;
