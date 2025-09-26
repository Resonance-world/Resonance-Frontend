import { useQuery } from '@tanstack/react-query';

interface UnreadMessage {
  senderId: string;
  hasUnread: boolean;
}

interface UnreadMessagesResponse {
  unreadMessages: UnreadMessage[];
}

export const useGetUnreadMessages = (currentUserId: string | undefined, userIds: string[] = []) => {
  return useQuery<UnreadMessagesResponse>({
    queryKey: ['unreadMessages', currentUserId, userIds],
    queryFn: async () => {
      if (!currentUserId || userIds.length === 0) {
        return { unreadMessages: [] };
      }

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5050';
      const userIdsParam = userIds.map(id => `userIds=${id}`).join('&');
      const response = await fetch(`${backendUrl}/api/messages/unread/${currentUserId}?${userIdsParam}`, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch unread messages');
      }

      return response.json();
    },
    enabled: !!currentUserId && userIds.length > 0,
    refetchInterval: 5000, // Refetch every 5 seconds to keep unread counts updated
  });
};
