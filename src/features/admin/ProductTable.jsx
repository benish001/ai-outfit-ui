import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, ExternalLink, Image as ImageIcon, Star } from 'lucide-react';
import api from '../../services/api';

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/admin/outfits');
        setProducts(response.data);
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const deleteProduct = async (id) => {
    if (!confirm('Destroy this asset from neural catalog?')) return;
    try {
      await api.delete(`/outfits/${id}`);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert('Deletion failed');
    }
  };

  if (loading) return <div className="p-20 text-center opacity-20 animate-pulse font-black uppercase tracking-widest text-xs">Accessing Inventory Flux...</div>;

  return (
    <div className="bg-white rounded-[40px] shadow-premium overflow-hidden border border-black/5">
      <table className="w-full text-left">
        <thead className="bg-[#fcfcfc] border-b border-black/5">
          <tr>
            <th className="px-10 py-8 text-[9px] uppercase font-black tracking-widest text-muted italic">Asset</th>
            <th className="px-10 py-8 text-[9px] uppercase font-black tracking-widest text-muted italic">Economics</th>
            <th className="px-10 py-8 text-[9px] uppercase font-black tracking-widest text-muted italic">Class</th>
            <th className="px-10 py-8 text-[9px] uppercase font-black tracking-widest text-muted italic">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/5 text-sm">
          {products.map((product) => {
            const getPlatform = (link = '') => {
              const l = link.toLowerCase();
              if (l.includes('amazon')) return { name: 'Amazon', color: '#FF9900' };
              if (l.includes('flipkart')) return { name: 'Flipkart', color: '#2874F0' };
              if (l.includes('myntra')) return { name: 'Myntra', color: '#FF3F6C' };
              if (l.includes('ajio')) return { name: 'Ajio', color: '#1C1C1C' };
              if (l.includes('nykaa')) return { name: 'Nykaa', color: '#FC2779' };
              return { name: 'External', color: '#6B7280' };
            };
            const platform = getPlatform(product.affiliate_link);

            return (
              <motion.tr 
                key={product.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hover:bg-black/[0.02] transition-colors"
              >
                <td className="px-10 py-8">
                  <div className="flex items-center gap-6">
                     <div className="w-16 h-20 rounded-2xl bg-[#f8f8f8] border border-black/5 overflow-hidden shadow-inner flex items-center justify-center">
                        {product.image_url ? (
                          <img src={product.image_url} className="w-full h-full object-contain p-2" />
                        ) : (
                          <ImageIcon size={20} className="text-black/10" />
                        )}
                     </div>
                     <div className="space-y-1">
                        <p className="font-bold luxury-font text-lg tracking-tight">{product.name}</p>
                        <div className="flex items-center gap-3">
                           <span className="text-[10px] uppercase font-black tracking-[0.2em] opacity-30">{product.brand}</span>
                           <div className="w-2.5 h-2.5 rounded-full border border-black/5" style={{ backgroundColor: product.color }} />
                        </div>
                     </div>
                  </div>
                </td>
                <td className="px-10 py-8">
                   <div className="flex flex-col">
                      <span className="font-black text-lg">₹{Number(product.price).toLocaleString('en-IN')}</span>
                      <span className="text-[9px] font-black tracking-widest px-2 py-0.5 rounded-full inline-block mt-1 text-center" style={{ backgroundColor: `${platform.color}15`, color: platform.color }}>
                        {platform.name}
                      </span>
                   </div>
                </td>
                <td className="px-10 py-8">
                  <span className="px-5 py-2 rounded-full bg-black/5 text-[9px] font-black uppercase tracking-widest">
                    {product.category}
                  </span>
                </td>
              <td className="px-10 py-8">
                 <div className="flex items-center gap-4">
                    <button 
                      onClick={() => window.open(product.affiliate_link, '_blank')}
                      className="w-12 h-12 rounded-full bg-orange-vibrant/10 text-orange-vibrant flex items-center justify-center hover:bg-orange-vibrant hover:text-white transition-all shadow-md group"
                    >
                       <ExternalLink size={18} />
                    </button>
                    <button 
                      onClick={() => deleteProduct(product.id)}
                      className="w-12 h-12 rounded-full bg-red-500/10 text-red-600 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-md group"
                    >
                       <Trash2 size={18} />
                    </button>
                 </div>
              </td>
            </motion.tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
