import React from 'react';

/**
 * PlatformLogo - Displays brand-appropriate logos with optimized fallbacks.
 * Uses text-based logos with precise brand colors if SVGs aren't provided.
 */
const PlatformLogo = ({ platform, size = 'md', className = '' }) => {
  const brandProfiles = {
    amazon: { color: 'text-[#1C1917]', bg: 'bg-[#FFD814]', label: 'Amazon', short: 'A' },
    flipkart: { color: 'text-white', bg: 'bg-[#2874F0]', label: 'Flipkart', short: 'F' },
    myntra: { color: 'text-white', bg: 'bg-[#FF3F6C]', label: 'Myntra', short: 'M' },
    ajio: { color: 'text-white', bg: 'bg-[#1C1C1C]', label: 'AJIO', short: 'A' },
    nykaa: { color: 'text-white', bg: 'bg-[#FC2779]', label: 'Nykaa', short: 'N' },
  };

  const key = platform?.toLowerCase() || 'default';
  const brand = brandProfiles[key] || { color: 'text-gray-700', bg: 'bg-gray-100', label: platform, short: platform?.[0] || '?' };

  const dimensions = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  return (
    <div
      className={`flex shrink-0 items-center justify-center font-black rounded-xl shadow-sm ${brand.bg} ${brand.color} ${dimensions[size]} ${className}`}
      aria-label={`${brand.label} logo`}
    >
      {/* 
        In production, replace this with actual SVGs.
        Using stylized initials as high-performance, layout-stable placeholders.
      */}
      {brand.short}
    </div>
  );
};

export default React.memo(PlatformLogo);
