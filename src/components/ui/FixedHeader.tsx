'use client';

import { ResonanceLogo } from './ResonanceLogo';

/**
 * FixedHeader - Fixed header with RESONANCE logo and settings menu
 * Stays at the top when scrolling
 */
export const FixedHeader = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 border-b" style={{
      backgroundColor: 'var(--resonance-dark-bg)',
      borderColor: 'var(--resonance-border-subtle)'
    }}>
      <ResonanceLogo size="sm" />
      
      {/* Settings menu (3 dots) */}
      <button className="text-white/60 hover:text-white transition-colors">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
    </div>
  );
};

