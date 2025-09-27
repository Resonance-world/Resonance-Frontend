'use client';

import { Match, Prompt } from '@/types/home';
import { UserMatch } from '@/services/matchService';
import { useAcceptMatch, useDeclineMatch } from '@/api/matches/useMatches';
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

  console.log('🎯 YourMatches component - Matches:', matches.length, 'Has matched today:', hasMatchedToday);

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
        <div key={match.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-green-400/30 mb-3">
          <div className="mb-3">
            <p className="text-sm font-medium text-white mb-1">&ldquo;{match.question}&rdquo;</p>
            <p className="text-xs text-gray-400">{match.category}</p>
            <p className="text-xs text-gray-500">with {match.user}</p>
          </div>
          
          <div className="mb-3">
            <MatchStatusIndicator 
              status={match.status}
              userAccepted={match.userAccepted}
              otherUserAccepted={match.otherUserAccepted}
            />
          </div>
          
          <button
            onClick={() => handleGoToCircles(match.relationshipId!)}
            className="w-full bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-3 rounded-md transition-colors font-medium"
          >
            Go to Circles to Start Chat
          </button>
        </div>
      );
    }
    
    if (match.status === 'PENDING') {
      return (
        <div key={match.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 mb-3">
          <div className="mb-3">
            <p className="text-sm font-medium text-white mb-1">&ldquo;{match.question}&rdquo;</p>
            <p className="text-xs text-gray-400">{match.category}</p>
            <p className="text-xs text-gray-500">with {match.user}</p>
          </div>
          
          <div className="mb-3">
            <MatchStatusIndicator 
              status={match.status}
              userAccepted={match.userAccepted}
              otherUserAccepted={match.otherUserAccepted}
            />
          </div>
          
          {!match.userAccepted && (
            <div className="flex gap-2">
              <button
                onClick={() => handleAcceptMatch(match.id)}
                disabled={isAccepting}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white text-sm py-2 px-3 rounded-md transition-colors"
              >
                {isAccepting ? '...' : 'Accept'}
              </button>
              <button
                onClick={() => handleDeclineMatch(match.id)}
                disabled={isDeclining}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white text-sm py-2 px-3 rounded-md transition-colors"
              >
                {isDeclining ? '...' : 'Decline'}
              </button>
            </div>
          )}
        </div>
      );
    }
    
    // Don't render declined or expired matches
    return null;
  };

  const renderMatches = () => {
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
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
      <div className="text-white text-lg font-medium mb-3">YOUR MATCHES</div>
      <div className="text-gray-300 text-sm mb-4">
        5 matches a day. Show up with curiosity and feel the magic unfold.
      </div>

      {matches.length > 0 ? renderMatches() : renderEmptyState()}
      
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