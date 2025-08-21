'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * LoadingGift - Shows loading state while preparing the NFT gift
 * Matches the second screen in Figma wireframes
 */
export const LoadingGift = () => {
  const router = useRouter();

  useEffect(() => {
    console.log('🎁 Preparing gift...');
    
    // Simulate gift preparation time (3-5 seconds)
    const loadingTime = 3000 + Math.random() * 2000;
    
    const timer = setTimeout(() => {
      console.log('✅ Gift ready! Redirecting to welcome gift...');
      router.push('/onboarding/gift');
    }, loadingTime);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="innerview-dark min-h-screen flex items-center justify-center">
      <div className="text-center space-y-8">
        {/* Loading animation */}
        <div className="relative">
          <div className="w-16 h-16 mx-auto">
            <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-green-400 rounded-full animate-spin"></div>
          </div>
        </div>
        
        {/* Loading message */}
        <div className="space-y-2">
          <p className="text-white text-lg font-medium italic">
            Preparing your gift...
          </p>
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
}; 