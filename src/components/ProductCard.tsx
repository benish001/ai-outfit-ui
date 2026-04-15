import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ShoppingCart, ExternalLink } from 'lucide-react';
import { AffiliateDisclaimer } from './Disclosure';

export interface PriceData {
  platform: string;
  price: number;
  currency: string;
  availability: string;
  updated_at: string;
  affiliate_url: string;
}

export interface ProductProps {
  id: number;
  slug: string;
  title: string;
  brand: string;
  image_url: string;
  prices: PriceData[];
}

const PriceRow: React.FC<{ data: PriceData }> = ({ data }) => {
  const updatedTime = formatDistanceToNow(new Date(data.updated_at), { addSuffix: true });
  
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-zinc-800 last:border-0 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors px-2 rounded-lg">
      <div className="flex flex-col">
        <span className="text-sm font-semibold capitalize text-gray-700 dark:text-zinc-300">{data.platform}</span>
        <span className="text-[10px] text-gray-400">Updated {updatedTime}</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <span className="text-base font-bold text-green-600 dark:text-green-400">
            {data.currency} {data.price.toLocaleString('en-IN')}
          </span>
          <p className="text-[10px] text-gray-400">{data.availability}</p>
        </div>
        <a
          href={data.affiliate_url}
          target="_blank"
          rel="nofollow sponsored"
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
        >
          Check Price <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};

export const ProductCard: React.FC<{ product: ProductProps }> = ({ product }) => {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow">
      <div className="aspect-square relative overflow-hidden bg-gray-50 dark:bg-zinc-800">
        <img 
          src={product.image_url} 
          alt={product.title} 
          className="w-full h-full object-contain p-4 hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md px-2 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider text-gray-500">
          {product.brand}
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-900 dark:text-zinc-100 line-clamp-2 mb-4 leading-tight">
          {product.title}
        </h3>
        
        <div className="bg-gray-50 dark:bg-zinc-900/50 rounded-xl p-1 mb-2">
          {product.prices.length > 0 ? (
            product.prices.map((p) => <PriceRow key={p.platform} data={p} />)
          ) : (
            <div className="py-8 text-center text-xs text-gray-400">
              Checking real-time prices...
            </div>
          )}
        </div>
        
        <AffiliateDisclaimer />
      </div>
    </div>
  );
};
