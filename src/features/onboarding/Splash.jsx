import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Heart } from 'lucide-react';
import Button from '../../components/ui/Button';

/**
 * Splash — Hero landing screen.
 * Gradient: Warm rose-pink → blush → soft coral.
 * Celebrates all skin tones; product-neutral background.
 */
const Splash = ({ onNext }) => {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-6 overflow-hidden"
      style={{
        background: 'linear-gradient(155deg, #FF6B8A 0%, #FF8C9E 20%, #FFAAB8 45%, #FFB8C6 65%, #D4939E 85%, #B07087 100%)'
      }}
    >
      {/* ── Background depth blobs ── */}
      <div className="absolute top-[-15%] right-[-10%] w-[400px] h-[400px] rounded-full bg-white/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-12%] left-[-8%] w-[500px] h-[500px] rounded-full bg-[#8B1A4A]/15 blur-[130px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-white/5 blur-[60px] pointer-events-none" />

      {/* ── Floating decorative circles ── */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.06, 0.12, 0.06] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-20 left-10 w-24 h-24 rounded-full border border-white/30"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.04, 0.09, 0.04] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-32 right-8 w-40 h-40 rounded-full border border-white/20"
      />

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
          {/* Abstract skin-tone shape */}
          <svg viewBox="0 0 80 80" fill="none" className="w-12 h-12 md:w-16 md:h-16">
            <circle cx="40" cy="30" r="16" fill="rgba(255,255,255,0.9)" />
            <path d="M15 64C15 50.745 26.193 40 40 40C53.807 40 65 50.745 65 64" stroke="rgba(255,255,255,0.9)" strokeWidth="4" strokeLinecap="round"/>
          </svg>
        </motion.div>

        {/* ── Wordmark ── */}
        <div className="text-center space-y-2">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-5xl md:text-6xl font-bold text-white tracking-tight leading-none luxury-font"
          >
            Tone<span className="italic font-light opacity-75">Wear</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-[9px] md:text-[10px] uppercase tracking-[0.45em] font-bold text-white"
          >
            Your Skin · Your Style
          </motion.p>
        </div>

        {/* ── Feature Chips ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-2"
        >
          {['AI Skin Analysis', 'Best Price Finder', '5 Platforms'].map((chip) => (
            <div
              key={chip}
              className="px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider text-white"
              style={{
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.25)',
              }}
            >
              {chip}
            </div>
          ))}
        </motion.div>

        {/* ── CTA Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7 }}
          className="w-full animate-float"
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
                Discover beauty products curated <br className="hidden sm:block" />
                for <strong className="text-white">your unique skin tone.</strong>
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Skin tone swatches — celebrating diversity */}
              {['#F5CBA7', '#E59866', '#CA6F1E', '#9A7D0A', '#784212', '#4A235A'].map((hex) => (
                <div
                  key={hex}
                  className="w-6 h-6 rounded-full border-2 border-white/40 shadow-sm"
                  style={{ backgroundColor: hex }}
                />
              ))}
              <span className="text-white/50 text-[9px] font-bold ml-1 uppercase tracking-widest">All Tones</span>
            </div>

            <Button
              variant="secondary"
              size="lg"
              className="w-full bg-white text-[#1C1917] hover:bg-rose-50 border-0 group"
              onClick={onNext}
              id="splash-get-started"
            >
              Get Started
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </motion.div>

        {/* ── Footer ── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 1.2 }}
          className="text-[8px] uppercase tracking-[0.35em] font-bold text-white text-center"
        >
          Luxury Beauty Intelligence
        </motion.p>
      </div>
    </div>
  );
};

export default Splash;
