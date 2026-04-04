import React, { useState, lazy, Suspense, useTransition } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from './context/AuthContext';

// ── CODE SPLITTING (Performance Fix #1) ──
// Lazy loading non-critical routes to unblock the main thread.
const Splash = lazy(() => import('./features/onboarding/Splash'));
const PhotoUpload = lazy(() => import('./features/onboarding/PhotoUpload'));
const ColorRecommendations = lazy(() => import('./features/recommendations/ColorRecommendations'));
const ProductDiscovery = lazy(() => import('./features/recommendations/ProductDiscovery'));
const ProductDetail = lazy(() => import('./features/products/ProductDetail'));
const Login = lazy(() => import('./features/auth/Login'));
const Register = lazy(() => import('./features/auth/Register'));
const AdminDashboard = lazy(() => import('./features/admin/AdminDashboard'));
const GenderSelect = lazy(() => import('./features/onboarding/GenderSelect'));

// Minimal loading fallback to avoid layout shift
const PageLoader = () => (
  <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-gradient-to-br from-[#FFF1F2] to-[#FFF7F0]">
    <div className="w-8 h-8 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
  </div>
);

function App() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isPending, startTransition] = useTransition(); // Concurrent Navigation
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [gender, setGender] = useState(() => localStorage.getItem('tonewear_gender') || 'female');
  
  // Navigation states
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  // Optimized Navigation Helper (Performance Fix #2)
  const safeNavigate = (path) => {
    startTransition(() => {
      navigate(path);
    });
  };

  // Scroll to top on route change
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  const goToProduct = (product) => {
    setSelectedProduct(product);
    safeNavigate(`/product/${product.id}`);
  };

  const handleGenderSelect = (g) => {
    setGender(g);
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
    <div className="min-h-screen w-full bg-gradient-to-br from-[#FFF1F2] via-[#FFF4F6] to-[#FFF7F0] bg-fixed selection:bg-rose-100 selection:text-[#1C1917]">
      {/* Auth Overlays */}
      <AnimatePresence mode="wait">
        {showLogin && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000]"
          >
            <Suspense fallback={<PageLoader />}>
              <Login 
                onBack={() => setShowLogin(false)} 
                onRegister={() => { setShowLogin(false); setShowRegister(true); }}
                onLoginSuccess={() => {
                  setShowLogin(false);
                  if (location.pathname === '/') safeNavigate('/gender');
                }}
              />
            </Suspense>
          </motion.div>
        )}
        {showRegister && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000]"
          >
            <Suspense fallback={<PageLoader />}>
              <Register 
                onBack={() => setShowRegister(false)} 
                onLogin={() => { setShowRegister(false); setShowLogin(true); }}
                onRegisterSuccess={() => {
                  setShowRegister(false);
                  if (location.pathname === '/') safeNavigate('/gender');
                }}
              />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>

      <Suspense fallback={<PageLoader />}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="w-full min-h-screen"
          >
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={
                <Splash onNext={() => {
                  if (!user) setShowLogin(true);
                  else safeNavigate('/gender');
                }} />
              } />
              <Route path="/gender" element={<GenderSelect onSelect={handleGenderSelect} />} />
              <Route path="/upload" element={<PhotoUpload onNext={() => safeNavigate('/analysis')} onBack={() => safeNavigate('/gender')} />} />
              <Route path="/analysis" element={<ColorRecommendations onNext={() => safeNavigate('/discovery')} onBack={() => safeNavigate('/upload')} />} />
              <Route path="/discovery" element={
                <ProductDiscovery 
                  gender={gender}
                  onProductSelect={goToProduct} 
                  onBack={() => safeNavigate('/analysis')} 
                  onAuthClick={() => setShowLogin(true)}
                  onAdminClick={() => setShowAdmin(true)}
                />
              } />
              <Route path="/product/:id" element={<ProductDetail product={selectedProduct} onBack={() => safeNavigate('/discovery')} />} />
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
