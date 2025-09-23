import {useQuery} from "@tanstack/react-query";

export const getMessagesQueryKey = 'get-messages'
const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5050'

export const useGetMessagesByConversation = (id: string, userId?: string) => {
    console.log('🔍 Hook Debug - id:', id, 'userId:', userId, 'enabled:', Boolean(id && userId));

    return useQuery({
        queryKey: [getMessagesQueryKey, id, userId],
        queryFn: async () => {
            console.log('🔍 queryFn executing - fetching from:', `${apiUrl}/api/messages/get-conv-messages/${id}?userId=${userId}`);
            try {
                const response = await fetch(`${apiUrl}/api/messages/get-conv-messages/${id}?userId=${userId}`);
                console.log('🔍 Response status:', response.status);
                console.log('🔍 Response ok:', response.ok);
                const data = await response.json();
                console.log('🔍 Response data:', data);
                return data;
            } catch (error) {
                console.error('🔍 Fetch error:', error);
                throw error;
            }
        },
        enabled: Boolean(id && userId),
    })
}
