import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Card = ({ children, className, variant = 'elevated', animate = true, ...props }) => {
  const variants = {
    elevated: "bg-white shadow-premium border border-black/5",
    glass: "glass-morphism rounded-xl",
    flat: "bg-white/50 border border-black/5",
    outline: "bg-transparent border border-black/10",
    neumorphic: "bg-[#F8F8F8] shadow-neumorphic-out border-none"
  };

  const Component = animate ? motion.div : 'div';

  return (
    <Component
      initial={animate ? { opacity: 0, y: 20 } : undefined}
      whileInView={animate ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true }}
      className={cn(
        "rounded-[18px] p-6 lg:p-8 overflow-hidden transition-all duration-500",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Card;
