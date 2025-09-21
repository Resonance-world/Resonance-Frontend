export interface CircleProfile {
  id: string;
  name: string;
  profileImage: string;
  lastActivity: Date;
  conversationId?: string;
  hasUnreadMessages?: boolean;
  isOnline?: boolean;
  mutualInterests?: string[];
}

export interface Circle {
  id: string;
  name: string;
  type: 'all' | 'friendship' | 'collaborators' | 'custom';
  profiles: CircleProfile[];
  color?: string;
}

// Mock data for development - Only Tessa conversation for testing
export const MOCK_CIRCLES: Circle[] = [
  {
    id: 'all',
    name: 'All',
    type: 'all',
    profiles: [
      // Only mockup conversation with Tessa - real users will be fetched from API
      {
        id: 'profile-tessa',
        name: 'Tessa',
        profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
        lastActivity: new Date('2025-01-15T10:30:00'),
        conversationId: 'conv-1',
        hasUnreadMessages: true,
        isOnline: false
      }
    ]
  },
  {
    id: 'friendship',
    name: 'Friendship',
    type: 'friendship',
    profiles: [
      // Only Tessa has a conversation
      {
        id: 'profile-tessa',
        name: 'Tessa', 
        profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
        lastActivity: new Date('2025-01-15T10:30:00'),
        conversationId: 'conv-1',
        hasUnreadMessages: true
      }
    ]
  },
  {
    id: 'collaborators',
    name: 'Collaborators',
    type: 'collaborators', 
    profiles: [
      // Real users will be fetched from API and added here
    ]
  }
];

export const NOTIFICATION_INDICATOR = '⚠️'; 