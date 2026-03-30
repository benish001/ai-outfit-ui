import React from 'react';
import { motion } from 'framer-motion';
import { User, UserPlus, ChevronRight } from 'lucide-react';
import Card from '../../components/ui/Card';

const GenderSelect = ({ onSelect }) => {
  const options = [
    { id: 'female', label: 'Woman', icon: User, color: 'from-pink-400 to-rose-500' },
    { id: 'male', label: 'Man', icon: UserPlus, color: 'from-blue-400 to-indigo-500' }
  ];

  return (
    <div className="h-[100dvh] w-full bg-[#f8f8f8] p-8 flex flex-col items-center justify-center overflow-hidden">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-bold luxury-font tracking-tight">Who are we<br /><span className="italic text-brand-dark">styling today?</span></h1>
        <p className="text-[10px] uppercase tracking-[0.2em] font-black opacity-30">Select your preference</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-md">
        {options.map((opt) => (
          <motion.div
            key={opt.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className="p-8 cursor-pointer group hover:border-black/20 transition-all border-black/5 flex flex-col items-center space-y-6"
              onClick={() => onSelect(opt.id)}
            >
              <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${opt.color} flex items-center justify-center text-white shadow-lg shadow-black/5`}>
                 <opt.icon size={32} />
              </div>
              <div className="text-center space-y-1">
                 <h3 className="text-xl font-bold uppercase tracking-tight">{opt.label}</h3>
                 <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] font-black uppercase tracking-widest">Continue</span>
                    <ChevronRight size={14} />
                 </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <p className="mt-12 text-[10px] text-muted font-medium text-center max-w-xs opacity-50">
        This helps our AI curate the right silhouettes and styles for your profile.
      </p>
    </div>
  );
};

export default GenderSelect;
