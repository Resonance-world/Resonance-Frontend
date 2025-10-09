'use client';

import dynamic from 'next/dynamic';
import { PageLoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useParams } from 'next/navigation';
import { ErrorBoundary, SimpleErrorFallback } from '@/components/ui/ErrorBoundary';
import { LoadingWrapper } from '@/components/ui/LoadingWrapper';

// Dynamic import for better bundle splitting - conversation chat is heavy with real-time features
const ConversationChat = dynamic(
  () => import('@/components/conversation/ConversationChat').then(mod => ({ default: mod.ConversationChat })),
  {
    loading: () => <PageLoadingSpinner text="Loading conversation..." />
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
      <LoadingWrapper loadingText="Loading conversation..." minLoadingTime={2000}>
        <ConversationChat 
          participantId={id}
          conversationPrompt="Computer mind vs Human mind?"
        />
      </LoadingWrapper>
    </ErrorBoundary>
  );
}
