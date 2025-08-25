import { ConversationReflection } from '@/components/conversation/ConversationReflection';

interface ReflectionPageProps {
  params: {
    id: string;
  };
}

/**
 * Conversation Reflection Page
 * Route: /conversation/[id]/reflection
 */
export default function ReflectionPage({ params }: ReflectionPageProps) {
  return (
    <ConversationReflection 
      conversationId={params.id}
      participantName="Tessa"
      conversationDate="August 13, 2025"
      conversationPrompt="Computer mind vs Human mind?"
    />
  );
} 