'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Prompt } from '@/types/home';

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
  const router = useRouter();

  console.log('📝 MyPrompt component - Current prompt:', currentPrompt);

  const handleSelectTheme = () => {
    console.log('🎯 Opening theme selection...');
    router.push('/home/themes');
  };

  const handleSelectPrompt = () => {
    if (!currentPrompt?.theme) {
      // If no theme selected, go to theme selection first
      handleSelectTheme();
      return;
    }
    
    console.log('💭 Opening prompt selection for theme:', currentPrompt.theme);
    router.push(`/home/prompts?theme=${currentPrompt.theme}`);
  };

  const handleDeployPrompt = async () => {
    if (!currentPrompt) return;
    
    console.log('🚀 Deploying prompt:', currentPrompt);
    setIsSelecting(true);
    
    try {
      // TODO: API call to deploy prompt
      // await deployPrompt(currentPrompt);
      
      // Simulate deployment
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const deployedPrompt = {
        ...currentPrompt,
        deployedAt: new Date()
      };
      
      onPromptUpdate(deployedPrompt);
      console.log('✅ Prompt deployed successfully');
    } catch (error) {
      console.error('❌ Failed to deploy prompt:', error);
    } finally {
      setIsSelecting(false);
    }
  };

  const isDeployed = currentPrompt?.deployedAt;
  const selectedTheme = currentPrompt?.theme;
  const selectedPrompt = currentPrompt?.question;

  return (
    <div className="innerview-card">
      <div className="innerview-card-header">MY PROMPT</div>
      <div className="innerview-card-description">
        Craft your conversation starter and find your people. You can deploy a new prompt every 7 days.
      </div>

      <div className="space-y-3">
        {/* Select theme */}
        <div 
          className={`innerview-prompt-item ${selectedTheme ? 'selected' : ''}`}
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
          className={`innerview-prompt-item ${selectedPrompt ? 'selected' : ''}`}
          onClick={handleSelectPrompt}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 pr-2">
              <div className="text-sm font-medium text-white">Select prompt</div>
              <div className="text-xs text-gray-400">
                {selectedPrompt || 'Click to craft your prompt'}
              </div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </div>
        </div>

        {/* Deploy button */}
        {selectedPrompt && !isDeployed && (
          <button
            onClick={handleDeployPrompt}
            disabled={isSelecting}
            className="innerview-button-primary w-full py-3"
          >
            {isSelecting ? 'Deploying...' : 'Deploy my prompt'}
          </button>
        )}

        {/* Deployed state */}
        {isDeployed && (
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
            <div className="text-sm font-medium text-green-400">Prompt deployed!</div>
            <div className="text-xs text-green-300/70">Add new prompt in 7 days</div>
          </div>
        )}
      </div>
    </div>
  );
}; 