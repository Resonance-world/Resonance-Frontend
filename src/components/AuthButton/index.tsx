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
    <div className="w-full space-y-2">
      <LiveFeedback
        label={{
          failed: 'Authentication failed',
          pending: 'Authenticating...',
          success: 'Authenticated!',
        }}
        state={isPending ? 'pending' : error ? 'failed' : undefined}
      >
        <Button
          onClick={onClick}
          disabled={isPending}
          size="lg"
          variant="primary"
          className="w-full"
        >
          {isPending ? (
            <span className="flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
              Connecting to World App...
            </span>
          ) : (
            <>
              <span className="mr-2">🌍</span>
              Sign in with World App
            </>
          )}
        </Button>
      </LiveFeedback>
      
      {error && (
        <div className="text-sm text-red-400 text-center space-y-1">
          <p>{error}</p>
          {!isInstalled && (
            <p className="text-xs text-gray-400">
              This app requires World App to function properly
            </p>
          )}
        </div>
      )}
      
      {/* Debug info for development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-500 text-center">
          MiniKit Status: {isInstalled ? '✅ Installed' : '❌ Not Detected'}
        </div>
      )}
    </div>
  );
};
