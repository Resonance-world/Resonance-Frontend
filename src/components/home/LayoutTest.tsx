'use client';

import { useEffect } from 'react';

/**
 * LayoutTest - Simple component to verify bottom navigation doesn't hide content
 * This helps debug layout issues during development
 */
export const LayoutTest = () => {
  useEffect(() => {
    console.log('🧪 Layout Test initialized');
    
    // Check viewport and safe area
    const viewportHeight = window.innerHeight;
    const navHeight = 80; // Bottom nav height
    const safeBottomPadding = 128; // 8rem = 128px
    
    console.log('📐 Layout measurements:', {
      viewportHeight,
      navHeight,
      safeBottomPadding,
      availableContentHeight: viewportHeight - navHeight - safeBottomPadding
    });
    
    // Test if bottom area is accessible
    const testButton = document.querySelector('.innerview-button-primary');
    if (testButton) {
      const buttonRect = testButton.getBoundingClientRect();
      const isHidden = buttonRect.bottom > viewportHeight - navHeight;
      
      console.log('🔲 Button position check:', {
        buttonBottom: buttonRect.bottom,
        navTopPosition: viewportHeight - navHeight,
        isHiddenBehindNav: isHidden
      });
      
      if (isHidden) {
        console.error('❌ BUTTON IS HIDDEN BEHIND NAVIGATION!');
      } else {
        console.log('✅ Button is properly visible');
      }
    }
  }, []);

  return (
    <div className="fixed top-4 right-4 bg-black/50 text-white text-xs p-2 rounded z-50 max-w-xs">
      <div>Layout Debug Active</div>
      <div>Check console for measurements</div>
    </div>
  );
}; 