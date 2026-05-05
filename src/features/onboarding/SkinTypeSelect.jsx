import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Droplets, Shield, Sparkles, Leaf } from 'lucide-react';
import Button from '../../components/ui/Button';

const SKIN_TYPES = [
  {
    id: 'normal',
    label: 'Normal',
    hint: 'Balanced skin with no major concerns',
    icon: Sparkles,
    from: '#FBCFE8',
    to: '#FDA4AF',
  },
  {
    id: 'oily',
    label: 'Oily',
    hint: 'Shine, enlarged pores, acne-prone',
    icon: Droplets,
    from: '#BBF7D0',
    to: '#86EFAC',
  },
  {
    id: 'dry',
    label: 'Dry',
    hint: 'Tightness, dullness, dehydration',
    icon: Leaf,
    from: '#FDE68A',
    to: '#FCD34D',
  },
  {
    id: 'combination',
    label: 'Combination',
    hint: 'Oily T-zone with dry or normal cheeks',
    icon: Shield,
    from: '#BFDBFE',
    to: '#93C5FD',
  },
  {
    id: 'sensitive',
    label: 'Sensitive',
    hint: 'Irritation, redness, reactivity',
    icon: Shield,
    from: '#E9D5FF',
    to: '#D8B4FE',
  },
];

const SkinTypeSelect = ({ onNext, onBack }) => {
  const [selected, setSelected] = useState(() => localStorage.getItem('beauty_skin_type') || 'normal');

  const handleContinue = () => {
    localStorage.setItem('beauty_skin_type', selected);
    onNext();
  };

  return (
    <div
      className="min-h-[100dvh] w-full flex flex-col justify-between p-6 md:p-8 max-w-2xl mx-auto"
      style={{ background: 'linear-gradient(135deg, #FFF1F2 0%, #FFF5F7 50%, #FFF7F0 100%)' }}
    >
      <div className="fixed -top-10 -right-10 w-64 h-64 rounded-full bg-rose-100/60 blur-[90px] pointer-events-none" />
      <div className="fixed -bottom-12 -left-8 w-64 h-64 rounded-full bg-pink-100/45 blur-[90px] pointer-events-none" />

      <div className="relative z-10 pt-4">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="w-11 h-11 rounded-full bg-white/80 border border-rose-100 shadow-sm flex items-center justify-center text-[#6B7280] hover:text-rose-500"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex gap-2">
            <div className="w-8 h-1.5 rounded-full bg-rose-400" />
            <div className="w-8 h-1.5 rounded-full bg-rose-400" />
            <div className="w-8 h-1.5 rounded-full bg-rose-400" />
          </div>
          <div className="w-11" />
        </div>

        <p className="text-[9px] uppercase tracking-[0.35em] font-black text-rose-300 mb-2">Step 3 of 3</p>
        <h1 className="text-3xl md:text-4xl font-bold luxury-font text-[#1C1917] leading-tight mb-2">
          Choose Your
          <span className="italic text-rose-400"> Skin Type</span>
        </h1>
        <p className="text-sm text-[#9CA3AF] font-medium">
          We will tune Dot & Key recommendations for your skin profile.
        </p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SKIN_TYPES.map((type) => {
            const Icon = type.icon;
            const isActive = selected === type.id;
            return (
              <motion.button
                key={type.id}
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelected(type.id)}
                className={`text-left p-4 rounded-2xl border transition-all ${
                  isActive
                    ? 'border-rose-300 bg-white shadow-md'
                    : 'border-rose-100 bg-white/80 hover:border-rose-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${type.from}, ${type.to})` }}
                  >
                    <Icon size={18} className="text-[#1C1917]" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-[#1C1917] uppercase tracking-wide">{type.label}</p>
                    <p className="text-[11px] text-[#9CA3AF] mt-0.5 leading-snug">{type.hint}</p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="relative z-10 pb-4 pt-8">
        <Button
          variant="rose"
          size="lg"
          className="w-full"
          onClick={handleContinue}
          disabled={!selected}
        >
          Continue to Products
        </Button>
      </div>
    </div>
  );
};

export default SkinTypeSelect;

