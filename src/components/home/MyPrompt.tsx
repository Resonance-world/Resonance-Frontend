'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Prompt } from '@/types/home';
import { useQueryClient } from '@tanstack/react-query';

interface MyPromptProps {
  currentPrompt: Prompt | null;
  onPromptUpdate: (prompt: Prompt | null) => void;
}

/**
 * MyPrompt - Component for managing user's conversation prompts
 * Implements the MY PROMPT section from Figma wireframes
 */
export const MyPrompt = ({ currentPrompt, onPromptUpdate }: MyPromptProps) => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  console.log('📝 MyPrompt component - Current prompt:', currentPrompt);

  useEffect(() => {
    // Check URL params for selected theme and prompt
    const theme = searchParams.get('theme');
    const themeId = searchParams.get('themeId');
    const promptId = searchParams.get('promptId');
    const question = searchParams.get('question');
    const customPromptParam = searchParams.get('customPrompt');

    if (theme && themeId) {
      setSelectedTheme(theme);
      
      if (question) {
        if (customPromptParam) {
          setCustomPrompt(question);
        } else {
          setSelectedPrompt(question);
        }
      }
    }
  }, [searchParams]);


  const handleSelectTheme = () => {
    console.log('🎯 Opening theme selection...');
    router.push('/home/themes');
  };

  const handleSelectPrompt = () => {
    if (!selectedTheme) {
      // If no theme selected, go to theme selection first
      handleSelectTheme();
      return;
    }
    
    console.log('💭 Opening prompt selection for theme:', selectedTheme);
    const themeId = searchParams.get('themeId');
    router.push(`/home/prompts?theme=${encodeURIComponent(selectedTheme)}&themeId=${themeId}`);
  };

  const handleDeployPrompt = async () => {
    if (!selectedTheme || (!selectedPrompt && !customPrompt) || !session?.user?.id) return;
    
    const promptData = {
      userId: session.user.id,
      themeId: searchParams.get('themeId'),
      themeName: selectedTheme,
      question: selectedPrompt || customPrompt,
      promptId: searchParams.get('promptId') || null,
      customPrompt: customPrompt || null
    };
    
    console.log('🚀 Deploying prompt:', promptData);
    setIsSelecting(true);
    
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5050';
      const response = await fetch(`${backendUrl}/api/deployed-prompts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(promptData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to deploy prompt' }));
        throw new Error(errorData.error || 'Failed to deploy prompt');
      }
      
      const deployedPrompt = await response.json();
      
      const prompt = {
        id: deployedPrompt.id,
        theme: selectedTheme,
        question: selectedPrompt || customPrompt || '',
        deployedAt: new Date(deployedPrompt.deployedAt)
      };
      
      onPromptUpdate(prompt);
      console.log('✅ Prompt deployed successfully');
      
      // Clear URL params after successful deployment
      router.push('/home');
    } catch (error) {
      console.error('❌ Failed to deploy prompt:', error);
      alert('Failed to deploy prompt. Please try again.');
    } finally {
      setIsSelecting(false);
    }
  };

  const handleCancelPrompt = async () => {
    if (!session?.user?.id || !currentPrompt?.id) return;
    
    const confirmed = window.confirm('Are you sure you want to cancel this prompt? This will expire all related matches.');
    if (!confirmed) return;
    
    setIsCancelling(true);
    
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5050';
      const response = await fetch(`${backendUrl}/api/deployed-prompts/${currentPrompt.id}/cancel`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          userId: session.user.id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to cancel prompt');
      }

      // Clear the current prompt
      onPromptUpdate(null);
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['deployedPrompts', session.user.id] });
      queryClient.invalidateQueries({ queryKey: ['matches', session.user.id] });
      queryClient.invalidateQueries({ queryKey: ['expiredMatches', session.user.id] });
      
      console.log('✅ Prompt cancelled successfully');
    } catch (error) {
      console.error('❌ Failed to cancel prompt:', error);
      alert('Failed to cancel prompt. Please try again.');
    } finally {
      setIsCancelling(false);
    }
  };

  const isDeployed = currentPrompt?.deployedAt;
  const currentTheme = currentPrompt?.theme;
  const currentQuestion = currentPrompt?.question;

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
      <div className="text-white text-lg font-medium mb-3">MY PROMPT</div>
      <div className="text-gray-300 text-sm mb-4">
        Craft your conversation starter to find your people. You can deploy a new prompt every 3 days.
      </div>

      <div className="space-y-3">
        {/* Select theme */}
        <div 
          className={`bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 cursor-pointer transition-all hover:bg-white/20 ${selectedTheme ? 'border-green-400 bg-green-400/10' : ''}`}
          onClick={handleSelectTheme}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-white">Select theme</div>
              <div className="text-xs text-gray-400">
                {selectedTheme ? selectedTheme.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Not selected'}
              </div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </div>
        </div>

        {/* Select prompt */}
        <div 
          className={`bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 cursor-pointer transition-all hover:bg-white/20 ${(selectedPrompt || customPrompt) ? 'border-green-400 bg-green-400/10' : ''}`}
          onClick={handleSelectPrompt}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 pr-2">
              <div className="text-sm font-medium text-white">Select prompt</div>
              <div className="text-xs text-gray-400">
                {selectedPrompt || customPrompt || 'Click to craft your prompt'}
              </div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </div>
        </div>

        {/* Deploy button */}
        {selectedTheme && (selectedPrompt || customPrompt) && !isDeployed && (
          <button
            onClick={handleDeployPrompt}
            disabled={isSelecting}
            className="bg-green-400 text-black w-full py-3 rounded-lg font-medium hover:bg-green-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSelecting ? 'Deploying...' : 'Deploy my prompt'}
          </button>
        )}

        {/* Deployed state */}
        {isDeployed && (
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-sm font-medium text-green-400">Prompt deployed!</div>
                <div className="text-xs text-green-300/70">Add new prompt in 3 days</div>
              </div>
              <button
                onClick={handleCancelPrompt}
                disabled={isCancelling}
                className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-medium hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCancelling ? 'Cancelling...' : 'Cancel'}
              </button>
            </div>
            <div className="text-xs text-green-300/70">
              Theme: {currentTheme} | Question: {currentQuestion}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 