import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility to merge tailwind classes safely
 */
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Button = ({ 
  children, 
  onClick, 
  className, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  ...props 
}) => {
  const variants = {
    primary: "bg-brand-dark text-white hover:bg-black shadow-xl hover:shadow-2xl hover:scale-[1.02]",
    secondary: "bg-white text-brand-dark border border-black/5 hover:border-black shadow-soft",
    gold: "bg-gradient-to-br from-[#D4AF37] to-[#B8860B] text-black font-black uppercase tracking-widest",
    outline: "bg-transparent border border-black/10 text-black hover:bg-black/5",
    glass: "glass-morphism text-black border-white/40 hover:bg-white/50"
  };

  const sizes = {
    sm: "px-4 py-2 text-[9px] rounded-[12px]",
    md: "px-8 py-4 text-[10px] rounded-[16px]",
    lg: "px-12 py-5 text-[11px] rounded-[18px]"
  };

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative uppercase tracking-[0.3em] font-black transition-all duration-300 flex items-center justify-center gap-2",
        variants[variant],
        sizes[size],
        disabled && "opacity-20 pointer-events-none grayscale",
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
