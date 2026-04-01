import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Filter, Star, ShoppingCart, ExternalLink, 
  ArrowRight, User as UserIcon, Shield, LogOut, Settings, Heart, Camera, Loader2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const ProductDiscovery = ({ gender: onboardingGender, onProductSelect, onBack, onAuthClick, onAdminClick }) => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('All');
  const [products, setProducts] = useState([]);
  const [dynamicTabs, setDynamicTabs] = useState([]);
  const [savedIds, setSavedIds] = useState(new Set());
  
  // Pagination State
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const observer = useRef();

  // Profile data from localStorage
  const profileData = React.useMemo(() => {
    const onboarding = JSON.parse(localStorage.getItem('analysisResult') || '{}');
    const gender = onboardingGender || localStorage.getItem('tonewear_gender') || onboarding.gender || 'Female';
    const colors = onboarding.recommendations?.colors_to_wear || [];
    return { 
        gender: gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase(), 
        colors 
    };
  }, [onboardingGender]);

  const fetchProducts = useCallback(async (pageNum, currentTab, isInitial = false) => {
    if (isInitial) setLoading(true);
    else setLoadingMore(true);

    try {
      let res;
      if (currentTab === 'Saved') {
        // Fetch only saved items
        res = await api.get('/users/saved');
        setHasMore(false); // No pagination for saved items for now
      } else {
        const params = {
          gender: profileData.gender,
          skip: pageNum * 20,
          limit: 20
        };
        if (currentTab !== 'All') params.category = currentTab;
        if (profileData.colors.length > 0) params.colors = profileData.colors.join(',');
        
        res = await api.get('/outfits/trending', { params });
        setHasMore(res.data.length === 20);
      }
      
      if (isInitial) {
        setProducts(res.data);
      } else {
        setProducts(prev => [...prev, ...res.data]);
      }
    } catch (err) {
      console.error('Fetch failed', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [profileData]);

  // Initial tab and category load
  useEffect(() => {
    const init = async () => {
      try {
        const [catRes, savedRes] = await Promise.all([
          api.get('/admin/categories'),
          user ? api.get('/users/saved') : Promise.resolve({ data: [] })
        ]);
        
        // Custom Sorting Logic for Categories
        const priority = ['Top', 'Bottom', 'Dress', 'Casual', 'Formal', 'Ethnic', 'Party', 'Trending'];
        const lowPriority = ['Accessories', 'Footwear', 'Watch', 'Bags', 'Others'];
        
        const sortedCats = catRes.data.sort((a, b) => {
           const aIdx = priority.indexOf(a);
           const bIdx = priority.indexOf(b);
           const aLowIdx = lowPriority.indexOf(a);
           const bLowIdx = lowPriority.indexOf(b);
           
           if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
           if (aIdx !== -1) return -1;
           if (bIdx !== -1) return 1;
           
           if (aLowIdx !== -1 && bLowIdx !== -1) return aLowIdx - bLowIdx;
           if (aLowIdx !== -1) return 1;
           if (bLowIdx !== -1) return -1;
           
           return a.localeCompare(b);
        });

        setDynamicTabs(['All', ...sortedCats, 'Saved']);
        if (user) setSavedIds(new Set(savedRes.data.map(p => p.id)));
      } catch (e) { console.error(e); }
    };
    init();
  }, [user]);

  // Handle Tab Switch
  useEffect(() => {
    setPage(0);
    setHasMore(true);
    fetchProducts(0, activeTab, true);
  }, [activeTab, fetchProducts]);

  // Infinite Scroll Observer
  const lastElementRef = useCallback(node => {
    if (loading || loadingMore || activeTab === 'Saved') return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => {
          const next = prev + 1;
          fetchProducts(next, activeTab);
          return next;
        });
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore, fetchProducts, activeTab]);

  const handleToggleSave = async (e, product) => {
    e.stopPropagation();
    if (!user) { onAuthClick(); return; }
    
    const isSaved = savedIds.has(product.id);
    
    try {
      if (isSaved) {
        await api.delete(`/users/saved/${product.id}`);
        setSavedIds(prev => {
          const n = new Set(prev);
          n.delete(product.id);
          return n;
        });
        // If we are in Saved tab, remove it from the list instantly
        if (activeTab === 'Saved') {
          setProducts(prev => prev.filter(p => p.id !== product.id));
        }
      } else {
        await api.post(`/users/saved/${product.id}`);
        setSavedIds(prev => new Set(prev).add(product.id));
      }
    } catch (err) { console.error(err); }
  };

  const handleLogout = () => setShowLogoutModal(true);
  const confirmLogout = () => { logout(); setShowLogoutModal(false); navigate('/'); };

  return (
    <div className="min-h-screen w-full bg-[#f8f8f8] flex flex-col pb-24 selection:bg-black selection:text-white">
      
      {/* Sticky Header */}
      <header className="sticky top-0 z-[100] bg-[#f8f8f8]/80 backdrop-blur-xl border-b border-black/5">
        <nav className="px-6 py-4 md:px-8 md:py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/analysis')} className="p-2 -ml-2 opacity-40 hover:opacity-100 transition-opacity">
              <ChevronLeft size={24} />
            </button>
            <div className="h-6 w-px bg-black/5 mx-1" />
            {isAdmin && (
              <button onClick={onAdminClick} className="flex items-center gap-2 px-3 py-2 bg-brand-dark text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg">
                <Shield size={14} /> <span>Admin</span>
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/upload')} className="p-3 bg-white border border-black/5 rounded-full shadow-sm hover:translate-y-[-2px] transition-all">
                <Camera size={18} />
            </button>
            {user ? (
               <button onClick={handleLogout} className="p-2.5 bg-black text-white rounded-full transition-all">
                  <LogOut size={16} />
               </button>
            ) : (
               <button onClick={onAuthClick} className="px-5 py-2.5 bg-black text-white rounded-full text-[9px] font-black uppercase tracking-widest">
                  Sign In
               </button>
            )}
          </div>
        </nav>

        {/* Dynamic Nav Tabs - Prioritized List */}
        <div className="flex overflow-x-auto no-scrollbar py-3 px-6 md:px-8 gap-3 scroll-smooth touch-pan-x">
          {dynamicTabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border ${
                activeTab === tab 
                  ? 'bg-black text-white border-black shadow-xl scale-105' 
                  : 'bg-white text-slate-400 border-black/5 hover:border-black/20'
              }`}
            >
              {tab}
            </button>
          ))}
          <div className="min-w-[24px] h-1 shrink-0" />
        </div>
      </header>

      {/* Product List */}
      <main className="flex-1 px-8 pt-12 pb-20 max-w-7xl mx-auto w-full">
        <header className="mb-12 flex items-center justify-between">
           <div>
              <p className="text-[10px] uppercase font-bold tracking-[0.4em] text-muted mb-2">Neural Curations</p>
              <h2 className="text-4xl md:text-6xl font-black luxury-font leading-tight">
                {activeTab === 'Saved' ? 'Your Saved' : 'Personalized'}<br />
                <span className="italic text-orange-vibrant">{activeTab === 'Saved' ? 'Vault.' : 'Looks.'}</span>
              </h2>
           </div>
        </header>

        {loading && page === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="aspect-[3/4] rounded-[32px] bg-black/5 animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10">
            <AnimatePresence mode="popLayout">
              {products.map((p, idx) => (
                <motion.div
                  key={`${p.id}-${idx}`}
                  ref={idx === products.length - 1 ? lastElementRef : null}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <Card 
                    className="p-0 border-none bg-transparent hover:translate-y-[-8px] transition-transform duration-500 shadow-none h-full flex flex-col"
                    onClick={() => onProductSelect(p)}
                  >
                    <div className="aspect-[3/4] w-full rounded-[40px] overflow-hidden relative shadow-premium bg-white group">
                      <img src={p.image_url} alt={p.name} className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-700" />
                      <button 
                        onClick={(e) => handleToggleSave(e, p)}
                        className={`absolute top-6 right-6 p-3.5 rounded-full backdrop-blur-xl border border-white/20 transition-all ${
                          savedIds.has(p.id) ? 'bg-red-500 text-white' : 'bg-white/40 text-black hover:bg-white'
                        }`}
                      >
                        <Heart size={18} fill={savedIds.has(p.id) ? "currentColor" : "none"} />
                      </button>
                    </div>

                    <div className="pt-6 pb-2 space-y-1.5 px-3">
                       <div className="flex justify-between items-start gap-3">
                          <h3 className="text-sm font-bold luxury-font tracking-tighter leading-tight line-clamp-1 opacity-80">{p.name}</h3>
                          <span className="text-lg font-black shrink-0 tracking-tighter">{p.price}</span>
                       </div>
                       <div className="flex items-center justify-between">
                          <span className="text-[8px] uppercase tracking-widest font-black text-orange-vibrant">{p.brand}</span>
                          <span className="text-[8px] uppercase tracking-widest font-black opacity-20">{p.category}</span>
                       </div>
                       <button onClick={(e) => {e.stopPropagation(); window.open(p.affiliate_link, '_blank');}} className="mt-4 w-full flex items-center justify-center gap-2 py-4 rounded-3xl bg-[#FFD814] hover:bg-[#F7CA00] text-black text-[9px] font-black uppercase tracking-widest transition-all shadow-xl shadow-yellow-200/50">
                          <ShoppingCart size={14} /> Buy on Amazon
                       </button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {products.length === 0 && !loading && (
              <div className="col-span-full py-40 text-center">
                 <h3 className="text-xl font-bold luxury-font">Collection Empty</h3>
                 <p className="text-[10px] text-muted uppercase tracking-widest leading-loose">Items matching your profile will appear here.</p>
              </div>
            )}
          </div>
        )}

        {loadingMore && (
          <div className="py-20 flex justify-center w-full">
            <Loader2 className="animate-spin text-orange-vibrant" size={32} />
          </div>
        )}
      </main>

      {/* Reverted Original Mobile Footer */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-white/80 backdrop-blur-xl border-t border-black/5 h-20 z-[300]">
        <div className="flex items-center justify-between max-w-lg mx-auto h-full px-6">
          <TabIcon icon={GridIcon} label="Explore" active={activeTab === 'All'} onClick={() => setActiveTab('All')} />
          <TabIcon icon={Camera} label="Scan" onClick={() => navigate('/upload')} />
          <TabIcon icon={HeartIcon} label="Saved" active={activeTab === 'Saved'} onClick={() => setActiveTab('Saved')} />
          <TabIcon icon={UserIcon} label="Profile" onClick={user ? handleLogout : onAuthClick} />
        </div>
      </div>

      {/* Logout Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-sm">
              <Card className="p-10 space-y-8 text-center bg-white rounded-[48px]">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500">
                   <LogOut size={32} />
                </div>
                <h3 className="text-2xl font-bold luxury-font">Sign Out?</h3>
                <div className="flex flex-col gap-3">
                  <Button variant="primary" className="w-full bg-black text-white py-5 rounded-3xl" onClick={confirmLogout}>Logout</Button>
                  <button onClick={() => setShowLogoutModal(false)} className="text-[10px] uppercase font-black text-slate-300 py-3">Cancel</button>
                </div>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TabIcon = ({ icon: Icon, label, active = false, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1.5 transition-all ${active ? 'text-black font-bold' : 'opacity-20 hover:opacity-50'}`}>
     <Icon size={20} />
     <span className="text-[8px] uppercase font-black tracking-widest">{label}</span>
  </button>
);

const GridIcon = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>;
const HeartIcon = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>;

export default ProductDiscovery;
