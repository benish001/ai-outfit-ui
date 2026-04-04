import React from 'react';

/**
 * LayoutWrapper - A premium, mobile-first background wrapper.
 * Features a soft radial gradient with a subtle noise texture.
 */
const LayoutWrapper = ({ children, className = "" }) => {
  return (
    <div className={`min-h-screen relative overflow-hidden bg-[#F9F7F5] ${className}`}>
      {/* Dynamic Background Gradient */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#FFF8F2_0%,_#FDF3EB_50%,_#F5EFE6_100%)]" />
        
        {/* Subtle Noise/Grain Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />
        
        {/* Floating Aura Blobs for Depth */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-rose-100 rounded-full blur-[100px] opacity-40 animate-pulse" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-slate-200 rounded-full blur-[80px] opacity-30 animate-bounce [animation-duration:10s]" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-24 md:px-6">
        {children}
      </div>
      
      {/* Bottom Safe Area Padding for Mobile Nav */}
      <div className="h-20 md:hidden" />
    </div>
  );
};

export default LayoutWrapper;
