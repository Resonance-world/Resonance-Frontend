import {useQuery} from "@tanstack/react-query";

export const getUserQueryKey = 'get-user-by-id'
const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5050/'

export const useGetUserById = (id: string) => {

    return useQuery({
        queryKey: [getUserQueryKey, id],
        queryFn: async () => {
            try {
                const response = await fetch(`${apiUrl}/api/users/${id}`,{
                    headers: {
                        'ngrok-skip-browser-warning': 'true',
                        'Cache-Control': 'max-age=300' // 5 minutes cache
                    }
                });
                const data = await response.json();
                return data;
            } catch (error) {
                throw error;
            }
        },
        enabled: Boolean(id),
        staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
        gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    })
}