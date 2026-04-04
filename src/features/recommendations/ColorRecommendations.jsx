import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Sparkles, ShoppingBag, CheckCircle, RefreshCcw, Info } from 'lucide-react';
import Button from '../../components/ui/Button';
import SkinToneBadge from '../../components/ui/SkinToneBadge';
import { useAnalysis } from '../../context/AnalysisContext';

/**
 * ColorRecommendations — Premium skin tone result + colour palette.
 * Pink gradient background; SkinToneBadge as the hero element.
 */
const ColorRecommendations = ({ onNext, onBack }) => {
  const { analysisResult, clearAnalysis } = useAnalysis();
  const [palette, setPalette] = useState({ best: [], avoid: [] });

  const colorToHex = {
    'Royal Blue': '#002366', 'Emerald Green': '#50C878', 'Amethyst': '#9966CC',
    'Silver': '#BEC2CB', 'Icy Pink': '#FADADD', 'Orange': '#FF8C00',
    'Tomato Red': '#FF6347', 'Golden Yellow': '#FFD700', 'Olive Green': '#808000',
    'Mustard Yellow': '#E1AD01', 'Terracotta': '#E2725B', 'Gold': '#FFD700',
    'Cream': '#FFFDD0', 'Pastel Blue': '#AEC6CF', 'Magenta': '#FF00FF',
    'Sage Green': '#8da399', 'Dusty Pink': '#DCAE96', 'Navy Blue': '#000080',
    'Jade': '#00A86B', 'Off-White': '#FAF9F6', 'Neon Yellow': '#CCFF00',
    'Electric Blue': '#7DF9FF', 'Maroon': '#800000', 'Fuchsia': '#FF00FF',
    'Sky Blue': '#87CEEB', 'Soft Pink': '#FFB6C1', 'Lavender': '#E6E6FA',
    'Baby Blue': '#89CFF0', 'Mint Green': '#98FF98', 'Coral': '#FF7F7F',
    'Burgundy': '#8B0000', 'Champagne': '#F7E7CE',
  };

  const skinToneHex = {
    'Fair': '#F5C8A0', 'Light': '#F0B896', 'Medium': '#C8845C',
    'Tan': '#B06840', 'Deep Tan': '#8B5230', 'Dark': '#6B3A25',
    'Deep': '#4A2415',
  };

  useEffect(() => {
    if (analysisResult) {
      const recs = analysisResult.recommendations || {};
      setPalette({
        best: (recs.colors_to_wear || []).map(name => ({ name, hex: colorToHex[name] || '#CCCCCC' })),
        avoid: (recs.colors_to_avoid || []).map(name => ({ name, hex: colorToHex[name] || '#CCCCCC' })),
      });
    }
  }, [analysisResult]);

  const handleRetake = () => {
    clearAnalysis();
    localStorage.removeItem('analysisResult');
    onBack();
  };

  // Empty state
  if (!analysisResult) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-10 text-center gap-6"
        style={{ background: 'linear-gradient(135deg, #FFF1F2 0%, #FFF5F7 50%, #FFF7F0 100%)' }}
      >
        <div className="w-20 h-20 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-300">
          <RefreshCcw size={36} />
        </div>
        <h2 className="text-2xl font-bold luxury-font text-[#1C1917]">No Active Analysis</h2>
        <p className="text-sm text-[#9CA3AF] max-w-xs leading-relaxed">
          Please upload a photo to identify your ideal colour palette.
        </p>
        <Button variant="rose" onClick={onBack}>Start Analysis</Button>
      </div>
    );
  }

  const skinHex = skinToneHex[analysisResult.skin_tone] || '#E8C8A8';

  return (
    <div
      className="min-h-screen w-full flex flex-col max-w-2xl mx-auto"
      style={{ background: 'linear-gradient(135deg, #FFF1F2 0%, #FFF5F7 50%, #FFF7F0 100%)' }}
    >
      {/* Background blobs */}
      <div className="fixed -top-24 -right-16 w-72 h-72 rounded-full bg-rose-100/50 blur-[80px] pointer-events-none" />
      <div className="fixed bottom-0 -left-10 w-64 h-64 rounded-full bg-pink-100/40 blur-[80px] pointer-events-none" />

      {/* ── Sticky Header ── */}
      <header
        className="sticky top-0 z-20 flex items-center justify-between px-5 py-3 backdrop-blur-md"
        style={{ background: 'rgba(255,241,242,0.85)', borderBottom: '1px solid rgba(254,205,211,0.3)' }}
      >
        <button
          id="color-rec-back"
          onClick={onBack}
          className="w-11 h-11 rounded-full bg-white/80 shadow-sm border border-rose-100 flex items-center justify-center text-[#6B7280] hover:text-rose-500 transition-all"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 border border-rose-100 shadow-sm">
          <Sparkles size={13} className="text-rose-400" />
          <span className="text-[9px] uppercase tracking-widest font-black text-[#1C1917]">Analysis Result</span>
        </div>

        <button
          id="color-rec-retake"
          onClick={handleRetake}
          className="text-[9px] font-black uppercase tracking-wider text-rose-400 hover:text-rose-600 transition-colors px-2"
        >
          Retake
        </button>
      </header>

      {/* ── Content ── */}
      <div className="flex-1 px-5 pb-28 space-y-8 overflow-x-hidden pt-8">

        {/* Page Title */}
        <div className="text-center space-y-2">
          <p className="text-[9px] uppercase tracking-[0.4em] font-black text-rose-400">
            {analysisResult.skin_tone} Skin Tone
          </p>
          <h1 className="text-3xl md:text-4xl font-bold luxury-font leading-tight text-[#1C1917]">
            Your Ideal<br />
            <span className="italic text-rose-400">Colour Palette.</span>
          </h1>
        </div>

        {/* Skin Tone Badge */}
        <SkinToneBadge
          tone={analysisResult.skin_tone || 'Unknown'}
          hex={skinHex}
          confidence={analysisResult.confidence}
        />

        {/* ── Best Match Colors ── */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl p-6"
            style={{
              background: 'rgba(255,255,255,0.80)',
              backdropFilter: 'blur(12px)',
              border: '1.5px solid rgba(254,205,211,0.4)',
              boxShadow: '0 8px 28px rgba(244,63,94,0.07)',
            }}
          >
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                <CheckCircle size={16} />
              </div>
              <h2 className="text-[11px] uppercase tracking-[0.2em] font-black text-[#1C1917]">
                Best Matches
              </h2>
              <span className="ml-auto text-[9px] text-rose-300 font-bold uppercase tracking-wider">
                {palette.best.length} Colors
              </span>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-6 gap-3">
              {palette.best.length > 0 ? palette.best.map((c, i) => (
                <motion.div
                  key={`${c.name}-${i}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                  className="group flex flex-col items-center"
                >
                  <div
                    className="w-full aspect-square rounded-2xl shadow-sm border border-black/5 mb-1.5 hover:scale-110 transition-transform cursor-pointer"
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                  <p className="text-[7px] font-bold text-center text-[#9CA3AF] truncate w-full uppercase tracking-wide">
                    {c.name}
                  </p>
                </motion.div>
              )) : (
                <div className="col-span-full py-4 text-center text-[10px] text-[#9CA3AF]">
                  No colours identified
                </div>
              )}
            </div>
          </motion.div>
        </section>


        {/* ── CTA ── */}
        <div className="space-y-4 pt-4">
          <Button
            id="color-rec-shop"
            variant="rose"
            size="lg"
            className="w-full shadow-rose-glow"
            onClick={onNext}
          >
            <ShoppingBag size={18} />
            Explore Full Catalogue
          </Button>

          <p className="text-center text-[8px] uppercase tracking-widest font-bold text-rose-200">
            Neural Engine v5 · Live Sync
          </p>
          
          <div className="flex justify-center pb-8">
            <button 
              onClick={handleRetake}
              className="text-[10px] font-black uppercase tracking-widest text-[#9CA3AF] hover:text-rose-400 transition-colors"
            >
              Not right? Retake Analysis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorRecommendations;
