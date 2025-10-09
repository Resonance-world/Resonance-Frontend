import dynamic from 'next/dynamic';
import { PageLoadingSpinner } from '@/components/ui/LoadingSpinner';

// Dynamic import for better bundle splitting - conversation chat is heavy with real-time features
const ConversationChat = dynamic(
  () => import('@/components/conversation/ConversationChat').then(mod => ({ default: mod.ConversationChat })),
  {
    loading: () => <PageLoadingSpinner text="Loading conversation..." />
  }
);

interface ConversationPageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
Conversation Page - Main chat interface
Route: /conversation/[id]*/
export default async function ConversationPage({ params }: ConversationPageProps) {
  const { id } = await params;
  return (
    <ConversationChat 
      participantId={id}
      conversationPrompt="Computer mind vs Human mind?"
    />
  );
}
