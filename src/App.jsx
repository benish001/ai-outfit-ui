import React, { useState, lazy, Suspense, useTransition } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from './context/AuthContext';

// ── CODE SPLITTING (Performance Fix #1) ──
// Lazy loading non-critical routes to unblock the main thread.
const Splash              = lazy(() => import('./features/onboarding/Splash'));
const PhotoUpload         = lazy(() => import('./features/onboarding/PhotoUpload'));
const ColorRecommendations = lazy(() => import('./features/recommendations/ColorRecommendations'));
const ProductDiscovery    = lazy(() => import('./features/recommendations/ProductDiscovery'));
const ProductDetail       = lazy(() => import('./features/products/ProductDetail'));
const AdminDashboard      = lazy(() => import('./features/admin/AdminDashboard'));
const GenderSelect        = lazy(() => import('./features/onboarding/GenderSelect'));
const MyntraDeals         = lazy(() => import('./features/recommendations/MyntraDeals'));
const BeautyShop          = lazy(() => import('./features/beauty/BeautyShop'));

// Minimal loading fallback to avoid layout shift (Performance Fix #3)
const PageLoader = () => (
  <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-white/30 backdrop-blur-md">
    <div className="w-10 h-10 border-[3px] border-rose-100 border-t-rose-500 rounded-full animate-spin" />
  </div>
);

function App() {
  const { isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [, startTransition] = useTransition(); // Concurrent Navigation

  const [selectedProduct, setSelectedProduct] = useState(null);

  // Navigation states
  const [showAdmin, setShowAdmin]   = useState(false);

  // Optimized Navigation Helper (Performance Fix #2)
  const safeNavigate = (path) => {
    startTransition(() => {
      navigate(path);
    });
  };

  // Scroll to top on route change
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname]);

  const goToProduct = (product) => {
    setSelectedProduct(product);
    safeNavigate(`/product/${product.id}`);
  };

  const handleGenderSelect = (g) => {
    localStorage.setItem('tonewear_gender', g);
    safeNavigate('/upload');
  };

  if (authLoading) return <PageLoader />;

  if (showAdmin && isAdmin) {
    return (
      <Suspense fallback={<PageLoader />}>
        <AdminDashboard onBack={() => setShowAdmin(false)} />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#FFF1F2] selection:bg-rose-100 selection:text-[#1C1917]">
      <Suspense fallback={<PageLoader />}>
        <AnimatePresence initial={false}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1, ease: 'linear' }}
            className="w-full min-h-screen"
          >
            <Routes location={location} key={location.pathname}>
              <Route
                path="/"
                element={
                  <Splash onNext={() => safeNavigate('/gender')} />
                }
              />
              <Route path="/gender"    element={<GenderSelect onSelect={handleGenderSelect} />} />
              <Route path="/upload"    element={<PhotoUpload onNext={() => safeNavigate('/discovery')} onBack={() => safeNavigate('/gender')} />} />
              <Route path="/analysis"  element={<ColorRecommendations onNext={() => safeNavigate('/discovery')} onBack={() => safeNavigate('/upload')} />} />
              <Route
                path="/discovery"
                element={
                  <ProductDiscovery
                    onProductSelect={goToProduct}
                    onBack={() => safeNavigate('/analysis')}
                    onAdminClick={() => setShowAdmin(true)}
                  />
                }
              />
              <Route path="/product/:id" element={<ProductDetail product={selectedProduct} onBack={() => safeNavigate('/discovery')} />} />

              {/* ── Myntra Affiliate Deals (vCommission Campaign 10882) ── */}
              <Route path="/myntra" element={<MyntraDeals />} />

              {/* ── Beauty Shop — Swiss Beauty & Dot & Key (vCommission) ── */}
              <Route path="/beauty" element={<BeautyShop onBack={() => safeNavigate('/discovery')} />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </Suspense>

      {/* ── MOBILE TAP HIGHLIGHT FIX ── */}
      <style dangerouslySetInnerHTML={{ __html: `
        * { -webkit-tap-highlight-color: transparent; }
        button, a, input { touch-action: manipulation; }
      `}} />
    </div>
  );
}

export default App;
