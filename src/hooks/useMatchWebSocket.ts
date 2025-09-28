import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { io, Socket } from 'socket.io-client';

export const useMatchWebSocket = (userId: string) => {
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!userId) return;

    // Connect to WebSocket
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5050';
    socketRef.current = io(backendUrl, {
      query: { userId },
      transports: ['websocket'],
    });

    const socket = socketRef.current;

    // Listen for match status changes
    socket.on('match_status_changed', (data: { matchId: string; status: string; userId: string }) => {
      console.log('🔔 Match status changed:', data);
      console.log('🔔 Current user ID:', userId);
      console.log('🔔 Event user ID:', data.userId);
      
      // Update cache directly instead of invalidating (truly independent)
      queryClient.setQueryData(['matches', data.userId], (oldData: any[] | undefined) => {
        if (!oldData) {
          console.log('🔔 No existing matches data for user:', data.userId);
          return oldData;
        }
        
        console.log('🔔 Current matches count:', oldData.length);
        
        // If match is declined, remove it from the list
        if (data.status === 'DECLINED') {
          const filteredMatches = oldData.filter(match => match.id !== data.matchId);
          console.log('🔔 Removed declined match, new count:', filteredMatches.length);
          return filteredMatches;
        }
        
        // Otherwise, update the match status
        return oldData.map(match => 
          match.id === data.matchId 
            ? { ...match, status: data.status }
            : match
        );
      });
      
      // Update specific match status query
      queryClient.setQueryData(['matchStatus', data.matchId, data.userId], {
        matchId: data.matchId,
        status: data.status,
        userId: data.userId
      });
    });

    // Listen for match confirmations
    socket.on('match_confirmed', (data: { matchId: string; relationshipId: string; userId: string }) => {
      console.log('🎉 Match confirmed!', data);
      
      // Update cache directly with confirmed match data
      queryClient.setQueryData(['matches', data.userId], (oldData: any[] | undefined) => {
        if (!oldData) return oldData;
        return oldData.map(match => 
          match.id === data.matchId 
            ? { 
                ...match, 
                status: 'CONFIRMED',
                relationshipId: data.relationshipId,
                userAccepted: true,
                otherUserAccepted: true
              }
            : match
        );
      });
      
      // Update specific match status query
      queryClient.setQueryData(['matchStatus', data.matchId, data.userId], {
        matchId: data.matchId,
        status: 'CONFIRMED',
        userId: data.userId,
        relationshipId: data.relationshipId
      });
      
      // Show success notification (you could integrate with a toast library here)
      console.log('✅ Match confirmed! You can now start chatting.');
    });

    // Listen for new matches
    socket.on('new_match_available', (data: { userId: string; matchId: string; matchData?: any }) => {
      console.log('🆕 New match available:', data);
      
      // If we have the match data, add it directly to cache
      if (data.matchData) {
        queryClient.setQueryData(['matches', data.userId], (oldData: any[] | undefined) => {
          if (!oldData) return [data.matchData];
          // Check if match already exists to avoid duplicates
          const exists = oldData.some(match => match.id === data.matchId);
          return exists ? oldData : [...oldData, data.matchData];
        });
      } else {
        // Fallback: invalidate query to fetch new data
        queryClient.invalidateQueries({ queryKey: ['matches', data.userId] });
      }
    });

    // Handle connection events
    socket.on('connect', () => {
      console.log('🔌 Connected to match WebSocket');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('🔌 Disconnected from match WebSocket');
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('❌ WebSocket connection error:', error);
      setIsConnected(false);
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [userId, queryClient]);

  // Return socket instance and connection status
  return {
    socket: socketRef.current,
    isConnected
  };
};
