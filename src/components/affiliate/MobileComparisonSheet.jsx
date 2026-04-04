import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, ChevronRight } from 'lucide-react';
import PlatformLogo from './PlatformLogo';
import PriceTag from './PriceTag';

/**
 * Mobile bottom sheet for a complete quick-look across all platforms
 */
const MobileComparisonSheet = ({ isOpen, onClose, product, platforms = [], onSelectPlatform }) => {
  const sortedPlatforms = [...platforms].sort((a, b) => a.currentPrice - b.currentPrice);
  const bestDeal = sortedPlatforms[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-sm"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-[1001] bg-white rounded-t-[32px] overflow-hidden flex flex-col max-h-[85vh]"
            style={{
              boxShadow: '0 -20px 40px rgba(0,0,0,0.1)',
            }}
          >
            {/* Handle & Header */}
            <div className="px-6 pt-4 pb-2 bg-white sticky top-0 z-10 border-b border-rose-50">
              <div className="w-12 h-1.5 bg-rose-100 rounded-full mx-auto mb-4" />
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold luxury-font text-[#1C1917]">Compare Prices</h2>
                  <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest mt-1">
                    {platforms.length} Stores Available
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center hover:bg-rose-100 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Platform List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24 safe-bottom">
              {sortedPlatforms.map((platform, index) => {
                const isBest = index === 0;
                const difference = isBest ? 0 : platform.currentPrice - bestDeal.currentPrice;

                return (
                  <button
                    key={platform.name}
                    onClick={() => {
                        onSelectPlatform(platform);
                        onClose();
                    }}
                    className={`w-full text-left p-4 rounded-[24px] flex items-center justify-between transition-all active:scale-95 ${
                      isBest 
                        ? 'border-2 border-emerald-400 bg-emerald-50 shadow-md' 
                        : 'border border-rose-100 bg-white hover:bg-rose-50 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <PlatformLogo platform={platform.name} size="lg" />
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-[#1C1917]">{platform.name}</h4>
                        <PriceTag 
                          currentPrice={platform.currentPrice} 
                          originalPrice={platform.originalPrice} 
                          size="sm" 
                          isBestDeal={isBest}
                        />
                        {isBest && (
                          <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-500 text-white text-[8px] font-black uppercase tracking-widest mt-1">
                            Best Deal
                          </span>
                        )}
                        {!isBest && difference > 0 && (
                          <span className="text-[9px] font-medium text-rose-400 uppercase tracking-wider">
                            +₹{difference.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm border border-rose-50 text-[#9CA3AF]">
                       <ChevronRight size={18} />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Sticky Bottom Context */}
            <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md p-4 border-t border-rose-50 pb-[calc(1rem+env(safe-area-inset-bottom))] flex justify-center">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#9CA3AF] flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  100% Genuine Products
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default React.memo(MobileComparisonSheet);
