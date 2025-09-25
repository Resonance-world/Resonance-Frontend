import {useQuery} from "@tanstack/react-query";

const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5050/'

export const useGetAllUsers = (currentUserId?: string) => {
    return useQuery({
        queryKey: ['get-all-users', currentUserId],
        queryFn: () => fetch(`${apiUrl}/api/users/all`, {
            headers: {
                'ngrok-skip-browser-warning': 'true'
            }
        }).then((res) => res.json()),
        enabled: Boolean(currentUserId),
    })
}