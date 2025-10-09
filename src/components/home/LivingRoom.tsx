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
import { useQueryClient, useQuery } from '@tanstack/react-query';

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
  
  const queryClient = useQueryClient();
  
  // Real-time updates via WebSocket
  const { isConnected } = useMatchWebSocket(session?.user?.id || '');
  
  // Load deployed prompts using React Query for parallel loading
  const { data: deployedPrompts = [], isLoading: loadingDeployedPrompt } = useQuery({
    queryKey: ['deployedPrompts', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5050';
      const response = await fetch(`${backendUrl}/api/deployed-prompts?userId=${session.user.id}`, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Cache-Control': 'max-age=300' // Increased cache time to 5 minutes
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch deployed prompts');
      }
      
      return response.json();
    },
    enabled: !!session?.user?.id,
    staleTime: 300000, // Consider data stale after 5 minutes
    refetchOnWindowFocus: false,
    retry: 1, // Reduce retry attempts
    retryDelay: 1000, // Faster retry
  });
  
  // Use enhanced matching hooks with conditional polling
  const { data: matches = [], isLoading: matchesLoading } = useMatches(
    session?.user?.id || '', 
    !isConnected // Only poll when WebSocket is not connected
  );
  
  // Find active deployed prompt from the fetched data
  const activeDeployedPrompt = deployedPrompts.find((p: any) => p.status === 'ACTIVE');
  const isInitialLoad = loadingDeployedPrompt || matchesLoading;

  console.log('🏠 Living Room initialized for user:', session?.user?.name || session?.user?.username || 'Guest');

  // Auto-refresh matches when prompt is deployed
  useEffect(() => {
    if (activeDeployedPrompt && session?.user?.id) {
      // Trigger match finding in background
      triggerMatchFinding();
      // Also invalidate matches query to get fresh data
      queryClient.invalidateQueries({ queryKey: ['matches', session.user.id] });
    }
  }, [activeDeployedPrompt, queryClient, session?.user?.id]);

  const triggerMatchFinding = async () => {
    if (!session?.user?.id) return;
    
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5050';
      await fetch(`${backendUrl}/api/matches/trigger-finding`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ userId: session.user.id })
      });
      console.log('🚀 Match finding triggered successfully');
    } catch (error) {
      console.error('❌ Failed to trigger match finding:', error);
    }
  };


  // Update current prompt when active deployed prompt changes
  useEffect(() => {
    if (activeDeployedPrompt) {
      console.log('✅ Found active deployed prompt:', activeDeployedPrompt);
      const prompt = {
        id: activeDeployedPrompt.id,
        theme: activeDeployedPrompt.themeName,
        question: activeDeployedPrompt.question,
        deployedAt: new Date(activeDeployedPrompt.deployedAt)
      };
      setCurrentPrompt(prompt);
    } else {
      console.log('ℹ️ No active deployed prompt found');
      setCurrentPrompt(null);
    }
  }, [activeDeployedPrompt]);

  const handlePromptUpdate = (prompt: Prompt | null) => {
    console.log('📝 Prompt updated:', prompt);
    setCurrentPrompt(prompt);
    
    // If a new prompt was deployed, refresh the deployed prompts query
    if (prompt) {
      queryClient.invalidateQueries({ queryKey: ['deployedPrompts', session?.user?.id] });
    } else {
      // If prompt was cleared, also refresh to get updated state
      queryClient.invalidateQueries({ queryKey: ['deployedPrompts', session?.user?.id] });
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
          filter: 'brightness(0.3) contrast(1.2)',
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
        {isInitialLoad ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 animate-pulse">
            <div className="h-6 bg-white/20 rounded mb-4"></div>
            <div className="h-4 bg-white/20 rounded mb-2"></div>
            <div className="h-4 bg-white/20 rounded w-3/4"></div>
          </div>
        ) : !activeDeployedPrompt ? (
          <MyPrompt 
            currentPrompt={currentPrompt}
            onPromptUpdate={handlePromptUpdate}
          />
        ) : (
          <DeployedPromptSuccess
            themeName={activeDeployedPrompt.themeName}
            question={activeDeployedPrompt.question}
            deployedAt={new Date(activeDeployedPrompt.deployedAt)}
            expiresAt={new Date(activeDeployedPrompt.expiresAt)}
          />
        )}

        {/* YOUR MATCHES Section */}
        {isInitialLoad ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 animate-pulse">
            <div className="h-6 bg-white/20 rounded mb-4"></div>
            <div className="h-4 bg-white/20 rounded mb-2"></div>
            <div className="h-4 bg-white/20 rounded w-2/3"></div>
          </div>
        ) : (
          <YourMatches 
            matches={matches}
            hasMatchedToday={hasMatchedToday}
            currentPrompt={currentPrompt}
          />
        )}
      </div>

    </div>
  );
}; 