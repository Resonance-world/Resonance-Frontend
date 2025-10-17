'use client';

import { useState } from 'react';
import { Match, Prompt } from '@/types/home';
import { UserMatch } from '@/services/matchService';
import { useAcceptMatch, useDeclineMatch } from '@/api/matches/useMatches';
import { useExpiredMatches } from '@/api/matches/useExpiredMatches';
import { MatchStatusIndicator } from '@/components/matches/MatchStatusIndicator';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface YourMatchesProps {
  matches: UserMatch[];
  hasMatchedToday: boolean;
  currentPrompt: Prompt | null;
}

/**
 * YourMatches - Component for displaying conversation matches
 * Implements the YOUR MATCHES section from Figma wireframes
 */
export const YourMatches = ({ matches, hasMatchedToday, currentPrompt }: YourMatchesProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const { mutate: acceptMatch, isPending: isAccepting } = useAcceptMatch();
  const { mutate: declineMatch, isPending: isDeclining } = useDeclineMatch();
  const [activeTab, setActiveTab] = useState<'current' | 'expired'>('current');
  
  // Fetch expired matches
  const { data: expiredMatches = [], isLoading: loadingExpired } = useExpiredMatches(session?.user?.id);

  console.log('🎯 YourMatches component - Matches:', matches.length, 'Expired:', expiredMatches.length, 'Has matched today:', hasMatchedToday);

  const handleAcceptMatch = (matchId: string) => {
    if (!session?.user?.id) return;
    
    console.log('✅ Accepting match:', matchId);
    acceptMatch({ matchId, userId: session.user.id });
  };

  const handleDeclineMatch = (matchId: string) => {
    if (!session?.user?.id) return;
    
    console.log('❌ Declining match:', matchId);
    declineMatch({ matchId, userId: session.user.id });
  };

  const handleGoToCircles = (relationshipId: string) => {
    console.log('🔗 Going to circles with relationship:', relationshipId);
    router.push(`/circles?relationshipId=${relationshipId}`);
  };

  const renderExpiredMatchCard = (match: any) => {
    const isConfirmed = match.status === 'CONFIRMED';
    const isExpired = match.status === 'EXPIRED';
    
    return (
      <div key={match.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-gray-400/30">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center">
            {match.userProfile.profilePictureUrl ? (
              <img 
                src={match.userProfile.profilePictureUrl} 
                alt={match.user} 
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <span className="text-gray-300 text-lg font-medium">
                {match.user.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-medium">{match.user}</h3>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-400 bg-gray-600/50 px-2 py-1 rounded-full">
                  EXPIRED
                </span>
              </div>
            </div>
            <p className="text-gray-300 text-sm mt-1">{match.question}</p>
            <p className="text-gray-400 text-xs mt-1">{match.category}</p>
            <p className="text-gray-500 text-xs mt-1">
              Expired: {new Date(match.expiredAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderEmptyState = () => {
    if (hasMatchedToday) {
      return (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-green-400/30 text-center">
          <div className="mb-4">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-green-400 mx-auto">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <p className="text-sm text-green-400 mb-2">You matched with someone today! &lt;3</p>
          <p className="text-xs text-gray-400">Come back tomorrow for a new match.</p>
        </div>
      );
    }

    if (!currentPrompt?.deployedAt) {
      return (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 text-center">
          <div className="mb-4">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-gray-400 mx-auto">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <p className="text-sm text-gray-400 mb-2">No matches yet.</p>
          <p className="text-xs text-gray-500">Deploy a prompt to start finding your people.</p>
        </div>
      );
    }

    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 text-center">
        <div className="mb-4">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-gray-400 mx-auto">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
        <p className="text-sm text-gray-400 mb-2">Finding your matches...</p>
        <p className="text-xs text-gray-500">We're connecting you with people who resonate with your prompt.</p>
      </div>
    );
  };

  const renderMatchCard = (match: UserMatch) => {
    if (match.status === 'CONFIRMED') {
      return (
        <div key={match.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-green-400/30 mb-3">
          <div className="flex items-center space-x-4">
            {/* Profile Picture */}
            <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
              {match.userProfile?.profilePictureUrl ? (
                <img 
                  src={match.userProfile.profilePictureUrl} 
                  alt={match.user} 
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <span className="text-gray-300 text-lg font-medium">
                  {match.user.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            
            {/* Match Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-medium text-base">{match.user}</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-green-400 bg-green-400/20 px-2 py-1 rounded-full">
                    CONFIRMED
                  </span>
                </div>
              </div>
              
              <p className="text-gray-400 text-xs mb-1">{match.category}</p>
              <p className="text-gray-300 text-sm mb-2">&ldquo;{match.question}&rdquo;</p>
              
              <button
                onClick={() => handleGoToCircles(match.relationshipId!)}
                className="bg-emerald-500/60 hover:bg-emerald-500/80 text-white text-sm py-2 px-4 rounded-lg transition-colors font-medium"
              >
                Start Chat
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    if (match.status === 'PENDING') {
      return (
        <div key={match.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 mb-3">
          <div className="flex items-center space-x-4">
            {/* Profile Picture */}
            <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
              {match.userProfile?.profilePictureUrl ? (
                <img 
                  src={match.userProfile.profilePictureUrl} 
                  alt={match.user} 
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <span className="text-gray-300 text-lg font-medium">
                  {match.user.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            
            {/* Match Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-medium text-base">{match.user}</h3>
                {!match.userAccepted && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleAcceptMatch(match.id)}
                      disabled={isAccepting}
                      className="w-10 h-10 bg-emerald-500/60 hover:bg-emerald-500/80 disabled:bg-emerald-500/30 text-white rounded-full transition-colors flex items-center justify-center"
                      title="Accept to start chat"
                    >
                      {isAccepting ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 6L9 17l-5-5"/>
                        </svg>
                      )}
                    </button>
                    <button
                      onClick={() => handleDeclineMatch(match.id)}
                      disabled={isDeclining}
                      className="w-10 h-10 bg-slate-500/60 hover:bg-slate-500/80 disabled:bg-slate-500/30 text-white rounded-full transition-colors flex items-center justify-center"
                      title="Decline match"
                    >
                      {isDeclining ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                      )}
                    </button>
                  </div>
                )}
              </div>
              
              <p className="text-gray-400 text-xs mb-1">{match.category}</p>
              <p className="text-gray-300 text-sm">&ldquo;{match.question}&rdquo;</p>
              
              <div className="mt-2">
                <MatchStatusIndicator 
                  status={match.status}
                  userAccepted={match.userAccepted}
                  otherUserAccepted={match.otherUserAccepted}
                />
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    // Don't render declined or expired matches
    return null;
  };

  const renderMatches = () => {
    if (activeTab === 'current') {
      const visibleMatches = matches.filter(match => 
        match.status === 'PENDING' || match.status === 'CONFIRMED'
      );

      if (visibleMatches.length === 0) {
        return renderEmptyState();
      }

      return (
        <div className="space-y-3">
          {visibleMatches.map(renderMatchCard)}
        </div>
      );
    } else {
      // Expired matches tab
      if (loadingExpired) {
        return (
          <div className="space-y-3">
            {[...Array(2)].map((_, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-white/20"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/20 rounded w-3/4"></div>
                    <div className="h-4 bg-white/20 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      }

      if (expiredMatches.length === 0) {
        return (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-gray-400/30 text-center">
            <div className="text-gray-300 text-sm">
              No expired matches yet. Matches expire when prompts are cancelled or after 7 days.
            </div>
          </div>
        );
      }

      return (
        <div className="space-y-3">
          {expiredMatches.map(renderExpiredMatchCard)}
        </div>
      );
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
      <div className="text-white text-lg font-medium mb-3">You may resonate with</div>
      <div className="text-gray-300 text-sm mb-4">
        5 matches a day. Show up with curiosity and feel the magic unfold.
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center space-x-4 mb-4">
        <button
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            activeTab === 'current' ? 'bg-white text-black' : 'bg-white/20 text-white'
          }`}
          onClick={() => setActiveTab('current')}
        >
          Current ({matches.filter(m => m.status === 'PENDING' || m.status === 'CONFIRMED').length})
        </button>
        <button
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            activeTab === 'expired' ? 'bg-white text-black' : 'bg-white/20 text-white'
          }`}
          onClick={() => setActiveTab('expired')}
        >
          Expired ({expiredMatches.length})
        </button>
      </div>

      {activeTab === 'current' && matches.length > 0 ? renderMatches() : 
       activeTab === 'expired' ? renderMatches() : 
       activeTab === 'current' ? renderEmptyState() : null}
      
      {/* Add profile information prompt */}
      <div className="mt-4 pt-4 border-t border-white/20">
        <button 
          onClick={() => window.location.href = '/garden'}
          className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-lg cursor-pointer hover:bg-white/20 transition-colors w-full border border-white/20"
        >
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-300">
              <path d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-white">Add more information to your profile and get a more personalized match</p>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>
    </div>
  );
}; 