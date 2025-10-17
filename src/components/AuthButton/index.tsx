'use client';
import { walletAuth } from '@/auth/wallet';
import { Button, LiveFeedback } from '@worldcoin/mini-apps-ui-kit-react';
import { useMiniKit } from '@worldcoin/minikit-js/minikit-provider';
import { useCallback, useState } from 'react';

/**
 * This component is an example of how to authenticate a user
 * We will use Next Auth for this example, but you can use any auth provider
 * Read More: https://docs.world.org/mini-apps/commands/wallet-auth
 */
export const AuthButton = () => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isInstalled } = useMiniKit();

  console.log('🔍 MiniKit status:', { 
    isInstalled, 
    miniKitAvailable: typeof useMiniKit !== 'undefined',
    windowExists: typeof window !== 'undefined',
    userAgent: typeof window !== 'undefined' ? window.navigator?.userAgent : 'N/A'
  });

  const onClick = useCallback(async () => {
    if (isPending) return;
    
    setIsPending(true);
    setError(null);
    
    console.log('🚀 Authentication button clicked, MiniKit installed:', isInstalled);
    
    if (!isInstalled) {
      console.warn('⚠️ World App not detected');
      setError('World App not detected. Please open this in World App to authenticate.');
      setIsPending(false);
      return;
    }
    
    try {
      console.log('🔐 Starting wallet authentication...');
      await walletAuth();
      console.log('✅ Wallet authentication completed');
    } catch (error) {
      console.error('❌ Wallet authentication error:', error);
      setError('Authentication failed. Please try again.');
      setIsPending(false);
      return;
    }

    setIsPending(false);
  }, [isInstalled, isPending]);

  return (
    <div className="w-full space-y-4">
      <LiveFeedback
        label={{
          failed: 'Authentication failed',
          pending: '...',
          success: 'Authenticated!',
        }}
        state={isPending ? 'pending' : error ? 'failed' : undefined}
      >
        <Button
          onClick={onClick}
          disabled={isPending}
          size="md"
          variant="primary"
          className="w-full py-3 text-base font-medium bg-gradient-to-r from-amber-800/90 to-amber-900/90 hover:from-amber-700/95 hover:to-amber-800/95 backdrop-blur-sm border border-amber-600/50 hover:border-amber-500/70 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01] rounded-xl"
        >
          {isPending ? (
            <span className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
              Connecting to World...
            </span>
          ) : (
            "Signin with World"
          )}
        </Button>
      </LiveFeedback>
      
      {error && (
        <div className="text-sm text-red-400 text-center space-y-2 bg-red-900/20 rounded-lg p-3 border border-red-500/20">
          <p>{error}</p>
          {!isInstalled && (
            <p className="text-xs text-gray-300">
              This app requires World App to function properly
            </p>
          )}
        </div>
      )}
    </div>
  );
};
