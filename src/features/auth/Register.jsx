import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, UserPlus, ChevronLeft, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const Register = ({ onBack, onLogin, onRegisterSuccess }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(formData.name, formData.email, formData.password);
      onRegisterSuccess?.();
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] p-6 flex flex-col items-center justify-center relative">
      
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(241,245,249,1),rgba(255,255,255,1))]" />
      
      <div className="relative w-full max-w-md space-y-8">
        <div className="flex items-center justify-between mb-8">
           <button onClick={onBack} className="p-3 rounded-full bg-white shadow-soft text-slate-400 hover:text-black hover:shadow-lg transition-all">
              <ChevronLeft size={20} />
           </button>
           <h1 className="text-2xl font-black text-slate-900 luxury-font tracking-tight">Tone<span className="opacity-20 italic">Wear</span></h1>
           <div className="w-10" />
        </div>

        <Card variant="elevated" className="p-10 space-y-8 shadow-2xl bg-white border-transparent">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-slate-900 luxury-font italic">Identity Genesis</h2>
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Start your color journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center text-slate-300 group-focus-within:text-black transition-colors">
                  <User size={18} />
                </div>
                <input 
                  type="text"
                  placeholder="Full Name"
                  className="w-full pl-14 pr-6 py-5 rounded-[24px] bg-slate-50 border border-slate-100 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-slate-100 outline-none transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center text-slate-300 group-focus-within:text-black transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  type="email"
                  placeholder="Email Address"
                  className="w-full pl-14 pr-6 py-5 rounded-[24px] bg-slate-50 border border-slate-100 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-slate-100 outline-none transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center text-slate-300 group-focus-within:text-black transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"}
                  placeholder="Create Password"
                  className="w-full pl-14 pr-14 py-5 rounded-[24px] bg-slate-50 border border-slate-100 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-slate-100 outline-none transition-all"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-5 flex items-center text-slate-300 hover:text-black transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-[10px] text-white font-bold uppercase tracking-widest text-center">
                {error}
              </div>
            )}

            <Button 
              variant="primary" 
              size="lg" 
              className="w-full bg-brand-dark text-white hover:bg-black"
              disabled={loading}
              type="submit"
            >
              {loading ? 'Creating Identity...' : 'Register Now'}
              {!loading && <UserPlus size={18} className="ml-2" />}
            </Button>
          </form>

          <div className="pt-4 text-center">
             <button onClick={onLogin} className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400 hover:text-black transition-all flex items-center justify-center gap-2 mx-auto">
                Already part of ToneWear? <span className="text-black underline underline-offset-4">Sign In</span> <ArrowRight size={12} />
             </button>
          </div>
        </Card>

        <p className="text-center text-[9px] uppercase tracking-widest font-bold text-slate-300">
           Decentralized Style Intelligence Protocol
        </p>
      </div>
    </div>
  );
};

export default Register;
