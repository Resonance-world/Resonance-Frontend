import { Session } from 'next-auth';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface UserProfile {
  id: string;
  walletAddress: string;
  username: string | null;
  profilePictureUrl: string | null;
  isVerified: boolean;
  verificationLevel: string | null;
  nullifierHash: string | null;
  isActive: boolean;
  onboardingCompleted: boolean;
  onboardingCompletedAt: string | null;
  currentAvailability: string;
  lastActiveAt: string;
  totalMatchesMade: number;
  successfulConnections: number;
  name: string | null;
  dateOfBirth: string | null;
  zodiacSign: string | null;
  sex: string | null;
  locationCountry: string | null;
  locationCity: string | null;
  locationLat: number | null;
  locationLng: number | null;
  surroundingDetail: string | null;
  essenceKeywords: string | null;
  essenceStory: string | null;
  communicationTone: string | null;
  motivationForConnection: string | null;
  currentCuriosity: string | null;
  personalitySummary: string | null;
  telegramHandle: string | null;
  instagramHandle: string | null;
  baseFarcasterHandle: string | null;
  zoraHandle: string | null;
  linkedinHandle: string | null;
  xHandle: string | null;
  websiteUrl: string | null;
  annoyIndexPosition: number | null;
  essenceEmbeddingUpdatedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileData {
  username?: string;
  profilePictureUrl?: string;
  currentAvailability?: string;
  locationCountry?: string;
  locationCity?: string;
  locationLat?: number;
  locationLng?: number;
  telegramHandle?: string;
  instagramHandle?: string;
  baseFarcasterHandle?: string;
  zoraHandle?: string;
  linkedinHandle?: string;
  xHandle?: string;
  websiteUrl?: string;
}

export interface UserSearchResult {
  id: string;
  walletAddress: string;
  username: string | null;
  profilePictureUrl: string | null;
  isVerified: boolean;
}

class UserService {
  private async makeRequest(endpoint: string, options: RequestInit = {}, userId: string) {
    const url = `${BACKEND_URL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
        ...options.headers,
      },
      // Add userId as query parameter for session-based auth
      ...(options.method === 'GET' 
        ? { 
            // For GET requests, add userId to URL
            ...options,
            // Override the URL to include userId
          }
        : {
            // For other requests, add userId to body
            ...options,
            body: options.body 
              ? JSON.stringify({ ...JSON.parse(options.body as string), userId })
              : JSON.stringify({ userId })
          }
      )
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async getProfile(session: Session): Promise<UserProfile> {
    if (!session?.user?.id) {
      throw new Error('User not authenticated');
    }

    const result = await this.makeRequest(
      `/api/users/profile?userId=${session.user.id}`,
      { method: 'GET' },
      session.user.id
    );

    return result.user;
  }

  async updateProfile(session: Session, data: UpdateProfileData): Promise<UserProfile> {
    if (!session?.user?.id) {
      throw new Error('User not authenticated');
    }

    const result = await this.makeRequest(
      '/api/users/profile',
      {
        method: 'PUT',
        body: JSON.stringify(data)
      },
      session.user.id
    );

    return result.user;
  }

  async getUserById(userId: string): Promise<UserProfile> {
    const result = await this.makeRequest(
      `/api/users/${userId}`,
      { method: 'GET' },
      userId
    );

    return result.user;
  }

  async getUserByWallet(walletAddress: string): Promise<UserProfile> {
    const response = await fetch(`${BACKEND_URL}/api/users/wallet/${walletAddress}`, {
      headers: {
        'ngrok-skip-browser-warning': 'true',
      }
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    const result = await response.json();
    return result.user;
  }

  async searchUsers(session: Session, query: string): Promise<UserSearchResult[]> {
    if (!session?.user?.id) {
      throw new Error('User not authenticated');
    }

    const result = await this.makeRequest(
      `/api/users/search?query=${encodeURIComponent(query)}&userId=${session.user.id}`,
      { method: 'GET' },
      session.user.id
    );

    return result.users;
  }
}

export const userService = new UserService();
