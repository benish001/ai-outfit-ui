import React from 'react';
import LayoutWrapper from './LayoutWrapper';
import SkinToneBadge from './SkinToneBadge';
import ComparisonCard from './ComparisonCard';
import { Camera, Search, Filter, SlidersHorizontal } from 'lucide-react';

/**
 * DiscoveryView - A complete example page integrating the design system components.
 * This demonstrates the mobile flow and layout hierarchy.
 */
const DiscoveryView = () => {
  // Mock data for demonstration purposes
  const mockProduct = {
    name: "Hydrating Long-Wear Foundation with SPF 20",
    brand: "Luxe Beauty Pro",
    image: "https://images.unsplash.com/photo-1596462502278-27bf94003e4c?auto=format&fit=crop&q=80&w=600",
    deals: [
      { platform: "Nykaa", price: 1850, originalPrice: 2100 },
      { platform: "Myntra", price: 1799, originalPrice: 2100 },
      { platform: "Amazon", price: 1820, originalPrice: 2100 }
    ]
  };

  const mockProduct2 = {
    name: "Vitamin C Brightening Serum (30ml)",
    brand: "Glow Essentials",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600",
    deals: [
      { platform: "Flipkart", price: 920, originalPrice: 1250 },
      { platform: "Amazon", price: 899, originalPrice: 1250 },
      { platform: "Nykaa", price: 915, originalPrice: 1250 }
    ]
  };

  return (
    <LayoutWrapper>
      {/* 1. Header/Nav Section */}
      <header className="py-6 flex items-center justify-between sticky top-0 md:relative z-20 backdrop-blur-md -mx-4 px-4 md:mx-0 md:px-0">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-[#8E7B73] tracking-[0.2em] uppercase mb-0.5">GLOWTECH</span>
          <h1 className="text-xl font-black text-[#1A1A1A] tracking-tighter">AI DISCOVERY</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="bg-white/80 p-3 rounded-2xl shadow-sm border border-slate-200/50 hover:bg-white transition-colors">
            <Search size={20} className="text-slate-600" />
          </button>
          <button className="bg-[#1A1A1A] text-white p-3 rounded-2xl shadow-xl shadow-slate-300 hover:bg-[#333] transition-colors relative group">
             <Camera size={20} />
             <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#D4A373] border-2 border-[#1A1A1A] rounded-full" />
          </button>
        </div>
      </header>

      {/* 2. Upload / Status Section */}
      <section className="mb-10 md:mb-14">
        <div className="mt-4">
          <SkinToneBadge 
            tone="Sun-Kissed Amber" 
            hex="#D1A074" 
            confidence={99.4} 
          />
        </div>
      </section>

      {/* 3. Grid Filters & Controls */}
      <section className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-md font-bold text-[#1A1A1A]">Beauty Picks</h3>
          <span className="text-xs font-bold text-slate-400 bg-slate-100/50 px-2.5 py-0.5 rounded-full">142 Matches</span>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#1A1A1A] transition-colors border-r pr-3 border-slate-200">
            <SlidersHorizontal size={14} />
            Filters
          </button>
          <button className="flex items-center gap-2 text-xs font-bold text-[#1A1A1A]">
             Sort: Rebates
          </button>
        </div>
      </section>

      {/* 4. Product Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        <ComparisonCard product={mockProduct} />
        <ComparisonCard product={mockProduct2} />
        {/* Placeholder cards to show grid layout */}
        <div className="hidden sm:block">
           <ComparisonCard product={mockProduct} />
        </div>
      </section>

      {/* 5. Mobile Floating CTA Bar (Sticky) */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] z-50 animate-in slide-in-from-bottom-10 fade-in duration-1000 delay-500">
         <div className="bg-[#1A1A1A]/95 backdrop-blur-xl p-4 rounded-3xl shadow-2xl flex items-center justify-between gap-4 border border-white/10">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-[#D4A373] flex items-center justify-center font-bold text-white shadow-lg shadow-[#D4A373]/20">
                  92%
               </div>
               <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">SAVINGS ALERT</span>
                  <span className="text-xs font-bold text-white">Compare 21 New Deals</span>
               </div>
            </div>
            <button className="bg-white text-[#1A1A1A] px-5 py-2.5 rounded-2xl font-black text-xs hover:bg-[#F9F7F5] transition-colors">
               EXPLORE
            </button>
         </div>
      </div>
    </LayoutWrapper>
  );
};

export default DiscoveryView;
