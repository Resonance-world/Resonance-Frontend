'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface Prompt {
  id: string;
  question: string;
}

interface Theme {
  id: string;
  name: string;
  description?: string;
}

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [theme, setTheme] = useState<Theme | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const themeId = searchParams.get('themeId');
  const themeName = searchParams.get('theme');

  useEffect(() => {
    if (themeId && themeName) {
      setTheme({ id: themeId, name: themeName });
      fetchPrompts();
    } else {
      setError('Theme information missing');
      setLoading(false);
    }
  }, [themeId, themeName]);

  const fetchPrompts = async () => {
    try {
      setLoading(true);
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5050';
      console.log('💭 Fetching prompts from:', `${backendUrl}/api/themes/${themeId}/prompts`);
      
      const response = await fetch(`${backendUrl}/api/themes/${themeId}/prompts`, {
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      });
      
      console.log('💭 Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch prompts: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('💭 Prompts loaded:', data.length, 'prompts');
      setPrompts(data);
    } catch (err) {
      console.error('❌ Error fetching prompts:', err);
      setError('Failed to load prompts');
    } finally {
      setLoading(false);
    }
  };

  const handlePromptSelect = (prompt: Prompt) => {
    console.log('Selected prompt:', prompt);
    // Navigate back to living room with selected prompt
    router.push(`/home?theme=${encodeURIComponent(themeName!)}&themeId=${themeId}&promptId=${prompt.id}&question=${encodeURIComponent(prompt.question)}`);
  };

  const handleCustomPromptSave = () => {
    if (!customPrompt.trim()) {
      alert('Please enter a custom prompt');
      return;
    }
    
    console.log('Custom prompt:', customPrompt);
    // Navigate back to living room with custom prompt
    router.push(`/home?theme=${encodeURIComponent(themeName!)}&themeId=${themeId}&customPrompt=${encodeURIComponent(customPrompt)}`);
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen relative">
        {/* Background Image */}
        <div 
          className="fixed inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/garden_background.png)',
            filter: 'brightness(0.3) contrast(1.2)',
          }}
        />
        
        {/* Dark Overlay */}
        <div className="fixed inset-0 bg-black/40" />
        
        {/* Header */}
        <div className="relative z-10 flex items-center justify-between p-4 border-b border-white/20 backdrop-blur-sm">
          <button
            onClick={handleBack}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <h1 className="text-white text-lg font-medium">Select Prompt</h1>
          <div className="w-6"></div>
        </div>

        {/* Loading */}
        <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-white">Loading prompts...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen relative">
        {/* Background Image */}
        <div 
          className="fixed inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/garden_background.png)',
            filter: 'brightness(0.3) contrast(1.2)',
          }}
        />
        
        {/* Dark Overlay */}
        <div className="fixed inset-0 bg-black/40" />
        
        {/* Header */}
        <div className="relative z-10 flex items-center justify-between p-4 border-b border-white/20 backdrop-blur-sm">
          <button
            onClick={handleBack}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <h1 className="text-white text-lg font-medium">Select Prompt</h1>
          <div className="w-6"></div>
        </div>

        {/* Error */}
        <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="text-red-400 mb-2">Error loading prompts</div>
            <button
              onClick={fetchPrompts}
              className="bg-green-400 text-black px-4 py-2 rounded-lg font-medium hover:bg-green-300 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/garden_background.png)',
          filter: 'brightness(0.3) contrast(1.2)',
        }}
      />
      
      {/* Dark Overlay */}
      <div className="fixed inset-0 bg-black/40" />
      
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-4 border-b border-white/20 backdrop-blur-sm">
        <button
          onClick={handleBack}
          className="text-white hover:text-gray-300 transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 className="text-white text-lg font-medium">Select Prompt</h1>
        <div className="w-6"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-4">
        <div className="mb-4">
          <h2 className="text-white text-lg font-medium mb-1">{theme?.name}</h2>
          <p className="text-gray-300 text-sm">Choose a prompt or create your own</p>
        </div>

        {/* Toggle between predefined and custom prompts */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setIsCustomMode(false)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              !isCustomMode 
                ? 'bg-green-400 text-black' 
                : 'bg-white/10 text-white border border-white/20'
            }`}
          >
            Predefined
          </button>
          <button
            onClick={() => setIsCustomMode(true)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isCustomMode 
                ? 'bg-green-400 text-black' 
                : 'bg-white/10 text-white border border-white/20'
            }`}
          >
            Custom
          </button>
        </div>

        {!isCustomMode ? (
          /* Predefined Prompts */
          <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
            {prompts.map((prompt) => (
              <div
                key={prompt.id}
                onClick={() => handlePromptSelect(prompt)}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 cursor-pointer transition-all hover:bg-white/20 hover:border-green-400/50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 pr-2">
                    <p className="text-white text-sm leading-relaxed">"{prompt.question}"</p>
                  </div>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Custom Prompt */
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <label className="block text-white text-sm font-medium mb-2">
                Craft your own prompt
              </label>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Write your conversation starter here..."
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-green-400 transition-colors resize-none"
                rows={4}
              />
              <div className="mt-3 flex gap-2">
                <button
                  onClick={handleCustomPromptSave}
                  className="bg-green-400 text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-300 transition-colors"
                >
                  Save & Continue
                </button>
                <button
                  onClick={() => setIsCustomMode(false)}
                  className="bg-white/10 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors border border-white/20"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}