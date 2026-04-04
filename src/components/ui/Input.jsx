import React, { memo } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * MobileInput — High-performance input optimized for mobile touch devices.
 * Features:
 * - touch-action: manipulation (removes 300ms tap delay)
 * - inputMode/enterKeyHint for better virtual keyboards
 * - No-zoom on focus (via 16px font-size or viewport-fit=cover)
 * - Memoized to prevent parent re-renders while typing
 */
const MobileInput = memo(({ 
  icon: Icon, 
  error, 
  className,
  id,
  type = 'text',
  inputMode,
  enterKeyHint,
  autoComplete,
  ...props 
}) => {
  return (
    <div className="space-y-1.5 w-full group">
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-5 flex items-center text-rose-200 group-focus-within:text-rose-400 transition-colors pointer-events-none">
            <Icon size={18} />
          </div>
        )}
        
        <input
          id={id}
          type={type}
          inputMode={inputMode}
          enterKeyHint={enterKeyHint}
          autoComplete={autoComplete}
          className={cn(
            "w-full py-4 rounded-2xl text-base text-[#1C1917] placeholder:text-[#C4A0A8] outline-none transition-all",
            "bg-rose-50/60 border-[1.5px] border-rose-100/50",
            "focus:border-rose-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(251,113,133,0.12)]",
            Icon ? "pl-14 pr-6" : "px-6",
            error && "border-red-300 bg-red-50/50 focus:border-red-400 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]",
            "touch-manipulation", // Performance fix
            className
          )}
          {...props}
        />
      </div>
      
      {error && (
        <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider px-2">
          {error}
        </p>
      )}
    </div>
  );
});

MobileInput.displayName = 'MobileInput';

export default MobileInput;
