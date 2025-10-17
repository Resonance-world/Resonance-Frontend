'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FixedHeader } from '@/components/ui/FixedHeader';

/**
 * TokenEarning - Email verification page for earning RES tokens
 * Replaces the NFT minting page with tokenization system
 */
export const TokenEarning = () => {
  const [step, setStep] = useState<'intro' | 'input' | 'verify' | 'success'>('intro');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const router = useRouter();
  const { data: session } = useSession();

  // Countdown timer for code expiration
  useEffect(() => {
    if (!expiresAt) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expiry = new Date(expiresAt).getTime();
      const diff = Math.max(0, Math.floor((expiry - now) / 1000));
      
      setTimeLeft(diff);
      
      if (diff === 0) {
        setError('Verification code expired. Please request a new one.');
        setStep('input');
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendCode = async () => {
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5050';
      const response = await fetch(`${backendUrl}/api/email-verification/send-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        credentials: 'include',
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send verification code');
      }

      setExpiresAt(data.expiresAt);
      setStep('verify');
    } catch (err: any) {
      setError(err.message || 'Failed to send verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      setError('Please enter the verification code');
      return;
    }

    if (verificationCode.length !== 6) {
      setError('Verification code must be 6 digits');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5050';
      const response = await fetch(`${backendUrl}/api/email-verification/verify-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        credentials: 'include',
        body: JSON.stringify({ code: verificationCode })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid verification code');
      }

      setStep('success');
      setResTokenBalance(data.reward?.amount || 10);
      refreshUser(); // Refresh user data
    } catch (err: any) {
      setError(err.message || 'Failed to verify code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    router.push('/home');
  };

  const handleContinue = () => {
    router.push('/home');
  };

  return (
    <div className="min-h-screen flex flex-col" style={{backgroundColor: 'var(--resonance-dark-bg)'}}>
      <FixedHeader />

      <div className="flex-1 flex flex-col items-center justify-center pt-16 p-6 space-y-6">
        
        {/* Intro Step */}
        {step === 'intro' && (
          <div className="max-w-sm w-full space-y-6 text-center">
            <div className="text-6xl mb-4">🎁</div>
            
            <div className="space-y-4">
              <h1 className="text-white text-2xl font-bold">Earn Your First RES Tokens!</h1>
              <p className="text-white/70 text-sm leading-relaxed">
                Verify your email and receive <span className="text-green-400 font-semibold">10 RES tokens</span> as a welcome reward.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-400/20 flex items-center justify-center">
                  <span className="text-green-400 text-xl">✓</span>
                </div>
                <div className="text-left">
                  <p className="text-white font-medium">Email Verification</p>
                  <p className="text-white/50 text-xs">Quick and secure</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-400/20 flex items-center justify-center">
                  <span className="text-green-400 text-xl">💰</span>
                </div>
                <div className="text-left">
                  <p className="text-white font-medium">10 RES Tokens</p>
                  <p className="text-white/50 text-xs">Instant reward</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setStep('input')}
                className="w-full bg-green-400 hover:bg-green-500 text-black font-semibold px-8 py-4 rounded-lg transition-colors"
              >
                Verify Email & Earn Tokens
              </button>
              <button
                onClick={handleSkip}
                className="w-full text-white/60 hover:text-white text-sm transition-colors"
              >
                Skip for now
              </button>
            </div>
          </div>
        )}

        {/* Email Input Step */}
        {step === 'input' && (
          <div className="max-w-sm w-full space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-white text-xl font-bold">Enter Your Email</h2>
              <p className="text-white/60 text-sm">We'll send you a verification code</p>
            </div>

            <div className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="your@email.com"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-green-400 transition-colors"
                disabled={loading}
              />

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={handleSendCode}
                disabled={loading}
                className="w-full bg-green-400 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-semibold px-8 py-4 rounded-lg transition-colors"
              >
                {loading ? 'Sending...' : 'Send Verification Code'}
              </button>

              <button
                onClick={() => setStep('intro')}
                disabled={loading}
                className="w-full text-white/60 hover:text-white text-sm transition-colors"
              >
                Back
              </button>
            </div>
          </div>
        )}

        {/* Verification Code Step */}
        {step === 'verify' && (
          <div className="max-w-sm w-full space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-white text-xl font-bold">Enter Verification Code</h2>
              <p className="text-white/60 text-sm">Check your email for the 6-digit code</p>
              {timeLeft > 0 && (
                <p className="text-green-400 text-sm font-mono">
                  Expires in {formatTime(timeLeft)}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setVerificationCode(value);
                  setError('');
                }}
                placeholder="000000"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white text-center text-2xl font-mono tracking-widest placeholder-white/40 focus:outline-none focus:border-green-400 transition-colors"
                maxLength={6}
                disabled={loading}
              />

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={handleVerifyCode}
                disabled={loading || verificationCode.length !== 6}
                className="w-full bg-green-400 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-semibold px-8 py-4 rounded-lg transition-colors"
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>

              <button
                onClick={() => {
                  setStep('input');
                  setVerificationCode('');
                  setExpiresAt(null);
                }}
                disabled={loading}
                className="w-full text-white/60 hover:text-white text-sm transition-colors"
              >
                Use different email
              </button>
            </div>
          </div>
        )}

        {/* Success Step */}
        {step === 'success' && (
          <div className="max-w-sm w-full space-y-6 text-center">
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            
            <div className="space-y-4">
              <h2 className="text-white text-2xl font-bold">Email Verified!</h2>
              <div className="bg-gradient-to-r from-green-400/20 to-emerald-400/20 backdrop-blur-sm rounded-lg p-6 border border-green-400/30">
                <p className="text-white/70 text-sm mb-2">You've earned</p>
                <p className="text-green-400 text-4xl font-bold">10 RES</p>
                <p className="text-white/50 text-xs mt-2">Tokens added to your wallet</p>
              </div>
            </div>

            <div className="space-y-4 text-sm text-white/60">
              <p>Your RES tokens are now available in your wallet.</p>
              <p>Use them to unlock features and rewards!</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => router.push('/garden/wallet')}
                className="w-full bg-green-400 hover:bg-green-500 text-black font-semibold px-8 py-4 rounded-lg transition-colors"
              >
                View Wallet
              </button>
              <button
                onClick={handleContinue}
                className="w-full text-white/60 hover:text-white text-sm transition-colors"
              >
                Continue to Living Room
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer hint */}
      <div className="p-4 text-center">
        <p className="text-white/40 text-xs">
          {step === 'intro' && 'You can verify your email later from your wallet'}
          {step === 'input' && 'Your email will be kept private and secure'}
          {step === 'verify' && 'Didn\'t receive the code? Check your spam folder'}
          {step === 'success' && 'Welcome to the Resonance community! 🌟'}
        </p>
      </div>
    </div>
  );
};

