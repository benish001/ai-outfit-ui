import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ExternalLink, Tag, ChevronRight, X, Loader2, Sparkles } from 'lucide-react';
import api from '../../services/api';

const PriceComparison = ({ outfit, onClose }) => {
    const [comparison, setComparison] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchComparison = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/outfits/comparison/${outfit.id}`);
                setComparison(res.data);
            } catch (err) {
                console.error("Comparison fetch failed", err);
            } finally {
                setLoading(false);
            }
        };
        if (outfit) fetchComparison();
    }, [outfit]);

    if (!outfit) return null;

    return (
        <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-x-0 bottom-0 z-[600] bg-white rounded-t-[48px] shadow-2xl max-h-[85vh] overflow-y-auto no-scrollbar"
        >
            <div className="p-8 pb-32 max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold luxury-font">Best Deal Finder</h2>
                        <p className="text-[10px] uppercase font-black tracking-widest text-orange-vibrant mt-1">Cross-Platform Comparison</p>
                    </div>
                    <button onClick={onClose} className="p-3 bg-black/5 rounded-full hover:bg-black/10 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-4 text-center">
                        <Loader2 className="animate-spin text-orange-vibrant" size={40} />
                        <p className="text-sm font-medium opacity-40">Scanning Myntra, Ajio & Nykaa...</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Comparison Table/List */}
                        {[comparison.base_product, ...comparison.competitors].sort((a,b) => a.price - b.price).map((item, idx) => (
                            <motion.div 
                                key={item.platform + idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className={`p-5 rounded-[32px] border relative transition-all ${
                                    item.id === comparison.best_deal.id 
                                    ? 'bg-orange-50/50 border-orange-200' 
                                    : 'bg-white border-black/5'
                                }`}
                            >
                                {item.id === comparison.best_deal.id && (
                                    <div className="absolute -top-3 right-6 px-4 py-1.5 bg-orange-vibrant text-white text-[8px] font-black uppercase tracking-widest rounded-full shadow-lg flex items-center gap-1.5">
                                        <Sparkles size={10} /> Best Price
                                    </div>
                                )}

                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 rounded-2xl bg-slate-50 overflow-hidden flex-shrink-0 border border-black/5">
                                        <img src={item.image_url} alt={item.platform} className="w-full h-full object-contain" />
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${
                                                item.platform === 'amazon' ? 'text-amber-600' : 
                                                item.platform === 'flipkart' ? 'text-blue-600' : 'text-pink-600'
                                            }`}>
                                                {item.platform}
                                            </span>
                                        </div>
                                        <h4 className="text-sm font-bold luxury-font line-clamp-1 opacity-80">{item.brand}</h4>
                                        <div className="flex items-baseline gap-2 mt-1">
                                            <span className="text-xl font-black">₹{item.price}</span>
                                            {item.original_price && (
                                                <span className="text-[10px] line-through opacity-20">₹{item.original_price}</span>
                                            )}
                                        </div>
                                    </div>

                                    <button 
                                        onClick={() => window.open(item.affiliate_link, '_blank')}
                                        className={`px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${
                                            item.id === comparison.best_deal.id 
                                            ? 'bg-black text-white' 
                                            : 'bg-white border border-black/5 text-slate-400 hover:text-black hover:border-black'
                                        }`}
                                    >
                                        Buy Now
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default PriceComparison;
