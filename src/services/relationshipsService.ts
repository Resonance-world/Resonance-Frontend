import { AxiosInstance } from '@/api/axios/axios';

export interface Relationship {
  id: string;
  relationLevel: 'PUBLIC' | 'PRIVATE';
  relatingUserId: string;
  relatedUserId: string;
  relatingUser: {
    id: string;
    name: string;
    username: string;
    profilePictureUrl?: string;
  };
  relatedUser: {
    id: string;
    name: string;
    username: string;
    profilePictureUrl?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface RelationshipsResponse {
  success: boolean;
  relationships: Relationship[];
}

export interface GardenAccessResponse {
  success: boolean;
  canAccess: boolean;
  currentUserId: string;
  gardenOwnerId: string;
}

class RelationshipsService {
  /**
   * Add user to private circle
   */
  async addToPrivateCircle(relatedUserId: string, currentUserId: string): Promise<{ success: boolean; relationship: Relationship }> {
    try {
      console.log('🔍 Adding user to private circle:', relatedUserId);
      const response = await AxiosInstance.post('/api/relationships/add-to-private', {
        relatedUserId,
        userId: currentUserId
      });
      console.log('✅ User added to private circle successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error adding user to private circle:', error);
      throw error;
    }
  }

  /**
   * Remove user from private circle
   */
  async removeFromPrivateCircle(relatedUserId: string, currentUserId: string): Promise<{ success: boolean; relationship: Relationship }> {
    try {
      console.log('🔍 Removing user from private circle:', relatedUserId);
      const response = await AxiosInstance.post('/api/relationships/remove-from-private', {
        relatedUserId,
        userId: currentUserId
      });
      console.log('✅ User removed from private circle successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error removing user from private circle:', error);
      throw error;
    }
  }

  /**
   * Get user's private relationships
   */
  async getPrivateRelationships(currentUserId: string): Promise<RelationshipsResponse> {
    try {
      console.log('🔍 Getting private relationships');
      const response = await AxiosInstance.get(`/api/relationships/private-relationships?userId=${currentUserId}`);
      console.log('✅ Private relationships retrieved successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error getting private relationships:', error);
      throw error;
    }
  }

  /**
   * Check if user can access someone's private garden
   */
  async canAccessPrivateGarden(gardenOwnerId: string, currentUserId: string): Promise<GardenAccessResponse> {
    try {
      console.log('🔍 Checking garden access for:', gardenOwnerId);
      const response = await AxiosInstance.get(`/api/relationships/can-access-private-garden/${gardenOwnerId}?userId=${currentUserId}`);
      console.log('✅ Garden access check completed:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error checking garden access:', error);
      throw error;
    }
  }
}

export const relationshipsService = new RelationshipsService();
