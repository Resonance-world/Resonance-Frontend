import { useQuery } from '@tanstack/react-query';

interface ExpiredMatch {
  id: string;
  question: string;
  category: string;
  user: string;
  userProfile: {
    id: string;
    name: string;
    username: string;
    profilePictureUrl: string;
    personalitySummary: string;
  };
  status: string;
  userAccepted: boolean;
  otherUserAccepted: boolean;
  relationshipId?: string;
  compatibilityScore: number;
  deployedAt: string;
  expiredAt: string;
}

export const useExpiredMatches = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['expiredMatches', userId],
    queryFn: async (): Promise<ExpiredMatch[]> => {
      if (!userId) return [];
      
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5050';
      const response = await fetch(`${backendUrl}/api/matches/expired?userId=${userId}`, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Cache-Control': 'max-age=300' // Cache for 5 minutes
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch expired matches');
      }
      
      return response.json();
    },
    enabled: !!userId,
    staleTime: 300000, // Consider data stale after 5 minutes
    refetchOnWindowFocus: false,
    retry: 1,
    retryDelay: 1000,
  });
};
