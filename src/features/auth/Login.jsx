import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, ChevronLeft, ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';

/**
 * Login — Soft-pink gradient background, glassmorphism card.
 */
const Login = ({ onBack, onRegister, onLoginSuccess }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(formData.email, formData.password);
      onLoginSuccess?.();
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center p-6 relative overflow-hidden"
      style={{ background: 'linear-gradient(155deg, #FFF0F3 0%, #FFF4F7 45%, #FFF7F5 100%)' }}
    >
      {/* Depth blobs */}
      <div className="absolute -top-32 -right-24 w-80 h-80 rounded-full bg-rose-100/60 blur-[90px] pointer-events-none" />
      <div className="absolute bottom-0 -left-20 w-72 h-72 rounded-full bg-pink-100/50 blur-[80px] pointer-events-none" />

      <div className="relative w-full max-w-sm space-y-6">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <button
            id="login-back"
            onClick={onBack}
            className="w-11 h-11 rounded-full bg-white/80 shadow-card border border-rose-100 flex items-center justify-center text-[#6B7280] hover:text-rose-500 hover:border-rose-200 transition-all backdrop-blur-sm"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-xl font-bold luxury-font text-[#1C1917] tracking-tight">
            Tone<span className="italic opacity-30">Wear</span>
          </h1>
          <div className="w-11" />
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="rounded-[28px] p-8 md:p-10 space-y-7"
          style={{
            background: 'rgba(255,255,255,0.82)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1.5px solid rgba(254,205,211,0.45)',
            boxShadow: '0 20px 48px rgba(244,63,94,0.10), 0 4px 16px rgba(0,0,0,0.04)',
          }}
        >
          <div className="text-center space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-100 mb-2">
              <Sparkles size={11} className="text-rose-400" />
              <span className="text-[9px] font-black uppercase tracking-widest text-rose-400">Welcome Back</span>
            </div>
            <h2 className="text-2xl font-bold luxury-font italic text-[#1C1917]">Sign In</h2>
            <p className="text-[10px] uppercase tracking-widest font-bold text-[#9CA3AF]">Access your style identity</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-5 flex items-center text-rose-200 group-focus-within:text-rose-400 transition-colors">
                <Mail size={18} />
              </div>
              <input
                id="login-email"
                type="email"
                placeholder="Email Address"
                className="w-full pl-14 pr-6 py-4 rounded-2xl text-sm text-[#1C1917] placeholder:text-[#C4A0A8] outline-none transition-all"
                style={{
                  background: 'rgba(255,241,242,0.6)',
                  border: '1.5px solid rgba(254,205,211,0.5)',
                }}
                onFocus={(e) => { e.target.style.borderColor = '#FB7185'; e.target.style.boxShadow = '0 0 0 3px rgba(251,113,133,0.12)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(254,205,211,0.5)'; e.target.style.boxShadow = 'none'; }}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            {/* Password */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-5 flex items-center text-rose-200 group-focus-within:text-rose-400 transition-colors">
                <Lock size={18} />
              </div>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className="w-full pl-14 pr-14 py-4 rounded-2xl text-sm text-[#1C1917] placeholder:text-[#C4A0A8] outline-none transition-all"
                style={{
                  background: 'rgba(255,241,242,0.6)',
                  border: '1.5px solid rgba(254,205,211,0.5)',
                }}
                onFocus={(e) => { e.target.style.borderColor = '#FB7185'; e.target.style.boxShadow = '0 0 0 3px rgba(251,113,133,0.12)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(254,205,211,0.5)'; e.target.style.boxShadow = 'none'; }}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-5 flex items-center text-rose-200 hover:text-rose-400 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-100 text-[10px] text-red-500 font-bold uppercase tracking-wider text-center">
                {error}
              </div>
            )}

            <Button
              id="login-submit"
              variant="rose"
              size="lg"
              className="w-full"
              disabled={loading}
              type="submit"
            >
              {loading ? 'Verifying…' : 'Sign In'}
              {!loading && <LogIn size={16} />}
            </Button>
          </form>

          <div className="text-center">
            <button
              id="login-to-register"
              onClick={onRegister}
              className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#9CA3AF] hover:text-rose-500 transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              Need an account?{' '}
              <span className="text-rose-400 underline underline-offset-4">Register</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </motion.div>

        <p className="text-center text-[9px] uppercase tracking-widest font-bold text-rose-200">
          Secured · Private · Encrypted
        </p>
      </div>
    </div>
  );
};

export default Login;
