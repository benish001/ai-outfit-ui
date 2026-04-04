import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { ChevronLeft, Share2, Heart, Award, ShieldCheck, Sparkles, ExternalLink } from 'lucide-react';
import api from '../../services/api';
import Button from '../../components/ui/Button';

import PriceComparison from '../recommendations/PriceComparison';

const ProductDetail = ({ product: initialProduct, onBack }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(initialProduct);
  const [loading, setLoading] = useState(!initialProduct);
  const [showComparison, setShowComparison] = useState(false);

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
    <div className="min-h-screen w-full flex items-center justify-center bg-white">
       <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white space-y-4">
       <p className="text-sm font-bold uppercase tracking-widest">Product Not Found</p>
       <Button variant="outline" onClick={onBack}>Go Back</Button>
    </div>
  );

  const isFlipkart = product.affiliate_link?.includes('flipkart.com');

  return (
    <div className="min-h-screen w-full bg-white flex flex-col md:flex-row">
      <AnimatePresence>
        {showComparison && (
            <PriceComparison outfit={product} onClose={() => setShowComparison(false)} />
        )}
      </AnimatePresence>
      
      {/* Visual Side (Mobile Top) */}
      <div className="w-full md:w-1/2 h-[70vh] md:h-screen sticky top-0 bg-white overflow-hidden">
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2 }}
          src={product.image_url} 
          className="w-full h-full object-cover" 
          alt={product.name} 
        />
        
        {/* Floating Controls */}
        <div className="absolute top-8 left-8 flex items-center gap-4">
           <button onClick={onBack} className="w-12 h-12 rounded-full glass-morphism border border-white/40 flex items-center justify-center text-white">
              <ChevronLeft size={24} />
           </button>
        </div>
        <div className="absolute top-8 right-8 flex flex-col gap-4 text-white">
           <button className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center">
              <Share2 size={20} />
           </button>
           <button className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center group">
              <Heart size={20} className="group-hover:fill-red-500 group-hover:text-red-500 transition-colors" />
           </button>
        </div>

        {/* Brand/Analysis Badge */}
        <div className="absolute bottom-12 left-8 md:bottom-20 md:left-12 flex flex-col gap-3">
           <div className="bg-brand-dark/80 backdrop-blur-xl rounded-[18px] px-6 py-4 border border-white/10 shadow-2xl space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-orange-vibrant" />
                <span className="text-[9px] uppercase tracking-[0.3em] font-black text-white/40">Neural Analysis Score</span>
              </div>
              <div className="flex items-baseline gap-2">
                 <span className="text-4xl text-white font-black">9.8</span>
                 <span className="text-white/40 text-[10px] uppercase font-black">/ 10</span>
              </div>
              <p className="text-[9px] text-white/60 font-medium uppercase tracking-widest">Optimized for {product.color}</p>
           </div>
        </div>
      </div>

      {/* Content Side */}
      <div className="w-full md:w-1/2 min-h-screen bg-white p-8 md:p-20 md:pt-40 flex flex-col space-y-12">
        <header className="space-y-6">
           <div className="flex items-center gap-3">
              <span className="px-4 py-1.5 bg-black/5 rounded-full text-[9px] uppercase font-black tracking-widest">Limited Edition</span>
              <span className="px-4 py-1.5 bg-orange-vibrant/10 text-orange-vibrant rounded-full text-[9px] uppercase font-black tracking-widest">Perfect Match</span>
           </div>
           
           <div className="space-y-2">
              <h1 className="text-5xl md:text-7xl font-bold luxury-font tracking-tight">{product.name}</h1>
              <p className="text-lg text-muted font-medium">Curated by ToneWear Identity Engine</p>
           </div>

           <div className="flex items-center gap-8 pt-4">
              <div className="flex flex-col">
                 <span className="text-3xl font-black">{product.price}</span>
                 <span className="text-[10px] uppercase tracking-widest font-black opacity-30 mt-1">Direct Affiliate Price</span>
              </div>
              <div className="h-10 w-px bg-black/10" />
              <div className="flex flex-col">
                 <div className="flex gap-1 text-yellow-500">
                    {[1,2,3,4,5].map(i => <Star key={i} size={14} className="fill-current" />)}
                 </div>
                 <span className="text-[10px] uppercase tracking-widest font-black text-muted mt-1">1.2k Reviews</span>
              </div>
           </div>
        </header>

        {/* Highlights */}
        <section className="grid grid-cols-2 gap-8">
           <Highlight icon={Award} title="Premium Fiber" desc="Organic luxury cotton" />
           <Highlight icon={ShieldCheck} title="Authentified" desc="Secure global sourcing" />
        </section>

        <div className="space-y-6">
           <h3 className="text-[11px] uppercase tracking-[0.3em] font-black">Editorial Note</h3>
           <p className="text-sm text-muted leading-relaxed font-medium">
             This {product.name} has been selected specifically to harmonize with your {product.color} skin undertone. The saturation coefficients of this fabric are mathematically optimized to enhance your natural radiance.
           </p>
        </div>

        {/* Primary Action */}
        <div className="pt-12 md:pt-20 space-y-6 sticky bottom-8 md:relative">
           <div className="flex flex-col gap-3">
              <button 
                onClick={() => window.open(product.affiliate_link, '_blank')}
                className={`w-full py-6 rounded-3xl text-black text-[13px] font-black uppercase tracking-[0.3em] shadow-2xl flex items-center justify-center gap-4 group transition-all ${
                  isFlipkart ? 'bg-[#2874f0] text-white' : 'bg-[#FFD814]'
                }`}
              >
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${isFlipkart ? 'bg-white text-[#2874f0]' : 'bg-black text-white'}`}>
                    <ExternalLink size={14} />
                  </span>
                  <span>Buy on {isFlipkart ? 'Flipkart' : 'Amazon'}</span>
              </button>

              <button 
                onClick={() => setShowComparison(true)}
                className="w-full py-5 rounded-3xl bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                 <ShieldCheck size={16} className="text-orange-vibrant" />
                 Compare with Myntra & Ajio
              </button>
           </div>

           <p className="text-center text-[9px] uppercase tracking-widest font-bold opacity-30">
              Prices and availability may vary. Affiliate commissions support our AI training.
           </p>
        </div>
      </div>
    </div>
  );
};

// Helper components
const Highlight = ({ icon: Icon, title, desc }) => (
  <div className="flex gap-4">
    <div className="w-12 h-12 rounded-[18px] bg-black/5 flex items-center justify-center text-black shadow-inner">
       <Icon size={20} />
    </div>
    <div className="space-y-1">
       <h4 className="text-[10px] uppercase tracking-[0.1em] font-black">{title}</h4>
       <p className="text-[9px] text-muted font-black">{desc}</p>
    </div>
  </div>
);

const Star = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={className}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export default ProductDetail;
