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

  const handleAcceptMatch = async (matchId: string) => {
    console.log('✅ Accepting match:', matchId);
    
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5050';
      const response = await fetch(`${backendUrl}/api/matches/${matchId}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ userId: 'cmfxx0quc00005mdanfwq1jh5' }) // TODO: Get from session
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Match accepted:', result);
        
        // Navigate to circles page to see the new connection
        if (result.relationshipId) {
          window.location.href = '/circles';
        }
      } else {
        console.error('❌ Failed to accept match');
        alert('Failed to accept match. Please try again.');
      }
    } catch (error) {
      console.error('❌ Error accepting match:', error);
      alert('Failed to accept match. Please try again.');
    }
  };

  const handleDeclineMatch = (matchId: string) => {
    console.log('❌ Declining match:', matchId);
    // TODO: Implement real match decline with backend API
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

  const renderMatches = () => {
    return (
      <div className="space-y-3">
        {matches.map((match) => (
          <div key={match.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 mb-3">
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