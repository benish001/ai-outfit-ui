import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, UserPlus, ChevronLeft, ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';

/**
 * Register — Matching pink-gradient glassmorphism auth screen.
 */
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

  const inputStyle = {
    background: 'rgba(255,241,242,0.6)',
    border: '1.5px solid rgba(254,205,211,0.5)',
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = '#FB7185';
    e.target.style.boxShadow = '0 0 0 3px rgba(251,113,133,0.12)';
  };
  const handleBlur = (e) => {
    e.target.style.borderColor = 'rgba(254,205,211,0.5)';
    e.target.style.boxShadow = 'none';
  };

  const baseInput = "w-full py-4 rounded-2xl text-sm text-[#1C1917] placeholder:text-[#C4A0A8] outline-none transition-all";

  return (
    <div
      className="auth-page"
      style={{ background: 'linear-gradient(155deg, #FFF0F3 0%, #FFF4F7 45%, #FFF7F5 100%)' }}
    >
      {/* Depth blobs — pointer-events:none so they never block touches */}
      <div className="absolute -top-24 right-0 w-80 h-80 rounded-full bg-pink-100/60 blur-[90px] pointer-events-none" />
      <div className="absolute bottom-0 -left-16 w-72 h-72 rounded-full bg-rose-100/50 blur-[80px] pointer-events-none" />

      <div className="auth-card-wrapper space-y-6">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <button
            id="register-back"
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
          className="rounded-[28px] p-8 md:p-10 space-y-6"
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
              <span className="text-[9px] font-black uppercase tracking-widest text-rose-400">Create Account</span>
            </div>
            <h2 className="text-2xl font-bold luxury-font italic text-[#1C1917]">Start Your Journey</h2>
            <p className="text-[10px] uppercase tracking-widest font-bold text-[#9CA3AF]">Discover your colour story</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-5 flex items-center text-rose-200 group-focus-within:text-rose-400 transition-colors">
                <User size={18} />
              </div>
              <input
                id="register-name"
                type="text"
                placeholder="Full Name"
                className={`${baseInput} pl-14 pr-6`}
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            {/* Email */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-5 flex items-center text-rose-200 group-focus-within:text-rose-400 transition-colors">
                <Mail size={18} />
              </div>
              <input
                id="register-email"
                type="email"
                placeholder="Email Address"
                className={`${baseInput} pl-14 pr-6`}
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
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
                id="register-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create Password"
                className={`${baseInput} pl-14 pr-14`}
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
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
              id="register-submit"
              variant="rose"
              size="lg"
              className="w-full"
              disabled={loading}
              type="submit"
            >
              {loading ? 'Creating Account…' : 'Register Now'}
              {!loading && <UserPlus size={16} />}
            </Button>
          </form>

          <div className="text-center">
            <button
              id="register-to-login"
              onClick={onLogin}
              className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#9CA3AF] hover:text-rose-500 transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              Already a member?{' '}
              <span className="text-rose-400 underline underline-offset-4">Sign In</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </motion.div>

        <p className="text-center text-[9px] uppercase tracking-widest font-bold text-rose-200">
          Free Forever · No Credit Card Required
        </p>
      </div>
    </div>
  );
};

export default Register;
