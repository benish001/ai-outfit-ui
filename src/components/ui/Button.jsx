import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Button — Unified CTA component for the soft-pink design system.
 * All touch targets ≥ 44px. Includes rose/pink CTA variants.
 */
const Button = ({ 
  children, 
  onClick, 
  className, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  type = 'button',
  ...props 
}) => {
  const variants = {
    primary:   "bg-[#1C1917] text-white hover:bg-[#2D2420] shadow-lg hover:shadow-xl hover:scale-[1.02]",
    rose:      "bg-gradient-to-r from-[#F43F5E] to-[#FB7185] text-white shadow-rose-glow hover:shadow-pink-glow hover:scale-[1.02]",
    pink:      "bg-[#FB7185] text-white hover:bg-[#F43F5E] shadow-pink-glow hover:scale-[1.02]",
    secondary: "bg-white/80 text-[#1C1917] border border-rose-100 hover:border-rose-300 shadow-card hover:shadow-lift backdrop-blur-sm",
    outline:   "bg-transparent border-2 border-[#1C1917]/15 text-[#1C1917] hover:bg-[#1C1917]/5 hover:border-[#1C1917]/30",
    glass:     "glass-pink text-[#1C1917] hover:bg-white/60",
    ghost:     "bg-transparent text-[#1C1917]/60 hover:bg-rose-50 hover:text-[#1C1917]",
  };

  const sizes = {
    xs: "px-4 py-2 text-[9px] rounded-xl min-h-[36px]",
    sm: "px-5 py-2.5 text-[9px] rounded-[13px] min-h-[40px]",
    md: "px-7 py-3.5 text-[10px] rounded-[15px] min-h-[44px]",
    lg: "px-10 py-4.5 text-[11px] rounded-[18px] min-h-[52px]",
    xl: "px-12 py-5 text-[12px] rounded-[20px] min-h-[58px]",
  };

  return (
    <motion.button
      whileHover={{ y: -1.5 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={cn(
        "relative uppercase tracking-[0.25em] font-black transition-all duration-300 flex items-center justify-center gap-2 select-none overflow-hidden",
        variants[variant],
        sizes[size],
        disabled && "opacity-40 pointer-events-none grayscale",
        className
      )}
      {...props}
    >
      {/* Shimmer shine on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700 pointer-events-none" />
      {children}
    </motion.button>
  );
};

export default Button;
