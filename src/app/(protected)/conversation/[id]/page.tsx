'use client';

import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ErrorBoundary, SimpleErrorFallback } from '@/components/ui/ErrorBoundary';
import { useConversationPrompt } from '@/api/matches/useConversationPrompt';

// Simple dynamic import without loading state - let the component handle its own loading
const ConversationChat = dynamic(
  () => import('@/components/conversation/ConversationChat').then(mod => ({ default: mod.ConversationChat }))
);

/**
Conversation Page - Main chat interface
Route: /conversation/[id]*/
export default function ConversationPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: session } = useSession();
  
  // Get the actual conversation prompt
  const { data: promptData, isLoading: promptLoading, error: promptError } = useConversationPrompt(
    session?.user?.id,
    id
  );
  
  // Debug logging
  console.log('🔍 Conversation prompt data:', {
    sessionUserId: session?.user?.id,
    participantId: id,
    promptData,
    promptLoading,
    promptError
  });
  
  // Use the real prompt or fallback to default
  const conversationPrompt = promptData?.prompt?.question || "Computer mind vs Human mind?";
  const conversationTheme = promptData?.prompt?.theme || "Philosophy & Meaning";
  
  return (
    <ErrorBoundary fallback={SimpleErrorFallback}>
      <ConversationChat 
        participantId={id}
        conversationPrompt={conversationPrompt}
        conversationTheme={conversationTheme}
      />
    </ErrorBoundary>
  );
}
