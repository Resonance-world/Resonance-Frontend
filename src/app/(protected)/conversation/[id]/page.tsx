import { ConversationChat } from '@/components/conversation/ConversationChat';
import { fetchUserProfile } from '@/services/circlesService';


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

  let participantData = {
    id: id,
    name: id === 'profile-tessa' ? 'Tessa' : id,
    profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face'
  };

  // Try to fetch real user data if not Tessa mockup
  if (id !== 'profile-tessa') {
    try {
      const userData = await fetchUserProfile(id);
      participantData = {
        id: userData.id,
        name: userData.name || userData.username,
        profilePicture: userData.profilePictureUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Fallback to using ID as name
    }
  }
  
  return (
    <ConversationChat 
      conversationId={id}
      participantName={participantData.name}
      participantId={id}
      participantProfilePicture={participantData.profilePicture}
      conversationPrompt="Computer mind vs Human mind?"
    />
  );
} 