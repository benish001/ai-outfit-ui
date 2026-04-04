import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Card — Premium card component for the soft-pink design system.
 * Pink-tinted glassmorphism and soft elevation shadows.
 */
const Card = ({ children, className, variant = 'elevated', animate = true, onClick, ...props }) => {
  const variants = {
    elevated:   "bg-white/85 shadow-card border border-rose-50 backdrop-blur-sm",
    glass:      "glass-pink rounded-2xl",
    'glass-white': "glass rounded-2xl",
    flat:       "bg-white/60 border border-rose-100/60 backdrop-blur-sm",
    outline:    "bg-transparent border border-rose-100",
    neumorphic: "bg-[#FFF1F2]/80 shadow-neumorphic-out border-none",
    pink:       "bg-gradient-to-br from-rose-50/80 to-pink-50/60 border border-rose-100/50 backdrop-blur-sm",
    dark:       "bg-[#1C1917] border border-white/5",
  };

  const Component = animate ? motion.div : 'div';
  const motionProps = animate
    ? { initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.4, ease: 'easeOut' } }
    : {};

  return (
    <Component
      {...motionProps}
      onClick={onClick}
      className={cn(
        "rounded-[20px] p-6 lg:p-8 overflow-hidden transition-all duration-400",
        variants[variant],
        onClick && "cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Card;
