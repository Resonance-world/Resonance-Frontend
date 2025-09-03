'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * WelcomeGift - Shows the generated NFT gift based on conversation
 * Matches the third screen in Figma wireframes with artwork display
 */
export const WelcomeGift = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    console.log('🎨 Loading NFT artwork...');
    
    // Simulate artwork loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
      console.log('✅ NFT artwork loaded');
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    console.log('🚀 Continuing to main app...');
    // Redirect to guest page for demo experience
    router.push('/guest');
  };

  return (
    <div className="innerview-dark min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">IV</span>
          </div>
          <span className="text-white font-medium">InnerView</span>
        </div>
        <span className="text-white/60 text-sm">welcome gift</span>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6">
        {/* NFT Artwork */}
        <div className="relative w-full max-w-sm">
          <div className={`aspect-square rounded-lg overflow-hidden transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <img
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&crop=center"
              alt="Your unique NFT artwork"
              className="w-full h-full object-cover"
              onLoad={() => setIsLoaded(true)}
            />
            
            {/* Decorative corners */}
            <div className="absolute top-2 left-2 w-4 h-4">
              <div className="w-full h-0.5 bg-white/40"></div>
              <div className="w-0.5 h-full bg-white/40"></div>
            </div>
            <div className="absolute top-2 right-2 w-4 h-4">
              <div className="w-full h-0.5 bg-white/40"></div>
              <div className="w-0.5 h-full bg-white/40 ml-auto"></div>
            </div>
            <div className="absolute bottom-2 left-2 w-4 h-4">
              <div className="w-0.5 h-full bg-white/40"></div>
              <div className="w-full h-0.5 bg-white/40 mt-auto"></div>
            </div>
            <div className="absolute bottom-2 right-2 w-4 h-4">
              <div className="w-0.5 h-full bg-white/40 ml-auto"></div>
              <div className="w-full h-0.5 bg-white/40 mt-auto"></div>
            </div>
          </div>
          
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-lg">
              <div className="w-8 h-8 border-2 border-white/30 border-t-green-400 rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* Message */}
        <div className="text-center space-y-4 max-w-sm">
          <p className="text-white text-center leading-relaxed">
            Based on our conversation, here&apos;s your unique ID card.
          </p>
          <p className="text-white font-medium text-lg">
            Welcome to InnerView
          </p>
        </div>

        {/* Continue button */}
        <button
          onClick={handleContinue}
          className="innerview-button px-8 py-3 mt-8"
          disabled={!isLoaded}
        >
          {isLoaded ? 'Enter InnerView' : 'Preparing...'}
        </button>
      </div>

      {/* Footer hint */}
      <div className="p-4 text-center">
        <p className="text-white/40 text-xs">
          Your NFT has been saved to your wallet
        </p>
      </div>
    </div>
  );
}; 