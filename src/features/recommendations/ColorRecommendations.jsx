import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Sparkles, AlertCircle, ShoppingBag } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const ColorRecommendations = ({ onNext, onBack }) => {
  const [palette, setPalette] = useState({ best: [], avoid: [] });

  useEffect(() => {
    const onboardingSkin = JSON.parse(localStorage.getItem('tonewear_onboarding_skin') || '{}');
    const gender = localStorage.getItem('tonewear_gender') || 'female';
    const { tone = 'medium', undertone = 'neutral' } = onboardingSkin;

    const getColorPalette = (g, t, u) => {
      const data = {
        light: {
          warm: {
            best: [
              { name: 'Champagne Soft', hex: '#F7E7CE' },
              { name: 'Peach Sorbet', hex: '#FFDAB9' },
              { name: 'Golden Sand', hex: '#E6BE8A' },
              { name: 'Sage Green', hex: '#9CA986' },
              { name: 'Warm Cream', hex: '#FFFDD0' }
            ],
            avoid: [
              { name: 'Electric Blue', hex: '#7DF9FF' },
              { name: 'Magenta', hex: '#FF00FF' },
              { name: 'Dark Ash', hex: '#54626F' }
            ]
          },
          cool: {
            best: [
              { name: 'Sky Blue', hex: '#87CEEB' },
              { name: 'Soft Lavender', hex: '#E6E6FA' },
              { name: 'Dusty Rose', hex: '#C08081' },
              { name: 'Silver Mist', hex: '#C0C0C0' },
              { name: 'Mint Frost', hex: '#98FF98' }
            ],
            avoid: [
              { name: 'Orange Burst', hex: '#FF4500' },
              { name: 'Mustard Gold', hex: '#FFDB58' },
              { name: 'Olive Drab', hex: '#6B8E23' }
            ]
          },
          neutral: {
            best: [
              { name: 'Soft Jade', hex: '#00A86B' },
              { name: 'Cornflower Blue', hex: '#6495ED' },
              { name: 'Mauve Shadow', hex: '#915F6D' },
              { name: 'Light Slate', hex: '#778899' },
              { name: 'Blush Pink', hex: '#FFB6C1' }
            ],
            avoid: [
              { name: 'Neon Green', hex: '#39FF14' },
              { name: 'Bright Yellow', hex: '#FFFF00' }
            ]
          }
        },
        medium: {
          warm: {
            best: [
              { name: 'Terracotta', hex: '#E2725B' },
              { name: 'Warm Mustard', hex: '#E1AD01' },
              { name: 'Burnt Coral', hex: '#E9897E' },
              { name: 'Honey Gold', hex: '#AF8E44' },
              { name: 'Earth Brown', hex: '#674D3C' }
            ],
            avoid: [
              { name: 'Icy Blue', hex: '#AFEEEE' },
              { name: 'Pale Lavender', hex: '#DCD0FF' }
            ]
          },
          cool: {
            best: [
              { name: 'Emerald Green', hex: '#50C878' },
              { name: 'Royal Blue', hex: '#4169E1' },
              { name: 'Deep Plum', hex: '#673147' },
              { name: 'Teal Depth', hex: '#008080' },
              { name: 'Charcoal Noir', hex: '#333333' }
            ],
            avoid: [
              { name: 'Pale Yellow', hex: '#FFFFE0' },
              { name: 'Light Apricot', hex: '#FFB280' }
            ]
          },
          neutral: {
            best: [
              { name: 'Dove Grey', hex: '#6D6E71' },
              { name: 'Laguna Blue', hex: '#457B9D' },
              { name: 'Warm Taupe', hex: '#483C32' },
              { name: 'Sage Bush', hex: '#A89985' },
              { name: 'Rustic Red', hex: '#BA0021' }
            ],
            avoid: [
              { name: 'Hot Neon', hex: '#FF3131' },
              { name: 'Bright Mint', hex: '#00FF7F' }
            ]
          }
        },
        dark: {
          warm: {
            best: [
              { name: 'Rich Ochre', hex: '#CC7722' },
              { name: 'Deep Magenta', hex: '#8B008B' },
              { name: 'Forest Green', hex: '#228B22' },
              { name: 'Burnt Copper', hex: '#B87333' },
              { name: 'Gold Rush', hex: '#FFD700' }
            ],
            avoid: [
              { name: 'Pale Pink', hex: '#FADADD' },
              { name: 'Grey Ash', hex: '#B2BEB5' }
            ]
          },
          cool: {
            best: [
              { name: 'Cobalt Night', hex: '#0047AB' },
              { name: 'Cardinal Red', hex: '#C41E3A' },
              { name: 'Royal Purple', hex: '#6A0DAD' },
              { name: 'Ice Blue', hex: '#99FFFF' },
              { name: 'Vibrant Mint', hex: '#16D081' }
            ],
            avoid: [
              { name: 'Dull Brown', hex: '#5C4033' },
              { name: 'Brick Tan', hex: '#D2B48C' }
            ]
          },
          neutral: {
            best: [
              { name: 'Pure White', hex: '#FFFFFF' },
              { name: 'Charcoal Luxe', hex: '#2E2E2E' },
              { name: 'Bright Yellow', hex: '#FFFF00' },
              { name: 'Rose Gold', hex: '#B76E79' },
              { name: 'Electric Indigo', hex: '#6F00FF' }
            ],
            avoid: [
              { name: 'Beige', hex: '#F5F5DC' },
              { name: 'Muddy Grey', hex: '#708090' }
            ]
          }
        }
      };

      let result = data[t]?.[u] || data.medium.neutral;
      
      // If gender is male, rename some colors to be more masculine/neutral if desired
      if (g === 'male') {
        result = {
          best: result.best.map(c => ({
            ...c,
            name: c.name.replace('Pink', 'Rosewood').replace('Peach', 'Sandstone').replace('Blush', 'Misted')
          })),
          avoid: result.avoid.map(c => ({
            ...c,
            name: c.name.replace('Pink', 'Rosewood')
          }))
        };
      }
      return result;
    };

    const newPalette = getColorPalette(gender, tone, undertone);
    setPalette(newPalette);

    // Save for ProductDiscovery
    localStorage.setItem('tonewear_onboarding', JSON.stringify({
      bestColors: newPalette.best,
      avoidColors: newPalette.avoid,
      timestamp: new Date().getTime()
    }));
  }, []);

  return (
    <div className="h-[100dvh] w-full bg-[#f8f8f8] p-5 flex flex-col max-w-3xl mx-auto overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6 shrink-0">
         <button onClick={onBack} className="p-2 -ml-2 hover:opacity-100 opacity-40 transition-opacity">
            <ChevronLeft size={22} />
         </button>
         <div className="bg-white border border-black/5 rounded-full px-3 py-1 flex items-center gap-2">
            <Sparkles size={12} className="text-[#A18CD1]" />
            <span className="text-[9px] uppercase tracking-widest font-black opacity-30 text-nowrap">Neural Analysis Ready</span>
         </div>
      </div>

      <div className="space-y-1 mb-6 shrink-0">
        <h1 className="text-2xl md:text-5xl font-bold luxury-font leading-tight text-center">
          Your Personal<br />
          <span className="italic text-brand-dark">Color Palette.</span>
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-8 min-h-0 pb-20">
        {/* ... (keep existing sections) ... */}
        {palette.best.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                 <div className="w-6 h-6 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                    <CheckCircle size={14} />
                 </div>
                 <h2 className="text-[9px] uppercase tracking-[0.2em] font-black">Complementary</h2>
              </div>
            </div>
            
            <div className="grid grid-cols-5 gap-3">
              {palette.best.map((c, i) => (
                <motion.div 
                  key={c.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="group"
                >
                  <div className="aspect-square rounded-xl shadow-soft border border-black/5" style={{ backgroundColor: c.hex }} title={c.name} />
                  <p className="text-[7px] uppercase tracking-tighter font-extrabold text-center mt-2 opacity-30 truncate">{c.name}</p>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {palette.avoid.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
               <div className="w-6 h-6 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                  <AlertCircle size={14} />
               </div>
               <h2 className="text-[9px] uppercase tracking-[0.2em] font-black opacity-40">Avoid</h2>
            </div>
            
            <div className="grid grid-cols-4 gap-3">
              {palette.avoid.map((c) => (
                <div key={c.name} className="opacity-30">
                  <div className="aspect-square rounded-xl border border-black/5" style={{ backgroundColor: c.hex }} title={c.name} />
                  <p className="text-[7px] uppercase tracking-tighter font-bold text-center mt-2 truncate italic">{c.name}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Action Card */}
        <Card variant="elevated" className="bg-brand-dark p-6 flex flex-col items-center text-center space-y-4 shrink-0 overflow-visible relative mt-4">
           <div className="absolute -top-6 -right-6 w-16 h-16 bg-[#FF9A8B] rounded-full blur-2xl opacity-20" />
           <ShoppingBag size={24} className="text-[#FF9A8B]" />
           <h3 className="text-xl text-white luxury-font italic">Ready to Shop?</h3>
           <p className="text-[11px] text-white/40 max-w-xs mx-auto">Neural crawler finds items that match your unique profile.</p>
           
           <Button 
            variant="primary" 
            size="lg" 
            className="w-full bg-white text-black py-4 text-[10px] uppercase font-black"
            onClick={onNext}
           >
              Browse Neural Looks
           </Button>
        </Card>
      </div>

      {/* Info */}
      <div className="py-6 text-center opacity-20">
         <span className="text-[8px] uppercase tracking-widest font-black">Core Engine v5.0</span>
      </div>
    </div>
  );
};

// Helper CheckCircle
const CheckCircle = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export default ColorRecommendations;
