import React from 'react';

/**
 * LayoutWrapper — Global soft-pink gradient background wrapper.
 * Applied consistently across all interior pages 
 * (not Splash, which has its own vivid gradient).
 *
 * Design tokens:
 *   Preset A — Blush:     #FFF0F3 → #FECDD3 → #FFF0F3  (135°)
 *   Preset B — Rose warm: #FFF1F2 → #FFE4E6 → #FFF7F0  (160°)
 *   Preset C — Warm pink: #FFF5F5 → #FEE2E2 → #FFF0EB  (145°)
 */
const LayoutWrapper = ({ children, className = '', variant = 'rose' }) => {
  const gradients = {
    blush: 'from-[#FFF0F3] via-[#FFF5F7] to-[#FFF0F3]',
    rose:  'from-[#FFF1F2] via-[#FFF4F6] to-[#FFF7F0]',
    warm:  'from-[#FFF5F5] via-[#FFF0F3] to-[#FFFBF0]',
  };

  return (
    <div className={`min-h-screen relative overflow-hidden noise-overlay ${className}`}>
      {/* ── Fixed Page Background (CSS variable fallback for low-end devices) ── */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ background: 'var(--bg-page)' }}
      >
        {/* Gradient mesh blobs for depth */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-rose-100/60 blur-[120px] animate-float-slow" />
        <div className="absolute top-1/3 -right-24 w-80 h-80 rounded-full bg-pink-100/50 blur-[90px] animate-float" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-red-50/40 blur-[100px] animate-float-slow" style={{ animationDelay: '3s' }} />

        {/* Subtle noise texture */}
        <div
          className="absolute inset-0 opacity-[0.022] mix-blend-multiply"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* ── Main Content ── */}
      <div className={`relative z-10 bg-gradient-to-br ${gradients[variant]} bg-fixed min-h-screen`}>
        {children}
      </div>
    </div>
  );
};

export default LayoutWrapper;
