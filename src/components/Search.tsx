import React, { useState } from 'react';
import { Search as SearchIcon, Loader2 } from 'lucide-react';
import { useSearchProducts } from '../hooks/useProducts';
import { ProductCard } from './ProductCard';

export const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [searchVal, setSearchVal] = useState('');
  const { data: products, isLoading, isError } = useSearchProducts(searchVal);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchVal(query);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-zinc-100 mb-4 tracking-tight">
          Find the Best Price, Automatically.
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Searching across Amazon, Flipkart, Ajio, and more to bring you real-time price comparisons.
        </p>
      </div>

      <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-16 px-4">
        <div className="relative group">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for gadgets, fashion, or home decor..."
            className="w-full bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-2xl py-4 pl-14 pr-6 text-lg focus:outline-none focus:border-blue-500 transition-all shadow-lg group-hover:shadow-xl dark:text-zinc-100"
          />
          <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors" />
          <button 
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-semibold transition-all shadow-md active:scale-95"
          >
            Search
          </button>
        </div>
      </form>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
          <p className="text-gray-400 font-medium">Hunting for deals...</p>
        </div>
      )}

      {isError && (
        <div className="text-center py-20 text-red-500 bg-red-50 dark:bg-red-900/10 rounded-3xl">
          Something went wrong. Please try again later.
        </div>
      )}

      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : searchVal && !isLoading && (
        <div className="text-center py-20 text-gray-400">
          No products found for "{searchVal}".
        </div>
      )}
    </div>
  );
};
