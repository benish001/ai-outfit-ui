import React, { useState, lazy, Suspense, useTransition } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const Splash = lazy(() => import('./features/onboarding/Splash'));
const PhotoUpload = lazy(() => import('./features/onboarding/PhotoUpload'));
const ColorRecommendations = lazy(() => import('./features/recommendations/ColorRecommendations'));
const SkinTypeSelect = lazy(() => import('./features/onboarding/SkinTypeSelect'));
const ProductDiscovery = lazy(() => import('./features/recommendations/ProductDiscovery'));
const ProductDetail = lazy(() => import('./features/products/ProductDetail'));

const PageLoader = () => (
  <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-white/30 backdrop-blur-md">
    <div className="w-10 h-10 border-[3px] border-rose-100 border-t-rose-500 rounded-full animate-spin" />
  </div>
);

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [, startTransition] = useTransition();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const safeNavigate = (path) => {
    startTransition(() => {
      navigate(path);
    });
  };

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname]);

  const goToProduct = (product) => {
    setSelectedProduct(product);
    safeNavigate(`/product/${product.id}`);
  };

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
              <Route path="/" element={<Splash onNext={() => safeNavigate('/upload')} />} />
              <Route path="/upload" element={<PhotoUpload onNext={() => safeNavigate('/analysis')} onBack={() => safeNavigate('/')} />} />
              <Route path="/analysis" element={<ColorRecommendations onNext={() => safeNavigate('/skin-type')} onBack={() => safeNavigate('/upload')} />} />
              <Route path="/skin-type" element={<SkinTypeSelect onNext={() => safeNavigate('/discovery')} onBack={() => safeNavigate('/analysis')} />} />
              <Route
                path="/discovery"
                element={<ProductDiscovery onProductSelect={goToProduct} onBack={() => safeNavigate('/skin-type')} />}
              />
              <Route path="/product/:id" element={<ProductDetail product={selectedProduct} onBack={() => safeNavigate('/discovery')} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </Suspense>

      <style dangerouslySetInnerHTML={{ __html: `
        * { -webkit-tap-highlight-color: transparent; }
        button, a, input { touch-action: manipulation; }
      ` }} />
    </div>
  );
}

export default App;
