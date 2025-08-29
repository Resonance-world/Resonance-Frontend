import { ConversationReflection } from '@/components/conversation/ConversationReflection';

interface ReflectionPageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Conversation Reflection Page
 * Route: /conversation/[id]/reflection
 */
export default async function ReflectionPage({ params }: ReflectionPageProps) {
  const { id } = await params;
  
  return (
    <ConversationReflection 
      conversationId={id}
      participantName="Tessa"
      conversationDate="August 13, 2025"
      conversationPrompt="Computer mind vs Human mind?"
    />
  );
} 