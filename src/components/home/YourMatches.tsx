'use client';

import { Match, Prompt } from '@/types/home';

interface YourMatchesProps {
  matches: Match[];
  hasMatchedToday: boolean;
  currentPrompt: Prompt | null;
}

/**
 * YourMatches - Component for displaying conversation matches
 * Implements the YOUR MATCHES section from Figma wireframes
 */
export const YourMatches = ({ matches, hasMatchedToday, currentPrompt }: YourMatchesProps) => {
  console.log('🎯 YourMatches component - Matches:', matches.length, 'Has matched today:', hasMatchedToday);

  const handleAcceptMatch = (matchId: string) => {
    console.log('✅ Accepting match:', matchId);
    // Navigate to conversation when accepting match
    const match = matches.find(m => m.id === matchId);
    if (match?.user && match.user !== 'InnerView') {
      // Create conversation ID and navigate
      const conversationId = `conv-${matchId}`;
      window.location.href = `/conversation/${conversationId}`;
    }
  };

  const handleDeclineMatch = (matchId: string) => {
    console.log('❌ Declining match:', matchId);
    // TODO: Handle match decline
  };

  const renderEmptyState = () => {
    if (hasMatchedToday) {
      return (
        <div className="innerview-match-circle matched">
          <div className="mb-4">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-green-400 mx-auto">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <p className="text-sm text-green-400 mb-2">You matched with someone today! &lt;3</p>
          <p className="text-xs text-gray-400">come back tomorrow for a new match.</p>
        </div>
      );
    }

    if (!currentPrompt?.deployedAt) {
      return (
        <div className="innerview-match-circle">
          <div className="mb-4">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-gray-400 mx-auto">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <p className="text-sm text-gray-400 mb-2">No match yet.</p>
          <p className="text-xs text-gray-500">Deploy a prompt and find your match.</p>
        </div>
      );
    }

    return (
      <div className="innerview-match-circle">
        <div className="mb-4">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-gray-400 mx-auto">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
        <p className="text-sm text-gray-400 mb-2">Finding your match...</p>
        <p className="text-xs text-gray-500">Check back soon!</p>
      </div>
    );
  };

  const renderMatches = () => {
    return (
      <div className="space-y-3">
        {matches.map((match) => (
          <div key={match.id} className="innerview-prompt-item">
            <div className="mb-3">
                             <p className="text-sm font-medium text-white mb-1">&ldquo;{match.question}&rdquo;</p>
              <p className="text-xs text-gray-400">{match.category}</p>
              <p className="text-xs text-gray-500">with {match.user}</p>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => handleAcceptMatch(match.id)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-3 rounded-md transition-colors"
              >
                ✓
              </button>
              <button
                onClick={() => handleDeclineMatch(match.id)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm py-2 px-3 rounded-md transition-colors"
              >
                ✗
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="innerview-card">
      <div className="innerview-card-header">YOUR MATCHES</div>
      <div className="innerview-card-description">
        5 matches a day. Show up with curiosity and feel the magic unfold.
      </div>

      {matches.length > 0 ? renderMatches() : renderEmptyState()}
      
      {/* Add profile information prompt */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <button 
          onClick={() => window.location.href = '/garden'}
          className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-800/70 transition-colors w-full"
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