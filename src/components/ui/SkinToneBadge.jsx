import React from 'react';
import { Sparkles, Info } from 'lucide-react';

/**
 * SkinToneBadge - An inclusive, non-clinical skin tone display component.
 * @param {string} tone - The detected tone name (e.g., "Deep Tan", "Fair").
 * @param {string} hex - The HEX color value.
 * @param {number} confidence - AI detection confidence percentage (0-100).
 */
const SkinToneBadge = ({ tone = "Analyzing...", hex = "#E8C8A8", confidence = 98 }) => {
  return (
    <div className="relative group overflow-hidden bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl p-5 md:p-6 shadow-2xl shadow-[#8E7B73]/5 flex items-center gap-4 md:gap-6 transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl hover:bg-white/80">
      {/* Glossy Reflection Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
      
      {/* Skin Tone Swatch - Circular with Outer Glow */}
      <div className="relative shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-full p-1.5 bg-white shadow-inner flex items-center justify-center">
        <div 
          className="w-full h-full rounded-full shadow-lg border border-black/5" 
          style={{ backgroundColor: hex }}
        />
        {/* Swatch Reflection Highlights */}
        <div className="absolute top-2 left-4 w-4 h-2 bg-white/20 rounded-full blur-[1px] rotate-[-45deg]" />
      </div>

      {/* Tone Description & Details */}
      <div className="flex-1 space-y-1.5 md:space-y-2">
        <div className="flex items-center gap-2 text-[#8E7B73] font-medium tracking-tight uppercase text-[10px] md:text-sm">
          <Sparkles size={12} className="text-[#D4A373] animate-pulse" />
          <span>AI Precision Match</span>
        </div>
        
        <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] leading-none mb-1 tracking-tight">
          {tone}
        </h2>
        
        <div className="flex items-center gap-3">
          {/* Confidence Pill */}
          <div className="text-[10px] font-bold bg-[#D4A373] text-white px-2.5 py-1 rounded-full shadow-md shadow-[#D4A373]/20 flex items-center gap-1.5 uppercase tracking-wider">
            {confidence}% Confidence
          </div>
          <button className="p-1.5 text-slate-400 hover:text-[#8E7B73] transition-colors rounded-full hover:bg-white">
            <Info size={16} />
          </button>
        </div>
      </div>

      {/* Decorative Brand Accent - Right Side */}
      <div className="hidden sm:block absolute right-[-40px] top-[-40px] w-32 h-32 bg-[#8E7B73] opacity-[0.03] rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};

export default SkinToneBadge;
