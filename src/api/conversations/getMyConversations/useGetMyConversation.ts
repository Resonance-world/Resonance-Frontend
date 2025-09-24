import {useQuery} from "@tanstack/react-query";

export const getMyConversationsQueryKey = 'get-messages'

const apiUrl = process.env.API_URL || 'http://localhost:5050'
export const useGetMyConversations = (id: string) => {
    return useQuery({
        queryKey: ['get-my-conversations', id],
        queryFn: () => fetch(`${apiUrl}/api/messages/conversations/${id}`).then((res) => res.json()),
        enabled: Boolean(id),
    })
}
