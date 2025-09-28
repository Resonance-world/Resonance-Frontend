import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { matchService, UserMatch, MatchAcceptanceResult } from '@/services/matchService';

export const useMatches = (userId: string, enablePolling: boolean = true) => {
  return useQuery({
    queryKey: ['matches', userId],
    queryFn: () => matchService.getUserMatches(userId),
    enabled: !!userId,
    refetchInterval: enablePolling ? 60000 : false, // Poll every 60 seconds instead of 30
    staleTime: 30000, // Consider data stale after 30 seconds
    refetchOnWindowFocus: false, // Don't refetch when window gains focus
    refetchOnReconnect: true, // Refetch when reconnecting
  });
};

export const useAcceptMatch = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ matchId, userId }: { matchId: string; userId: string }) =>
      matchService.acceptMatch(matchId, userId),
    onSuccess: (data: MatchAcceptanceResult, variables) => {
      // Invalidate matches query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['matches', variables.userId] });
      
      // Show success message
      console.log('✅ Match accepted:', data.message);
      
      // If match is confirmed, we could show a success notification
      if (data.matchStatus === 'CONFIRMED') {
        console.log('🎉 Match confirmed! Relationship created:', data.relationshipId);
      }
    },
    onError: (error) => {
      console.error('❌ Failed to accept match:', error);
    },
  });
};

export const useDeclineMatch = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ matchId, userId }: { matchId: string; userId: string }) =>
      matchService.declineMatch(matchId, userId),
    onSuccess: (data, variables) => {
      // Invalidate matches query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['matches', variables.userId] });
      
      console.log('✅ Match declined:', data.message);
    },
    onError: (error) => {
      console.error('❌ Failed to decline match:', error);
    },
  });
};

export const useMatchStatus = (matchId: string, userId: string, enablePolling: boolean = true) => {
  return useQuery({
    queryKey: ['matchStatus', matchId, userId],
    queryFn: () => matchService.getMatchStatus(matchId, userId),
    enabled: !!matchId && !!userId,
    refetchInterval: enablePolling ? 15000 : false, // Only poll if enabled
    staleTime: 30000, // Consider data stale after 30 seconds
    refetchOnWindowFocus: false, // Don't refetch when window gains focus
  });
};
