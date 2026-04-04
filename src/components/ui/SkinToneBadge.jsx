import React from 'react';
import { Sparkles, Info } from 'lucide-react';

/**
 * SkinToneBadge — Inclusive, non-clinical skin tone result display.
 * Celebrates diversity with a warm, premium design.
 *
 * Props:
 *   tone       — Detected tone name (e.g., "Deep Tan", "Fair")
 *   hex        — HEX color value for the swatch
 *   confidence — Detection confidence 0-100
 */
const SkinToneBadge = ({ tone = 'Analysing…', hex = '#E8C8A8', confidence = 98 }) => {
  return (
    <div
      className="relative group overflow-hidden rounded-3xl p-5 md:p-6 flex items-center gap-4 md:gap-5 transition-all duration-400 hover:scale-[1.015]"
      style={{
        background: 'rgba(255,255,255,0.82)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1.5px solid rgba(254,205,211,0.45)',
        boxShadow: '0 12px 36px rgba(244,63,94,0.09), 0 4px 12px rgba(0,0,0,0.04)',
      }}
    >
      {/* Glossy reflection */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none rounded-3xl" />

      {/* Skin Tone Swatch */}
      <div className="relative shrink-0 w-[72px] h-[72px] md:w-[80px] md:h-[80px] rounded-full bg-white shadow-md flex items-center justify-center">
        <div
          className="w-[calc(100%-10px)] h-[calc(100%-10px)] rounded-full shadow-sm border border-black/5"
          style={{ backgroundColor: hex }}
        />
        {/* Specular highlight */}
        <div className="absolute top-2 left-4 w-4 h-2 bg-white/25 rounded-full blur-[1px] rotate-[-45deg] pointer-events-none" />
      </div>

      {/* Text Content */}
      <div className="flex-1 space-y-1.5 md:space-y-2 relative z-10">
        <div className="flex items-center gap-2 text-rose-400 text-[9px] font-bold uppercase tracking-widest">
          <Sparkles size={11} className="animate-pulse" />
          <span>AI Precision Match</span>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold luxury-font text-[#1C1917] leading-none tracking-tight">
          {tone}
        </h2>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Confidence Pill */}
          <div
            className="text-[9px] font-black text-white px-3 py-1 rounded-full uppercase tracking-wider"
            style={{
              background: 'linear-gradient(135deg, #F43F5E, #FB7185)',
              boxShadow: '0 4px 12px rgba(244,63,94,0.3)',
            }}
          >
            {confidence}% Match
          </div>

          <button className="p-1.5 text-rose-200 hover:text-rose-400 transition-colors rounded-full hover:bg-rose-50">
            <Info size={15} />
          </button>
        </div>
      </div>

      {/* Decorative right accent */}
      <div
        className="absolute -right-10 -top-10 w-28 h-28 rounded-full pointer-events-none"
        style={{ backgroundColor: hex, opacity: 0.07, filter: 'blur(20px)' }}
      />
    </div>
  );
};

export default SkinToneBadge;
