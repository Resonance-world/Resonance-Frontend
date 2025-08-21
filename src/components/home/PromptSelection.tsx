'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PREDEFINED_PROMPTS, PROMPT_THEMES, Prompt } from '@/types/home';

/**
 * PromptSelection - Page for selecting specific prompts within a theme
 * Implements the prompt selection screen from Figma wireframes
 */
export const PromptSelection = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const themeId = searchParams.get('theme');
  
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  console.log('💭 Prompt Selection page initialized for theme:', themeId);
  console.log('📏 Layout check - Selected prompt:', selectedPrompt?.question);

  const theme = PROMPT_THEMES.find(t => t.id === themeId);
  const prompts = themeId ? PREDEFINED_PROMPTS[themeId] || [] : [];

  useEffect(() => {
    if (!themeId) {
      router.push('/home/themes');
    }
  }, [themeId, router]);

  const handlePromptSelect = (prompt: Prompt) => {
    console.log('📝 Prompt selected:', prompt);
    setSelectedPrompt(prompt);
    setCustomPrompt('');
  };

  const handleCustomPromptChange = (value: string) => {
    setCustomPrompt(value);
    if (value.trim() && themeId) {
      const customPromptObj: Prompt = {
        id: 'custom',
        theme: themeId,
        question: value.trim(),
        isCustom: true
      };
      setSelectedPrompt(customPromptObj);
    } else {
      setSelectedPrompt(null);
    }
  };

  const handleContinue = () => {
    if (!selectedPrompt) return;
    
    console.log('🚀 Continuing with prompt:', selectedPrompt);
    console.log('✅ Button clicked successfully - not hidden behind navbar');
    
    // Store the selected prompt in localStorage for now
    // TODO: Replace with proper state management or API call
    localStorage.setItem('selectedPrompt', JSON.stringify(selectedPrompt));
    
    router.push('/home');
  };

  const handleBack = () => {
    router.back();
  };

  if (!themeId || !theme) {
    return <div>Loading...</div>;
  }

  return (
    <div className="innerview-dark min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <button 
          onClick={handleBack}
          className="text-white/60 hover:text-white"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5m7-7l-7 7 7 7"/>
          </svg>
        </button>
        
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">IV</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 innerview-safe-bottom-large">
        <div className="mb-6">
          <h1 className="text-white text-xl font-medium mb-2">Select one prompt</h1>
          <p className="text-gray-400 text-sm">For {theme.name}</p>
        </div>

        {/* Predefined prompts */}
        <div className="space-y-3 mb-6">
          {prompts.map((prompt) => (
            <button
              key={prompt.id}
              onClick={() => handlePromptSelect(prompt)}
              className={`innerview-prompt-item w-full text-left ${
                selectedPrompt?.id === prompt.id ? 'selected' : ''
              }`}
            >
              <div className="text-sm text-white">
                {prompt.question}
              </div>
            </button>
          ))}
        </div>

        {/* Custom prompt section */}
        <div className="text-center mb-6">
          <span className="text-gray-400 text-sm">or</span>
        </div>

        <div className="innerview-prompt-item">
          <div className="mb-3">
            <h3 className="text-sm font-medium text-white mb-2">Craft your prompt</h3>
            <p className="text-xs text-gray-400 mb-4">
              Craft your own prompt for a meaningful conversation that you want to have.
            </p>
            <p className="text-xs text-gray-500 mb-4">
              Example: &ldquo;What practice is helping you feel most alive lately?&rdquo;
            </p>
          </div>
          
          <textarea
            value={customPrompt}
            onChange={(e) => handleCustomPromptChange(e.target.value)}
            placeholder="Write your prompt here..."
            className="innerview-textarea"
            rows={4}
          />
        </div>

        {/* Continue button */}
        {selectedPrompt && (
          <div className="mt-6">
            <button
              onClick={handleContinue}
              className="innerview-button-primary w-full py-3"
            >
              Continue with this prompt
            </button>
            <div className="h-4"></div> {/* Extra spacing */}
          </div>
        )}
      </div>
    </div>
  );
}; 