import { AxiosInstance } from '@/api/axios/axios';

export interface UserMatch {
  id: string;
  question: string;
  category: string;
  user: string;
  userProfile: {
    id: string;
    name: string;
    username: string;
    profilePictureUrl?: string;
    personalitySummary?: string;
  };
  status: 'PENDING' | 'CONFIRMED' | 'DECLINED' | 'EXPIRED';
  userAccepted: boolean;
  otherUserAccepted: boolean;
  relationshipId?: string;
  compatibilityScore: number;
  deployedAt: string;
}

export interface MatchAcceptanceResult {
  success: boolean;
  matchStatus: 'PENDING' | 'CONFIRMED' | 'DECLINED' | 'EXPIRED';
  relationshipId?: string;
  message: string;
}

export interface MatchStatusResponse {
  matchId: string;
  isConfirmed: boolean;
  status: 'PENDING' | 'CONFIRMED' | 'DECLINED' | 'EXPIRED';
}

class MatchService {
  /**
   * Get user's matches with status
   */
  async getUserMatches(userId: string): Promise<UserMatch[]> {
    try {
      console.log('🔍 Getting user matches for:', userId);
      const response = await AxiosInstance.get(`/api/matches?userId=${userId}`);
      console.log('✅ User matches retrieved successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error getting user matches:', error);
      throw error;
    }
  }

  /**
   * Accept match
   */
  async acceptMatch(matchId: string, userId: string): Promise<MatchAcceptanceResult> {
    try {
      console.log('🔍 Accepting match:', matchId, 'for user:', userId);
      const response = await AxiosInstance.post(`/api/matches/${matchId}/accept`, {
        userId
      });
      console.log('✅ Match accepted successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error accepting match:', error);
      throw error;
    }
  }

  /**
   * Decline match
   */
  async declineMatch(matchId: string, userId: string): Promise<{ success: boolean; message: string }> {
    try {
      console.log('🔍 Declining match:', matchId, 'for user:', userId);
      const response = await AxiosInstance.post(`/api/matches/${matchId}/decline`, {
        userId
      });
      console.log('✅ Match declined successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error declining match:', error);
      throw error;
    }
  }

  /**
   * Check match status
   */
  async getMatchStatus(matchId: string, userId: string): Promise<MatchStatusResponse> {
    try {
      console.log('🔍 Checking match status for:', matchId);
      const response = await AxiosInstance.get(`/api/matches/status/${matchId}?userId=${userId}`);
      console.log('✅ Match status retrieved successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error checking match status:', error);
      throw error;
    }
  }
}

export const matchService = new MatchService();
