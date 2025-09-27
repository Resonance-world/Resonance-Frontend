'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { MyPrompt } from './MyPrompt';
import { YourMatches } from './YourMatches';
import { DeployedPromptSuccess } from './DeployedPromptSuccess';
import { Prompt, Match } from '@/types/home';
import { UserMatch } from '@/services/matchService';
import { useMatches } from '@/api/matches/useMatches';
import { useMatchWebSocket } from '@/hooks/useMatchWebSocket';
import { useQueryClient } from '@tanstack/react-query';

interface Session {
  user: {
    id?: string;
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
  const [hasMatchedToday] = useState(false);
  const [activeDeployedPrompt, setActiveDeployedPrompt] = useState<any>(null);
  const [loadingDeployedPrompt, setLoadingDeployedPrompt] = useState(true);
  
  const queryClient = useQueryClient();
  
  // Real-time updates via WebSocket
  const { isConnected } = useMatchWebSocket(session?.user?.id || '');
  
  // Use enhanced matching hooks with conditional polling
  const { data: matches = [], isLoading: matchesLoading } = useMatches(
    session?.user?.id || '', 
    !isConnected // Only poll when WebSocket is not connected
  );

  console.log('🏠 Living Room initialized for user:', session?.user?.name || session?.user?.username || 'Guest');

  useEffect(() => {
    // Load active deployed prompt
    loadActiveDeployedPrompt();
  }, [session?.user?.id]);

  // Auto-refresh matches when prompt is deployed
  useEffect(() => {
    if (activeDeployedPrompt) {
      // Trigger match finding by invalidating matches query
      queryClient.invalidateQueries({ queryKey: ['matches', session?.user?.id] });
    }
  }, [activeDeployedPrompt, queryClient, session?.user?.id]);


  const loadActiveDeployedPrompt = async () => {
    if (!session?.user?.id) {
      setLoadingDeployedPrompt(false);
      return;
    }

    try {
      console.log('🚀 Loading active deployed prompt...');
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5050';
      const response = await fetch(`${backendUrl}/api/deployed-prompts?userId=${session.user.id}`, {
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      });
      
      if (response.ok) {
        const deployedPrompts = await response.json();
        const activePrompt = deployedPrompts.find((p: any) => p.status === 'ACTIVE');
        
        if (activePrompt) {
          console.log('✅ Found active deployed prompt:', activePrompt);
          setActiveDeployedPrompt(activePrompt);
          
          // Convert to Prompt format for compatibility
          const prompt = {
            id: activePrompt.id,
            theme: activePrompt.themeName,
            question: activePrompt.question,
            deployedAt: new Date(activePrompt.deployedAt)
          };
          setCurrentPrompt(prompt);
        } else {
          console.log('ℹ️ No active deployed prompt found');
          setActiveDeployedPrompt(null);
        }
      } else {
        console.error('❌ Failed to load deployed prompts');
      }
    } catch (error) {
      console.error('❌ Error loading active deployed prompt:', error);
    } finally {
      setLoadingDeployedPrompt(false);
    }
  };

  const handlePromptUpdate = (prompt: Prompt | null) => {
    console.log('📝 Prompt updated:', prompt);
    setCurrentPrompt(prompt);
    
    // If a new prompt was deployed, refresh the active deployed prompt
    if (prompt) {
      loadActiveDeployedPrompt();
      // TODO: Implement real matching system with existing users
    } else {
      // If prompt was cleared, also clear active deployed prompt
      setActiveDeployedPrompt(null);
    }
  };

  const displayName = session?.user?.name || session?.user?.username || 'Friend';

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/circles_background.png)',
          filter: 'brightness(0.4) contrast(1.1)',
        }}
      />
      
      {/* Dark Overlay */}
      <div className="fixed inset-0 bg-black/40" />
      
      {/* Main content */}
      <div className="relative z-10 p-4 space-y-6">
        {/* Greeting */}
        <div className="text-center">
          <h1 className="text-white text-2xl font-light italic">
            Hello, {displayName}
          </h1>
        </div>

        {/* MY PROMPT Section - Only show when no active deployed prompt */}
        {!activeDeployedPrompt && (
          <MyPrompt 
            currentPrompt={currentPrompt}
            onPromptUpdate={handlePromptUpdate}
          />
        )}

        {/* Deployed Prompt Success Section */}
        {activeDeployedPrompt && (
          <DeployedPromptSuccess
            themeName={activeDeployedPrompt.themeName}
            question={activeDeployedPrompt.question}
            deployedAt={new Date(activeDeployedPrompt.deployedAt)}
            expiresAt={new Date(activeDeployedPrompt.expiresAt)}
          />
        )}

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