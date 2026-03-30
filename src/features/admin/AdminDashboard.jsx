import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Package, Zap, ChevronLeft, Search, 
  Trash2, ExternalLink, RefreshCw, BarChart3, Database
} from 'lucide-react';
import api from '../../services/api';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import UserTable from './UserTable';
import ProductTable from './ProductTable';

const AdminDashboard = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('users');
  const [syncing, setSyncing] = useState(false);
  const [stats, setStats] = useState({ users: 0, products: 0 });

  const triggerSync = async () => {
    setSyncing(true);
    try {
      await api.post('/admin/sync');
      alert('Sync started in background');
    } catch (err) {
      alert('Sync failed: ' + (err.response?.data?.detail || 'Unknown error'));
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f0f0f0] flex flex-col md:flex-row">
      
      {/* Admin Sidebar */}
      <aside className="w-full md:w-80 bg-brand-dark p-8 flex flex-col space-y-12 shrink-0">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#A18CD1] flex items-center justify-center text-white shadow-lg">
                 <Database size={20} />
              </div>
              <h1 className="text-xl font-black text-white luxury-font tracking-tight">Admin<span className="opacity-40 italic">Control</span></h1>
           </div>
           <button onClick={onBack} className="p-2 text-white/40 hover:text-white transition-opacity md:hidden">
              <ChevronLeft size={24} />
           </button>
        </div>

        <nav className="flex-1 space-y-2">
           <SidebarLink 
            active={activeTab === 'users'} 
            onClick={() => setActiveTab('users')}
            icon={Users}
            label="User Management"
           />
           <SidebarLink 
            active={activeTab === 'products'} 
            onClick={() => setActiveTab('products')}
            icon={Package}
            label="Product Catalog"
           />
           <SidebarLink 
            active={activeTab === 'analytics'} 
            onClick={() => setActiveTab('analytics')}
            icon={BarChart3}
            label="System Insights"
           />
        </nav>

        <div className="pt-12 space-y-6">
           <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
              <div className="flex items-center gap-2">
                 <Zap size={14} className="text-orange-vibrant" />
                 <span className="text-[9px] uppercase font-black tracking-widest text-white/40">Manual Override</span>
              </div>
              <p className="text-[10px] text-white/60 font-medium leading-relaxed">
                Trigger neural crawler to fetch latest products from Amazon & Flipkart.
              </p>
              <Button 
                variant="primary" 
                size="sm" 
                className={`w-full ${syncing ? 'bg-orange-vibrant' : 'bg-[#A18CD1]'} text-white border-none`}
                onClick={triggerSync}
                disabled={syncing}
              >
                {syncing ? <RefreshCw className="animate-spin" size={12} /> : 'Trigger Global Sync'}
              </Button>
           </div>
           
           <button onClick={onBack} className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-white/30 hover:text-white transition-all">
              <ChevronLeft size={14} /> Back to Shop
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
         <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div className="space-y-1">
               <h2 className="text-3xl font-black luxury-font tracking-tight capitalize">{activeTab} Database</h2>
               <p className="text-[10px] uppercase tracking-widest font-black text-muted">Luxury Inventory Management Suite</p>
            </div>
            
            <div className="relative group min-w-[300px]">
               <div className="absolute inset-y-0 left-6 flex items-center text-muted">
                  <Search size={18} />
               </div>
               <input 
                 placeholder="Search records..."
                 className="w-full pl-16 pr-8 py-5 rounded-full bg-white shadow-soft border border-transparent focus:border-black/5 outline-none transition-all text-sm font-medium"
               />
            </div>
         </header>

         <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
               {activeTab === 'users' ? <UserTable /> : <ProductTable />}
            </motion.div>
         </AnimatePresence>
      </main>
    </div>
  );
};

const SidebarLink = ({ active, onClick, icon: Icon, label }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-6 py-5 rounded-[20px] transition-all ${
      active 
      ? 'bg-white text-black shadow-2xl scale-105 z-10' 
      : 'text-white/40 hover:text-white hover:bg-white/5'
    }`}
  >
     <Icon size={20} />
     <span className="text-[10px] uppercase font-black tracking-[0.2em]">{label}</span>
  </button>
);

export default AdminDashboard;
