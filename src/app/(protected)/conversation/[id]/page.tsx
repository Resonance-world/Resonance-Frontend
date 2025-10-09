'use client';

import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { ErrorBoundary, SimpleErrorFallback } from '@/components/ui/ErrorBoundary';

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
  
  return (
    <ErrorBoundary fallback={SimpleErrorFallback}>
      <ConversationChat 
        participantId={id}
        conversationPrompt="Computer mind vs Human mind?"
      />
    </ErrorBoundary>
  );
}
