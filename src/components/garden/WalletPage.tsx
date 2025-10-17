'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FixedHeader } from '@/components/ui/FixedHeader';
import { LoadingSpinner, PageLoadingSpinner } from '@/components/ui/LoadingSpinner';
import { MiniKit } from '@worldcoin/minikit-js';

interface TokenTransaction {
  id: string;
  amount: string;
  type: string;
  description: string | null;
  transactionHash: string | null;
  status: string;
  createdAt: string;
}

/**
 * WalletPage - Display user's RES token balance and transaction history
 */
export const WalletPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<TokenTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isWorldApp, setIsWorldApp] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      fetchWalletData();
    }
    
    // Check if running in World App
    setIsWorldApp(MiniKit.isInstalled());
  }, [session]);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      
      // Fetch user balance
      const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${session?.user?.id}`);
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setBalance(parseFloat(userData.resTokenBalance || '0'));
        
        // Check if email is not verified yet
        if (!userData.emailVerified) {
          setShowVerification(true);
        }
      }

      // Fetch transaction history
      const txResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${session?.user?.id}/transactions`);
      if (txResponse.ok) {
        const txData = await txResponse.json();
        setTransactions(txData.transactions || []);
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendCode = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setError('');
    setMessage('');
    setVerifyingEmail(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/email-verification/send-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Verification code sent to your email!');
      } else {
        setError(data.error || 'Failed to send verification code');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setVerifyingEmail(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      setError('Please enter the verification code');
      return;
    }

    setError('');
    setMessage('');
    setVerifyingEmail(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/email-verification/verify-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ code: verificationCode }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(`Email verified! You earned ${data.reward.amount} RES tokens!`);
        setShowVerification(false);
        // Refresh wallet data
        setTimeout(() => {
          fetchWalletData();
        }, 1000);
      } else {
        setError(data.error || 'Failed to verify code');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setVerifyingEmail(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'EMAIL_VERIFICATION':
        return '📧';
      case 'REFERRAL_BONUS':
        return '👥';
      case 'DAILY_REWARD':
        return '🎁';
      case 'MATCH_BONUS':
        return '💬';
      default:
        return '💎';
    }
  };

  const openBlockExplorer = (txHash: string) => {
    // World Chain Sepolia explorer
    const explorerUrl = `https://worldchain-sepolia.explorer.alchemy.com/tx/${txHash}`;
    window.open(explorerUrl, '_blank');
  };

  const getOnChainBalance = async () => {
    if (!isWorldApp || !session?.user?.walletAddress) {
      return;
    }

    try {
      // Use World Wallet to get the actual on-chain balance
      // This would require the RES token contract address
      const contractAddress = process.env.NEXT_PUBLIC_RES_TOKEN_ADDRESS;
      if (!contractAddress) {
        console.warn('RES token contract address not configured');
        return;
      }

      // For now, we'll use the database balance
      // In a full implementation, you'd query the contract directly
      console.log('Getting on-chain balance for:', session.user.walletAddress);
    } catch (error) {
      console.error('Error getting on-chain balance:', error);
    }
  };

  if (loading) {
    return <PageLoadingSpinner text="Loading wallet..." />;
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--resonance-dark-bg)' }}>
      <FixedHeader />

      <div className="flex-1 flex flex-col items-center pt-16 p-6 space-y-6 text-white">
        {/* Header */}
        <div className="w-full max-w-2xl">
          <button
            onClick={() => router.back()}
            className="mb-4 text-white/70 hover:text-white transition-colors flex items-center gap-2"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold mb-2">My Wallet</h1>
          <p className="text-white/70">Manage your RES tokens</p>
        </div>

        {/* Balance Card */}
        <div className="w-full max-w-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-8 text-center">
          <p className="text-white/70 text-sm mb-2">Total Balance</p>
          <h2 className="text-5xl font-bold mb-4">{balance.toFixed(2)}</h2>
          <p className="text-xl text-green-400">RES</p>
          <div className="mt-6 text-sm text-white/50">
            World ID: {session?.user?.username ? `@${session.user.username}` : 'N/A'}
          </div>
          {isWorldApp && (
            <div className="mt-2 text-xs text-green-400">
              🌍 Connected to World Wallet
            </div>
          )}
        </div>

        {/* Email Verification Section */}
        {showVerification && (
          <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">🎁 Earn 10 RES Tokens</h3>
            <p className="text-white/70 mb-4">Verify your email to earn your first tokens!</p>

            {!message.includes('code sent') ? (
              <div className="space-y-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <button
                  onClick={handleSendCode}
                  disabled={verifyingEmail}
                  className="resonance-button-primary w-full py-3 rounded-lg disabled:opacity-50"
                >
                  {verifyingEmail ? <LoadingSpinner size="sm" /> : 'Send Verification Code'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-green-400 text-sm">{message}</p>
                <input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <button
                  onClick={handleVerifyCode}
                  disabled={verifyingEmail || verificationCode.length !== 6}
                  className="resonance-button-primary w-full py-3 rounded-lg disabled:opacity-50"
                >
                  {verifyingEmail ? <LoadingSpinner size="sm" /> : 'Verify Code'}
                </button>
              </div>
            )}

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            {message && !message.includes('code sent') && <p className="text-green-400 text-sm mt-2">{message}</p>}
          </div>
        )}

        {/* Transaction History */}
        <div className="w-full max-w-2xl">
          <h3 className="text-xl font-bold mb-4">Transaction History</h3>
          {transactions.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center text-white/50">
              No transactions yet
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getTransactionIcon(tx.type)}</span>
                      <div>
                        <p className="font-semibold">{tx.description || tx.type.replace('_', ' ')}</p>
                        <p className="text-sm text-white/50">{formatDate(tx.createdAt)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-400">+{parseFloat(tx.amount).toFixed(2)} RES</p>
                      {tx.transactionHash && (
                        <button
                          onClick={() => openBlockExplorer(tx.transactionHash!)}
                          className="text-xs text-blue-400 hover:text-blue-300 transition-colors mt-1"
                        >
                          View on Explorer →
                        </button>
                      )}
                      {!tx.transactionHash && tx.status === 'pending' && (
                        <p className="text-xs text-yellow-400 mt-1">Pending...</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* World Wallet Info */}
        <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-xl p-6 text-center">
          <h4 className="font-semibold mb-2">🌍 Powered by World Chain</h4>
          <p className="text-sm text-white/50">
            Your RES tokens are stored on World Chain Sepolia (testnet).
            <br />
            All transactions are secured by blockchain technology.
          </p>
        </div>
      </div>
    </div>
  );
};

