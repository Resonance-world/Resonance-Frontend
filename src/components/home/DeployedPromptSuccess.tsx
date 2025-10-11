'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useQueryClient } from '@tanstack/react-query';

interface DeployedPromptSuccessProps {
  themeName: string;
  question: string;
  deployedAt: Date;
  expiresAt: Date;
  deployedPromptId: string;
  onPromptCancelled: () => void;
}

/**
 * DeployedPromptSuccess - Component to display successful prompt deployment
 * Shows between My Prompt and Your Matches containers
 */
export const DeployedPromptSuccess = ({ 
  themeName, 
  question, 
  deployedAt, 
  expiresAt,
  deployedPromptId,
  onPromptCancelled
}: DeployedPromptSuccessProps) => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [isCancelling, setIsCancelling] = useState(false);

  // Debug logging
  console.log('🔍 DeployedPromptSuccess rendered with props:', {
    themeName,
    question,
    deployedPromptId,
    hasOnPromptCancelled: !!onPromptCancelled,
    sessionUserId: session?.user?.id
  });

  const handleCancelPrompt = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🔴 Cancel button clicked!');
    console.log('🔴 Session user ID:', session?.user?.id);
    console.log('🔴 Deployed prompt ID:', deployedPromptId);
    
    // Test if button is working
    alert('Cancel button clicked! This is a test.');
    
    if (!session?.user?.id || !deployedPromptId) {
      console.error('❌ Missing session or deployedPromptId');
      return;
    }
    
    const confirmed = window.confirm('Are you sure you want to cancel this prompt? This will expire all related matches.');
    if (!confirmed) {
      console.log('❌ User cancelled the confirmation');
      return;
    }
    
    console.log('✅ User confirmed cancellation, starting...');
    setIsCancelling(true);
    
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5050';
      console.log('🔴 Making API call to:', `${backendUrl}/api/deployed-prompts/${deployedPromptId}/cancel`);
      
      const response = await fetch(`${backendUrl}/api/deployed-prompts/${deployedPromptId}/cancel`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          userId: session.user.id
        })
      });

      console.log('🔴 API response status:', response.status);
      console.log('🔴 API response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API error response:', errorText);
        throw new Error(`Failed to cancel prompt: ${response.status} ${errorText}`);
      }

      const responseData = await response.json();
      console.log('✅ API response data:', responseData);

      // Call the parent callback to handle prompt cancellation
      console.log('🔴 Calling onPromptCancelled callback');
      onPromptCancelled();
      
      // Invalidate queries to refresh data
      console.log('🔴 Invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['deployedPrompts', session.user.id] });
      queryClient.invalidateQueries({ queryKey: ['matches', session.user.id] });
      queryClient.invalidateQueries({ queryKey: ['expiredMatches', session.user.id] });
      
      console.log('✅ Prompt cancelled successfully');
    } catch (error) {
      console.error('❌ Failed to cancel prompt:', error);
      alert(`Failed to cancel prompt: ${error.message}`);
    } finally {
      setIsCancelling(false);
    }
  };
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const getTimeRemaining = () => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffMs = expiry.getTime() - now.getTime();
    
    if (diffMs <= 0) {
      return 'Expired';
    }
    
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} remaining`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} remaining`;
    } else {
      return 'Less than 1 hour remaining';
    }
  };

  return (
    <div className="bg-green-400/10 backdrop-blur-sm rounded-lg p-4 border border-green-400/30">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-400/20 rounded-full flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-400">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <div>
            <h3 className="text-green-400 font-medium">Prompt Deployed Successfully!</h3>
            <p className="text-green-300/70 text-xs">{getTimeRemaining()}</p>
          </div>
        </div>
        <button
          onClick={handleCancelPrompt}
          disabled={isCancelling}
          className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-95 transform border border-red-400"
          style={{ 
            pointerEvents: 'auto',
            zIndex: 10,
            position: 'relative'
          }}
        >
          {isCancelling ? 'Cancelling...' : 'Cancel Prompt'}
        </button>
      </div>
      
      <div className="space-y-2">
        <div>
          <p className="text-gray-400 text-xs mb-1">Theme</p>
          <p className="text-white text-sm font-medium">{themeName}</p>
        </div>
        
        <div>
          <p className="text-gray-400 text-xs mb-1">Your Prompt</p>
          <p className="text-white text-sm leading-relaxed">"{question}"</p>
        </div>
        
        <div className="flex justify-between text-xs text-gray-500 pt-2 border-t border-white/10">
          <span>Deployed: {formatDate(deployedAt)}</span>
          <span>Expires: {formatDate(expiresAt)}</span>
        </div>
      </div>
{/*       
      <div className="mt-3 p-2 bg-white/5 rounded-lg">
        <p className="text-gray-300 text-xs text-center">
          🔍 We're finding people who resonate with you ...
        </p>
      </div> */}
    </div>
  );
};
