import { CircleProfile } from '@/types/circles';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5050';

export interface BackendUser {
  id: string;
  username: string;
  profilePictureUrl: string | null;
  isVerified: boolean;
  lastActiveAt: string;
  name: string | null;
  zodiacSign: string | null;
  essenceKeywords: string | null;
  communicationTone: string | null;
  motivationForConnection: string | null;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  username: string;
  profilePictureUrl: string | null;
  isVerified: boolean;
  lastActiveAt: string;
  name: string | null;
  zodiacSign: string | null;
  essenceKeywords: string | null;
  communicationTone: string | null;
  motivationForConnection: string | null;
  personalitySummary: string | null;
  telegramHandle: string | null;
  instagramHandle: string | null;
  baseFarcasterHandle: string | null;
  zoraHandle: string | null;
  linkedinHandle: string | null;
  xHandle: string | null;
  websiteUrl: string | null;
  createdAt: string;
}

// Convert backend user to circle profile
export const convertToCircleProfile = (user: BackendUser): CircleProfile => {
  console.log('🔄 convertToCircleProfile: Converting user:', user);
  
  const circleProfile = {
    id: user.id,
    name: user.name || user.username,
    profileImage: user.profilePictureUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    lastActivity: new Date(user.lastActiveAt),
    hasUnreadMessages: false, // Default to false, will be updated based on conversation status
    isOnline: false // Default to false, will be updated based on real-time status
  };
  
  console.log('✅ convertToCircleProfile: Converted to:', circleProfile);
  return circleProfile;
};

// Fetch all users from backend
export const fetchAllUsers = async (): Promise<BackendUser[]> => {
  try {
    console.log('🔄 Fetching users from:', `${BACKEND_URL}/api/users/all`);
    const response = await fetch(`${BACKEND_URL}/api/users/all`, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    });
    
    console.log('📡 Response status:', response.status);
    console.log('📡 Response ok:', response.ok);
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }
    
    // Check if response has content
    const contentType = response.headers.get('content-type');
    console.log('📡 Content-Type:', contentType);
    
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.log('📡 Non-JSON response:', text);
      throw new Error('Response is not JSON');
    }
    
    const data = await response.json();
    console.log('📡 Response data:', data);
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch users');
    }
    
    console.log('✅ Users fetched successfully:', data.users.length);
    return data.users;
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    throw error;
  }
};

// Fetch user profile by ID
export const fetchUserProfile = async (userId: string): Promise<UserProfile> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/users/${userId}`, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch user profile: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch user profile');
    }
    
    return data.user;
  } catch (error) {
    console.error('❌ Error fetching user profile:', error);
    throw error;
  }
};

// Fetch users and convert to circle profiles
export const fetchCircleProfiles = async (currentUserId?: string): Promise<CircleProfile[]> => {
  try {
    console.log('🔄 fetchCircleProfiles: Starting to fetch users...');
    const users = await fetchAllUsers();
    console.log('🔄 fetchCircleProfiles: Users fetched, converting to circle profiles...', users);
    
    // Filter out the current user if provided
    const filteredUsers = currentUserId 
      ? users.filter(user => user.id !== currentUserId)
      : users;
    
    console.log('🔄 fetchCircleProfiles: Filtered users (excluding current user):', filteredUsers);
    
    const circleProfiles = filteredUsers.map(convertToCircleProfile);
    console.log('✅ fetchCircleProfiles: Converted to circle profiles:', circleProfiles);
    
    return circleProfiles;
  } catch (error) {
    console.error('❌ Error fetching circle profiles:', error);
    // Return empty array on error to prevent crashes
    return [];
  }
};
