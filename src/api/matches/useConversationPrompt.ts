import { useQuery } from "@tanstack/react-query";
import { AxiosInstance } from '@/api/axios/axios';

interface ConversationPrompt {
  question: string;
  theme: string;
  themeId: string;
}

interface ConversationPromptResponse {
  success: boolean;
  prompt: ConversationPrompt;
}

export const useConversationPrompt = (currentUserId?: string, otherUserId?: string) => {
  return useQuery<ConversationPromptResponse>({
    queryKey: ['conversation-prompt', currentUserId, otherUserId],
    queryFn: () => {
      console.log('🔍 Fetching conversation prompt for:', currentUserId, 'and', otherUserId);
      return AxiosInstance.get(`/api/matches/conversation-test`).then((res) => {
        console.log('🔍 Conversation prompt response:', res.data);
        return res.data;
      });
    },
    enabled: Boolean(currentUserId && otherUserId),
    staleTime: 10 * 60 * 1000, // Consider data fresh for 10 minutes (prompts don't change often)
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
  });
};
