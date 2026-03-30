import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Info, Check } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const SkinToneSelect = ({ onNext, onBack }) => {
  const [tone, setTone] = useState('medium');
  const [undertone, setUndertone] = useState('neutral');

  const tones = [
    { id: 'light', label: 'Light', color: '#FCE6D2', desc: 'Fair, ivory or beige' },
    { id: 'medium', label: 'Medium', color: '#E0AC69', desc: 'Olive, tan or honey' },
    { id: 'dark', label: 'Dark', color: '#8D5524', desc: 'Deep, rich or ebony' }
  ];

  const undertones = [
    { id: 'warm', label: 'Warm', color: '#FFF3E0' },
    { id: 'cool', label: 'Cool', color: '#E3F2FD' },
    { id: 'neutral', label: 'Neutral', color: '#F5F5F5' }
  ];

  const handleNext = () => {
    localStorage.setItem('tonewear_onboarding_skin', JSON.stringify({
      tone,
      undertone,
      timestamp: new Date().getTime()
    }));
    onNext();
  };

  return (
    <div className="h-[100dvh] w-full bg-[#f8f8f8] p-4 md:p-5 flex flex-col max-w-2xl mx-auto overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 md:mb-6 shrink-0">
        <button onClick={onBack} className="p-2 -ml-2 hover:opacity-100 opacity-40 transition-opacity">
           <ChevronLeft size={22} />
        </button>
        <div className="flex gap-2">
           <div className="w-8 md:w-10 h-1 rounded-full bg-orange-vibrant" />
           <div className="w-8 md:w-10 h-1 rounded-full bg-orange-vibrant text-black" />
           <div className="w-8 md:w-10 h-1 rounded-full bg-black/5" />
        </div>
        <button className="p-2 opacity-40 hover:opacity-100 transition-opacity">
           <Info size={20} />
        </button>
      </div>

      <div className="space-y-1 mb-4 md:mb-6 shrink-0 text-center md:text-left">
        <p className="text-[9px] uppercase tracking-[0.3em] font-black text-muted">Step 2 of 3</p>
        <h1 className="text-2xl md:text-5xl font-bold luxury-font leading-tight">
          Refine Your<br />
          <span className="italic text-[#A18CD1]">Complexion.</span>
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 md:space-y-6">
        {/* Tones Selection */}
        <section className="space-y-3">
          <label className="text-[9px] uppercase tracking-[0.2em] font-black opacity-30">Select Base Tone</label>
          <div className="grid grid-cols-1 gap-3 md:gap-4">
            {tones.map((t) => (
              <motion.div
                key={t.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => setTone(t.id)}
                className={`relative flex items-center gap-4 p-3 md:p-4 rounded-[16px] md:rounded-[20px] cursor-pointer transition-all duration-300 border-2 ${
                  tone === t.id ? 'bg-white border-black shadow-lg' : 'bg-white/50 border-transparent hover:border-black/5'
                }`}
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl shadow-inner border border-black/5 shrink-0" style={{ backgroundColor: t.color }} />
                <div className="flex-1">
                  <h3 className="text-xs md:text-sm font-bold uppercase tracking-widest">{t.label}</h3>
                  <p className="text-[9px] md:text-[10px] text-muted font-medium">{t.desc}</p>
                </div>
                {tone === t.id && (
                  <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-black text-white flex items-center justify-center">
                    <Check size={12} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* Undertones Chips */}
        <section className="space-y-4 pb-4">
           <label className="text-[9px] uppercase tracking-[0.2em] font-black opacity-30">Identify Undertone</label>
           <div className="flex flex-wrap gap-2">
             {undertones.map((u) => (
               <button
                key={u.id}
                onClick={() => setUndertone(u.id)}
                className={`px-4 py-2 md:px-6 md:py-3 rounded-full text-[8px] md:text-[9px] uppercase tracking-widest font-black border transition-all ${
                  undertone === u.id 
                  ? 'bg-black text-white border-black shadow-md' 
                  : 'bg-white text-black border-black/5 hover:border-black/20'
                }`}
                style={undertone === u.id ? {} : { backgroundColor: u.color }}
               >
                 {u.label}
               </button>
             ))}
           </div>
        </section>
      </div>

      {/* CTA */}
      <div className="pt-3 md:pt-4 shrink-0">
        <Button 
          variant="primary" 
          size="lg" 
          className="w-full bg-[#A18CD1] text-white shadow-[#A18CD1]/20 py-4 md:py-5"
          onClick={handleNext}
        >
          View Recommendations
        </Button>
      </div>
    </div>
  );
};

export default SkinToneSelect;
