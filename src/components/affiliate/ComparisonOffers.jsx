import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Ticket, ExternalLink, Copy, CheckCircle } from 'lucide-react';
import api from '../../services/api';

const ComparisonOffers = ({ category }) => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);

  const fetchRef = useRef(null);
  useEffect(() => {
    if (fetchRef.current === category) return;
    api.get('/outfits/trending/offers', { params: { category } })
      .then(res => setDeals(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
    fetchRef.current = category;
  }, [category]);

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (loading || !deals.length) return null;

  return (
    <div className="p-6 bg-rose-50/30 border-t border-rose-50">
      <div className="flex items-center gap-2 mb-4">
        <Ticket size={16} className="text-rose-500" />
        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#1C1917]">Live Promotions</h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {deals.map((deal, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-rose-100 rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-all group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[8px] font-black uppercase tracking-widest bg-rose-500 text-white px-2 py-0.5 rounded">
                  {deal.platform}
                </span>
                {deal.coupon_code && (
                  <button 
                    onClick={() => copyToClipboard(deal.coupon_code)}
                    className="flex items-center gap-1.5 text-[9px] font-bold text-rose-400 hover:text-rose-600 transition-colors"
                  >
                    {copiedCode === deal.coupon_code ? <CheckCircle size={10} /> : <Copy size={10} />}
                    {deal.coupon_code}
                  </button>
                )}
              </div>
              <p className="text-[11px] font-bold text-[#1C1917] leading-tight mb-3">
                {deal.title}
              </p>
            </div>

            <button
              onClick={() => window.open(deal.link, '_blank')}
              className="w-full py-2 bg-rose-50 text-rose-500 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 group-hover:bg-rose-500 group-hover:text-white transition-all"
            >
              Get Deal <ExternalLink size={10} />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ComparisonOffers;
