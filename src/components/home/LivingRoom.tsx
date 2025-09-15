'use client';

import { useState, useEffect } from 'react';
import { MyPrompt } from './MyPrompt';
import { YourMatches } from './YourMatches';
import { Prompt, Match } from '@/types/home';

interface Session {
  user: {
    username?: string | null;
    name?: string | null;
    profilePictureUrl?: string | null;
  };
}

interface LivingRoomProps {
  session: Session;
}

/**
 * LivingRoom - Main home page component
 * Implements the "Hello, Amara" page with MY PROMPT and YOUR MATCHES sections
 */
export const LivingRoom = ({ session }: LivingRoomProps) => {
  const [currentPrompt, setCurrentPrompt] = useState<Prompt | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [hasMatchedToday] = useState(false);

  console.log('🏠 Living Room initialized for user:', session?.user?.name || session?.user?.username || 'Guest');

  useEffect(() => {
    // TODO: Load user's current prompt and matches from backend
    // For now, we'll simulate some state
    loadUserData();
  }, []);

  const loadUserData = async () => {
    console.log('📡 Loading user data...');
    
    // TODO: Replace with actual API calls
    // Check if user has an active prompt
    // Load any existing matches
    
    // Simulated data for development
    setTimeout(() => {
      console.log('✅ User data loaded');
    }, 1000);
  };

  const handlePromptUpdate = (prompt: Prompt | null) => {
    console.log('📝 Prompt updated:', prompt);
    setCurrentPrompt(prompt);
    
    // TODO: Send to backend for matching
    if (prompt) {
      // Simulate finding matches
      setTimeout(() => {
        setMatches([
          {
            id: '1',
            question: 'Computer mind vs Human mind?',
            category: 'Philosophy & Meaning',
            user: 'Tessa'
          },
          {
            id: '2', 
            question: 'What practice is helping you feel most alive lately?',
            category: 'Wellness & Embodiment',
            user: 'InnerView'
          }
        ]);
      }, 2000);
    }
  };

  const displayName = session?.user?.name || session?.user?.username || 'Friend';

  return (
    <div className="min-h-screen">
      {/* Main content */}
      <div className="p-4 space-y-6">
        {/* Greeting */}
        <div className="text-center">
          <h1 className="text-white text-2xl font-light italic">
            Hello, {displayName}
          </h1>
        </div>

        {/* MY PROMPT Section */}
        <MyPrompt 
          currentPrompt={currentPrompt}
          onPromptUpdate={handlePromptUpdate}
        />

        {/* YOUR MATCHES Section */}
        <YourMatches 
          matches={matches}
          hasMatchedToday={hasMatchedToday}
          currentPrompt={currentPrompt}
        />
      </div>

    </div>
  );
}; 