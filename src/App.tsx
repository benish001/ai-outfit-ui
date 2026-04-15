import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Search } from './components/Search';
import { DisclosureBanner } from './components/Disclosure';
import { ShoppingBag } from 'lucide-react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50 dark:bg-black font-sans selection:bg-blue-100 dark:selection:bg-blue-900">
        <DisclosureBanner />
        
        <header className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl sticky top-0 z-50 border-b border-gray-100 dark:border-zinc-800">
          <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="bg-blue-600 p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-blue-500/30">
                <ShoppingBag className="text-white w-6 h-6 border-0" />
              </div>
              <span className="text-xl font-black tracking-tight text-gray-900 dark:text-zinc-100">
                AI<span className="text-blue-600">OUTfit</span>
              </span>
            </div>
            
            <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600 dark:text-zinc-400">
              <a href="/" className="hover:text-blue-600 transition-colors">Compare</a>
              <a href="/deals" className="hover:text-blue-600 transition-colors">Hot Deals</a>
              <a href="/about" className="hover:text-blue-600 transition-colors">How it Works</a>
            </nav>

            <button className="bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 px-5 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95">
              Login
            </button>
          </div>
        </header>

        <main>
          <Search />
        </main>

        <footer className="bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 py-12 mt-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-2 mb-6">
                  <div className="bg-blue-600 p-2 rounded-lg">
                    <ShoppingBag className="text-white w-5 h-5 border-0" />
                  </div>
                  <span className="text-lg font-bold text-gray-900 dark:text-zinc-100">
                    AIOUTfit
                  </span>
                </div>
                <p className="text-gray-500 text-sm max-w-sm">
                  The ultimate hub for price comparison and affiliate discovery in India. We help you find the best value across all premium platforms.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-zinc-100 mb-6">Platforms</h4>
                <ul className="space-y-4 text-sm text-gray-500">
                  <li>Amazon India</li>
                  <li>Flipkart</li>
                  <li>Ajio</li>
                  <li>Myntra</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-zinc-100 mb-6">Compliance</h4>
                <ul className="space-y-4 text-sm text-gray-500">
                  <li>Privacy Policy</li>
                  <li>Terms of Service</li>
                  <li>Affiliate Disclosure</li>
                </ul>
              </div>
            </div>
            
            <div className="pt-8 border-t border-gray-100 dark:border-zinc-800 text-center">
              <p className="text-xs text-gray-400">
                © 2026 AI Outfit. Built with precision for the Indian market.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </QueryClientProvider>
  );
};

export default App;
