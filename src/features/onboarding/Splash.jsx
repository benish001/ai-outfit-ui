import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Heart } from 'lucide-react';
import Button from '../../components/ui/Button';

/**
 * Splash — Hero landing screen.
 * Gradient: Warm rose-pink → blush → soft coral.
 */
const Splash = ({ onNext }) => {
  const [isNavigating, setIsNavigating] = useState(false);

  // Pre-fetch next routes to eliminate lazy-loading lag
  const prefetchNext = () => {
    import('../onboarding/GenderSelect');
  };

  const handleStart = () => {
    setIsNavigating(true);
    onNext();
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-6 overflow-hidden">

      {/* ── HIGH PERFORMANCE BACKGROUND (Fixed layer) ── */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background: 'linear-gradient(155deg, #FF6B8A 0%, #FF8C9E 20%, #FFAAB8 45%, #FFB8C6 65%, #D4939E 85%, #B07087 100%)',
          willChange: 'transform'
        }}
      />

      {/* ── Background depth blobs ── */}
      <div className="absolute top-[-15%] right-[-10%] w-[400px] h-[400px] rounded-full bg-white/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-12%] left-[-8%] w-[500px] h-[500px] rounded-full bg-[#8B1A4A]/15 blur-[130px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center space-y-8 py-10">

        {/* ── Brand Logo ── */}
        <motion.div
          animate={{ scale: [0.96, 1.02, 0.96] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="w-24 h-24 md:w-32 md:h-32 rounded-[28px] md:rounded-[36px] flex items-center justify-center shadow-2xl"
          style={{
            background: 'rgba(255,255,255,0.18)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1.5px solid rgba(255,255,255,0.35)',
          }}
        >
          <svg viewBox="0 0 80 80" fill="none" className="w-12 h-12 md:w-16 md:h-16">
            <circle cx="40" cy="30" r="16" fill="rgba(255,255,255,0.9)" />
            <path d="M15 64C15 50.745 26.193 40 40 40C53.807 40 65 50.745 65 64" stroke="rgba(255,255,255,0.9)" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </motion.div>

        {/* ── Wordmark ── */}
        <div className="text-center space-y-2">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold text-white tracking-tight leading-none luxury-font"
          >
            Tone<span className="italic font-light opacity-75">Wear</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            className="text-[9px] md:text-[10px] uppercase tracking-[0.45em] font-bold text-white font-poppins"
          >
            Your Skin · Your Style
          </motion.p>
        </div>

        {/* ── Feature Chips ── */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {['Daily Dot & Key Offers', 'Global Product Search', 'Direct Affiliate Checkout'].map((chip) => (
            <div
              key={chip}
              className="px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider text-white border border-white/25 backdrop-blur-md"
              style={{ background: 'rgba(255,255,255,0.15)' }}
            >
              {chip}
            </div>
          ))}
        </div>

        {/* ── CTA Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full card-contained"
          style={{
            background: 'rgba(255,255,255,0.18)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1.5px solid rgba(255,255,255,0.3)',
            borderRadius: '28px',
            padding: '28px 24px',
          }}
        >
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg"
                style={{ background: 'rgba(255,255,255,0.25)' }}
              >
                <Heart size={15} fill="white" />
              </div>
              <p className="text-white/80 text-xs leading-snug font-medium">
                Discover <strong className="text-white">daily offer products</strong> from Dot & Key <br className="hidden sm:block" />
                and find products quickly with one search.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {['Daily Deals', 'Dot & Key Only', 'Updated Offers'].map((tag) => (
                <div
                  key={tag}
                  className="px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-wider text-white border border-white/30"
                  style={{ background: 'rgba(255,255,255,0.18)' }}
                >
                  {tag}
                </div>
              ))}
            </div>

            <Button
              variant="secondary"
              size="lg"
              className="w-full bg-white text-[#1C1917] hover:bg-rose-50 border-0 group active:scale-95 transition-all"
              onClick={handleStart}
              onPointerEnter={prefetchNext}
              onTouchStart={prefetchNext}
              disabled={isNavigating}
              id="splash-get-started"
            >
              {isNavigating ? 'Loading...' : 'Get Started'}
              {!isNavigating && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
            </Button>
          </div>
        </motion.div>

        <p className="text-[8px] uppercase tracking-[0.35em] font-bold text-white/40 text-center">
          Daily Affiliate Beauty Offers
        </p>
      </div>
    </div>
  );
};

export default Splash;
