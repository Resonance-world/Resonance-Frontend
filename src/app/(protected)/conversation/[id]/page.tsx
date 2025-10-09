'use client';

import dynamic from 'next/dynamic';
import { PageLoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useParams } from 'next/navigation';
import { ErrorBoundary, SimpleErrorFallback } from '@/components/ui/ErrorBoundary';

// Dynamic import for better bundle splitting - conversation chat is heavy with real-time features
const ConversationChat = dynamic(
  () => import('@/components/conversation/ConversationChat').then(mod => ({ default: mod.ConversationChat })),
  {
    loading: () => <PageLoadingSpinner text="Loading conversation..." />,
    ssr: false // Disable SSR to prevent hydration issues
  }
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
