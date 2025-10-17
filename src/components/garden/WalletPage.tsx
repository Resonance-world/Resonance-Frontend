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
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/garden_background.png)',
          filter: 'brightness(0.4) contrast(1.1)',
        }}
      />
      
      {/* Dark Overlay */}
      <div className="fixed inset-0 bg-black/40" />
      
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-4 border-b border-white/20 backdrop-blur-sm">
        <button
          onClick={() => router.back()}
          className="text-white hover:text-gray-300 transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 className="text-white text-lg font-medium">My Wallet</h1>
        <div className="w-6"></div> {/* Spacer for centering */}
      </div>

      {/* Content */}
      <div className="relative z-10 p-4">
        {/* Wallet Card */}
        <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/10 shadow-2xl">
          {/* Wallet Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
              </div>
              <div>
                <h2 className="text-white font-semibold">Resonance Wallet</h2>
                <p className="text-white/60 text-sm">World Chain</p>
              </div>
            </div>
            {isWorldApp && (
              <div className="flex items-center gap-2 bg-green-500/20 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-green-400 text-xs font-medium">Connected</span>
              </div>
            )}
          </div>

          {/* Balance Section */}
          <div className="text-center mb-6">
            <p className="text-white/60 text-sm mb-2">Total Balance</p>
            <h3 className="text-4xl font-bold text-white mb-1">{balance.toFixed(2)}</h3>
            <p className="text-green-400 font-medium">RES</p>
          </div>

          {/* Wallet Address */}
          <div className="bg-black/30 rounded-lg p-3 mb-4">
            <p className="text-white/60 text-xs mb-1">Wallet Address</p>
            <p className="text-white font-mono text-sm break-all">
              {session?.user?.walletAddress || 'Not connected'}
            </p>
          </div>

          {/* World ID */}
          <div className="bg-black/30 rounded-lg p-3">
            <p className="text-white/60 text-xs mb-1">World ID</p>
            <p className="text-white font-medium">
              {session?.user?.username ? `@${session.user.username}` : 'Not available'}
            </p>
          </div>
        </div>

        {/* Email Verification Section */}
        {showVerification && (
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 mb-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">🎁</span>
              </div>
              <div>
                <h3 className="text-white font-semibold">Earn 10 RES Tokens</h3>
                <p className="text-white/60 text-sm">Verify your email to get started</p>
              </div>
            </div>

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
                  className="w-full bg-green-400 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-semibold px-6 py-3 rounded-lg transition-colors"
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
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-400 text-center text-2xl font-mono tracking-widest"
                />
                <button
                  onClick={handleVerifyCode}
                  disabled={verifyingEmail || verificationCode.length !== 6}
                  className="w-full bg-green-400 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                  {verifyingEmail ? <LoadingSpinner size="sm" /> : 'Verify Code'}
                </button>
              </div>
            )}

            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            {message && !message.includes('code sent') && <p className="text-green-400 text-sm mt-2">{message}</p>}
          </div>
        )}

        {/* Transaction History */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10,9 9,9 8,9"/>
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold">Transaction History</h3>
              <p className="text-white/60 text-sm">{transactions.length} transactions</p>
            </div>
          </div>

          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <p className="text-white/70 font-medium">No transactions yet</p>
              <p className="text-white/50 text-sm">Your transaction history will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="bg-black/20 border border-white/10 rounded-lg p-4 hover:bg-black/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                        <span className="text-lg">{getTransactionIcon(tx.type)}</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{tx.description || tx.type.replace('_', ' ')}</p>
                        <p className="text-white/60 text-sm">{formatDate(tx.createdAt)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${parseFloat(tx.amount) > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {parseFloat(tx.amount) > 0 ? '+' : ''}{parseFloat(tx.amount).toFixed(2)} RES
                      </p>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${tx.status === 'completed' ? 'bg-green-400' : tx.status === 'pending' ? 'bg-yellow-400' : 'bg-red-400'}`}></div>
                        <p className="text-white/50 text-xs capitalize">{tx.status}</p>
                      </div>
                    </div>
                  </div>
                  {tx.transactionHash && (
                    <button
                      onClick={() => openBlockExplorer(tx.transactionHash!)}
                      className="mt-3 text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1 transition-colors"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                        <polyline points="15,3 21,3 21,9"/>
                        <line x1="10" y1="14" x2="21" y2="3"/>
                      </svg>
                      View on Explorer
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* World Wallet Info */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">🌍</span>
            </div>
            <h4 className="text-white font-semibold">Powered by World Chain</h4>
          </div>
          <p className="text-sm text-white/60">
            Your RES tokens are stored on World Chain Sepolia (testnet).
            <br />
            All transactions are secured by blockchain technology.
          </p>
        </div>
      </div>
    </div>
  );
};

