 'use client';
import { Button, LiveFeedback } from '@worldcoin/mini-apps-ui-kit-react';
import { MiniKit, VerificationLevel } from '@worldcoin/minikit-js';
import { useState } from 'react';

/**
 * This component is an example of how to use World ID in Mini Apps
 * Minikit commands must be used on client components
 * It's critical you verify the proof on the server side
 * Read More: https://docs.world.org/mini-apps/commands/verify#verifying-the-proof
 */
export const Verify = () => {
  const [buttonState, setButtonState] = useState<
    'pending' | 'success' | 'failed' | undefined
  >(undefined);

  const [whichVerification, setWhichVerification] = useState<VerificationLevel>(
    VerificationLevel.Device,
  );

  const onClickVerify = async (verificationLevel: VerificationLevel) => {
    setButtonState('pending');
    setWhichVerification(verificationLevel);
    
    try {
      const result = await MiniKit.commandsAsync.verify({
        action: 'verify', // Make sure to create this in the developer portal -> incognito actions
        verification_level: verificationLevel,
      });
      console.log('🔐 World ID verification result:', result.finalPayload);
      
      // Verify the proof on the server
      const response = await fetch('/api/verify-proof', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payload: result.finalPayload,
          action: 'verify',
        }),
      });

      const data = await response.json();
      console.log('📡 Server verification response:', data);

      if (data.verifyRes.success) {
        console.log('✅ User verified! Redirecting to onboarding...');
        setButtonState('success');
        
        // Redirect to onboarding flow after successful verification
        window.location.href = '/onboarding';
      } else {
        console.error('❌ Verification failed:', data.verifyRes);
        setButtonState('failed');

        // Reset the button state after 2 seconds
        setTimeout(() => {
          setButtonState(undefined);
        }, 2000);
      }
    } catch (error) {
      console.error('💥 Verification error:', error);
      setButtonState('failed');
      
      // Reset the button state after 2 seconds
      setTimeout(() => {
        setButtonState(undefined);
      }, 2000);
    }
  };

  return (
    <div className="grid w-full gap-4">
      <p className="text-lg font-semibold">Verify</p>
      <LiveFeedback
        label={{
          failed: 'Failed to verify',
          pending: 'Verifying',
          success: 'Verified',
        }}
        state={
          whichVerification === VerificationLevel.Device
            ? buttonState
            : undefined
        }
        className="w-full"
      >
        <Button
          onClick={() => onClickVerify(VerificationLevel.Device)}
          disabled={buttonState === 'pending'}
          size="lg"
          variant="tertiary"
          className="w-full"
        >
          Verify (Device)
        </Button>
      </LiveFeedback>
      {/* TODO: Uncomment when orb verification is needed
      <LiveFeedback
        label={{
          failed: 'Failed to verify',
          pending: 'Verifying',
          success: 'Verified',
        }}
        state={
          whichVerification === VerificationLevel.Orb ? buttonState : undefined
        }
        className="w-full"
      >
        <Button
          onClick={() => onClickVerify(VerificationLevel.Orb)}
          disabled={buttonState === 'pending'}
          size="lg"
          variant="primary"
          className="w-full"
        >
          Verify (Orb)
        </Button>
      </LiveFeedback>
      */}
    </div>
  );
};
