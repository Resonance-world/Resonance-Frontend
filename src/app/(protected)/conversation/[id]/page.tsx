import { ConversationChat } from '@/components/conversation/ConversationChat';

interface ConversationPageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Conversation Page - Main chat interface
 * Route: /conversation/[id]
 */
export default async function ConversationPage({ params }: ConversationPageProps) {
  const { id } = await params;
  
  return (
    <ConversationChat 
      conversationId={id}
      participantName="Tessa"
      conversationPrompt="Computer mind vs Human mind?"
      currentUserId="user-1"
    />
  );
} 