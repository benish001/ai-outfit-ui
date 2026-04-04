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
      className="min-h-[100dvh] w-full flex flex-col items-center justify-center p-6 md:p-10 overflow-x-hidden overflow-y-auto selection:bg-rose-100 selection:text-[#1C1917]"
      style={{ background: 'linear-gradient(135deg, #FFF1F2 0%, #FFF5F7 50%, #FFF7F0 100%)' }}
    >
      {/* Background aura */}
      <div className="fixed -top-10 -left-10 w-80 h-80 rounded-full bg-rose-100/60 blur-[100px] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-0 w-80 h-80 rounded-full bg-pink-100/50 blur-[100px] pointer-events-none z-0" />

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10 w-full max-w-md flex flex-col items-center"
      >
        {/* Header */}
        <div className="text-center mb-10 md:mb-12">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-rose-100 mb-6 shadow-sm backdrop-blur-sm"
          >
            <Sparkles size={12} className="text-rose-400" />
            <span className="text-[9px] uppercase tracking-widest font-black text-rose-400">Step 1 of 3</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-black luxury-font tracking-tight text-[#1C1917] leading-[1.1]"
          >
            Who are we<br />
            <span className="italic text-rose-400">styling today?</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            className="mt-4 text-[10px] uppercase tracking-[0.3em] font-bold text-[#9CA3AF]"
          >
            Select your preference
          </motion.p>
        </div>

        {/* Option Cards */}
        <div className="w-full grid grid-cols-1 gap-4 md:gap-6">
          {options.map((opt, i) => (
            <motion.button
              key={opt.id}
              id={`gender-${opt.id}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.45, ease: 'easeOut' }}
              whileHover={{ scale: 1.015, y: -2 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => onSelect(opt.id)}
              className="w-full text-left group relative overflow-hidden rounded-[32px] p-6 md:p-8 transition-all hover:shadow-xl"
              style={{
                background: 'rgba(255,255,255,0.85)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1.5px solid rgba(254,205,211,0.5)',
                boxShadow: '0 8px 32px rgba(244,63,94,0.08), 0 2px 8px rgba(0,0,0,0.03)',
              }}
            >
              {/* Hover gradient sweep */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none"
                style={{ background: `linear-gradient(135deg, ${opt.from}22 0%, ${opt.to}22 100%)` }}
              />

              <div className="flex items-center gap-5 md:gap-7 relative z-10">
                <div
                  className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center shrink-0 shadow-soft transition-transform group-hover:scale-105 duration-500"
                  style={{ background: `linear-gradient(135deg, ${opt.from}, ${opt.to})` }}
                >
                  <opt.icon size={28} color={opt.iconColor} strokeWidth={2.5} />
                </div>

                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-black luxury-font text-[#1C1917] tracking-tight">
                    {opt.label}
                  </h3>
                  <p className="text-xs md:text-sm text-[#9CA3AF] font-bold mt-1 uppercase tracking-widest opacity-70 italic">{opt.id === 'female' ? 'Elegance' : 'Confidence'}</p>
                  <p className="text-[10px] text-[#9CA3AF] font-medium mt-1 uppercase tracking-wider line-clamp-1">{opt.subLabel}</p>
                </div>

                <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-[#9CA3AF] group-hover:text-rose-500 group-hover:bg-rose-50 transition-all border border-transparent group-hover:border-rose-100">
                  <ChevronRight size={20} />
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.5 }}
          className="mt-10 md:mt-12 text-center text-[10px] text-[#9CA3AF] font-bold uppercase tracking-[0.2em] max-w-[280px] leading-relaxed"
        >
          Curated silhouettes for your unique profile.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default GenderSelect;
