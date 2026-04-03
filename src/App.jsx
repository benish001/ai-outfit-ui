import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from './context/AuthContext';
import Splash from './features/onboarding/Splash';
import PhotoUpload from './features/onboarding/PhotoUpload';
import ColorRecommendations from './features/recommendations/ColorRecommendations';
import ProductDiscovery from './features/recommendations/ProductDiscovery';
import ProductDetail from './features/products/ProductDetail';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import AdminDashboard from './features/admin/AdminDashboard';
import GenderSelect from './features/onboarding/GenderSelect';

function App() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [gender, setGender] = useState(() => localStorage.getItem('tonewear_gender') || 'female');
  
  // Navigation states
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  // Scroll to top on route change
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const goToProduct = (product) => {
    setSelectedProduct(product);
    navigate(`/product/${product.id}`);
  };

  // Handle Gender Selection
  const handleGenderSelect = (g) => {
    setGender(g);
    localStorage.setItem('tonewear_gender', g);
    navigate('/upload');
  };

  if (loading) return <div className="min-h-screen bg-[#f8f8f8]" />;

  // Global Overlays (Auth/Admin)
  if (showAdmin && isAdmin) {
    return <AdminDashboard onBack={() => setShowAdmin(false)} />;
  }

  return (
    <div className="min-h-screen w-full bg-[#f8f8f8] selection:bg-black selection:text-white">
      {/* Auth Modals */}
      <AnimatePresence>
        {showLogin && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000]"
          >
            <Login 
              onBack={() => setShowLogin(false)} 
              onRegister={() => { setShowLogin(false); setShowRegister(true); }}
              onLoginSuccess={() => {
                setShowLogin(false);
                if (location.pathname === '/') {
                  navigate('/gender');
                }
              }}
            />
          </motion.div>
        )}
        {showRegister && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000]"
          >
            <Register 
              onBack={() => setShowRegister(false)} 
              onLogin={() => { setShowRegister(false); setShowLogin(true); }}
              onRegisterSuccess={() => {
                setShowRegister(false);
                if (location.pathname === '/') {
                  navigate('/gender');
                }
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="w-full h-full"
        >
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={
              <Splash onNext={() => {
                if (!user) {
                  setShowLogin(true);
                } else {
                  navigate('/gender');
                }
              }} />
            } />
            <Route path="/gender" element={<GenderSelect onSelect={handleGenderSelect} />} />
            <Route path="/upload" element={<PhotoUpload onNext={() => navigate('/analysis')} onBack={() => navigate('/gender')} />} />
            <Route path="/analysis" element={<ColorRecommendations onNext={() => navigate('/discovery')} onBack={() => navigate('/upload')} />} />
            <Route path="/discovery" element={
              <ProductDiscovery 
                gender={gender}
                onProductSelect={goToProduct} 
                onBack={() => navigate('/analysis')} 
                onAuthClick={() => setShowLogin(true)}
                onAdminClick={() => setShowAdmin(true)}
              />
            } />
            <Route path="/product/:id" element={<ProductDetail product={selectedProduct} onBack={() => navigate('/discovery')} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;
