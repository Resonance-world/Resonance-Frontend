'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface Theme {
  id: string;
  name: string;
  description?: string;
  prompts: {
    id: string;
    question: string;
  }[];
}

export default function ThemesPage() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  useEffect(() => {
    fetchThemes();
  }, []);

  const fetchThemes = async () => {
    try {
      setLoading(true);
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5050';
      console.log('🎨 Fetching themes from:', `${backendUrl}/api/themes`);
      
      const response = await fetch(`${backendUrl}/api/themes`, {
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      });
      
      console.log('🎨 Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch themes: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('🎨 Themes loaded:', data.length, 'themes');
      setThemes(data);
    } catch (err) {
      console.error('❌ Error fetching themes:', err);
      setError('Failed to load themes');
    } finally {
      setLoading(false);
    }
  };

  const handleThemeSelect = (theme: Theme) => {
    console.log('Selected theme:', theme);
    // Navigate back to living room with selected theme
    router.push(`/home?theme=${encodeURIComponent(theme.name)}&themeId=${theme.id}`);
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
          <h1 className="text-white text-lg font-medium">Select Theme</h1>
          <div className="w-6"></div>
        </div>

        {/* Loading */}
        <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-white">Loading themes...</div>
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
          <h1 className="text-white text-lg font-medium">Select Theme</h1>
          <div className="w-6"></div>
        </div>

        {/* Error */}
        <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="text-red-400 mb-2">Error loading themes</div>
            <button
              onClick={fetchThemes}
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
        <h1 className="text-white text-lg font-medium">Select Theme</h1>
        <div className="w-6"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-4">
        <div className="mb-4">
          <p className="text-gray-300 text-sm">Choose a theme that resonates with you</p>
        </div>

        {/* Themes List */}
        <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
          {themes.map((theme) => (
            <div
              key={theme.id}
              onClick={() => handleThemeSelect(theme)}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 cursor-pointer transition-all hover:bg-white/20 hover:border-green-400/50"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-white font-medium mb-1">{theme.name}</h3>
                  {theme.description && (
                    <p className="text-gray-400 text-sm mb-2">{theme.description}</p>
                  )}
                  <p className="text-gray-500 text-xs">
                    {theme.prompts.length} prompt{theme.prompts.length !== 1 ? 's' : ''} available
                  </p>
                </div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 