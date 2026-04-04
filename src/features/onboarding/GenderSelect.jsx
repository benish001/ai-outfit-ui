import React from 'react';
import { motion } from 'framer-motion';
import { User, Users, ChevronRight, Sparkles } from 'lucide-react';

/**
 * GenderSelect — Pink-gradient background, glass-card style options.
 */
const GenderSelect = ({ onSelect }) => {
  const options = [
    {
      id: 'female',
      label: 'Woman',
      subLabel: 'Dresses, Sarees, Kurtis & more',
      icon: User,
      from: '#FECDD3',
      to: '#FDA4AF',
      iconColor: '#BE123C',
    },
    {
      id: 'male',
      label: 'Man',
      subLabel: 'Shirts, Trousers, Ethnic & more',
      icon: Users,
      from: '#BAE6FD',
      to: '#7DD3FC',
      iconColor: '#0369A1',
    },
  ];

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center p-6 md:p-10 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #FFF1F2 0%, #FFF5F7 50%, #FFF7F0 100%)' }}
    >
      {/* Background aura */}
      <div className="fixed -top-24 -left-24 w-72 h-72 rounded-full bg-rose-100/70 blur-[80px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-64 h-64 rounded-full bg-pink-100/60 blur-[80px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 border border-rose-100 mb-5">
            <Sparkles size={12} className="text-rose-400" />
            <span className="text-[9px] uppercase tracking-widest font-black text-rose-400">Step 1 of 3</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold luxury-font tracking-tight text-[#1C1917] leading-tight">
            Who are we<br />
            <span className="italic text-rose-400">styling today?</span>
          </h1>
          <p className="mt-3 text-[10px] uppercase tracking-[0.25em] font-bold text-[#9CA3AF]">
            Select your preference
          </p>
        </div>

        {/* Option Cards */}
        <div className="grid grid-cols-1 gap-4 md:gap-5">
          {options.map((opt, i) => (
            <motion.button
              key={opt.id}
              id={`gender-${opt.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12, duration: 0.5, ease: 'easeOut' }}
              whileHover={{ scale: 1.02, y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(opt.id)}
              className="w-full text-left group relative overflow-hidden rounded-3xl p-6 md:p-7"
              style={{
                background: 'rgba(255,255,255,0.85)',
                backdropFilter: 'blur(12px)',
                border: '1.5px solid rgba(254,205,211,0.5)',
                boxShadow: '0 8px 24px rgba(244,63,94,0.08), 0 2px 8px rgba(0,0,0,0.04)',
              }}
            >
              {/* Hover gradient sweep */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `linear-gradient(135deg, ${opt.from}18 0%, ${opt.to}18 100%)` }}
              />

              <div className="flex items-center gap-5 relative z-10">
                <div
                  className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
                  style={{ background: `linear-gradient(135deg, ${opt.from}, ${opt.to})` }}
                >
                  <opt.icon size={26} color={opt.iconColor} strokeWidth={2} />
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-bold luxury-font text-[#1C1917] tracking-tight">
                    {opt.label}
                  </h3>
                  <p className="text-xs text-[#9CA3AF] font-medium mt-0.5">{opt.subLabel}</p>
                </div>

                <div className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-[#9CA3AF] group-hover:text-[#F43F5E] group-hover:bg-rose-50 transition-all">
                  <ChevronRight size={18} />
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        <p className="mt-8 text-center text-[10px] text-[#9CA3AF] font-medium max-w-xs mx-auto leading-relaxed">
          This helps our AI curate the right silhouettes and styles for your profile.
        </p>
      </div>
    </div>
  );
};

export default GenderSelect;
