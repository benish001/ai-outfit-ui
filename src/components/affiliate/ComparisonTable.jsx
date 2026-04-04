import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, ShoppingCart, ShieldCheck } from 'lucide-react';
import PlatformLogo from './PlatformLogo';
import PriceTag from './PriceTag';

/**
 * Desktop-optimized comparison table.
 * Supports sorting by Price or Delivery.
 */
const ComparisonTable = ({ platforms = [], onSelectPlatform }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'currentPrice', direction: 'asc' });

  const sortedPlatforms = useMemo(() => {
    let sortableItems = [...platforms];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [platforms, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  if (!platforms.length) return null;

  const bestDealPrice = Math.min(...platforms.map(p => p.currentPrice));

  return (
    <div className="w-full bg-white/80 backdrop-blur-xl border border-rose-100 rounded-3xl overflow-hidden shadow-card">
      <div className="flex items-center justify-between p-6 border-b border-rose-50 bg-white/50">
        <h3 className="text-lg font-bold luxury-font text-[#1C1917]">Compare Stores</h3>
        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-full">
           <ShieldCheck size={14} /> Price Match Guarantee
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-rose-50/50 text-[10px] uppercase font-black tracking-widest text-[#9CA3AF]">
              <th className="p-4 pl-6 cursor-pointer hover:bg-rose-50 transition-colors" onClick={() => requestSort('name')}>
                Store {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th className="p-4 cursor-pointer hover:bg-rose-50 transition-colors" onClick={() => requestSort('currentPrice')}>
                Price {sortConfig.key === 'currentPrice' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th className="p-4">Delivery</th>
              <th className="p-4 pr-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rose-50">
            {sortedPlatforms.map((platform, index) => {
              const isBest = platform.currentPrice === bestDealPrice;
              const diff = isBest ? 0 : platform.currentPrice - bestDealPrice;

              return (
                <tr key={platform.id || platform.name} className={`transition-colors hover:bg-rose-50/30 ${isBest ? 'bg-emerald-50/20' : ''}`}>
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <PlatformLogo platform={platform.name} size="sm" />
                      <span className="font-bold text-sm text-[#1C1917]">{platform.name}</span>
                      {isBest && (
                         <span className="ml-2 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest bg-emerald-500 text-white">Best</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <PriceTag 
                        currentPrice={platform.currentPrice} 
                        originalPrice={platform.originalPrice} 
                        size="sm" 
                        isBestDeal={isBest}
                        difference={isBest ? null : diff}
                    />
                  </td>
                  <td className="p-4">
                    <span className="text-xs font-medium text-[#6B7280]">
                      {platform.deliveryEstimate || 'Standard'}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <button
                      onClick={() => onSelectPlatform(platform)}
                      className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        isBest 
                           ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm' 
                           : 'bg-white border border-rose-200 text-rose-500 hover:bg-rose-50'
                      }`}
                    >
                      Buy <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default React.memo(ComparisonTable);
