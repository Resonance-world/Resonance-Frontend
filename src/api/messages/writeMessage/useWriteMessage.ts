import {useMutation} from "@tanstack/react-query";
import {AxiosInstance} from "@/api/axios/axios";
import {AxiosError} from "axios";

export const useWriteMessage = (refetch?: () => void) => {
    return useMutation({
        mutationFn: async (payload: { receiverId: string; content: string; userId: string }) => {

            console.log('📤 Sending message to:', AxiosInstance.defaults.baseURL + "/api/messages/send");
            console.log('📤 Payload:', payload);
            return AxiosInstance.post("/api/messages/send", payload);
        },
        onSuccess: (response) => {
            console.log('✅ Message sent successfully:', response.data);
            // Refetch to ensure message appears (WebSocket might not always work)
            if (refetch) {
                console.log('🔄 Triggering refetch after message send...');
                refetch();
            }
        },
        onError: (error: AxiosError) => {
            console.error('❌ Message send failed:', error);
            console.error('❌ Error details:', {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                url: error.config?.url,
                baseURL: error.config?.baseURL
            });
        }
    });
}
