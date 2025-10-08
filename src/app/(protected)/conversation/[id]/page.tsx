import dynamic from 'next/dynamic';

// Dynamic import for better bundle splitting - conversation chat is heavy with real-time features
const ConversationChat = dynamic(
  () => import('@/components/conversation/ConversationChat').then(mod => ({ default: mod.ConversationChat })),
  {
    loading: () => <div className="flex items-center justify-center min-h-screen">Loading conversation...</div>
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
