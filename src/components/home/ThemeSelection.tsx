'use client';

import { useRouter } from 'next/navigation';
import { PROMPT_THEMES } from '@/types/home';

/**
 * ThemeSelection - Page for selecting conversation themes
 * Implements the theme selection screen from Figma wireframes
 */
export const ThemeSelection = () => {
  const router = useRouter();

  console.log('🎯 Theme Selection page initialized');

  const handleThemeSelect = (themeId: string) => {
    console.log('🎨 Theme selected:', themeId);
    router.push(`/home/prompts?theme=${themeId}`);
  };

  const handleBack = () => {
    router.back();
  };

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
        <div className="mb-8 text-center">
          <h1 className="text-white text-xl font-medium mb-2">
            What&apos;s the theme of your prompt?
          </h1>
        </div>

        <div className="space-y-1">
          {PROMPT_THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => handleThemeSelect(theme.id)}
              className="w-full text-left p-4 text-white hover:bg-white/5 transition-colors border-b border-gray-700 last:border-b-0"
            >
              <div className="text-sm font-medium">
                {theme.name}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}; 