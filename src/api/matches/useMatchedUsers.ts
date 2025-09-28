import { useQuery } from "@tanstack/react-query";
import { AxiosInstance } from '@/api/axios/axios';

export const useMatchedUsers = (currentUserId?: string) => {
    return useQuery({
        queryKey: ['matched-users', currentUserId],
        queryFn: () => AxiosInstance.get(`/api/matches/matched-users?userId=${currentUserId}`).then((res) => res.data),
        enabled: Boolean(currentUserId),
    })
}
