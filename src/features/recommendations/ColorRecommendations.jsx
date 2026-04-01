import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Sparkles, AlertCircle, ShoppingBag, ExternalLink, CheckCircle, RefreshCcw } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useAnalysis } from '../../context/AnalysisContext';

const ColorRecommendations = ({ onNext, onBack }) => {
  const { analysisResult, clearAnalysis } = useAnalysis();
  const [palette, setPalette] = useState({ best: [], avoid: [] });
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (analysisResult) {
      // Robust mapping of API response to UI state
      const recommendations = analysisResult.recommendations || {};
      const apiProducts = analysisResult.products || [];
      
      const colorToHex = {
        'Royal Blue': '#4169E1',
        'Emerald Green': '#50C878',
        'Amethyst': '#9966CC',
        'Silver': '#C0C0C0',
        'Icy Pink': '#F5F5DC',
        'Orange': '#FFA500',
        'Tomato Red': '#FF6347',
        'Golden Yellow': '#FFD700',
        'Olive Green': '#808000',
        'Mustard Yellow': '#E1AD01',
        'Terracotta': '#E2725B',
        'Gold': '#FFD700',
        'Cream': '#FFFDD0',
        'Pastel Blue': '#AEC6CF',
        'Magenta': '#FF00FF',
        'Sage Green': '#9CA986',
        'Dusty Pink': '#DCAE96',
        'Navy Blue': '#000080',
        'Jade': '#00A86B',
        'Off-White': '#FAF9F6',
        'Neon Yellow': '#CCFF00',
        'Electric Blue': '#7DF9FF'
      };

      setPalette({
        best: (recommendations.colors_to_wear || []).map(name => ({ 
          name, 
          hex: colorToHex[name] || '#ccc' 
        })),
        avoid: (recommendations.colors_to_avoid || []).map(name => ({ 
          name, 
          hex: colorToHex[name] || '#ccc' 
        }))
      });
      setProducts(apiProducts);
    }
  }, [analysisResult]);

  const handleRetake = () => {
    clearAnalysis();
    localStorage.removeItem('analysisResult');
    onBack();
  };

  // If no data, show a clear message or redirect
  if (!analysisResult) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-10 text-center gap-6">
        <div className="w-20 h-20 bg-orange-vibrant/10 rounded-full flex items-center justify-center text-orange-vibrant">
          <RefreshCcw size={40} className="animate-spin-slow" />
        </div>
        <h2 className="text-2xl font-bold luxury-font">No Active Analysis</h2>
        <p className="text-muted text-sm max-w-xs">Please upload a photo to identify your ideal color palette.</p>
        <Button variant="primary" onClick={onBack}>Start Analysis</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#f8f8f8] p-5 flex flex-col max-w-3xl mx-auto overflow-x-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8 sticky top-0 bg-[#f8f8f8]/80 backdrop-blur-md z-10 py-2 shrink-0">
         <button onClick={onBack} className="p-2 -ml-2 hover:bg-white rounded-full transition-all">
            <ChevronLeft size={22} />
         </button>
         <div className="bg-white border border-black/5 rounded-full px-4 py-1.5 flex items-center gap-2 shadow-sm">
            <Sparkles size={14} className="text-orange-vibrant" />
            <span className="text-[10px] uppercase tracking-widest font-black text-brand-dark">Analysis Result</span>
         </div>
         <button onClick={handleRetake} className="text-[9px] font-black uppercase text-orange-vibrant hover:opacity-70">
            Retake
         </button>
      </div>

      <div className="space-y-2 mb-8 text-center shrink-0">
        <p className="text-[10px] uppercase tracking-[0.4em] font-black text-orange-vibrant">
          {analysisResult.skin_tone} • {analysisResult.undertone}
        </p>
        <h1 className="text-3xl md:text-5xl font-bold luxury-font leading-tight">
          Your Ideal<br />
          <span className="italic text-brand-dark">Color Palette.</span>
        </h1>
      </div>

      <div className="flex-1 space-y-10 pb-24">
        {/* Color Palette Section */}
        <section className="space-y-6">
          <div className="flex flex-col gap-6">
             {/* Wear */}
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="bg-white p-6 rounded-[32px] shadow-soft border border-orange-vibrant/10"
             >
                <div className="flex items-center gap-2 mb-4">
                   <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                      <CheckCircle size={16} />
                   </div>
                   <h2 className="text-[11px] uppercase tracking-[0.2em] font-black">Best Matches</h2>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                  {palette.best.length > 0 ? palette.best.map((c, i) => (
                    <motion.div 
                      key={`${c.name}-${i}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="group flex flex-col items-center"
                    >
                      <div className="w-full aspect-square rounded-2xl shadow-sm border border-black/5 mb-2 hover:scale-105 transition-transform cursor-pointer" style={{ backgroundColor: c.hex }} title={c.name} />
                      <p className="text-[8px] font-bold text-center opacity-40 truncate w-full uppercase">{c.name}</p>
                    </motion.div>
                  )) : (
                    <div className="col-span-full py-4 text-center opacity-30 text-[10px]">No colors identified</div>
                  )}
                </div>
             </motion.div>

             {/* Avoid */}
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.2 }}
               className="bg-white p-6 rounded-[32px] shadow-soft border border-black/5 opacity-80"
             >
                <div className="flex items-center gap-2 mb-4">
                   <div className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                      <AlertCircle size={16} />
                   </div>
                   <h2 className="text-[11px] uppercase tracking-[0.2em] font-black opacity-40">Least Ideal</h2>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                  {palette.avoid.length > 0 ? palette.avoid.map((c, i) => (
                    <div key={`${c.name}-${i}`} className="flex flex-col items-center grayscale opacity-30">
                      <div className="w-full aspect-square rounded-2xl border border-black/5 mb-2" style={{ backgroundColor: c.hex }} />
                      <p className="text-[8px] font-bold text-center truncate w-full uppercase">{c.name}</p>
                    </div>
                  )) : (
                    <div className="col-span-full py-4 text-center opacity-10 text-[10px]">No data available</div>
                  )}
                </div>
             </motion.div>
          </div>
        </section>

        {/* Product Grid Section */}
        <section className="space-y-6">
           <div className="flex items-center justify-between px-2">
              <h2 className="text-xl font-bold luxury-font">Tailored Picks</h2>
              <span className="text-[10px] uppercase font-black tracking-widest opacity-30">Real Results</span>
           </div>

           <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {products.length > 0 ? products.map((product, i) => (
                  <motion.div 
                    key={product.id || i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-[24px] overflow-hidden shadow-soft border border-black/5 group flex flex-col h-full hover:shadow-xl transition-shadow"
                  >
                     <div className="aspect-[4/5] relative overflow-hidden bg-gray-50 flex items-center justify-center p-2">
                        <img 
                          src={product.image_url} 
                          alt={product.title} 
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 right-3">
                           <div className="px-2 py-1 rounded-full bg-white/80 backdrop-blur-sm text-[8px] font-black uppercase tracking-tighter shadow-sm border border-black/5">
                              {product.color}
                           </div>
                        </div>
                     </div>
                     <div className="p-4 flex flex-col flex-1">
                        <p className="text-[8px] uppercase tracking-widest font-black text-orange-vibrant mb-1">{product.brand}</p>
                        <h3 className="text-[11px] leading-relaxed font-bold line-clamp-2 mb-3 flex-1">{product.title}</h3>
                        <div className="flex items-center justify-between mt-auto pt-3 border-t border-black/5">
                           <span className="text-sm font-black">{product.price}</span>
                           <a 
                             href={product.affiliate_link} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="p-2.5 rounded-full bg-black text-white hover:bg-orange-vibrant transition-colors group/btn"
                           >
                              <ExternalLink size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                           </a>
                        </div>
                     </div>
                  </motion.div>
              )) : (
                <div className="col-span-full py-20 text-center bg-white rounded-[32px] border border-dashed border-black/10">
                   <div className="bg-orange-vibrant/5 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShoppingBag className="text-orange-vibrant" size={20} />
                   </div>
                   <p className="text-xs font-bold uppercase tracking-widest opacity-30">Generating dynamic picks...</p>
                </div>
              )}
           </div>
        </section>

        {/* Explore More CTA */}
        <section className="pt-4">
           <Button 
            variant="primary" 
            size="lg" 
            className="w-full bg-brand-dark text-white py-5 rounded-[24px] shadow-xl shadow-brand-dark/20 flex items-center justify-center gap-3 group"
            onClick={onNext}
           >
              <ShoppingBag size={20} className="group-hover:rotate-12 transition-transform" />
              <span className="uppercase text-[11px] font-black tracking-widest">Full Style Catalog</span>
           </Button>
        </section>
      </div>

      {/* Info Footer */}
      <footer className="py-8 text-center shrink-0 border-t border-black/5">
         <p className="text-[9px] uppercase tracking-widest font-bold opacity-20">Live Sync • Neural Engine v5.2</p>
      </footer>
    </div>
  );
};

export default ColorRecommendations;
