import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Filter, Star, ShoppingCart, ExternalLink, 
  ArrowRight, User as UserIcon, Shield, LogOut, Settings, Heart, Camera
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const ProductDiscovery = ({ gender: onboardingGender, onProductSelect, onBack, onAuthClick, onAdminClick }) => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Casual');
  const [products, setProducts] = useState([]);
  const [savedIds, setSavedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const tabs = ['Casual', 'Formal', 'Party', 'Ethnic', 'Others', 'Saved'];
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const capitalizedGender = onboardingGender ? onboardingGender.charAt(0).toUpperCase() + onboardingGender.slice(1) : 'Female';
        const [prodRes, savedRes] = await Promise.all([
          api.get('/outfits/trending', { params: { gender: capitalizedGender } }),
          user ? api.get('/users/saved') : Promise.resolve({ data: [] })
        ]);
        
        setProducts(prodRes.data);
        if (user) {
          setSavedIds(new Set(savedRes.data.map(p => p.id)));
        }
      } catch (err) {
        console.error('Failed to fetch data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [user, onboardingGender]);

  const handleToggleSave = async (e, product) => {
    e.stopPropagation();
    if (!user) {
      onAuthClick();
      return;
    }

    try {
      if (savedIds.has(product.id)) {
        await api.delete(`/users/saved/${product.id}`);
        setSavedIds(prev => {
          const next = new Set(prev);
          next.delete(product.id);
          return next;
        });
      } else {
        await api.post(`/users/saved/${product.id}`);
        setSavedIds(prev => new Set(prev).add(product.id));
      }
    } catch (err) {
      console.error('Save toggle failed', err);
    }
  };

  const handleLogout = () => setShowLogoutModal(true);
  
  const confirmLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigate('/');
  };

  // Memoized profile data to avoid repetitive localStorage hits
  const profileData = React.useMemo(() => {
    const onboarding = JSON.parse(localStorage.getItem('tonewear_onboarding') || '{}');
    return {
      gender: onboardingGender || localStorage.getItem('tonewear_gender') || 'female',
      bestColors: (onboarding.bestColors || []).map(c => c.name?.toLowerCase()),
      avoidColors: (onboarding.avoidColors || []).map(c => c.name?.toLowerCase())
    };
  }, [onboardingGender]);

  const filteredProducts = React.useMemo(() => {
    return products.filter(p => {
      if (activeTab === 'Saved') {
        return savedIds.has(p.id);
      }
      
      const cat = p.category?.toLowerCase() || '';
      const name = p.name?.toLowerCase() || '';
      const pColor = p.color?.toLowerCase() || '';
      
      // Secondary Gender check (Already filtered by API, but extra safety)
      if (profileData.gender === 'male') {
         // Exclude items that are explicitly female if they leaked through Unisex mark
         const femWords = ['dress', 'saree', 'kurti', 'gown', 'lehenga', 'anarkali', 'woman', 'lady', 'girl', 'pendant', 'necklace', 'earring', 'locket'];
         if (femWords.some(w => cat.includes(w) || name.includes(w))) {
           // Allow if "men" is in the name
           if (!name.includes(' men') && !name.includes('men ')) {
             return false;
           }
         }
      }

      // Smart Color Filtering
      if (profileData.bestColors.length > 0) {
        // ALWAYS allow "Multi" or "Neutral" colors as they fit everything
        if (pColor === 'multi' || pColor === 'neutral' || pColor === 'white' || pColor === 'black' || pColor.includes('multicolor')) {
          // Continue to category check
        } else {
          const isAvoid = profileData.avoidColors.some(cName => {
            const words = cName.split(' ');
            return words.some(w => pColor.includes(w)) || pColor.includes(cName);
          });
          
          if (isAvoid) return false;

          const isBest = profileData.bestColors.some(cName => {
            const words = cName.split(' ');
            return words.some(w => w.length > 2 && pColor.includes(w)) || pColor.includes(cName);
          });

          if (!isBest) return false; 
        }
      }

      // Smart Categorization Logic
      const matches = (keywords) => {
        return keywords.some(k => name.includes(k) || cat.includes(k));
      };

      const isOthers = matches([
        'watch', 'belt', 'wallet', 'sunglass', 'jewelry', 'necklace', 'earring', 'ring', 
        'bracelet', 'pendant', 'locket', 'bangle', 'accessory', 'gem', 'diamond', 'stone', 'crystal',
        'gym', 'workout', 'active', 'yoga', 'sport', 'fitness', 'bag', 'handbag', 'backpack', 'tote', 'clutch',
        'shoe', 'sneaker', 'sandal', 'heel', 'boot', 'flip flop', 'socks', 'book', 'camera', 'wifi', 'tech',
        'table', 'chair', 'furniture', 'decor', 'home', 'kitchen', 'health', 'beauty', 'makeup', 'pad', 'panty',
        'maternity', 'period', 'hygiene', 'cap', 'hat', 'mask', 'umbrella', 'wolf', 'kids', 'child', 'baby', 'toy'
      ]) || cat.includes('accessories') || cat.includes('others');

      const isEthnic = !isOthers && matches(['saree', 'lehenga', 'kurta', 'kurti', 'ethnic', 'anarkali', 'suit', 'sharara', 'dupatta', 'kaftan', 'sherwani']);
      const isParty = !isOthers && !isEthnic && matches(['party', 'wedding', 'glitter', 'sequin', 'evening', 'cocktail', 'gown', 'dress', 'ceremony', 'festive']);
      const isFormal = !isOthers && !isEthnic && !isParty && matches(['formal', 'office', 'business', 'blazer', 'tuxedo', 'trousers', 'oxford', 'derby', 'tie', 'cufflink', 'shirt']);
      const isCasual = !isOthers && !isEthnic && !isParty && !isFormal && matches(['casual', 't-shirt', 'tee', 'jean', 'short', 'top', 'daily', 'regular', 'shirt', 'polo', 'hoodie', 'sweatshirt', 'legging', 'skirt', 'innerwear', 'vest', 'thermal', 'clothing', 'apparel', 'trending']);
      
      const finalOthers = !isEthnic && !isParty && !isFormal && !isCasual;

      if (activeTab === 'Casual') return isCasual;
      if (activeTab === 'Formal') return isFormal;
      if (activeTab === 'Party') return isParty;
      if (activeTab === 'Ethnic') return isEthnic;
      if (activeTab === 'Others') return isOthers || finalOthers;
      
      return false;
    });
  }, [products, activeTab, savedIds, profileData]);

  const sortedProducts = React.useMemo(() => {
    const list = [...filteredProducts];
    if (activeTab === 'All') {
      list.sort((a, b) => {
        const isADress = a.category?.toLowerCase().includes('dress') || a.name?.toLowerCase().includes('dress');
        const isBDress = b.category?.toLowerCase().includes('dress') || b.name?.toLowerCase().includes('dress');
        if (isADress && !isBDress) return -1;
        if (!isADress && isBDress) return 1;
        return 0;
      });
    }
    return list;
  }, [filteredProducts, activeTab]);

  return (
    <div className="min-h-screen w-full bg-[#f8f8f8] flex flex-col pb-24 selection:bg-black selection:text-white">
      
      {/* Sticky Combined Header */}
      <header className="sticky top-0 z-[100] bg-[#f8f8f8]/80 backdrop-blur-xl border-b border-black/5">
        <nav className="px-6 py-4 md:px-8 md:py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/analysis')} className="p-2 -ml-2 hover:opacity-100 opacity-40 transition-opacity">
              <ChevronLeft size={24} />
            </button>
            <div className="h-6 w-px bg-black/5 mx-1" />
            <button 
              onClick={() => navigate('/upload')} 
              className="flex items-center gap-2 px-4 py-2 bg-white border border-black/10 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm hover:shadow-md hover:bg-black hover:text-white transition-all"
            >
              <Camera size={12} />
              <span className="hidden xs:inline">Scan</span>
            </button>
            {isAdmin && (
              <button 
                onClick={onAdminClick}
                className="flex items-center gap-2 px-3 py-2 bg-purple-luxury text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-purple-luxury/20"
              >
                <Shield size={14} />
                <span className="hidden sm:inline">Admin</span>
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-[9px] font-black uppercase tracking-widest leading-tight">{user.name}</span>
                  <span className="text-[7px] opacity-30 font-bold uppercase tracking-widest">Trendsetter</span>
                </div>
                <button onClick={handleLogout} className="p-2.5 bg-white border border-black/5 rounded-full shadow-sm hover:bg-black hover:text-white transition-all">
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button 
                onClick={onAuthClick}
                className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl"
              >
                <UserIcon size={14} />
                Sign In
              </button>
            )}
          </div>
        </nav>

        {/* Categories Tab Strip */}
        <div className="flex overflow-x-auto no-scrollbar py-2 px-6 md:px-8 gap-2 scroll-smooth snap-x snap-mandatory touch-pan-x">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all snap-start border-2 ${
                activeTab === tab 
                  ? 'bg-black text-white border-black shadow-md' 
                  : 'bg-white text-slate-400 border-black/5 hover:border-black/20'
              }`}
            >
              {tab}
            </button>
          ))}
          <div className="min-w-[24px] h-1 shrink-0" />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-8 pt-12 pb-20 max-w-7xl mx-auto w-full">
        <header className="mb-12 space-y-4">
          <p className="text-[10px] uppercase font-bold tracking-[0.4em] text-muted">Neural Curations</p>
          <h2 className="text-4xl md:text-6xl font-black luxury-font leading-tight">Recommended<br /><span className="italic text-orange-vibrant">Looks.</span></h2>
        </header>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {[1,2,3,4].map(i => <div key={i} className="aspect-[3/4] rounded-[32px] bg-black/5 animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 pb-32">
            <AnimatePresence mode="popLayout">
              {sortedProducts.length > 0 ? (
                sortedProducts.map((p, idx) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group"
                  >
                    <Card 
                      className="p-0 border-none bg-transparent hover:translate-y-[-4px] transition-transform duration-300 shadow-none overflow-visible h-full flex flex-col"
                      onClick={() => onProductSelect(p)}
                    >
                      <div className="aspect-[3/4] w-full rounded-2xl md:rounded-[32px] overflow-hidden relative shadow-premium bg-white">
                        <img 
                          src={p.image_url} 
                          alt={p.name} 
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <button 
                          onClick={(e) => handleToggleSave(e, p)}
                          className={`absolute top-4 right-4 p-2 md:p-3 rounded-full backdrop-blur-md border border-white/20 transition-all ${
                            savedIds.has(p.id) ? 'bg-red-500 text-white border-red-500' : 'bg-white/40 text-black hover:bg-white'
                          }`}
                        >
                          <Heart size={16} fill={savedIds.has(p.id) ? "currentColor" : "none"} />
                        </button>
                        <div className="absolute top-4 left-4">
                          <div className="px-3 py-1 bg-white/60 backdrop-blur-md rounded-full text-[8px] uppercase font-black border border-white/20 tracking-widest">
                             {p.color}
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 md:pt-6 space-y-2 px-1 flex-1 flex flex-col">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="text-[13px] md:text-base font-bold luxury-font tracking-tight line-clamp-1">{p.name}</h3>
                          <span className="text-[14px] md:text-lg font-black shrink-0">${Math.round(p.price)}</span>
                        </div>
                        <div className="flex items-center gap-2 opacity-30 uppercase text-[8px] font-black tracking-widest pb-3">
                           <span>{p.brand}</span>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(p.affiliate_link, '_blank');
                          }}
                          className="mt-auto w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#FFD814] hover:bg-[#F7CA00] text-black text-[9px] font-black uppercase tracking-widest transition-all shadow-md group"
                        >
                           <ShoppingCart size={14} />
                           <span>Amazon</span>
                           <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </button>
                      </div>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center space-y-4">
                  <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center mx-auto opacity-20">
                     <Filter size={24} />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-widest">No Matches Found</h3>
                  <p className="text-[10px] text-muted font-medium max-w-[200px] mx-auto">We couldn't find items in this category that match your neural color profile.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Global Bottom Tab Bar (Mobile) */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-white/80 backdrop-blur-xl border-t border-black/5 h-20 z-[200]">
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
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="w-full max-w-sm">
              <Card className="p-8 space-y-6 text-center bg-white">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500">
                   <LogOut size={28} />
                </div>
                <h3 className="text-xl font-bold luxury-font text-slate-900">Sign Out?</h3>
                <div className="flex flex-col gap-3">
                  <Button variant="primary" className="w-full bg-red-500 text-white py-4" onClick={confirmLogout}>Logout</Button>
                  <button onClick={() => setShowLogoutModal(false)} className="text-[10px] uppercase font-black text-slate-300 py-2">Cancel</button>
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
const SearchIcon = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>;
const HeartIcon = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>;

export default ProductDiscovery;
